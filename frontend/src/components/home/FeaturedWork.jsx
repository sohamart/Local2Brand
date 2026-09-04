import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Sparkles, TrendingUp, CheckCircle, Smartphone, Monitor, ShieldCheck, Zap } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import ScrollReveal from '../common/ScrollReveal';
import { demoWebsites } from '../../data/demos';
import { formatPriceByCountry } from '../../data/countryThemes';
import { useOrderModal } from '../../context/OrderModalContext';
import api from '../../services/api';

export default function FeaturedWork() {
  const userCountry = typeof window !== 'undefined' ? (localStorage.getItem('l2b_user_country') || 'India') : 'India';
  const { openOrderModal } = useOrderModal();
  const [featuredDemos, setFeaturedDemos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadFeaturedDemos = async () => {
      try {
        const res = await api.get('/demos');
        if (isMounted && res && res.success && Array.isArray(res.demos) && res.demos.length > 0) {
          // Filter demos marked as featured (or fallback to top published demos)
          const activeFeatured = res.demos
            .filter((d) => Boolean(d.isFeatured))
            .sort((a, b) => (a.heroOrder || a.order || 0) - (b.heroOrder || b.order || 0));

          if (activeFeatured.length > 0) {
            setFeaturedDemos(activeFeatured.slice(0, 4));
            return;
          }
          // If none explicitly marked as featured, show the top published ones
          setFeaturedDemos(res.demos.slice(0, 3));
          return;
        }
      } catch (err) {
        console.warn('Using fallback featured demos:', err);
      }

      if (isMounted) {
        // Fallback to local dataset
        const fallback = demoWebsites.filter((d) => d.isPublished || d.status === 'published');
        setFeaturedDemos(fallback.length > 0 ? fallback.slice(0, 3) : demoWebsites.slice(0, 3));
      }
    };

    loadFeaturedDemos();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeading
          badge="Ready-Made Live Demo Templates"
          title="Work That Speaks for Your Brand."
          subtitle="Explore our battle-tested, high-converting digital storefronts and platform templates ready for 48-hour deployment."
        />

        {/* Dynamic Demos Showcase Grid with Scroll Reveal */}
        <div className="mt-16 space-y-14">
          {featuredDemos.map((demo, index) => {
            const isReversed = index % 2 !== 0;
            const demoSlug = demo.slug || demo.id || 'lms';
            const demoImg = demo.thumbnail || demo.heroImage || demo.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400';
            const price = formatPriceByCountry(demo.priceInr || demo.price || 4999, userCountry);
            const turnaround = demo.turnaround || '2 - 4 Days';
            const features = Array.isArray(demo.features) ? demo.features : (demo.features ? [demo.features] : []);

            return (
              <ScrollReveal
                key={demo._id || demoSlug}
                variant={isReversed ? 'fade-left' : 'fade-right'}
                delay={index * 80}
                duration={800}
              >
                <div className="glass-panel rounded-hero p-5 sm:p-8 lg:p-10 border border-white dark:border-slate-800 shadow-glass transition-all duration-300 hover:shadow-glass-lg group">
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>

                    {/* Visual Preview / Live Studio Link */}
                    <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : ''}`}>
                      <Link
                        to={`/demos/${demoSlug}`}
                        className="block relative rounded-card overflow-hidden shadow-lg group aspect-[16/10] bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 transition-all hover:border-purple-500/50"
                        title={`Explore ${demo.title} in Live Studio`}
                      >
                        <img
                          src={demoImg}
                          alt={demo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400';
                          }}
                        />

                        {/* Top Badge Overlay */}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 shadow-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{demo.badge || 'PRO TEMPLATE'}</span>
                          </span>
                        </div>

                        {/* Hover Overlay with Live Preview Button */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                          <div className="flex items-center justify-between text-white">
                            <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-purple-600/90 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              <span>Open Interactive Live Studio</span>
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1">
                              <Monitor className="w-3.5 h-3.5" />
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Multi-Device Preview</span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Template Details & Actions */}
                    <div className={`lg:col-span-5 space-y-5 ${isReversed ? 'lg:order-1' : ''}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-200/60 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
                          {demo.category}
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" />
                          <span>{turnaround} Handover</span>
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                        {demo.title}
                      </h3>

                      {demo.heroTag ? (
                        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4" />
                          {demo.heroTag}
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          Production-grade architecture with 1-click ordering & customization.
                        </p>
                      )}

                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                        {demo.description || demo.shortDescription || 'Complete turnkey website package ready to deploy for your business with high-speed performance, clean responsive design, and SEO optimization.'}
                      </p>

                      {/* Features Checkpoints */}
                      {features.length > 0 && (
                        <div className="space-y-2 py-1">
                          {features.slice(0, 3).map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Price & Turnaround Row */}
                      <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Launch Investment</div>
                          <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline gap-2">
                            <span>{price}</span>
                            <span className="text-xs text-slate-400 line-through">₹9,999</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">20% OFF</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Includes</div>
                          <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Domain + SSL + Hosting</div>
                        </div>
                      </div>

                      {/* CTA Actions */}
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <Link
                          to={`/demos/${demoSlug}`}
                          className="px-5 py-2.5 rounded-btn text-xs font-bold text-white l2b-gradient-bg shadow-md hover:shadow-lg transition-all cursor-pointer hover:opacity-95 flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Explore Live Demo Studio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => openOrderModal({
                            selectedDemo: demo.title,
                            templateId: demoSlug,
                            category: demo.category || 'Website',
                            websiteType: `Website Template: ${demo.title}`,
                            price: price
                          })}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-btn text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm cursor-pointer"
                        >
                          <span>Order This Template</span>
                          <ExternalLink className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* View All Demos Link */}
        <ScrollReveal variant="fade-up" delay={200} duration={600} className="mt-14 text-center">
          <Link
            to="/demos"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-btn text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-glass transition-all hover:scale-[1.02]"
          >
            <span>Browse All 12+ Ready-Made Website Demos</span>
            <ArrowRight className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </Link>
        </ScrollReveal>

      </div>
    </section>
  );
}

