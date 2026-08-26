import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, Tag, Flame } from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import AshokaChakra from './AshokaChakra';

export default function TopOfferBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { openOrderModal } = useOrderModal();

  if (!isVisible) return null;

  const handleClaim = () => {
    openOrderModal({
      websiteType: 'Launch Offer: 20% OFF (Code: INDIA2025)',
      initialRequirements: 'I want to claim the Launch Offer: Flat 20% OFF on Website Setup + Free SSL & Domain.'
    });
  };

  return (
    <div className="relative z-50 bg-slate-900 text-white text-xs py-2 px-3 sm:px-4 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left / Center: Offer Headline */}
        <div className="flex items-center gap-2 flex-1 justify-center sm:justify-start overflow-hidden">
          <span className="hidden xs:inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 text-[10px] uppercase tracking-wider shrink-0">
            <AshokaChakra size={11} />
            <span>Launch Special</span>
          </span>

          <p className="text-[11px] sm:text-xs text-slate-200 truncate">
            🔥 <strong className="text-white font-bold">Flat 20% OFF</strong> on all Website Templates + <span className="text-amber-300 font-semibold">Free 1-Yr Domain & SSL</span> with code <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-amber-300 font-bold">INDIA2025</span>
          </p>
        </div>

        {/* Right Action & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleClaim}
            className="px-3 py-1 rounded-full text-[11px] font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-all flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <span>Claim Offer</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close offer banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Bottom Indian Tricolor micro-line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500" />
    </div>
  );
}
