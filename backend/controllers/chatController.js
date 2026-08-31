import { dataStore } from '../config/dataAdapter.js';
import { generateChatResponseWithFallback, getProviderStatus } from '../utils/aiFallbackService.js';

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
      : null;

    // Invoke Multi-Provider Fallback (Gemini -> Groq -> Cerebras -> OpenRouter) with dynamic context
    const aiResponse = await generateChatResponseWithFallback(aiInput, {
      settings,
      currentUser,
      activeServices: services,
      activeDemos: demos,
    });


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
