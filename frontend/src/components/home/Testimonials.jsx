import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import ScrollReveal from '../common/ScrollReveal';
import { testimonials } from '../../data/testimonials';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[activeIndex];

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeading
          badge="Verified Client Success"
          title="Loved by Growing Businesses Worldwide."
          subtitle="Discover how founders, restauranteurs, and agency owners transformed their digital presence with LOCAL2BRAND."
        />

        {/* Featured Testimonial Hero Glass Box with Zoom-In Scroll Reveal */}
        <ScrollReveal variant="zoom-in" delay={120} duration={750} className="mt-16 max-w-4xl mx-auto">
          <div className="glass-panel rounded-hero p-8 sm:p-12 border border-white dark:border-slate-700/80 shadow-floating relative">
            <Quote className="w-12 h-12 text-purple-500/15 dark:text-purple-400/20 absolute top-6 right-8 pointer-events-none" />

            {/* Rating stars */}
            <div className="flex items-center gap-1 text-amber-400 mb-6">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>

            {/* Quote text */}
            <p className="text-slate-800 dark:text-slate-100 text-lg sm:text-2xl font-medium leading-relaxed italic mb-8">
              "{current.quote}"
            </p>

            {/* Client Bio & Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {current.name}
                  </h4>
                  <p className="text-xs font-semibold l2b-gradient-text">
                    {current.role}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {current.business}
                  </p>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2">
                  {activeIndex + 1} / {testimonials.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Small Testimonial Cards Row with Staggered Fade-Up */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.slice(0, 3).map((item, idx) => (
            <ScrollReveal
              key={item.id}
              variant="fade-up"
              delay={idx * 100 + 200}
              duration={650}
            >
              <div
                onClick={() => setActiveIndex(idx)}
                className={`p-5 rounded-card cursor-pointer transition-all duration-200 h-full ${
                  activeIndex === idx
                    ? 'bg-white dark:bg-slate-900 shadow-glass border-2 border-purple-500/80 scale-102'
                    : 'glass-card hover:bg-white dark:hover:bg-slate-900/90 border border-white/80 dark:border-slate-700/70 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs line-clamp-2 italic mb-3">
                  "{item.quote}"
                </p>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {item.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {item.business}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
