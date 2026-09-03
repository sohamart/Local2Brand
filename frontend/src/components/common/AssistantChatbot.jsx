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
  Gift,
  Award,
  Copy,
  Check,
  RotateCw,
} from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../../utils/whatsapp';
import AshokaChakra from './AshokaChakra';
import LuckyWheelModal from './LuckyWheelModal';
import { toast } from 'react-toastify';


const QUICK_CHIPS = [
  { icon: '🎡', label: 'Play & Win Reward', isGame: true },
  { icon: '📦', label: 'Track Order', prompt: 'I want to track my project sprint with my Order ID.' },
  { icon: '📞', label: '15-Min Callback', isCallback: true, topic: '15-Minute Founder Callback' },
  { icon: '⚡', label: '48h Launch', prompt: 'Can you deliver my website in 48 hours? What is the process?' },
  { icon: '🎁', label: '20% OFF (INDIA2025)', prompt: 'How do I claim 20% discount with promo code INDIA2025?' },
  { icon: '💰', label: 'Packages & Pricing', prompt: 'What are your packages, starting prices and what is included?' },
  { icon: '🛍️', label: 'E-Commerce / WhatsApp', prompt: 'How do you integrate WhatsApp store and online ordering in websites?' },
  { icon: '💎', label: 'Custom App & UI/UX', prompt: 'Tell me about bespoke custom UI/UX design and custom development.' },
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
  } catch {
    return `sess_${Date.now()}`;
  }
};

// Initial welcome message
const getStoredMessages = (brandName) => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('l2b_chat_messages');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not restore chat messages:', e);
    }
  }

  return [
    {
      role: 'assistant',
      content: `### 👋 Welcome to ${brandName || 'LOCAL2BRAND'} AI Assistant\n\nI am your dedicated digital solutions consultant. How can I help launch or grow your brand today?\n\n* **🚀 48-Hour Websites:** Ready templates starting from **₹9,999 / $399**\n* **📦 Live Sprint Tracker:** Type your **Order ID** (e.g. \`REQ-2026-XXXXX\`) for instant real-time progress\n* **🎁 20% Launch Discount:** Use promo code \`INDIA2025\`\n* **💎 Bespoke Builds:** Custom web apps, e-commerce & WhatsApp lead automation\n\nTap any quick topic below or type your inquiry!`,
      timestamp: new Date().toISOString(),
      provider: 'L2B AI Engine',
    },
  ];
};

