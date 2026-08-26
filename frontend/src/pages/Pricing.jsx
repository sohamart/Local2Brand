import React, { useState } from 'react';
import { Check, X, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { SEO } from '../components/common/CommonUI';
import { pricingPlans, featureMatrix } from '../data/pricing';
import FAQSection from '../components/home/FAQSection';
import FinalCTA from '../components/home/FinalCTA';
import { useOrderModal } from '../context/OrderModalContext';
import AshokaChakra from '../components/common/AshokaChakra';

export default function Pricing() {
  const { openOrderModal } = useOrderModal();
  const [currency, setCurrency] = useState('INR'); // Default to INR

  return (
    <>
      <SEO
        title="Pricing Plans — Transparent Website Packages"
        description="Explore our transparent fixed-price website packages. Starter, Professional, and Custom Enterprise tiers with instant WhatsApp ordering and 48h turnaround."
      />

      <div className="pt-32 sm:pt-40 pb-20">
        
        {/* Page Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <AshokaChakra size={13} />
            <span>🇮🇳 GST Invoicing • Dual Currency INR (₹) / USD ($)</span>
          </div>
          <SectionHeading
            badge="Predictable Investment"
            title="Transparent Pricing. World-Class Quality."
            subtitle="No hidden fees, recurring lock-ins, or surprise invoices. Choose the package that matches your ambition, with instant UPI and WhatsApp confirmation."
          />

          {/* Currency Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="p-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm inline-flex items-center gap-1">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currency === 'INR'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🇮🇳 INR (₹)</span>
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currency === 'USD'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🌐 USD ($)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan) => {
              const isPopular = plan.popular;

              return (
                <div
                  key={plan.id}
                  className={`rounded-hero p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 relative ${
                    isPopular
                      ? 'glass-panel border-2 border-purple-500 shadow-glass-highlight lg:-translate-y-3 bg-white/95'
                      : 'glass-card border border-white/90 shadow-glass bg-white/80'
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
                      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {plan.name}
                      </h3>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                        {plan.badge}
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {plan.description}
                    </p>

                    {/* Price Block */}
                    <div className="pb-6 mb-6 border-b border-slate-200/70">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                          {currency === 'USD' ? plan.price : plan.priceInr}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          /{plan.billingNote}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-purple-600 mt-2">
                        ⚡ Turnaround: {plan.turnaround}
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 mb-8">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Plan CTA */}
                  <div>
                    <button
                      onClick={() => openOrderModal({
                        websiteType: `Pricing Plan: ${plan.name}`,
                        initialRequirements: `Interested in the ${plan.name} package (${currency === 'USD' ? plan.price : plan.priceInr}).`
                      })}
                      className={`w-full py-4 px-6 rounded-btn font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                        isPopular
                          ? 'text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95'
                          : 'text-slate-900 bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      <span>Choose {plan.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-2">
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

        {/* Feature Comparison Matrix Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Detailed Feature Comparison
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Compare every technical deliverable and specification across our plans.
            </p>
          </div>

          <div className="glass-panel rounded-hero p-4 sm:p-8 border border-white shadow-floating overflow-x-auto relative">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-4 px-4 font-bold text-slate-900">Features & Deliverables</th>
                  <th className="py-4 px-4 font-bold text-slate-900 text-center">Starter</th>
                  <th className="py-4 px-4 font-bold text-purple-600 text-center">Professional</th>
                  <th className="py-4 px-4 font-bold text-slate-900 text-center">Custom</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {featureMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-800">{row.feature}</td>
                    <td className="py-3.5 px-4 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : (
                        <span className="font-semibold text-slate-700">{row.starter}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center bg-purple-50/30">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : (
                        <span className="font-bold text-purple-700">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {typeof row.custom === 'boolean' ? (
                        row.custom ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : (
                        <span className="font-semibold text-slate-700">{row.custom}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bottom Indian flag tricolor rim */}
            <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/60 via-blue-500/40 to-emerald-500/60" />
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mt-24">
          <FAQSection />
        </div>

        {/* Final CTA */}
        <div className="mt-16">
          <FinalCTA />
        </div>

      </div>
    </>
  );
}
