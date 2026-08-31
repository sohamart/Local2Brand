import React, { useState } from 'react';
import { ArrowRight, X, Flame, Check, Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useOrderModal } from '../../context/OrderModalContext';

export default function AnnouncementBar({ isScrolled = false, onDismiss }) {
  const { settings } = useSiteSettings();
  const { openOrderModal } = useOrderModal();
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof onDismiss === 'function') {
      onDismiss();
    }
  };

  const announcement = settings?.announcementBar || {
    enabled: true,
    text: '🔥 Special Launch Offer: Get 20% OFF + Free SSL & Domain with code INDIA2025',
    link: '/pricing',
    badge: 'FLASH OFFER',
    promoCode: 'INDIA2025',
    discountPercent: 20,
    btnText: 'Claim Offer',
  };

  if (!announcement.enabled || dismissed) return null;

  const promoCode = (announcement.promoCode || 'INDIA2025').trim().toUpperCase();
  const discountPercent = announcement.discountPercent || 20;
  const buttonText = announcement.btnText || 'Claim Offer';

  const handleClaimOffer = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 1. Copy coupon code to clipboard
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(promoCode);
      }
    } catch (err) {
      console.warn('Clipboard write notice:', err);
    }

    // 2. Set visual copied state
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    // 3. Show notification toast
    toast.success(`🎉 Coupon "${promoCode}" copied & applied for ${discountPercent}% OFF!`, {
      icon: '🎁',
      autoClose: 3200,
    });

    // 4. Open Order Modal with coupon auto-applied
    openOrderModal({
      promoCode,
      discountPercent,
      autoApplyOffer: true,
      websiteType: `Special Launch Promo (${discountPercent}% OFF - Code: ${promoCode})`,
      initialRequirements: `I want to build a website and claim the special launch offer with coupon code "${promoCode}" (${discountPercent}% OFF discount applied).`,
    });
  };

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

            {/* Interactive Call to Action - Copy Coupon & Open Order Modal */}
            <button
              type="button"
              onClick={handleClaimOffer}
              className={`inline-flex items-center gap-1.5 font-black text-[11px] sm:text-xs px-3 py-1 rounded-full border shadow-xs hover:shadow-md shrink-0 transition-all duration-200 cursor-pointer transform active:scale-95 ${
                copied
                  ? 'bg-emerald-500 text-white border-emerald-400'
                  : 'text-purple-700 dark:text-amber-300 hover:text-purple-900 dark:hover:text-amber-200 bg-white/85 dark:bg-purple-950/70 hover:bg-white dark:hover:bg-purple-900 border-purple-200 dark:border-purple-700/60'
              }`}
              title={`Copy coupon ${promoCode} & apply discount in website order form`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-white" />
                  <span>Applied! ✅</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-purple-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>{buttonText}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

          </div>

          {/* Dismiss Close Button */}
          <button
            onClick={handleDismiss}
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

