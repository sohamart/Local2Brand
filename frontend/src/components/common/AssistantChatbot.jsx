import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Sparkles,
  PhoneCall,
  ArrowRight,
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  Send,
  Zap,
  Bot
} from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import api from '../../services/api';
import AshokaChakra from './AshokaChakra';

const FAQ_ITEMS = [
  {
    id: 'pricing',
    question: 'How much does a website cost?',
    answer: 'Showcase demo templates start at ₹9,999 / $399 with rapid 48h launch. Deep custom builds are quoted based on specific modules.',
    actionType: 'inquiry',
    actionLabel: 'Calculate Instant Price'
  },
  {
    id: 'turnaround',
    question: 'How fast can my website launch?',
    answer: 'Our template marketplace websites are handed over in as little as 48 hours with full branding and copywriting customization.',
    actionType: 'callback',
    actionLabel: 'Schedule 48h Consultation'
  },
  {
    id: 'offer',
    question: 'Is there a launch discount available?',
    answer: 'Yes! Use promo code INDIA2025 in our project proposal builder to claim an instant 20% discount + free SSL & domain setup.',
    actionType: 'inquiry',
    actionLabel: 'Claim 20% OFF Offer'
  },
  {
    id: 'process',
    question: 'What is the design & build process?',
    answer: '1. Pick a template or concept. 2. We customize design & copy. 3. Interactive live preview & approval. 4. Instant deployment.',
    actionType: 'callback',
    actionLabel: 'Request a Callback'
  }
];

export default function AssistantChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [customQuery, setCustomQuery] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customSubmitted, setCustomSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { openOrderModal, openCallbackModal } = useOrderModal();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const timer = setTimeout(() => setHasPrompted(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleActionClick = (type) => {
    setIsOpen(false);
    if (type === 'callback') {
      openCallbackModal({ topic: selectedFaq?.question || 'General Inquiry' });
    } else {
      openOrderModal({ websiteType: selectedFaq?.question || 'Assistant Inquiry' });
    }
  };

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    if (!customPhone) return;

    setLoading(true);
    try {
      await api.post('/callbacks', {
        name: 'Quick Chat Visitor',
        phone: customPhone,
        notes: customQuery || 'Submitted from Interactive Assistant widget',
        topic: 'Quick Chat Support'
      });
      setCustomSubmitted(true);
    } catch (err) {
      console.warn('Quick inquiry error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
      
      {/* Floating Launcher Button */}
      <div className="relative flex items-center justify-end">
        {!isOpen && hasPrompted && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 mr-3 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/90 dark:border-slate-700/80 shadow-glass text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer animate-float"
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            <span>Questions? Talk with our team</span>
            <X
              onClick={(e) => {
                e.stopPropagation();
                setHasPrompted(false);
              }}
              className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-white ml-1"
            />
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 cursor-pointer relative ${
            isOpen
              ? 'bg-slate-900 text-white dark:bg-slate-800 border border-slate-700'
              : 'l2b-gradient-bg text-white shadow-purple-500/30 hover:scale-105'
          }`}
          aria-label="Toggle Support Assistant"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </button>
      </div>

      {/* Glassmorphic Drawer Window */}
      {isOpen && (
        <div className="absolute bottom-16 sm:bottom-18 right-0 w-[92vw] sm:w-[380px] max-h-[540px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-indigo-600/10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl l2b-gradient-bg text-white flex items-center justify-center font-bold text-sm shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{settings.brandName} Assistant</span>
                  <AshokaChakra size={11} />
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online • Instant Help</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
            
            {/* Quick Action Pills */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  openCallbackModal();
                }}
                className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-950 dark:text-purple-200 font-bold flex items-center justify-center gap-1.5 hover:bg-purple-100 transition-colors cursor-pointer text-center"
              >
                <PhoneCall className="w-3.5 h-3.5 text-purple-600" />
                <span>Call Request</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  openOrderModal();
                }}
                className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 font-bold flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors cursor-pointer text-center"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Get Proposal</span>
              </button>
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pt-1">
              Frequently Asked Questions
            </div>

            {/* FAQ List */}
            <div className="space-y-2">
              {FAQ_ITEMS.map((faq) => {
                const isSelected = selectedFaq?.id === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isSelected
                        ? 'bg-slate-50 dark:bg-slate-800/80 border-purple-500/50 shadow-xs'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      onClick={() => setSelectedFaq(isSelected ? null : faq)}
                      className="p-3 font-semibold text-slate-900 dark:text-white flex items-center justify-between cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                    </div>

                    {isSelected && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 space-y-2.5">
                        <p>{faq.answer}</p>
                        <button
                          onClick={() => handleActionClick(faq.actionType)}
                          className="w-full py-2 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-purple-700 shadow-xs"
                        >
                          <span>{faq.actionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Ask Box */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              {customSubmitted ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                  <span className="font-bold">Got it! We'll call you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500">Need instant callback?</div>
                  <input
                    type="tel"
                    required
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    placeholder="Enter phone number..."
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg cursor-pointer hover:opacity-95 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Request Instant Callback'}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
