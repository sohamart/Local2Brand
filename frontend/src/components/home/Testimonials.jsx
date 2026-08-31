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
    <section id="reviews-section" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <AshokaChakra size={13} />
            <span>🇮🇳 100% Verified Indian Business Success Stories</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Loved by Founders & Businesses{' '}
            <span className="l2b-gradient-text">Across India.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Discover how restauranteurs, doctors, jewellery owners, and startups turned their local presence into high-revenue digital brands with LOCAL2BRAND.
          </p>
        </div>

        {/* Interactive Metric Summary & Write Review Bar */}
        <ScrollReveal variant="fade-up" delay={80} duration={600}>
          <div className="max-w-4xl mx-auto p-4 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 backdrop-blur-xl">
            
            {/* Rating Metric Info */}
            <div className="flex items-center gap-3.5 w-full sm:w-auto justify-center sm:justify-start">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex flex-col items-center justify-center font-black shadow-md shrink-0">
                <span className="text-lg leading-none font-black">5.0</span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider mt-0.5">★ ★ ★ ★ ★</span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {stats.avgRating || '5.0'} / 5.0 Rating
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Verified Clients</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Over {stats.totalCount || '150'}+ satisfied Indian business founders
                </p>
              </div>
            </div>

            {/* Filter Tabs & Write Review Button */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 w-full sm:w-auto">
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
                  🌟 Top Rated
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
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-102"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>{user ? '✍️ Write a Review' : '✍️ Log In & Write Review'}</span>
              </button>
            </div>

          </div>
        </ScrollReveal>

        {/* Featured Main Testimonial Card */}
        {displayedReviews.length > 0 && current && (
          <ScrollReveal variant="zoom-in" delay={120} duration={750} className="mt-8 max-w-4xl mx-auto">
            <div className="rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-2xl relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
              <Quote className="w-12 sm:w-16 h-12 sm:h-16 text-purple-500/15 dark:text-purple-400/20 absolute top-5 right-6 sm:right-8 pointer-events-none" />

              {/* Top Meta: Stars & Verified Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-amber-400" />
                  ))}
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 ml-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-500/30">
                    {current.rating || 5}.0 ★
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Client Story</span>
                </div>
              </div>

              {/* Quote text */}
              <p className="text-slate-800 dark:text-slate-100 text-sm sm:text-xl font-medium leading-relaxed italic mb-6 sm:mb-8">
                "{current.comment || current.quote}"
              </p>

              {/* Client Bio & Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-purple-500/60 shadow-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-lg shrink-0">
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
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{current.userName || current.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    </h4>
                    <p className="text-xs font-bold l2b-gradient-text">
                      {current.userRole || current.role || 'Business Owner'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{current.businessName || current.business || 'Local Business'}</span>
                    </p>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2 justify-end sm:justify-center">
                  <button
                    onClick={handlePrev}
                    className="p-2 sm:p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 px-2 font-mono">
                    {activeIndex + 1} / {displayedReviews.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className="p-2 sm:p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all cursor-pointer"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Small Testimonial Cards Row (Mobile Friendly Staggered Grid) */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
          {displayedReviews.slice(0, 3).map((item, idx) => (
            <ScrollReveal
              key={item._id || item.id || idx}
              variant="fade-up"
              delay={idx * 80 + 150}
              duration={500}
            >
              <div
                onClick={() => setActiveIndex(idx)}
                className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 h-full flex flex-col justify-between ${
                  activeIndex === idx
                    ? 'bg-white dark:bg-slate-900 shadow-lg border-2 border-purple-500 scale-102'
                    : 'bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    {item.isFeatured && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-xs line-clamp-3 italic mb-3 leading-relaxed">
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
