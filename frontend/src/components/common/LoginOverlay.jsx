import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, Lock, ArrowRight, Zap } from 'lucide-react';
import AshokaChakra from './AshokaChakra';

export default function LoginOverlay({ isOpen, user = null }) {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState('Verifying credentials & workspace...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setIsSuccess(false);
      setStepText('Verifying credentials & workspace...');
      return;
    }

    // Step 1: Initial Handshake
    setProgress(35);
    setStepText('Authenticating encrypted session...');

    // Step 2: Workspace Setup
    const timer1 = setTimeout(() => {
      setProgress(75);
      setStepText('Preparing client portal & permissions...');
    }, 250);

    // Step 3: Success
    const timer2 = setTimeout(() => {
      setProgress(100);
      setIsSuccess(true);
      setStepText(`Welcome back${user?.name ? ', ' + user.name.split(' ')[0] : ''}! 🚀`);
    }, 550);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 select-none p-4">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] bg-gradient-to-tr from-purple-600/35 via-indigo-600/25 to-pink-600/30 rounded-full blur-[90px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/15 rounded-full blur-[70px] pointer-events-none" />

      {/* Main Glassmorphic Animated Login Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-[0_0_70px_rgba(168,85,247,0.35)] backdrop-blur-3xl flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
        
        {/* Animated Central Icon Pod */}
        <div className="relative">
          {/* Pulsing Spinning Glow Halo */}
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-emerald-500 opacity-80 blur-md animate-spin [animation-duration:3s]" />

          {/* Icon Pod */}
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border-2 border-purple-400/60 flex items-center justify-center shadow-2xl overflow-hidden">
            {isSuccess ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-in zoom-in-75 duration-200 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            ) : (
              <div className="relative flex items-center justify-center">
                <Lock className="w-8 h-8 text-purple-300 animate-pulse drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1.5 -right-1.5 animate-bounce" />
              </div>
            )}
          </div>
        </div>

        {/* Title & Status */}
        <div className="space-y-1.5 w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[11px] font-extrabold uppercase tracking-wider">
            <AshokaChakra size={11} />
            <span>LOCAL2BRAND Fast Gateway</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isSuccess ? 'Access Granted' : 'Authenticating...'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-medium transition-all duration-200 h-5">
            {stepText}
          </p>
        </div>

        {/* Progress Track */}
        <div className="w-full space-y-2 pt-1">
          <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 shadow-[0_0_12px_rgba(168,85,247,0.8)] transition-all duration-250 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>TLS 1.3 Verified</span>
            </span>
            <span className="font-bold text-purple-300">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
