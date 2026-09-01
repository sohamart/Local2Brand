import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Sparkles,
  MessageSquarePlus,
  CheckCircle2,
  ShieldCheck,
  Building,
  MapPin,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';
import WriteReviewModal from '../common/WriteReviewModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AshokaChakra from '../common/AshokaChakra';
import { testimonials as fallbackTestimonials } from '../../data/testimonials';

const AUTO_SLIDE_INTERVAL = 6500;

export default function Testimonials() {
  const { user, openAuthModal } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'best' | 'featured'
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState({
    avgRating: 5.0,
    totalCount: 0,
  });

  const timerRef = useRef(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews?sort=best');
      if (res && res.success && res.reviews && res.reviews.length > 0) {
        setReviews(res.reviews);
        setStats({
          avgRating: res.avgRating || 5.0,
          totalCount: res.totalCount || res.reviews.length,
        });
      } else {
        setReviews(fallbackTestimonials);
        setStats({ avgRating: 5.0, totalCount: fallbackTestimonials.length });
      }
    } catch (err) {
      setReviews(fallbackTestimonials);
      setStats({ avgRating: 5.0, totalCount: fallbackTestimonials.length });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Filter reviews
  const getFilteredReviews = () => {
    if (filterMode === 'featured') {
      const feat = reviews.filter((r) => r.isFeatured);
      return feat.length > 0 ? feat : reviews;
    }
    if (filterMode === 'best') {
      return [...reviews].sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }
    return reviews;
  };

  const displayedReviews = getFilteredReviews();
  const safeReviews = displayedReviews.length > 0 ? displayedReviews : fallbackTestimonials;
  const current = safeReviews[activeIndex % safeReviews.length] || safeReviews[0];

  // Auto slide timer
  useEffect(() => {
    if (isPaused || safeReviews.length <= 1) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeReviews.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, safeReviews.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? safeReviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % safeReviews.length);
  };

  const handleReviewButtonClick = () => {
    if (!user) {
      openAuthModal();
    } else {
      setIsWriteModalOpen(true);
    }
  };

  return (
    <section
      id="reviews"
      className="scroll-mt-28 pt-20 sm:pt-28 pb-16 sm:pb-24 relative overflow-hidden transition-colors duration-300 select-text"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* 1. Section Header (With ample top clearance to avoid floating navbar overlap) */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/90 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs">
            <AshokaChakra size={13} />
            <span>🇮🇳 100% Verified Indian Business Success Stories</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Loved by Founders &amp; Fast-Growing Brands{' '}
            <span className="l2b-gradient-text block sm:inline">Across India.</span>
          </h2>

          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Discover how restauranteurs, doctors, jewellery owners, and startups transformed their local presence into high-revenue digital brands with LOCAL2BRAND.
          </p>
        </div>

        {/* 2. Interactive Metric Summary & Filter Action Bar */}
        <ScrollReveal variant="fade-up" delay={60} duration={500}>
          <div className="max-w-4xl mx-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-glass-lg flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl">
            
            {/* Rating Metric Info */}
            <div className="flex items-center gap-3.5 w-full md:w-auto justify-center md:justify-start">
              <div className="px-3 py-2 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center gap-2 shadow-md shrink-0">
                <div className="flex flex-col items-center leading-none">
                  <span className="text-base sm:text-lg font-black leading-none">5.0</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter opacity-85 mt-0.5">RATING</span>
                </div>
                <div className="flex items-center gap-0.5 text-slate-950">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-slate-950 text-slate-950" />
                  ))}
                </div>
              </div>

              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {stats.avgRating || '5.0'} / 5.0 Rating
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-200 dark:border-emerald-700/60 flex items-center gap-1 shadow-2xs">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Verified Clients</span>
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Over {stats.totalCount || '150'}+ satisfied Indian business founders
                </p>
              </div>
            </div>

            {/* Filter Tabs & Write Review Button */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setFilterMode('all');
                    setActiveIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  🌟 All
                </button>
                <button
                  type="button"
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
                  ✨ Top Rated
                </button>
                <button
                  type="button"
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
                  🏆 Featured
                </button>
              </div>

              {/* Write Review CTA Button */}
              <button
                type="button"
                onClick={handleReviewButtonClick}
                className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-black text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>{user ? '✍️ Write a Review' : '✍️ Log In & Write Review'}</span>
              </button>
            </div>

          </div>
        </ScrollReveal>

        {/* 3. Featured Big Animated Testimonial Card */}
        {safeReviews.length > 0 && current && (
          <div
            className="mt-6 sm:mt-8 max-w-4xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-glass-lg relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl overflow-hidden transition-all duration-300">
              
              {/* Progress Line for Auto-slide */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  key={activeIndex}
                  className={`h-full bg-gradient-to-r from-amber-400 via-purple-500 to-pink-500 ${
                    isPaused ? 'w-full opacity-40' : 'w-full animate-slide-progress'
                  }`}
                  style={{ animationDuration: `${AUTO_SLIDE_INTERVAL}ms` }}
                />
              </div>

              <Quote className="w-10 sm:w-16 h-10 sm:h-16 text-purple-500/10 dark:text-purple-400/15 absolute top-5 right-5 sm:right-8 pointer-events-none" />

              {/* Top Meta: Stars, Rating Pill & Verified Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 sm:mb-6">
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-amber-400" />
                  ))}
                  <span className="text-xs font-black text-amber-700 dark:text-amber-300 ml-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-500/30">
                    {current.rating || 5}.0 ★
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-[10px] sm:text-[11px] font-bold shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Client Story</span>
                </div>
              </div>

              {/* Quote text */}
              <p className="text-slate-800 dark:text-slate-100 text-sm sm:text-lg lg:text-xl font-medium leading-relaxed italic mb-6 sm:mb-8">
                "{current.comment || current.quote}"
              </p>

              {/* Client Bio & Interactive Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 sm:pt-5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-base sm:text-lg shrink-0">
                    {current.avatar ? (
                      <img
                        src={current.avatar}
                        alt={current.userName || current.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span>{(current.userName || current.name || 'U')[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{current.userName || current.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    </h4>
                    <p className="text-[11px] sm:text-xs font-bold l2b-gradient-text">
                      {current.userRole || current.role || 'Business Founder'}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{current.businessName || current.business || 'Local Business'}</span>
                    </p>
                  </div>
                </div>

                {/* Slider Pagination Controls */}
                <div className="flex items-center gap-2 justify-end sm:justify-center">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-2 sm:p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-xs transition-all cursor-pointer active:scale-95"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 px-2 font-mono">
                    {(activeIndex % safeReviews.length) + 1} / {safeReviews.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2 sm:p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-xs transition-all cursor-pointer active:scale-95"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 4. Small Testimonial Cards Row (Responsive Grid & Staggered Cards) */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 max-w-5xl mx-auto">
          {safeReviews.slice(0, 3).map((item, idx) => {
            const isCardActive = (activeIndex % safeReviews.length) === idx;
            return (
              <div
                key={item._id || item.id || idx}
                onClick={() => setActiveIndex(idx)}
                className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 h-full flex flex-col justify-between ${
                  isCardActive
                    ? 'bg-white dark:bg-slate-900 shadow-glass-lg border-2 border-purple-500 scale-[1.02]'
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
                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed italic">
                    "{item.comment || item.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.userName || item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{(item.userName || item.name || 'U')[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.userName || item.name}
                    </h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {item.businessName || item.business || 'Business Owner'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSuccess={() => {
          setIsWriteModalOpen(false);
          fetchReviews();
        }}
      />
    </section>
  );
}
