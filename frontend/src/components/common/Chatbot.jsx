import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  ArrowRight, 
  Flame,
  CheckCircle2,
  PhoneCall,
  MessageCircle
} from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../../utils/whatsapp';
import AshokaChakra from './AshokaChakra';

// Curated Quick Suggestion Prompts
const quickPrompts = [
  { id: 'offers', label: '🔥 20% OFF Offer' },
  { id: 'pricing', label: '💰 Pricing & Plans' },
  { id: 'speed', label: '⚡ 48h Delivery' },
  { id: 'templates', label: '🗂️ Ready Demos' },
  { id: 'whatsapp', label: '📱 How to Order' },
  { id: 'gst', label: '🇮🇳 GST & UPI' },
  { id: 'ownership', label: '💻 Code Ownership' },
  { id: 'human', label: '👨‍💻 Chat with Founder' }
];

// Comprehensive Multi-Topic AI Knowledge Base
const aiKnowledgeBase = [
  {
    keywords: ['offer', 'discount', 'coupon', 'code', 'promo', 'india2025', '20%', 'chhar', 'saving', 'deal'],
    reply: "🎉 **Launch Special Offer Active!**\n\n✨ **Flat 20% OFF** on all Ready-Made Website Templates\n✨ **Free 1-Year Domain Name & SSL Certificate**\n✨ **Promo Code:** `INDIA2025`\n\nWould you like to claim your discount on WhatsApp now?",
    hasClaimCTA: true
  },
  {
    keywords: ['price', 'cost', 'pricing', 'rate', 'koto', 'inr', 'usd', 'package', 'starter', 'pro', 'plan', 'taka', 'rupee', 'kharach'],
    reply: "💼 **Fixed, Transparent Pricing:**\n\n• **Starter Tier:** ₹9,999 / $399 (Up to 5 Pages, 48h Turnaround, Mobile-Perfect)\n• **Professional Tier:** ₹19,999 / $799 (Up to 12 Pages, Custom Brand System & SEO)\n• **Custom Enterprise:** ₹39,999 / $1,499+ (Bespoke Web Apps, Portals, E-commerce)\n\n✅ 100% Lifetime Code Ownership • Zero Recurring Lock-ins!",
    hasOrderCTA: true
  },
  {
    keywords: ['time', 'speed', 'fast', 'koto din', 'delivery', '48h', 'turnaround', 'launch', 'somoy', 'din lagbe'],
    reply: "⚡ **Superfast Delivery Timelines:**\n\n• **Ready-Made Templates:** Customization & Launch in **48 to 72 Hours**.\n• **Custom Bespoke Websites:** **5 to 7 Business Days**.\n\nAll websites are engineered for sub-second global load times with **98+ Google PageSpeed** scores!",
    hasOrderCTA: true
  },
  {
    keywords: ['demo', 'template', 'ready', 'restaurant', 'salon', 'gym', 'ecommerce', 'store', 'agency', 'portfolio', 'food', 'real estate'],
    reply: "🗂️ **We Have 9+ Battle-Tested Ready Templates:**\n\n• Gourmet Bistro (Restaurants & Cafes)\n• Nexus Creative (Agencies & Studios)\n• Aurum Jewels (Jewelry & Luxury Retail)\n• PulseFit Gym (Fitness & Training)\n• Velvet Luxe (Salons & Spas)\n• EstatePrime (Real Estate)\n\nWe customize your chosen template with your brand colors, real photos, and WhatsApp order funnel in 48 hours!",
    hasDemosCTA: true
  },
  {
    keywords: ['custom', 'scratch', 'bespoke', 'application', 'webapp', 'portal', 'complex', 'backend', 'fullstack'],
    reply: "🛠️ **Custom Web Engineering:**\n\nYes! Beyond templates, our senior engineering team builds tailor-made SaaS platforms, client portals, dynamic dashboards, and high-converting e-commerce web applications using React, Tailwind, and Node.js.",
    hasOrderCTA: true
  },
  {
    keywords: ['domain', 'hosting', 'server', 'ssl', 'https', 'cloudflare', 'cdn', 'email', 'dns'],
    reply: "🌐 **Domain & Edge Hosting Included:**\n\n• Free setup on ultra-fast Global Edge CDN (Vercel / Cloudflare).\n• Free SSL encryption (HTTPS security badge).\n• We connect and map your existing custom domain (or provide a free 1-year domain with code `INDIA2025`)!",
    hasOrderCTA: true
  },
  {
    keywords: ['seo', 'google', 'ranking', 'mobile', 'responsive', 'iphone', 'android', 'tablet'],
    reply: "📱 **100% Mobile Responsive & SEO Ready:**\n\n• Pixel-perfect responsive rendering on 320px smartphones up to 4K displays.\n• Clean semantic HTML5, JSON-LD schema, meta title/descriptions, and sitemap generation for top Google search indexation.",
    hasOrderCTA: true
  },
  {
    keywords: ['gst', 'tax', 'invoice', 'bill', 'input credit', 'business', 'company'],
    reply: "🇮🇳 **100% Indian Business & GST Friendly:**\n\nWe provide official GST invoices so your company can claim 100% Input Tax Credit (ITC). Just provide your GSTIN at checkout.",
    hasOrderCTA: true
  },
  {
    keywords: ['payment', 'pay', 'upi', 'gpay', 'phonepe', 'paytm', 'qr', 'netbanking', 'card', 'credit', 'debit', 'rupay'],
    reply: "💳 **Flexible Payment Methods:**\n\n• **Instant Indian Payments:** UPI (Google Pay, PhonePe, Paytm, BHIM), IMPS, NEFT, NetBanking, RuPay.\n• **International:** Visa, MasterCard, American Express, Apple Pay.\n\nWe typically work on a 50% milestone kickoff and 50% on final handover.",
    hasOrderCTA: true
  },
  {
    keywords: ['order', 'whatsapp', 'process', 'how to', 'step', 'shuru', 'start', 'booking'],
    reply: "📱 **Frictionless 3-Step WhatsApp Order Flow:**\n\n1. Select a service tier or template you love.\n2. Click 'Get Started' to enter your basic brand name & contact.\n3. The system generates a structured WhatsApp summary connecting you directly with our founding team for immediate kickoff!",
    hasOrderCTA: true
  },
  {
    keywords: ['ownership', 'source', 'code', 'github', 'files', 'export', 'license'],
    reply: "💻 **100% Lifetime Code Ownership:**\n\nUnlike DIY builders (Wix, Shopify, Squarespace) where you pay monthly fees forever, with LOCAL2BRAND you own 100% of your source code and design assets for life!",
    hasOrderCTA: true
  },
  {
    keywords: ['maintenance', 'update', 'changes', 'support', 'after delivery', 'edit', 'modify'],
    reply: "🛡️ **Post-Launch Support & Maintenance:**\n\n• Every website includes **30 Days of Free Dedicated Post-Launch Support** for minor content tweaks and bug fixes.\n• Optional monthly maintenance packages available for regular updates, security monitoring, and new page additions.",
    hasOrderCTA: true
  },
  {
    keywords: ['tech', 'stack', 'react', 'tailwind', 'vite', 'javascript', 'framework'],
    reply: "⚡ **Modern Tech Stack:**\n\nWe build using modern React, Tailwind CSS, Vite, HTML5 Canvas physics, and high-performance serverless edge deployment for lightning-fast speeds.",
    hasOrderCTA: true
  },
  {
    keywords: ['human', 'founder', 'call', 'person', 'agent', 'kotha', 'talk', 'speak', 'phone', 'contact', 'whatsapp number'],
    reply: "👨‍💻 Connecting you directly with our senior founder on WhatsApp for an immediate consultation...",
    isHumanRedirect: true
  },
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'kemon', 'ki khobor', 'kemon acho', 'salaam', 'good morning', 'good evening'],
    reply: "Namaste! 🙏 Welcome to LOCAL2BRAND. We build high-converting websites that turn local brands into big global brands in 48 hours.\n\nWhat can I help you with today? (Pricing, 20% OFF Offer, Templates, or Custom Web Projects?)",
    hasClaimCTA: true
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! 🙏 I am BrandBot, your LOCAL2BRAND concierge. Ask me anything about our pricing, 48h templates, 20% OFF launch offer, or custom web projects!'
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

  // AI Matching Algorithm
  const findBestAnswer = (query) => {
    const cleanQuery = query.toLowerCase().trim();

    // 1. Exact or Multi-Keyword Match
    for (const item of aiKnowledgeBase) {
      for (const kw of item.keywords) {
        if (cleanQuery.includes(kw)) {
          return item;
        }
      }
    }

    // 2. Intelligent Default Fallback
    return {
      reply: `Thanks for your message! 😊 We build high-converting websites starting at **₹9,999** with **48h turnaround** and an active **20% OFF Launch Code (INDIA2025)**.\n\nWould you like to speak directly with our founders on WhatsApp or explore our ready templates?`,
      hasClaimCTA: true,
      hasOrderCTA: true
    };
  };

  const handlePromptClick = (promptId) => {
    const prompt = quickPrompts.find((p) => p.id === promptId);
    if (!prompt) return;

    setMessages((prev) => [...prev, { sender: 'user', text: prompt.label }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const answer = findBestAnswer(prompt.label);
      
      setMessages((prev) => [
        ...prev, 
        { 
          sender: 'bot', 
          text: answer.reply, 
          hasClaimCTA: answer.hasClaimCTA,
          hasOrderCTA: answer.hasOrderCTA,
          hasDemosCTA: answer.hasDemosCTA,
          isHumanRedirect: answer.isHumanRedirect
        }
      ]);

      if (answer.isHumanRedirect) {
        setTimeout(() => {
          openWhatsAppChat(generateWhatsAppGeneralUrl('Hello LOCAL2BRAND Founder, I was chatting with BrandBot and would like to discuss my project.'));
        }, 750);
      }
    }, 450);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const match = findBestAnswer(userText);

      setMessages((prev) => [
        ...prev, 
        { 
          sender: 'bot', 
          text: match.reply, 
          hasClaimCTA: match.hasClaimCTA,
          hasOrderCTA: match.hasOrderCTA,
          hasDemosCTA: match.hasDemosCTA,
          isHumanRedirect: match.isHumanRedirect
        }
      ]);

      if (match.isHumanRedirect) {
        setTimeout(() => {
          openWhatsAppChat(generateWhatsAppGeneralUrl(`Hello LOCAL2BRAND Founder, I was asking: "${userText}"`));
        }, 750);
      }
    }, 500);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-auto">
      
      {/* 1. Animated Circle Floating Icon Launcher (Compact 54px circle) */}
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
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
          )}
        </button>
      </div>

      {/* 2. Smooth Animated Glass Chat Window */}
      {isOpen && (
        <div 
          className="absolute bottom-16 sm:bottom-18 right-0 w-[310px] xs:w-[350px] sm:w-[385px] h-[510px] max-h-[82vh] bg-white/98 backdrop-blur-2xl rounded-3xl border border-white/95 shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
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
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AI Powered • Instant Answers</span>
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
                  openOrderModal({ websiteType: 'Offer Code: INDIA2025 (20% OFF)' });
                }}
                className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-amber-600 hover:bg-amber-700 shrink-0 cursor-pointer"
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
                  className={`p-3 rounded-2xl max-w-[90%] whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Quick Action CTA Buttons */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.hasClaimCTA && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        openOrderModal({ websiteType: 'Launch Offer: 20% OFF (INDIA2025)' });
                      }}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white l2b-gradient-bg shadow-sm flex items-center gap-1.5 cursor-pointer hover:opacity-95"
                    >
                      <span>Claim 20% OFF</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {msg.hasOrderCTA && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        openOrderModal();
                      }}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white l2b-gradient-bg shadow-sm flex items-center gap-1.5 cursor-pointer hover:opacity-95"
                    >
                      <span>Start Your Website</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {msg.hasDemosCTA && (
                    <a
                      href="/demos"
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-800 bg-white border border-slate-200 shadow-sm flex items-center gap-1.5 hover:bg-slate-50"
                    >
                      <span>Browse 9+ Templates</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
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
              placeholder="Ask anything (price, speed, demos, offers)..."
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
