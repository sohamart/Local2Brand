import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Zap, Award, Flame } from 'lucide-react';

export default function CulturalMascotArt({ country = 'India', lang = 'en' }) {
  const [interactiveCount, setInteractiveCount] = useState(0);
  const [showSparkle, setShowSparkle] = useState(false);

  const handleMascotClick = () => {
    setInteractiveCount(prev => prev + 1);
    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 1200);
  };

  // Render specific illustrated animated scene based on country
  const renderCulturalScene = () => {
    switch (country) {
      case 'India':
        return (
          <div className="relative w-full h-full flex items-center justify-between overflow-hidden select-none">
            {/* Left: Animated Durga Puja & Festive Dhunuchi Dancer Mascot */}
            <div className="flex items-center gap-3 relative z-10">
              <div 
                onClick={handleMascotClick}
                className="relative cursor-pointer group transition-transform active:scale-90"
                title="Click for celebratory Durga Puja blessings & sparkles! ✨"
              >
                {/* Glowing Trishul & Halo */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-400/30 blur-xs animate-ping" />
                
                {/* Durga Maa & Child Avatar Container */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 p-0.5 shadow-md group-hover:rotate-3 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden text-2xl sm:text-3xl">
                    <span className="animate-bounce" style={{ animationDuration: '2.5s' }}>🔱</span>
                    {/* Floating festive diya */}
                    <span className="absolute bottom-0 right-0 text-xs animate-pulse">🪔</span>
                  </div>
                </div>

                {/* Micro interaction heart badge */}
                {interactiveCount > 0 && (
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[9px] font-black shadow-xs animate-in zoom-in">
                    +{interactiveCount}
                  </span>
                )}
              </div>

              {/* Cultural Narrative Text */}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <span>স্বাগতম • Namaste Bharat</span>
                    <span className="text-base animate-pulse">🇮🇳</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    Durga Puja &amp; Festive Heritage
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight mt-0.5">
                  Celebrating Shakti, innovation &amp; timeless digital craftsmanship
                </p>
                
                {/* Micro animated cultural elements */}
                <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                  <span className="flex items-center gap-0.5 animate-pulse">🪔 Diyas</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">🌸 Lotus Blessings</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">🥁 Dhak &amp; Sitar</span>
                </div>
              </div>
            </div>

            {/* Right: Tiranga & Taj Arch Wave */}
            <div className="hidden sm:flex items-center gap-2 relative z-10 pr-2">
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Made for India 🇮🇳
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Bengal &amp; Pan-India Tech
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-xl shadow-xs animate-pulse">
                🦚
              </div>
            </div>

            {/* Background subtle cultural decorative motifs */}
            <div className="absolute right-12 -bottom-2 text-4xl opacity-10 dark:opacity-5 pointer-events-none select-none">
              🕌 🪔 🌸
            </div>
          </div>
        );

      case 'Bangladesh':
        return (
          <div className="relative w-full h-full flex items-center justify-between overflow-hidden select-none">
            {/* Left: Pohela Boishakh & Royal Bengal Tiger Mascot */}
            <div className="flex items-center gap-3 relative z-10">
              <div 
                onClick={handleMascotClick}
                className="relative cursor-pointer group transition-transform active:scale-90"
                title="শুভ নববর্ষ! Click for Boishakhi melodies! ✨"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-red-600 to-emerald-700 p-0.5 shadow-md group-hover:rotate-3 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden text-2xl sm:text-3xl">
                    <span className="animate-bounce" style={{ animationDuration: '2.5s' }}>🐅</span>
                    <span className="absolute bottom-0 right-0 text-xs animate-pulse">🌺</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <span>স্বাগতম বাংলাদেশ</span>
                    <span className="text-base">🇧🇩</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    পহেলা বৈশাখ ও সোনার বাংলা
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight mt-0.5">
                  পদ্মা-মেঘনার নদীমাতৃক সৌন্দর্য ও স্মার্ট ডিজিটাল বাংলাদেশ
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <span>🌾 সোনালী ধান</span>
                  <span>•</span>
                  <span>⛵ পালতোলা নৌকা</span>
                  <span>•</span>
                  <span>🪕 একতারা সুর</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 relative z-10 pr-2">
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Lal Sabuj 🇧🇩
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Dhaka &amp; Chittagong
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-xl shadow-xs">
                🌾
              </div>
            </div>
          </div>
        );

      case 'United Arab Emirates':
        return (
          <div className="relative w-full h-full flex items-center justify-between overflow-hidden select-none">
            <div className="flex items-center gap-3 relative z-10">
              <div 
                onClick={handleMascotClick}
                className="relative cursor-pointer group transition-transform active:scale-90"
                title="Marhaba! Click for Dubai Golden Falcon glow! ✨"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-emerald-600 p-0.5 shadow-md group-hover:rotate-3 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden text-2xl sm:text-3xl">
                    <span className="animate-bounce" style={{ animationDuration: '2.5s' }}>🦅</span>
                    <span className="absolute bottom-0 right-0 text-xs">🕌</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <span>Marhaba UAE • مرحباً</span>
                    <span className="text-base">🇦🇪</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    Dubai &amp; Abu Dhabi Luxury
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight mt-0.5">
                  Futuristic skyline architecture &amp; high-velocity Gulf innovation
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                  <span>👑 Arabian Oud</span>
                  <span>•</span>
                  <span>🌴 Palm Jumeirah</span>
                  <span>•</span>
                  <span>✨ Gold Standard</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 relative z-10 pr-2">
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Gulf Elite 🇦🇪
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Burj Skyline Tech
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-xl shadow-xs">
                🕌
              </div>
            </div>
          </div>
        );

      case 'United States':
        return (
          <div className="relative w-full h-full flex items-center justify-between overflow-hidden select-none">
            <div className="flex items-center gap-3 relative z-10">
              <div 
                onClick={handleMascotClick}
                className="relative cursor-pointer group transition-transform active:scale-90"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-600 p-0.5 shadow-md group-hover:rotate-3 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden text-2xl sm:text-3xl">
                    <span className="animate-bounce" style={{ animationDuration: '2.5s' }}>🗽</span>
                    <span className="absolute bottom-0 right-0 text-xs">🚀</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <span>Welcome USA</span>
                    <span className="text-base">🇺🇸</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                    Silicon Valley &amp; NYC Edition
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight mt-0.5">
                  Enterprise-scale software engineering &amp; modern brand aesthetics
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                  <span>⚡ Silicon Valley</span>
                  <span>•</span>
                  <span>⭐ Wall Street</span>
                  <span>•</span>
                  <span>🚀 Apollo Velocity</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 relative z-10 pr-2">
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Enterprise 🇺🇸
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Global Leader
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/40 flex items-center justify-center text-xl shadow-xs">
                ⭐
              </div>
            </div>
          </div>
        );

      case 'United Kingdom':
        return (
          <div className="relative w-full h-full flex items-center justify-between overflow-hidden select-none">
            <div className="flex items-center gap-3 relative z-10">
              <div 
                onClick={handleMascotClick}
                className="relative cursor-pointer group transition-transform active:scale-90"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-blue-800 to-amber-500 p-0.5 shadow-md group-hover:rotate-3 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden text-2xl sm:text-3xl">
                    <span className="animate-bounce" style={{ animationDuration: '2.5s' }}>💂</span>
                    <span className="absolute bottom-0 right-0 text-xs">👑</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <span>Welcome Great Britain</span>
                    <span className="text-base">🇬🇧</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700">
                    London Royal Standard
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight mt-0.5">
                  Westminster royal heritage &amp; London Tech City precision
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-red-700 dark:text-rose-300">
                  <span>👑 Royal Crown</span>
                  <span>•</span>
                  <span>🏰 Big Ben</span>
                  <span>•</span>
                  <span>🫖 Fine Earl Grey</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 relative z-10 pr-2">
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  British Edition 🇬🇧
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  London Tech City
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-400/40 flex items-center justify-center text-xl shadow-xs">
                👑
              </div>
            </div>
          </div>
        );

      case 'Canada':
        return (
          <div className="relative w-full h-full flex items-center justify-between overflow-hidden select-none">
            <div className="flex items-center gap-3 relative z-10">
              <div 
                onClick={handleMascotClick}
                className="relative cursor-pointer group transition-transform active:scale-90"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-slate-200 p-0.5 shadow-md group-hover:rotate-3 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden text-2xl sm:text-3xl">
                    <span className="animate-bounce" style={{ animationDuration: '2.5s' }}>🍁</span>
                    <span className="absolute bottom-0 right-0 text-xs">🦫</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <span>Bienvenue Canada</span>
                    <span className="text-base">🇨🇦</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700">
                    Maple &amp; Aurora Edition
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight mt-0.5">
                  Toronto &amp; Vancouver digital clean excellence &amp; northern spirit
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-red-700 dark:text-rose-300">
                  <span>🍁 Red Maple</span>
                  <span>•</span>
                  <span>🌌 Aurora Glow</span>
                  <span>•</span>
                  <span>🏔️ Rocky Peaks</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 relative z-10 pr-2">
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                  Coast to Coast 🇨🇦
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Maple Tech
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-400/40 flex items-center justify-center text-xl shadow-xs">
                🍁
              </div>
            </div>
          </div>
        );

      case 'Australia':
        return (
          <div className="relative w-full h-full flex items-center justify-between overflow-hidden select-none">
            <div className="flex items-center gap-3 relative z-10">
              <div 
                onClick={handleMascotClick}
                className="relative cursor-pointer group transition-transform active:scale-90"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-blue-600 p-0.5 shadow-md group-hover:rotate-3 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden text-2xl sm:text-3xl">
                    <span className="animate-bounce" style={{ animationDuration: '2.5s' }}>🦘</span>
                    <span className="absolute bottom-0 right-0 text-xs">🐨</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <span>G'day Australia</span>
                    <span className="text-base">🇦🇺</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    Sydney &amp; Melbourne Edition
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight mt-0.5">
                  Sydney Harbour sails, Gold Coast vibrancy &amp; modern Pacific tech
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <span>🦘 Kangaroo</span>
                  <span>•</span>
                  <span>🐨 Koala Sanctuary</span>
                  <span>•</span>
                  <span>🏄 Bondi Surf</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 relative z-10 pr-2">
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Aussie Edition 🇦🇺
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Harbour Tech
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-xl shadow-xs">
                🦘
              </div>
            </div>
          </div>
        );

      case 'Singapore':
        return (
          <div className="relative w-full h-full flex items-center justify-between overflow-hidden select-none">
            <div className="flex items-center gap-3 relative z-10">
              <div 
                onClick={handleMascotClick}
                className="relative cursor-pointer group transition-transform active:scale-90"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-indigo-600 p-0.5 shadow-md group-hover:rotate-3 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden text-2xl sm:text-3xl">
                    <span className="animate-bounce" style={{ animationDuration: '2.5s' }}>🦁</span>
                    <span className="absolute bottom-0 right-0 text-xs">🌴</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <span>Welcome Singapore</span>
                    <span className="text-base">🇸🇬</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                    Smart Lion City
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight mt-0.5">
                  Marina Bay Sands, Supertree garden lights &amp; global fintech gateway
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-rose-700 dark:text-rose-300">
                  <span>🦁 Merlion Spout</span>
                  <span>•</span>
                  <span>🌴 Supertree Grove</span>
                  <span>•</span>
                  <span>⚡ Smart Nation</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 relative z-10 pr-2">
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Lion City 🇸🇬
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Smart Nation
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-400/40 flex items-center justify-center text-xl shadow-xs">
                🦁
              </div>
            </div>
          </div>
        );

      case 'Germany':
        return (
          <div className="relative w-full h-full flex items-center justify-between overflow-hidden select-none">
            <div className="flex items-center gap-3 relative z-10">
              <div 
                onClick={handleMascotClick}
                className="relative cursor-pointer group transition-transform active:scale-90"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-red-600 to-slate-900 p-0.5 shadow-md group-hover:rotate-3 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden text-2xl sm:text-3xl">
                    <span className="animate-bounce" style={{ animationDuration: '2.5s' }}>⚙️</span>
                    <span className="absolute bottom-0 right-0 text-xs">🦅</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <span>Willkommen Deutschland</span>
                    <span className="text-base">🇩🇪</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    Deutsche Präzision
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight mt-0.5">
                  World-renowned German engineering precision &amp; modern European architecture
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                  <span>⚙️ Precision Code</span>
                  <span>•</span>
                  <span>🏛️ Brandenburg Gate</span>
                  <span>•</span>
                  <span>🥨 Black Forest</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 relative z-10 pr-2">
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Deutsche Edition 🇩🇪
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Engineering Tech
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-xl shadow-xs">
                🦅
              </div>
            </div>
          </div>
        );

      default: // Global
        return (
          <div className="relative w-full h-full flex items-center justify-between overflow-hidden select-none">
            <div className="flex items-center gap-3 relative z-10">
              <div 
                onClick={handleMascotClick}
                className="relative cursor-pointer group transition-transform active:scale-90"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 p-0.5 shadow-md group-hover:rotate-3 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden text-2xl sm:text-3xl">
                    <span className="animate-bounce" style={{ animationDuration: '2.5s' }}>🌐</span>
                    <span className="absolute bottom-0 right-0 text-xs">✨</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <span>Global Universal Edition</span>
                    <span className="text-base">🌐</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                    Worldwide Standard
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight mt-0.5">
                  Cloud-native microservices &amp; global edge performance
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                  <span>✨ Edge CDN</span>
                  <span>•</span>
                  <span>⚡ 99.9% Uptime</span>
                  <span>•</span>
                  <span>🛡️ Bank-grade Security</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 relative z-10 pr-2">
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Worldwide 🌐
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Next-Gen Architecture
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/40 flex items-center justify-center text-xl shadow-xs">
                ✨
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full relative rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl shadow-xs transition-all duration-300">
      {renderCulturalScene()}
    </div>
  );
}
