import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Target, Palette, ShoppingBag, Code2, ArrowRight, Sparkles } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
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
      {/* Subtle Ambient Section Glow */}
      <div className="section-glow section-glow-purple top-1/3 -right-20 w-[600px] h-[400px]" />
      <div className="section-glow section-glow-blue bottom-10 -left-20 w-[500px] h-[350px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <SectionHeading
          badge="🇮🇳 Indian Craft • Global Standards"
          title="Everything You Need to Build Your Digital Presence."
          subtitle="From rapid conversion landing pages to bespoke digital platforms, we provide complete, future-ready web solutions for Indian and global brands."
        />

        {/* Services Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {agencyServices.map((service, index) => {
            const Icon = iconMap[service.iconName] || Globe;
            const isLarge = index === 0;

            return (
              <div
                key={service.id}
                className={`glass-card p-7 sm:p-8 rounded-card border border-white/95 flex flex-col justify-between group relative ${isLarge ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
              >
                <div>
                  {/* Icon & Starting Tag with INR & USD */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 rounded-2xl bg-brand-50 border border-brand-100/80 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/70">
                      {service.startingPriceInr || '₹9,999'} / {service.startingPrice}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs font-medium text-brand-600 mt-1 mb-3">
                    {service.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Key Feature Bullets */}
                  <ul className="space-y-2 mb-8 text-xs text-slate-500 border-t border-slate-100 pt-4">
                    {service.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100/80">
                  <button
                    onClick={() => openOrderModal({ websiteType: service.title })}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 cursor-pointer group-hover:translate-x-1 transition-all"
                  >
                    <span>Get Started on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[11px] font-medium text-slate-400">
                    {service.turnaroundTime}
                  </span>
                </div>

                {/* Subtle bottom tricolor accent */}
                <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-amber-400/40 via-blue-400/30 to-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>

        {/* View All Services Link */}
        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-btn text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-glass transition-all"
          >
            <span>Explore All Service Details & Deliverables</span>
            <ArrowRight className="w-4 h-4 text-brand-600" />
          </Link>
        </div>

      </div>
    </section>
  );
}
