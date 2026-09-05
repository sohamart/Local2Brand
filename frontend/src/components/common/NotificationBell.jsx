import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellRing, BellOff, Check, X, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import useOneSignal from '../../hooks/useOneSignal';

export default function NotificationBell({ className = '' }) {
  const { isSupported, permission, isSubscribed, isLoading, requestPermission, optOut } = useOneSignal();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isSupported) {
    return null; // Gracefully hide if browser doesn't support Web Push
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notification Settings"
        className={`relative p-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
          isSubscribed
            ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border border-purple-500/30 shadow-xs'
            : permission === 'denied'
            ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30'
            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-600 border border-slate-200 dark:border-slate-700/60 hover:border-purple-300'
        }`}
        title={isSubscribed ? 'Notifications Active' : 'Enable Push Notifications'}
      >
        {isSubscribed ? (
          <BellRing className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-wiggle" />
        ) : permission === 'denied' ? (
          <BellOff className="w-4 h-4 text-rose-500" />
        ) : (
          <Bell className="w-4 h-4" />
        )}

        {/* Status Dot / Ping Badge */}
        {!isSubscribed && permission !== 'denied' && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
          </span>
        )}

        {isSubscribed && (
          <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
        )}
      </button>

      {/* Dropdown Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-3xl bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 sm:p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Push Notifications
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Real-time alerts for orders &amp; updates
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Status Banner */}
          {isSubscribed ? (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-emerald-700 dark:text-emerald-300">
                  Active &amp; Subscribed
                </div>
                <div className="text-[11px] text-emerald-600/90 dark:text-emerald-400/90 leading-tight">
                  You'll receive push updates for order milestones even when tabs are closed.
                </div>
              </div>
            </div>
          ) : permission === 'denied' ? (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-rose-700 dark:text-rose-300">
                  Notifications Blocked
                </div>
                <div className="text-[11px] text-rose-600/90 dark:text-rose-400/90 leading-tight">
                  Permissions are blocked in your browser. Click the lock/tune icon near your browser address bar to allow.
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs space-y-1">
              <div className="font-bold text-purple-900 dark:text-purple-200">
                Never miss an order update
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                Get instant notifications for project quotes, build progress, and delivery.
              </p>
            </div>
          )}

          {/* Action Button */}
          <div>
            {isSubscribed ? (
              <button
                type="button"
                onClick={() => {
                  optOut();
                  setIsOpen(false);
                }}
                disabled={isLoading}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BellOff className="w-3.5 h-3.5" />
                <span>Mute Push Notifications</span>
              </button>
            ) : permission === 'denied' ? (
              <a
                href="https://support.google.com/chrome/answer/3220216"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>How to Unblock in Browser</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  await requestPermission();
                  setIsOpen(false);
                }}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <BellRing className="w-4 h-4 animate-bounce" />
                <span>{isLoading ? 'Requesting...' : 'Enable Push Notifications'}</span>
              </button>
            )}
          </div>

          <div className="text-[10px] text-center text-slate-400 font-mono">
            Powered by OneSignal &bull; 100% Spam Free
          </div>
        </div>
      )}
    </div>
  );
}
