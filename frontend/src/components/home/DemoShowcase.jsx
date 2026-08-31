import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Grid, Search } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import ScrollReveal from '../common/ScrollReveal';
import DemoCard from '../demos/DemoCard';
import { demoCategories, demoWebsites } from '../../data/demos';
import api from '../../services/api';

export default function DemoShowcase() {
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
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchDemos = async () => {
      try {
        const res = await api.get('/demos');
        if (res.success && Array.isArray(res.demos) && res.demos.length > 0) {
          setDemosList(res.demos);
          localStorage.setItem('l2b_cached_demos', JSON.stringify(res.demos));
        }
      } catch (err) {
        console.warn('Using default demo dataset fallback:', err);
      }
    };
    fetchDemos();
  }, []);

  const dynamicCategories = React.useMemo(() => {
    const cats = new Set(['All']);
    demosList.forEach((d) => {
      if (d.category) cats.add(d.category);
    });
    return Array.from(cats);
  }, [demosList]);

  const filteredDemos = activeCategory === 'All'
    ? demosList
    : demosList.filter((d) => d.category === activeCategory);

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <SectionHeading
          badge="Demo Website Showcase"
          title="Choose a Website. Make It Yours."
          subtitle="Explore battle-tested, high-converting website designs engineered for specific industries. Pick a design you love and our team will customize it for your brand in under 48 hours."
        />

        {/* Category Filters Bar with Fade-Up */}
        <ScrollReveal variant="fade-up" delay={100} duration={600}>
          <div className="mt-12 flex items-center justify-start sm:justify-center overflow-x-auto pb-4 pt-1 no-scrollbar gap-2">
            {dynamicCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md border border-transparent dark:border-slate-600'
                      : 'bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Demo Cards Grid with Staggered 3D Reveal */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDemos.slice(0, 6).map((demo, index) => (
            <ScrollReveal
              key={demo._id || demo.slug || demo.id}
              variant="fade-up"
              delay={index * 90}
              duration={700}
            >
              <DemoCard demo={demo} />
            </ScrollReveal>
          ))}
        </div>

        {/* View Entire Marketplace CTA */}
        <ScrollReveal variant="zoom-in" delay={200} duration={650} className="mt-14 text-center">
          <Link
            to="/demos"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-btn text-base font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-xl transition-all hover:opacity-95"
          >
            <span>Explore All Ready-Made Website Demos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Instant 48-hour delivery available on all showcase templates.
          </p>
        </ScrollReveal>

      </div>
    </section>
  );
}
