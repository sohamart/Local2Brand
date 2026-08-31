import React, { useState } from 'react';
import { Check, X, Sparkles, ArrowRight, ShieldCheck, HelpCircle, Tag, Globe, Server, Lock, Clock, Info } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { SEO } from '../components/common/CommonUI';
import { pricingPlans, featureMatrix } from '../data/pricing';
import FAQSection from '../components/home/FAQSection';
import FinalCTA from '../components/home/FinalCTA';
import { useOrderModal } from '../context/OrderModalContext';
import AshokaChakra from '../components/common/AshokaChakra';
import ComingSoonModal from '../components/common/ComingSoonModal';

// Subscription Plans (Marked as Coming Soon)
const subscriptionPlans = [
  {
    id: 'maintenance-care',
    name: 'Growth Care & Maintenance',
    badge: 'Monthly Retainer',
    desc: 'Regular plugin updates, monthly content updates, speed optimization, and daily cloud backups.',
    features: [
      'Monthly text & product updates',
      'Daily automated cloud backups',
      'Continuous security & SSL monitoring',
      'Monthly Google Analytics traffic report',
      'Priority WhatsApp tech support'
    ]
  },
  {
    id: 'growth-retainer',
    name: 'VIP Scale & CRO Partner',
    badge: 'Popular Retainer',
    popular: true,
    desc: 'Dedicated UI/UX updates, conversion rate optimization (CRO), marketing banner designs, and A/B tests.',
    features: [
      'All Growth Care features included',
      'Bi-weekly landing page improvements',
      'Custom promo banners & festive designs',
      'Conversion rate optimization (CRO)',
      '1-on-1 monthly digital strategy call'
    ]
  },
  {
    id: 'enterprise-retainer',
    name: 'Dedicated Tech Lead',
    badge: 'Full Scale',
    desc: 'Unlimited monthly design tasks, custom feature expansions, and dedicated engineer bandwidth.',
    features: [
      'Unlimited design & frontend tasks',
      'Custom API integrations & automations',
      'Guaranteed 4-hour emergency SLA',
      'Dedicated Senior Lead Engineer',
      'Direct Slack / WhatsApp channel'
    ]
  }
];

