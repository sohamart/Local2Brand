import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AshokaChakra from './AshokaChakra';

/**
 * Luxury 3D Dual Sliding Door Page Transition with Clean Square Emblem
 * Features an extended 700ms center pause so the user can clearly admire the transition.
 * Square 3D glass emblem core.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);
      setTransitionKey((k) => k + 1);

      // SWAP PAGE CONTENT IN THE MIDDLE OF THE EXTENDED CENTER PAUSE (720ms)
      const timer1 = setTimeout(() => {
        setDisplayLocation(location);
        window.scrollTo(0, 0);
      }, 720);

      // Clean up overlay after doors have fully opened (1900ms)
      const timer2 = setTimeout(() => {
        setIsTransitioning(false);
      }, 1900);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [location.pathname, displayLocation.pathname]);

  // Clone Routes and pass displayLocation so old page stays rendered until doors close!
  const renderedChildren = React.isValidElement(children)
    ? React.cloneElement(children, { location: displayLocation })
    : children;

  return (
    <>
      {isTransitioning && (
        <div
          key={transitionKey}
          className="fixed inset-0 z-[999999] pointer-events-none overflow-hidden [perspective:1400px]"
          aria-hidden="true"
        >
          {/* Left 3D Door */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1/2 animate-auto-door-left-3d"
            style={{
              background: isDark
                ? 'linear-gradient(90deg, #030406 0%, #080b12 65%, #101624 100%)'
                : 'linear-gradient(90deg, #ffffff 0%, #f1f5f9 65%, #e2e8f0 100%)',
              borderRight: isDark
                ? '1.5px solid rgba(168, 85, 247, 0.45)'
                : '1.5px solid rgba(0, 114, 255, 0.35)',
              boxShadow: isDark
                ? 'inset -12px 0 35px rgba(0,0,0,0.9), 6px 0 25px rgba(121,40,202,0.25)'
                : 'inset -12px 0 35px rgba(255,255,255,0.9), 6px 0 25px rgba(0,114,255,0.12)',
            }}
          >
            <div className={`absolute inset-y-0 right-16 w-[1px] ${isDark ? 'bg-white/5' : 'bg-slate-300/40'}`} />
          </div>

          {/* Right 3D Door */}
          <div
            className="absolute top-0 bottom-0 right-0 w-1/2 animate-auto-door-right-3d"
            style={{
              background: isDark
                ? 'linear-gradient(270deg, #030406 0%, #080b12 65%, #101624 100%)'
                : 'linear-gradient(270deg, #ffffff 0%, #f1f5f9 65%, #e2e8f0 100%)',
              borderLeft: isDark
                ? '1.5px solid rgba(168, 85, 247, 0.45)'
                : '1.5px solid rgba(0, 114, 255, 0.35)',
              boxShadow: isDark
                ? 'inset 12px 0 35px rgba(0,0,0,0.9), -6px 0 25px rgba(121,40,202,0.25)'
                : 'inset 12px 0 35px rgba(255,255,255,0.9), -6px 0 25px rgba(0,114,255,0.12)',
            }}
          >
            <div className={`absolute inset-y-0 left-16 w-[1px] ${isDark ? 'bg-white/5' : 'bg-slate-300/40'}`} />
          </div>

          {/* Center Clean Square 3D Emblem Lock */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-auto-door-emblem-3d">
            {/* Center Vertical Laser Seam */}
            <div
              className={`absolute top-0 bottom-0 w-[2px] ${
                isDark
                  ? 'bg-gradient-to-b from-purple-500 via-pink-500 to-amber-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]'
                  : 'bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]'
              }`}
            />

            {/* Clean Square 3D Glass Badge */}
            <div
              className={`relative z-10 flex flex-col items-center justify-center gap-2 p-3.5 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-2xl border transition-all ${
                isDark
                  ? 'bg-[#080b12]/95 border-purple-500/50 shadow-[0_0_35px_rgba(121,40,202,0.3)] ring-1 ring-purple-500/20'
                  : 'bg-white/95 border-slate-200/90 shadow-[0_0_35px_rgba(0,114,255,0.15)] ring-1 ring-blue-400/20'
              }`}
            >
              {/* Square 3D Master Logo */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-md shrink-0 border flex items-center justify-center ${
                  isDark ? 'border-white/20 bg-slate-900 shadow-purple-500/20' : 'border-slate-200 bg-white shadow-blue-500/15'
                }`}
              >
                <img
                  src="/logo.jpg"
                  alt="LOCAL2BRAND Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Square Base Title & Indian Pride */}
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
                    className={`inline-flex items-center gap-0.5 text-[7px] font-bold px-1 py-0.2 rounded border ${
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

      {/* Main Page Route Viewport */}
      <div className="flex-1 flex flex-col">
        {renderedChildren}
      </div>
    </>
  );
}
