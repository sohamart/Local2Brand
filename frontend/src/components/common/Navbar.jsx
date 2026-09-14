import React, { useState, useEffect, useMemo, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  User,
  PhoneCall,
  LogOut,
  Shield,
  LayoutDashboard,
  LogIn,
  Sparkles,
  ChevronDown,
  Compass,
  Headphones,
  Zap,
  Info,
  Layers,
  Smartphone,
  CheckCircle2,
  Briefcase,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';
import { useOrderModal } from '../../context/OrderModalContext';
import { useTheme } from '../../context/ThemeContext';
import AshokaChakra from './AshokaChakra';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';
import MarqueeTicker from './MarqueeTicker';


// Primary Direct Links in Navbar Dock (Visible on Desktop)
const PRIMARY_NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Templates', href: '/demos' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Our Team', href: '/team' },
];

// Secondary "More ▾" Links with rich icons & descriptions
const MORE_NAV_LINKS = [
  {
    label: 'Portfolio & Projects',
    href: '/portfolio',
    desc: 'Case studies, live websites & flagship transformations',
    icon: Briefcase,
    badge: 'Showcase',
    badgeColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 border-purple-200 dark:border-purple-800',
    iconBg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400'
  },
  {
    label: 'Download Mobile App',
    href: '/app',
    desc: 'Official Android APK & iOS Companion',
    icon: Smartphone,
    badge: 'APK / App',
    badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'
  },
  {
    label: 'Track Live Order',
    href: '/track-order',
    desc: 'Live engineering sprint & milestone roadmap',
    icon: Compass,
    badge: 'Live Sprint',
    badgeColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
  },
  {
    label: 'About Weblets',
    href: '/about',
    desc: 'Our mission, team & high-performance vision',
    icon: Sparkles,
    badge: 'Agency',
    badgeColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800',
    iconBg: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
  },
  {
    label: 'Contact & Support',
    href: '/contact',
    desc: 'Direct consultation, query & office address',
    icon: Headphones,
    badge: '24/7 Live',
    badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
  },
  {
    label: 'Privacy Policy',
    href: '/privacy',
    desc: 'Enterprise data privacy, security & cookie standards',
    icon: ShieldCheck,
    badge: 'Security',
    badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
  },
  {
    label: 'Terms & Conditions',
    href: '/terms',
    desc: 'Service agreements, SLAs & 100% code ownership',
    icon: FileText,
    badge: 'Legal',
    badgeColor: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800',
    iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
  },
  {
    label: 'Start Custom Build',
    href: '/get-started',
    desc: 'Smart 3-minute interactive requirement builder',
    icon: Zap,
    badge: 'Fast-Track',
    badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'
  }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState(false);
  const [hoveredMoreItem, setHoveredMoreItem] = useState(null);
  const [isInsideInstalledApp, setIsInsideInstalledApp] = useState(false);
  const [isAndroidApp, setIsAndroidApp] = useState(false);

  const dropdownTimerRef = useRef(null);
  const moreDropdownTimerRef = useRef(null);

  const { settings } = useSiteSettings();
  const { isDark } = useTheme();
  const { user, logout, isAdmin, openAuthModal } = useAuth();
  const { openOrderModal, openCallbackModal } = useOrderModal();
  const location = useLocation();
  const navigate = useNavigate();

  const activeLogoUrl = isDark
    ? (settings?.logoDarkUrl || settings?.logoLightUrl || '/logo.png')
    : (settings?.logoLightUrl || settings?.logoDarkUrl || '/logo.png');

  // Detect Installed Standalone Web App or Android App
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const appConfig = settings?.appConfig || {};
      const urlParams = new URLSearchParams(window.location.search);
      const ua = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();

      const configuredPackage = (appConfig.androidPackageName || appConfig.packageName || '').trim().toLowerCase();
      const configuredAgent = (appConfig.androidUserAgent || appConfig.customUserAgent || '').trim().toLowerCase();

      // 1. Check Android App Package & User-Agent Recognition
      const isParamAndroid =
        urlParams.get('mode') === 'android_app' ||
        urlParams.get('source') === 'android' ||
        urlParams.get('platform') === 'android' ||
        (configuredPackage && urlParams.get('package')?.toLowerCase() === configuredPackage) ||
        (configuredPackage && urlParams.get('app_package')?.toLowerCase() === configuredPackage) ||
        (configuredPackage && urlParams.get('android_package')?.toLowerCase() === configuredPackage) ||
        (configuredAgent && urlParams.get('agent')?.toLowerCase() === configuredAgent);

      const isUaAndroidMatch =
        (configuredAgent && ua.includes(configuredAgent)) ||
        (configuredPackage && ua.includes(configuredPackage)) ||
        (ua.includes('android') && (ua.includes('; wv') || ua.includes('version/4.0') || ua.includes('local2brand')));

      const isAndroidBridge = !!(window.Android || window.AndroidBridge || window.Local2BrandAndroid);
      const isReferrerAndroid = !!(
        document.referrer &&
        (document.referrer.includes('android-app://') ||
          (configuredPackage && document.referrer.includes(configuredPackage)))
      );

      const isAndroid = isParamAndroid || isUaAndroidMatch || isAndroidBridge || isReferrerAndroid;

      // 2. Check PWA Standalone App Recognition
      const isParamApp = urlParams.get('mode') === 'app' || urlParams.get('source') === 'pwa';
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = window.navigator.standalone === true;

      const isInstalled = isAndroid || isParamApp || isStandaloneMedia || isIosStandalone;

      setIsAndroidApp(isAndroid);
      setIsInsideInstalledApp(isInstalled);
    }
  }, [settings?.appConfig]);

  const appVersion = settings?.appConfig?.version || 'v2.4.0';

  // Dynamic Navigation Links: Show "Thanks for Installing!" & Version only in Installed App
  const moreNavLinks = useMemo(() => {
    return MORE_NAV_LINKS.map((item) => {
      if (item.href === '/app') {
        if (isInsideInstalledApp || isAndroidApp) {
          return {
            label: 'Thanks for Installing!',
            href: '/app',
            desc: isAndroidApp
              ? `Android App Active • ${appVersion}`
              : `Installed Web App • ${appVersion}`,
            icon: CheckCircle2,
            badge: `Installed (${appVersion})`,
            badgeColor:
              'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700/60',
            iconBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
          };
        }
      }
      return item;
    });
  }, [isInsideInstalledApp, isAndroidApp, appVersion]);

  const hasAnnouncement = Boolean(settings?.announcementBar?.enabled && !isAnnouncementDismissed);

  const navContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const moreRef = useRef(null);
  const moreListContainerRef = useRef(null);
  const moreItemRefs = useRef({});
  const headerRef = useRef(null);
  const linkRefs = useRef({});
  const [hoveredPath, setHoveredPath] = useState(null);
  const [pillStyle, setPillStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });
  const [morePillStyle, setMorePillStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const isMoreActive = moreNavLinks.some(
    (item) => location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href))
  );

  // Dynamic Liquid Waterdrop Indicator for More Submenu
  useEffect(() => {
    if (!moreDropdownOpen) {
      setMorePillStyle((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }));
      return;
    }

    const updateMorePill = () => {
      let targetKey = hoveredMoreItem;
      if (!targetKey) {
        const activeLink = moreNavLinks.find(
          (item) =>
            location.pathname === item.href ||
            (item.href !== '/' && location.pathname.startsWith(item.href))
        );
        if (activeLink) targetKey = activeLink.label;
      }

      const targetEl = targetKey ? moreItemRefs.current[targetKey] : null;
      const container = moreListContainerRef.current?.getBoundingClientRect();
      const target = targetEl?.getBoundingClientRect();

      if (!container || !target || !target.width) {
        if (!hoveredMoreItem) {
          setMorePillStyle((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }));
        }
        return;
      }

      setMorePillStyle({
        top: target.top - container.top,
        left: target.left - container.left,
        width: target.width,
        height: target.height,
        opacity: 1,
      });
    };

    updateMorePill();
    const frameId = requestAnimationFrame(updateMorePill);
    const timeoutId = setTimeout(updateMorePill, 60);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
    };
  }, [moreDropdownOpen, hoveredMoreItem, location.pathname, moreNavLinks]);

  // Sync body class for zero-overhead, pure hardware-accelerated CSS page offset
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('has-announcement-bar', hasAnnouncement);
    }
  }, [hasAnnouncement]);

  // Ultra-smooth throttled scroll position tracker (120 FPS)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawers & menus on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setMoreDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for user dropdown & more dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Liquid pill navigation indicator
  useEffect(() => {
    const updatePill = () => {
      let targetKey = hoveredPath;
      if (targetKey === null) {
        // If More dropdown is open, pin pill to More button
        if (moreDropdownOpen) {
          targetKey = 'more';
        } else if (location.pathname.startsWith('/services')) {
          targetKey = '/services';
        } else if (
          location.pathname.startsWith('/demos') ||
          location.pathname.startsWith('/demo') ||
          location.pathname.startsWith('/details') ||
          location.pathname.startsWith('/live') ||
          location.pathname.startsWith('/preview')
        ) {
          targetKey = '/demos';
        } else if (location.pathname === '/' || location.pathname === '') {
          targetKey = '/';
        } else if (location.pathname.startsWith('/pricing')) {
          targetKey = '/pricing';
        } else if (location.pathname.startsWith('/portfolio')) {
          targetKey = '/portfolio';
        } else if (isMoreActive) {
          targetKey = 'more';
        }
      }

      const targetElement = targetKey ? linkRefs.current[targetKey] : null;
      const dock = navContainerRef.current?.getBoundingClientRect();
      const target = targetElement?.getBoundingClientRect();

      // Bail out while the dock is unmounted or laid out at zero size (below the
      // `lg` breakpoint) instead of pinning a collapsed 0x0 pill at its corner.
      if (!dock?.width || !target?.width) {
        if (hoveredPath === null) {
          setPillStyle((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }));
        }
        return;
      }

      // Measure with rects, not offsetLeft/offsetTop: the "More" trigger sits
      // inside a `relative` wrapper, so its offsets are 0 relative to *that*
      // wrapper and would snap the pill back onto "Home".
      setPillStyle({
        left: target.left - dock.left,
        top: target.top - dock.top,
        width: target.width,
        height: target.height,
        opacity: 1,
      });
    };

    updatePill();
    const frameId = requestAnimationFrame(updatePill);
    const timeoutId = setTimeout(updatePill, 250);

    // Keeps the pill glued to its target across breakpoint changes, font swaps
    // and window resizes.
    const observer = new ResizeObserver(updatePill);
    if (navContainerRef.current) observer.observe(navContainerRef.current);
    window.addEventListener('resize', updatePill);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('resize', updatePill);
    };
  }, [location.pathname, hoveredPath, isScrolled, isMoreActive, moreDropdownOpen]);

  // Smooth hover handlers for User profile dropdown
  const handleUserDropdownMouseEnter = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setUserDropdownOpen(true);
  };

  const handleUserDropdownMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 200);
  };

  // Smooth hover handlers for More dropdown
  const handleMoreMouseEnter = () => {
    if (moreDropdownTimerRef.current) clearTimeout(moreDropdownTimerRef.current);
    setMoreDropdownOpen(true);
  };

  const handleMoreMouseLeave = () => {
    moreDropdownTimerRef.current = setTimeout(() => {
      setMoreDropdownOpen(false);
    }, 200);
  };

  const handleGetStartedClick = () => {
    navigate('/get-started');
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col"
      >
        {/* Top Live Sliding Important Announcement Ticker (Hidden on /dashboard to avoid duplicate) */}
        {!location.pathname.startsWith('/dashboard') && (
          <MarqueeTicker className="w-full shrink-0" />
        )}

        <div className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full transition-all duration-300 ${


          isScrolled
            ? 'pt-1 sm:pt-1.5'
            : 'pt-1.5 sm:pt-2.5'
        }`}>
          <nav
            className={`flex items-center justify-between glass-waterdrop rounded-full transition-all duration-300 relative border border-white/95 dark:border-slate-800/90 ${
              isScrolled
                ? 'h-[52px] sm:h-[60px] px-3.5 sm:px-6 shadow-glass-lg'
                : 'h-[56px] sm:h-[64px] px-4 sm:px-7 shadow-glass'
            }`}


            aria-label="Global Navigation"
          >
            {/* 1. BRAND LOGO & IDENTITY */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer shrink-0"
              aria-label="Weblets Home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-sm dark:shadow-[0_0_18px_rgba(168,85,247,0.5)] ring-2 ring-purple-500/30 dark:ring-purple-500/40 group-hover:scale-105 transition-transform shrink-0 border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-950 p-0 flex items-center justify-center relative">
                <img
                  src={activeLogoUrl}
                  alt={settings?.brandName || 'WEBLETS'}
                  className="w-full h-full object-cover scale-135 object-center"
                  onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                />
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                  {settings?.brandName || 'WEBLETS'}
                </span>
              </div>
            </Link>

            {/* 2. CENTER FLOATING DOCK (PC / DESKTOP CLEAN COMPACT DOCK) */}
            <div
              ref={navContainerRef}
              onMouseLeave={() => setHoveredPath(null)}
              className="hidden lg:flex items-center relative p-1 rounded-full bg-slate-200/45 dark:bg-black/45 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-inner"
            >
              {/* Liquid indicator background pill */}
              <div
                className="ios-liquid-pill ios-liquid-glass absolute top-0 left-0 rounded-full pointer-events-none z-0"
                style={{
                  transform: `translate3d(${pillStyle.left}px, ${pillStyle.top}px, 0)`,
                  width: `${pillStyle.width}px`,
                  height: `${pillStyle.height}px`,
                  opacity: pillStyle.opacity,
                }}
              >
                <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-white dark:via-white/60 to-transparent" />
              </div>

              {/* Primary Nav Links */}
              {PRIMARY_NAV_LINKS.map((link) => {
                const isActive =
                  link.href === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.href);

                return (
                  <NavLink
                    key={link.label}
                    ref={(el) => (linkRefs.current[link.href] = el)}
                    to={link.href}
                    onMouseEnter={() => setHoveredPath(link.href)}
                    className={`relative z-10 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors duration-200 ${
                      isActive
                        ? 'text-slate-950 dark:text-white font-bold'
                        : 'text-slate-600 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}

              {/* MORE MEGA-DROPDOWN TRIGGER */}
              <div
                ref={moreRef}
                onMouseEnter={handleMoreMouseEnter}
                onMouseLeave={handleMoreMouseLeave}
                className="relative"
              >
                <button
                  type="button"
                  ref={(el) => (linkRefs.current['more'] = el)}
                  onClick={() => {
                    setMoreDropdownOpen((prev) => !prev);
                    setHoveredPath('more');
                  }}
                  onMouseEnter={() => setHoveredPath('more')}
                  className={`relative z-10 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors duration-200 flex items-center gap-1 cursor-pointer ${
                    isMoreActive || moreDropdownOpen
                      ? 'text-slate-950 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                  }`}
                  aria-expanded={moreDropdownOpen}
                >
                  <span>More</span>
                  <ChevronDown
                    className={`w-3 h-3 text-slate-400 dark:text-slate-300 transition-transform duration-200 ${
                      moreDropdownOpen ? 'rotate-180 text-purple-600 dark:text-purple-400' : ''
                    }`}
                  />
                </button>

                {/* MORE MEGA-DROPDOWN FLOATING CARD */}
                {moreDropdownOpen && (
                  <div
                    data-lenis-prevent="true"
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[760px] xl:w-[820px] z-[9999999] animate-in fade-in zoom-in-95 duration-200"
                  >
                    <div className="rounded-3xl p-5 sm:p-6 shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative overflow-hidden bg-white/98 dark:bg-[#070b15] backdrop-blur-3xl border border-slate-200 dark:border-slate-800/90 text-slate-900 dark:text-white">
                      
                      {/* Ambient Moving Aurora Glow */}
                      <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 bg-purple-600/20 dark:bg-purple-600/30 rounded-full blur-3xl" />
                      <div className="pointer-events-none absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/20 dark:bg-cyan-500/25 rounded-full blur-3xl" />
                      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />

                      {/* Top Specular Gloss Line */}
                      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-purple-400/50 to-transparent pointer-events-none z-20" />

                      {/* Main Grid: 8 Cols Links + 4 Cols Featured Image Showcase */}
                      <div className="grid grid-cols-12 gap-5 relative z-10">
                        
                        {/* LEFT SECTION (8 Columns): Categorized Grid */}
                        <div className="col-span-8 space-y-3">
                          
                          {/* Top Header */}
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-white/10">
                            <div className="flex items-center gap-2">
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                              </span>
                              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Explore Platform Hub
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50/80 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200/60 dark:border-purple-800/60">
                              8 Modules Active
                            </span>
                          </div>

                          {/* 2-Column Links Grid with Dynamic Moving Liquid Waterdrop Pill */}
                          <div
                            ref={moreListContainerRef}
                            onMouseLeave={() => setHoveredMoreItem(null)}
                            className="grid grid-cols-2 gap-2 relative p-1 rounded-2xl"
                          >
                            {/* Dynamic Liquid Waterdrop Indicator Pill */}
                            <div
                              className="ios-liquid-pill ios-liquid-glass absolute top-0 left-0 rounded-2xl pointer-events-none z-0 border border-white/80 dark:border-white/20 shadow-md shadow-purple-500/10"
                              style={{
                                transform: `translate3d(${morePillStyle.left}px, ${morePillStyle.top}px, 0)`,
                                width: `${morePillStyle.width}px`,
                                height: `${morePillStyle.height}px`,
                                opacity: morePillStyle.opacity,
                              }}
                            >
                              <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-white dark:via-white/70 to-transparent" />
                            </div>

                            {moreNavLinks.map((item) => {
                              const Icon = item.icon;
                              const isCurrent =
                                location.pathname === item.href ||
                                (item.href !== '/' && location.pathname.startsWith(item.href));

                              return (
                                <Link
                                  key={item.label}
                                  ref={(el) => (moreItemRefs.current[item.label] = el)}
                                  to={item.href}
                                  onMouseEnter={() => setHoveredMoreItem(item.label)}
                                  onClick={() => setMoreDropdownOpen(false)}
                                  className={`relative z-10 group flex items-start gap-2.5 p-2.5 rounded-2xl transition-all duration-200 ${
                                    isCurrent
                                      ? 'text-slate-950 dark:text-white font-bold'
                                      : 'text-slate-700 dark:text-slate-200'
                                  }`}
                                >
                                  <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 shadow-xs border border-white/60 dark:border-white/10 ${
                                      item.iconBg
                                    } group-hover:scale-105 group-hover:rotate-3`}
                                  >
                                    <Icon className="w-4 h-4" />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        {item.label}
                                      </span>
                                      <ChevronRight className="w-3.5 h-3.5 text-purple-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 leading-tight">
                                      {item.desc}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        {/* RIGHT SECTION (4 Columns): Modern Liquid Glass Featured Showcase Card */}
                        <div className="col-span-4 flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 via-slate-900/80 to-slate-950 border border-purple-500/30 shadow-xl relative overflow-hidden group">
                          
                          {/* Inner Ambient Glow */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
                          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

                          {/* Top Visual Emblem & Badge */}
                          <div className="relative z-10 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-950/90 border border-purple-400/40 p-0 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform ring-2 ring-purple-500/30 shrink-0">
                                <img
                                  src="/logo.png"
                                  alt="WEBLETS"
                                  className="w-full h-full object-cover scale-135 object-center"
                                  onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                                />
                              </div>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/40 backdrop-blur-md">
                                <Sparkles className="w-3 h-3 text-amber-300 animate-spin [animation-duration:6s]" />
                                <span>Featured</span>
                              </span>
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-sm font-black text-white tracking-tight leading-snug">
                                Fast-Track 48-Hour Website Launch
                              </h4>
                              <p className="text-[11px] text-slate-300/85 leading-relaxed">
                                Bespoke UI/UX design, sub-second performance, and instant lead capture for scaling brands.
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="relative z-10 space-y-2 pt-3">
                            <Link
                              to="/get-started"
                              onClick={() => setMoreDropdownOpen(false)}
                              className="w-full py-2.5 px-3 rounded-xl text-xs font-black text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <span>Start Custom Project</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => {
                                setMoreDropdownOpen(false);
                                openCallbackModal({ topic: 'Direct Founder Strategy Call' });
                              }}
                              className="w-full py-2 px-3 rounded-xl text-[11px] font-bold text-purple-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <PhoneCall className="w-3 h-3 text-emerald-400" />
                              <span>Instant Founder Call</span>
                            </button>
                          </div>

                        </div>

                      </div>

                      {/* BOTTOM STATUS TRUST BAR */}
                      <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 relative z-10 px-1">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Live Engineering Desk Active</span>
                          </span>
                          <span className="hidden sm:inline">&bull;</span>
                          <span className="hidden sm:inline">⚡ 48-Hour Rapid Sprints</span>
                          <span className="hidden sm:inline">&bull;</span>
                          <span className="hidden sm:inline">🔒 100% Code Ownership</span>
                        </div>

                        <div className="font-mono text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                          WEBLETS v2.4.0
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. RIGHT ACTIONS (Desktop / Tablet) */}
            <div className="hidden md:flex items-center gap-2.5 sm:gap-3 shrink-0">
              <NotificationBell />
              <ThemeToggle />

              {/* User Profile Avatar with Hover Dropdown */}
              {user ? (
                <div
                  className="relative"
                  ref={dropdownRef}
                  onMouseEnter={handleUserDropdownMouseEnter}
                  onMouseLeave={handleUserDropdownMouseLeave}
                >
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1 pl-1.5 pr-2.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer shadow-xs"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center text-[11px] font-black shrink-0 shadow-sm overflow-hidden border border-white/40 dark:border-slate-700 relative">
                      {user?.avatar ? (
                        <img
                          key={user.avatar}
                          src={user.avatar}
                          alt={user.name || 'User'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.opacity = '0';
                          }}
                        />
                      ) : null}
                      <span className="absolute inset-0 flex items-center justify-center -z-10 font-bold">
                        {user?.name ? user.name[0].toUpperCase() : 'U'}
                      </span>
                    </div>

                    <span className="max-w-[80px] truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                      {user?.name ? user.name.split(' ')[0] : 'User'}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Glassmorphic Dropdown Submenu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full pt-5.5 w-56 z-[9999999] animate-in fade-in zoom-in-95 duration-150">
                      <div className="glass-waterdrop-menu rounded-2xl p-2 space-y-1 relative overflow-hidden shadow-2xl mt-1">
                        
                        {/* Top Specular Gloss Reflection Line */}
                        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white dark:via-white/60 to-transparent pointer-events-none z-20" />

                        {/* User Bio Header */}
                        <div className="p-2.5 border-b border-slate-200/60 dark:border-white/10 relative z-10">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate block">
                              {user.name}
                            </span>
                            {isAdmin ? (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                                Admin
                              </span>
                            ) : (
                              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                Client
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate mt-0.5">{user.email}</span>
                        </div>

                        {/* Admin Suite Link */}
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 font-bold text-xs transition-colors relative z-10"
                          >
                            <Shield className="w-4 h-4 text-purple-600" />
                            <span>Master Admin Panel</span>
                          </Link>
                        )}

                        {/* Client Dashboard Link */}
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 text-xs font-semibold transition-colors relative z-10"
                        >
                          <LayoutDashboard className="w-4 h-4 text-purple-500" />
                          <span>Client Dashboard</span>
                        </Link>

                        {/* Track Order Link */}
                        <Link
                          to="/track-order"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 text-xs font-semibold transition-colors relative z-10"
                        >
                          <Compass className="w-4 h-4 text-purple-500" />
                          <span>Track Live Order</span>
                        </Link>

                        {/* Sign Out Button */}
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 text-xs font-semibold cursor-pointer transition-colors relative z-10"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal()}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200 dark:border-slate-700 hover:border-purple-400 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-purple-600" />
                  <span>Log In</span>
                </button>
              )}

              {/* Primary Start Website CTA */}
              <button
                onClick={handleGetStartedClick}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-white l2b-gradient-bg hover:opacity-95 shadow-glass-highlight hover:shadow-lg transition-all cursor-pointer group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* 4. MOBILE RIGHT ACTION BUTTONS */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
              <ThemeToggle />

              {!user ? (
                <button
                  onClick={() => openAuthModal()}
                  className="px-2.5 py-1.5 rounded-full text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 cursor-pointer"
                >
                  Log In
                </button>
              ) : (
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-black text-xs shadow-sm overflow-hidden border border-white/40 dark:border-slate-700"
                  aria-label="User Profile"
                >
                  {user?.avatar ? (
                    <img
                      key={user.avatar}
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    user?.name?.[0]?.toUpperCase() || 'U'
                  )}
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full text-slate-800 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700 transition-colors focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Tricolor Bottom Accent Line */}
            <div
              className="absolute bottom-0 left-6 right-6 h-[1.5px] rounded-full pointer-events-none opacity-80"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,153,51,0.9) 0%, rgba(255,255,255,0.6) 30%, rgba(0,114,255,0.8) 50%, rgba(255,255,255,0.6) 70%, rgba(19,136,8,0.9) 100%)',
              }}
            />
          </nav>
        </div>
      </header>

      {/* 5. MOBILE DRAWER (Full Smooth Scroll) */}
      {mobileMenuOpen && (
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="fixed inset-x-0 top-0 h-dvh z-[9999999] md:hidden flex flex-col bg-white/98 dark:bg-[#07090e]/98 backdrop-blur-3xl animate-in fade-in duration-200 overflow-y-auto modal-touch-scroll"
        >
          
          {/* Top Fixed Header with Logo, Theme Toggle & Close (X) Button */}
          <div className="sticky top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800/90 px-4 py-3 flex items-center justify-between shadow-xs shrink-0">
            
            {/* Brand Logo & Identity */}
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 group cursor-pointer shrink-0"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm dark:shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-2 ring-purple-500/30 dark:ring-purple-500/40 border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-950 p-0 flex items-center justify-center shrink-0">
                <img
                  src={activeLogoUrl}
                  alt={settings?.brandName || 'WEBLETS'}
                  className="w-full h-full object-cover scale-135 object-center"
                  onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                  {settings?.brandName || 'WEBLETS'}
                </span>
              </div>
            </Link>

            {/* Right: Notification Bell, Theme Toggle & Close (X) Button */}
            <div className="flex items-center gap-2">
              <NotificationBell />
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer hover:rotate-90 duration-200 shadow-xs"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Drawer Scrollable Content */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between pb-12">
            
            <div className="space-y-4">
              {/* User Profile / Auth Status Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-200/60 dark:border-purple-800/60 shadow-xs">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-base shadow-md overflow-hidden border-2 border-white/60 dark:border-slate-700 shrink-0 relative">
                        {user?.avatar ? (
                          <img
                            key={user.avatar}
                            src={user.avatar}
                            alt={user.name || 'User'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.opacity = '0';
                            }}
                          />
                        ) : null}
                        <span className="absolute inset-0 flex items-center justify-center -z-10 font-bold">
                          {user?.name ? user.name[0].toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white block truncate">{user.name}</span>
                        <span className="text-[11px] text-slate-500 block truncate">{user.email}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="p-2 rounded-xl text-red-500 bg-red-50 dark:bg-red-950/60 text-xs font-bold cursor-pointer hover:bg-red-100 transition-colors"
                      title="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Client & Project Access
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          openAuthModal();
                        }}
                        className="py-2.5 text-center rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-xs cursor-pointer hover:bg-purple-50"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          openAuthModal();
                        }}
                        className="py-2.5 text-center rounded-xl bg-purple-600 text-xs font-bold text-white shadow-xs cursor-pointer hover:bg-purple-500"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Core Links */}
              <div className="flex flex-col space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 px-2 py-1 flex items-center justify-between">
                  <span>Main Navigation</span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
                    <AshokaChakra size={11} />
                    <span>Made in India</span>
                  </span>
                </div>

                {PRIMARY_NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-700'
                          : 'text-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </NavLink>
                ))}
              </div>

              {/* Explore & More Pages */}
              <div className="flex flex-col  space-y-1 pt-2">
                <div className="text-[11px]  font-bold uppercase tracking-widest text-slate-400 px-2 py-1">
                  Explore &amp; Services
                </div>

                {moreNavLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.label}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-between transition-all ${
                          isActive
                            ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800'
                            : 'text-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                        <div className="flex flex-col text-left truncate">
                          <span className="truncate">{item.label}</span>
                          {item.desc && (
                            <span className="text-[10px] text-slate-400 font-normal truncate">
                              {item.desc}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full border shadow-2xs ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </NavLink>
                  );
                })}

                {user && (
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2.5">
                      <LayoutDashboard className="w-4 h-4 text-purple-500" />
                      <span>My Dashboard &amp; Inquiries</span>
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </NavLink>
                )}

                {user && isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-2xl text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/50 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4" />
                      <span>Master Admin Panel</span>
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </NavLink>
                )}
              </div>
            </div>

            {/* Bottom Action CTAs */}
            <div className="space-y-2.5 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/get-started');
                }}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white l2b-gradient-bg flex items-center justify-center gap-2 shadow-glass-highlight cursor-pointer"
              >
                <span>Start Your Website</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCallbackModal();
                }}
                className="w-full py-3 px-6 rounded-2xl font-bold text-xs text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                <span>Request a Phone Callback</span>
              </button>
            </div>

          </div>

        </div>
      )}
    </>
  );
}
