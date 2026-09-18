/**
 * Multi-Tier AI Provider Fallback Service for LOCAL2BRAND
 * Fallback Chain: Groq -> Gemini -> Cerebras -> OpenRouter -> Resilient Engine
 */

const REQUEST_TIMEOUT_MS = 7000;

/**
 * Builds dynamic, context-rich system prompt with:
 * 1. Live Site Settings & Pricing
 * 2. Admin Custom Business Knowledge & Custom Instructions
 * 3. Admin Showable Details (Contact, Founders, Office, Hours)
 * 4. Currently Logged-in User Profile Context
 * 5. Available Services / Demos summary
 */
export function buildDynamicSystemPrompt({
  settings = {},
  currentUser = null,
  activeServices = [],
  activeDemos = [],
} = {}) {
  const brandName = settings.brandName || 'LOCAL2BRAND';
  const domain = settings.domain || 'local2brand.com';
  const tagline = settings.tagline || 'Build Local. Think Global.';
  const startingPriceInr = settings.startingPriceInr || '₹9,999';
  const startingPriceUsd = settings.startingPriceUsd || '$399';
  const turnaroundTime = settings.turnaroundTime || '48 Hours';
  const announcementText = settings.announcementBar?.text || 'Get 20% OFF with code INDIA2025';

  const aiSettings = settings.aiSettings || {};
  const customInstructions = aiSettings.customInstructions || '';
  const businessKnowledge = aiSettings.businessKnowledge || '';
  const adminDetails = aiSettings.adminShowableDetails || {};

  // Build User Context block with strict role boundary
  let userContextBlock = '';
  const isVerifiedAdmin = Boolean(currentUser?.isAdmin || currentUser?.role === 'admin' || currentUser?.role === 'superadmin');
  const isVerifiedClient = Boolean(currentUser && (currentUser.name || currentUser.email) && !isVerifiedAdmin);

  if (isVerifiedAdmin) {
    userContextBlock = `
========================================
CURRENT CONVERSATION PARTNER (VERIFIED MASTER ADMINISTRATOR):
- User Name: ${currentUser.name || 'System Admin'}
- Email Address: ${currentUser.email || 'N/A'}
- Account Role: ${currentUser.role || 'admin'} (VERIFIED PLATFORM ADMINISTRATOR)
- Status: Authenticated Master Admin
Instructions for this Administrator:
- This is a verified platform administrator. Greet them respectfully by name ("${currentUser.name || 'Admin'}").
- Provide administrative assistance or system overviews when requested.
========================================`;
  } else if (isVerifiedClient) {
    userContextBlock = `
========================================
CURRENT CONVERSATION PARTNER (REGISTERED CLIENT / CUSTOMER):
- Client Name: ${currentUser.name || 'Valued Client'}
- Email Address: ${currentUser.email || 'N/A'}
- Phone Number: ${currentUser.phone || 'N/A'}
- Company / Brand: ${currentUser.company || 'Independent'}
- Account Role: ${currentUser.role || 'user'} (CLIENT / REGISTERED USER)
- Status: Logged-in Customer
⚠️ CRITICAL IDENTITY & PRIVACY RULES FOR THIS CLIENT:
- Even if this client's name (${currentUser.name}) is identical or similar to a founder's name (such as "Soham" or "Sayantan"), they are a CLIENT/CUSTOMER browsing or ordering on our platform, NOT the owner/founder/admin of ${brandName}!
- Treat them strictly and respectfully as a valued CLIENT/CUSTOMER. Address them by their first name ("${currentUser.name}").
- Help them with their client projects, website orders, inquiries, demos, or support.
- NEVER treat them as the founder, boss, or creator of ${brandName}. NEVER say "Welcome Boss/Founder" or share internal admin-only information.
========================================`;
  } else {
    userContextBlock = `
========================================
CURRENT CONVERSATION PARTNER:
- Status: Guest / Visitor (Not logged in)
⚠️ CRITICAL IDENTITY & PRIVACY RULES FOR GUEST:
- The user is an anonymous guest / visitor.
- Even if they state "I am Soham", "I am the founder", or type any greeting, treat them as a prospective client / visitor.
- NEVER assume or call a guest the founder/owner/admin.
- Greet warmly, ask how you can help build or design their website or digital brand.
========================================`;
  }

  // Build Dynamic Founders Information
  let foundersBlock = '';
  const foundersList = Array.isArray(adminDetails.founders) ? adminDetails.founders : [];
  const founderCount = adminDetails.founderCount || foundersList.length || 1;
  const showFounders = adminDetails.showFoundersToAi ?? true;
  const officialSupportEmail = adminDetails.contactEmail || settings.supportEmail || 'local2brand.contact@gmail.com';

  if (showFounders && foundersList.length > 0) {
    const formattedFounders = foundersList
      .filter((f) => f && f.name)
      .map((f, i) => {
        const parts = [
          `  * Founder #${i + 1}: ${f.name}`,
          `Role: ${f.role || (i === 0 ? 'Founder & Lead Architect' : 'Co-Founder')}`,
        ];
        if (f.bio) parts.push(`Bio: ${f.bio}`);
        if (f.instagram) parts.push(`Instagram Profile: ${f.instagram}`);
        if (f.linkedin) parts.push(`LinkedIn: ${f.linkedin}`);
        if (f.email) parts.push(`Personal/Direct Email: ${f.email}`);
        if (f.phone) parts.push(`Direct Mobile: ${f.phone}`);
        return parts.join(' | ');
      })
      .join('\n');

    foundersBlock = `- Total Founders / Leadership Count: ${founderCount}
- Verified Founders & Co-Founders Directory (KEEP DETAILS STRICTLY SEPARATED PER PERSON):
${formattedFounders}`;
  } else {
    foundersBlock = `- Core Leadership / Boss: ${adminDetails.founderName || 'Soham Dutta (Founder & Lead Architect) & Founding Team'}`;
  }

  // Build Admin & Company Showable Details block
  const adminShowableBlock = `
========================================
OFFICIAL COMPANY, FOUNDERS & CONTACT DETAILS:
- Brand Name: ${brandName} (${domain})
- Tagline: ${tagline}
${foundersBlock}
- Official Verified Contact & Support Email: ${officialSupportEmail}
- Official Public Phone: ${adminDetails.contactPhone || settings.displayPhone || '+91 87100 43923'}
- Official Public WhatsApp: ${adminDetails.whatsappSupport || '+91 87100 43923'}
- Official Instagram: ${adminDetails.instagramHandle || settings.socialLinks?.instagramHandle || '@local2brand'} (${adminDetails.instagram || settings.socialLinks?.instagram || 'https://instagram.com/local2brand'})
- Official LinkedIn: ${settings.socialLinks?.linkedin || 'https://linkedin.com/company/local2brand'}
- Office / HQ: ${adminDetails.officeLocation || 'Kolkata & Bangalore, India'}
- Working Hours: ${adminDetails.workingHours || 'Monday - Saturday: 10:00 AM - 8:00 PM IST'}
========================================`;

  // Build Services & Demos preview summary if provided
  let servicesBlock = '';
  if (Array.isArray(activeServices) && activeServices.length > 0) {
    const serviceNames = activeServices.slice(0, 8).map((s) => `${s.title || s.name} (${s.category || 'Web'})`).join(', ');
    servicesBlock = `\n- Featured Active Services: ${serviceNames}`;
  }

  let demosBlock = '';
  if (Array.isArray(activeDemos) && activeDemos.length > 0) {
    const demoTitles = activeDemos.slice(0, 8).map((d) => `${d.title || d.name} (${d.category || 'Template'})`).join(', ');
    demosBlock = `\n- Popular Ready-Made Templates: ${demoTitles}`;
  }

  return `You are the official AI Assistant, Senior Brand Consultant, and Full-Stack Architect for "${brandName}" (${domain}) — India's premier fast-track web experience engine and digital product agency.

${adminShowableBlock}
${userContextBlock}

========================================
CORE OFFERINGS & PACKAGES:
1. Ready-to-Launch Marketplace Templates:
   - Starting from ${startingPriceInr} / ${startingPriceUsd}.
   - Handover in as fast as ${turnaroundTime} with full branding, logo integration, copywriting, and media customization.
2. Bespoke Custom Development:
   - High-converting custom UI/UX, e-commerce stores, SaaS dashboards, booking engines, and portals tailored from scratch.
3. Active Promo Code & Deals:
   - Promo Code "INDIA2025": Gives an instant 20% DISCOUNT + Free SSL certificate + Free custom domain setup.
   - Live Announcement: "${announcementText}"
4. Direct Actions You Can Perform:
   - "Instant Callback": If the user provides a phone number or asks for a call, our backend auto-registers an instant callback request and alerts the founders (${officialSupportEmail}).
   - "Step-by-Step Project Order Intake": When a client wants to build a website or place an order, systematically guide them step-by-step through requirements gathering, summarize their details, and confirm the order with their exact specifications!
   - Official Verified Email: ${officialSupportEmail}${servicesBlock}${demosBlock}
========================================

========================================
STEP-BY-STEP ORDER TAKING & CONFIRMATION PROTOCOL:
When a client expresses interest in building a website, ordering a package, or starting a project (e.g. "I want to build a website", "website banate chai", "order korte chai", "need a site for my cafe"):

Follow this polite, professional step-by-step workflow:
1. **Step 1 - Business & Project Type**: Ask for their **Business / Brand Name** and **Industry / Domain** (e.g., Cafe, E-Commerce, Dental Clinic, Agency, Portfolio).
2. **Step 2 - Features & Requirements**: Ask what specific features they need (e.g., WhatsApp direct ordering, Online payment gateway, Booking calendar, Product catalog, Custom domain & SSL).
3. **Step 3 - Contact Verification**: Request their **Full Name**, **10-Digit Mobile Number**, and **Email Address** (Note: If they are logged in, address them by name and verify their email/phone).
4. **Step 4 - Package & Timeline Selection**: Mention our fast-track packages (starting from ${startingPriceInr}, ${turnaroundTime} express delivery, 20% discount code "INDIA2025").
5. **Step 5 - Order Summary & Final Confirmation**:
   - Present a neat, formatted Order Review with the EXACT user-provided details:
     * 🏢 **Business Name**: [Captured Name]
     * 🌐 **Website Type**: [Selected Category]
     * ✨ **Key Features**: [Captured Features]
     * 👤 **Client Name**: [User Name]
     * 📱 **Mobile**: [10-Digit Number]
     * ✉️ **Email**: [User Email]
     * ⏱️ **Timeline**: ⚡ 48-Hour Express
     * 💰 **Package/Pricing**: Starting from ${startingPriceInr} (Promo "INDIA2025" Applied)
   - Ask for confirmation: *"Shall I confirm and register your website project order with these details?"* / *"আপনি কি এই তথ্য দিয়ে অর্ডারটি কনফার্ম করতে চান?"*

6. **Order Finalization**:
   - When the user confirms ("Yes", "Confirm", "হ্যাঁ", "করুন", "ok", "proceed", "haan"), celebrate and inform them that their order has been officially registered with their exact specifications, and our engineering desk has commenced the sprint!
========================================

${businessKnowledge ? `========================================\nADMIN CUSTOM BUSINESS KNOWLEDGE BASE:\n${businessKnowledge}\n========================================\n` : ''}
${customInstructions ? `========================================\nADMIN CUSTOM INSTRUCTIONS & DIRECTIVES:\n${customInstructions}\n========================================\n` : ''}

CRITICAL OPERATIONAL & COMMUNICATION RULES:
1. User Identity & Role Boundaries (STRICT ANTI-CONFUSION RULE):
   - ALWAYS verify the user's role from the conversation context above:
     * Guest / Visitor: Prospective client. Greet warmly and offer website consulting.
     * Logged-in Client: Greet by name (${currentUser?.name || 'Client'}) as a valued customer. If their name is "Soham" or matches a founder, they are STILL A CLIENT/CUSTOMER using the site. Never treat them as the agency founder/owner/admin!
     * Verified Admin: ONLY users with verified "Account Role: admin / superadmin" are administrators.
   - When a user says "Hi", "Hello", "Hey", "নমস্কার", "কেমন আছেন", or simple greetings:
     * DO NOT dump the founders' directory, bio, phone, or company internal info unsolicited!
     * Greet them warmly and politely, asking how LOCAL2BRAND can assist with their website or digital project today.
   - ONLY provide founder details when the user explicitly asks a question about who founded the company, who the owners/architects are, or requests founders' contact links.
2. Step-by-Step Clarity: Do NOT overwhelm the user with a massive form in one go unless they provide everything at once. Ask sequentially and build the order profile step by step.
3. Founders & Leadership Identity (STRICT NO-MIXUP RULE):
   - When anyone asks "who is your boss?", "who is the owner?", "founder ke?", "founder details ki?", "co-founder ke?", or requests Instagram/emails/phone numbers, consult the Verified Founders Directory above.
   - NEVER MIX UP one founder's Instagram handle, email, or phone number with another founder.
   - For Soham Dutta: state Soham Dutta's exact role, bio, and Instagram (@sohamart).
   - For Sayantan Ghosh: state Sayantan Ghosh's exact role, bio, and Instagram (@sayantan_ghosh).
   - If asked about all founders, list each person on their own distinct bullet point.
4. Email Integrity: ALWAYS use "${officialSupportEmail}" as the single official contact & support email.
5. Complete, Crisp & Structured (পরিপূর্ণ, স্পষ্ট ও পরিপাটি): Always provide complete responses. Never stop midway. Use 2-4 clean bullet points and bold key details.
6. User Awareness: If the user is logged in, you MUST know and acknowledge their details (name, email, role) when asked.
7. Multilingual Fluency: If the user communicates in Bengali (বাংলা / বাংলিশ), reply in sweet, clean, and concise Bengali. If in English, reply in crisp, professional English.
8. Privacy & Security: NEVER reveal internal database connection strings, JWT secrets, passwords, or server environment variables.
9. Action-Oriented: Always offer clear next steps (e.g. promo code INDIA2025, 15-minute callback request, or viewing live demo templates).`;
}

