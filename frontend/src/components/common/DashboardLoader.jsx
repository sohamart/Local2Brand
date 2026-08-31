import React from 'react';
import { Sparkles, Shield, Layers, Zap } from 'lucide-react';
import AshokaChakra from './AshokaChakra';

export default function DashboardLoader({
  title = 'Syncing Dashboard Data...',
  subtitle = 'Loading real-time specifications, inquiries & workspace assets',
  role = 'client' // 'client' | 'admin'
}) {
  const isAdmin = role === 'admin';

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Dynamic Background Ambient Aura */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className={`w-[320px] sm:w-[460px] h-[320px] sm:h-[460px] rounded-full opacity-20 dark:opacity-25 blur-3xl animate-pulse ${
          isAdmin ? 'bg-gradient-to-tr from-amber-500 via-orange-600 to-purple-600' : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500'
        }`} />
      </div>

      {/* Main Liquid Glass Loading Card */}
      <div className="relative glass-panel p-8 sm:p-10 rounded-3xl border border-white/80 dark:border-slate-800 shadow-glass-xl bg-white/75 dark:bg-slate-900/80 backdrop-blur-2xl max-w-sm w-full text-center space-y-6 animate-in zoom-in-95 duration-300">
        
        {/* Animated Concentric Orb with Ashoka Chakra */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          {/* Outer Pulsing Glowing Ring */}
          <div className={`absolute inset-0 rounded-full border-2 border-dashed animate-[spin_8s_linear_infinite] opacity-60 ${
            isAdmin ? 'border-amber-400' : 'border-purple-400'
          }`} />

          {/* Middle Rotating Liquid Gradient Border */}
          <div className="absolute inset-2 rounded-full p-[2px] bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 animate-spin">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-950" />
          </div>

          {/* Inner Glowing Core Avatar */}
          <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
            isAdmin ? 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-amber-500/30' : 'l2b-gradient-bg shadow-purple-500/30'
          }`}>
            {isAdmin ? (
              <Shield className="w-7 h-7 animate-pulse text-white" />
            ) : (
              <AshokaChakra size={30} className="animate-[spin_12s_linear_infinite] text-white" />
            )}
          </div>

          {/* Floating Sparkle Dot */}
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md animate-bounce">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        {/* Text & Status */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
            <Zap className="w-3 h-3 text-purple-500 animate-pulse" />
            <span>{isAdmin ? 'LOCAL2BRAND Master Admin' : 'LOCAL2BRAND Enterprise Cloud'}</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Liquid Indeterminate Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden relative border border-slate-200/60 dark:border-slate-700/60">
          <div className={`h-full rounded-full animate-[progress_1.5s_ease-in-out_infinite] ${
            isAdmin ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400' : 'l2b-gradient-bg'
          }`} style={{ width: '60%' }} />
        </div>

        <div className="text-[10px] font-mono font-bold text-slate-400 flex items-center justify-between pt-1">
          <span>Encrypted Gateway</span>
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            Live Sync
          </span>
        </div>

      </div>

    </div>
  );
}
