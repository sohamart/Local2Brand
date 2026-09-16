import React, { createContext, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import AshokaChakra from './AshokaChakra';

const PageTransitionContext = createContext({ displayLocation: null });

export const usePageTransition = () => useContext(PageTransitionContext);

export default function PageTransition({ children }) {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  const activeLogo = isDark
    ? (settings?.logoDarkUrl || settings?.logoLightUrl || '/logo.png')
    : (settings?.logoLightUrl || settings?.logoDarkUrl || '/logo.png');
  const brandName = settings?.brandName || 'WEBLETS';

  useEffect(() => {
    // When path changes, trigger cinematic door close -> swap page -> door open sequence
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);
      setTransitionKey((k) => k + 1);

      // 1. SWAP PAGE CONTENT WHEN DOORS ARE 100% CLOSED (190ms)
      const timerSwap = setTimeout(() => {
        setDisplayLocation(location);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true });
        }
      }, 190);

      // 2. COMPLETE TRANSITION & DISMISS OVERLAY AFTER DOORS FULLY OPEN (720ms)
      const timerEnd = setTimeout(() => {
        setIsTransitioning(false);
        if (window.lenis) {
          window.lenis.resize();
        }
      }, 720);

      return () => {
        clearTimeout(timerSwap);
        clearTimeout(timerEnd);
      };
    }
  }, [location.pathname, displayLocation.pathname]);

  const renderOverlay = () => {
    if (!isTransitioning || typeof document === 'undefined') return null;

    const overlayContent = (
      <div
        key={transitionKey}
        className="fixed inset-0 z-[2147483647] pointer-events-none overflow-hidden"
        style={{ contain: 'strict' }}
        aria-hidden="true"
      >
        {/* Left Vault Shutter Door (Pure GPU 2D Translate) */}
        <div
          className="absolute top-0 bottom-0 left-0 w-[50.5%] animate-auto-door-left-3d"
          style={{
            backgroundColor: isDark ? '#060812' : '#f8fafc',
            borderRight: isDark ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(99, 102, 241, 0.4)',
          }}
        >
          {/* Neon Light Blade */}
          <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-purple-500 to-pink-500 shadow-[0_0_12px_#a855f7]" />
        </div>

        {/* Right Vault Shutter Door (Pure GPU 2D Translate) */}
        <div
          className="absolute top-0 bottom-0 right-0 w-[50.5%] animate-auto-door-right-3d"
          style={{
            backgroundColor: isDark ? '#060812' : '#f8fafc',
            borderLeft: isDark ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(99, 102, 241, 0.4)',
          }}
        >
          {/* Neon Light Blade */}
          <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-purple-500 shadow-[0_0_12px_#06b6d4]" />
        </div>

        {/* Center Master Brand Holographic Emblem */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-auto-door-emblem-3d">
          {/* Master Liquid Glass Pod */}
          <div
            className={`relative z-10 flex flex-col items-center justify-center p-5 sm:p-6 rounded-3xl shadow-2xl border transition-all ${
              isDark
                ? 'bg-[#080b18]/95 border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.35)]'
                : 'bg-white/95 border-purple-200/90 shadow-[0_0_40px_rgba(99,102,241,0.25)]'
            }`}
          >
            {/* Logo Display */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center p-1.5 relative">
              <img
                src={activeLogo}
                alt={`${brandName} Logo`}
                className="w-full h-full object-contain drop-shadow-[0_6px_18px_rgba(168,85,247,0.55)]"
                onError={(e) => {
                  e.currentTarget.src = '/logo.png';
                }}
              />
            </div>

            {/* Seamless Brand Typography Pill */}
            <div
              className={`mt-3 px-3.5 py-1 rounded-full flex items-center gap-2 border shadow-sm ${
                isDark
                  ? 'bg-white/[0.08] border-white/10 text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-900'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-black tracking-[0.3em] uppercase bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                {brandName}
              </span>
            </div>
          </div>
        </div>
      </div>
    );

    return createPortal(overlayContent, document.body);
  };

  return (
    <PageTransitionContext.Provider value={{ displayLocation }}>
      {/* 1. CINEMATIC DUAL DOORS PORTAL (Above Navbar & Footer at z-[2147483647]) */}
      {renderOverlay()}

      {/* 2. PAGE CONTENT VIEWPORT */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </PageTransitionContext.Provider>
  );
}
