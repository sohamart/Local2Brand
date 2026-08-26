import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Headphones,
  ArrowRight,
  Flame,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../../utils/whatsapp';
import AshokaChakra from './AshokaChakra';

const supportTopics = [
  {
    id: 'offers',
    icon: '🔥',
    title: 'Launch Offer: 20% OFF Discount',
    shortSummary: 'Get flat 20% discount with code INDIA2025 + Free SSL & Domain.',
    fullAnswer: '🎉 **Launch Special Offer Active!**\n\n• **Flat 20% OFF** on all Ready-Made Website Templates\n• **Free 1-Year Custom Domain & SSL Certificate**\n• **Coupon Code:** `INDIA2025`\n\nClaim this discount directly when you order on WhatsApp!',
    whatsappPrompt: 'Hello LOCAL2BRAND Founder, I want to claim the Launch Special 20% OFF Offer (Code: INDIA2025) for my website.',
    hasClaimModal: true
  },
  {
    id: 'pricing',
    icon: '💰',
    title: 'Website Pricing & Inclusions',
    shortSummary: 'Fixed packages: Starter (₹9,999 / $399) to Pro (₹19,999 / $799).',
    fullAnswer: '💼 **Fixed Upfront Pricing Tiers:**\n\n• **Starter Tier:** ₹9,999 / $399 (Up to 5 Pages, 48h Turnaround, Mobile-Perfect)\n• **Professional Tier:** ₹19,999 / $799 (Up to 12 Pages, Custom Brand System & SEO)\n• **Custom Enterprise:** ₹39,999 / $1,499+ (Bespoke Web Apps & Portals)\n\n✅ 100% Lifetime Code Ownership • Zero Monthly Lock-ins!',
    whatsappPrompt: 'Hello LOCAL2BRAND, I would like to discuss the pricing packages for my business website.'
  },
  {
    id: 'speed',
    icon: '⚡',
    title: 'Delivery Speed (48h Turnaround)',
    shortSummary: 'Templates ready in 48-72h. Custom builds in 5-7 days.',
    fullAnswer: '⚡ **Superfast Delivery Standard:**\n\n• **Ready-Made Templates:** Live in **48 to 72 Hours** with your real branding and content.\n• **Custom Websites:** **5 to 7 Business Days**.\n\nAll builds achieve a 98+ Google PageSpeed score!',
    whatsappPrompt: 'Hello LOCAL2BRAND, I want a fast turnaround website delivered in 48 hours.'
  },
  {
    id: 'templates',
    icon: '🗂️',
    title: 'Browse 9+ Ready-Made Templates',
    shortSummary: 'Restaurants, Salons, Gyms, Jewelry, Real Estate, E-commerce.',
    fullAnswer: '🗂️ **Choose from 9+ Industry-Proven Templates:**\n\n• Gourmet Bistro (Restaurants)\n• Nexus Creative (Agencies)\n• Aurum Jewels (Jewelry & Retail)\n• PulseFit (Gyms & Fitness)\n• Velvet Luxe (Salons & Spas)\n• EstatePrime (Real Estate)\n\nWe customize your chosen design with your logo, products, and WhatsApp direct checkout!',
    whatsappPrompt: 'Hello LOCAL2BRAND, please send me your top demo templates for my industry.'
  },
  {
    id: 'gst',
    icon: '🇮🇳',
    title: 'GST Invoices & Payment Modes',
    shortSummary: 'Official GST billing + UPI, NetBanking, RuPay & Cards.',
    fullAnswer: '🇮🇳 **100% Indian Business Friendly:**\n\n• Official GST Tax Invoices provided for Input Tax Credit (ITC).\n• Payment Modes: UPI (GPay, PhonePe, Paytm), NetBanking, IMPS, NEFT, RuPay, and Global Credit/Debit Cards.',
    whatsappPrompt: 'Hello LOCAL2BRAND, I want to discuss GST billing and payment details for my website project.'
  },
  {
    id: 'ownership',
    icon: '💻',
    title: 'Lifetime Code Ownership & Hosting',
    shortSummary: 'You own 100% of the code forever. Free Vercel/Cloudflare setup.',
    fullAnswer: '💻 **Lifetime Asset Ownership:**\n\n• You own 100% of your source code and design assets for life with zero recurring rental fees.\n• Deployed on ultra-fast global serverless edge infrastructure (Cloudflare / Vercel) with free SSL.',
    whatsappPrompt: 'Hello LOCAL2BRAND, I want to know more about source code ownership and hosting setup.'
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const { openOrderModal } = useOrderModal();

  const handleGeneralWhatsApp = () => {
    openWhatsAppChat(generateWhatsAppGeneralUrl('Hello LOCAL2BRAND, I want to discuss a website project for my business.'));
  };

  const handleTopicWhatsApp = (topic) => {
    openWhatsAppChat(generateWhatsAppGeneralUrl(topic.whatsappPrompt));
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-auto">

      {/* 1. Compact Floating Circular Button */}
      <div className="relative group flex items-center justify-end">
        {!isOpen && (
          <div className="hidden sm:block absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span>Direct WhatsApp Support</span>
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-glass-highlight hover:shadow-2xl transition-all duration-300 transform active:scale-95 cursor-pointer relative ${isOpen
              ? 'bg-slate-900 rotate-90 scale-100'
              : 'l2b-gradient-bg animate-float hover:scale-108'
            }`}
          aria-label={isOpen ? "Close Support" : "Open WhatsApp Support"}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Headphones className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
          )}
        </button>
      </div>

      {/* 2. Dedicated WhatsApp Support & Question Selector Card */}
      {isOpen && (
        <div
          className="absolute bottom-16 sm:bottom-18 right-0 w-[320px] xs:w-[360px] sm:w-[395px] h-[520px] max-h-[82vh] bg-white/98 backdrop-blur-2xl rounded-3xl border border-white/95 shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
          data-lenis-prevent="true"
        >
          {/* Header Bar */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between relative overflow-hidden shrink-0">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                  <span>LOCAL2BRAND Direct Support</span>
                  <AshokaChakra size={11} />
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Founders Online • Instant WhatsApp Reply</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer relative z-10"
              aria-label="Close Support"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Bottom Indian Flag rim */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500" />
          </div>

          {/* Body Content with Smooth Scrolling */}
          <div
            className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-slate-50/60 modal-touch-scroll"
            data-lenis-prevent="true"
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}
          >
            {/* Primary VIP WhatsApp Action Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-extrabold">
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Direct WhatsApp Consultation</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold uppercase tracking-wider">
                  &lt; 15 Mins
                </span>
              </div>
              <p className="text-[11px] text-emerald-50 leading-relaxed">
                Connect directly with our founding engineering team on WhatsApp to discuss your website scope, timeline & pricing.
              </p>
              <button
                onClick={handleGeneralWhatsApp}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-700" />
                <span>Chat Directly on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            {/* Topic Selectors Header */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Frequently Asked Topics
              </span>
              <span className="text-[10px] text-slate-400">Select any topic below</span>
            </div>

            {/* Questions / Topic Accordion List */}
            <div className="space-y-2">
              {supportTopics.map((topic) => {
                const isSelected = selectedTopicId === topic.id;

                return (
                  <div
                    key={topic.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isSelected
                        ? 'bg-white border-purple-300 shadow-md ring-1 ring-purple-400/20'
                        : 'bg-white/90 border-slate-200/80 hover:border-slate-300 shadow-2xs'
                      }`}
                  >
                    {/* Clickable Header */}
                    <button
                      onClick={() => setSelectedTopicId(isSelected ? null : topic.id)}
                      className="w-full p-3 text-left flex items-center justify-between gap-2.5 cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <span className="text-base shrink-0">{topic.icon}</span>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {topic.title}
                          </div>
                          {!isSelected && (
                            <div className="text-[10px] text-slate-500 truncate">
                              {topic.shortSummary}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 text-slate-400">
                        {isSelected ? (
                          <ChevronDown className="w-4 h-4 text-purple-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isSelected && (
                      <div className="px-3 pb-3.5 pt-1 border-t border-slate-100 text-xs text-slate-700 space-y-3 animate-in fade-in duration-150">
                        <div className="whitespace-pre-line leading-relaxed text-[11px]">
                          {topic.fullAnswer}
                        </div>

                        <div className="pt-1 flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleTopicWhatsApp(topic)}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Ask This on WhatsApp</span>
                          </button>

                          {topic.hasClaimModal && (
                            <button
                              onClick={() => {
                                setIsOpen(false);
                                openOrderModal({ websiteType: 'Offer Code: INDIA2025 (20% OFF)' });
                              }}
                              className="py-2 px-3 rounded-xl text-white l2b-gradient-bg font-bold text-[11px] shadow-xs cursor-pointer hover:opacity-95"
                            >
                              Claim 20% OFF
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Quick Action */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span className="text-[11px]">⚡ 48-Hour Delivery Guarantee</span>
            <button
              onClick={() => {
                setIsOpen(false);
                openOrderModal();
              }}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Start Project</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
