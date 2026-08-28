import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { pricingPlans } from '../../data/pricing';
import { useOrderModal } from '../../context/OrderModalContext';

export default function PricingPreview() {
  const { openOrderModal } = useOrderModal();
  const [currency, setCurrency] = useState('INR'); // Default to INR

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle Ambient Section Glow */}
      <div className="section-glow section-glow-purple top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeading
          badge="🇮🇳 Transparent Indian & Global Pricing"
          title="Simple, Honest Investment. Zero Hidden Fees."
          subtitle="Fixed upfront pricing with rapid delivery, GST invoice support, and lifetime ownership. Choose the tier that best fits your business goals."
        />

        {/* Currency Switcher & Launch Offer Banner */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="p-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm inline-flex items-center gap-1">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currency === 'INR'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🇮🇳 INR (₹)</span>
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currency === 'USD'
                    ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🌐 USD ($)</span>
              </button>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              UPI / NetBanking / GST Invoice Supported
            </span>
          </div>

          {/* Festive Launch Offer Card */}
          <div className="w-full max-w-2xl p-3 sm:py-3 sm:px-6 rounded-2xl bg-amber-50/90 dark:bg-amber-950/70 border border-amber-300/80 dark:border-amber-500/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
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
              onClick={() => openOrderModal({ websiteType: 'Offer Code: INDIA2025 (20% OFF)' })}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all cursor-pointer shrink-0"
            >
              Apply Discount
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((tier) => {
            const isPopular = tier.popular;

            return (
              <div
                key={tier.id}
                className={`rounded-hero p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isPopular
                    ? 'bg-white dark:bg-slate-900 shadow-floating border-2 border-purple-500 lg:-translate-y-2'
                    : 'glass-card border border-white/95 dark:border-slate-700/80'
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
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {tier.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                      {tier.description}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {currency === 'USD' ? tier.price : tier.priceInr}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        /{tier.billingNote}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{tier.turnaround}</span>
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
                    onClick={() => openOrderModal({
                      websiteType: `Pricing Plan: ${tier.name}`,
                      initialRequirements: `Interested in the ${tier.name} package.`
                    })}
                    className={`w-full py-3.5 px-6 rounded-btn font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                      isPopular
                        ? 'text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95'
                        : 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>Get Started on WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                    Direct WhatsApp order confirmation • GST billing supported
                  </p>
                </div>

                {/* Bottom subtle tricolor accent line */}
                <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-amber-400/40 via-blue-400/30 to-emerald-400/40 opacity-40" />
              </div>
            );
          })}
        </div>

        {/* View Full Comparison Matrix Link */}
        <div className="mt-14 text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <span>Compare all features in detailed comparison matrix</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
