import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Sparkles, Filter, CheckCircle2, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { SEO } from '../components/common/CommonUI';
import DemoCard from '../components/demos/DemoCard';
import ShareDemoModal from '../components/demos/ShareDemoModal';
import FinalCTA from '../components/home/FinalCTA';
import AshokaChakra from '../components/common/AshokaChakra';
import DashboardLoader from '../components/common/DashboardLoader';
import api from '../services/api';

export default function Demos() {
  const [demosList, setDemosList] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('l2b_cached_demos');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(demosList.length === 0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeShareDemo, setActiveShareDemo] = useState(null);

  const handleShare = useCallback((demo) => {
    setActiveShareDemo(demo);
  }, []);

  const fetchDemos = async () => {
    try {
      const res = await api.get('/demos');
      if (res.success && Array.isArray(res.demos)) {
        setDemosList(res.demos);
        localStorage.setItem('l2b_cached_demos', JSON.stringify(res.demos));
      }
    } catch (err) {
      console.warn('Error fetching demos from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  // Dynamically extract distinct categories from database demos and admin saved categories
  const dynamicCategories = useMemo(() => {
    const cats = new Set(['All']);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('l2b_admin_demo_categories');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            parsed.forEach((c) => {
              if (c && typeof c === 'string') cats.add(c.trim());
            });
          }
        } catch (e) {}
      }
    }
    demosList.forEach((d) => {
      if (d.category) cats.add(d.category.trim());
    });
    return Array.from(cats);
  }, [demosList]);

  const filteredDemos = useMemo(() => {
    return demosList.filter((demo) => {
      const matchesCategory = activeCategory === 'All' || demo.category === activeCategory;
      const matchesSearch =
        demo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demo.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (demo.features && demo.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [demosList, activeCategory, searchQuery]);

  return (
    <>
      <SEO
        title="Live Website Demos & Interactive Showcases — LOCAL2BRAND"
        description="Experience 100% live working websites for restaurants, salons, real estate, jewellery, boutiques, and gyms. Real-time menus, WhatsApp orders, and instant customization."
      />

      <div className="page-header-offset pb-20">

        {/* Page Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <AshokaChakra size={13} />
            <span>🇮🇳 100% Live Interactive Websites • 48h to 7 Days Delivery</span>
          </div>
          <SectionHeading
            badge="Live Interactive Demos"
            title="Explore Live Websites"
            subtitle="Click any live demo to test real menus, table bookings, WhatsApp ordering, property tours, and instant lead capture in real-time."
          />

          {/* Quick Value Props */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Full Working Functionality</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Direct WhatsApp Integration</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>Customized for Your Brand</span>
            </span>
          </div>

          {/* Search & Category Filter Control Center */}
          <div className="mt-8 sm:mt-10 max-w-4xl mx-auto space-y-4">

            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search live demos by industry (e.g. Restaurant, Jewellery, Real Estate, Salon, Gym...)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Glassmorphic Category Filter Control Bar (Anti-Clipping & Pro Styling) */}
            <div className="p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-glass-sm relative">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar px-1.5 scroll-smooth">
                {/* 1. Dedicated Master "All Templates" Button */}
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    activeCategory === 'All'
                      ? 'l2b-gradient-bg text-white shadow-md shadow-purple-500/30 ring-2 ring-purple-400/40'
                      : 'bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${activeCategory === 'All' ? 'text-amber-300' : 'text-purple-500 dark:text-purple-400'}`} />
                  <span>All Templates</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeCategory === 'All'
                        ? 'bg-white/20 text-white'
                        : 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50'
                    }`}
                  >
                    {demosList.length}
                  </span>
                </button>

                {/* 2. Individual Categories List */}
                {dynamicCategories
                  .filter((cat) => cat && cat !== 'All')
                  .map((cat) => {
                    const isActive = activeCategory === cat;
                    const count = demosList.filter((d) => d.category === cat).length;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md border border-purple-500/60 ring-2 ring-purple-500/30'
                            : 'bg-white/90 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200/80 dark:border-slate-800 shadow-2xs'
                        }`}
                      >
                        <span>{cat}</span>
                        {count > 0 && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>



          </div>
        </div>

        {/* Templates Grid Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
          {loading ? (
            <div className="py-20">
              <DashboardLoader title="Loading Live Websites..." />
            </div>
          ) : filteredDemos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredDemos.map((demo) => (
                <DemoCard
                  key={demo._id || demo.slug || demo.id}
                  demo={demo}
                  onShare={handleShare}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-hero p-12 text-center max-w-xl mx-auto border border-white dark:border-slate-700/80 space-y-4">
              <Sparkles className="w-10 h-10 text-purple-500 dark:text-purple-400 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No matching templates found</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Can't find what you are looking for? We build 100% custom websites from scratch for any industry.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Root Shared Modal for ultra-low DOM memory footprint */}
        {activeShareDemo && (
          <ShareDemoModal
            isOpen={Boolean(activeShareDemo)}
            onClose={() => setActiveShareDemo(null)}
            demo={activeShareDemo}
          />
        )}

        {/* Global CTA */}
        <div className="mt-20">
          <FinalCTA />
        </div>

      </div>
    </>
  );
}
