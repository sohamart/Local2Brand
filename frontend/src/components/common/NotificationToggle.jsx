import React, { useState, useEffect } from 'react';
import { Bell, BellRing, BellOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function NotificationToggle({ className = '', showCard = true }) {
  const [permission, setPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === 'granted') {
        toast.success('Browser alerts enabled successfully! 🔔');
      } else if (perm === 'denied') {
        toast.info('Notifications are blocked in your browser site settings.');
      }
    } catch (err) {
      console.warn('Notification permission error:', err);
    }
  };

  if (!isSupported) {
    return null;
  }

  const isGranted = permission === 'granted';

  const content = (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
          isGranted
            ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
            : permission === 'denied'
            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
        }`}>
          {isGranted ? (
            <BellRing className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          ) : permission === 'denied' ? (
            <BellOff className="w-5 h-5 text-rose-500" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Instant Browser Alerts
            </h4>
            {isGranted ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            ) : permission === 'denied' ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                Blocked
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Disabled
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
            {isGranted
              ? 'Browser alerts are enabled. You receive instant notifications whenever an order status changes or a message arrives.'
              : permission === 'denied'
              ? 'Notifications are blocked in your browser site settings. Click your browser lock icon to allow.'
              : 'Enable browser notifications to receive immediate order milestone updates and engineering notices.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        {permission === 'denied' ? (
          <a
            href="https://support.google.com/chrome/answer/3220216"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            How to Unblock
          </a>
        ) : (
          <button
            type="button"
            onClick={requestPermission}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
              isGranted ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            role="switch"
            aria-checked={isGranted}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isGranted ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );

  if (!showCard) {
    return <div className={className}>{content}</div>;
  }

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
      {content}
    </div>
  );
}
