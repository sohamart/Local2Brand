import React, { useState, useEffect } from 'react';
import { LogOut, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LogoutOverlay() {
  const { isLoggingOut } = useAuth();
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState('Securing brand workspace...');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isLoggingOut) {
      setProgress(0);
      setIsCompleted(false);
      setStepText('Securing brand workspace...');
      return;
    }

    // Step sequence with progress animation
    const timer1 = setTimeout(() => {
      setProgress(35);
      setStepText('Clearing encrypted session credentials...');
    }, 200);

    const timer2 = setTimeout(() => {
      setProgress(75);
      setStepText('Safeguarding active order data...');
    }, 600);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setIsCompleted(true);
      setStepText('Logged out safely. See you soon! 👋');
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isLoggingOut]);

  if (!isLoggingOut) return null;

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300 select-none p-4">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-purple-600/30 via-indigo-600/20 to-pink-600/25 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Glassmorphic Animated Logout Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl bg-white/10 dark:bg-slate-900/80 border border-white/20 dark:border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.3)] backdrop-blur-3xl flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-300">
        
        {/* Floating Animated Avatar / Logout Badge */}
        <div className="relative group">
          {/* Pulsing Spinning Glow Halo */}
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-75 blur-md animate-spin [animation-duration:4s]" />

          {/* Central Circular Icon Pod */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border-2 border-purple-400/60 flex items-center justify-center shadow-2xl">
            {isCompleted ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-in zoom-in-75 duration-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            ) : (
              <div className="relative flex items-center justify-center">
                <LogOut className="w-9 h-9 text-purple-300 animate-bounce [animation-duration:1.5s] drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Title & Status */}
        <div className="space-y-1.5 w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Secure Logout</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isCompleted ? 'Logged Out Safely' : 'Logging Out...'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-medium transition-all duration-200 h-5">
            {stepText}
          </p>
        </div>

        {/* High-Tech Animated Gradient Progress Track */}
        <div className="w-full space-y-2 pt-1">
          <div className="relative w-full h-2 rounded-full bg-slate-800/80 overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 shadow-[0_0_12px_rgba(168,85,247,0.8)] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
            <span>LOCAL2BRAND Security</span>
            <span className="font-bold text-purple-300">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
