import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Pricing = () => {
  const tiers = [
    {
      name: 'Starter Design',
      price: '₹12,000',
      description: 'Ideal for local shops, cafes, and personal service portfolios looking for a quick launch.',
      features: [
        '1–5 optimized website pages',
        'Responsive layout (Mobile-first check)',
        'Built-in contact form integration',
        'WhatsApp direct click triggers',
        'Google maps & business reviews wall',
        'Basic local SEO configuration',
        'SSL certificate & hosting set up',
      ],
      cta: 'Choose Starter',
      tag: 'Starter',
      popular: false,
    },
    {
      name: 'Business Pro',
      price: '₹22,000',
      description: 'For growing businesses, clinics, and startups demanding custom features and dashboards.',
      features: [
        '5–10 responsive pages',
        'Premium UI styling & transitions',
        'CMS system (Admin blog/news dashboard)',
        'Google Analytics & tracking codes',
        'Interactive booking/calendly sync',
        'Optimized loading performance (0.8s avg)',
        '1 month post-launch support help',
        'Social media feed updates',
      ],
      cta: 'Choose Business Pro',
      tag: 'Business',
      popular: true,
    },
    {
      name: 'Bespoke Custom',
      price: 'Let\'s Discuss',
      description: 'For organizations needing complex backend systems, payments, database portals, or unique UI concepts.',
      features: [
        'Unlimited custom layouts',
        'Tailored Express/Node backend APIs',
        'Secure user authentication & roles',
        'Razorpay/Stripe payment gateway integration',
        'Interactive dashboards & analytics pages',
        'Figma UI mockup alignment before code',
        'Premium scale architecture',
        '3 months maintenance SLAs',
      ],
      cta: 'Contact for Consultation',
      tag: 'Custom',
      popular: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck size={13} />
          Transparent Pricing Model
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
          Choose a Plan Tailored to Your Growth
        </h1>
        <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed">
          No hidden fees. We value transparency. You know exactly what you are paying for every step of the development process.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <motion.div
            key={tier.name}
            whileHover={{ y: -5 }}
            className={`bg-white/80 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col p-6 relative justify-between gap-6 ${
              tier.popular
                ? 'border-yellow-500 dark:border-yellow-500 shadow-xl shadow-yellow-500/5'
                : 'border-white/5'
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-yellow-400 text-[10px] font-bold text-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={10} />
                Most Popular
              </span>
            )}

            <div className="space-y-4 text-left">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                <p className="text-xs text-slate-650 dark:text-slate-400 mt-1 leading-relaxed">{tier.description}</p>
              </div>

              <div className="py-2 border-y border-white/5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{tier.price}</span>
                {tier.price !== 'Let\'s Discuss' && <span className="text-xs text-slate-500">/ project</span>}
              </div>

              <ul className="space-y-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-slate-650 dark:text-slate-300">
                    <Check size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to={`/start-project?tier=${tier.tag}`}
              className={`w-full py-3 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                tier.popular
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg shadow-yellow-500/10 font-bold'
                  : 'bg-slate-100 border border-slate-300/60 dark:bg-slate-800 dark:border-white/10 text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750 dark:text-slate-200'
              }`}
            >
              {tier.cta}
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
