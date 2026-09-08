import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Smartphone, ChevronRight } from 'lucide-react';
import AshokaChakra from './AshokaChakra';

export default function AppSplashScreen() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isFirstAppLaunch, setIsFirstAppLaunch] = useState(false);
  const [isInstalledApp, setIsInstalledApp] = useState(false);
  const [isAndroidApp, setIsAndroidApp] = useState(false);

  useEffect(() => {
    // 1. Detect if running inside Installed Web App (Standalone PWA) or Android App
    let isApp = false;
    let isAndroid = false;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const ua = (navigator.userAgent || '').toLowerCase();
      const isParamAndroid = urlParams.get('mode') === 'android_app' || urlParams.get('source') === 'android' || urlParams.get('platform') === 'android' || urlParams.has('package');
      const isUaAndroid = ua.includes('; wv') || ua.includes('local2brand-android') || (ua.includes('android') && ua.includes('version/4.0'));
      const isSessionAndroid = sessionStorage.getItem('l2b_is_android_app') === 'true';

      if (isParamAndroid || isUaAndroid || isSessionAndroid) {
        isAndroid = true;
        isApp = true;
        sessionStorage.setItem('l2b_is_android_app', 'true');
        sessionStorage.setItem('l2b_is_app', 'true');
      }

      const isParamApp = urlParams.get('mode') === 'app' || urlParams.get('source') === 'pwa';
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = window.navigator.standalone === true;
      const isSessionApp = sessionStorage.getItem('l2b_is_app') === 'true';

      if (isParamApp || isStandaloneMedia || isIosStandalone || isSessionApp) {
        isApp = true;
        sessionStorage.setItem('l2b_is_app', 'true');
      }
    }
    setIsAndroidApp(isAndroid);
    setIsInstalledApp(isApp);

    // 2. Check First Time App Opening (Distinct for Installed App vs Web)
    try {
      if (isApp) {
        const hasOpenedApp = localStorage.getItem('l2b_installed_app_first_launch');
        if (!hasOpenedApp) {
          setIsFirstAppLaunch(true);
          localStorage.setItem('l2b_installed_app_first_launch', 'true');
        }
      } else {
        const hasVisitedWeb = sessionStorage.getItem('l2b_web_splash_shown');
        if (!hasVisitedWeb) {
          sessionStorage.setItem('l2b_web_splash_shown', 'true');
        }
      }
    } catch (e) {}

    // 3. Fast, High-Performance Progress Animation (1.2s - 1.6s lifecycle)
    const startTime = Date.now();
    // In installed app with first launch, give ~1.5s to enjoy the welcome banner; otherwise super-snappy ~1.1s
    const duration = isApp && isFirstAppLaunch ? 1500 : (isApp ? 1200 : 950);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsLoaded(true), 120);
        setTimeout(() => setIsRemoved(true), 500);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isFirstAppLaunch]);

  // Instant dismiss on click / tap
  const handleSkip = () => {
    setIsLoaded(true);
    setTimeout(() => setIsRemoved(true), 250);
  };

  if (isRemoved) return null;

  return (
    <div
      onClick={handleSkip}
      role="banner"
      aria-label="App Splash Screen"
      className={`fixed inset-0 z-[2147483646] flex flex-col items-center justify-between select-none cursor-pointer overflow-hidden bg-[#06080d] transition-all duration-500 ease-out ${
        isLoaded ? 'opacity-0 scale-105 blur-sm pointer-events-none' : 'opacity-100 scale-100 blur-0'
      }`}
      style={{ willChange: 'opacity, transform' }}
    >
      {/* 1. ARTISTIC MOVING LIQUID GLOW & AURORA BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Moving Aurora Blobs */}
        <div className="absolute -top-[20%] -left-[10%] w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] rounded-full bg-gradient-to-br from-purple-600/35 via-indigo-600/25 to-transparent blur-[100px] animate-pulse [animation-duration:4s]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full bg-gradient-to-tl from-cyan-500/30 via-fuchsia-600/20 to-transparent blur-[120px] animate-pulse [animation-duration:5s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] rounded-full bg-gradient-to-tr from-amber-500/15 via-purple-600/20 to-pink-500/25 blur-[90px] animate-spin [animation-duration:12s]" />

        {/* Ambient Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
        />
      </div>

      {/* 2. TOP STATUS / INSTALLED APP CHIP */}
      <div className="relative z-10 w-full pt-8 sm:pt-10 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAndroidApp ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-in fade-in duration-500">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Android App Active</span>
            </span>
          ) : isInstalledApp ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-in fade-in duration-500">
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
              <span>Installed Web App</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Official Studio</span>
            </span>
          )}
        </div>

        <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
          v2.4.0
        </div>
      </div>

      {/* 3. CENTER ARTISTIC LOGO & WELCOME BADGE */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md my-auto space-y-6">

        {/* ART MOVING 3D LOGO EMBLEM WITH MULTI-LAYER GLOW RINGS */}
        <div className="relative group">
          {/* Outer Liquid Conic Aura Spinner */}
          <div className="absolute -inset-4 sm:-inset-5 rounded-3xl sm:rounded-[32px] bg-gradient-to-r from-purple-600 via-cyan-400 to-pink-500 opacity-70 blur-xl animate-spin [animation-duration:6s]" />

          {/* Reverse Orbiting Shimmer Ring */}
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-amber-400/40 via-purple-500/40 to-cyan-400/40 opacity-80 blur-md animate-spin [animation-duration:10s] [animation-direction:reverse]" />

          {/* Glassmorphic Logo Shield */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.5)] border-2 border-white/20 bg-slate-900/90 backdrop-blur-2xl p-1 flex items-center justify-center transform transition-transform hover:scale-105 duration-300">
            <img
              src="/logo.jpg"
              alt="LOCAL2BRAND Logo"
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* SPECIAL WELCOME TO OUR APP FOR INSTALLED APP LAUNCH */}
        {isInstalledApp && isFirstAppLaunch ? (
          <div className="space-y-3 animate-in zoom-in-95 duration-500">
            {/* Animated Welcome Ribbon */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 border border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.4)] backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin [animation-duration:4s]" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
                Welcome To Our App
              </span>
              <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
            </div>

            {/* Brand Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
              LOCAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">2</span>BRAND
            </h1>

            <p className="text-xs sm:text-sm font-medium text-slate-300/90 max-w-xs mx-auto leading-relaxed">
              Official Inbuilt Web App • High-Speed 60FPS Companion
            </p>
          </div>
        ) : isInstalledApp ? (
          <div className="space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
                LOCAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">2</span>BRAND
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600/30 text-purple-300 border border-purple-400/40">
                APP
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-400">
              Build Local. Think Global.
            </p>
          </div>
        ) : (
          <div className="space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
                LOCAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">2</span>BRAND
              </h1>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <AshokaChakra size={11} />
                <span>IN</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-400">
              Build Local. Think Global.
            </p>
          </div>
        )}

        {/* 4. LIQUID NEON PROGRESS BAR & FAST STATUS */}
        <div className="w-60 sm:w-72 space-y-2 pt-2">
          <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner backdrop-blur-md">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(168,85,247,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1.5 text-[11px] font-sans font-medium text-slate-300">
              <Zap className="w-3 h-3 text-purple-400 animate-pulse" />
              <span>
                {isInstalledApp && isFirstAppLaunch
                  ? 'Initializing App Workspace...'
                  : isInstalledApp
                  ? 'Launching App...'
                  : 'Loading Studio...'}
              </span>
            </span>
            <span className="font-bold text-purple-400 font-mono">{progress}%</span>
          </div>
        </div>

      </div>

      {/* 5. FOOTER & TAP TO SKIP HINT */}
      <div className="relative z-10 w-full pb-8 sm:pb-10 px-6 flex flex-col items-center space-y-3 text-center">
        <p className="text-[11px] text-slate-500 hover:text-slate-400 transition-colors flex items-center gap-1">
          <span>Tap anywhere to continue</span>
          <ChevronRight className="w-3 h-3" />
        </p>

        {/* Tricolor Cyber Accent Line */}
        <div className="w-32 h-[2px] rounded-full bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500 opacity-70" />
      </div>
    </div>
  );
}
