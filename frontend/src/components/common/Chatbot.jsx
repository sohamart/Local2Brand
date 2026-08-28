import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles, ArrowRight, HelpCircle, ChevronRight, Check } from 'lucide-react';
import { generateWhatsAppGeneralUrl, generateWhatsAppOrderUrl, openWhatsAppChat } from '../../utils/whatsapp';
import { siteConfig } from '../../config/siteConfig';
import AshokaChakra from './AshokaChakra';

const supportTopics = [
  {
    id: 'pricing',
    question: 'How much does a website cost?',
    shortAnswer: 'Our ready-made demo templates start at ₹9,999 / $399 with 48h delivery. Custom projects are quoted based on requirements.',
    whatsappPrompt: 'Hi LOCAL2BRAND! I would like to know more about website pricing and packages.'
  },
  {
    id: 'turnaround',
    question: 'How fast can my website launch?',
    shortAnswer: 'Showcase demo templates launch in just 48 hours. Bespoke custom designs typically take 3 to 7 business days.',
    whatsappPrompt: 'Hi LOCAL2BRAND! Can I get a website delivered in 48 hours?'
  },
  {
    id: 'coupon',
    question: 'Is there a launch discount available?',
    shortAnswer: 'Yes! Use coupon code INDIA2025 during WhatsApp order to claim an instant 20% discount + free SSL & domain.',
    whatsappPrompt: 'Hi LOCAL2BRAND! I want to claim the INDIA2025 (20% OFF) coupon for my new website.'
  },
  {
    id: 'process',
    question: 'What is the ordering process?',
    shortAnswer: 'Simply pick a design from our marketplace or share your concept. We build it, send a live preview for feedback, and deploy.',
    whatsappPrompt: 'Hi LOCAL2BRAND! I want to understand your process for building my website.'
  },
  {
    id: 'demo',
    question: 'Can I customize a demo template?',
    shortAnswer: '100%! We replace all text, images, colors, logos, and features with your exact brand identity and business offerings.',
    whatsappPrompt: 'Hi LOCAL2BRAND! I want to customize a template for my business.'
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  // Trigger floating pulse indicator once after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleGeneralWhatsApp = () => {
    openWhatsAppChat(generateWhatsAppGeneralUrl());
    setIsOpen(false);
  };

  const handleTopicWhatsApp = (prompt) => {
    openWhatsAppChat(generateWhatsAppGeneralUrl(prompt));
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">

      {/* 1. Floating WhatsApp Launcher Button */}
      <div className="relative flex items-center justify-end">

        {/* Attention Bubble on Desktop */}
        {!isOpen && hasPrompted && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 mr-3 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/90 dark:border-slate-700/80 shadow-glass text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer animate-float"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Questions? Chat with founders</span>
            <X
              onClick={(e) => {
                e.stopPropagation();
                setHasPrompted(false);
              }}
              className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-white ml-1"
            />
          </div>
        )}

        {/* Primary Round Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 cursor-pointer relative ${
            isOpen
              ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border border-slate-200/20 dark:border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-700 shadow-purple-500/10'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 hover:scale-105'
          }`}
          aria-label={isOpen ? "Close WhatsApp Support" : "Open WhatsApp Support"}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform rotate-0" />
          ) : (
            <>
              <MessageCircle className="w-7 h-7 fill-white text-white" />
              {/* Online Pulse Dot */}
              <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
            </>
          )}
        </button>

      </div>

      {/* 2. Dedicated WhatsApp Support & Question Selector Card */}
      {isOpen && (
        <div
          className="absolute bottom-16 sm:bottom-18 right-0 w-[320px] xs:w-[360px] sm:w-[395px] h-[520px] max-h-[82vh] bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl rounded-3xl border border-white/95 dark:border-slate-700/80 shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
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
              className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer relative z-10"
              aria-label="Close Support"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Bottom Indian Flag rim */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500" />
          </div>

          {/* Body Content with Smooth Scrolling */}
          <div
            className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-slate-50/60 dark:bg-slate-950/60 modal-touch-scroll"
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
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Frequently Asked Topics
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Select any topic below</span>
            </div>

            {/* Questions / Topic Accordion List */}
            <div className="space-y-2">
              {supportTopics.map((topic) => {
                const isSelected = selectedTopicId === topic.id;

                return (
                  <div
                    key={topic.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-purple-300 dark:border-purple-500/50 shadow-sm'
                        : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedTopicId(isSelected ? null : topic.id)}
                      className="w-full p-3 text-left flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {topic.question}
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                          isSelected ? 'rotate-90 text-purple-600 dark:text-purple-400' : ''
                        }`}
                      />
                    </button>

                    {isSelected && (
                      <div className="px-3 pb-3 pt-1 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800">
                        <p className="leading-relaxed text-[11px]">
                          {topic.shortAnswer}
                        </p>
                        <button
                          onClick={() => handleTopicWhatsApp(topic.whatsappPrompt)}
                          className="w-full py-2 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/70 hover:bg-purple-100 dark:hover:bg-purple-900/80 text-purple-800 dark:text-purple-300 border border-purple-200/80 dark:border-purple-500/40 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          <span>Ask this on WhatsApp</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
            <span className="flex items-center gap-1">
              <AshokaChakra size={11} />
              <span>LOCAL2BRAND • WhatsApp Support</span>
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{siteConfig.displayWhatsApp}</span>
          </div>
        </div>
      )}

    </div>
  );
}
