import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap, Lock, Clock } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import ScrollReveal from '../common/ScrollReveal';
import { pricingPlans } from '../../data/pricing';
import ComingSoonModal from '../common/ComingSoonModal';

export default function PricingPreview() {
  const [comingSoonPlan, setComingSoonPlan] = useState(null);

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeading
          badge="🇮🇳 Predictable Investment • Rapid Delivery"
          title="Transparent Packages. Coming Soon."
          subtitle="Fixed upfront packages with rapid 3 - 7 days delivery, turnkey source code ownership, and full GST invoice support. Pricing packages are in final review."
        />

        {/* Festive Launch Offer Card */}
        <ScrollReveal variant="fade-up" delay={80} duration={650}>
          <div className="mt-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl p-3 sm:py-3.5 sm:px-6 rounded-2xl bg-amber-50/90 dark:bg-amber-950/70 border border-amber-300/80 dark:border-amber-500/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-bold text-sm shrink-0">
                  20%
                </div>
                <div>
                  <div className="text-xs font-extrabold text-amber-950 dark:text-amber-200">
                    Launch Special: Flat 20% Instant Discount
                  </div>
                  <div className="text-[11px] text-amber-800 dark:text-amber-300">
                    Use coupon code <strong className="font-mono bg-amber-200/70 dark:bg-amber-900/80 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-200">INDIA2025</strong> at checkout
                  </div>
                </div>
              </div>

              <button
                onClick={() => setComingSoonPlan('Special Offer Code: INDIA2025 (20% OFF)')}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all cursor-pointer shrink-0"
              >
                Apply Discount
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Pricing Cards Grid with Staggered 3D Liquid Lift */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((tier, index) => {
            const isPopular = tier.popular;

            return (
              <ScrollReveal
                key={tier.id}
                variant={isPopular ? 'zoom-in' : 'fade-up'}
                delay={index * 110}
                duration={750}
                className="flex"
              >
                <div
                  className={`rounded-hero p-8 flex flex-col justify-between transition-all duration-300 relative w-full ${
                    isPopular
                      ? 'bg-white dark:bg-slate-900 shadow-floating border-2 border-purple-500 lg:-translate-y-2'
                      : 'glass-card border border-white/95 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80'
                  }`}
                >
                  {/* Popular Pill */}
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full l2b-gradient-bg text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                      Most Popular Choice
                    </div>
                  )}

                  <div>
                    {/* Tier Title & Description */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {tier.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {tier.badge}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                        {tier.description}
                      </p>
                    </div>

                    {/* Price Block: Hidden & Blurred Coming Soon */}
                    <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                      <div className="relative overflow-hidden p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                          <div>
                            <span className="font-extrabold text-sm text-purple-900 dark:text-purple-200 block">Coming Soon</span>
                            <span className="text-[11px] text-purple-700 dark:text-purple-400 font-medium">Pricing in Final Review</span>
                          </div>
                        </div>

                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 line-through blur-[3px] select-none">
                          ₹24,999
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-2 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>⚡ {tier.turnaround} Delivery Guarantee</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      {tier.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card CTA */}
                  <div>
                    <button
                      onClick={() => setComingSoonPlan(tier.name)}
                      className={`w-full py-3.5 px-6 rounded-btn font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                        isPopular
                          ? 'text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95'
                          : 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>Inquire & Request Quote 🚀</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                      Direct WhatsApp order confirmation • GST billing supported
                    </p>
                  </div>

                  {/* Bottom subtle tricolor accent line */}
                  <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-amber-400/40 via-blue-400/30 to-emerald-400/40 opacity-40" />
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* View Full Comparison Matrix Link */}
        <ScrollReveal variant="fade-up" delay={200} duration={600} className="mt-14 text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <span>Compare all features in detailed comparison matrix</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>

      </div>

      {/* Dedicated Coming Soon Interactive Modal */}
      <ComingSoonModal
        isOpen={!!comingSoonPlan}
        onClose={() => setComingSoonPlan(null)}
        planName={comingSoonPlan || 'Pricing Plan'}
      />
    </section>
  );
}
