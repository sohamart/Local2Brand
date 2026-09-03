import React, { useState, useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';

export default function MarqueeTicker({ className = '' }) {
  const { settings } = useSiteSettings();
  const { user } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  const config = settings?.importantUpdates;
  const isEnabled = Boolean(config && config.enabled !== false && !isDismissed && !(config.showForLoggedInOnly && !user));

  // Dynamically attach body class so public page sections adjust top offset smoothly
  useEffect(() => {
    const isTopBar = typeof window !== 'undefined' && !window.location.pathname.startsWith('/dashboard') && !window.location.pathname.startsWith('/admin');
    if (isEnabled && isTopBar && className.includes('w-full')) {
      document.body.classList.add('has-announcement-bar');
    } else {
      document.body.classList.remove('has-announcement-bar');
    }
    return () => {
      document.body.classList.remove('has-announcement-bar');
    };
  }, [isEnabled, className]);

  if (!isEnabled) return null;

  // Filter active items
  const rawItems = Array.isArray(config.items)
    ? config.items.filter((i) => i && i.isActive !== false)
    : [];

  const baseItems = rawItems.length > 0
    ? rawItems
    : [
        {
          id: 'def-1',
          text: '🚀 Special Launch: Instant 15-Minute Founder Call, 48-Hour Rapid Delivery & Up to 20% OFF Active!',
          badge: 'SYSTEM UPDATE',
          badgeType: 'purple',
          link: '/pricing',
          isActive: true
        }
      ];

  // Repeat items so each track is sufficiently wide
  const repeatCount = Math.max(2, Math.ceil(4 / baseItems.length));
  const trackItems = [];
  for (let i = 0; i < repeatCount; i++) {
    trackItems.push(...baseItems);
  }

  const speedClass =
    config.speed === 'slow'
      ? 'animate-marquee-track-slow'
      : config.speed === 'fast'
      ? 'animate-marquee-track-fast'
      : 'animate-marquee-track-smooth';

  const getBadgeClasses = (type) => {
    switch (type) {
      case 'emerald':
        return 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'amber':
        return 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'rose':
        return 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700';
      case 'cyan':
        return 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700';
      case 'purple':
      default:
        return 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700';
    }
  };

  const renderTrackItems = (keyPrefix) => (
    <div className={`flex items-center shrink-0 ${speedClass}`}>
      {trackItems.map((item, idx) => {
        const content = (
          <div
            key={`${keyPrefix}-${item.id || 'item'}-${idx}`}
            className="inline-flex items-center gap-2 mx-4 sm:mx-6 text-[11px] sm:text-xs font-semibold hover:text-purple-600 dark:hover:text-cyan-300 transition-colors cursor-pointer shrink-0 group whitespace-nowrap"
          >
            {item.badge && (
              <span
                className={`px-1.5 py-0.5 rounded text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider border shadow-2xs ${getBadgeClasses(
                  item.badgeType
                )}`}
              >
                {item.badge}
              </span>
            )}
            <span className="text-slate-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-cyan-200 font-bold">
              {item.text}
            </span>
            {item.link && (
              <ArrowRight className="w-3 h-3 text-purple-500 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform inline shrink-0" />
            )}
            <span className="text-purple-300 dark:text-slate-700 font-bold ml-2 select-none">✦</span>
          </div>
        );

        if (item.link) {
          return (
            <Link key={`${keyPrefix}-link-${item.id || 'link'}-${idx}`} to={item.link}>
              {content}
            </Link>
          );
        }
        return content;
      })}
    </div>
  );

  return (
    <div
      className={`marquee-container relative w-full h-8 sm:h-9 overflow-hidden bg-white dark:bg-[#070b14] text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 flex items-center z-30 select-none [contain:paint_layout] ${className}`}
    >

      {/* Left Fixed Solid Opaque Badge Block with Divider */}
      <div className="flex items-center gap-1.5 px-3 h-full bg-white dark:bg-[#070b14] border-r border-slate-200 dark:border-slate-800 z-30 shrink-0 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
        <span className="font-extrabold text-[10px] uppercase tracking-wider text-purple-700 dark:text-cyan-400">
          <span className="hidden xs:inline sm:inline">LIVE </span>UPDATE
        </span>
      </div>

      {/* Marquee Track Container with Zero-Cost GPU Fade Overlays */}
      <div className="relative flex-1 min-w-0 h-full overflow-hidden flex items-center">
        {/* Left smooth fade gradient */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-[#070b14] to-transparent z-10" />

        {/* Two Continuous 120 FPS Synchronized Tracks */}
        <div className="flex w-max">
          {renderTrackItems('track1')}
          {renderTrackItems('track2')}
        </div>

        {/* Right smooth fade gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-[#070b14] to-transparent z-10" />
      </div>

      {/* Right Solid Opaque Dismiss Button */}
      <div className="h-full flex items-center px-2 bg-white dark:bg-[#070b14] border-l border-slate-200 dark:border-slate-800 z-30 shrink-0">
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Hide announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
