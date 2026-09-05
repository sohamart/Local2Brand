import { dataStore } from '../config/dataAdapter.js';
import { generateChatResponseWithFallback, getProviderStatus } from '../utils/aiFallbackService.js';
import {
  sendAdminCallbackAlert,
  sendCallbackConfirmationEmail,
  sendRequirementConfirmationEmail,
  sendAdminRequirementAlert
} from '../utils/email.js';
import { generateRequirementId } from './requirementController.js';
import mongoose from 'mongoose';

/**
 * Handle incoming conversational chat message with AI fallback & smart direct actions
 * POST /api/chat
 */
export const handleChatMessage = async (req, res) => {
  try {
    let { message, messages: messagesArray, sessionId: clientSessionId } = req.body;

    if (!message && Array.isArray(messagesArray) && messagesArray.length > 0) {
      const lastUser = [...messagesArray].reverse().find(m => m.role === 'user');
      message = lastUser?.content || messagesArray[messagesArray.length - 1]?.content;
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A non-empty message string is required.',
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        success: false,
        message: 'Message length exceeds maximum allowed limit (4000 characters).',
      });
    }

    const sessionId = clientSessionId || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const clientMeta = {
      ip: req.ip || req.headers['x-forwarded-for'] || '',
      userAgent: req.headers['user-agent'] || '',
    };

    // Load or initialize chat session from MongoDB / data adapter
    const session = await dataStore.getOrCreateChatSession(sessionId, userId, clientMeta);

    // Prepare message thread for AI
    const pastMessages = (session.messages || []).slice(-12).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const currentMsg = {
      role: 'user',
      content: message.trim(),
    };

    const aiInput = [...pastMessages, currentMsg];

    let settings = {};
    let services = [];
    let demos = [];

    try {
      if (typeof dataStore.getSettings === 'function') {
        settings = (await dataStore.getSettings()) || {};
      }
    } catch (e) {
      console.warn('Chat context (settings) notice:', e.message);
    }

    try {
      if (typeof dataStore.getServices === 'function') {
        services = (await dataStore.getServices()) || [];
      }
    } catch (e) {
      console.warn('Chat context (services) notice:', e.message);
    }

    try {
      if (typeof dataStore.getDemos === 'function') {
        demos = (await dataStore.getDemos()) || [];
      }
    } catch (e) {
      console.warn('Chat context (demos) notice:', e.message);
    }

    // Construct safe showable user profile
    const currentUser = req.user
      ? {
          name: req.user.name || '',
          email: req.user.email || '',
          phone: req.user.phone || '',
          company: req.user.company || '',
          role: req.user.role || 'user',
        }
      : (req.body.userContext && (req.body.userContext.email || req.body.userContext.name))
      ? {
          name: req.body.userContext.name || '',
          email: req.body.userContext.email || '',
          phone: req.body.userContext.phone || '',
          company: req.body.userContext.company || '',
          role: req.body.userContext.role || 'user',
        }
      : null;

    // Invoke Multi-Provider Fallback
    let aiResponse = await generateChatResponseWithFallback(aiInput, {
      settings,
      currentUser,
      activeServices: services,
      activeDemos: demos,
    });

    // Helper function to intelligently parse project order parameters from conversation thread
    const extractOrderDetailsFromThread = (threadMessages, userProfile) => {
      const allText = threadMessages.map((m) => m.content || '').join('\n');

      // 1. Phone number (strictly 10-12 digits)
      const pMatch = allText.match(/(?:\+?91[\s-]?)?[6-9]\d{9}/) || allText.match(/\b[6-9]\d{9}\b/);
      const phone = pMatch ? pMatch[0].replace(/[\s-+]/g, '').slice(-10) : (userProfile?.phone || '');

      // 2. Email address
      const eMatch = allText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
      const email = eMatch ? eMatch[0].toLowerCase() : (userProfile?.email || '');

      // 3. Client Name
      let name = userProfile?.name || '';
      if (!name || name === 'Valued Client') {
        const nMatch = allText.match(/(?:name|naam|নাম|owner|client|I am|Ami|আমার নাম)\s*(?::|is|hocche|-)?\s*([A-Za-z\u0980-\u09FF\s]{2,30})/i);
        if (nMatch && nMatch[1]) {
          const candidate = nMatch[1].trim().split(/\n|,|\./)[0].trim();
          if (candidate && candidate.length > 2 && !/^(website|cafe|restaurant|shop|order|phone|email|confirm|yes|ok)$/i.test(candidate)) {
            name = candidate;
          }
        }
      }
      if (!name) name = 'Valued Client';

      // 4. Business / Brand Name
      let businessName = userProfile?.company || '';
      const bMatch = allText.match(/(?:business|brand|company|shop|store|cafe|restaurant|clinic|hotel|ব্যবসা|দোকান|ব্র্যান্ড|কোম্পানি|নাম)\s*(?:name|naam|er naam|er name)?\s*(?::|is|hocche|-)?\s*([A-Za-z0-9\u0980-\u09FF\s&'-]{2,50})/i);
      if (bMatch && bMatch[1]) {
        const candidate = bMatch[1].trim().split(/\n|,|\./)[0].trim();
        if (candidate && candidate.length > 2 && !/^(website|phone|email|order|confirm|yes|ok|chai|banabo)$/i.test(candidate)) {
          businessName = candidate;
        }
      }
      if (!businessName) {
        businessName = name !== 'Valued Client' ? `${name}'s Website Project` : 'Custom Client Project';
      }

      // 5. Website Type & Category
      let websiteTypeName = 'Custom Business Website';
      let websiteType = 'custom_business';
      if (/restaurant|cafe|food|dining|biryani|রেস্টুরেন্ট|ক্যাফে|খাবার/i.test(allText)) {
        websiteTypeName = 'Restaurant & Cafe Website';
        websiteType = 'restaurant_cafe';
      } else if (/ecommerce|shop|store|boutique|clothing|shopping|ই-কমার্স|দোকান|কেনাকাটা/i.test(allText)) {
        websiteTypeName = 'E-Commerce & Online Store';
        websiteType = 'ecommerce_store';
      } else if (/salon|spa|beauty|parlour|সিলন|পার্লার/i.test(allText)) {
        websiteTypeName = 'Salon, Spa & Beauty Booking';
        websiteType = 'salon_spa';
      } else if (/clinic|doctor|dental|hospital|health|ডাক্তার|হাসপাতাল|ক্লিনিক/i.test(allText)) {
        websiteTypeName = 'Medical Clinic & Doctor Portal';
        websiteType = 'healthcare_clinic';
      } else if (/hotel|resort|homestay|travel|হোটেল|রিসোর্ট/i.test(allText)) {
        websiteTypeName = 'Hotel & Homestay Booking Website';
        websiteType = 'hotel_hospitality';
      } else if (/coaching|lms|course|tuition|academy|টিচিং|কোচিং|কোর্স/i.test(allText)) {
        websiteTypeName = 'LMS & Coaching Academy Portal';
        websiteType = 'lms_education';
      } else if (/portfolio|agency|photographer|creative|পোর্টফোলিও/i.test(allText)) {
        websiteTypeName = 'Creative Portfolio & Agency Website';
        websiteType = 'portfolio_agency';
      }

      // 6. Selected Features
      const selectedFeatures = [];
      if (/whatsapp|হোয়াটসঅ্যাপ/i.test(allText)) selectedFeatures.push('WhatsApp Direct Ordering & Inquiries');
      if (/payment|razorpay|upi|qr|পেমেন্ট/i.test(allText)) selectedFeatures.push('Online Payment Gateway & QR Integration');
      if (/booking|appointment|বুকিং/i.test(allText)) selectedFeatures.push('Instant Appointment & Booking System');
      if (/gallery|photo|ছবি/i.test(allText)) selectedFeatures.push('HD Photo & Portfolio Gallery');
      selectedFeatures.push('Mobile Responsive UX', 'Free Cloudflare SSL', 'Custom Domain Setup', 'Fast 48h Delivery');

      // 7. Timeline & Budget
      let timeline = '⚡ Express (48 - 72 Hours)';
      if (/express|48\s*h|48\s*hours|urgent|তাড়াতাড়ি|জরুরি/i.test(allText)) {
        timeline = '⚡ Express (48 Hours Guaranteed)';
      } else if (/standard|3-5|7\s*days/i.test(allText)) {
        timeline = 'Standard Sprint (3 - 5 Days)';
      }

      let budget = '₹9,999 / $399 (Starter Tier with 20% OFF Code INDIA2025)';
      const bgMatch = allText.match(/(?:budget|price|দাম|টাকা)\s*(?::|is|হলো|-)?\s*([₹$0-9,\s-]+)/i);
      if (bgMatch && bgMatch[1]) {
        budget = bgMatch[1].trim();
      }

      return {
        phone,
        email,
        name,
        businessName,
        websiteType,
        websiteTypeName,
        selectedFeatures,
        timeline,
        budget,
        notes: allText.slice(-600).trim(),
      };
    };

    // Extract captured ordering details across the whole conversation
    const capturedOrder = extractOrderDetailsFromThread(aiInput, currentUser);
    const isConfirmIntent = /\b(confirm|confirmed|yes|yep|yeah|sure|proceed|ok|okay|done|accept|ha|haan|korun|koro|thik ache|hobe|হ্যাঁ|কনফার্ম|করুন|ঠিক আছে|হবে)\b/i.test(message);
    const hasOrderIntent = /requirement|order|website|app|build|banate|chai|dorkar|create|develop|রেস্টুরেন্ট|ক্যাফে|অর্ডার|বানাবো/i.test(message) || isConfirmIntent;

    let callbackCreated = false;
    let requirementCreated = false;
    let createdRequirementId = null;
    let orderCardData = null;

    let detectedPhone = capturedOrder.phone || (phoneMatch ? phoneMatch[0].replace(/[\s-]/g, '') : (currentUser?.phone || ''));
    let detectedEmail = capturedOrder.email || (emailMatch ? emailMatch[0].toLowerCase() : (currentUser?.email || ''));
    let detectedName = capturedOrder.name || currentUser?.name || 'Valued Client';
    const isBengali = /[\u0980-\u09FF]/.test(message);

    // Strict validation to prevent premature order creation:
    // 1. Must have concrete business name (not placeholder)
    // 2. Must have explicit website category
    // 3. Must have verified client owner name
    // 4. Must have valid 10-digit phone number
    // 5. Must have valid client email
    // 6. Must have explicit final order confirmation intent in response to an order review
    const isExplicitOrderPlacement = /\b(place\s*order|submit\s*order|confirm\s*order|book\s*order|confirm\s*project|order\s*confirm|অর্ডার\s*কনফার্ম|অর্ডার\s*বুক|প্রজেক্ট\s*কনফার্ম|বুক\s*করুন)\b/i.test(message) ||
      (isConfirmIntent && capturedOrder.businessName && capturedOrder.businessName !== 'Custom Client Project' && capturedOrder.websiteType && capturedOrder.phone && capturedOrder.email && (session.messages || []).some(m => m.content && (m.content.includes('Order Review') || m.content.includes('Business Name') || m.content.includes('Shall I confirm') || m.content.includes('ব্যবসার নাম'))));

    const hasAllMandatoryOrderFields = Boolean(
      capturedOrder.businessName &&
      capturedOrder.businessName !== 'Custom Client Project' &&
      capturedOrder.businessName.length >= 3 &&
      capturedOrder.websiteType &&
      detectedPhone &&
      detectedPhone.length >= 10 &&
      detectedEmail &&
      detectedEmail.includes('@') &&
      detectedName &&
      detectedName !== 'Valued Client'
    );

    // Finalize and Confirm Requirement ONLY when all mandatory details are collected and user explicitly confirms
    if (
      !alreadyHasOrderInSession &&
      hasAllMandatoryOrderFields &&
      isExplicitOrderPlacement
    ) {
      try {
        const reqId = generateRequirementId();
        const { default: Requirement } = await import('../models/Requirement.js');

        const validUserId = userId && mongoose.Types.ObjectId.isValid(userId) ? userId : null;

        const reqPayload = {
          requirementId: reqId,
          websiteType: capturedOrder.websiteType || 'custom_business',
          websiteTypeName: capturedOrder.websiteTypeName || 'Custom Business Website',
          clientInfo: {
            businessName: capturedOrder.businessName,
            ownerName: detectedName,
            mobile: detectedPhone,
            email: detectedEmail || `${detectedPhone}@client.local2brand.com`,
          },
          selectedFeatures: capturedOrder.selectedFeatures,
          timeline: capturedOrder.timeline,
          budget: capturedOrder.budget,
          additionalNotes: `Auto-submitted via AI Chatbot Session ${sessionId}. Order Details: Business: "${capturedOrder.businessName}", Type: "${capturedOrder.websiteTypeName}", Features: "${capturedOrder.selectedFeatures.join(', ')}", Client Summary: "${capturedOrder.notes}"`,
          status: 'Submitted',
          user: validUserId,
          submittedAt: new Date(),
        };

        let reqDoc;
        if (mongoose.connection.readyState === 1) {
          reqDoc = await Requirement.create(reqPayload);
        } else {
          reqDoc = dataStore.create('requirements', reqPayload);
        }

        createdRequirementId = reqId;
        requirementCreated = true;
        orderCardData = {
          requirementId: reqId,
          businessName: capturedOrder.businessName,
          websiteTypeName: capturedOrder.websiteTypeName,
          ownerName: detectedName,
          mobile: detectedPhone,
          email: detectedEmail,
          timeline: capturedOrder.timeline,
          budget: capturedOrder.budget,
          status: 'Submitted',
        };

        // Dispatch alerts & emails directly to the submitter's verified email
        sendAdminRequirementAlert(reqDoc).catch((err) => console.warn('AI chat admin requirement alert error:', err.message));
        if (detectedEmail) {
          sendRequirementConfirmationEmail(reqDoc).catch((err) => console.warn('AI chat client requirement email error:', err.message));
        }

        dataStore.createNotification({
          title: `New AI Chat Project Order (${reqId})`,
          message: `${detectedName} confirmed order for ${capturedOrder.businessName} (${detectedPhone})`,
          type: 'requirement',
          link: '/admin/requirements',
        }).catch((err) => console.warn('Notification error:', err.message));

        const orderBanner = isBengali
          ? `\n\n---\n🎉 **আপনার প্রজেক্ট অর্ডার সফলভাবে কনফার্ম হয়েছে!**\n- 🏢 **ব্যবসার নাম:** ${capturedOrder.businessName}\n- 🌐 **ওয়েবসাইটের ধরণ:** ${capturedOrder.websiteTypeName}\n- 👤 **ক্লায়েন্ট:** ${detectedName}\n- 📱 **ফোন:** ${detectedPhone}\n- ✉️ **ইমেল:** ${detectedEmail || 'N/A'}\n- ⏱️ **টাইমলাইন:** ${capturedOrder.timeline}\n- 📦 **Order ID:** \`${reqId}\`\n\nফাউন্ডার ও ইঞ্জিনিয়ারিং ডেস্কে লাইভ অ্যালার্ট পাঠানো হয়েছে। আপনি আপনার ক্লায়েন্ট ড্যাশবোর্ড থেকে এই Order ID দিয়ে সরাসরি লাইভ প্রোগ্রেস ট্র্যাক করতে পারবেন! 🚀`
          : `\n\n---\n🎉 **Your Project Order is Confirmed & Registered!**\n- 🏢 **Business Name:** ${capturedOrder.businessName}\n- 🌐 **Website Type:** ${capturedOrder.websiteTypeName}\n- 👤 **Client Name:** ${detectedName}\n- 📱 **Mobile:** ${detectedPhone}\n- ✉️ **Email:** ${detectedEmail || 'N/A'}\n- ⏱️ **Timeline:** ${capturedOrder.timeline}\n- 📦 **Order ID:** \`${reqId}\`\n\nLive sprint alert dispatched to our senior tech leads. You can track progress in real-time in your Client Portal using your Order ID! 🚀`;

        aiResponse.text += orderBanner;
      } catch (reqErr) {
        console.warn('AI chat requirement create notice:', reqErr.message);
      }
    }

    // 3. Smart Order Tracking Query Handler in AI Chat
    const orderIdRegex = /\b(REQ-\d{4}-\d{4,6}|REQ-[A-Za-z0-9-]+)\b/i;
    const orderIdMatch = message.match(orderIdRegex);
    const trackingQueryIntent = /track|tracking|status|order\s*id|order\s*status|progress|kotota\s*hoyeche|koto\s*dur|kobe\s*pabo|order\s*kothai|ট্র্যাক|অর্ডার|স্ট্যাটাস|কতটা\s*হয়েছে/i.test(message);

    if (orderIdMatch || (trackingQueryIntent && !requirementCreated && !callbackCreated)) {
      try {
        const { default: Requirement } = await import('../models/Requirement.js');
        let matchedOrder = null;

        if (orderIdMatch) {
          const searchId = orderIdMatch[0].trim();
          if (mongoose.connection.readyState === 1) {
            matchedOrder = await Requirement.findOne({ requirementId: { $regex: new RegExp(`^${searchId}$`, 'i') } });
          } else {
            matchedOrder = dataStore.findRequirementById(searchId);
          }
        } else if (currentUser?.email || detectedEmail) {
          // If no explicit Order ID in message, check if authenticated user has existing requirements
          const userEmail = currentUser?.email || detectedEmail;
          if (mongoose.connection.readyState === 1) {
            const userOrders = await Requirement.find({
              $or: [
                { 'clientInfo.email': { $regex: new RegExp(`^${userEmail}$`, 'i') } },
                { user: userId }
              ]
            }).sort({ createdAt: -1 }).limit(3);
            if (userOrders.length === 1) {
              matchedOrder = userOrders[0];
            } else if (userOrders.length > 1) {
              const ordersListText = userOrders.map(o => `• **${o.requirementId}** (${o.clientInfo?.businessName || o.websiteTypeName}) — \`${o.status}\``).join('\n');
              const multiPrompt = isBengali
                ? `\n\n📦 **আপনার একাধিক সক্রিয় প্রজেক্ট অর্ডার রয়েছে:**\n${ordersListText}\n\nনির্দিষ্ট অর্ডারের লাইভ স্প্রিন্ট দেখতে আপনার Order ID (যেমন: \`${userOrders[0].requirementId}\`) লিখুন অথবা সরাসরি [Track Order পেজ খুলুন](/track-order?id=${userOrders[0].requirementId})।`
                : `\n\n📦 **You have multiple active project orders:**\n${ordersListText}\n\nPlease enter the specific Order ID (e.g. \`${userOrders[0].requirementId}\`) to inspect its live sprint, or [open the Track Order portal](/track-order?id=${userOrders[0].requirementId}).`;
              aiResponse.text = multiPrompt;
            }
          }
        }

        if (matchedOrder) {
          const status = matchedOrder.status || 'Submitted';
          const stageIdx = status === 'Completed' ? 5 : status === 'In Development' ? 3 : status === 'Approved' ? 3 : status === 'Quotation Sent' ? 2 : status === 'Under Review' ? 1 : 0;
          const pct = status === 'Completed' ? 100 : status === 'In Development' ? 85 : status === 'Approved' ? 75 : status === 'Quotation Sent' ? 60 : status === 'Under Review' ? 40 : 20;

          const STAGE_NAMES = [
            'Stage 01: Requirement Logged & Spec Audit',
            'Stage 02: Architecture & Scope Review',
            'Stage 03: UI/UX Wireframe & Figma Blueprint',
            'Stage 04: Rapid Full-Stack Development Sprint',
            'Stage 05: SEO, Speed Audit & SSL Testing',
            'Stage 06: Live Handover & VIP Launch'
          ];

          const stageName = STAGE_NAMES[stageIdx] || STAGE_NAMES[0];
          const bName = matchedOrder.clientInfo?.businessName || matchedOrder.websiteTypeName || 'Custom Website Project';
          const notes = matchedOrder.internalNotes ? `\n- 📝 **ইঞ্জিনিয়ারিং টিম নোট:** "${matchedOrder.internalNotes}"` : '';
          const notesEn = matchedOrder.internalNotes ? `\n- 📝 **Engineering Note:** "${matchedOrder.internalNotes}"` : '';

          const trackingReport = isBengali
            ? `\n\n---\n📦 **লাইভ প্রজেক্ট ট্র্যাকিং রিপোর্ট:**\n- **Order ID:** \`${matchedOrder.requirementId}\`\n- **প্রজেক্ট:** **${bName}** (${matchedOrder.websiteTypeName || matchedOrder.websiteType})\n- **লাইভ স্ট্যাটাস:** 🚀 **${status}** (${pct}% সম্পন্ন)\n- **বর্তমান ফেজ:** \`${stageName}\`\n- **ডেলিভারি স্প্রিন্ট:** ${matchedOrder.timeline || '⚡ Express (48 - 72 Hours)'}${notes}\n\n👉 [পুরো ৬-ধাপের লাইভ রোডম্যাপ দেখতে এখানে ক্লিক করুন 🚀](/track-order?id=${matchedOrder.requirementId})`
            : `\n\n---\n📦 **Live Project Tracking Dispatch:**\n- **Order ID:** \`${matchedOrder.requirementId}\`\n- **Project:** **${bName}** (${matchedOrder.websiteTypeName || matchedOrder.websiteType})\n- **Live Status:** 🚀 **${status}** (${pct}% Completed)\n- **Current Phase:** \`${stageName}\`\n- **Delivery Sprint:** ${matchedOrder.timeline || '⚡ Express (48 - 72 Hours)'}${notesEn}\n\n👉 [Click here to view full 6-stage interactive roadmap 🚀](/track-order?id=${matchedOrder.requirementId})`;

          aiResponse.text = trackingReport;
        } else if (orderIdMatch && !matchedOrder) {
          const notFoundText = isBengali
            ? `\n\n---\n⚠️ দুঃখিত, \`${orderIdMatch[0]}\` আইডি দিয়ে কোনো প্রজেক্ট অর্ডার পাওয়া যায়নি। অনুগ্রহ করে আপনার Order ID চেক করে সঠিক আইডি লিখুন (যেমন: \`REQ-2026-48391\`) অথবা সরাসরি [Track Order পেজে যান](/track-order)।`
            : `\n\n---\n⚠️ Sorry, no project order was found matching \`${orderIdMatch[0]}\`. Please check your Order ID (e.g. \`REQ-2026-48391\`) or visit our [Track Order Portal](/track-order).`;
          aiResponse.text = notFoundText;
        } else if (trackingQueryIntent && !matchedOrder && !aiResponse.text.includes('Order ID')) {
          const askIdText = isBengali
            ? `\n\n---\n🔍 **আপনার প্রজেক্টের লাইভ স্ট্যাটাস ট্র্যাক করতে আপনার Order ID বলুন:**\nঅনুগ্রহ করে আপনার \`REQ-2026-XXXXX\` ফরম্যাটের Order ID লিখুন, আমি এখনই আমাদের সিস্টেম চেক করে আপনার লাইভ স্প্রিন্ট প্রগ্রেস ও ডেলিভারি স্ট্যাটাস জানিয়ে দেব! অথবা সরাসরি [Track Order পেজ দেখতে পারেন](/track-order)।`
            : `\n\n---\n🔍 **To track your project live, please provide your Order ID:**\nPlease share your Order ID (e.g. \`REQ-2026-XXXXX\`), and I will instantly look up the engineering sprint milestones and delivery timeline! Or you can directly visit our [Track Order Gateway](/track-order).`;
          aiResponse.text += askIdText;
        }
      } catch (trackErr) {
        console.warn('AI chat order tracking lookup notice:', trackErr.message);
      }
    }

    const userMessageDoc = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    const assistantMessageDoc = {
      role: 'assistant',
      content: aiResponse.text,
      provider: aiResponse.provider || 'unknown',
      model: aiResponse.model || '',
      timestamp: new Date(),
    };

    // Save turn to database session
    await dataStore.appendChatMessages(sessionId, [userMessageDoc, assistantMessageDoc]);

    return res.status(200).json({
      success: true,
      message: aiResponse.text,
      provider: aiResponse.provider,
      model: aiResponse.model,
      sessionId,
      callbackCreated,
      callbackPhone: detectedPhone || null,
      requirementCreated,
      requirementId: createdRequirementId || null,
      orderCard: orderCardData || null,
      timestamp: assistantMessageDoc.timestamp,
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process chat message. Please try again in a moment.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Fetch Chat History for a session
 * GET /api/chat/history?sessionId=...
 */
export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(200).json({
        success: true,
        sessionId: null,
        messages: [],
      });
    }

    const userId = req.user ? (req.user._id || req.user.id) : null;
    const session = await dataStore.getOrCreateChatSession(sessionId, userId);

    return res.status(200).json({
      success: true,
      sessionId,
      messages: session.messages || [],
    });
  } catch (error) {
    console.error('Fetch chat history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving chat history',
    });
  }
};

/**
 * Clear Chat History for a session
 * DELETE /api/chat/history
 */
export const clearChatHistory = async (req, res) => {
  try {
    const sessionId = req.body?.sessionId || req.query?.sessionId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required to clear chat history',
      });
    }

    await dataStore.clearChatSession(sessionId);

    return res.status(200).json({
      success: true,
      message: 'Chat history cleared successfully',
      sessionId,
    });
  } catch (error) {
    console.error('Clear chat history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error clearing chat history',
    });
  }
};

/**
 * Get AI Provider Health & Status
 * GET /api/chat/status
 */
export const getChatStatus = async (req, res) => {
  try {
    const status = getProviderStatus();
    return res.status(200).json({
      success: true,
      status: 'operational',
      providers: status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching chat provider status',
    });
  }
};