// Interactive AI In-Chat Callback Card Component (Ultra-clean & Modern)
function InteractiveCallbackCard({ msg, user, onSubmitted }) {
  const [name, setName] = useState(msg.initialName || user?.name || '');
  const [phone, setPhone] = useState(msg.initialPhone || user?.phone || '');
  const [email, setEmail] = useState(msg.initialEmail || user?.email || '');
  const [timeSlot, setTimeSlot] = useState(msg.preferredTime || '⚡ ASAP (15-30m)');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(msg.isSubmitted || false);
  const [err, setErr] = useState('');

  const TIME_SLOTS = [
    { id: '⚡ ASAP (15-30m)', label: '⚡ ASAP (15m)' },
    { id: '🌅 Morning (10am-1pm)', label: '🌅 Morning' },
    { id: '☀️ Afternoon (2pm-5pm)', label: '☀️ Afternoon' },
    { id: '🌆 Evening (6pm-9pm)', label: '🌆 Evening' },
  ];

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
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-teal-500/10 border border-emerald-500/30 text-xs shadow-xs animate-in zoom-in-95 space-y-2">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Callback Request Confirmed! 📞</span>
        </div>
        <p className="text-slate-700 dark:text-slate-200 text-xs leading-relaxed">
          Thank you <strong>{name}</strong>! Our founding team will call you at <strong className="font-mono text-purple-600 dark:text-purple-400">{phone}</strong> ({timeSlot}).
        </p>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-emerald-500/20 flex items-center justify-between">
          <span>⚡ Priority Email Dispatched</span>
          <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">LIVE ALERT SENT</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/95 border border-purple-200 dark:border-purple-800/80 shadow-md space-y-3 text-xs text-slate-800 dark:text-slate-200 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
              Request 15-Min Founder Callback
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Direct connection with our Senior Tech Consultants
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 font-black text-[9px] border border-emerald-200 dark:border-emerald-800 shrink-0">
          ⚡ 15-MIN
        </span>
      </div>

      {user && (
        <div className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/50 text-[10px] text-purple-800 dark:text-purple-300 flex items-center justify-between">
          <span className="font-semibold">👤 Account Detected</span>
          <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400">{user.email}</span>
        </div>
      )}

      {err && (
        <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-600 dark:text-rose-300 font-bold">
          {err}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Name input (Always editable) */}
        <div>
          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
            Your Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sen"
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Phone number input */}
        <div>
          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
            Phone Number *
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-bold text-slate-400 select-none">
              🇮🇳 +91
            </span>
            <input
              type="tel"
              required
              value={phone.replace(/^\+91/, '').trim()}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98765 43210"
              className="w-full pl-14 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-purple-300 dark:border-purple-700/80 text-xs font-mono font-bold text-purple-700 dark:text-purple-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Time slot chips */}
        <div>
          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
            Preferred Time:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setTimeSlot(slot.id)}
                className={`px-2 py-1.5 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer border ${
                  timeSlot === slot.id
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-1 space-y-1.5">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white l2b-gradient-bg shadow-md shadow-purple-500/20 hover:opacity-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{loading ? 'Dispatching Live Alert...' : 'Confirm & Request Callback 📞'}</span>
          </button>
          <p className="text-center text-[10px] text-slate-400 dark:text-slate-500">
            ✉️ Real-time notification dispatched to executive desk
          </p>
        </div>
      </form>
    </div>
  );
}

export default function AssistantChatbot() {
  const navigate = useNavigate();
  const { openOrderModal, openCallbackModal } = useOrderModal();
  const { settings } = useSiteSettings();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [isBubbleDismissed, setIsBubbleDismissed] = useState(false);
  const [isBubbleClosing, setIsBubbleClosing] = useState(false);
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const [sessionId, setSessionId] = useState(() => getStoredSessionId());
  const [messages, setMessages] = useState(() => getStoredMessages(settings?.brandName));
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
  const [savedVoucher, setSavedVoucher] = useState(() => {

    try {
      const v = localStorage.getItem('l2b_won_voucher');
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  });

  // Check if bubble was dismissed in this session or recently
  useEffect(() => {
    try {
      const isDismissedSession = sessionStorage.getItem('l2b_bubble_dismissed') === 'true';
      const dismissedAt = parseInt(localStorage.getItem('l2b_bubble_dismissed_at') || '0', 10);
      const twelveHours = 12 * 60 * 60 * 1000;
      if (isDismissedSession || (Date.now() - dismissedAt < twelveHours)) {
        setIsBubbleDismissed(true);
        setHasPrompted(false);
      }
    } catch (e) {}
  }, []);

  // Auto Popup Game Modal on load/refresh if user has not played current campaign round
  useEffect(() => {
    if (settings?.luckyWheel?.enabled === false) return;
    try {
      const currentCampaign = settings?.luckyWheel?.campaignVersion || 1;
      const spunCampaign = parseInt(localStorage.getItem('l2b_wheel_spun_version') || '0', 10);

      // If user hasn't played current round, pop up the reward game after initial page load animation
      if (spunCampaign < currentCampaign) {
        const timer = setTimeout(() => {
          setIsLuckyWheelOpen(true);
        }, 2800);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, [settings?.luckyWheel?.campaignVersion, settings?.luckyWheel?.enabled]);


  // Listen for Admin "Start New Round" live trigger
  useEffect(() => {
    const handleNewRound = () => {
      try {
        localStorage.removeItem('l2b_wheel_spun_version');
        localStorage.removeItem('l2b_wheel_spun');
        localStorage.removeItem('l2b_won_voucher');
        setSavedVoucher(null);
      } catch (e) {}
      setIsLuckyWheelOpen(true);
    };

    window.addEventListener('l2b_new_round_started', handleNewRound);
    return () => window.removeEventListener('l2b_new_round_started', handleNewRound);
  }, []);

  // Listen for Lucky Wheel spin win event or direct chatbot open triggers
  useEffect(() => {
    const handlePrizeAwarded = (e) => {
      const prize = e.detail;
      if (!prize) return;

      setSavedVoucher(prize);
      setIsOpen(true);
      setIsBubbleDismissed(true);
      try {
        sessionStorage.setItem('l2b_bubble_dismissed', 'true');
      } catch (err) {}

      const prizeBotMsg = {
        role: 'assistant',
        content: `🎉 **Woohoo! Congratulations!**\n\nYou just won **${prize.label}** (${prize.subLabel || 'Launch Special'})!\n\nYour exclusive coupon code is **${prize.code}**.\n\nI can apply this voucher immediately to your website specifications, explore live demos, or schedule a founder consultation!`,
        timestamp: new Date().toISOString(),
        prizeCard: {
          label: prize.label,
          subLabel: prize.subLabel,
          code: prize.code,
          discountPercent: prize.discountPercent || 20,
        },
      };

      setMessages((prev) => {
        const next = [...prev, prizeBotMsg];
        try {
          localStorage.setItem('l2b_chat_messages', JSON.stringify(next));
          localStorage.setItem('l2b_chat_session_time', Date.now().toString());
        } catch (err) {}
        return next;
      });
    };

    window.addEventListener('l2b_open_chatbot_prize', handlePrizeAwarded);
    return () => window.removeEventListener('l2b_open_chatbot_prize', handlePrizeAwarded);
  }, []);

  // Emerge the dynamic liquid announcement bubble from chatbot after 2.5s if not dismissed
  useEffect(() => {
    if (isBubbleDismissed) return;
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [isBubbleDismissed]);


  const handleDismissBubble = (e) => {
    if (e) e.stopPropagation();
    setIsBubbleClosing(true);
    try {
      sessionStorage.setItem('l2b_bubble_dismissed', 'true');
      localStorage.setItem('l2b_bubble_dismissed_at', Date.now().toString());
    } catch (err) {}
    setTimeout(() => {
      setIsBubbleDismissed(true);
      setIsBubbleClosing(false);
      setHasPrompted(false);
    }, 320);
  };


  const handleClaimPromoCoupon = (e) => {
    if (e) e.stopPropagation();
    const code = settings?.announcementBar?.promoCode || 'INDIA2025';
    const discount = settings?.announcementBar?.discountPercent || 20;

    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
      }
    } catch (err) {}

    setCopiedCoupon(true);
    toast.success(`🎉 Coupon "${code}" applied for ${discount}% OFF!`, { icon: '🎁' });
    setTimeout(() => setCopiedCoupon(false), 2500);

    openOrderModal({
      promoCode: code,
      discountPercent: discount,
      autoApplyOffer: true,
      websiteType: `Launch Promo (${discount}% OFF - Code: ${code})`,
      initialRequirements: `I want to build a website and claim the special launch offer with coupon code "${code}" (${discount}% OFF discount applied).`,
    });
  };


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
          requirementCreated: res.requirementCreated || false,
          requirementId: res.requirementId || null,
          callbackCreated: res.callbackCreated || false,
          callbackPhone: res.callbackPhone || null,
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
        isStreaming: false,
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
      .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-200/90 dark:bg-slate-800 text-purple-600 dark:text-purple-300 font-mono text-[11px] border border-slate-300/60 dark:border-slate-700 font-bold">$1</code>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700 dark:text-slate-300">$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="inline-flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 underline cursor-pointer">$1 ↗</a>');
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

      // Standalone Action CTA Link / Button (e.g. 👉 [Click here to view full roadmap](/track-order?id=...))
      const ctaLinkMatch = line.match(/(?:👉\s*)?\[(.*?)\]\((.*?)\)/);
      if (ctaLinkMatch && (line.startsWith('👉') || line.startsWith('[') || line.includes('/track-order') || line.includes('/get-started') || line.includes('/dashboard'))) {
        const linkText = ctaLinkMatch[1];
        const linkHref = ctaLinkMatch[2];
        elements.push(
          <div key={idx} className="pt-2 pb-1">
            <button
              type="button"
              onClick={() => {
                if (linkHref.startsWith('/')) {
                  navigate(linkHref);
                } else {
                  window.open(linkHref, '_blank');
                }
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{linkText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
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
    const [displayedText, setDisplayedText] = useState(isStreaming ? '' : text);

    useEffect(() => {
      if (!isStreaming || !text) {
        setDisplayedText(text);
        return;
      }

      setDisplayedText('');
      const words = text.split(' ');
      let currentWordIdx = 0;
      const step = Math.max(1, Math.floor(words.length / 25));

      const interval = setInterval(() => {
        currentWordIdx += step;
        if (currentWordIdx >= words.length) {
          setDisplayedText(text);
          clearInterval(interval);
          if (onComplete) onComplete();
        } else {
          setDisplayedText(words.slice(0, currentWordIdx).join(' '));
        }
      }, 30);

      return () => clearInterval(interval);
    }, [text, isStreaming]);

    const isTypingActive = isStreaming && displayedText.length < text.length;

    return (
      <div className="relative select-text">
        {renderMessageContent(displayedText || text, false)}
        {isTypingActive && (
          <span className="inline-block w-2 h-3.5 bg-purple-600 dark:bg-purple-400 ml-1 rounded-xs animate-pulse align-middle" />
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[99999]">
      {/* Floating Launcher Button & Liquid Aurora Announcement Bubble */}
      <div className="relative flex items-end justify-end">

        {/* Proactive Liquid Aurora Announcement Card (Emerges smoothly from Chatbot) */}
        {!isOpen && hasPrompted && !isBubbleDismissed && (
          <div
            className={`absolute bottom-16 sm:bottom-20 right-0 sm:right-2 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[400px] z-[99999] transition-all origin-bottom-right ${
              isBubbleClosing ? 'animate-bubble-collapse' : 'animate-bubble-bloom'
            }`}
          >
            <div className="p-4 rounded-3xl bg-white/98 dark:bg-[#0a101f]/98 backdrop-blur-2xl border-2 border-purple-500/50 dark:border-cyan-400/70 shadow-[0_12px_40px_rgba(124,58,237,0.25)] dark:shadow-[0_0_40px_rgba(6,182,212,0.35)] relative overflow-hidden group">
              {/* Ambient Fluid Glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-pink-500/20 via-purple-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-cyan-500/25 via-blue-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />


              {/* Header Row: Badge & Dismiss */}
              <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-xs">
                    <Flame className="w-3 h-3 text-amber-300 animate-bounce" />
                    <span>{settings?.announcementBar?.badge || 'FLASH LAUNCH OFFER'}</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/40">
                    <AshokaChakra size={9} />
                    <span>IN</span>
                  </span>
                </div>

                <button
                  onClick={handleDismissBubble}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Minimize announcement"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Headline Body */}
              <div
                onClick={() => setIsOpen(true)}
                className="cursor-pointer mb-3 relative z-10"
              >
                <p className="text-xs sm:text-[13px] font-extrabold text-slate-900 dark:text-white leading-snug">
                  {settings?.announcementBar?.text || '🔥 Special Launch Offer: Get 20% OFF + Free SSL & Domain with code INDIA2025'}
                </p>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1 mt-1">
                  <span>Click to chat with L2B AI Assistant</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 relative z-10">
                {/* 1. Spin & Win Wheel Trigger */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLuckyWheelOpen(true);
                  }}
                  className="flex-1 py-2 px-2.5 rounded-xl text-[11px] font-black text-white bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:opacity-95 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95 animate-pulse"
                >
                  <RotateCw className="w-3 h-3 text-white" />
                  <span>Spin &amp; Win 🎡</span>
                </button>

                {/* 2. Direct Claim 20% Coupon */}
                <button
                  type="button"
                  onClick={handleClaimPromoCoupon}
                  className="flex-1 py-2 px-2.5 rounded-xl text-[11px] font-black text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 hover:bg-purple-100 dark:hover:bg-purple-900/80 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedCoupon ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Copied! ✅</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      <span>{settings?.announcementBar?.promoCode || 'INDIA2025'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Liquid Specular Rim Light */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400" />
            </div>
          </div>
        )}

        {/* Floating Play & Win Pill if user hasn't played current round */}
        {!isOpen && !savedVoucher && settings?.luckyWheel?.enabled !== false && (
          <button
            type="button"
            onClick={() => setIsLuckyWheelOpen(true)}
            className="mr-2 sm:mr-3 px-3 sm:px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white font-extrabold text-[11px] sm:text-xs shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer animate-pulse z-10"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>🎡 Play &amp; Win Launch Reward!</span>
          </button>
        )}

        {/* L2B AI Modern Frosted Glass Launcher with Adaptive Laser Border */}
        <button

          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setHasPrompted(false);
            }
          }}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2.5px] overflow-hidden flex items-center justify-center transition-all duration-300 transform active:scale-95 cursor-pointer relative group ${
            isOpen
              ? 'bg-slate-900 text-white shadow-xl'
              : 'shadow-xl shadow-emerald-500/30 dark:shadow-white/20 hover:shadow-2xl hover:shadow-emerald-500/50 dark:hover:shadow-white/40 hover:scale-105'
          }`}
          aria-label="Toggle L2B AI Assistant"
        >
          {/* Rotating Laser Conic Border */}
          {!isOpen && (
            <span className="absolute -inset-[160%] rounded-full chatbot-laser-border pointer-events-none" />
          )}

          {/* High-Contrast Distinct Core */}
          <div className="w-full h-full rounded-full bg-white dark:bg-[#070d19] border-2 border-purple-500/60 dark:border-cyan-400/80 shadow-[0_10px_30px_rgba(124,58,237,0.3)] dark:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex flex-col items-center justify-center relative z-10 select-none transition-all">
            {isOpen ? (
              <X className="w-6 h-6 text-purple-700 dark:text-cyan-300" />
            ) : (
              <>
                {/* Active Online Pulse Dot */}
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse" />

                {/* Direct Clean AI Sparkles Logo */}
                <Sparkles className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-purple-600 dark:text-cyan-400 drop-shadow-xs group-hover:scale-110 transition-transform" />

                {/* Crisp Modern L2B AI Text */}
                <span className="font-black text-[9px] sm:text-[10px] tracking-widest uppercase text-purple-900 dark:text-cyan-300 leading-none mt-1 drop-shadow-2xs">
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
          className="absolute bottom-16 sm:bottom-18 right-0 w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh] p-[2px] rounded-3xl chatbot-drawer-border shadow-2xl z-[99999] pointer-events-auto animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="w-full h-full bg-white dark:bg-[#070b14] backdrop-blur-2xl rounded-[22px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 dark:from-[#0b1329] dark:via-[#111c38] dark:to-[#170e2e] border-b border-purple-300/40 dark:border-cyan-500/40 text-white flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white text-purple-700 dark:bg-cyan-500 dark:text-slate-950 flex items-center justify-center font-bold text-sm shadow-md">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <span className="font-black">L2B AI</span>
                    <span className="opacity-90">Assistant</span>
                    <AshokaChakra size={12} />
                  </h3>
                  <span className="text-[10px] text-emerald-300 dark:text-cyan-300 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-cyan-400 animate-pulse" />
                    <span>Online • Instant Intelligent Support</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Reset conversation"
                  className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="px-3 py-2 bg-purple-50/80 dark:bg-[#090f1d] border-b border-purple-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[11px]">
              {savedVoucher ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    openOrderModal({
                      promoCode: savedVoucher.code,
                      discountPercent: savedVoucher.discountPercent || 20,
                      autoApplyOffer: true,
                      websiteType: `Won Prize: ${savedVoucher.label} (Code: ${savedVoucher.code})`,
                      initialRequirements: `I have won the ${savedVoucher.label} reward with code "${savedVoucher.code}". Please apply this discount to my website project!`,
                    });
                  }}
                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-black flex items-center gap-1 shrink-0 hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  <span>🎁 Won: {savedVoucher.code}</span>
                </button>
              ) : (
                settings?.luckyWheel?.enabled !== false && (
                  <button
                    type="button"
                    onClick={() => setIsLuckyWheelOpen(true)}
                    className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-black flex items-center gap-1 shrink-0 hover:opacity-90 transition-opacity cursor-pointer shadow-xs animate-pulse"
                  >
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    <span>🎡 Play &amp; Win Reward</span>
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => triggerInChatMessageCallback('15-Minute Instant Callback Request')}
                className="px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800 text-purple-950 dark:text-purple-200 font-black flex items-center gap-1 shrink-0 hover:bg-purple-200/90 transition-colors cursor-pointer shadow-xs"
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
                className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 font-bold flex items-center gap-1 shrink-0 hover:bg-amber-200/80 transition-colors cursor-pointer"
              >
                <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>⚡ Get Proposal</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage('How can I claim 20% discount with promo code INDIA2025?')}
                className="px-2.5 py-1 rounded-xl bg-pink-100 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800/60 text-pink-950 dark:text-pink-200 font-bold flex items-center gap-1 shrink-0 hover:bg-pink-200/80 transition-colors cursor-pointer"
              >
                <Tag className="w-3 h-3 text-pink-600 dark:text-pink-400" />
                <span>🎁 20% Discount</span>
              </button>
            </div>

            {/* Conversation Feed */}
            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-3.5 text-xs bg-slate-50 dark:bg-[#060911] custom-chat-scrollbar"
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
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 dark:from-cyan-500 dark:to-purple-600 text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {isUser ? (
                      <div className="max-w-[86%] sm:max-w-[82%] rounded-2xl rounded-br-xs px-4 py-2.5 text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-cyan-600 dark:via-purple-600 dark:to-pink-600 text-white shadow-md leading-relaxed break-words">
                        {renderMessageContent(msg.content, true)}
                      </div>
                    ) : (
                      <div
                        className={`max-w-[86%] sm:max-w-[82%] rounded-2xl rounded-bl-xs p-3 sm:p-3.5 text-xs transition-all ${
                          msg.isError
                            ? 'bg-rose-50 dark:bg-rose-950/90 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                            : 'bg-white dark:bg-[#0e1628] border border-slate-200/90 dark:border-cyan-500/30 text-slate-900 dark:text-slate-100 shadow-sm dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)]'
                        }`}
                      >
                        <TypewriterContent
                          text={msg.content}
                          isStreaming={Boolean(msg.isStreaming)}
                          onComplete={() => {
                            msg.isStreaming = false;
                          }}
                        />

                        {/* Interactive Prize Winner Card from Lucky Wheel */}
                        {msg.prizeCard && (
                          <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-amber-500/15 border-2 border-purple-400/50 dark:border-cyan-400/40 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                                🎉 {msg.prizeCard.label}
                              </span>
                              <span className="font-mono text-xs font-black text-purple-600 dark:text-cyan-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-purple-300 dark:border-cyan-700">
                                {msg.prizeCard.code}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsOpen(false);
                                  openOrderModal({
                                    promoCode: msg.prizeCard.code,
                                    discountPercent: msg.prizeCard.discountPercent,
                                    autoApplyOffer: true,
                                    websiteType: `Spin & Win: ${msg.prizeCard.label} (Code: ${msg.prizeCard.code})`,
                                    initialRequirements: `I won the Lucky Wheel reward "${msg.prizeCard.label}" with promo code "${msg.prizeCard.code}". Please apply this discount to my website project!`,
                                  });
                                }}
                                className="py-2 px-2.5 rounded-xl text-[11px] font-black text-white l2b-gradient-bg shadow-xs hover:opacity-95 flex items-center justify-center gap-1 cursor-pointer transition-all"
                              >
                                <span>🚀 Apply Voucher</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setIsOpen(false);
                                  navigate('/demos');
                                }}
                                className="py-2 px-2.5 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              >
                                <span>🎨 View Demos</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Interactive Order Action Card if requirement was created */}
                        {msg.requirementId && (
                          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-purple-500/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                                📦 Order Logged
                              </span>
                              <span className="font-mono text-[10px] font-extrabold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 rounded-md">
                                {msg.requirementId}
                              </span>
                            </div>
                            <a
                              href={`/dashboard?track=${msg.requirementId}`}
                              className="w-full py-1.5 px-3 rounded-lg text-[11px] font-black text-white l2b-gradient-bg hover:opacity-95 flex items-center justify-center gap-1.5 shadow-xs transition-all text-center"
                            >
                              <span>Track Live Progress</span>
                              <ArrowRight className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        {/* AI Provider attribution tag */}
                        {msg.provider && msg.provider !== 'unknown' && (
                          <div className="mt-2.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/50 text-[9px] text-slate-400 dark:text-slate-500 font-mono flex items-center justify-between">
                            <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-cyan-400">
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
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 dark:from-cyan-500 dark:to-purple-600 text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl rounded-bl-xs bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-pink-500 dark:bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium ml-1.5">
                      L2B AI is generating response...
                    </span>
                  </div>
                </div>
              )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar & Horizontal Sliding Suggestions */}
          <div className="p-3 bg-white dark:bg-[#070b14] border-t border-slate-200/90 dark:border-cyan-500/30 shrink-0 space-y-2">
            
            {/* Horizontal Sliding Quick Suggestion Chips (Docked above input) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth overscroll-x-contain">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-cyan-400 shrink-0 flex items-center gap-1 pl-0.5 select-none">
                <Sparkles className="w-3 h-3 text-purple-500 dark:text-cyan-400" />
                <span>Quick:</span>
              </span>

              {QUICK_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (chip.isGame) {
                      setIsLuckyWheelOpen(true);
                    } else if (chip.isCallback) {
                      triggerInChatMessageCallback(chip.topic || '15-Minute Instant Callback Request');
                    } else {
                      handleSendMessage(chip.prompt);
                    }
                  }}

                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#0f172a] hover:bg-purple-100 dark:hover:bg-cyan-950/70 border border-slate-200 dark:border-slate-700/80 hover:border-purple-400 dark:hover:border-cyan-500 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-cyan-300 font-semibold text-[11px] shrink-0 transition-all cursor-pointer shadow-2xs flex items-center gap-1 active:scale-95"
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            {errorMessage && (
              <div className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-600 dark:text-rose-300 flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  type="button"
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
                  placeholder="Ask anything (e.g. 48h website, pricing, custom)..."
                  disabled={isTyping}
                  className="w-full pl-3.5 pr-8 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#0c1424] border border-slate-300 dark:border-cyan-500/40 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-600 dark:focus:border-cyan-400 dark:focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all disabled:opacity-60 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="w-9 h-9 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-cyan-500 dark:to-purple-600 text-white dark:text-slate-950 flex items-center justify-center transition-all transform active:scale-95 disabled:opacity-40 disabled:scale-100 shadow-md shadow-purple-500/20 dark:shadow-cyan-500/30 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 dark:text-slate-500">
              <span>Press Enter ↵ to send</span>
              <span className="font-mono font-bold text-purple-600 dark:text-cyan-400">L2B AI • Real-Time Desk</span>
            </div>
          </div>
        </div>
      </div>
      )}


      {/* Lucky Prize Wheel Mini-Game Modal */}
      <LuckyWheelModal
        isOpen={isLuckyWheelOpen}
        onClose={() => setIsLuckyWheelOpen(false)}
      />
    </div>
  );
}


