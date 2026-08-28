import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AshokaChakra from './AshokaChakra';

/**
 * Luxury Dual Sliding Door Page Transition (Automatic Open & Close)
 * The doors slide in to close, lock at center, and automatically slide open to reveal the page.
 * Features Obsidian Black in Dark Mode & Frosted Pearl Crystal in Light Mode.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [transitionKey, setTransitionKey] = useState(0);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  useEffect(() => {
    if (location.pathname !== prevPath) {
      setPrevPath(location.pathname);
      window.scrollTo(0, 0);
      setTransitionKey((k) => k + 1);
    }
  }, [location.pathname, prevPath]);

  return (
    <>
      {transitionKey > 0 && (
        <div
          key={transitionKey}
          className="fixed inset-0 z-[999999] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Left Door (Closes to center and automatically opens to left) */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1/2 animate-auto-door-left"
            style={{
              background: isDark
                ? 'linear-gradient(90deg, #05070a 0%, #0d121c 70%, #151b29 100%)'
                : 'linear-gradient(90deg, #ffffff 0%, #f1f5f9 70%, #e2e8f0 100%)',
              borderRight: isDark
                ? '1.5px solid rgba(168, 85, 247, 0.5)'
                : '1.5px solid rgba(0, 114, 255, 0.4)',
              boxShadow: isDark
                ? 'inset -10px 0 30px rgba(0,0,0,0.8), 5px 0 25px rgba(121,40,202,0.25)'
                : 'inset -10px 0 30px rgba(255,255,255,0.9), 5px 0 25px rgba(0,114,255,0.12)',
            }}
          >
            {/* Architectural Seam Line */}
            <div className={`absolute inset-y-0 right-14 w-[1px] ${isDark ? 'bg-white/5' : 'bg-slate-300/40'}`} />
          </div>

          {/* Right Door (Closes to center and automatically opens to right) */}
          <div
            className="absolute top-0 bottom-0 right-0 w-1/2 animate-auto-door-right"
            style={{
              background: isDark
                ? 'linear-gradient(270deg, #05070a 0%, #0d121c 70%, #151b29 100%)'
                : 'linear-gradient(270deg, #ffffff 0%, #f1f5f9 70%, #e2e8f0 100%)',
              borderLeft: isDark
                ? '1.5px solid rgba(168, 85, 247, 0.5)'
                : '1.5px solid rgba(0, 114, 255, 0.4)',
              boxShadow: isDark
                ? 'inset 10px 0 30px rgba(0,0,0,0.8), -5px 0 25px rgba(121,40,202,0.25)'
                : 'inset 10px 0 30px rgba(255,255,255,0.9), -5px 0 25px rgba(0,114,255,0.12)',
            }}
          >
            {/* Architectural Seam Line */}
            <div className={`absolute inset-y-0 left-14 w-[1px] ${isDark ? 'bg-white/5' : 'bg-slate-300/40'}`} />
          </div>

          {/* Center Brand Emblem Lock */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-auto-door-emblem">
            {/* Center Laser Light Seam */}
            <div
              className={`absolute top-0 bottom-0 w-[2px] ${
                isDark
                  ? 'bg-gradient-to-b from-purple-500 via-pink-500 to-amber-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]'
                  : 'bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]'
              }`}
            />

            {/* Glowing Brand Center Core */}
            <div
              className={`relative z-10 flex flex-col items-center gap-3 p-4 rounded-3xl shadow-2xl backdrop-blur-xl border ${
                isDark
                  ? 'bg-[#090c14]/95 border-purple-500/40 shadow-purple-500/20'
                  : 'bg-white/95 border-blue-200 shadow-blue-500/15'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl overflow-hidden shadow-2xl p-0.5 border flex items-center justify-center ${
                  isDark ? 'border-white/20 bg-slate-900' : 'border-slate-200 bg-white'
                }`}
              >
                <img
                  src="/logo.jpg"
                  alt="LOCAL2BRAND Logo"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xl font-black tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  LOCAL<span className="l2b-gradient-text">2</span>BRAND
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    isDark
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}
                >
                  <AshokaChakra size={10} />
                  <span>IN</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Route Viewport with Clean 3D Lift */}
      <div key={location.pathname} className="flex-1 flex flex-col animate-page-enter">
        {children}
      </div>
    </>
  );
}
