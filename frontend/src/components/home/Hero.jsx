import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ExternalLink,
  Globe,
  Zap,
  Star,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Utensils,
  Gem,
  Building2,
  Lock,
  Eye,
  Activity,
  ShieldCheck,
  GraduationCap,
  ShoppingBag
} from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import { useAuth } from '../../context/AuthContext';
import AshokaChakra from '../common/AshokaChakra';
import { getDemoBySlug } from '../../data/demos';
import api from '../../services/api';

const ICON_MAP = {
  GraduationCap,
  Utensils,
  Gem,
  Building2,
  Sparkles,
  Zap,
  Star,
  Globe,
  ShoppingBag,
  Activity,
  ShieldCheck,
  Eye,
  Lock
};

const getDynamicIcon = (iconName, category) => {
  if (iconName && ICON_MAP[iconName]) return ICON_MAP[iconName];
  if (!category) return Sparkles;
  const lower = category.toLowerCase();
  if (lower.includes('lms') || lower.includes('course') || lower.includes('edtech') || lower.includes('coaching')) return GraduationCap;
  if (lower.includes('restaurant') || lower.includes('food') || lower.includes('dine')) return Utensils;
  if (lower.includes('jewel') || lower.includes('gold') || lower.includes('bridal') || lower.includes('luxury')) return Gem;
  if (lower.includes('real') || lower.includes('estate') || lower.includes('hotel') || lower.includes('property')) return Building2;
  if (lower.includes('boutique') || lower.includes('fashion') || lower.includes('store') || lower.includes('ecommerce')) return ShoppingBag;
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('crossfit')) return Zap;
  if (lower.includes('salon') || lower.includes('spa') || lower.includes('beauty')) return Sparkles;
  if (lower.includes('dental') || lower.includes('health') || lower.includes('clinic')) return Activity;
  return Sparkles;
};

const GLOW_COLORS = [
  'rgba(59, 130, 246, 0.28)', // Blue
  'rgba(234, 179, 8, 0.28)',  // Amber
  'rgba(14, 165, 233, 0.28)', // Cyan
  'rgba(236, 72, 153, 0.28)', // Rose
  'rgba(147, 51, 234, 0.28)', // Purple
  'rgba(16, 185, 129, 0.28)'  // Emerald
];

const ACCENT_COLORS = [
  'from-blue-500/30 via-indigo-500/20 to-purple-500/30',
  'from-yellow-500/30 via-amber-500/20 to-emerald-500/30',
  'from-blue-500/30 via-cyan-500/20 to-indigo-500/30',
  'from-purple-500/30 via-pink-500/20 to-rose-500/30',
  'from-indigo-500/30 via-purple-500/20 to-pink-500/30',
  'from-emerald-500/30 via-teal-500/20 to-cyan-500/30'
];

const defaultHeroShowcases = [
  {
    id: 'lms',
    title: 'SkillCraft Pro LMS & Course Selling',
    shortName: 'LMS Platform',
    category: 'EdTech & Course Selling',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop',
    slug: 'lms',
    stat: 'Full-Stack EdTech',
    accentColor: 'from-blue-500/30 via-indigo-500/20 to-purple-500/30',
    glowColor: 'rgba(59, 130, 246, 0.28)',
    tag: 'Video Curriculum & Instant Checkout',
    rating: '5.0 ★ (78+ Reviews)',
    icon: GraduationCap,
    isPublished: true,
    liveUrl: 'https://stackadda.me'
  },
  {
    id: 'jewellery',
    title: 'Aurum Heritage Jewellery Atelier',
    shortName: 'Luxe Jewellery',
    category: 'Luxury Bridal & Gold',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop',
    slug: 'jewellery',
    stat: 'High Ticket',
    accentColor: 'from-yellow-500/30 via-amber-500/20 to-emerald-500/30',
    glowColor: 'rgba(234, 179, 8, 0.28)',
    tag: 'Custom Bridal & Gold Inquiries',
    rating: '5.0 ★ (64+ Reviews)',
    icon: Gem,
    isPublished: false,
    liveUrl: ''
  },
  {
    id: 'realestate',
    title: 'Elysian Prime Luxury Estates',
    shortName: 'Real Estate',
    category: 'Premium Real Estate',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
    slug: 'realestate',
    stat: 'Ultra Modern',
    accentColor: 'from-blue-500/30 via-cyan-500/20 to-indigo-500/30',
    glowColor: 'rgba(14, 165, 233, 0.28)',
    tag: 'Virtual Tours & High-Ticket Leads',
    rating: '4.9 ★ (39+ Reviews)',
    icon: Building2,
    isPublished: false,
    liveUrl: ''
  },
  {
    id: 'boutique',
    title: 'Zari & Silk Ethnic Fashion',
    shortName: 'Ethnic Boutique',
    category: 'Designer Haute Couture',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
    slug: 'boutique',
    stat: 'Fast Loading',
    accentColor: 'from-purple-500/30 via-pink-500/20 to-rose-500/30',
    glowColor: 'rgba(236, 72, 153, 0.28)',
    tag: 'Curated Lookbook & WhatsApp Buy',
    rating: '4.8 ★ (52+ Reviews)',
    icon: Sparkles,
    isPublished: false,
    liveUrl: ''
  }
];

