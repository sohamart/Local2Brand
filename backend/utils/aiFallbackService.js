/**
 * Multi-Tier AI Provider Fallback Service for LOCAL2BRAND
 * Fallback Chain: Gemini -> Groq -> Cerebras -> OpenRouter
 */

const REQUEST_TIMEOUT_MS = 25000;

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
- Treat them with VIP priority as a verified member of ${brandName}.
========================================`;
  } else {
    userContextBlock = `
========================================
CURRENT CONVERSATION PARTNER:
- Status: Guest / Visitor (Not currently logged in)
Instructions:
- Greet them warmly and assist them with discovering ${brandName} solutions, templates, pricing, and project options.
- If they ask about their account or want to track past projects, invite them to login.
========================================`;
  }

  // Build Admin & Company Showable Details block
  const adminShowableBlock = `
========================================
OFFICIAL COMPANY & SHOWABLE ADMIN DETAILS:
- Brand Name: ${brandName} (${domain})
- Tagline: ${tagline}
- Core Leadership / Team: ${adminDetails.founderName || 'LOCAL2BRAND Founders & Senior Engineering Team'}
- Official Public Phone: ${adminDetails.contactPhone || settings.displayPhone || '+91 98765 43210'}
- Official Public WhatsApp: ${adminDetails.whatsappSupport || '+91 98765 43210'}
- Official Support Email: ${adminDetails.contactEmail || settings.supportEmail || 'contact@local2brand.com'}
- Office / HQ: ${adminDetails.officeLocation || 'India (Kolkata & Bangalore Hubs)'}
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

  return `You are the official AI Assistant, Senior Brand Consultant, and Solutions Architect for "${brandName}" (${domain}) — India's premier fast-track web experience engine and digital product agency.

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
4. Website Call-to-Action Integrations:
   - "Call Request": Users can request an instant callback in under 15 minutes.
   - "Get Proposal": Interactive proposal builder for instant custom price estimation.
   - "WhatsApp Chat": Direct line to our founders and senior engineers.${servicesBlock}${demosBlock}
========================================

${businessKnowledge ? `========================================\nADMIN CUSTOM BUSINESS KNOWLEDGE BASE:\n${businessKnowledge}\n========================================\n` : ''}
${customInstructions ? `========================================\nADMIN CUSTOM INSTRUCTIONS & DIRECTIVES:\n${customInstructions}\n========================================\n` : ''}

CRITICAL OPERATIONAL & COMMUNICATION RULES:
1. Short, Crisp & Structured (ছোট কিন্তু স্পষ্ট ও পরিপাটি): Always keep your responses concise, organized, and easy to scan. Avoid huge wall-of-text paragraphs. Use 2-4 clean bullet points and bold key details.
2. User Awareness: If the user is logged in, you MUST know and acknowledge their details (name, email, role) when asked.
3. Multilingual Fluency: If the user communicates in Bengali (বাংলা), reply in sweet, clean, and concise Bengali. If in English, reply in crisp English.
4. Privacy & Security: NEVER reveal internal database connection strings, JWT secrets, passwords, or server environment variables. Only share official public showable details.
5. Business Action: Always offer quick next steps (e.g., promo code INDIA2025, 15-minute callback, or proposal builder).`;

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
 * 1. Google Gemini Provider
 */
