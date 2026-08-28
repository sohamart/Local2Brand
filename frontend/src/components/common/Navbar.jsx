import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useOrderModal } from '../../context/OrderModalContext';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../../utils/whatsapp';
import AshokaChakra from './AshokaChakra';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openOrderModal } = useOrderModal();
  const location = useLocation();

  // iOS Liquid Pill Indicator State & Refs
  const navContainerRef = useRef(null);
  const linkRefs = useRef({});
  const [hoveredPath, setHoveredPath] = useState(null);
  const [pillStyle, setPillStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0
  });

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle body scroll locking on mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  // Calculate liquid pill position based on active route or hover
  useEffect(() => {
    const updatePill = () => {
      const targetPath = hoveredPath !== null ? hoveredPath : location.pathname;
      let targetElement = linkRefs.current[targetPath];

      if (!targetElement && location.pathname.startsWith('/demos')) {
        targetElement = linkRefs.current['/demos'];
      }

      if (targetElement) {
        setPillStyle({
          left: targetElement.offsetLeft,
          top: targetElement.offsetTop,
          width: targetElement.offsetWidth,
          height: targetElement.offsetHeight,
          opacity: 1
        });
      } else {
        if (hoveredPath === null) {
          setPillStyle((prev) => ({ ...prev, opacity: 0 }));
        }
      }
    };

    updatePill();
    const frameId = requestAnimationFrame(updatePill);
    const timeoutId = setTimeout(updatePill, 250);
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
    };
  }, [location.pathname, hoveredPath, isScrolled]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      let targetElement = linkRefs.current[location.pathname];
      if (!targetElement && location.pathname.startsWith('/demos')) {
        targetElement = linkRefs.current['/demos'];
      }
      if (targetElement) {
        setPillStyle({
          left: targetElement.offsetLeft,
          top: targetElement.offsetTop,
          width: targetElement.offsetWidth,
          height: targetElement.offsetHeight,
          opacity: 1
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);

  const handleWhatsAppQuickChat = () => {
    openWhatsAppChat(generateWhatsAppGeneralUrl());
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ease-out ${
          isScrolled ? 'py-2.5 sm:py-3' : 'py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className={`flex items-center justify-between glass-waterdrop rounded-full transition-all duration-400 ease-out relative border border-white/95 dark:border-slate-800/90 ${
              isScrolled
                ? 'h-[62px] sm:h-[66px] px-4 sm:px-6 shadow-glass-lg'
                : 'h-[68px] sm:h-[72px] px-5 sm:px-7 shadow-glass'
            }`}
            aria-label="Global Navigation"
          >
            {/* 1. BRAND LOGO & IDENTITY */}
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer shrink-0"
              aria-label="LOCAL2BRAND Home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform shrink-0 border border-white/90 dark:border-slate-700 bg-white dark:bg-slate-900">
                <img
                  src="/logo.jpg"
                  alt="LOCAL2BRAND Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  LOCAL<span className="l2b-gradient-text">2</span>BRAND
                </span>
                <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/40">
                  <AshokaChakra size={9} />
                  <span>IN</span>
                </span>
              </div>
            </Link>

            {/* 2. CENTER FLOATING DOCK WITH GENEROUS SPACING & LIQUID WATERDROP PILL */}
            <div
              ref={navContainerRef}
              onMouseLeave={() => setHoveredPath(null)}
              className="hidden lg:flex items-center relative p-1 rounded-full bg-slate-200/45 dark:bg-black/45 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-inner"
            >
              {/* Animated iOS Liquid Waterdrop Pill Indicator */}
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
                <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-white dark:via-white/60 to-transparent" />
              </div>

              {/* Navigation Items */}
              {siteConfig.navLinks.map((link) => {
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
                    className={`relative z-10 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-tight transition-colors duration-200 ${
                      isActive
                        ? 'text-slate-950 dark:text-white font-bold'
                        : 'text-slate-600 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* 3. CLEAN & SPACIOUS RIGHT ACTIONS */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              {/* Minimal Theme Toggle */}
              <ThemeToggle />

              {/* Primary Start Website CTA */}
              <button
                onClick={() => openOrderModal({ websiteType: 'Custom Project Inquiry' })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white l2b-gradient-bg hover:opacity-95 shadow-glass-highlight hover:shadow-lg transition-all cursor-pointer group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* 4. MOBILE RIGHT ACTION CLUSTER */}
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-full text-slate-800 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700 transition-colors focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Subtle Indian Flag Tricolor Micro-Line on Bottom Rim */}
            <div
              className="absolute bottom-0 left-6 right-6 h-[1.5px] rounded-full pointer-events-none opacity-80"
              style={{
                background: 'linear-gradient(90deg, rgba(255,153,51,0.9) 0%, rgba(255,255,255,0.6) 30%, rgba(0,114,255,0.8) 50%, rgba(255,255,255,0.6) 70%, rgba(19,136,8,0.9) 100%)'
              }}
            />
          </nav>
        </div>
      </header>

      {/* 5. MOBILE GLASS NAVIGATION DRAWER (iOS 18 Sheet Style) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden flex flex-col justify-between pt-24 pb-8 px-5 xs:px-6 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-200 overflow-y-auto">
          {/* Top Links List */}
          <div className="flex flex-col space-y-1.5 mt-2">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-2 flex items-center justify-between">
              <span>Navigation Menu</span>
              <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
                <AshokaChakra size={12} />
                <span>Made in India</span>
              </span>
            </div>
            {siteConfig.navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3.5 rounded-2xl text-base font-semibold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-700 shadow-xs'
                      : 'text-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`
                }
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
            ))}
          </div>

          {/* Mobile Bottom Action Bar */}
          <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openOrderModal({ websiteType: 'Custom Project Inquiry' });
              }}
              className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white l2b-gradient-bg flex items-center justify-center gap-2 shadow-glass-highlight active:scale-[0.98] transition-transform"
            >
              <span>Start Your Website</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleWhatsAppQuickChat();
              }}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/90 dark:border-emerald-500/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Direct WhatsApp Chat</span>
            </button>

            {/* Appearance / Theme in Drawer */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Appearance / Theme</span>
              <ThemeToggle showLabel={true} />
            </div>

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
                {siteConfig.brandName} • {siteConfig.tagline}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
