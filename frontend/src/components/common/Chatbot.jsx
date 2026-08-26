import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  ArrowRight, 
  Flame
} from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../../utils/whatsapp';
import AshokaChakra from './AshokaChakra';

const quickPrompts = [
  { id: 'offers', label: '🔥 20% OFF Offer' },
  { id: 'pricing', label: '💰 Pricing (₹9,999+)' },
  { id: 'speed', label: '⚡ 48h Delivery' },
  { id: 'whatsapp', label: '📱 WhatsApp Order' },
  { id: 'gst', label: '🇮🇳 GST & UPI' },
  { id: 'human', label: '💬 Talk to Founder' }
];

const botKnowledge = {
  offers: {
    text: "🎉 Launch Special Offer Active!\n\n✨ Flat 20% OFF on all Website Templates\n✨ Free 1-Year Domain & SSL Certificate\n✨ Code: INDIA2025\n\nWould you like to claim this offer now?",
    hasClaimCTA: true
  },
  pricing: {
    text: "💼 Transparent Fixed Pricing:\n\n• Starter: ₹9,999 / $399 (Up to 5 Pages, 48h)\n• Professional: ₹19,999 / $799 (Up to 12 Pages)\n• Custom: ₹39,999 / $1,499+ (Bespoke Systems)\n\nZero monthly fees & lifetime ownership!",
    hasOrderCTA: true
  },
  speed: {
    text: "⚡ Delivery Timelines:\n\n• Ready Templates: 48 to 72 Hours.\n• Custom Projects: 5 to 7 Days.\n\nEvery build comes with 98+ PageSpeed and sub-second load times worldwide.",
    hasOrderCTA: true
  },
  whatsapp: {
    text: "📱 Simple 3-Step WhatsApp Order:\n\n1. Pick any demo or custom service.\n2. Click 'Get Started' to enter your basic details.\n3. Chat directly with our founders on WhatsApp to finalize and launch!",
    hasOrderCTA: true
  },
  gst: {
    text: "🇮🇳 Indian Business Friendly:\n\n• Official GST Invoices for input tax credit.\n• Payments: UPI, NetBanking, IMPS, NEFT, RuPay, and Global Credit/Debit Cards.",
    hasOrderCTA: true
  },
  human: {
    text: "👨‍💻 Connecting you directly with our senior founder on WhatsApp...",
    isHumanRedirect: true
  }
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! 🙏 I am BrandBot. How can I help turn your local brand into a big global brand today?'
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
    }, 550);
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
      let reply = "We specialize in ultra-fast, bespoke websites starting at ₹9,999 with 48h delivery. Would you like to start your website on WhatsApp?";
      let hasOrder = true;

      if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('inr') || lower.includes('kitna')) {
        reply = botKnowledge.pricing.text;
      } else if (lower.includes('offer') || lower.includes('discount') || lower.includes('code') || lower.includes('coupon')) {
        reply = botKnowledge.offers.text;
      } else if (lower.includes('time') || lower.includes('fast') || lower.includes('delivery') || lower.includes('48')) {
        reply = botKnowledge.speed.text;
      } else if (lower.includes('whatsapp') || lower.includes('order') || lower.includes('contact')) {
        reply = botKnowledge.whatsapp.text;
      } else if (lower.includes('gst') || lower.includes('tax') || lower.includes('upi') || lower.includes('payment')) {
        reply = botKnowledge.gst.text;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply, hasOrderCTA: hasOrder }]);
    }, 650);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-auto">
      
      {/* 1. Animated Circle Floating Icon Launcher (Compact, Sleek & Non-Intrusive) */}
      <div className="relative group flex items-center justify-end">
        
        {/* Tooltip on Hover */}
        {!isOpen && (
          <div className="hidden sm:block absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span>Chat with BrandBot</span>
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        )}

        {/* Circular Floating Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-glass-highlight hover:shadow-2xl transition-all duration-300 transform active:scale-95 cursor-pointer relative ${
            isOpen
              ? 'bg-slate-900 rotate-90 scale-100'
              : 'l2b-gradient-bg animate-float hover:scale-108'
          }`}
          aria-label={isOpen ? "Close BrandBot" : "Open BrandBot Assistant"}
        >
          {/* Animated Icon: Flips smoothly between Bot and Close X */}
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="w-6 h-6 animate-pulse" />
              {/* Pulsing online green dot */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
          )}
        </button>
      </div>

      {/* 2. Smooth Animated Glass Chat Window Modal */}
      {isOpen && (
        <div 
          className="absolute bottom-16 sm:bottom-18 right-0 w-[310px] xs:w-[350px] sm:w-[380px] h-[490px] max-h-[80vh] bg-white/98 backdrop-blur-2xl rounded-3xl border border-white/95 shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
          data-lenis-prevent="true"
        >
          {/* Header Bar */}
          <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex items-center justify-between relative overflow-hidden shrink-0">
            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-8 h-8 rounded-full l2b-gradient-bg p-[1.5px] flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                  <span>BrandBot Concierge</span>
                  <AshokaChakra size={11} />
                </div>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Online • Local2Brand</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer relative z-10"
              aria-label="Close Chatbot"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Bottom Indian Flag rim on chatbot header */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500" />
          </div>

          {/* Smooth Scrollable Messages Area */}
          <div 
            className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 text-xs text-slate-800 bg-slate-50/60 modal-touch-scroll"
            data-lenis-prevent="true"
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}
          >
            {/* Live Launch Offer Tag */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-950 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-1.5 truncate">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold truncate">20% OFF Code: INDIA2025</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  openOrderModal({ websiteType: 'Offer Code: INDIA2025' });
                }}
                className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-amber-600 hover:bg-amber-700 shrink-0"
              >
                Claim
              </button>
            </div>

            {/* Message Bubbles */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[88%] whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Quick Action CTA Buttons */}
                {msg.hasClaimCTA && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      openOrderModal({ websiteType: 'Launch Offer: 20% OFF' });
                    }}
                    className="mt-2 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white l2b-gradient-bg shadow-sm flex items-center gap-1.5 cursor-pointer hover:opacity-95"
                  >
                    <span>Claim 20% OFF on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {msg.hasOrderCTA && !msg.hasClaimCTA && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      openOrderModal();
                    }}
                    className="mt-2 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white l2b-gradient-bg shadow-sm flex items-center gap-1.5 cursor-pointer hover:opacity-95"
                  >
                    <span>Start Your Website</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {/* Animated Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-2.5 rounded-2xl bg-white border border-slate-200 w-14 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Guided Prompts Chips */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
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

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-2.5 sm:p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about pricing, speed, offers..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl text-white l2b-gradient-bg shadow-sm cursor-pointer hover:opacity-95 shrink-0"
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
