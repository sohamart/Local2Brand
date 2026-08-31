import React, { useState } from 'react';
import { ArrowRight, X, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function AnnouncementBar({ isScrolled = false }) {
  const { settings } = useSiteSettings();
  const [dismissed, setDismissed] = useState(false);

  const announcement = settings?.announcementBar || {
    enabled: true,
    text: '🔥 Special Launch Offer: Get 20% OFF + Free SSL & Domain with code INDIA2026',
    link: '/pricing',
    badge: 'FLASH OFFER'
  };

  if (!announcement.enabled || dismissed) return null;

  return (
    <div
      className={`w-full overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
        isScrolled
          ? 'max-h-0 opacity-0 -translate-y-full pointer-events-none'
          : 'max-h-14 opacity-100 translate-y-0'
      }`}
    >
      {/* Outer Aurora Liquid Shimmer Wrapper */}
      <div className="relative animate-aurora bg-gradient-to-r from-purple-100/90 via-pink-50/90 to-sky-100/90 dark:from-[#0a0518] dark:via-[#19082d] dark:to-[#070d1e] text-slate-800 dark:text-slate-100 border-b border-purple-300/60 dark:border-purple-500/30 backdrop-blur-2xl shadow-[0_4px_25px_rgba(168,85,247,0.12)]">
        
        {/* Shimmer Light Beam Gliding Effect */}
        <div className="absolute inset-y-0 w-48 bg-gradient-to-r from-transparent via-white/40 dark:via-purple-400/20 to-transparent pointer-events-none animate-shimmer-beam" />

        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-full bg-pink-500/10 dark:bg-pink-500/20 blur-xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-full bg-cyan-500/10 dark:bg-cyan-500/20 blur-xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs relative z-10">
          
          {/* Centered Dynamic Content Pill */}
          <div className="flex items-center gap-2 sm:gap-3 mx-auto truncate group">
            
            {/* Animated Pulsing Neon Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)] shrink-0 transition-transform group-hover:scale-105 duration-300">
              <Flame className="w-3 h-3 text-amber-300 animate-bounce" />
              <span>{announcement.badge || 'PROMO'}</span>
            </span>

            {/* Headline Announcement Message */}
            <span className="font-extrabold text-slate-800 dark:text-slate-200 truncate text-[11px] sm:text-xs tracking-tight">
              {announcement.text}
            </span>

            {/* Interactive Call to Action */}
            {announcement.link && (
              <Link
                to={announcement.link}
                className="inline-flex items-center gap-1.5 font-black text-purple-700 dark:text-amber-300 hover:text-purple-900 dark:hover:text-amber-200 bg-white/70 dark:bg-purple-950/60 hover:bg-white dark:hover:bg-purple-900/80 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-700/60 shadow-xs hover:shadow-md shrink-0 transition-all duration-200"
              >
                <span>Claim Offer</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}

          </div>

          {/* Dismiss Close Button */}
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800/80 transition-all shrink-0 cursor-pointer hover:rotate-90 duration-300"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>
    </div>
  );
}
