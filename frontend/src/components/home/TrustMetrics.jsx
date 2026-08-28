import React from 'react';
import { Palette, Smartphone, Zap, MessageSquareQuote, ShieldCheck, MapPin } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import AshokaChakra from '../common/AshokaChakra';
import ScrollReveal from '../common/ScrollReveal';

const trustItems = [
  {
    icon: Palette,
    title: "Global Aesthetic Standards",
    description: "Liquid glass aesthetics and editorial typography that command authority in India and internationally."
  },
  {
    icon: Smartphone,
    title: "Mobile-First for Indian Users",
    description: "Ultra-fast lightweight layouts optimized for Indian 4G/5G mobile networks and devices."
  },
  {
    icon: Zap,
    title: "Sub-Second Speed",
    description: "Mumbai, Delhi, Bangalore & Global Edge CDN routing for instant 0.38s load times."
  },
  {
    icon: MessageSquareQuote,
    title: "Direct WhatsApp Order Flow",
    description: "Instant order communication directly over WhatsApp with our founders in English, Hindi & regional languages."
  }
];

export default function TrustMetrics() {
  const metrics = [
    { value: "48h", label: "Delivery Speed", subtext: "For all showcase demo templates" },
    { value: "98+", label: "Google PageSpeed", subtext: "Mobile & desktop optimized" },
    { value: "100%", label: "Responsive & Fluid", subtext: "Perfect across iPhones to 4K" },
    { value: "24/7", label: "WhatsApp Direct", subtext: "Instant founders communication" }
  ];

  return (
    <section className="py-14 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <ScrollReveal variant="fade-up" duration={650}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <AshokaChakra size={13} />
              <span>Trusted Across India & Worldwide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built for ambitious Indian businesses ready to scale globally.
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-center gap-2 flex-wrap">
              <span>GST Invoicing Ready</span> •
              <span>UPI / Card Payments</span> •
              <span>Mumbai • Bengaluru • Delhi • Kolkata • Global</span>
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Pillars Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <ScrollReveal
                key={item.title}
                variant="fade-up"
                delay={idx * 90}
                duration={700}
              >
                <div className="glass-card p-6 sm:p-7 rounded-card border border-white/95 dark:border-slate-700/80 group relative overflow-hidden h-full">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/80 border border-brand-100 dark:border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  {/* Subtle bottom tricolor accent */}
                  <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-amber-400/40 via-blue-400/30 to-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Quick Stat Counter Bar with Zoom-in Scroll Reveal */}
        <ScrollReveal variant="zoom-in" delay={150} duration={750} className="mt-12">
          <div className="glass-panel p-6 sm:p-8 rounded-card grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-sm relative overflow-hidden">
            {metrics.map((metric) => (
              <div key={metric.label} className="space-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {metric.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400">
                  {metric.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  {metric.subtext}
                </div>
              </div>
            ))}
            {/* Subtle Indian bottom rim */}
            <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-amber-500/50 via-blue-500/30 to-emerald-500/50" />
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
