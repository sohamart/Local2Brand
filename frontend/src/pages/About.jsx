import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe2, ShieldCheck, Zap, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { SEO } from '../components/common/CommonUI';
import { siteConfig } from '../config/siteConfig';
import ProcessTimeline from '../components/home/ProcessTimeline';
import FinalCTA from '../components/home/FinalCTA';
import { useOrderModal } from '../context/OrderModalContext';
import AshokaChakra from '../components/common/AshokaChakra';

export default function About() {
  const { openOrderModal } = useOrderModal();

  return (
    <>
      <SEO
        title="About Us — Build Local. Think Global."
        description="Learn about LOCAL2BRAND. We bridge the gap between world-class engineering and local business growth."
      />

      <div className="pt-36 sm:pt-44 lg:pt-48 pb-20">

        {/* About Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <AshokaChakra size={13} />
            <span>🇮🇳 Indian Digital Agency Heritage</span>
          </div>
          <SectionHeading
            badge="Our Philosophy"
            title="Build Local. Think Global."
            subtitle="We exist to give Indian entrepreneurs, creators, and businesses the same digital polish and technological edge enjoyed by global tech leaders."
          />
        </div>

        {/* Narrative & Mission Glass Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
          <div className="glass-panel rounded-hero p-8 sm:p-12 lg:p-16 border border-white dark:border-slate-700/80 shadow-glass-lg grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden">

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <AshokaChakra size={12} />
                <span>The Story Behind LOCAL2BRAND</span>
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                Great Indian businesses deserve world-class digital experiences.
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
                For years, local businesses were forced to choose between clunky, slow DIY website builders or overpriced agencies that took months to deliver lackluster results.
              </p>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                We founded <strong>LOCAL2BRAND</strong> in India on a singular standard: combining Apple-inspired liquid glass aesthetics, sub-second PageSpeed performance, and a frictionless WhatsApp order system to launch client websites in 3 to 7 business days.
              </p>

              {/* Core Values Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Zero Template Sluggishness</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>GST & Dual Currency Ready</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Direct WhatsApp Founders Line</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  <span>Lifetime Asset Ownership</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => openOrderModal({ websiteType: 'Agency Collaboration' })}
                  className="px-8 py-4 rounded-btn font-bold text-sm text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-xl transition-all inline-flex items-center gap-2 cursor-pointer hover:opacity-95"
                >
                  <span>Work With Us on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Showcase Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-card overflow-hidden shadow-floating border border-white dark:border-slate-800 aspect-[4/5] bg-slate-100 dark:bg-slate-950 group">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
                  alt="LOCAL2BRAND Digital Agency Studio Team"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <AshokaChakra size={11} />
                    <span>Indian Engineering Powerhouse</span>
                  </div>
                  <h3 className="text-xl font-bold">120+ Digital Storefronts Delivered</h3>
                  <p className="text-xs text-slate-300 mt-1">From Mumbai to New York, London to Singapore.</p>
                </div>
              </div>
            </div>

            {/* Subtle bottom tricolor accent */}
            <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/60 via-blue-500/40 to-emerald-500/60" />
          </div>
        </div>

        {/* Process Section */}
        <div className="mt-20">
          <ProcessTimeline />
        </div>

        {/* Global CTA */}
        <div className="mt-20">
          <FinalCTA />
        </div>

      </div>
    </>
  );
}