// Fetch helper with timeout
async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 1. Groq Provider (Ultra-Fast & Reliable)
 */
async function callGroq(messages, systemPrompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const configuredModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const modelsToTry = Array.from(new Set([
    configuredModel,
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768'
  ]));

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const url = 'https://api.groq.com/openai/v1/chat/completions';
      const payload = {
        model,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 2048,
      };

      const res = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errMessage = errorData?.error?.message || `HTTP ${res.status} ${res.statusText}`;
        lastError = new Error(`Groq Error (${res.status}): ${errMessage}`);
        if (res.status === 404 || errMessage.includes('does not exist') || errMessage.includes('decommissioned')) {
          continue;
        }
        throw lastError;
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error('Groq returned an empty response');
      }

      return {
        text: text.trim(),
        provider: 'Groq',
        model,
      };
    } catch (err) {
      lastError = err;
      if (err.message.includes('404') || err.message.includes('does not exist') || err.message.includes('decommissioned')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All Groq model candidates failed');
}

/**
 * 2. Google Gemini Provider
 */
async function callGemini(messages, systemPrompt) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const configuredModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const modelsToTry = Array.from(new Set([
    configuredModel,
    'gemini-1.5-flash',
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-1.5-pro'
  ]));

  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const payload = {
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  };

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errMessage = errorData?.error?.message || `HTTP ${res.status} ${res.statusText}`;
        lastError = new Error(`Gemini Error (${res.status}): ${errMessage}`);
        if (res.status === 404 || errMessage.includes('is not found') || errMessage.includes('no longer available')) {
          continue;
        }
        throw lastError;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Gemini returned an empty response');
      }

      return {
        text: text.trim(),
        provider: 'Gemini',
        model,
      };
    } catch (err) {
      lastError = err;
      if (err.message.includes('404') || err.message.includes('not found') || err.message.includes('no longer available')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All Gemini model candidates failed');
}

/**
 * 3. Cerebras Provider
 */
async function callCerebras(messages, systemPrompt) {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    throw new Error('CEREBRAS_API_KEY is not configured');
  }

  const configuredModel = process.env.CEREBRAS_MODEL || 'llama3.1-8b';
  const modelsToTry = Array.from(new Set([configuredModel, 'llama3.1-8b', 'llama-3.3-70b']));

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const url = 'https://api.cerebras.ai/v1/chat/completions';
      const payload = {
        model,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 2048,
      };

      const res = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errMessage = errorData?.error?.message || `HTTP ${res.status} ${res.statusText}`;
        lastError = new Error(`Cerebras Error (${res.status}): ${errMessage}`);
        if (res.status === 404 || errMessage.includes('not found')) {
          continue;
        }
        throw lastError;
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error('Cerebras returned an empty response');
      }

      return {
        text: text.trim(),
        provider: 'Cerebras',
        model,
      };
    } catch (err) {
      lastError = err;
      if (err.message.includes('404') || err.message.includes('not found')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All Cerebras model candidates failed');
}

/**
 * 4. OpenRouter Provider
 */
async function callOpenRouter(messages, systemPrompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const configuredModel = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct';
  const modelsToTry = Array.from(new Set([
    configuredModel,
    'meta-llama/llama-3.3-70b-instruct',
    'mistralai/mistral-small-3.1-24b-instruct:free',
    'google/gemini-2.0-flash-exp:free'
  ]));

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const url = 'https://openrouter.ai/api/v1/chat/completions';
      const payload = {
        model,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 2048,
      };

      const res = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errMessage = errorData?.error?.message || `HTTP ${res.status} ${res.statusText}`;
        lastError = new Error(`OpenRouter Error (${res.status}): ${errMessage}`);
        if (res.status === 404 || errMessage.includes('not found')) {
          continue;
        }
        throw lastError;
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error('OpenRouter returned an empty response');
      }

      return {
        text: text.trim(),
        provider: 'OpenRouter',
        model,
      };
    } catch (err) {
      lastError = err;
      if (err.message.includes('404') || err.message.includes('not found')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All OpenRouter model candidates failed');
}

/**
 * 5. Resilient Local Rule-based Consultant Engine (Guaranteed zero-failure fallback)
 */
function generateLocalConsultantResponse(messages, contextOptions = {}) {
  const brandName = contextOptions.settings?.brandName || 'LOCAL2BRAND';
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  const lowerMsg = lastUserMsg.toLowerCase();
  const userName = contextOptions.currentUser?.name ? ` ${contextOptions.currentUser.name}` : '';

  const adminDetails = contextOptions.settings?.aiSettings?.adminShowableDetails || {};
  const supportEmail = adminDetails.contactEmail || contextOptions.settings?.supportEmail || 'local2brand.contact@gmail.com';
  const phone = adminDetails.contactPhone || contextOptions.settings?.displayPhone || '+91 87100 43923';
  const whatsapp = adminDetails.whatsappSupport || '+91 87100 43923';
  const founders = Array.isArray(adminDetails.founders) && adminDetails.founders.length > 0
    ? adminDetails.founders
    : [{ name: 'Soham Dutta', role: 'Founder & Lead Architect', email: 'local2brand.contact@gmail.com', phone: '+91 87100 43923', instagram: 'https://instagram.com/sohamart' }];

  const formattedFoundersBn = founders.map((f, i) => `- 👤 **${f.name}** (${f.role || (i === 0 ? 'Founder & Lead Architect' : 'Co-Founder')})${f.instagram ? ` • 📷 Instagram: ${f.instagram}` : ''}${f.email ? ` • ✉️ Email: \`${f.email}\`` : ''}${f.phone ? ` • 📱 Phone: ${f.phone}` : ''}`).join('\n');
  const formattedFoundersEn = founders.map((f, i) => `- 👤 **${f.name}** (${f.role || (i === 0 ? 'Founder & Lead Architect' : 'Co-Founder')})${f.instagram ? ` • 📷 Instagram: ${f.instagram}` : ''}${f.email ? ` • ✉️ Email: \`${f.email}\`` : ''}${f.phone ? ` • 📱 Phone: ${f.phone}` : ''}`).join('\n');

  // Bengali Detection
  const isBengali = /[\u0980-\u09FF]/.test(lastUserMsg) || /kemon|ki|lagbe|koto|kore|hobe|dorkar|valo|bhalo|bhai|taka|ke|boss|founder|owner|naam|nam/i.test(lastUserMsg);

  // Precise intent matching
  const isGreeting = /^(hi|hello|hey|hola|namaste|nomoshkar|নমস্কার|কেমন আছেন|kemon acho|ki khobor|good morning|good evening|good afternoon|hlw|hlo)[\s!.]*$/i.test(lowerMsg.trim()) ||
    /^(hi|hello|hey|নমস্কার)\s+([a-zA-Z\u0980-\u09FF]+)[\s!.]*$/i.test(lowerMsg.trim());

  const isFounderQuery = /(?:who\s+(?:is|are)\s+(?:the\s+)?(?:boss|founder|co-founder|owner|creator|leader|architect|ceo|team)|founder\s*(?:ke|kara|details|name|info|der|list)|koto\s*jon\s*founder|ke\s*banieche|who\s+made\s+this|who\s+owns|company\s*owner|malik\s*ke)/i.test(lowerMsg);

  const isContactQuery = /(?:email|mail|contact|phone|number|jogajog|thikana|address|reach|whatsapp|call)/i.test(lowerMsg) && !isGreeting && !isFounderQuery;

  const isPricingQuery = /(?:pricing|price|cost|khoroch|taka|dam|package|প্যাকেজ|খরচ|দাম|টাকা|how much|tier|rate)/i.test(lowerMsg);

  // Bengali Responses
  if (isBengali) {
    if (isGreeting) {
      return {
        text: `নমস্কার${userName}! 🚀 **${brandName}** এআই কনসালটেন্ট হিসেবে আপনাকে স্বাগতম। আজ আপনার ব্যবসা বা ব্র্যান্ডের জন্য ওয়েবসাইট তৈরিতে কীভাবে সাহায্য করতে পারি?\n\n- ⚡ **Starter ওয়েবসাইট**: মাত্র **${contextOptions.settings?.startingPriceInr || '₹9,999'}** (৪৮ ঘণ্টার মধ্যে ডেলিভারি)\n- 🎁 **২০% স্পেশাল লঞ্চ অফার**: প্রোমোকোড \`INDIA2025\` ব্যবহার করুন\n- 💬 আপনি আপনার ব্যবসার ধরন জানালে আমি সেরা লাইভ ডেমো ও ফিচার সাজেস্ট করতে পারি!`,
        provider: 'L2B Smart Consultant',
        model: 'bengali-expert-v2'
      };
    }

    if (isFounderQuery) {
      return {
        text: `নমস্কার${userName}! 🚀 **${brandName}**-এর প্রতিষ্ঠাতা ও লিডারশিপ টিম:\n\n${formattedFoundersBn}\n\n- 📧 **অফিশিয়াল সাপোর্ট ইমেইল**: \`${supportEmail}\`\n- 📞 **ফোন / WhatsApp**: \`${whatsapp}\`\n- 📍 **অফিস**: ${adminDetails.officeLocation || 'Kolkata & Bangalore, India'}\n\nআপনি চাইলে সরাসরি আমাদের টিম বা ইঞ্জিনিয়ারদের সাথে আলোচনার জন্য ইনস্ট্যান্ট কল রিকোয়েস্ট দিতে পারেন!`,
        provider: 'L2B Smart Consultant',
        model: 'bengali-expert-v2'
      };
    }

    if (isContactQuery) {
      return {
        text: `নমস্কার${userName}! 🚀 **${brandName}**-এর ভেরিফাইড যোগাযোগের মাধ্যম:\n\n- ✉️ **অফিশিয়াল যোগাযোগ ইমেইল**: \`${supportEmail}\`\n- 📞 **কলিং ও WhatsApp**: \`${phone}\`\n- 📍 **অফিস / হাব**: ${adminDetails.officeLocation || 'Kolkata & Bangalore, India'}\n- ⏰ **কাজের সময়**: ${adminDetails.workingHours || 'Monday - Saturday: 10:00 AM - 8:00 PM IST'}`,
        provider: 'L2B Smart Consultant',
        model: 'bengali-expert-v2'
      };
    }

    if (isPricingQuery) {
      return {
        text: `নমস্কার${userName}! 🚀 **${brandName}**-এ আপনাকে স্বাগতম।\n\nআমাদের ওয়েবসাইট প্যাকেজ ও মূল্য তালিকা:\n- ⚡ **Starter (৪৮ ঘণ্টা রেডি ওয়েবসাইট)**: **${contextOptions.settings?.startingPriceInr || '₹9,999'}** / **${contextOptions.settings?.startingPriceUsd || '$399'}**\n- 💼 **Professional (ফুল কাস্টম UI/UX + WhatsApp Shop)**: **₹24,999**\n- 💎 **Enterprise (কাস্টম ওয়েব অ্যাপ ও পোর্টাল)**: কাস্টম কোটেশন\n\n🎁 **স্পেশাল লঞ্চ অফার**: \`INDIA2025\` কোড ব্যবহার করলে পাবেন ফ্ল্যাট **20% ছাড়** + ফ্রি ডোমেন ও SSL!`,
        provider: 'L2B Smart Consultant',
        model: 'bengali-expert-v2'
      };
    }

    return {
      text: `নমস্কার${userName}! 🚀 **${brandName}** এআই কনসালটেন্ট হিসেবে আমি আপনাকে সাহায্য করতে প্রস্তুত।\n\n- ⚡ **৪৮ ঘণ্টার দ্রুত ডেলিভারি**: ডেমো ওয়েবসাইট শুরু মাত্র **${contextOptions.settings?.startingPriceInr || '₹9,999'}** থেকে।\n- 🎁 **২০% ডিসকাউন্ট**: প্রোমোকোড \`INDIA2025\` ব্যবহার করুন।\n- 📞 **সরাসরি কল রিকোয়েস্ট**: আপনার ফোন নম্বর দিলে আমাদের ইঞ্জিনিয়াররা ১৫ মিনিটের মধ্যে যোগাযোগ করবেন।\n\nআপনার ব্যবসার ধরন বা চাহিদা সম্পর্কে জানান!`,
      provider: 'L2B Smart Consultant',
      model: 'bengali-expert-v2'
    };
  }

  // English Responses
  if (isGreeting) {
    return {
      text: `Hello${userName}! 🚀 Welcome to **${brandName}** — your fast-track web experience engine. How can I assist you with your website project today?\n\n- ⚡ **48-Hour Delivery**: Starter websites from **${contextOptions.settings?.startingPriceInr || '₹9,999'} / ${contextOptions.settings?.startingPriceUsd || '$399'}**\n- 🎁 **Launch Offer**: Use code \`INDIA2025\` for an instant **20% DISCOUNT** + Free SSL & Domain\n- 💬 Tell me about your business or requirements to get started!`,
      provider: 'L2B Smart Consultant',
      model: 'enterprise-v2'
    };
  }

  if (isFounderQuery) {
    return {
      text: `Hello${userName}! 🚀 Here are the founders & leadership team behind **${brandName}**:\n\n${formattedFoundersEn}\n\n- 📧 **Official Support Email**: \`${supportEmail}\`\n- 📞 **Phone / WhatsApp**: \`${whatsapp}\`\n- 📍 **HQ Location**: ${adminDetails.officeLocation || 'Kolkata & Bangalore, India'}\n\nFeel free to schedule a direct consultation call with our team anytime!`,
      provider: 'L2B Smart Consultant',
      model: 'enterprise-v2'
    };
  }

  if (isContactQuery) {
    return {
      text: `Hello${userName}! 🚀 Here are the official verified contact details for **${brandName}**:\n\n- ✉️ **Contact & Support Email**: \`${supportEmail}\`\n- 📞 **Calling & WhatsApp**: \`${phone}\`\n- 📍 **HQ Hub**: ${adminDetails.officeLocation || 'Kolkata & Bangalore, India'}\n- ⏰ **Operating Hours**: ${adminDetails.workingHours || 'Monday - Saturday: 10:00 AM - 8:00 PM IST'}`,
      provider: 'L2B Smart Consultant',
      model: 'enterprise-v2'
    };
  }

  if (isPricingQuery) {
    return {
      text: `Hello${userName}! 🚀 Here is an overview of **${brandName}** packages:\n\n- ⚡ **Starter Package**: Starting at **${contextOptions.settings?.startingPriceInr || '₹9,999'} / ${contextOptions.settings?.startingPriceUsd || '$399'}** (48-72h launch, mobile responsive, WhatsApp orders).\n- 💼 **Professional Package**: **₹24,999** (Bespoke Glassmorphic UI, dynamic CMS, SEO).\n- 💎 **Custom Enterprise**: Full-stack SaaS, e-commerce, and advanced logic.\n\n🎁 Use promo code \`INDIA2025\` for an instant **20% DISCOUNT** + Free SSL & Domain!`,
      provider: 'L2B Smart Consultant',
      model: 'enterprise-v2'
    };
  }

  return {
    text: `Hello${userName}! 🚀 Welcome to **${brandName}** — India's fast-track web experience engine.\n\n- ⚡ **48-Hour Websites**: Demo templates start from **${contextOptions.settings?.startingPriceInr || '₹9,999'} / ${contextOptions.settings?.startingPriceUsd || '$399'}**.\n- 🎁 **Launch Offer**: Use code \`INDIA2025\` for **20% OFF** + Free SSL & Domain.\n- 📞 **Instant Callback**: Share your phone number or click **Instant Callback** to connect with our founders within 15 minutes!`,
    provider: 'L2B Smart Consultant',
    model: 'enterprise-v2'
  };
}

