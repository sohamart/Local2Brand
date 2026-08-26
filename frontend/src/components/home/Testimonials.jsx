import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
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
      {/* Subtle Ambient Section Glow */}
      <div className="section-glow section-glow-blue top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeading
          badge="Verified Client Success"
          title="Loved by Growing Businesses Worldwide."
          subtitle="Discover how founders, restauranteurs, and agency owners transformed their digital presence with LOCAL2BRAND."
        />

        {/* Featured Testimonial Hero Glass Box */}
        <div className="mt-16 max-w-4xl mx-auto glass-panel rounded-hero p-8 sm:p-12 border border-white shadow-floating relative">
          <Quote className="w-12 h-12 text-purple-500/15 absolute top-6 right-8 pointer-events-none" />

          {/* Rating stars */}
          <div className="flex items-center gap-1 text-amber-400 mb-6">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>

          {/* Quote text */}
          <p className="text-slate-800 text-lg sm:text-2xl font-medium leading-relaxed italic mb-8">
            "{current.quote}"
          </p>

          {/* Client Bio & Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-slate-200/60">
            <div className="flex items-center gap-4">
              <img
                src={current.avatar}
                alt={current.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {current.name}
                </h4>
                <p className="text-xs font-semibold l2b-gradient-text">
                  {current.role}
                </p>
                <p className="text-xs text-slate-500">
                  {current.business}
                </p>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm transition-all cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-slate-500 px-2">
                {activeIndex + 1} / {testimonials.length}
              </span>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm transition-all cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Small Testimonial Cards Row */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.slice(0, 3).map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`p-5 rounded-card cursor-pointer transition-all duration-200 ${activeIndex === idx
                  ? 'bg-white shadow-glass border-2 border-purple-500/80 scale-102'
                  : 'glass-card hover:bg-white border border-white/80 opacity-70 hover:opacity-100'
                }`}
            >
              <div className="flex items-center gap-1 text-amber-400 mb-2">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-xs line-clamp-2 italic mb-3">
                "{item.quote}"
              </p>
              <div className="text-xs font-bold text-slate-900 truncate">
                {item.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {item.business}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
