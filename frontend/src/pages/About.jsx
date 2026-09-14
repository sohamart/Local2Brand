import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe2, ShieldCheck, Zap, Heart, CheckCircle2, ArrowRight, Mail, Users } from 'lucide-react';
import { SEO } from '../components/common/CommonUI';
import { SEO_PAGES, BRAND } from '../config/seoConfig';
import ProcessTimeline from '../components/home/ProcessTimeline';
import FinalCTA from '../components/home/FinalCTA';
import { useOrderModal } from '../context/OrderModalContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import AshokaChakra from '../components/common/AshokaChakra';
import FounderCard from '../components/common/FounderCard';

export default function About() {
  const { openOrderModal } = useOrderModal();
  const { settings } = useSiteSettings();

  const founders = settings.aiSettings?.adminShowableDetails?.founders && settings.aiSettings.adminShowableDetails.founders.length > 0
    ? settings.aiSettings.adminShowableDetails.founders
    : [
        {
          name: 'Soham Dutta',
          role: 'Lead Architect & Full-Stack Systems',
          bio: 'Leading high-performance digital systems, reactive web engines, and automation pipelines.',
          instagram: 'https://instagram.com/sohamart',
          linkedin: 'https://linkedin.com/in/soham-dutta',
          email: 'contact@weblets.bond',
        },
        {
          name: 'Sayantan',
          role: 'Technical Lead & Frontend Engineering',
          bio: 'Engineering liquid-smooth interactive interfaces, responsive design, and glassmorphism styling.',
          instagram: '',
          linkedin: '',
          email: 'contact@weblets.bond',
        },
        {
          name: 'Achinta',
          role: 'Operations & Product Delivery Lead',
          bio: 'Orchestrating seamless client onboarding, rapid delivery pipelines, and quality execution.',
          instagram: '',
          linkedin: '',
          email: 'contact@weblets.bond',
        },
      ];

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: SEO_PAGES.about.title,
    description: SEO_PAGES.about.description,
    url: SEO_PAGES.about.canonical,
    mainEntity: {
      '@type': 'Organization',
      '@id': `${BRAND.domain}/#organization`,
      name: BRAND.name,
      description: BRAND.description,
      founder: BRAND.founders.map((f) => ({
        '@type': 'Person',
        name: f.name,
        jobTitle: f.jobTitle
      }))
    }
  };

  return (
    <>
      <SEO
        title={SEO_PAGES.about.title}
        description={SEO_PAGES.about.description}
        canonical={SEO_PAGES.about.canonical}
        schema={aboutSchema}
        breadcrumbs={[
          { name: 'About Us', url: '/about' }
        ]}
      />

      <div className="page-header-offset pb-20">

        {/* About Hero Header with Single Semantic H1 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-500/40 text-purple-900 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Digital Launch &amp; Engineering Studio</span>
          </div>
          
          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50/80 dark:bg-brand-950/80 border border-brand-200/70 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider shadow-sm mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Our Philosophy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              About Weblets — Lets make website together
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed pt-1">
              We exist to give entrepreneurs, creators, and businesses the same digital polish and technological edge enjoyed by global tech leaders.
            </p>
          </div>
        </div>

        {/* Narrative & Mission Glass Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
          <div className="glass-panel rounded-hero p-8 sm:p-12 lg:p-16 border border-white dark:border-slate-700/80 shadow-glass-lg grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden">

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Story Behind Weblets</span>
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                Every business deserves a world-class digital flagship.
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
                For years, business owners were forced to choose between clunky, slow DIY website builders or overpriced agencies that took months to deliver lackluster results.
              </p>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                We founded <strong>Weblets</strong> on a singular standard: combining Apple-inspired liquid glass aesthetics, sub-second PageSpeed performance, and a frictionless order system to launch client websites in 3 to 7 business days.
              </p>

              {/* Core Values Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Zero Template Sluggishness</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>GST &amp; Dual Currency Ready</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Direct WhatsApp Founders Line</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  <span>Lifetime Asset Ownership</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => openOrderModal({ websiteType: 'Agency Collaboration' })}
                  className="px-8 py-4 rounded-btn font-bold text-sm text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-xl transition-all inline-flex items-center gap-2 cursor-pointer hover:opacity-95"
                >
                  <span>Work With Us on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Showcase Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-card overflow-hidden shadow-floating border border-white dark:border-slate-800 aspect-[4/5] bg-slate-100 dark:bg-slate-950 group">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
                  alt="Weblets Digital Studio Engineering Team"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <AshokaChakra size={11} />
                    <span>Indian Engineering Powerhouse</span>
                  </div>
                  <h3 className="text-xl font-bold">120+ Digital Storefronts Delivered</h3>
                  <p className="text-xs text-slate-300 mt-1">From Mumbai to New York, London to Singapore.</p>
                </div>
              </div>
            </div>

            {/* Subtle bottom tricolor accent */}
            <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/60 via-blue-500/40 to-emerald-500/60" />
          </div>
        </div>

        {/* Dynamic Founders & Leadership Team Section */}
        {founders && founders.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Leadership &amp; Visionaries</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Meet the Founders &amp; Architects
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
                Direct access to the engineers and designers building your digital flagships.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {founders.map((founder, idx) => (
                <FounderCard key={idx} founder={founder} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Process Section */}
        <div className="mt-20">
          <ProcessTimeline />
        </div>

        {/* Global CTA */}
        <div className="mt-20">
          <FinalCTA />
        </div>

      </div>
    </>
  );
}
