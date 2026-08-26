import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Flame,
  ChevronDown
} from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../../utils/whatsapp';
import AshokaChakra from './AshokaChakra';

const quickPrompts = [
  { id: 'offers', label: '🔥 What offers are available?' },
  { id: 'pricing', label: '💰 Pricing & Packages' },
  { id: 'speed', label: '⚡ Delivery Timeline (48h)' },
  { id: 'whatsapp', label: '📱 How WhatsApp Order Works' },
  { id: 'gst', label: '🇮🇳 GST & Payment Modes' },
  { id: 'human', label: '💬 Chat with Founder on WhatsApp' }
];

const botKnowledge = {
  offers: {
    text: "🎉 We currently have our Launch Special Offer!\n\n✨ Flat 20% OFF on all Ready-Made Website Templates\n✨ Free 1-Year Domain Name & SSL Certificate\n✨ Promo Code: INDIA2025\n\nWould you like to claim this offer now?",
    hasClaimCTA: true
  },
  pricing: {
    text: "💼 Our website packages are transparent and fixed-price:\n\n• Starter Tier: ₹9,999 / $399 (Up to 5 Pages, 48h Turnaround)\n• Professional Tier: ₹19,999 / $799 (Up to 12 Pages, Custom Brand System)\n• Custom Enterprise: ₹39,999 / $1,499+ (Bespoke Web Apps & Portals)\n\nAll tiers include lifetime code ownership and zero monthly lock-ins!",
    hasOrderCTA: true
  },
  speed: {
    text: "⚡ Speed is our core engineering standard!\n\n• Ready-Made Templates: Handed over in 48 to 72 Hours.\n• Custom Bespoke Projects: 5 to 7 Business Days.\n\nEvery build achieves a 98+ Google PageSpeed score and sub-second load times worldwide.",
    hasOrderCTA: true
  },
  whatsapp: {
    text: "📱 Simple & Frictionless 3-Step Flow:\n\n1. Browse our 9+ Ready-Made Demos or pick a custom service.\n2. Click 'Get Started' and fill your basic brand details.\n3. The system generates a structured WhatsApp payload connecting you directly to our founding team for immediate kickoff!",
    hasOrderCTA: true
  },
  gst: {
    text: "🇮🇳 100% Indian Business Friendly!\n\n• We provide official GST Invoices for business expense input credit.\n• Payment Modes: UPI, NetBanking, IMPS, NEFT, RuPay, and Global Credit/Debit Cards.",
    hasOrderCTA: true
  },
  human: {
    text: "👨‍💻 Connecting you directly with our senior founder on WhatsApp for an immediate consultation...",
    isHumanRedirect: true
  }
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! 🙏 I am BrandBot, your LOCAL2BRAND concierge. How can I help turn your local brand into a global brand today?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { openOrderModal } = useOrderModal();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handlePromptClick = (promptId) => {
    const prompt = quickPrompts.find((p) => p.id === promptId);
    if (!prompt) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: prompt.label }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const answer = botKnowledge[promptId];
      if (answer) {
        setMessages((prev) => [
          ...prev, 
          { 
            sender: 'bot', 
            text: answer.text, 
            hasClaimCTA: answer.hasClaimCTA,
            hasOrderCTA: answer.hasOrderCTA,
            isHumanRedirect: answer.isHumanRedirect
          }
        ]);

        if (answer.isHumanRedirect) {
          setTimeout(() => {
            openWhatsAppChat(generateWhatsAppGeneralUrl('Hello LOCAL2BRAND Founder, I was chatting with BrandBot and would like to discuss my project.'));
          }, 800);
        }
      }
    }, 600);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    const lower = userText.toLowerCase();

    setTimeout(() => {
      setIsTyping(false);
      let reply = "Thanks for your question! We specialize in ultra-fast, high-converting websites starting at ₹9,999 with 48h delivery. Would you like to start your project or chat directly on WhatsApp?";
      let hasOrder = true;

      if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('inr') || lower.includes('kitna')) {
        reply = botKnowledge.pricing.text;
      } else if (lower.includes('offer') || lower.includes('discount') || lower.includes('coupon') || lower.includes('code')) {
        reply = botKnowledge.offers.text;
      } else if (lower.includes('time') || lower.includes('fast') || lower.includes('duration') || lower.includes('delivery') || lower.includes('48')) {
        reply = botKnowledge.speed.text;
      } else if (lower.includes('whatsapp') || lower.includes('order') || lower.includes('contact')) {
        reply = botKnowledge.whatsapp.text;
      } else if (lower.includes('gst') || lower.includes('tax') || lower.includes('upi') || lower.includes('payment')) {
        reply = botKnowledge.gst.text;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply, hasOrderCTA: hasOrder }]);
    }, 700);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 pointer-events-auto">
      
      {/* Floating Animated Avatar Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-white/95 backdrop-blur-2xl border border-white/95 shadow-floating hover:shadow-2xl transition-all duration-300 animate-float hover:scale-105 cursor-pointer"
          aria-label="Open BrandBot Assistant"
        >
          {/* Animated Avatar Icon */}
          <div className="relative">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full l2b-gradient-bg p-[1.5px] shadow-sm flex items-center justify-center text-white">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            {/* Pulsing online green dot */}
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-ping" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="flex flex-col text-left pr-1">
            <span className="text-xs font-extrabold text-slate-900 leading-none flex items-center gap-1">
              <span>BrandBot</span>
              <AshokaChakra size={10} />
            </span>
            <span className="text-[10px] text-purple-600 font-semibold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
              <span>Offer Active (20% OFF)</span>
            </span>
          </div>
        </button>
      )}

      {/* Floating Interactive Chatbot Modal */}
      {isOpen && (
        <div 
          className="w-[320px] xs:w-[360px] sm:w-[400px] h-[520px] max-h-[85vh] bg-white/98 backdrop-blur-2xl rounded-3xl border border-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          data-lenis-prevent="true"
        >
          {/* Header Bar */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-9 h-9 rounded-full l2b-gradient-bg p-[1.5px] flex items-center justify-center text-white shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold flex items-center gap-1.5">
                  <span>BrandBot Assistant</span>
                  <AshokaChakra size={11} />
                </div>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Online • Local2Brand Concierge</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer relative z-10"
              aria-label="Close Chatbot"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Bottom Indian Flag rim on chatbot header */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500" />
          </div>

          {/* Messages Scroll Area */}
          <div 
            className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs text-slate-800 bg-slate-50/50"
            data-lenis-prevent="true"
          >
            {/* Live Launch Offer Tag */}
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                <span className="text-[11px] font-bold">20% OFF Code: INDIA2025</span>
              </div>
              <button
                onClick={() => openOrderModal({ websiteType: 'Offer Code: INDIA2025' })}
                className="px-2 py-1 rounded-lg text-[10px] font-bold text-white bg-amber-600 hover:bg-amber-700"
              >
                Claim
              </button>
            </div>

            {/* Message bubbles */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Optional Quick Action Buttons in Bot Replies */}
                {msg.hasClaimCTA && (
                  <button
                    onClick={() => openOrderModal({ websiteType: 'Launch Offer: 20% OFF' })}
                    className="mt-2 px-3.5 py-1.5 rounded-xl text-[11px] font-bold text-white l2b-gradient-bg shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Claim 20% OFF on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {msg.hasOrderCTA && !msg.hasClaimCTA && (
                  <button
                    onClick={() => openOrderModal()}
                    className="mt-2 px-3.5 py-1.5 rounded-xl text-[11px] font-bold text-white l2b-gradient-bg shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Start Your Website</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200 w-16 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Guidance Chips Bar */}
          <div className="px-3 pt-2 pb-1 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {quickPrompts.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePromptClick(p.id)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about pricing, speed, demos..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl text-white l2b-gradient-bg shadow-sm cursor-pointer hover:opacity-95"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
