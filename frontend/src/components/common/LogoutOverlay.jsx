import React, { useState, useEffect } from 'react';
import { LogOut, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import AshokaChakra from './AshokaChakra';
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

    setProgress(40);
    setStepText('Clearing session tokens...');

    const timer1 = setTimeout(() => {
      setProgress(85);
      setStepText('Safeguarding active data...');
    }, 200);

    const timer2 = setTimeout(() => {
      setProgress(100);
      setIsCompleted(true);
      setStepText('Logged out safely. See you soon! 👋');
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isLoggingOut]);

  if (!isLoggingOut) return null;

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 select-none p-4">
      {/* Dynamic Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-gradient-to-tr from-rose-600/25 via-purple-600/20 to-indigo-600/25 rounded-full blur-[80px] animate-pulse pointer-events-none" />

      {/* Main Glassmorphic Animated Logout Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-rose-500/30 shadow-[0_0_60px_rgba(244,63,94,0.25)] backdrop-blur-3xl flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
        
        {/* Animated Icon Pod */}
        <div className="relative">
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 opacity-75 blur-md animate-spin [animation-duration:3s]" />

          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950/50 to-slate-900 border-2 border-rose-400/50 flex items-center justify-center shadow-2xl">
            {isCompleted ? (
              <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-400 animate-in zoom-in-75 duration-200" />
            ) : (
              <div className="relative flex items-center justify-center">
                <LogOut className="w-7 h-7 sm:w-8 sm:h-8 text-rose-300 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Title & Status */}
        <div className="space-y-1 w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-[11px] font-extrabold uppercase tracking-wider">
            <AshokaChakra size={11} />
            <span>Secure Logout</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isCompleted ? 'Logged Out Safely' : 'Logging Out...'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-medium transition-all duration-200 h-5">
            {stepText}
          </p>
        </div>

        {/* Progress Track */}
        <div className="w-full space-y-1.5 pt-1">
          <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-400 shadow-[0_0_10px_rgba(244,63,94,0.6)] transition-all duration-250 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
            <span>Session Cleaned</span>
            <span className="font-bold text-rose-300">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}

