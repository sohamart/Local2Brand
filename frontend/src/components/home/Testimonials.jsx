import React, { useState, useEffect } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Sparkles,
  MessageSquarePlus,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import ScrollReveal from '../common/ScrollReveal';
import WriteReviewModal from '../common/WriteReviewModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AshokaChakra from '../common/AshokaChakra';
import { testimonials as fallbackTestimonials } from '../../data/testimonials';

export default function Testimonials() {
  const { user, openAuthModal } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filterMode, setFilterMode] = useState('best'); // 'best' | 'featured' | 'all'
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [stats, setStats] = useState({
    avgRating: 5.0,
    totalCount: 0,
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews?sort=best');
      if (res && res.success && res.reviews && res.reviews.length > 0) {
        setReviews(res.reviews);
        setStats({
          avgRating: res.avgRating || 4.9,
          totalCount: res.totalCount || res.reviews.length,
        });
      } else {
        // Fallback to static seed testimonials
        setReviews(fallbackTestimonials);
        setStats({ avgRating: 5.0, totalCount: fallbackTestimonials.length });
      }
    } catch (err) {
      console.warn('Testimonials load notice, using static fallback:', err.message);
      setReviews(fallbackTestimonials);
      setStats({ avgRating: 5.0, totalCount: fallbackTestimonials.length });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewButtonClick = () => {
    if (!user) {
      // Prompt user to log in if not logged in
      openAuthModal();
    } else {
      setIsWriteModalOpen(true);
    }
  };

  // Filter list based on selected tab
  const getFilteredReviews = () => {
    if (filterMode === 'featured') {
      const feat = reviews.filter((r) => r.isFeatured);
      return feat.length > 0 ? feat : reviews;
    }
    if (filterMode === 'best') {
      // 5-star reviews first
      return [...reviews].sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }
    return reviews;
  };

  const displayedReviews = getFilteredReviews();
  const current = displayedReviews[activeIndex] || displayedReviews[0] || {};

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? displayedReviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === displayedReviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="reviews-section" className="py-20 sm:py-28 relative overflow-hidden">
      
      {/* Background glowing gradient orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-500/10 dark:bg-pink-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <SectionHeading
          badge="Verified Client Success & Reviews"
          title="Loved by Growing Businesses Worldwide."
          subtitle="Discover how founders, restauranteurs, doctors, and agency owners scaled their revenue with LOCAL2BRAND."
        />

        {/* Overall Rating & Action Bar */}
        <ScrollReveal variant="fade-up" delay={80} duration={600} className="mt-8">
          <div className="glass-panel max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl border border-white dark:border-slate-800 shadow-glass flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
            
            {/* Rating Summary Left */}
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black text-xl shadow-xs">
                ⭐ {stats.avgRating || '5.0'}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 justify-center sm:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 ml-1">
                    {stats.avgRating || '5.0'} / 5.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Based on verified reviews from high-growth local businesses
                </p>
              </div>
            </div>

            {/* Filter Tabs & Write Review Button */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    setFilterMode('best');
                    setActiveIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterMode === 'best'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  🌟 Top Rated (5⭐)
                </button>
                <button
                  onClick={() => {
                    setFilterMode('featured');
                    setActiveIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterMode === 'featured'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  ✨ Featured
                </button>
              </div>

              {/* Write Review CTA Button */}
              <button
                onClick={handleReviewButtonClick}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>{user ? 'Write a Review' : 'Log In to Review'}</span>
              </button>
            </div>

          </div>
        </ScrollReveal>

        {/* Featured Testimonial Hero Glass Box */}
        {displayedReviews.length > 0 && current && (
          <ScrollReveal variant="zoom-in" delay={120} duration={750} className="mt-8 max-w-4xl mx-auto">
            <div className="glass-panel rounded-hero p-6 sm:p-10 border border-white dark:border-slate-700/80 shadow-floating relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl">
              <Quote className="w-14 h-14 text-purple-500/15 dark:text-purple-400/20 absolute top-6 right-8 pointer-events-none" />

              {/* Top Meta: Stars & Verified Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 ml-1.5 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-500/30">
                    {current.rating || 5}.0 ★
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Client Story</span>
                </div>
              </div>

              {/* Quote text */}
              <p className="text-slate-800 dark:text-slate-100 text-base sm:text-2xl font-medium leading-relaxed italic mb-8">
                "{current.comment || current.quote}"
              </p>

              {/* Client Bio & Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500/60 shadow-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-lg shrink-0">
                    {current.avatar ? (
                      <img
                        src={current.avatar}
                        alt={current.userName || current.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{(current.userName || current.name || 'U')[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{current.userName || current.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-purple-500 inline" />
                    </h4>
                    <p className="text-xs font-semibold l2b-gradient-text">
                      {current.userRole || current.role || 'Business Owner'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{current.businessName || current.business || 'Local Business'}</span>
                    </p>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={handlePrev}
                    className="p-2.5 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 px-2">
                    {activeIndex + 1} / {displayedReviews.length}
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
        )}

        {/* Small Testimonial Cards Row (Staggered Grid with Best Reviews) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {displayedReviews.slice(0, 3).map((item, idx) => (
            <ScrollReveal
              key={item._id || item.id || idx}
              variant="fade-up"
              delay={idx * 100 + 200}
              duration={650}
            >
              <div
                onClick={() => setActiveIndex(idx)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 h-full flex flex-col justify-between ${
                  activeIndex === idx
                    ? 'bg-white dark:bg-slate-900 shadow-glass border-2 border-purple-500 scale-102'
                    : 'glass-card hover:bg-white dark:hover:bg-slate-900/90 border border-white/80 dark:border-slate-700/70 opacity-75 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    {item.isFeatured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-xs line-clamp-3 italic mb-4 leading-relaxed">
                    "{item.comment || item.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.userName || item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{(item.userName || item.name || 'U')[0]}</span>
                    )}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.userName || item.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {item.businessName || item.business || item.userRole || item.role}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSuccess={() => {
          fetchReviews();
        }}
      />
    </section>
  );
}
