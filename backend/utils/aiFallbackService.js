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

  // Build User Context block
  let userContextBlock = '';
  if (currentUser && (currentUser.name || currentUser.email)) {
    userContextBlock = `
========================================
CURRENT CONVERSATION PARTNER (AUTHENTICATED MEMBER):
- User Name: ${currentUser.name || 'Valued Member'}
- Email Address: ${currentUser.email || 'N/A'}
- Phone Number: ${currentUser.phone || 'N/A'}
- Company / Brand: ${currentUser.company || 'Personal / Independent'}
- Account Role: ${currentUser.role || 'user'}
- Status: Logged-in Verified Account
Instructions for this user:
- You KNOW who this user is. Greet and address them warmly by their name ("${currentUser.name || 'Friend'}").
- If the user asks about their identity, login status, or account ("who am I?", "amar details ki?", "amake cheno?"), tell them their name (${currentUser.name}), email (${currentUser.email}), role (${currentUser.role}), and company if available.
- If they ask to submit a project or callback, confirm you can register it directly for them right now!
========================================`;
  } else {
    userContextBlock = `
========================================
CURRENT CONVERSATION PARTNER:
- Status: Guest / Visitor (Not currently logged in)
- Instructions: Greet warmly. If they share project details, business type, or phone number, assist them with our packages, instant callback, or submitting a proposal.
========================================`;
  }

  // Build Dynamic Founders Information
  let foundersBlock = '';
  const foundersList = Array.isArray(adminDetails.founders) ? adminDetails.founders : [];
  const founderCount = adminDetails.founderCount || foundersList.length || 1;
  const showFounders = adminDetails.showFoundersToAi ?? true;

  if (showFounders && foundersList.length > 0) {
    const formattedFounders = foundersList
      .filter((f) => f && f.name)
      .map((f, i) => {
        const parts = [`  ${i + 1}. ${f.name}`];
        if (f.role) parts.push(`Role: ${f.role}`);
        if (f.bio) parts.push(`Bio: ${f.bio}`);
        if (f.instagram) parts.push(`Instagram: ${f.instagram}`);
        if (f.linkedin) parts.push(`LinkedIn: ${f.linkedin}`);
        if (f.email) parts.push(`Email: ${f.email}`);
        return parts.join(' | ');
      })
      .join('\n');

    foundersBlock = `- Total Founders: ${founderCount}
- Founder Profiles & Handles:
${formattedFounders || `  - ${adminDetails.founderName || 'Soham Dutta & Core Team'}`}`;
  } else {
    foundersBlock = `- Core Leadership: ${adminDetails.founderName || 'LOCAL2BRAND Founders & Core Team'}`;
  }

  // Build Admin & Company Showable Details block
  const adminShowableBlock = `
========================================
OFFICIAL COMPANY, FOUNDERS & CONTACT DETAILS:
- Brand Name: ${brandName} (${domain})
- Tagline: ${tagline}
${foundersBlock}
- Official Support Email: ${adminDetails.contactEmail || settings.supportEmail || 'stackaddacontact@gmail.com'}
- Official Public Phone: ${adminDetails.contactPhone || settings.displayPhone || '+91 98765 43210'}
- Official Public WhatsApp: ${adminDetails.whatsappSupport || '+91 98765 43210'}
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
   - "Instant Callback": If the user provides a phone number or asks for a call, our backend auto-registers an instant callback request and alerts the founders (sohamduttabwn@gmail.com & stackaddacontact@gmail.com).
   - "Project Requirement Submission": If the user describes their project (business name, features, website type, budget) and provides phone/email, reassure them that their project order is recorded and can be tracked anytime with their Order ID in the Client Portal!
   - Contact Email: stackaddacontact@gmail.com${servicesBlock}${demosBlock}
========================================

${businessKnowledge ? `========================================\nADMIN CUSTOM BUSINESS KNOWLEDGE BASE:\n${businessKnowledge}\n========================================\n` : ''}
${customInstructions ? `========================================\nADMIN CUSTOM INSTRUCTIONS & DIRECTIVES:\n${customInstructions}\n========================================\n` : ''}

CRITICAL OPERATIONAL & COMMUNICATION RULES:
1. Complete, Crisp & Structured (পরিপূর্ণ, স্পষ্ট ও পরিপাটি): Always provide complete responses. Never stop midway. Use 2-4 clean bullet points and bold key details.
2. User Awareness: If the user is logged in, you MUST know and acknowledge their details (name, email, role) when asked.
3. Multilingual Fluency: If the user communicates in Bengali (বাংলা / বাংলিশ), reply in sweet, clean, and concise Bengali. If in English, reply in crisp, professional English.
4. Privacy & Security: NEVER reveal internal database connection strings, JWT secrets, passwords, or server environment variables.
5. Action-Oriented: Always offer clear next steps (e.g. promo code INDIA2025, 15-minute callback request, or viewing live demo templates).`;
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
    'mixtral-8x7b-32768',
    'gemma2-9b-it'
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

  // Bengali Detection
  const isBengali = /[\u0980-\u09FF]/.test(lastUserMsg) || /kemon|ki|lagbe|koto|kore|hobe|dorkar|valo|bhalo|bhai|taka/i.test(lastUserMsg);

  if (isBengali) {
    if (/pricing|price|cost|khoroch|taka|dam|package|প্যাকেজ|খরচ|দাম|টাকা/i.test(lowerMsg)) {
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
  if (/pricing|price|cost|how much|package|tier/i.test(lowerMsg)) {
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
