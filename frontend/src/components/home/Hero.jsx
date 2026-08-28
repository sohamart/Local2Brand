import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ExternalLink,
  Globe,
  Zap,
  Star,
  CheckCircle
} from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import AshokaChakra from '../common/AshokaChakra';

const heroShowcases = [
  {
    id: 'restaurant',
    title: 'Royal Spice & Gourmet Bistro',
    category: 'Indian Dining & Café',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop',
    slug: 'gourmet-bistro',
    stat: '48h Launch'
  },
  {
    id: 'agency',
    title: 'Nexus Digital Studio & Agency',
    category: 'Creative Agency India',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
    slug: 'nexus-creative-agency',
    stat: 'High Ticket'
  },
  {
    id: 'saas',
    title: 'Pulse SaaS Platform',
    category: 'Bangalore Tech Startup',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    slug: 'saas-launchpad-startup',
    stat: '100 Speed'
  }
];

export default function Hero() {
  const { openOrderModal } = useOrderModal();
  const [activeTab, setActiveTab] = useState(0);
  const current = heroShowcases[activeTab];

  return (
    <section className="relative pt-32 sm:pt-40 lg:pt-44 pb-16 sm:pb-20 overflow-hidden">
      {/* Centered Ambient Section Glow */}
      <div className="section-glow section-glow-blue top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Pill Badge with Animated Ashoka Chakra */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm text-xs font-semibold text-slate-800 dark:text-slate-200 animate-float relative overflow-hidden">
            <span className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-500/40">
              <AshokaChakra size={13} />
              <span>Made in India</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Turn Local Indian Brands into Global Giants</span>
          </div>
        </div>

        {/* Hero Headline & Ultra-Minimal Copy */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.08]">
            We Build Websites That Turn{' '}
            <span className="l2b-gradient-text whitespace-nowrap">
              Local Brands
            </span>{' '}
            Into Big Brands.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            World-class UI/UX design, sub-second performance, and instant WhatsApp ordering for ambitious Indian businesses ready to scale globally.
          </p>

          {/* Minimal CTA Pair */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
            <button
              onClick={() => openOrderModal()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-btn text-sm sm:text-base font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer hover:opacity-95"
            >
              <span>Start Your Website</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/demos"
              className="w-full sm:w-auto px-7 py-3.5 rounded-btn text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Explore Demos</span>
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
            </Link>
          </div>

          {/* Micro Indian Trust Points */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full border border-slate-200/70 dark:border-slate-700/80 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Direct WhatsApp Support
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full border border-slate-200/70 dark:border-slate-700/80 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              INR (₹) & UPI Supported
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full border border-slate-200/70 dark:border-slate-700/80 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              48h Superfast Delivery
            </span>
          </div>

          {/* Animated Glowing 20% OFF Launch Offer Box */}
          <div className="pt-6">
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-3 sm:py-2.5 sm:px-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-amber-400/50 dark:border-amber-500/40 shadow-glass-highlight relative overflow-hidden group">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-900 text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                  🔥 Launch Offer
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Flat <strong className="text-amber-600 dark:text-amber-400">20% OFF</strong> + Free 1-Yr SSL & Domain
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-bold">
                  CODE: INDIA2025
                </span>
                <button
                  onClick={() => openOrderModal({ websiteType: 'Offer Code: INDIA2025 (20% OFF)' })}
                  className="px-3.5 py-1 rounded-lg text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:opacity-95 cursor-pointer"
                >
                  Claim ₹2,000 OFF
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500" />
            </div>
          </div>
        </div>

        {/* Sleek Minimal Showcase Frame with Dynamic Tabs */}
        <div className="mt-14 sm:mt-16 max-w-4xl mx-auto">

          {/* Minimal Tab Switcher */}
          <div className="flex items-center justify-between gap-2 mb-3 px-2">
            <div className="flex items-center gap-1.5 p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200/70 dark:border-slate-700/80 shadow-sm">
              {heroShowcases.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(idx)}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === idx
                      ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-3 py-1.5 rounded-xl border border-amber-200/60 dark:border-amber-500/40">
              <AshokaChakra size={13} />
              <span>Pan-India & Global Launch Engine</span>
            </div>
          </div>

          {/* Clean Glass Showcase Container with Subtle Indian Bottom Accent */}
          <div className="rounded-card sm:rounded-hero glass-panel p-2.5 sm:p-4 shadow-floating border border-white dark:border-slate-700/80 relative overflow-hidden">

            <div className="relative rounded-xl sm:rounded-card overflow-hidden aspect-[16/10] bg-slate-100 dark:bg-slate-950 group">
              <img
                key={current.id}
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-700 ease-out animate-in fade-in"
              />

              {/* Minimal Clean Bottom Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4 sm:p-6">
                <div className="text-white w-full flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <AshokaChakra size={12} />
                      <span>{current.category}</span>
                    </span>
                    <h3 className="text-base sm:text-xl font-bold leading-tight mt-0.5">
                      {current.title}
                    </h3>
                  </div>

                  <Link
                    to={`/demos/${current.slug}`}
                    className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all inline-flex items-center gap-1.5"
                  >
                    <span>View Demo</span>
                    <ExternalLink className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Indian Tricolor bottom micro-accent */}
            <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/60 via-blue-500/40 to-emerald-500/60" />
          </div>

        </div>

      </div>
    </section>
  );
}
