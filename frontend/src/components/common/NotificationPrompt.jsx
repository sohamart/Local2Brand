import React, { useState, useEffect } from 'react';
import { BellRing, X, Sparkles, Check } from 'lucide-react';
import useOneSignal from '../../hooks/useOneSignal';

export default function NotificationPrompt() {
  const { isSupported, permission, isSubscribed, isLoading, requestPermission } = useOneSignal();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isSupported) return;

    // Check if permission is already decided or dismissed recently
    if (permission !== 'default' || isSubscribed) {
      setIsVisible(false);
      return;
    }

    const dismissedTime = localStorage.getItem('l2b_push_prompt_dismissed');
    if (dismissedTime) {
      const elapsed = Date.now() - Number(dismissedTime);
      // Wait at least 2 days before gently showing again
      if (elapsed < 2 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Show prompt after 4 seconds of smooth page exploration
    const timer = setTimeout(() => {
      if (Notification.permission === 'default') {
        setIsVisible(true);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [isSupported, permission, isSubscribed]);

  const handleAllow = async () => {
    const success = await requestPermission();
    if (success) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('l2b_push_prompt_dismissed', Date.now().toString());
    } catch (e) {}
  };

  if (!isVisible || !isSupported || permission !== 'default' || isSubscribed) {
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
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                LOCAL2BRAND &bull; Real-Time Order &amp; Launch Alerts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Dismiss prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Text */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed relative z-10">
          Get real-time browser alerts for project milestones, order quotes, launch previews, and WhatsApp direct inquiries even when tabs are closed.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1 relative z-10">
          <button
            type="button"
            onClick={handleAllow}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Connecting...' : 'Allow Push Notifications'}</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            Later
          </button>
        </div>

      </div>
    </div>
  );
}