/**
 * Main Public Dispatcher: Multi-Provider Fallback Cascade
 */
export async function generateChatResponseWithFallback(messages, contextOptions = {}) {
  const systemPrompt = buildDynamicSystemPrompt(contextOptions);

  // Fallback Order: Groq -> Gemini -> Cerebras -> OpenRouter -> Local Smart Engine
  const providers = [
    { name: 'Groq', fn: () => callGroq(messages, systemPrompt) },
    { name: 'Gemini', fn: () => callGemini(messages, systemPrompt) },
    { name: 'Cerebras', fn: () => callCerebras(messages, systemPrompt) },
    { name: 'OpenRouter', fn: () => callOpenRouter(messages, systemPrompt) },
  ];

  for (const provider of providers) {
    try {
      const response = await provider.fn();
      if (response && response.text) {
        return response;
      }
    } catch (err) {
      console.warn(`[AI Chain Notice] Provider "${provider.name}" failed: ${err.message}. Cascading to next tier...`);
    }
  }

  // Resilient fallback if all external providers fail
  return generateLocalConsultantResponse(messages, contextOptions);
}

export function getProviderStatus() {
  return {
    groq: Boolean(process.env.GROQ_API_KEY),
    gemini: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
    cerebras: Boolean(process.env.CEREBRAS_API_KEY),
    openRouter: Boolean(process.env.OPENROUTER_API_KEY),
  };
}
