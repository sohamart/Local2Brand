import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  PhoneCall,
  Zap,
  Bot,
  Send,
  RotateCcw,
  MessageSquare,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ChevronRight,
  ShieldCheck,
  Tag,
  Clock,
  Code2,
  Flame,
} from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../../utils/whatsapp';
import AshokaChakra from './AshokaChakra';

const PREMIUM_SUGGESTION_CATEGORIES = [
  { id: 'all', label: '🔥 All Questions' },
  { id: 'pricing', label: '💰 Pricing & Deals' },
  { id: 'delivery', label: '⚡ 48h Delivery' },
  { id: 'custom', label: '💎 Custom Builds' },
];

const PREMIUM_QUESTIONS = [
  {
    category: 'delivery',
    icon: '⚡',
    title: 'Can you deliver my website in 48 hours?',
    subtitle: 'How the rapid marketplace template launch works',
    prompt: 'Can you really build and launch my website in 48 hours? What is the process?',
    badge: '48H LAUNCH',
    badgeColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  {
    category: 'pricing',
    icon: '💰',
    title: 'What are your website packages & pricing?',
    subtitle: 'Showcase templates from ₹9,999 / $399 & bespoke builds',
    prompt: 'What are your website packages, starting prices in India, and what is included?',
    badge: '₹9,999 START',
    badgeColor: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  },
  {
    category: 'pricing',
    icon: '🎁',
    title: 'How do I claim 20% discount with INDIA2025?',
    subtitle: 'Instant 20% OFF + Free SSL & custom domain setup',
    prompt: 'How can I claim the INDIA2025 (20% OFF) discount code + Free SSL and domain?',
    badge: '20% OFF CODE',
    badgeColor: 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
  },
  {
    category: 'custom',
    icon: '💎',
    title: 'Custom E-Commerce & Web Application',
    subtitle: 'Bespoke UI/UX, SaaS portals & WhatsApp lead capture',
    prompt: 'Tell me about your custom bespoke web application and e-commerce development services.',
    badge: 'ENTERPRISE',
    badgeColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  {
    category: 'delivery',
    icon: '📞',
    title: 'Request an Instant 15-Minute Callback',
    subtitle: 'Connect directly with senior engineers & founders',
    prompt: 'I want to schedule a quick 15-minute consultation callback with your founders.',
    badge: 'INSTANT CALL',
    badgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
];

const FOLLOWUP_QUICK_CHIPS = [
  '⚡ 48h website timeline',
  '🎁 Claim 20% discount',
  '💰 Pricing & packages',
  '📞 15-min call request',
];

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Helper to get or create a session valid for 7 days
const getStoredSessionId = () => {
  if (typeof window === 'undefined') return '';
  try {
    const storedTime = localStorage.getItem('l2b_chat_session_time');
    const storedId = localStorage.getItem('l2b_chat_session_id');
    const now = Date.now();

    if (storedId && storedTime && now - parseInt(storedTime, 10) < SEVEN_DAYS_MS) {
      return storedId;
    }

    const newId = `sess_${now}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('l2b_chat_session_id', newId);
    localStorage.setItem('l2b_chat_session_time', now.toString());
    localStorage.removeItem('l2b_chat_messages');
    return newId;
  } catch (e) {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
};

// Helper to get stored messages from 7-day cache
const getStoredMessages = (brandName) => {
  if (typeof window === 'undefined') return [];
  try {
    const storedTime = localStorage.getItem('l2b_chat_session_time');
    const now = Date.now();

    if (storedTime && now - parseInt(storedTime, 10) < SEVEN_DAYS_MS) {
      const raw = localStorage.getItem('l2b_chat_messages');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    }
  } catch (e) {}

  return [
    {
      role: 'assistant',
      content: `### 👋 Welcome to ${brandName || 'LOCAL2BRAND'} AI Assistant\n\nI am your dedicated digital solutions consultant. How can I help launch or grow your brand today?\n\n* **🚀 48-Hour Websites:** Ready templates starting from **₹9,999 / $399**\n* **🎁 20% Launch Discount:** Use promo code \`INDIA2025\`\n* **💎 Bespoke Builds:** Custom web apps, e-commerce & WhatsApp lead automation\n\nTap any suggested question below or type your inquiry!`,
      timestamp: new Date().toISOString(),
      provider: 'L2B AI Engine',
    },
  ];
};

// Interactive AI In-Chat Callback Card Component
function InteractiveCallbackCard({ msg, user, onSubmitted }) {
  const [name, setName] = useState(msg.initialName || user?.name || '');
  const [phone, setPhone] = useState(msg.initialPhone || user?.phone || '');
  const [email, setEmail] = useState(msg.initialEmail || user?.email || '');
  const [timeSlot, setTimeSlot] = useState(msg.preferredTime || '⚡ ASAP (Within 15-30 mins)');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(msg.isSubmitted || false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErr('Please enter your name and phone number.');
      return;
    }
    setLoading(true);
    setErr('');

    try {
      const res = await api.post('/callbacks', {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        preferredTime: timeSlot,
        topic: msg.topic || 'AI Chat Interactive Callback',
        notes: 'Requested via AI Chat Interactive Message Card',
      });

      if (res?.success) {
        setSubmitted(true);
        if (onSubmitted) onSubmitted(name, phone, timeSlot);
      } else {
        throw new Error(res?.message || 'Failed to request callback');
      }
    } catch (error) {
      setErr(error.data?.message || error.message || 'Error submitting callback request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/80 dark:to-teal-950/60 border border-emerald-300 dark:border-emerald-700 space-y-2 text-xs shadow-xs animate-in zoom-in-95">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Callback Request Confirmed! 📞</span>
        </div>
        <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          Thank you <strong>{name}</strong>! We will call you at <strong className="font-mono text-emerald-600 dark:text-emerald-400">{phone}</strong> ({timeSlot}).
        </p>
        <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-800/80 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300">
            <span>⚡ Instant Priority Dispatch</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Real-time alert emails dispatched to founder desk: <code className="font-mono">sohamduttabwn@gmail.com</code> &amp; <code className="font-mono">stackaddacontact@gmail.com</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-850 border border-purple-300/80 dark:border-purple-700 shadow-md space-y-2.5 text-xs text-slate-800 dark:text-slate-200 animate-in fade-in">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Instant Founder Callback</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black">
                ⚡ 15-Min
              </span>
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Direct connection with our Senior Solutions Architect
            </p>
          </div>
        </div>
      </div>

      {user && (
        <div className="px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[10px] text-purple-800 dark:text-purple-300 font-bold flex items-center justify-between">
          <span>👤 Detected from Account Profile</span>
          <span className="font-mono text-purple-700 dark:text-purple-400">{user.email}</span>
        </div>
      )}

      {err && (
        <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-600 dark:text-rose-300 font-bold">
          {err}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-0.5">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sen"
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-0.5">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-purple-300 dark:border-purple-700 text-xs font-mono font-black text-purple-700 dark:text-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-0.5">
              Email (For Confirmation)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@brand.com"
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-0.5">
              Preferred Time Slot
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-2 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="⚡ ASAP (Within 15-30 mins)">⚡ ASAP (Within 15-30 mins)</option>
              <option value="🌅 Morning (10:00 AM – 1:00 PM IST)">🌅 Morning (10 AM – 1 PM)</option>
              <option value="☀️ Afternoon (2:00 PM – 5:00 PM IST)">☀️ Afternoon (2 PM – 5 PM)</option>
              <option value="🌆 Evening (6:00 PM – 9:00 PM IST)">🌆 Evening (6 PM – 9 PM)</option>
            </select>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between gap-2">
          <span className="text-[9px] text-slate-400 dark:text-slate-500">
            ✉️ Real-time alert to Admin &amp; Founders
          </span>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-black text-white l2b-gradient-bg shadow-sm hover:opacity-95 cursor-pointer flex items-center gap-1.5 disabled:opacity-50 active:scale-95 transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{loading ? 'Dispatching Alert...' : 'Confirm & Request Call 📞'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AssistantChatbot() {
  const { openOrderModal, openCallbackModal } = useOrderModal();
  const { settings } = useSiteSettings();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [sessionId, setSessionId] = useState(() => getStoredSessionId());
  const [messages, setMessages] = useState(() => getStoredMessages(settings?.brandName));
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const triggerInChatMessageCallback = (customTopic) => {
    const callbackMessageCard = {
      role: 'assistant',
      isCallbackCard: true,
      id: `cb_card_${Date.now()}`,
      timestamp: new Date().toISOString(),
      initialName: user?.name || '',
      initialPhone: user?.phone || '',
      initialEmail: user?.email || '',
      preferredTime: '⚡ ASAP (Within 15-30 mins)',
      topic: customTopic || '15-Minute Consultation Callback',
      isSubmitted: false,
    };

    const updated = [...messages, callbackMessageCard];
    setMessages(updated);
    localStorage.setItem('l2b_chat_messages', JSON.stringify(updated));
    localStorage.setItem('l2b_chat_session_time', Date.now().toString());
  };

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Trigger floating prompt indicator once after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setHasPrompted(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Sync / verify chat history with backend database on mount
  useEffect(() => {
    if (!sessionId) return;

    const syncHistoryFromDb = async () => {
      try {
        const res = await api.get(`/chat/history?sessionId=${sessionId}`);
        if (res?.success && Array.isArray(res.messages) && res.messages.length > 0) {
          setMessages(res.messages);
          localStorage.setItem('l2b_chat_messages', JSON.stringify(res.messages));
          localStorage.setItem('l2b_chat_session_time', Date.now().toString());
        }
      } catch (err) {
        console.warn('Chat DB sync notice (using 7-day cache):', err.message);
      } finally {
        setHistoryLoaded(true);
      }
    };

    syncHistoryFromDb();
  }, [sessionId]);

  // Auto-scroll to bottom of messages container
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    setInputText('');
    setErrorMessage('');

    // Append user message immediately to UI and 7-day LocalStorage
    const newUserMsg = {
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    const updatedWithUser = [...messages, newUserMsg];
    setMessages(updatedWithUser);
    localStorage.setItem('l2b_chat_messages', JSON.stringify(updatedWithUser));
    localStorage.setItem('l2b_chat_session_time', Date.now().toString());
    setIsTyping(true);

    try {
      const userContext = user
        ? {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            company: user.company || '',
            role: user.role || 'user',
          }
        : null;

      const res = await api.post(
        '/chat',
        {
          message: query,
          sessionId,
          userContext,
        },
        { timeout: 40000 }
      );

      if (res?.success) {
        const assistantReply = {
          role: 'assistant',
          content: res.message,
          provider: res.provider,
          model: res.model,
          timestamp: res.timestamp || new Date().toISOString(),
          isStreaming: true,
        };
        const finalThread = [...updatedWithUser, assistantReply];
        setMessages(finalThread);
        localStorage.setItem('l2b_chat_messages', JSON.stringify(finalThread));
        localStorage.setItem('l2b_chat_session_time', Date.now().toString());
      } else {
        throw new Error(res?.message || 'Failed to get response from AI');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg = err.data?.message || err.message || 'Connection error. Please try again.';
      setErrorMessage(errMsg);
      const errorReply = {
        role: 'assistant',
        content: `⚠️ *Notice*: We encountered a temporary connection issue. You can retry your message or request an instant callback from our founders.`,
        timestamp: new Date().toISOString(),
        isError: true,
        isStreaming: true,
      };
      const threadWithError = [...updatedWithUser, errorReply];
      setMessages(threadWithError);
      localStorage.setItem('l2b_chat_messages', JSON.stringify(threadWithError));
      localStorage.setItem('l2b_chat_session_time', Date.now().toString());
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = async () => {
    if (!confirm('Are you sure you want to reset this conversation?')) return;
    try {
      await api.delete(`/chat/history?sessionId=${sessionId}`);
    } catch (err) {
      console.warn('Clear chat error:', err.message);
    }

    const now = Date.now();
    const newSession = `sess_${now}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('l2b_chat_session_id', newSession);
    localStorage.setItem('l2b_chat_session_time', now.toString());
    setSessionId(newSession);

    const initial = [
      {
        role: 'assistant',
        content: `👋 **Chat reset!** How can I assist you with your website project today?`,
        timestamp: new Date().toISOString(),
      },
    ];
    setMessages(initial);
    localStorage.setItem('l2b_chat_messages', JSON.stringify(initial));
  };

  // Helper to format inline markdown text (bold, code, links)
  const formatInlineText = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-950 dark:text-white">$1</strong>')
      .replace(/`INDIA2025`/gi, '<span class="px-2 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-mono font-extrabold text-[11px] border border-purple-300 dark:border-purple-700 shadow-xs tracking-wider">INDIA2025</span>')
      .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-200/90 dark:bg-slate-800 text-purple-600 dark:text-purple-300 font-mono text-[11px] border border-slate-300/60 dark:border-slate-700">$1</code>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700 dark:text-slate-300">$1</em>');
  };

  // Rich formatted visual renderer for AI responses
  const renderMessageContent = (text, isUser = false) => {
    if (!text) return null;

    // For user's sent message: render directly with bright crisp white text
    if (isUser) {
      return (
        <p className="text-white font-semibold leading-relaxed text-xs whitespace-pre-wrap select-text">
          {text}
        </p>
      );
    }

    const lines = text.split('\n');
    const elements = [];

    lines.forEach((rawLine, idx) => {
      const line = rawLine.trim();

      if (!line) {
        elements.push(<div key={idx} className="h-1.5" />);
        return;
      }

      // Horizontal Divider
      if (line === '---' || line === '***' || line === '___') {
        elements.push(
          <div key={idx} className="my-2 h-[1px] bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-800/80 to-transparent" />
        );
        return;
      }

      // Heading 3 or 2 (### or ##)
      if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
        const cleanHeading = line.replace(/^#+\s*/, '');
        elements.push(
          <div
            key={idx}
            className="pt-1.5 pb-0.5 font-extrabold text-xs text-purple-950 dark:text-purple-200 flex items-center gap-1.5"
            dangerouslySetInnerHTML={{ __html: formatInlineText(cleanHeading) }}
          />
        );
        return;
      }

      // Bullet List item (* or -)
      if (line.startsWith('* ') || line.startsWith('- ') || line.startsWith('• ')) {
        const cleanBullet = line.replace(/^[\*\-•]\s*/, '');
        elements.push(
          <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-1.5 shrink-0 shadow-xs" />
            <span
              className="text-slate-800 dark:text-slate-200 leading-relaxed text-xs"
              dangerouslySetInnerHTML={{ __html: formatInlineText(cleanBullet) }}
            />
          </div>
        );
        return;
      }

      // Numbered List item (1. , 2. , etc)
      const numMatch = line.match(/^(\d+)\.\s*(.*)$/);
      if (numMatch) {
        const num = numMatch[1];
        const rest = numMatch[2];
        elements.push(
          <div key={idx} className="flex items-start gap-2 pl-0.5 py-0.5">
            <span className="w-4 h-4 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-purple-200 dark:border-purple-800/60">
              {num}
            </span>
            <span
              className="text-slate-800 dark:text-slate-200 leading-relaxed text-xs"
              dangerouslySetInnerHTML={{ __html: formatInlineText(rest) }}
            />
          </div>
        );
        return;
      }

      // Standard text paragraph
      elements.push(
        <p
          key={idx}
          className="text-slate-800 dark:text-slate-200 leading-relaxed text-xs"
          dangerouslySetInnerHTML={{ __html: formatInlineText(line) }}
        />
      );
    });

    return <div className="space-y-1">{elements}</div>;
  };

  // Typewriter animated stream for assistant responses
  const TypewriterContent = ({ text, isStreaming, onComplete }) => {
    const [displayedLength, setDisplayedLength] = useState(isStreaming ? 0 : text.length);

    useEffect(() => {
      if (!isStreaming) {
        setDisplayedLength(text.length);
        return;
      }

      setDisplayedLength(0);
      let current = 0;
      const step = Math.max(3, Math.floor(text.length / 35));
      const interval = setInterval(() => {
        current += step;
        if (current >= text.length) {
          current = text.length;
          setDisplayedLength(text.length);
          clearInterval(interval);
          if (onComplete) onComplete();
        } else {
          setDisplayedLength(current);
        }
      }, 15);

      return () => clearInterval(interval);
    }, [text, isStreaming]);

    const visibleText = isStreaming ? text.slice(0, displayedLength) : text;
    const isTypingActive = isStreaming && displayedLength < text.length;

    return (
      <div className="relative">
        {renderMessageContent(visibleText, false)}
        {isTypingActive && (
          <span className="inline-block w-2 h-3.5 bg-purple-600 dark:bg-purple-400 ml-1 rounded-xs animate-pulse align-middle" />
        )}
      </div>
    );
  };

  const filteredQuestions = activeCategory === 'all'
    ? PREMIUM_QUESTIONS
    : PREMIUM_QUESTIONS.filter((q) => q.category === activeCategory);

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[99999]">
      {/* Floating Launcher Button */}
      <div className="relative flex items-center justify-end">
        {!isOpen && hasPrompted && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2.5 mr-3 px-4 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-purple-200/80 dark:border-purple-800/80 shadow-glass-highlight text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer animate-float"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="flex items-center gap-1.5">
              <span>Chat with</span>
              <span className="l2b-gradient-text font-black">L2B AI</span>
            </span>
            <X
              onClick={(e) => {
                e.stopPropagation();
                setHasPrompted(false);
              }}
              className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-white ml-1"
            />
          </div>
        )}

        {/* L2B AI Modern Frosted Glass Launcher with Adaptive Laser Border */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2.5px] overflow-hidden flex items-center justify-center transition-all duration-300 transform active:scale-95 cursor-pointer relative group ${
            isOpen
              ? 'bg-slate-900 text-white shadow-xl'
              : 'shadow-xl shadow-emerald-500/30 dark:shadow-white/20 hover:shadow-2xl hover:shadow-emerald-500/50 dark:hover:shadow-white/40 hover:scale-105'
          }`}
          aria-label="Toggle L2B AI Assistant"
        >
          {/* Rotating Laser Conic Border: Green in Light Mode, White in Dark Mode */}
          {!isOpen && (
            <span className="absolute -inset-[150%] rounded-full chatbot-laser-border pointer-events-none" />
          )}

          {/* Frosted Glass High-Contrast Core */}
          <div className="w-full h-full rounded-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-white dark:border-slate-800 shadow-sm flex flex-col items-center justify-center relative z-10 select-none">
            {isOpen ? (
              <X className="w-6 h-6 text-slate-800 dark:text-white" />
            ) : (
              <>
                {/* Active Online Pulse Dot */}
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse" />

                {/* Direct Clean AI Sparkles Logo - Crisp in both light and dark */}
                <Sparkles className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-emerald-600 dark:text-purple-400 drop-shadow-xs group-hover:scale-110 transition-transform" />

                {/* Crisp Modern L2B AI Text */}
                <span className="font-black text-[9px] sm:text-[10px] tracking-widest uppercase text-slate-900 dark:text-purple-300 leading-none mt-1 drop-shadow-2xs">
                  L2B AI
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Glassmorphic Drawer Window with Animated Thin Moving Border */}
      {isOpen && (
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="absolute bottom-16 sm:bottom-18 right-0 w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh] p-[1.5px] rounded-3xl chatbot-drawer-border shadow-2xl shadow-emerald-500/25 dark:shadow-purple-500/35 animate-in slide-in-from-bottom-5 duration-200 z-[99999] pointer-events-auto"
        >
          <div className="w-full h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[22.5px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-purple-600/15 via-pink-600/15 to-indigo-600/15 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl l2b-gradient-bg text-white flex items-center justify-center font-bold text-sm shadow-md">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="l2b-gradient-text font-black">L2B AI</span>
                    <span>Assistant</span>
                    <AshokaChakra size={12} />
                  </h3>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Online • Multi-Tier Fallback</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Reset conversation"
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="px-3 py-2 bg-slate-50/80 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[11px]">
              <button
                type="button"
                onClick={() => triggerInChatMessageCallback('15-Minute Instant Callback Request')}
                className="px-2.5 py-1 rounded-xl bg-purple-100/90 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800 text-purple-950 dark:text-purple-200 font-black flex items-center gap-1 shrink-0 hover:bg-purple-200/90 transition-colors cursor-pointer shadow-xs"
              >
                <PhoneCall className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span>📞 Instant Callback</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openOrderModal();
                }}
                className="px-2.5 py-1 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 font-bold flex items-center gap-1 shrink-0 hover:bg-amber-200/80 transition-colors cursor-pointer"
              >
                <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>⚡ Get Proposal</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage('How can I claim 20% discount with promo code INDIA2025?')}
                className="px-2.5 py-1 rounded-xl bg-pink-100/80 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/60 text-pink-900 dark:text-pink-200 font-bold flex items-center gap-1 shrink-0 hover:bg-pink-200/80 transition-colors cursor-pointer"
              >
                <Tag className="w-3 h-3 text-pink-600 dark:text-pink-400" />
                <span>🎁 20% Discount</span>
              </button>
            </div>

            {/* Conversation Feed */}
            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-3.5 text-xs text-slate-800 dark:text-slate-200 custom-chat-scrollbar"
              style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
            >
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';

                // Check for in-message interactive callback widget
                if (msg.isCallbackCard) {
                  return (
                    <div key={msg.id || index} className="flex items-start gap-2.5 justify-start">
                      <div className="w-7 h-7 rounded-xl l2b-gradient-bg text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-full max-w-[94%] sm:max-w-[88%]">
                        <InteractiveCallbackCard
                          msg={msg}
                          user={user}
                          onSubmitted={(cName, cPhone, cSlot) => {
                            msg.isSubmitted = true;
                            const updated = [...messages];
                            setMessages(updated);
                            localStorage.setItem('l2b_chat_messages', JSON.stringify(updated));
                          }}
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-xl l2b-gradient-bg text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {isUser ? (
                      <div className="max-w-[86%] sm:max-w-[82%] rounded-2xl rounded-br-xs px-4 py-2.5 text-xs font-semibold bg-purple-600 dark:bg-purple-600 text-white shadow-md shadow-purple-500/25 leading-relaxed break-words">
                        {renderMessageContent(msg.content, true)}
                      </div>
                    ) : (
                      <div
                        className={`max-w-[86%] sm:max-w-[82%] rounded-2xl rounded-bl-xs p-3 sm:p-3.5 text-xs transition-all shadow-xs ${
                          msg.isError
                            ? 'bg-rose-50/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                            : 'bg-slate-100/95 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        <TypewriterContent
                          text={msg.content}
                          isStreaming={Boolean(msg.isStreaming)}
                          onComplete={() => {
                            msg.isStreaming = false;
                          }}
                        />

                        {/* AI Provider attribution tag */}
                        {msg.provider && msg.provider !== 'unknown' && (
                          <div className="mt-2.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/50 text-[9px] text-slate-400 dark:text-slate-500 font-mono flex items-center justify-between">
                            <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                              <span>⚡</span>
                              <span>{msg.provider}</span>
                              {msg.model && <span className="opacity-70">({msg.model})</span>}
                            </span>
                            {msg.timestamp && (
                              <span>
                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Animation */}
              {isTyping && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl l2b-gradient-bg text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl rounded-bl-xs bg-slate-100/95 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/70 flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium ml-1.5">
                      L2B AI is generating response...
                    </span>
                  </div>
                </div>
              )}

            {/* PREMIUM SUGGESTED QUESTIONS SYSTEM */}
            {messages.length <= 2 && !isTyping && (
              <div className="pt-2 space-y-2.5">
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Frequently Asked Questions</span>
                  </div>
                  <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                    1-Tap Ask
                  </span>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {PREMIUM_SUGGESTION_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                        activeCategory === cat.id
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Question Cards Grid */}
                <div className="space-y-2">
                  {filteredQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (q.badge === 'INSTANT CALL') {
                          triggerInChatMessageCallback('15-Minute Consultation Callback');
                        } else {
                          handleSendMessage(q.prompt);
                        }
                      }}
                      className="p-3 rounded-2xl bg-white/95 dark:bg-slate-800/80 hover:bg-purple-50/80 dark:hover:bg-purple-950/40 border border-slate-200/90 dark:border-slate-700/80 hover:border-purple-400/80 dark:hover:border-purple-600/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-start justify-between gap-2.5 transform active:scale-[0.99]"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-base select-none mt-0.5">{q.icon}</span>
                        <div className="space-y-0.5">
                          <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors leading-tight">
                            {q.title}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                            {q.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border tracking-wider uppercase ${q.badgeColor}`}>
                          {q.badge}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all mt-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Follow-up Chips after conversation has started */}
            {messages.length > 2 && !isTyping && (
              <div className="pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
                  Suggested Follow-ups
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {FOLLOWUP_QUICK_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (chip.includes('call request')) {
                          triggerInChatMessageCallback('Follow-up 15-Minute Call Request');
                        } else {
                          handleSendMessage(chip);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 font-semibold text-[11px] transition-all cursor-pointer shadow-2xs hover:scale-102 flex items-center gap-1"
                    >
                      <span>{chip}</span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Follow-up Chips after conversation has started */}
            {messages.length > 2 && !isTyping && (
              <div className="pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
                  Suggested Follow-ups
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {FOLLOWUP_QUICK_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (chip.includes('call request')) {
                          handleOpenCallbackDrawer('Follow-up 15-Minute Call Request');
                        } else {
                          handleSendMessage(chip);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 font-semibold text-[11px] transition-all cursor-pointer shadow-2xs hover:scale-102 flex items-center gap-1"
                    >
                      <span>{chip}</span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white/95 dark:bg-slate-900/95 border-t border-slate-100 dark:border-slate-800 shrink-0">
            {errorMessage && (
              <div className="mb-2 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-600 dark:text-rose-300 flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage('')}
                  className="text-rose-400 hover:text-rose-600 font-bold ml-2 cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything (e.g. pricing, 48h launch, custom)..."
                  disabled={isTyping}
                  className="w-full pl-3.5 pr-8 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-60 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="w-9 h-9 rounded-2xl l2b-gradient-bg text-white flex items-center justify-center transition-all transform active:scale-95 disabled:opacity-40 disabled:scale-100 shadow-md shadow-purple-500/20 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-slate-400">
              <span>Press Enter ↵ to send</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">L2B AI • Verified</span>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

