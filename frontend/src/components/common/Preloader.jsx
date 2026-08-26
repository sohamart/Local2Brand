import React, { useState, useEffect } from 'react';
import AshokaChakra from './AshokaChakra';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // Smooth progress counter simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoaded(true), 150);
          setTimeout(() => setIsRemoved(true), 850);
          return 100;
        }
        const diff = Math.floor(Math.random() * 25) + 10;
        return Math.min(prev + diff, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  if (isRemoved) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-2xl transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient Liquid Gradient Glows behind preloader */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] bg-gradient-to-tr from-cyan-400/20 via-purple-500/20 to-pink-500/25 rounded-full blur-[90px] animate-pulse pointer-events-none" />

      {/* Main Preloader Content Card */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-6">
        
        {/* Animated 3D Liquid Jelly Logo with Pulsing Glow Ring */}
        <div className="relative group">
          {/* Rotating Liquid Glow Aura */}
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 opacity-60 blur-lg animate-spin [animation-duration:8s]" />

          {/* Logo Container */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/90 bg-white p-0.5 animate-float">
            <img
              src="/logo.jpg"
              alt="LOCAL2BRAND Official 3D Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-900 leading-none">
              LOCAL<span className="l2b-gradient-text">2</span>BRAND
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs">
              <AshokaChakra size={11} />
              <span>IN</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-widest">
            Build Local. Think Global.
          </p>
        </div>

        {/* Minimal Liquid Progress Bar */}
        <div className="w-56 sm:w-64 space-y-2 pt-2">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 p-0.5 shadow-inner">
            <div
              className="h-full rounded-full l2b-gradient-bg transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 px-1">
            <span className="flex items-center gap-1 text-[10px] uppercase font-sans tracking-wider text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Loading Studio</span>
            </span>
            <span className="text-purple-600">{progress}%</span>
          </div>
        </div>

      </div>

      {/* Bottom Tricolor Accent Ribbon */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-500 via-blue-600 to-emerald-600" />
    </div>
  );
}