export default function Pricing() {
  const { openOrderModal } = useOrderModal();
  const [currency, setCurrency] = useState('INR'); // 'INR' or 'USD'
  const [billingType, setBillingType] = useState('onetime'); // 'onetime' or 'subscription'
  const [comingSoonPlan, setComingSoonPlan] = useState(null);

  return (
    <>
      <SEO
        title="Pricing Plans — Transparent Website Packages & Turnkey Addons"
        description="Explore our transparent fixed-price website packages and turnkey domain & hosting options. Starter, Professional, and Custom tiers with 3 - 7 days delivery."
      />

      <div className="page-header-offset pb-20">

        {/* Page Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <AshokaChakra size={13} />
            <span>🇮🇳 GST Invoicing • Dual Currency INR (₹) / USD ($)</span>
          </div>
          <SectionHeading
            badge="Predictable Investment"
            title="Transparent Pricing. Zero Hidden Fees."
            subtitle="Choose fixed-price one-time delivery packages or explore our upcoming monthly care retainers with instant WhatsApp booking."
          />

          {/* Pricing Toggle Controls (One-Time vs Subscription & Currency) */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            
            {/* One-Time vs Subscription Pill */}
            <div className="p-1 rounded-full bg-slate-200/60 dark:bg-slate-900/90 backdrop-blur-md border border-slate-300 dark:border-slate-800 shadow-sm inline-flex items-center gap-1">
              <button
                onClick={() => setBillingType('onetime')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingType === 'onetime'
                    ? 'l2b-gradient-bg text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>⚡ One-Time Launchpad</span>
              </button>
              
              <button
                onClick={() => setBillingType('subscription')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingType === 'subscription'
                    ? 'l2b-gradient-bg text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🔄 Monthly Retainer Care</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase">
                  Coming Soon
                </span>
              </button>
            </div>

            {/* Currency Selector */}
            {billingType === 'onetime' && (
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
            )}

            {/* Festive Launch Offer Banner */}
            <div className="w-full max-w-2xl p-3.5 sm:py-3.5 sm:px-6 rounded-2xl bg-amber-50/90 dark:bg-amber-950/70 border-2 border-amber-300/80 dark:border-amber-500/40 shadow-glass flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                  20%
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-amber-950 dark:text-amber-200">
                    Launch Special: Flat 20% Instant Discount
                  </div>
                  <div className="text-[11px] text-amber-800 dark:text-amber-300">
                    Use coupon code <strong className="font-mono bg-amber-200/80 dark:bg-amber-900/80 px-1.5 py-0.5 rounded text-amber-950 dark:text-amber-200 font-bold">INDIA2025</strong> at checkout
                  </div>
                </div>
              </div>

              <button
                onClick={() => openOrderModal({ websiteType: 'Offer Code: INDIA2025 (20% OFF)' })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm transition-all cursor-pointer hover:opacity-95 shrink-0"
              >
                Claim 20% OFF
              </button>
            </div>
          </div>
        </div>

        {/* 1. ONE-TIME PLANS GRID */}
        {billingType === 'onetime' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {pricingPlans.map((plan) => {
                const isPopular = plan.popular;

                return (
                  <div
                    key={plan.id}
                    className={`rounded-hero p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 relative ${
                      isPopular
                        ? 'glass-panel border-2 border-purple-500 shadow-glass-highlight lg:-translate-y-3 bg-white/95 dark:bg-slate-900/95'
                        : 'glass-card border border-white/90 dark:border-slate-700/80 shadow-glass bg-white/80 dark:bg-slate-900/80'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full l2b-gradient-bg text-white text-xs font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Recommended Choice
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {plan.name}
                        </h3>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {plan.badge}
                        </span>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                        {plan.description}
                      </p>

                      {/* Price Block: Blurred Coming Soon Badge */}
                      <div className="pb-6 mb-6 border-b border-slate-200/70 dark:border-slate-800">
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

                        <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-2.5 flex items-center gap-1">
                          <span>⚡ {plan.turnaround} Delivery Guarantee</span>
                        </div>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-8">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Plan CTA */}
                    <div>
                      <button
                        onClick={() => setComingSoonPlan(plan.name)}
                        className={`w-full py-4 px-6 rounded-btn font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
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

                    {/* Subtle bottom tricolor accent */}
                    <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-amber-500/50 via-blue-500/30 to-emerald-500/50" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. SUBSCRIPTION PLANS (COMING SOON / PRIVATE BETA) */}
        {billingType === 'subscription' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 animate-fade-in">
            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 mb-8 flex items-center gap-3 text-center sm:text-left justify-center sm:justify-start">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium">
                <strong>Subscription & Care Retainers are in Private Beta:</strong> Pricing tiers are being finalized. Click any plan below to request priority early access via WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {subscriptionPlans.map((sub) => (
                <div
                  key={sub.id}
                  className={`rounded-hero p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 relative ${
                    sub.popular
                      ? 'glass-panel border-2 border-purple-500 shadow-glass-highlight bg-white/95 dark:bg-slate-900/95'
                      : 'glass-card border border-white/90 dark:border-slate-700/80 shadow-glass bg-white/80 dark:bg-slate-900/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {sub.name}
                      </h3>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {sub.badge}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                      {sub.desc}
                    </p>

                    {/* Price Block (Hidden / Coming Soon) */}
                    <div className="pb-6 mb-6 border-b border-slate-200/70 dark:border-slate-800">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-extrabold text-sm">
                        <Lock className="w-4 h-4" />
                        <span>Pricing Finalizing • Coming Soon</span>
                      </div>
                      <div className="text-xs font-bold text-slate-400 mt-2">
                        Monthly Recurring Retainer
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-8">
                      {sub.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Button Click triggers Coming Soon Modal */}
                  <div>
                    <button
                      onClick={() => setComingSoonPlan(sub.name)}
                      className="w-full py-4 px-6 rounded-btn font-bold text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Coming Soon (Request Early Access)</span>
                    </button>
                    <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                      Launching Q2 2026 • Contact team for beta invites
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. TRANSPARENT DOMAIN & CLOUD HOSTING ADDONS SECTION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="glass-panel p-6 sm:p-10 rounded-hero border border-white dark:border-slate-700/80 shadow-floating">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Globe className="w-3.5 h-3.5" />
                <span>Turnkey Infrastructure Addons</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Domain & Hosting Transparency
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2">
                Our website development packages are one-time fees for complete source code, UI, and design. Domain and Cloud Hosting are optional addons with 100% transparent pricing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Option 1: Custom Domain Addon */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Custom Domain Name</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Turnkey registration for <strong>.com / .in / .co.in / .org</strong> registered under your name with full DNS ownership.
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-xl font-black text-purple-600 dark:text-purple-400">+₹999 <span className="text-xs font-normal text-slate-500">/ year ($12/yr)</span></div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Optional turnkey addon</div>
                </div>
              </div>

              {/* Option 2: Cloud VPS Hosting Addon */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">High-Speed Cloud Hosting</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Ultra-fast global CDN edge hosting, free automated SSL certificates, 99.9% uptime SLA, and daily cloud backups.
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">+₹1,999 <span className="text-xs font-normal text-slate-500">/ year ($25/yr)</span></div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Optional turnkey addon</div>
                </div>
              </div>

              {/* Option 3: Bring Your Own */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Bring Your Own Server</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Already have a domain or hosting on Hostinger / GoDaddy / Vercel? We connect your website to your existing account at zero extra charge!
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹0 <span className="text-xs font-normal text-slate-500">FREE Setup</span></div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Zero platform lock-in</div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Feature Comparison Matrix Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Detailed Feature Comparison
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">
              Compare every technical deliverable and specification across our tiers.
            </p>
          </div>

          <div className="glass-panel rounded-hero p-4 sm:p-8 border border-white dark:border-slate-700/80 shadow-floating overflow-x-auto relative">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-4 font-bold text-slate-900 dark:text-white w-2/5">Features & Deliverables</th>
                  <th className="py-4 px-4 font-bold text-slate-900 dark:text-white text-center w-1/5">Starter</th>
                  <th className="py-4 px-4 font-bold text-purple-600 dark:text-purple-400 text-center w-1/5 bg-purple-50/50 dark:bg-purple-950/40 rounded-t-lg">Professional</th>
                  <th className="py-4 px-4 font-bold text-slate-900 dark:text-white text-center w-1/5">Custom</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                {featureMatrix.map((group, groupIdx) => (
                  <React.Fragment key={groupIdx}>
                    {/* Category Header Row */}
                    <tr className="bg-slate-100/70 dark:bg-slate-800/60">
                      <td colSpan={4} className="py-2.5 px-4 font-extrabold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider">
                        {group.category}
                      </td>
                    </tr>
                    {/* Items within Category */}
                    {group.items.map((item, itemIdx) => (
                      <tr key={itemIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{item.name}</td>
                        <td className="py-3 px-4 text-center">
                          {typeof item.starter === 'boolean' ? (
                            item.starter ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                          ) : (
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{item.starter}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center bg-purple-50/30 dark:bg-purple-950/20">
                          {typeof item.professional === 'boolean' ? (
                            item.professional ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                          ) : (
                            <span className="font-semibold text-purple-600 dark:text-purple-400">{item.professional}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {typeof item.custom === 'boolean' ? (
                            item.custom ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                          ) : (
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{item.custom}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection />

        {/* Final CTA */}
        <FinalCTA />

      </div>

      {/* Dedicated Coming Soon Interactive Modal */}
      <ComingSoonModal
        isOpen={!!comingSoonPlan}
        onClose={() => setComingSoonPlan(null)}
        planName={comingSoonPlan || 'Pricing Package'}
      />
    </>
  );
}
