import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Zap, Smartphone, ChevronRight } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function AppSplashScreen() {
  const { settings, loading: settingsLoading } = useSiteSettings();
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isFirstAppLaunch, setIsFirstAppLaunch] = useState(false);
  const [isInstalledApp, setIsInstalledApp] = useState(false);
  const [isAndroidApp, setIsAndroidApp] = useState(false);

  const reqRef = useRef(null);
  const startTimeRef = useRef(null);
  const finishStartTimeRef = useRef(null);
  const isFinishedRef = useRef(false);
  const progressRef = useRef(0);

  const brandName = settings?.brandName || 'WEBLETS';
  const tagline = settings?.tagline || 'Lets make website together';
  const activeLogo = settings?.logoLightUrl || settings?.logoDarkUrl || '/logo.png';

  const statusMessages = [
    'Connecting to Cloud Engine...',
    'Synchronizing Live Settings & Themes...',
    'Calibrating Liquid Visuals...',
    `Welcome to ${brandName}`
  ];

  useEffect(() => {
    // Detect environment (PWA Standalone vs Android vs Web)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const ua = (navigator.userAgent || '').toLowerCase();
      const isParamAndroid = urlParams.get('mode') === 'android_app' || urlParams.get('source') === 'android' || urlParams.get('platform') === 'android' || urlParams.has('package');
      const isUaAndroid = ua.includes('; wv') || ua.includes('local2brand-android') || (ua.includes('android') && ua.includes('version/4.0'));
      const isAndroidBridge = !!(window.Android || window.AndroidBridge || window.Local2BrandAndroid);

      const isAndroid = Boolean(isParamAndroid || isUaAndroid || isAndroidBridge);
      const isParamApp = urlParams.get('mode') === 'app' || urlParams.get('source') === 'pwa';
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = window.navigator.standalone === true;
      const isApp = Boolean(isAndroid || isParamApp || isStandaloneMedia || isIosStandalone);

      setIsAndroidApp(isAndroid);
      setIsInstalledApp(isApp);

      try {
        if (isApp) {
          const hasOpenedApp = localStorage.getItem('l2b_installed_app_first_launch');
          if (!hasOpenedApp) {
            setIsFirstAppLaunch(true);
            localStorage.setItem('l2b_installed_app_first_launch', 'true');
          }
        }
      } catch (e) {}
    }
  }, []);

  // Synchronized loading controller: Holds until settings are confirmed from backend
  useEffect(() => {
    const minDisplayTime = isInstalledApp && isFirstAppLaunch ? 700 : 500;
    const maxSafetyTimeout = 3800; // Never block forever if network drops

    const animate = (timestamp) => {
      if (isFinishedRef.current) return;
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current;
      const isReadyToComplete = (!settingsLoading && elapsed >= minDisplayTime) || elapsed >= maxSafetyTimeout;

      if (!isReadyToComplete) {
        // While waiting for backend settings, smoothly glide up towards ~88%
        const simulatedPhase = Math.min(1, elapsed / 1800);
        const currentSimulated = Math.min(88, Math.round((1 - Math.pow(1 - simulatedPhase, 2)) * 88));
        progressRef.current = Math.max(progressRef.current, currentSimulated);
        setProgress(progressRef.current);

        if (progressRef.current < 35) {
          setStatusIndex(0);
        } else if (progressRef.current < 70) {
          setStatusIndex(1);
        } else {
          setStatusIndex(2);
        }

        reqRef.current = requestAnimationFrame(animate);
      } else {
        // Backend settings loaded! Swiftly finish from current position to 100%
        if (!finishStartTimeRef.current) finishStartTimeRef.current = timestamp;
        const finishElapsed = timestamp - finishStartTimeRef.current;
        const finishDuration = 220; // Fast smooth snap to 100%
        const finishPct = Math.min(1, finishElapsed / finishDuration);

        const startFrom = progressRef.current;
        const finalVal = Math.min(100, Math.round(startFrom + (100 - startFrom) * finishPct));
        progressRef.current = finalVal;
        setProgress(finalVal);
        setStatusIndex(3);

        if (finishPct < 1) {
          reqRef.current = requestAnimationFrame(animate);
        } else {
          isFinishedRef.current = true;
          setProgress(100);
          setTimeout(() => setIsFadingOut(true), 100);
          setTimeout(() => setIsRemoved(true), 750);
        }
      }
    };

    reqRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [settingsLoading, isInstalledApp, isFirstAppLaunch]);

  // Instant skip on tap/click or keyboard press
  const handleSkip = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    setProgress(100);
    setStatusIndex(3);
    setIsFadingOut(true);
    setTimeout(() => setIsRemoved(true), 400);
  };

  if (isRemoved) return null;

  return (
    <div
      onClick={handleSkip}
      role="banner"
      aria-label="App Splash Screen"
      className={`fixed inset-0 z-[2147483646] flex flex-col items-center justify-between select-none overflow-hidden bg-[#030611] cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isFadingOut
          ? 'opacity-0 scale-[1.03] blur-sm pointer-events-none'
          : 'opacity-100 scale-100 blur-0'
      }`}
      style={{ willChange: 'opacity, transform, filter' }}
    >
      {/* 1. CINEMATIC BACKGROUND GLOW & CYBER GRID */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left soft violet aura */}
        <div className="absolute -top-[15%] -left-[10%] w-[380px] sm:w-[540px] h-[380px] sm:h-[540px] rounded-full bg-gradient-to-br from-purple-600/30 via-indigo-600/20 to-transparent blur-[110px] animate-pulse [animation-duration:3s]" />
        
        {/* Bottom-right cyan neon aura */}
        <div className="absolute -bottom-[15%] -right-[10%] w-[400px] sm:w-[580px] h-[400px] sm:h-[580px] rounded-full bg-gradient-to-tl from-cyan-500/25 via-blue-600/20 to-transparent blur-[120px] animate-pulse [animation-duration:4s]" />
        
        {/* Center rotating jewel spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-purple-500/20 to-pink-500/15 blur-[90px] animate-spin [animation-duration:10s]" />

        {/* Precision Cyber Matrix Grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
        />
      </div>

      {/* 2. TOP STATUS BAR / PILL */}
      <div className="relative z-10 w-full pt-7 sm:pt-9 px-6 max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAndroidApp ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Android App Active</span>
            </span>
          ) : isInstalledApp ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.25)]">
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
              <span>Installed Web App</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/[0.04] text-slate-300 border border-white/10 backdrop-blur-xl shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span>Official Weblets Studio</span>
            </span>
          )}
        </div>

        <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/10 backdrop-blur-xl">
          v2.4.0
        </div>
      </div>

      {/* 3. CENTER ULTRA-PREMIUM LOGO & HERO TYPOGRAPHY */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm sm:max-w-md my-auto space-y-6">

        {/* 3D LOGO EMBLEM WITH LIQUID CONIC AURA RINGS (PERFECT ZOOM FIT) */}
        <div className="relative flex items-center justify-center">
          {/* Outer Breathing Liquid Conic Spinner */}
          <div className="absolute -inset-3 sm:-inset-4 rounded-full bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 opacity-80 blur-xl animate-spin [animation-duration:4s]" />

          {/* Reverse Orbiting Neon Glow */}
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-purple-500/60 via-cyan-400/60 to-pink-400/60 opacity-90 blur-md animate-spin [animation-duration:6s] [animation-direction:reverse]" />

          {/* Glowing Circular Glass Capsule Frame - Seamless Liquid Fit */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.45),0_0_35px_rgba(124,58,237,0.5)] ring-2 ring-purple-400/40 border border-white/20 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-2.5 transform transition-transform duration-500 hover:scale-105">
            <img
              src={activeLogo}
              alt={`${brandName} Logo`}
              className="w-full h-full object-contain transform-gpu scale-105"
              onError={(e) => {
                e.currentTarget.src = '/logo.png';
              }}
            />
          </div>
        </div>

        {/* BRAND HEADLINE & SLOGAN */}
        <div className="space-y-2">
          {isInstalledApp && isFirstAppLaunch ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 border border-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.3)] backdrop-blur-md mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin [animation-duration:3s]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
                Welcome To Our App
              </span>
            </div>
          ) : null}

          <h1 className="text-3xl sm:text-4xl font-black tracking-[0.2em] text-white leading-none">
            {brandName}
          </h1>

          <p className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-cyan-200 to-purple-200">
            {tagline}
          </p>
        </div>

        {/* 4. LIQUID NEON PROGRESS BAR & ACCURATE PERCENT */}
        <div className="w-64 sm:w-80 space-y-2.5 pt-1">
          {/* Glowing Track */}
          <div className="relative h-2 w-full bg-slate-900/90 rounded-full overflow-hidden border border-white/15 p-0.5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 transition-all duration-75 ease-out shadow-[0_0_15px_rgba(6,182,212,0.8)] relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Specular Light Reflection Glint */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite] -translate-x-full" />
            </div>
          </div>

          {/* Dynamic Status + Percentage Row */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 transition-all duration-200">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-[240px]">
                {statusMessages[statusIndex]}
              </span>
            </span>
            <span className="font-mono font-bold text-cyan-400 text-xs tracking-tight">
              {progress}%
            </span>
          </div>
        </div>

      </div>

      {/* 5. FOOTER & TAP TO CONTINUE HINT */}
      <div className="relative z-10 w-full pb-7 sm:pb-9 px-6 flex flex-col items-center space-y-3 text-center">
        <div className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer py-1">
          <span className="tracking-wide">Tap anywhere to continue</span>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
        </div>

        {/* Elegant Cyan-Purple Cyber Line */}
        <div className="w-28 h-[2px] rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
      </div>
    </div>
  );
}