async function callGemini(messages, systemPrompt) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const modelsToTry = Array.from(new Set([configuredModel, 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite']));

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
      maxOutputTokens: 1024,
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
        // If 404 model not found, try next candidate model
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
 * 2. Groq Provider
 */
async function callGroq(messages, systemPrompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const configuredModel = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
  const modelsToTry = Array.from(new Set([configuredModel, 'qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'qwen/qwen3.6-27b', 'llama-3.3-70b-versatile']));

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
        max_tokens: 1024,
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
 * 3. Cerebras Provider
 */
async function callCerebras(messages, systemPrompt) {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    throw new Error('CEREBRAS_API_KEY is not configured');
  }

  const configuredModel = process.env.CEREBRAS_MODEL || 'gpt-oss-120b';
  const modelsToTry = Array.from(new Set([configuredModel, 'gpt-oss-120b', 'gemma-4-31b', 'llama3.1-8b']));

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
        max_tokens: 1024,
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

  const configuredModel = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3.5-lightning:free';
  const modelsToTry = Array.from(new Set([
    configuredModel,
    'nvidia/nemotron-3.5-lightning:free',
    'z-ai/glm-5.2:free',
    'meta-llama/llama-3.3-70b-instruct'
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
        max_tokens: 1024,
      };

      const res = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://local2brand.com',
          'X-Title': 'LOCAL2BRAND Assistant',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errMessage = errorData?.error?.message || `HTTP ${res.status} ${res.statusText}`;
        lastError = new Error(`OpenRouter Error (${res.status}): ${errMessage}`);
        if (res.status === 404 || errMessage.includes('unavailable for free') || errMessage.includes('rate-limited')) {
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
      if (err.message.includes('404') || err.message.includes('unavailable') || err.message.includes('rate-limited')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All OpenRouter model candidates failed');
}


/**
 * Fallback AI Dispatcher
 * Chain: Gemini -> Groq -> Cerebras -> OpenRouter
 */
export async function generateChatResponseWithFallback(messages, contextOptions = {}) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Valid conversation messages are required');
  }

  // Build the dynamic contextual system prompt
  const systemPrompt = buildDynamicSystemPrompt(contextOptions);

  const providers = [
    { name: 'Gemini', fn: callGemini },
    { name: 'Groq', fn: callGroq },
    { name: 'Cerebras', fn: callCerebras },
    { name: 'OpenRouter', fn: callOpenRouter },
  ];

  const fallbackLogs = [];

  for (const { name, fn } of providers) {
    try {
      console.log(`🤖 [AI Chat] Attempting provider: ${name}...`);
      const result = await fn(messages, systemPrompt);
      console.log(`✅ [AI Chat] Success with ${name} (${result.model})`);
      return {
        ...result,
        fallbackHistory: fallbackLogs,
      };
    } catch (err) {
      console.warn(`⚠️ [AI Chat] ${name} failed: ${err.message}`);
      fallbackLogs.push({ provider: name, error: err.message, timestamp: new Date().toISOString() });
    }
  }

  // If all providers failed or no keys configured
  console.error('❌ [AI Chat] All AI providers exhausted or failed:', fallbackLogs);
  
  const brandName = contextOptions.settings?.brandName || 'LOCAL2BRAND';
  const userName = contextOptions.currentUser?.name ? `, ${contextOptions.currentUser.name}` : '';

  return {
    text: `Thank you for reaching out to **${brandName}**${userName}! 🚀\n\nI am currently experiencing higher-than-normal traffic, but our team is standing by to assist you immediately:\n\n- ⚡ **48-Hour Websites**: Demo templates start at **${contextOptions.settings?.startingPriceInr || '₹9,999'} / ${contextOptions.settings?.startingPriceUsd || '$399'}**.\n- 🎁 **Launch Offer**: Use code **INDIA2025** for **20% OFF** + Free SSL & Domain.\n- 📞 **Instant Callback**: Click the **Call Request** button above and our founders will connect with you in under 15 minutes!`,
    provider: `${brandName} Fallback Engine`,
    model: 'built-in-resilience',
    fallbackHistory: fallbackLogs,
    isFallbackDefault: true,
  };
}

/**
 * Check provider key configuration status (safely, without exposing secrets)
 */
export function getProviderStatus() {
  return {
    gemini: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
    groq: Boolean(process.env.GROQ_API_KEY),
    cerebras: Boolean(process.env.CEREBRAS_API_KEY),
    openrouter: Boolean(process.env.OPENROUTER_API_KEY),
    geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    cerebrasModel: process.env.CEREBRAS_MODEL || 'llama3.1-8b',
    openrouterModel: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
  };
}
