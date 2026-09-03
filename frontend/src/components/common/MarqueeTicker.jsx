import React, { useState } from 'react';
import { Sparkles, ArrowRight, Bell, Zap, Flame, ShieldAlert, X, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';

export default function MarqueeTicker({ className = '' }) {
  const { settings } = useSiteSettings();
  const { user } = useAuth();
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('l2b_marquee_dismissed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const config = settings?.importantUpdates;
  if (!config || !config.enabled || isDismissed) return null;

  // Filter only active items
  const rawItems = Array.isArray(config.items) ? config.items.filter((i) => i && i.isActive !== false) : [];
  if (rawItems.length === 0) return null;

  // If set to logged in only and no user is present
  if (config.showForLoggedInOnly && !user) return null;

  const speedClass =
    config.speed === 'slow'
      ? 'animate-marquee-slow'
      : config.speed === 'fast'
      ? 'animate-marquee-fast'
      : 'animate-marquee-smooth';

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('l2b_marquee_dismissed', 'true');
    } catch (e) {}
  };

  const getBadgeClasses = (type) => {
    switch (type) {
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40';
      case 'amber':
        return 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-500/40';
      case 'rose':
        return 'bg-rose-500/20 text-rose-900 dark:text-rose-300 border-rose-500/40';
      case 'cyan':
        return 'bg-cyan-500/20 text-cyan-900 dark:text-cyan-300 border-cyan-500/40';
      case 'purple':
      default:
        return 'bg-purple-500/20 text-purple-900 dark:text-purple-300 border-purple-500/40';
    }
  };

  // Duplicate items array to make marquee seamless infinite scroll
  const displayItems = [...rawItems, ...rawItems, ...rawItems, ...rawItems];

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 dark:from-[#060a14] dark:via-[#0c1424] dark:to-[#080d1a] text-white border-y border-purple-500/30 dark:border-cyan-500/30 shadow-md py-2 px-2.5 sm:px-4 flex items-center gap-2 sm:gap-3 z-30 select-none ${className}`}
    >
      {/* Left Fixed Badge Label */}
      <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/15 dark:bg-cyan-950/80 border border-purple-300/40 dark:border-cyan-400/40 text-purple-200 dark:text-cyan-300 text-[9px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs z-10 backdrop-blur-md">
        <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        <Bell className="w-3 h-3 text-amber-300 shrink-0" />
        <span className="hidden xs:inline sm:inline">LIVE</span>
        <span>UPDATES</span>
      </div>

      {/* Marquee Track with Gradient Fade Masks */}
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
        <div className={speedClass}>
          {displayItems.map((item, idx) => {
            const content = (
              <div
                key={`${item.id || 'item'}-${idx}`}
                className="inline-flex items-center gap-2 sm:gap-2.5 mx-3 sm:mx-5 text-[11px] sm:text-xs font-semibold hover:text-cyan-300 transition-colors cursor-pointer shrink-0 group whitespace-nowrap"
              >
                {item.badge && (
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider border shadow-xs ${getBadgeClasses(
                      item.badgeType
                    )}`}
                  >
                    {item.badge}
                  </span>
                )}
                <span className="text-slate-100 group-hover:text-cyan-200 font-medium">
                  {item.text}
                </span>
                {item.link && (
                  <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition-transform inline shrink-0" />
                )}
                <span className="text-purple-400/60 font-bold ml-1 sm:ml-2">✦</span>
              </div>
            );

            if (item.link) {
              return (
                <Link key={`${item.id || 'link'}-${idx}`} to={item.link}>
                  {content}
                </Link>
              );
            }
            return content;
          })}
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 z-10"
        title="Dismiss ticker for this session"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );

}