const AUTO_SLIDE_INTERVAL = 6500; // 6.5 seconds for relaxed showcase viewing

export default function Hero() {
  const { openOrderModal } = useOrderModal();
  const { user, isAdmin, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Dynamic showcases loaded from cache or defaults
  const [showcases, setShowcases] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('l2b_cached_hero_demos');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item) => ({
              ...item,
              icon: getDynamicIcon(item.iconName, item.category)
            }));
          }
        } catch (e) {}
      }
    }
    return defaultHeroShowcases;
  });

  // Fetch dynamic demos from backend (filtered by isFeatured & sorted by heroOrder)
  useEffect(() => {
    const fetchHeroDemos = async () => {
      try {
        const res = await api.get('/demos');
        if (res.success && Array.isArray(res.demos) && res.demos.length > 0) {
          // Filter featured demos or fallback to top published demos
          const featured = res.demos
            .filter((d) => Boolean(d.isFeatured))
            .sort((a, b) => (a.heroOrder || a.order || 0) - (b.heroOrder || b.order || 0));

          const sourceList = featured.length > 0 ? featured : res.demos.slice(0, 4);

          const formatted = sourceList.map((d, idx) => {
            const staticMeta = getDemoBySlug(d.slug) || {};
            const defFallback = defaultHeroShowcases[idx % defaultHeroShowcases.length];

            return {
              id: d.slug || d._id || `demo_${idx}`,
              slug: d.slug,
              title: d.title,
              shortName: d.shortName || staticMeta.shortName || (d.title.split(' ')[0] + ' ' + (d.category?.split(' ')[0] || 'Demo')),
              category: d.category || staticMeta.category || 'Bespoke Website',
              image: d.thumbnail || d.heroImage || staticMeta.heroImage || defFallback.image,
              stat: d.heroStat || d.badge || staticMeta.badge || 'PRO READY',
              accentColor: d.accentColor || ACCENT_COLORS[idx % ACCENT_COLORS.length],
              glowColor: d.glowColor || GLOW_COLORS[idx % GLOW_COLORS.length],
              tag: d.heroTag || d.description || staticMeta.shortDescription || 'Interactive Demo Experience',
              rating: d.rating || `${staticMeta.rating || '5.0'} ★ (${staticMeta.reviewsCount || '50'}+ Reviews)`,
              icon: getDynamicIcon(d.iconName, d.category),
              iconName: d.iconName,
              liveUrl: d.liveUrl || staticMeta.liveUrl || '',
              isPublished: d.status === 'published' || staticMeta.isPublished
            };
          });

          setShowcases(formatted);
          localStorage.setItem('l2b_cached_hero_demos', JSON.stringify(formatted));
        }
      } catch (err) {
        console.warn('Hero dynamic showcases fallback active:', err);
      }
    };

    fetchHeroDemos();
  }, []);

  const handleStartWebsite = () => {
    navigate('/get-started');
  };

  // Liquid Waterdrop Pill Indicator State & Refs
  const tabContainerRef = useRef(null);
  const tabRefs = useRef([]);
  const [pillStyle, setPillStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0
  });

  const safeIndex = activeTab >= showcases.length ? 0 : activeTab;
  const current = showcases[safeIndex] || defaultHeroShowcases[0];
  const CurrentIcon = current.icon || Sparkles;

  // Auto-slide effect with pause on hover
  useEffect(() => {
    if (isPaused || showcases.length <= 1) return;

    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % showcases.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, showcases.length]);

  // Update dynamic moving liquid waterdrop pill position
  const updatePill = () => {
    const activeEl = tabRefs.current[safeIndex];
    if (activeEl) {
      setPillStyle({
        left: activeEl.offsetLeft,
        top: activeEl.offsetTop,
        width: activeEl.offsetWidth,
        height: activeEl.offsetHeight,
        opacity: 1
      });
    }
  };

  useEffect(() => {
    updatePill();
    const frameId = requestAnimationFrame(updatePill);
    const timeoutId = setTimeout(updatePill, 200);
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
    };
  }, [safeIndex, showcases]);

  // Recalculate on window resize
  useEffect(() => {
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [safeIndex, showcases]);

  // Handle tab selection without causing any scroll jump
  const handleTabSelect = (idx, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const currentScrollY = window.scrollY;
    setActiveTab(idx);

    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY);
    });
    setTimeout(() => {
      window.scrollTo(0, currentScrollY);
    }, 100);
  };

  const handleNext = () => {
    const currentScrollY = window.scrollY;
    setActiveTab((prev) => (prev + 1) % showcases.length);
    setTimeout(() => {
      window.scrollTo(0, currentScrollY);
    }, 50);
  };

  const handlePrev = () => {
    const currentScrollY = window.scrollY;
    setActiveTab((prev) => (prev - 1 + showcases.length) % showcases.length);
    setTimeout(() => {
      window.scrollTo(0, currentScrollY);
    }, 50);
  };

  return (
    <section className="relative page-header-offset pb-16 sm:pb-20 overflow-hidden">
      {/* Dynamic Ambient Hero Glow that shifts subtly with active tab */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[500px] rounded-full blur-[100px] pointer-events-none transition-all duration-1000 -z-10 opacity-60 dark:opacity-40"
        style={{
          background: `radial-gradient(circle, ${current.glowColor} 0%, rgba(121, 40, 202, 0.08) 50%, transparent 75%)`
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Pill Badge with Animated Ashoka Chakra */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm text-xs font-semibold text-slate-800 dark:text-slate-200 animate-float relative overflow-hidden">
            <span className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-500/40">
              <AshokaChakra size={13} />
              <span>Made in India</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Turn Local Indian Brands into Global Giants</span>
          </div>
        </div>

        {/* Hero Headline & Ultra-Minimal Copy */}
        <div className="text-center max-w-3xl mx-auto space-y-5 relative">
          {/* Radiant Title Spotlight Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[220px] sm:h-[300px] bg-gradient-to-r from-blue-500/20 via-purple-500/25 to-pink-500/20 dark:from-blue-500/30 dark:via-purple-500/40 dark:to-pink-500/30 rounded-full blur-[70px] pointer-events-none -z-10 animate-pulse-glow" />

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.08] relative z-10">
            We Build Websites That Turn{' '}
            <span className="l2b-gradient-text whitespace-nowrap">
              Local Brands
            </span>{' '}
            Into Big Brands.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-normal leading-relaxed relative z-10">
            World-class UI/UX design, sub-second performance, and instant lead capture for ambitious Indian businesses ready to scale globally.
          </p>

          {/* Minimal CTA Pair */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
            <button
              onClick={handleStartWebsite}
              className="w-full sm:w-auto px-8 py-3.5 rounded-btn text-sm sm:text-base font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer hover:opacity-95"
            >
              <span>Start Your Website</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/demos"
              className="w-full sm:w-auto px-7 py-3.5 rounded-btn text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Explore Demos</span>
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
            </Link>
          </div>

          {/* Micro Indian Trust Points */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full border border-slate-200/70 dark:border-slate-700/80 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Instant Callback & Proposal
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full border border-slate-200/70 dark:border-slate-700/80 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              INR (₹) & UPI Supported
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full border border-slate-200/70 dark:border-slate-700/80 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              48h Superfast Delivery
            </span>
          </div>

          {/* Animated Glowing 20% OFF Launch Offer Box */}
          <div className="pt-6">
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-3 sm:py-2.5 sm:px-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-amber-400/50 dark:border-amber-500/40 shadow-glass-highlight relative overflow-hidden group">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-900 text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                  🔥 Launch Offer
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Flat <strong className="text-amber-600 dark:text-amber-400">20% OFF</strong> + Free 1-Yr SSL & Domain
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-bold">
                  CODE: INDIA2025
                </span>
                <button
                  onClick={() => openOrderModal({ websiteType: 'Offer Code: INDIA2025 (20% OFF)' })}
                  className="px-3.5 py-1 rounded-lg text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:opacity-95 cursor-pointer"
                >
                  Claim ₹2,000 OFF
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500" />
            </div>
          </div>
        </div>

        {/* Sleek Ultra-Modern Showcase Frame with Dynamic Liquid Dock */}
        <div
          className="mt-14 sm:mt-16 max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Liquid Waterdrop Tab Switcher (Matching Top Navbar 3D Liquid Drop) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 px-1">
            <div
              ref={tabContainerRef}
              className="relative flex items-center p-1 sm:p-1.5 rounded-full bg-slate-200/50 dark:bg-black/45 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-inner overflow-x-auto max-w-full scrollbar-none"
            >
              {/* Animated iOS Liquid Waterdrop Pill Indicator with Glow Highlight */}
              <div
                className="ios-liquid-pill ios-liquid-glass absolute top-0 left-0 rounded-full pointer-events-none z-0"
                style={{
                  transform: `translate3d(${pillStyle.left}px, ${pillStyle.top}px, 0)`,
                  width: `${pillStyle.width}px`,
                  height: `${pillStyle.height}px`,
                  opacity: pillStyle.opacity
                }}
              >
                {/* Micro specular light highlight at the top of the pill */}
                <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-white dark:via-white/70 to-transparent" />
              </div>

              {/* Tab Buttons with Category Icons */}
              {showcases.map((item, idx) => {
                const isActive = safeIndex === idx;
                const IconComponent = item.icon || Sparkles;
                return (
                  <button
                    key={item.id || idx}
                    type="button"
                    ref={(el) => (tabRefs.current[idx] = el)}
                    onClick={(e) => handleTabSelect(idx, e)}
                    className={`relative z-10 flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-slate-950 dark:text-white font-bold scale-[1.02]'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    <IconComponent
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        isActive ? 'text-purple-600 dark:text-purple-400 scale-110' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span>{item.shortName || item.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Auto-Slide Status & Play/Pause Interactive Switch */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-xs text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer group"
                title={isPaused ? 'Resume auto slide' : 'Pause auto slide'}
              >
                {isPaused ? (
                  <>
                    <Play className="w-3 h-3 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <Pause className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                    <span>Auto-play</span>
                  </>
                )}
              </button>

              <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-3 py-1.5 rounded-xl border border-amber-200/60 dark:border-amber-500/40">
                <AshokaChakra size={13} />
                <span>Pan-India Live Engine</span>
              </div>
            </div>
          </div>

          {/* 3D Glass Mockup Browser Window Container with Glow */}
          <div className="relative group">
            {/* Ambient Backlight Glow that softly blooms on hover */}
            <div
              className="absolute -inset-1.5 rounded-[28px] sm:rounded-[36px] blur-xl opacity-40 dark:opacity-30 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none -z-10"
              style={{
                background: `linear-gradient(135deg, ${current.glowColor}, rgba(147, 51, 234, 0.25))`
              }}
            />

            {/* Main Outer Browser Window Frame */}
            <div className="relative bg-white dark:bg-slate-900 rounded-[24px] sm:rounded-[32px] border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-300">
              {/* 1. macOS Safari Styled Header Bar */}
              <div className="px-4 py-2.5 sm:py-3 bg-slate-100/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                {/* Left Traffic Light Dots */}
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-xs" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-xs" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-xs" />
                </div>

                {/* Center Dynamic URL Pill */}
                <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-mono text-slate-600 dark:text-slate-300 shadow-inner">
                  <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate max-w-[180px] sm:max-w-xs font-semibold">
                    local2brand.com/demos/{current.slug}
                  </span>
                  {(() => {
                    const currentDemoMeta = getDemoBySlug(current.slug) || getDemoBySlug(current.id);
                    const isLive = Boolean(
                      (current.isPublished || current.status === 'published') &&
                      (current.liveUrl || currentDemoMeta?.liveUrl)
                    );
                    return isLive ? (
                      <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold border border-emerald-200/70 dark:border-emerald-700/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        LIVE
                      </span>
                    ) : (
                      <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 text-[9px] font-bold border border-amber-200/70 dark:border-amber-700/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        COMING SOON
                      </span>
                    );
                  })()}
                </div>

                {/* Right Status Badge */}
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span className="hidden sm:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-700/40">
                    <Zap className="w-3 h-3" />
                    <span>99/100 Speed</span>
                  </span>
                </div>
              </div>

              {/* 2. Main Live Visual Area */}
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden select-none">
                {/* Continuous Smooth Progress Line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-black/30 z-30 overflow-hidden">
                  <div
                    key={safeIndex}
                    className={`h-full bg-gradient-to-r from-amber-400 via-blue-500 to-purple-500 ${
                      isPaused ? 'w-full opacity-30' : 'w-full animate-slide-progress'
                    }`}
                    style={{
                      animationDuration: `${AUTO_SLIDE_INTERVAL}ms`
                    }}
                  />
                </div>

                {/* Dynamic Showcase Visual Display */}
                {(() => {
                  const currentDemoMeta = getDemoBySlug(current.slug) || getDemoBySlug(current.id);
                  const isLiveReady = Boolean(
                    (current.isPublished || current.status === 'published') &&
                    (current.liveUrl || currentDemoMeta?.liveUrl)
                  );

                  return (
                    <div className="w-full h-full relative overflow-hidden select-none bg-slate-950">
                      {/* Active Showcase Image with Cinematic Ken-Burns Transition */}
                      <img
                        key={current.id || safeIndex}
                        src={current.image}
                        alt={current.title}
                        className="w-full h-full object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105 animate-in fade-in pointer-events-none select-none"
                      />

                      {/* Status Indicator Badge (Live vs Coming Soon) */}
                      {isLiveReady ? (
                        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 border border-emerald-300">
                          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                          <span>🟢 LIVE DEMO ONLINE</span>
                        </div>
                      ) : (
                        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] shadow-lg shadow-amber-500/20 border border-amber-300 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                          <span>COMING SOON</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Top-Left Floating 3D Micro Chip */}
                <div className="absolute top-4 left-4 z-20 hidden xs:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 backdrop-blur-xl border border-white/20 shadow-lg text-white text-xs font-semibold animate-float">
                  <CurrentIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{current.tag}</span>
                </div>

                {/* Navigation Chevrons */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 sm:px-4 pointer-events-none z-30 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/30 shadow-2xl transition-all duration-200 hover:scale-115 cursor-pointer active:scale-95 flex items-center justify-center group/arrow"
                    aria-label="Previous demo slide"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover/arrow:-translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/30 shadow-2xl transition-all duration-200 hover:scale-115 cursor-pointer active:scale-95 flex items-center justify-center group/arrow"
                    aria-label="Next demo slide"
                  >
                    <ChevronRight className="w-5 h-5 group-hover/arrow:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Rich Bottom Glass Banner */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent flex items-end p-4 sm:p-6 z-20 pointer-events-none">
                  <div className="text-white w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
                    <div className="pointer-events-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                          <AshokaChakra size={11} />
                          <span>{current.category}</span>
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-slate-200">
                          {current.stat}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-2xl font-extrabold leading-tight mt-1.5 text-white tracking-tight drop-shadow-md">
                        {current.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 pointer-events-auto">
                      {(() => {
                        const currentDemoMeta = getDemoBySlug(current.slug) || getDemoBySlug(current.id);
                        const isLiveReady = Boolean(
                          (current.isPublished || current.status === 'published') &&
                          (current.liveUrl || currentDemoMeta?.liveUrl)
                        );

                        return isLiveReady ? (
                          <Link
                            to={`/demos/${current.slug}`}
                            className="px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-xl transition-all duration-200 inline-flex items-center gap-2 group/btn hover:scale-102 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-purple-600" />
                            <span>View Live Demo</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover/btn:translate-x-0.5 transition-transform" />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              openOrderModal({
                                selectedDemo: current.title,
                                websiteType: `Pre-Order Template: ${current.title}`,
                                category: current.category,
                                initialRequirements: `I want to pre-order and launch the "${current.title}" (${current.category}) website.`
                              })
                            }
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all duration-200 inline-flex items-center gap-2 group/btn hover:scale-102 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                            <span>Pre-Order (Coming Soon)</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-950 group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Bottom Showcase Bar with Dot Indicators & Navigation */}
              <div className="px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Mini bottom Prev/Next controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      aria-label="Previous slide button"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      aria-label="Next slide button"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Dot Indicators */}
                  <div className="flex items-center gap-1.5">
                    {showcases.map((item, idx) => (
                      <button
                        key={item.id || idx}
                        type="button"
                        onClick={(e) => handleTabSelect(idx, e)}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                          safeIndex === idx
                            ? 'w-7 h-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 shadow-sm'
                            : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                        }`}
                        aria-label={`Switch to ${item.title}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span className="hidden xs:inline">Indian Business Ready</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">100% Customized For You</span>
                </div>
              </div>
            </div>

            {/* Indian Flag Tricolor Micro-Line Accent on Rim */}
            <div
              className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full pointer-events-none opacity-80"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,153,51,0.9) 0%, rgba(255,255,255,0.6) 30%, rgba(0,114,255,0.8) 50%, rgba(255,255,255,0.6) 70%, rgba(19,136,8,0.9) 100%)'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
