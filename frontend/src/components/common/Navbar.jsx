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
  ChevronDown
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';
import { useOrderModal } from '../../context/OrderModalContext';
import AshokaChakra from './AshokaChakra';
import ThemeToggle from './ThemeToggle';
import AnnouncementBar from './AnnouncementBar';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownTimerRef = useRef(null);

  const { settings } = useSiteSettings();
  const { user, logout, isAdmin, openAuthModal } = useAuth();
  const { openOrderModal, openCallbackModal } = useOrderModal();
  const location = useLocation();
  const navigate = useNavigate();

  const navContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const linkRefs = useRef({});
  const [hoveredPath, setHoveredPath] = useState(null);
  const [pillStyle, setPillStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawers & menus on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
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
          opacity: 1,
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

  // Smooth hover handlers with small delay so moving mouse to dropdown never closes it
  const handleDropdownMouseEnter = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setUserDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 200);
  };

  const handleGetStartedClick = () => {
    if (!user) {
      openAuthModal(() => openOrderModal({ websiteType: 'Custom Project Inquiry' }));
    } else if (isAdmin || user?.role === 'admin') {
      navigate('/admin');
    } else {
      openOrderModal({ websiteType: 'Custom Project Inquiry' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isScrolled ? 'gap-0' : 'gap-2 sm:gap-2.5'
        }`}
      >
        {/* Animated Top Announcement Bar */}
        <AnnouncementBar isScrolled={isScrolled} />

        <div className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full transition-all duration-300 ${
          isScrolled ? 'pt-1 sm:pt-1.5' : 'pt-0'
        }`}>
          <nav
            className={`flex items-center justify-between glass-waterdrop rounded-full transition-all duration-300 relative border border-white/95 dark:border-slate-800/90 ${
              isScrolled
                ? 'h-[60px] sm:h-[64px] px-3.5 sm:px-6 shadow-glass-lg'
                : 'h-[64px] sm:h-[68px] px-4 sm:px-7 shadow-glass'
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

            {/* 2. CENTER FLOATING DOCK */}
            <div
              ref={navContainerRef}
              onMouseLeave={() => setHoveredPath(null)}
              className="hidden lg:flex items-center relative p-1 rounded-full bg-slate-200/45 dark:bg-black/45 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-inner"
            >
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

              {settings.navLinks.map((link) => {
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
            </div>

            {/* 3. RIGHT ACTIONS (Desktop / Tablet) */}
            <div className="hidden md:flex items-center gap-2.5 sm:gap-3 shrink-0">
              <ThemeToggle />

              {/* User Profile Avatar with Hover Dropdown */}
              {user ? (
                <div
                  className="relative"
                  ref={dropdownRef}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
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
                  className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-xs shadow-sm"
                >
                  {user.name?.[0]?.toUpperCase() || 'U'}
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
        <div className="fixed inset-0 z-[9999999] md:hidden flex flex-col bg-white/98 dark:bg-[#07090e]/98 backdrop-blur-3xl animate-in fade-in duration-200 overflow-y-auto overscroll-contain">
          
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

              {/* Navigation Links */}
              <div className="flex flex-col space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 px-2 py-1 flex items-center justify-between">
                  <span>Main Menu</span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
                    <AshokaChakra size={11} />
                    <span>Made in India</span>
                  </span>
                </div>

                {settings.navLinks.map((link) => (
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

                {user && (
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-2xl text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/50 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>My Dashboard & Inquiries</span>
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
                    <span className="flex items-center gap-2">
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
                  handleGetStartedClick();
                }}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white l2b-gradient-bg flex items-center justify-center gap-2 shadow-glass-highlight cursor-pointer"
              >
                <span>{isAdmin ? 'Open Admin Panel' : 'Start Your Website'}</span>
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
