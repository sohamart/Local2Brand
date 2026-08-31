import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AshokaChakra from './AshokaChakra';

const PageTransitionContext = createContext({ displayLocation: null });

export const usePageTransition = () => useContext(PageTransitionContext);

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  useEffect(() => {
    // When path changes, trigger cinematic door close -> swap page -> door open sequence
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);
      setTransitionKey((k) => k + 1);

      // 1. SWAP PAGE CONTENT WHEN DOORS ARE 100% CLOSED (420ms)
      const timerSwap = setTimeout(() => {
        setDisplayLocation(location);
        window.scrollTo(0, 0);
      }, 420);

      // 2. COMPLETE TRANSITION & REMOVE OVERLAY AFTER DOORS FULLY OPEN (1150ms)
      const timerEnd = setTimeout(() => {
        setIsTransitioning(false);
      }, 1150);

      return () => {
        clearTimeout(timerSwap);
        clearTimeout(timerEnd);
      };
    }
  }, [location.pathname, displayLocation.pathname]);

  return (
    <PageTransitionContext.Provider value={{ displayLocation }}>
      {/* 1. CINEMATIC DUAL DOORS OVERLAY */}
      {isTransitioning && (
        <div
          key={transitionKey}
          className="fixed inset-0 z-[999999] pointer-events-none overflow-hidden [perspective:1400px]"
          aria-hidden="true"
        >
          {/* Left Shutter Door */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1/2 animate-auto-door-left-3d"
            style={{
              background: isDark
                ? 'linear-gradient(90deg, #030406 0%, #080b12 65%, #101624 100%)'
                : 'linear-gradient(90deg, #ffffff 0%, #f1f5f9 65%, #e2e8f0 100%)',
              borderRight: isDark
                ? '2px solid rgba(168, 85, 247, 0.6)'
                : '2px solid rgba(0, 114, 255, 0.5)',
              boxShadow: isDark
                ? 'inset -12px 0 35px rgba(0,0,0,0.95), 8px 0 30px rgba(121,40,202,0.35)'
                : 'inset -12px 0 35px rgba(255,255,255,0.95), 8px 0 30px rgba(0,114,255,0.2)',
            }}
          >
            <div className={`absolute inset-y-0 right-14 w-[1px] ${isDark ? 'bg-white/10' : 'bg-slate-300/50'}`} />
          </div>

          {/* Right Shutter Door */}
          <div
            className="absolute top-0 bottom-0 right-0 w-1/2 animate-auto-door-right-3d"
            style={{
              background: isDark
                ? 'linear-gradient(270deg, #030406 0%, #080b12 65%, #101624 100%)'
                : 'linear-gradient(270deg, #ffffff 0%, #f1f5f9 65%, #e2e8f0 100%)',
              borderLeft: isDark
                ? '2px solid rgba(168, 85, 247, 0.6)'
                : '2px solid rgba(0, 114, 255, 0.5)',
              boxShadow: isDark
                ? 'inset 12px 0 35px rgba(0,0,0,0.95), -8px 0 30px rgba(121,40,202,0.35)'
                : 'inset 12px 0 35px rgba(255,255,255,0.95), -8px 0 30px rgba(0,114,255,0.2)',
            }}
          >
            <div className={`absolute inset-y-0 left-14 w-[1px] ${isDark ? 'bg-white/10' : 'bg-slate-300/50'}`} />
          </div>

          {/* Center 3D Master Brand Emblem */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-auto-door-emblem-3d">
            {/* Center Laser Beam */}
            <div
              className={`absolute top-0 bottom-0 w-[2px] ${
                isDark
                  ? 'bg-gradient-to-b from-purple-500 via-pink-500 to-amber-500 shadow-[0_0_20px_rgba(236,72,153,0.9)]'
                  : 'bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(59,130,246,0.9)]'
              }`}
            />

            {/* Emblem Glass Pod */}
            <div
              className={`relative z-10 flex flex-col items-center justify-center gap-2.5 p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-2xl border transition-all ${
                isDark
                  ? 'bg-[#080b12]/95 border-purple-500/60 shadow-[0_0_40px_rgba(121,40,202,0.4)] ring-1 ring-purple-500/30'
                  : 'bg-white/95 border-slate-200/95 shadow-[0_0_40px_rgba(0,114,255,0.2)] ring-1 ring-blue-400/30'
              }`}
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-lg shrink-0 border flex items-center justify-center ${
                  isDark ? 'border-white/20 bg-slate-900 shadow-purple-500/25' : 'border-slate-200 bg-white shadow-blue-500/20'
                }`}
              >
                <img
                  src="/logo.jpg"
                  alt="LOCAL2BRAND Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col items-center gap-0.5 text-center">
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs sm:text-sm font-black tracking-tight leading-none ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    LOCAL<span className="l2b-gradient-text">2</span>BRAND
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[7px] font-bold px-1.5 py-0.5 rounded border ${
                      isDark
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                    }`}
                  >
                    <AshokaChakra size={8} />
                    <span>IN</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAGE CONTENT VIEWPORT */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </PageTransitionContext.Provider>
  );
}
