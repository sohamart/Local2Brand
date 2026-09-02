import React, { useState, useEffect, useRef } from 'react';
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
  Layers
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';
import { useOrderModal } from '../../context/OrderModalContext';
import AshokaChakra from './AshokaChakra';
import ThemeToggle from './ThemeToggle';
import AnnouncementBar from './AnnouncementBar';

// Primary Direct Links in Navbar Dock (Visible on Desktop)
const PRIMARY_NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Templates', href: '/demos' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Portfolio', href: '/portfolio' },
];

// Secondary "More ▾" Links with rich icons & descriptions
const MORE_NAV_LINKS = [
  {
    label: 'Track Order',
    href: '/track-order',
    desc: 'Live engineering sprint & milestone roadmap',
    icon: Compass,
    badge: 'Live Sprint',
    badgeColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 border-purple-200 dark:border-purple-800',
    iconBg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400'
  },
  {
    label: 'About LOCAL2BRAND',
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

  const dropdownTimerRef = useRef(null);
  const moreDropdownTimerRef = useRef(null);

  const { settings } = useSiteSettings();
  const { user, logout, isAdmin, openAuthModal } = useAuth();
  const { openOrderModal, openCallbackModal } = useOrderModal();
  const location = useLocation();
  const navigate = useNavigate();

  const hasAnnouncement = Boolean(settings?.announcementBar?.enabled && !isAnnouncementDismissed);

  const navContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const moreRef = useRef(null);
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

  const isMoreActive = MORE_NAV_LINKS.some(
    (item) => location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href))
  );

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
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isScrolled ? 'gap-0' : hasAnnouncement ? 'gap-1.5 sm:gap-2' : 'gap-0'
        }`}
      >
        {/* Animated Top Announcement Bar */}
        <AnnouncementBar
          isScrolled={isScrolled}
          onDismiss={() => setIsAnnouncementDismissed(true)}
        />

        <div className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full transition-all duration-300 ${
          isScrolled
            ? 'pt-1 sm:pt-1.5'
            : hasAnnouncement
            ? 'pt-0'
            : 'pt-2.5 sm:pt-3.5'
        }`}>
          <nav
            className={`flex items-center justify-between glass-waterdrop rounded-full transition-all duration-300 relative border border-white/95 dark:border-slate-800/90 ${
              isScrolled
                ? 'h-[58px] sm:h-[62px] px-3.5 sm:px-6 shadow-glass-lg'
                : 'h-[62px] sm:h-[66px] px-4 sm:px-7 shadow-glass'
            }`}
            aria-label="Global Navigation"
          >
            {/* 1. BRAND LOGO & IDENTITY */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer shrink-0"
              aria-label="LOCAL2BRAND Home"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform shrink-0 border border-white/90 dark:border-slate-700 bg-white dark:bg-slate-900">
                <img
                  src="/logo.jpg"
                  alt="LOCAL2BRAND Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                  LOCAL<span className="l2b-gradient-text">2</span>BRAND
                </span>
                <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/40">
                  <AshokaChakra size={9} />
                  <span>IN</span>
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

                {/* MORE DROPDOWN FLOATING CARD */}
                {moreDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-7 w-80 z-[9999999] animate-in fade-in zoom-in-95 duration-150">
                    <div className="glass-waterdrop-menu rounded-2xl p-2 space-y-1">

                      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 mb-1">
                        <span>Explore Platform</span>
                        <span className="text-[9px] text-purple-600 dark:text-purple-400 font-bold">Quick Access</span>
                      </div>

                      {MORE_NAV_LINKS.map((item) => {
                        const Icon = item.icon;
                        const isCurrent =
                          location.pathname === item.href ||
                          (item.href !== '/' && location.pathname.startsWith(item.href));
                        const isHoveredItem = hoveredMoreItem === item.label;

                        return (
                          <Link
                            key={item.label}
                            to={item.href}
                            onClick={() => setMoreDropdownOpen(false)}
                            onMouseEnter={() => setHoveredMoreItem(item.label)}
                            onMouseLeave={() => setHoveredMoreItem(null)}
                            className={`relative flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 group overflow-hidden ${
                              isCurrent
                                ? 'border border-purple-200 dark:border-purple-800'
                                : ''
                            }`}
                          >
                            {/* Liquid pill highlight background */}
                            <div
                              className={`absolute inset-0 rounded-xl transition-all duration-200 ease-out ${
                                isCurrent
                                  ? isHoveredItem
                                    ? 'bg-purple-100/95 dark:bg-purple-900/55'
                                    : 'bg-purple-50/90 dark:bg-purple-950/70'
                                  : isHoveredItem
                                  ? 'bg-slate-900/8 dark:bg-white/10 scale-100 opacity-100'
                                  : 'opacity-0 scale-95'
                              }`}
                            >
                              {/* Top gloss line like iOS pill */}
                              {isHoveredItem && !isCurrent && (
                                <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                              )}
                            </div>

                            <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 shadow-2xs ${item.iconBg} ${isHoveredItem ? 'scale-110' : 'scale-100'}`}>
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="relative flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs font-bold truncate transition-colors duration-200 ${
                                  isCurrent
                                    ? 'text-purple-700 dark:text-purple-300'
                                    : isHoveredItem
                                    ? 'text-purple-600 dark:text-purple-400'
                                    : 'text-slate-900 dark:text-white'
                                }`}>
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full border shrink-0 ${item.badgeColor}`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}

                      {/* Bottom Quick Call Consultation Banner */}
                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => {
                            setMoreDropdownOpen(false);
                            openCallbackModal({ topic: 'Direct Founder Strategy Call' });
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-200/60 dark:border-purple-800/60 text-xs font-bold text-purple-700 dark:text-purple-300 transition-all cursor-pointer group"
                        >
                          <span className="flex items-center gap-1.5">
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                            <span>Request Strategy Call</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. RIGHT ACTIONS (Desktop / Tablet) */}
            <div className="hidden md:flex items-center gap-2.5 sm:gap-3 shrink-0">
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
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm overflow-hidden border border-white/40 dark:border-slate-700">
                      {user?.avatar ? (
                        <img key={user.avatar} src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>
                    <span className="max-w-[80px] truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                      {user?.name ? user.name.split(' ')[0] : 'User'}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Glassmorphic Dropdown Submenu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full pt-2 w-56 z-[9999999] animate-in fade-in zoom-in-95 duration-150">
                      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-2 space-y-1">
                        
                        {/* User Bio Header */}
                        <div className="p-2.5 border-b border-slate-100 dark:border-slate-800/80">
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
                            className="flex items-center gap-2.5 p-2 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 font-bold text-xs transition-colors"
                          >
                            <Shield className="w-4 h-4 text-purple-600" />
                            <span>Master Admin Panel</span>
                          </Link>
                        )}

                        {/* Client Dashboard Link */}
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 text-xs font-semibold transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-purple-500" />
                          <span>Client Dashboard</span>
                        </Link>

                        {/* Track Order Link */}
                        <Link
                          to="/track-order"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 text-xs font-semibold transition-colors"
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
                          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 text-xs font-semibold cursor-pointer transition-colors"
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
            <div className="flex items-center gap-2 md:hidden">
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
                    <img key={user.avatar} src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
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
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-white/90 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
                <img
                  src="/logo.jpg"
                  alt="LOCAL2BRAND Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                  LOCAL<span className="l2b-gradient-text">2</span>BRAND
                </span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/40">
                  <AshokaChakra size={9} />
                  <span>IN</span>
                </span>
              </div>
            </Link>

            {/* Right: Theme Toggle & Close (X) Button */}
            <div className="flex items-center gap-2">
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
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-base shadow-md overflow-hidden border-2 border-white/60 dark:border-slate-700 shrink-0">
                        {user?.avatar ? (
                          <img key={user.avatar} src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user?.name?.[0]?.toUpperCase() || 'U'
                        )}
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

                {MORE_NAV_LINKS.map((item) => {
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
                      <span className="flex items-center   gap-2.5">
                        <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>{item.label}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
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
