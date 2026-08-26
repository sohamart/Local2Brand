import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Grid, Search } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import DemoCard from '../demos/DemoCard';
import { demoCategories, demoWebsites } from '../../data/demos';

export default function DemoShowcase() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredDemos = activeCategory === 'All'
    ? demoWebsites
    : demoWebsites.filter((d) => d.category === activeCategory);

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle Ambient Section Glow */}
      <div className="section-glow section-glow-purple top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Demo Website Showcase"
          title="Choose a Website. Make It Yours."
          subtitle="Explore battle-tested, high-converting website designs engineered for specific industries. Pick a design you love and our team will customize it for your brand in under 48 hours."
        />

        {/* Category Filters Bar */}
        <div className="mt-12 flex items-center justify-start sm:justify-center overflow-x-auto pb-4 pt-1 no-scrollbar gap-2">
          {demoCategories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-sm'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Demo Cards Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDemos.slice(0, 6).map((demo) => (
            <DemoCard key={demo.id} demo={demo} />
          ))}
        </div>

        {/* View Entire Marketplace CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/demos"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-btn text-base font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-xl transition-all hover:opacity-95"
          >
            <span>Explore All Ready-Made Website Demos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-slate-500 mt-2">
            Instant 48-hour delivery available on all showcase templates.
          </p>
        </div>

      </div>
    </section>
  );
}
