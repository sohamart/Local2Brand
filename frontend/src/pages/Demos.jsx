import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Filter, CheckCircle2, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { SEO } from '../components/common/CommonUI';
import DemoCard from '../components/demos/DemoCard';
import { demoCategories, demoWebsites } from '../data/demos';
import FinalCTA from '../components/home/FinalCTA';
import AshokaChakra from '../components/common/AshokaChakra';

export default function Demos() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDemos = useMemo(() => {
    return demoWebsites.filter((demo) => {
      const matchesCategory = activeCategory === 'All' || demo.category === activeCategory;
      const matchesSearch =
        demo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demo.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demo.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demo.idealFor.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      <SEO
        title="Ready-Made Website Templates & Demos — Fast 48h Delivery"
        description="Choose from our curated collection of ready-made website templates for restaurants, salons, agencies, real estate, e-commerce, and startups. Direct WhatsApp ordering."
      />

      <div className="pt-28 xs:pt-32 sm:pt-40 pb-20">

        {/* Page Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <AshokaChakra size={13} />
            <span>🇮🇳 Indian Business Ready • 48h Turnaround</span>
          </div>
          <SectionHeading
            badge="Live Template Marketplace"
            title="Website Templates"
            subtitle="Start with a battle-tested design you love. We'll customize it for your business in 48 hours."
          />

          {/* Quick Value Props */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              48-Hour Rapid Delivery
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              Starting from ₹9,999 / $399
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              100% Mobile & 4K Responsive
            </span>
          </div>

          {/* Search & Category Filter Control Center */}
          <div className="mt-8 sm:mt-10 max-w-4xl mx-auto space-y-4">

            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates by industry, feature, or keyword (e.g. Restaurant, Agency, Salon...)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 px-2 py-1 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Horizontal Filter Bar */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar justify-start sm:justify-center">
              {demoCategories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${isActive
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-sm'
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Templates Grid Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
          {filteredDemos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredDemos.map((demo) => (
                <DemoCard key={demo.id} demo={demo} />
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-hero p-12 text-center max-w-xl mx-auto border border-white space-y-4">
              <Sparkles className="w-10 h-10 text-purple-500 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">No matching templates found</h3>
              <p className="text-slate-600 text-sm">
                Can't find what you are looking for? We build 100% custom websites from scratch for any industry.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Global CTA */}
        <div className="mt-20">
          <FinalCTA />
        </div>

      </div>
    </>
  );
}
