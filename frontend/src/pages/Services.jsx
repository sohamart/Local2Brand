import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Target,
  Palette,
  ShoppingBag,
  Code2,
  Check,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { SEO } from '../components/common/CommonUI';
import { agencyServices } from '../data/services';
import { useOrderModal } from '../context/OrderModalContext';
import FinalCTA from '../components/home/FinalCTA';
import AshokaChakra from '../components/common/AshokaChakra';
import { SEO_PAGES, BRAND } from '../config/seoConfig';
import api from '../services/api';

const serviceImages = {
  'business-websites': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
  'landing-pages': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  'portfolio-websites': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop',
  'ecommerce-solutions': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop',
  'custom-web-apps': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'
};

const iconMap = {
  Globe,
  Target,
  Palette,
  ShoppingBag,
  Code2
};

export default function Services() {
  const { openOrderModal } = useOrderModal();
  const [servicesList, setServicesList] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('l2b_cached_services');
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
    }
    return agencyServices;
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.success && Array.isArray(res.services) && res.services.length > 0) {
          const merged = res.services.map((s, idx) => {
            const staticMatch = agencyServices.find((as) => as.id === s.slug || as.title === s.title);
            return {
              ...(staticMatch || {}),
              ...s,
              id: s.slug || s._id || `srv_${idx}`,
              title: s.title,
              tagline: s.tagline || staticMatch?.tagline || 'High Performance Web Architecture',
              description: s.description || s.shortDesc || staticMatch?.description || '',
              features: Array.isArray(s.features) ? s.features : (s.features ? s.features.split(',') : (staticMatch?.features || [])),
              startingPriceInr: s.startingPriceInr || s.startingPrice || staticMatch?.startingPriceInr || staticMatch?.startingPrice || '₹9,999',
              turnaroundTime: s.turnaroundTime || staticMatch?.turnaroundTime || '48 Hours',
              idealFor: s.idealFor || staticMatch?.idealFor || 'Businesses & Entrepreneurs'
            };
          });
          setServicesList(merged);
          localStorage.setItem('l2b_cached_services', JSON.stringify(merged));
        }
      } catch (err) {
        console.warn('Using default agency services fallback:', err);
      }
    };
    fetchServices();
  }, []);

  // Generate Service Schema for Rich Results
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: servicesList.map((srv, idx) => ({
      '@type': 'Service',
      position: idx + 1,
      name: srv.title,
      description: srv.description,
      provider: {
        '@type': 'Organization',
        '@id': `${BRAND.domain}/#organization`,
        name: BRAND.name
      },
      offers: {
        '@type': 'Offer',
        price: srv.startingPriceInr ? srv.startingPriceInr.replace(/[^0-9]/g, '') : '9999',
        priceCurrency: 'INR'
      }
    }))
  };

  return (
    <>
      <SEO
        title={SEO_PAGES.services.title}
        description={SEO_PAGES.services.description}
        canonical={SEO_PAGES.services.canonical}
        schema={servicesSchema}
        breadcrumbs={[
          { name: 'Services', url: '/services' }
        ]}
      />

      <div className="page-header-offset pb-20">

        {/* Page Hero Header with Single Semantic H1 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <AshokaChakra size={13} />
            <span>🇮🇳 Indian Craft • Global Reach</span>
          </div>
          
          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50/80 dark:bg-brand-950/80 border border-brand-200/70 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider shadow-sm mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Tailored Engineering</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Web Development &amp; Digital Growth Services
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed pt-1">
              Everything you need to dominate your market online. High-converting digital storefronts and bespoke brand assets tailored for ambitious businesses.
            </p>
          </div>
        </div>

        {/* Services In-Depth List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 space-y-16 sm:space-y-24">
          {servicesList.map((service, index) => {
            const Icon = iconMap[service.iconName] || Globe;
            const isReversed = index % 2 !== 0;
            const imgUrl = serviceImages[service.id] || serviceImages['business-websites'];

            return (
              <article
                key={service.id}
                id={service.id}
                className="glass-panel rounded-3xl sm:rounded-hero p-5 sm:p-10 lg:p-14 border border-white dark:border-slate-700/80 shadow-floating relative overflow-hidden"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>

                  {/* Left Column: Details */}
                  <div className={`lg:col-span-6 space-y-5 sm:space-y-6 ${isReversed ? 'lg:order-2' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-100 dark:border-amber-500/40 flex items-center justify-center text-amber-800 dark:text-amber-300 shadow-sm shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                          Solution Tier 0{index + 1}
                        </span>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {service.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base font-semibold text-purple-600 dark:text-purple-400">
                      {service.tagline}
                    </p>

                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 sm:mb-3">
                        Key Deliverables Included:
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                        {service.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ideal For & Delivery Info */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Ideal For: </span>
                        <span className="text-slate-600 dark:text-slate-400">{service.idealFor}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-purple-700 dark:text-purple-400 shrink-0">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{service.turnaroundTime}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4">
                      <button
                        onClick={() => openOrderModal({
                          websiteType: service.title,
                          initialRequirements: `Interested in the ${service.title} service tier.`
                        })}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl sm:rounded-btn text-xs sm:text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 text-center"
                      >
                        <span>Get Started ({service.startingPriceInr || '₹9,999'})</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <Link
                        to="/demos"
                        className="w-full sm:w-auto px-5 py-3 rounded-2xl sm:rounded-btn text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-center flex items-center justify-center"
                      >
                        View Demo Templates
                      </Link>
                    </div>

                  </div>

                  {/* Right Column: Visual Mockup */}
                  <div className={`lg:col-span-6 ${isReversed ? 'lg:order-1' : ''}`}>
                    <div className="relative rounded-card overflow-hidden shadow-lg aspect-[16/11] bg-slate-100 dark:bg-slate-950 group border border-white dark:border-slate-800">
                      <img
                        src={imgUrl}
                        alt={`${service.title} - Weblets Service Showcase`}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                        <div className="text-white">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                            Starting from {service.startingPrice || service.startingPriceInr || '₹9,999'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Subtle bottom tricolor accent */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/50 via-blue-500/30 to-emerald-500/50" />
              </article>
            );
          })}
        </div>

        {/* Global CTA */}
        <div className="mt-24">
          <FinalCTA />
        </div>

      </div>
    </>
  );
}
