import React, { useState, useEffect } from 'react';
import { BellRing, X, Sparkles, Check } from 'lucide-react';
import { toast } from 'react-toastify';

export default function NotificationPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    setIsSupported(true);

    if (Notification.permission !== 'default') {
      setIsVisible(false);
      return;
    }

    try {
      const dismissedTime = localStorage.getItem('l2b_push_prompt_dismissed');
      if (dismissedTime && (Date.now() - parseInt(dismissedTime, 10)) < 7 * 24 * 60 * 60 * 1000) {
        setIsVisible(false);
        return;
      }
    } catch (e) {}

    const timer = setTimeout(() => {
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        setIsVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAllow = async () => {
    if (!('Notification' in window)) {
      setIsVisible(false);
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setIsVisible(false);
      if (perm === 'granted') {
        toast.success('🎉 Notifications enabled! You will receive live project updates.');
      }
    } catch (err) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('l2b_push_prompt_dismissed', Date.now().toString());
    } catch (e) {}
  };

  if (!isVisible || !isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[999990] max-w-sm sm:max-w-md w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-[#0b0e14]/95 backdrop-blur-2xl border-2 border-purple-500/40 dark:border-purple-500/50 shadow-2xl space-y-3.5 relative overflow-hidden">
        
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 shrink-0">
              <BellRing className="w-5 h-5 animate-wiggle" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  Enable Live Notifications
                </h4>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Real-time updates on orders & quotations
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed relative z-10 pl-1">
          Never miss an order milestone, engineering update, or direct founder message.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 relative z-10">
          <button
            type="button"
            onClick={handleAllow}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Enable Alerts</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
