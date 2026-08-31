import { dataStore } from '../config/dataAdapter.js';
import { generateChatResponseWithFallback, getProviderStatus } from '../utils/aiFallbackService.js';
import { sendAdminCallbackAlert, sendCallbackConfirmationEmail } from '../utils/email.js';

/**
 * Handle incoming conversational chat message with AI fallback
 * POST /api/chat
 */
export const handleChatMessage = async (req, res) => {
  try {
    const { message, sessionId: clientSessionId } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A non-empty message string is required.',
      });
    }

    if (message.length > 3000) {
      return res.status(400).json({
        success: false,
        message: 'Message length exceeds maximum allowed limit (3000 characters).',
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

    // Prepare message thread for AI (take last 12 messages for relevant context)
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


    // Construct safe showable user profile (no private hashes or tokens)
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

    // Invoke Multi-Provider Fallback (Gemini -> Groq -> Cerebras -> OpenRouter) with dynamic context
    let aiResponse = await generateChatResponseWithFallback(aiInput, {
      settings,
      currentUser,
      activeServices: services,
      activeDemos: demos,
    });

    // Smart auto-detection of Phone Number or Callback intent in message
    const phoneMatch = message.match(/(?:\+?91[\s-]?)?[6-9]\d{9}/) || message.match(/\b\d{10,12}\b/);
    const emailMatch = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
    const callbackIntent = /call|phone|callback|contact|reach|যোগাযোগ|কল|ফোন|নম্বর|কথা/i.test(message);

    let callbackCreated = false;
    let detectedPhone = phoneMatch ? phoneMatch[0].replace(/[\s-]/g, '') : (currentUser?.phone || '');
    let detectedEmail = emailMatch ? emailMatch[0].toLowerCase() : (currentUser?.email || '');
    let detectedName = currentUser?.name || 'Valued Visitor';

    // If user provided a phone number OR if logged-in user says "call me"
    if (detectedPhone && (phoneMatch || callbackIntent)) {
      try {
        const callbackRecord = await dataStore.createCallback({
          name: detectedName,
          phone: detectedPhone,
          email: detectedEmail,
          preferredTime: '⚡ ASAP (Within 15-30 mins)',
          topic: 'AI Chat Auto-Detected Callback Request',
          notes: `User Message: "${message.trim()}"`,
          user: userId || null,
        });

        // Instant email alert to sohamduttabwn@gmail.com and stackaddacontact@gmail.com
        sendAdminCallbackAlert(callbackRecord).catch((err) => console.warn('Chat auto-callback alert error:', err.message));

        if (detectedEmail) {
          sendCallbackConfirmationEmail(callbackRecord).catch((err) => console.warn('Chat client confirmation email error:', err.message));
        }

        dataStore.createNotification({
          title: 'New Instant Callback from Chat',
          message: `${detectedName} requested a call via AI Chat (${detectedPhone})`,
          type: 'callback',
          link: '/admin/callbacks',
        }).catch((err) => console.warn('Admin notification error:', err.message));

        callbackCreated = true;

        // If not already in text, append clear confirmation note
        if (!aiResponse.text.includes(detectedPhone)) {
          const isBengali = /[\u0980-\u09FF]/.test(message);
          const confirmationBanner = isBengali
            ? `\n\n---\n✅ **কল-ব্যাক রিকোয়েস্ট নিশ্চিত করা হয়েছে!**\nআমাদের ফাউন্ডার ও এডমিন ডেস্কে (\`sohamduttabwn@gmail.com\` ও \`stackaddacontact@gmail.com\`) তাত্ক্ষণিক ইমেইল অ্যালার্ট পাঠানো হয়েছে। আমরা খুব শীঘ্রই আপনার নম্বরে (**${detectedPhone}**) কল করছি! 📞`
            : `\n\n---\n✅ **Instant Callback Request Registered!**\nReal-time email alerts have been dispatched to our founder & executive desk (\`sohamduttabwn@gmail.com\` & \`stackaddacontact@gmail.com\`). We will call you at **${detectedPhone}** shortly! 📞`;
          aiResponse.text += confirmationBanner;
        }
      } catch (cbErr) {
        console.warn('Chat auto-callback record notice:', cbErr.message);
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
