import React from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Zap, 
  Search, 
  Layout, 
  MessageCircle, 
  Sliders, 
  LifeBuoy 
} from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

const whyFeatures = [
  {
    icon: Sparkles,
    title: "Premium Modern Design",
    description: "Liquid glass surfaces, crisp typography, and refined aesthetics that make your business look like a multimillion-dollar brand."
  },
  {
    icon: Smartphone,
    title: "Mobile-First Architecture",
    description: "Engineered specifically for handheld devices where over 70% of your customers browse and buy."
  },
  {
    icon: Zap,
    title: "Lightning Performance",
    description: "98+ Google Lighthouse scores and optimized asset delivery so your pages load instantaneously with zero lag."
  },
  {
    icon: Search,
    title: "SEO-Friendly Foundation",
    description: "Semantic HTML5, clean headings, meta tags, and schema markup built-in so search engines rank you higher."
  },
  {
    icon: Layout,
    title: "Pixel-Perfect Responsiveness",
    description: "Seamlessly scales across all viewports from 320px smartphones to widescreen monitors."
  },
  {
    icon: MessageCircle,
    title: "Direct WhatsApp Ordering",
    description: "Frictionless conversion flow that brings qualified customer leads directly into your WhatsApp inbox."
  },
  {
    icon: Sliders,
    title: "Bespoke Customization",
    description: "Every color, layout, logo, and content block is personalized to mirror your distinct brand identity."
  },
  {
    icon: LifeBuoy,
    title: "Post-Launch Hyper-Care",
    description: "Dedicated support, minor tweaks, and hosting assistance after launch so you never feel left in the dark."
  }
];

export default function WhyUs() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle Ambient Section Glow */}
      <div className="section-glow section-glow-purple top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Why LOCAL2BRAND"
          title="More Than a Website. A Digital Presence."
          subtitle="We combine senior-level UI/UX design with rock-solid frontend engineering to deliver websites that don't just exist—they convert."
        />

        {/* 8 Features Bento / Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="glass-card p-6 rounded-card border border-white/95 group"
              >
                <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
                  {feat.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
