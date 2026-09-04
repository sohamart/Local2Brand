import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Share2,
  CheckCircle,
  Check,
  RefreshCw,
  Globe,
  Lock,
  Star,
  X,
  ArrowRight,
  CheckCircle2,
  Send,
  Layers,
  Rocket,
  PhoneCall
} from 'lucide-react';
import { toast } from 'react-toastify';
import AshokaChakra from '../components/common/AshokaChakra';
import ThemeToggle from '../components/common/ThemeToggle';
import { useOrderModal } from '../context/OrderModalContext';
import { useAuth } from '../context/AuthContext';
import ShareDemoModal from '../components/demos/ShareDemoModal';
import DashboardLoader from '../components/common/DashboardLoader';
import { formatPriceByCountry } from '../data/countryThemes';
import api from '../services/api';

// Reliable Built-in Fallbacks for Instant Resilient Load
const FALLBACK_DEMOS = {
  lms: {
    _id: 'demo_lms',
    title: 'SkillCraft Pro LMS & Online Course Selling Platform',
    slug: 'lms',
    category: 'LMS & Courses',
    price: '$199',
    priceInr: '₹6,999',
    turnaround: '3 - 7 Days',
    isPublished: true,
    status: 'published',
    rating: '5.0 ★ (78+ Reviews)',
    liveUrl: 'https://skillcraft-lms-demo.vercel.app',
    heroImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop',
    description: 'Complete full-stack LMS & video course selling platform with curriculum player, student dashboard, quiz engine, and 1-click checkout.',
    features: ['Full Video Lecture Player', 'Student Dashboard with Progress', '1-Click Course Checkout', 'Certificate Generation']
  },
  restaurant: {
    _id: 'demo_restaurant',
    title: 'Royal Nawabi Fine Dining & Table Reservation Hub',
    slug: 'restaurant',
    category: 'Restaurant',
    price: '$149',
    priceInr: '₹5,999',
    turnaround: '2 - 4 Days',
    isPublished: true,
    status: 'published',
    rating: '5.0 ★ (64+ Reviews)',
    liveUrl: 'https://royal-nawabi-demo.vercel.app',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop',
    description: 'Ultra-luxurious restaurant web app with digital dynamic food menus, online table reservation, takeaway delivery, and chef specials.',
    features: ['Digital Interactive Food Menu', 'Online Table Booking System', 'WhatsApp Takeaway Orders', 'Chef Specials Showcase']
  },
  cafe: {
    _id: 'demo_cafe',
    title: 'Velvet Roast Artisan Café & Bakery Experience',
    slug: 'cafe',
    category: 'Cafe',
    price: '$129',
    priceInr: '₹4,999',
    turnaround: '2 - 3 Days',
    isPublished: true,
    status: 'published',
    rating: '4.9 ★ (36+ Reviews)',
    liveUrl: 'https://velvet-roast-demo.vercel.app',
    heroImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1400&auto=format&fit=crop',
    description: 'Aesthetic café website designed for coffee shops, bakeries, and brunch spots with signature brew lookbooks and fast takeout funnel.',
    features: ['Aesthetic Visual Menu & Coffee Brews', 'Takeout Pickup Ordering', 'Instagram Feed Embed', 'Google Maps Store Locator']
  },
  salon: {
    _id: 'demo_salon',
    title: 'Aura Luxe Unisex Luxury Salon & Spa Studio',
    slug: 'salon',
    category: 'Salon',
    price: '$149',
    priceInr: '₹5,499',
    turnaround: '2 - 4 Days',
    isPublished: true,
    status: 'published',
    rating: '4.9 ★ (52+ Reviews)',
    liveUrl: 'https://aura-luxe-salon-demo.vercel.app',
    heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1400&auto=format&fit=crop',
    description: 'Premium beauty salon & wellness spa portal with stylist portfolios, service rate-cards, and instant appointment booking.',
    features: ['Stylist Portfolio & Reviews', 'Service Rate-Card with Duration', 'Appointment Booking Calendar', 'WhatsApp Booking Sync']
  },
  gym: {
    _id: 'demo_gym',
    title: 'IronForge Elite Fitness & CrossFit Club',
    slug: 'gym',
    category: 'Gym',
    price: '$159',
    priceInr: '₹5,999',
    turnaround: '3 - 5 Days',
    isPublished: false,
    status: 'coming_soon',
    rating: '4.8 ★ (29+ Reviews)',
    liveUrl: '',
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop',
    description: 'High-energy fitness club web experience with membership tier pricing, trainer rosters, class schedules, and trial pass booking.',
    features: ['Membership Tier Calculator', 'Live Class Weekly Schedule', 'Trainer Profiles', 'Free 1-Day Trial Pass']
  },
  hotel: {
    _id: 'demo_hotel',
    title: 'Grand Heritage Palace Resort & Luxury Suites',
    slug: 'hotel',
    category: 'Hotel',
    price: '$249',
    priceInr: '₹8,999',
    turnaround: '4 - 7 Days',
    isPublished: false,
    status: 'coming_soon',
    rating: '4.9 ★ (43+ Reviews)',
    liveUrl: '',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop',
    description: 'Grand resort & hotel website with 360 room showcases, seasonal tariff cards, amenities, and direct room booking engine.',
    features: ['Room Categories & Tariff Grid', 'Virtual 360 Suite Tours', 'Direct Booking Enquiry Form', 'Local Concierge Guide']
  },
  real_estate: {
    _id: 'demo_real_estate',
    title: 'PrimeEstate Luxury Villas & Commercial Realty',
    slug: 'real_estate',
    category: 'Real Estate',
    price: '$279',
    priceInr: '₹9,999',
    turnaround: '4 - 7 Days',
    isPublished: false,
    status: 'coming_soon',
    rating: '5.0 ★ (39+ Reviews)',
    liveUrl: '',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop',
    description: 'Modern real estate property portal with property filters, floor plans, neighborhood insights, and broker lead captures.',
    features: ['Interactive Property Search & Filters', 'High-Res Floor Plans', 'EMI & Loan Calculator', 'Instant Site Visit Booking']
  }
};

