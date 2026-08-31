import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Target, Palette, ShoppingBag, Code2, ArrowRight, Sparkles } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import ScrollReveal from '../common/ScrollReveal';
import { agencyServices } from '../../data/services';
import { useOrderModal } from '../../context/OrderModalContext';

const iconMap = {
  Globe: Globe,
  Target: Target,
  Palette: Palette,
  ShoppingBag: ShoppingBag,
  Code2: Code2
};

export default function ServicesOverview() {
  const { openOrderModal } = useOrderModal();

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <SectionHeading
          badge="🇮🇳 Indian Craft • Global Standards"
          title="Everything You Need to Build Your Digital Presence."
          subtitle="From rapid conversion landing pages to bespoke digital platforms, we provide complete, future-ready web solutions for Indian and global brands."
        />

        {/* Services Grid with Staggered 3D Liquid Lift */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {agencyServices.map((service, index) => {
            const Icon = iconMap[service.iconName] || Globe;
            const isLarge = index === 0;

            return (
              <ScrollReveal
                key={service.id}
                variant="fade-up"
                delay={index * 110}
                duration={750}
                className={isLarge ? 'md:col-span-2 lg:col-span-1' : ''}
              >
                <div className="glass-card p-7 sm:p-8 rounded-card border border-white/95 dark:border-slate-700/80 flex flex-col justify-between group relative h-full">
                  <div>
                    {/* Icon & Starting Tag with INR & USD */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-13 h-13 rounded-2xl bg-brand-50 dark:bg-brand-950/80 border border-brand-100/80 dark:border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200/70 dark:border-amber-500/40">
                        {service.startingPriceInr || '₹9,999'} / {service.startingPrice}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mt-1 mb-3">
                      {service.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Key Feature Bullets */}
                    <ul className="space-y-2 mb-8 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                      {service.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Action */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100/80 dark:border-slate-800">
                    <button
                      onClick={() => openOrderModal({ websiteType: service.title })}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer group-hover:translate-x-1 transition-all"
                    >
                      <span>Get Instant Proposal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {service.turnaroundTime}
                    </span>
                  </div>

                  {/* Subtle bottom tricolor accent */}
                  <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-amber-400/40 via-blue-400/30 to-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* View All Services Link with Fade-Up */}
        <ScrollReveal variant="fade-up" delay={200} duration={600} className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-btn text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-glass transition-all"
          >
            <span>Explore All Service Details & Deliverables</span>
            <ArrowRight className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </Link>
        </ScrollReveal>

      </div>
    </section>
  );
}
