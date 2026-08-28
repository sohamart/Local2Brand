import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../../utils/whatsapp';
import AshokaChakra from '../common/AshokaChakra';

export default function FinalCTA() {
  const { openOrderModal } = useOrderModal();

  const handleWhatsAppChat = () => {
    openWhatsAppChat(generateWhatsAppGeneralUrl());
  };

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle Ambient Section Glow */}
      <div className="section-glow section-glow-purple top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Banner Glass Box */}
        <div className="rounded-hero glass-panel p-8 sm:p-14 lg:p-16 border border-white dark:border-slate-700/80 shadow-floating relative overflow-hidden text-center">

          {/* Subtle Corner Light Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-400/10 dark:bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Badge with Indian Pride and Spinning Ashoka Chakra */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-6">
            <AshokaChakra size={14} />
            <span>Built in India. Ready for the World.</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-3xl mx-auto mb-6">
            Let’s Build a Website That Makes Your Competitors Jealous.
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Pick a high-performing demo from our showcase or let us craft a bespoke masterpiece tailored to your exact brand goals. Handed over in as little as 48 hours with full GST & WhatsApp support.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => openOrderModal({ websiteType: 'Custom Project Inquiry' })}
              className="w-full sm:w-auto px-8 py-4 rounded-btn text-base font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer hover:opacity-95"
            >
              <span>Get Your Website on WhatsApp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleWhatsAppChat}
              className="w-full sm:w-auto px-7 py-4 rounded-btn text-base font-semibold text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Direct WhatsApp Consultation</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-10 pt-8 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Rapid 48-Hour Delivery Available
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              GST Invoicing & Dual Currency (INR/USD)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              100% Lifetime Website Ownership
            </span>
          </div>

          {/* Bottom Indian flag tricolor rim */}
          <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/70 via-blue-500/50 to-emerald-500/70" />
        </div>

      </div>
    </section>
  );
}