export default function LiveDemoViewer() {
  const params = useParams();
  const rawId = params.slug || params.templateId || '';
  const cleanId = (rawId || '').toLowerCase().trim();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { openOrderModal } = useOrderModal();
  const { user } = useAuth();

  // Desktop PC Viewport Mode: 'desktop' (1240px), 'tablet' (768px), 'mobile' (390px), 'full' (100%)
  const [pcDeviceMode, setPcDeviceMode] = useState('desktop');

  // Dedicated Mobile Device Viewport Mode: 'mobile' (Native 100%), 'tablet' (768px 4:5 ratio), 'desktop' (1280px 16:9 widescreen)
  const [mobileDeviceMode, setMobileDeviceMode] = useState('mobile');

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isOrderCardOpen, setIsOrderCardOpen] = useState(false);
  const [isSpecsDrawerOpen, setIsSpecsDrawerOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);

  // Mobile Dimension Tracking
  const mobileContainerRef = useRef(null);
  const [mobileDimensions, setMobileDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 360,
    height: typeof window !== 'undefined' ? window.innerHeight - 110 : 600
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (mobileContainerRef.current) {
        const rect = mobileContainerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setMobileDimensions({
            width: rect.width,
            height: rect.height
          });
          return;
        }
      }
      setMobileDimensions({
        width: typeof window !== 'undefined' ? window.innerWidth : 360,
        height: typeof window !== 'undefined' ? window.innerHeight - 110 : 600
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Compute scale for authentic proportional aspect ratios on Mobile
  const mobileTargetW = mobileDeviceMode === 'desktop' ? 1280 : mobileDeviceMode === 'tablet' ? 768 : 390;
  const mobileTargetH = mobileDeviceMode === 'desktop' ? 720 : mobileDeviceMode === 'tablet' ? 960 : 700;

  const scaleW = (mobileDimensions.width - 12) / mobileTargetW;
  const scaleH = (mobileDimensions.height - 12) / mobileTargetH;
  const mobileScale = Math.min(scaleW, scaleH, 1);

  // Quick order mini form state
  const [quickOrderForm, setQuickOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: '',
    notes: ''
  });
  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);
  const [quickOrderSuccess, setQuickOrderSuccess] = useState(null);

  // Template Data State
  const [activeDemo, setActiveDemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Synchronize User info to Quick Form
  useEffect(() => {
    if (user) {
      setQuickOrderForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  // Fetch Template from Database
  useEffect(() => {
    let isMounted = true;
    const fetchDemoData = async () => {
      if (!cleanId) {
        setFetchError('No template specified');
        setLoading(false);
        return;
      }

      setLoading(true);
      setFetchError('');

      const normKey = cleanId.replace(/-/g, '_');
      const staticMatch = FALLBACK_DEMOS[cleanId] || FALLBACK_DEMOS[normKey];

      try {
        const res = await api.get(`/demos/${cleanId}`);
        if (isMounted) {
          if (res && res.success && res.demo) {
            setActiveDemo(res.demo);
          } else if (staticMatch) {
            setActiveDemo(staticMatch);
          } else {
            setFetchError(`Website template '${cleanId}' was not found.`);
          }
        }
      } catch (err) {
        if (isMounted) {
          if (staticMatch) {
            setActiveDemo(staticMatch);
          } else {
            setFetchError(`Unable to load template '${cleanId}'.`);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDemoData();
    return () => {
      isMounted = false;
    };
  }, [cleanId]);

  // Launch Full Comprehensive Requirement Builder Modal
  const handleLaunchRequirementModal = () => {
    if (!activeDemo) return;
    setIsOrderCardOpen(false);
    openOrderModal({
      ...activeDemo,
      selectedDemo: activeDemo.title,
      templateId: activeDemo.slug || activeDemo.id || cleanId,
      slug: activeDemo.slug || activeDemo.id || cleanId,
      category: activeDemo.category || 'Website',
      flow: 'template',
      websiteType: `Website Template: ${activeDemo.title}`,
      initialRequirements: `I want to order and customize the "${activeDemo.title}" (${activeDemo.category || 'Website'}) template for my brand.`,
      price: activeDemo.priceInr || activeDemo.price,
      autoApplyOffer: true,
      promoCode: 'INDIA2025',
      discountPercent: 20
    });
  };

  const handleReload = () => {
    setIsLoadingIframe(true);
    setIframeKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <DashboardLoader title="Loading Live Preview..." role="client" />
      </div>
    );
  }

  if (fetchError || !activeDemo) {
    return (
      <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center transition-colors">
        <div className="max-w-md p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-500 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Template Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {fetchError || `The demo '${cleanId}' could not be retrieved.`}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link
              to="/demos"
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm"
            >
              Browse All Demos
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userCountry = typeof window !== 'undefined' ? (localStorage.getItem('l2b_user_country') || 'India') : 'India';
  const liveUrl = activeDemo.liveUrl || '';
  const priceDisplay = formatPriceByCountry(activeDemo.priceInr || activeDemo.price || 4999, userCountry);
  const hasLiveUrl = (activeDemo.isPublished || activeDemo.status === 'published') && Boolean(liveUrl);

  return (
    <div className="h-screen h-[100dvh] w-screen overflow-hidden bg-slate-100 dark:bg-[#06080e] text-slate-900 dark:text-slate-100 flex flex-col select-none transition-colors duration-200">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER (MOBILE DEDICATED SWITCHER & PC STUDIO CONTROLS) */}
      {/* ========================================================================= */}
      <header className="h-12 px-2.5 sm:px-5 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between shrink-0 z-40 relative">
        {/* Animated Premium Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] animated-premium-border pointer-events-none opacity-90 shadow-sm" />

        {/* Left: Back & Title Meta */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <Link
            to="/demos"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors shrink-0 border border-slate-200 dark:border-slate-800"
            title="Return to marketplace"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="flex items-center gap-1 min-w-0">
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[90px] xs:max-w-[130px] sm:max-w-[240px]">
              {activeDemo.title}
            </span>
            
            <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
              {activeDemo.category}
            </span>

            {hasLiveUrl ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden xs:inline">Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 shrink-0">
                <Rocket className="w-3 h-3 text-amber-500" />
                <span className="hidden xs:inline">Coming Soon</span>
              </span>
            )}
          </div>
        </div>

        {/* Center: Device Switchers */}
        {hasLiveUrl && (
          <>
            {/* 1. MOBILE-ONLY DEDICATED DEVICE SWITCHER (md:hidden) */}
            <div className="flex md:hidden items-center gap-0.5 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setMobileDeviceMode('mobile')}
                className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  mobileDeviceMode === 'mobile'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title="Mobile View (Native 100%)"
              >
                <Smartphone className="w-3 h-3" />
                <span>Mobile</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileDeviceMode('tablet')}
                className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  mobileDeviceMode === 'tablet'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title="Tablet View (768px Proportions)"
              >
                <Tablet className="w-3 h-3" />
                <span>Tab</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileDeviceMode('desktop')}
                className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  mobileDeviceMode === 'desktop'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title="Desktop View (1280px Widescreen)"
              >
                <Monitor className="w-3 h-3" />
                <span>PC</span>
              </button>
            </div>

            {/* 2. PC-ONLY DESKTOP STUDIO DEVICE SWITCHER (hidden md:flex) */}
            <div className="hidden md:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setPcDeviceMode('desktop')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  pcDeviceMode === 'desktop'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Desktop View (1240px Wide)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setPcDeviceMode('tablet')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  pcDeviceMode === 'tablet'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>

              <button
                type="button"
                onClick={() => setPcDeviceMode('mobile')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  pcDeviceMode === 'mobile'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Mobile View (390px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>

              <button
                type="button"
                onClick={() => setPcDeviceMode('full')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  pcDeviceMode === 'full'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Full Page (100% Fluid)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full</span>
              </button>
            </div>
          </>
        )}

        {/* Right: Actions, Live Preview, Share, Theme */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {hasLiveUrl && (
            <button
              onClick={handleReload}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
              title="Reload live website"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingIframe ? 'animate-spin text-purple-600' : ''}`} />
            </button>
          )}

          {/* Full Screen Live Preview External Link */}
          {hasLiveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
              title="Open full website in external tab"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Preview</span>
              <ExternalLink className="w-3 h-3 text-blue-200" />
            </a>
          )}

          {/* Share */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title="Share Demo Link"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN PREVIEW VIEWPORT (SEPARATE MOBILE & DESKTOP ENGINES) */}
      {/* ========================================================================= */}
      <main
        ref={mobileContainerRef}
        className="flex-1 min-h-0 w-full relative overflow-hidden bg-slate-200/50 dark:bg-[#07090e] flex items-center justify-center p-2 sm:p-4"
      >
        {/* Subtle ambient light gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        {hasLiveUrl ? (
          <>
            {/* ========================================================================= */}
            {/* A. MOBILE DEVICES: SEPARATE PROPORTIONAL ENGINE (md:hidden) */}
            {/* ========================================================================= */}
            <div className="w-full h-full flex flex-col items-center justify-center md:hidden overflow-hidden">
              {mobileDeviceMode === 'mobile' ? (
                /* Native Mobile Fluid Preview */
                <div className="w-full h-full relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                  {isLoadingIframe && (
                    <div className="absolute inset-0 bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-2 z-10">
                      <div className="w-7 h-7 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                      <span className="text-xs font-semibold text-slate-500">Loading website...</span>
                    </div>
                  )}
                  <iframe
                    key={`${activeDemo.slug}-mob-native-${iframeKey}`}
                    src={liveUrl}
                    title={activeDemo.title}
                    className="w-full h-full border-0 bg-white"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setIsLoadingIframe(false)}
                  />
                </div>
              ) : mobileDeviceMode === 'tablet' ? (
                /* Authentic iPad Tablet Frame (768x1024 - 3:4 Aspect Ratio) */
                <div className="flex flex-col items-center justify-center m-auto max-w-full max-h-full">
                  <div className="mb-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/60 backdrop-blur-md flex items-center gap-1.5 text-[10px] font-mono text-purple-300 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    <span>iPad Tablet View • 768×1024</span>
                  </div>

                  {(() => {
                    const tabW = 768;
                    const tabH = 1024;
                    const scale = Math.min(
                      (mobileDimensions.width - 24) / tabW,
                      (mobileDimensions.height - 44) / tabH,
                      1
                    );
                    const dispW = Math.round(tabW * scale);
                    const dispH = Math.round(tabH * scale);

                    return (
                      <div
                        className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-slate-800 bg-slate-950 shrink-0"
                        style={{
                          width: `${dispW}px`,
                          height: `${dispH}px`
                        }}
                      >
                        {isLoadingIframe && (
                          <div className="absolute inset-0 bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-2 z-10">
                            <div className="w-7 h-7 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                            <span className="text-xs font-semibold text-slate-500">Loading tablet preview...</span>
                          </div>
                        )}
                        <div
                          style={{
                            width: `${tabW}px`,
                            height: `${tabH}px`,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                            position: 'absolute',
                            top: 0,
                            left: 0
                          }}
                          className="bg-white overflow-hidden"
                        >
                          <iframe
                            key={`${activeDemo.slug}-mob-tablet-${iframeKey}`}
                            src={liveUrl}
                            title={activeDemo.title}
                            className="w-full h-full border-0 bg-white"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => setIsLoadingIframe(false)}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* Authentic 16:9 Widescreen Desktop PC Monitor Frame (1280x720) */
                <div className="flex flex-col items-center justify-center m-auto max-w-full max-h-full">
                  <div className="mb-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/60 backdrop-blur-md flex items-center gap-1.5 text-[10px] font-mono text-blue-300 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span>PC Desktop 16:9 • 1280×720</span>
                  </div>

                  {(() => {
                    const pcW = 1280;
                    const pcH = 720;
                    const scale = Math.min(
                      (mobileDimensions.width - 24) / pcW,
                      (mobileDimensions.height - 44) / pcH,
                      1
                    );
                    const dispW = Math.round(pcW * scale);
                    const dispH = Math.round(pcH * scale);

                    return (
                      <div
                        className="relative overflow-hidden rounded-xl shadow-2xl border-4 border-slate-800 bg-slate-950 shrink-0"
                        style={{
                          width: `${dispW}px`,
                          height: `${dispH}px`
                        }}
                      >
                        {isLoadingIframe && (
                          <div className="absolute inset-0 bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-2 z-10">
                            <div className="w-7 h-7 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                            <span className="text-xs font-semibold text-slate-500">Loading PC preview...</span>
                          </div>
                        )}
                        <div
                          style={{
                            width: `${pcW}px`,
                            height: `${pcH}px`,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                            position: 'absolute',
                            top: 0,
                            left: 0
                          }}
                          className="bg-white overflow-hidden"
                        >
                          <iframe
                            key={`${activeDemo.slug}-mob-desktop-${iframeKey}`}
                            src={liveUrl}
                            title={activeDemo.title}
                            className="w-full h-full border-0 bg-white"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => setIsLoadingIframe(false)}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* B. PC / DESKTOP SCREENS: CENTERED STUDIO CHASSIS WITH DEVICE SWITCHER (hidden md:flex) */}
            {/* ========================================================================= */}
            <div className="hidden md:flex w-full h-full items-center justify-center">
              {pcDeviceMode === 'full' ? (
                /* Full Fluid 100% Edge-to-Edge */
                <div className="w-full h-full relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 flex flex-col">
                  {isLoadingIframe && (
                    <div className="absolute inset-0 bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-2 z-10">
                      <div className="w-7 h-7 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                      <span className="text-xs font-semibold text-slate-500">Loading website...</span>
                    </div>
                  )}
                  <iframe
                    key={`${activeDemo.slug}-pcfull-${iframeKey}`}
                    src={liveUrl}
                    title={activeDemo.title}
                    className="w-full h-full border-0 bg-white"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setIsLoadingIframe(false)}
                  />
                </div>
              ) : (
                /* Desktop (1240px) / Tablet (768px) / Mobile (390px) Centered Browser Chassis */
                <div
                  className={`h-full w-full mx-auto flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-300/80 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 ${
                    pcDeviceMode === 'desktop'
                      ? 'max-w-[1240px]'
                      : pcDeviceMode === 'tablet'
                      ? 'max-w-[768px]'
                      : 'max-w-[390px]'
                  }`}
                >
                  {/* Sleek Browser Top Bar */}
                  <div className="h-9 px-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    
                    <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 truncate max-w-sm shadow-2xs">
                      <Lock className="w-3 h-3 text-emerald-500" />
                      <span className="truncate">{liveUrl.replace('https://', '')}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                      <span>
                        {pcDeviceMode === 'desktop' ? 'Desktop (1240px)' : pcDeviceMode === 'tablet' ? 'Tablet (768px)' : 'Mobile (390px)'}
                      </span>
                      <button
                        onClick={handleReload}
                        className="p-0.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        title="Reload"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Iframe Viewport Container */}
                  <div className="w-full flex-1 min-h-0 relative bg-white overflow-hidden">
                    {isLoadingIframe && (
                      <div className="absolute inset-0 bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-2 z-10">
                        <div className="w-7 h-7 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                        <span className="text-xs font-semibold text-slate-500">Loading website...</span>
                      </div>
                    )}
                    <iframe
                      key={`${activeDemo.slug}-pcdevice-${pcDeviceMode}-${iframeKey}`}
                      src={liveUrl}
                      title={activeDemo.title}
                      className="w-full h-full border-0 bg-white"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => setIsLoadingIframe(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Coming Soon Showcase Full View */
          <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4 my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>⚡ LIVE DEMO COMING SOON</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeDemo.title}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
              {activeDemo.description || activeDemo.shortDescription}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Rocket className="w-3.5 h-3.5 text-amber-500" />
                  <span>Deployment Status</span>
                </span>
                <span className="text-emerald-700 dark:text-emerald-400">95% Ready • 48h Handover</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 w-[95%] rounded-full animate-pulse" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                onClick={handleLaunchRequirementModal}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pre-Order Website (20% OFF)</span>
              </button>
              <button
                onClick={() => openCallbackModal({ source: 'Live Demo Coming Soon', templateTitle: activeDemo.title, price: priceDisplay })}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Request a Callback</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. STICKY FLOATING BOTTOM COMMAND DOCK */}
      {/* ========================================================================= */}
      <footer className="shrink-0 w-full z-30 px-1.5 sm:px-4 pb-1.5 sm:pb-2.5 pt-0.5 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-5xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-t-2xl sm:rounded-2xl px-2.5 sm:px-5 py-1.5 sm:py-2.5 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 transition-all">
          
          {/* Animated Premium Top Border */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] animated-premium-border pointer-events-none rounded-t-2xl sm:rounded-t-2xl opacity-90 shadow-sm" />

          {/* Left / Top on Mobile: Info & Price */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-4 min-w-0">
            {/* Demo Icon & Meta */}
            <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-none">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-purple-500/40 dark:border-purple-500/50 shadow-sm shrink-0 bg-slate-900 flex items-center justify-center ring-1 ring-purple-500/20">
                <img
                  src={activeDemo.thumbnail || activeDemo.heroImage || activeDemo.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300'}
                  alt={activeDemo.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300';
                  }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[110px] xs:max-w-[150px] sm:max-w-[220px] md:max-w-[280px]">
                    {activeDemo.title}
                  </h4>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-0.5 shrink-0">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span>5.0</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">48h Handover</span>
                  <span>•</span>
                  <span>Free SSL & Domain</span>
                </div>
              </div>
            </div>

            {/* Price Badge */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-100/90 dark:bg-slate-900/90 rounded-lg sm:rounded-xl border border-slate-200/80 dark:border-slate-800/80 shrink-0">
              <div className="flex items-baseline gap-1">
                <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {priceDisplay}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 line-through">
                  ₹9,999
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-bold uppercase px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                20% OFF
              </span>
            </div>
          </div>

          {/* Right / Bottom on Mobile: Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto shrink-0">
            {/* Specs Trigger */}
            <button
              onClick={() => setIsSpecsDrawerOpen(true)}
              className="px-2 py-1.5 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs font-semibold transition-colors flex items-center gap-1 border border-slate-200 dark:border-slate-800 cursor-pointer shrink-0"
              title="View specifications"
            >
              <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Specs</span>
            </button>

            {/* Request Callback CTA */}
            <button
              onClick={() => openCallbackModal({ source: 'Live Demo Sticky Dock', templateTitle: activeDemo.title, price: priceDisplay })}
              className="px-2.5 py-1.5 rounded-lg sm:rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs border border-purple-200 dark:border-purple-800 shrink-0"
              title="Request an instant developer callback"
            >
              <PhoneCall className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden xs:inline">Request</span> Callback
            </button>

            {/* Primary Order Button */}
            <button
              onClick={handleLaunchRequirementModal}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg sm:rounded-xl l2b-gradient-bg text-[11px] sm:text-xs font-bold text-white shadow-md hover:opacity-95 hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer min-w-0"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{hasLiveUrl ? 'Order Website' : 'Pre-Order'}</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            </button>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 4. SLIDE-OVER SPECIFICATIONS & DELIVERABLES DRAWER */}
      {/* ========================================================================= */}
      {isSpecsDrawerOpen && (
        <div className="fixed inset-0 z-[999999] flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto p-4 sm:p-5 flex flex-col justify-between shadow-2xl">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <AshokaChakra size={13} />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Template Specifications</h3>
                </div>
                <button
                  onClick={() => setIsSpecsDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Specs Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Category:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeDemo.category}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Turnaround:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeDemo.turnaround || '2 - 4 Days'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Responsiveness:</span>
                  <span className="font-bold text-slate-900 dark:text-white">100% Tested</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">PageSpeed Score:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">98+ (Edge CDN)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Source Rights:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Full Ownership</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Included Features:
                </h4>
                <div className="space-y-1.5 text-xs">
                  {activeDemo.features && activeDemo.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Drawer CTA */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setIsSpecsDrawerOpen(false);
                  handleLaunchRequirementModal();
                }}
                className="w-full py-2.5 rounded-xl l2b-gradient-bg text-xs font-bold text-white shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Order Website ({priceDisplay})</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Share Demo Modal */}
      <ShareDemoModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        demo={{ title: activeDemo.title, slug: activeDemo.slug || activeDemo.id, category: activeDemo.category }}
      />

    </div>
  );
}
