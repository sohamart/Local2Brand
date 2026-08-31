import React from 'react';
import { X, Sparkles, PhoneCall, ArrowRight, Lock, Clock, CheckCircle2 } from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';

export default function ComingSoonModal({ isOpen, onClose, planName = 'Pricing Plan' }) {
  const { openOrderModal, openCallbackModal } = useOrderModal();

  if (!isOpen) return null;

  const handleCustomQuote = () => {
    onClose();
    openOrderModal({
      websiteType: `Early Bird Inquiry: ${planName}`,
      initialRequirements: `I want to request an early-bird custom quote for the "${planName}" package.`
    });
  };

  const handleCallbackClick = () => {
    onClose();
    openCallbackModal({ topic: `Early Bird Inquiry for ${planName}` });
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 dark:text-slate-100 overflow-hidden animate-scale">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Icon Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Launching Soon • Private Beta
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Pricing in Final Review
            </h3>
          </div>
        </div>

        {/* Description Body */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Official fixed packages for <strong className="text-purple-600 dark:text-purple-400">"{planName}"</strong> are currently undergoing final calibration.
          </p>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>3 - 7 Days Rapid Delivery Guarantee is active</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Flat 20% OFF Launch Promo (Code: INDIA2025) valid</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleCustomQuote}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Interactive Project Builder 🚀</span>
          </button>

          <button
            onClick={handleCallbackClick}
            className="w-full py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-purple-600" />
            <span>Request a Callback for Early Quote</span>
          </button>
        </div>

      </div>
    </div>
  );
}
