import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AshokaChakra from './AshokaChakra';

/**
 * Organic Slow Liquid Wave Page Transition
 * Features a slow, fluid, curving liquid wave sweep tailored for Light Mode & Dark Mode.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [waveStage, setWaveStage] = useState('idle'); // 'idle', 'in', 'out'
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  useEffect(() => {
    if (location.pathname !== currentPath) {
      // 1. Start slow liquid wave wash down
      setIsTransitioning(true);
      setWaveStage('in');

      // 2. Midway: update route content & reset scroll
      const timer1 = setTimeout(() => {
        setCurrentPath(location.pathname);
        window.scrollTo(0, 0);
        setWaveStage('out');
      }, 520);

      // 3. Complete liquid wave exit
      const timer2 = setTimeout(() => {
        setIsTransitioning(false);
        setWaveStage('idle');
      }, 1100);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [location.pathname, currentPath]);

  return (
    <>
      {isTransitioning && (
        <div className="fixed inset-0 z-[999999] pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Layer 1: Leading Fluid Water Layer */}
          <div
            className={`absolute inset-0 transition-transform ${
              waveStage === 'in'
                ? 'animate-liquid-lead-in'
                : waveStage === 'out'
                ? 'animate-liquid-lead-out'
                : 'translate-y-full'
            }`}
            style={{
              background: isDark
                ? 'linear-gradient(180deg, #7928ca 0%, #0072ff 100%)'
                : 'linear-gradient(180deg, #00c6ff 0%, #0072ff 100%)',
              opacity: 0.85,
            }}
          />

          {/* Layer 2: Main Organic Liquid Wave Curtain */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-transform ${
              waveStage === 'in'
                ? 'animate-liquid-wave-in'
                : waveStage === 'out'
                ? 'animate-liquid-wave-out'
                : 'translate-y-full'
            }`}
            style={{
              background: isDark
                ? 'linear-gradient(180deg, #07090e 0%, #0e1424 60%, #15132d 100%)'
                : 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 60%, #e0f2fe 100%)',
            }}
          >
            {/* Ambient Liquid Plasma Orb */}
            <div
              className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none animate-pulse ${
                isDark ? 'bg-purple-600/30' : 'bg-cyan-500/20'
              }`}
            />

            {/* Floating Brand Center inside Liquid */}
            <div className="relative z-10 flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-500">
              <div
                className={`w-16 h-16 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center p-0.5 border ${
                  isDark
                    ? 'border-white/20 bg-slate-900 shadow-purple-500/25'
                    : 'border-slate-200 bg-white shadow-cyan-500/20'
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

            {/* Organic Wavy Bottom Edge SVG */}
            <div className="absolute -bottom-1 left-0 right-0 overflow-hidden leading-none pointer-events-none">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className={`relative block w-full h-12 ${
                  isDark ? 'text-[#07090e] fill-current' : 'text-[#ffffff] fill-current'
                }`}
              >
                <path d="M0,0 C150,90 350,-40 500,60 C650,140 900,-20 1200,40 L1200,120 L0,120 Z"></path>
              </svg>
            </div>

            {/* Bottom Edge Tricolor Laser Stream */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500" />
          </div>
        </div>
      )}

      {/* Main Page Route Viewport */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </>
  );
}
