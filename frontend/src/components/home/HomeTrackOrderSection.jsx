import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Search, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, Activity } from 'lucide-react';
import { toast } from 'react-toastify';
import AshokaChakra from '../common/AshokaChakra';

export default function HomeTrackOrderSection() {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast.warning('Please enter an Order ID (e.g. REQ-2026-XXXXX)');
      return;
    }
    navigate(`/track-order?id=${encodeURIComponent(orderId.trim())}`);
  };

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glass Bento Container */}
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-white/90 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-glass-lg p-6 sm:p-12 overflow-hidden backdrop-blur-xl">
          
          {/* Ambient Radiant Glow Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800/80 text-purple-700 dark:text-purple-300 text-xs font-bold shadow-2xs">
                <Compass className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-spin-slow" />
                <span>Real-Time Milestone Gateway</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Already Have A Website In Production?{' '}
                <span className="l2b-gradient-text block sm:inline">Track Sprint Progress Live.</span>
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                Stay 100% updated with your website's architecture audit, UI/UX Figma wireframes, development sprint, and 48-hour delivery timeline in real-time.
              </p>

              {/* Direct Quick Search Form */}
              <form onSubmit={handleTrack} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-lg mx-auto lg:mx-0">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter Order ID (e.g. REQ-2026-48391)..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-purple-700 dark:text-purple-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-sans focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 cursor-pointer flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Track Live Status</span>
                </button>
              </form>

              {/* Feature Micro-Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Live Sync (No Refresh Needed)
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Direct WhatsApp Engineering Updates
                </span>
              </div>
            </div>

            {/* Right Visual Bento Box */}
            <div className="lg:col-span-5">
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-300">REQ-2026-LIVE</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    In Development (85%)
                  </span>
                </div>

                {/* Progress Bar Demo */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    <span>Sprint Milestone</span>
                    <span className="text-purple-600 dark:text-purple-400 font-mono">Stage 4 of 6</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-900 overflow-hidden">
                    <div className="w-[85%] h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-full" />
                  </div>
                </div>

                {/* Steps Mini Preview */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 text-emerald-700 dark:text-emerald-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate">Requirement Audit & Wireframe Approved</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-800 dark:text-purple-200 font-bold animate-pulse">
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span className="truncate">Active: Full-Stack React & Node Deployment</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/40 text-slate-500">
                    <Activity className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">Upcoming: 98+ Score Google Speed Benchmark</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    to="/track-order"
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Open Full Dedicated Tracking Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
