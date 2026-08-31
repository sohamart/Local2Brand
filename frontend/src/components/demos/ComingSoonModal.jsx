import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Rocket,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Star,
  Layers,
  Lock
} from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import AshokaChakra from '../common/AshokaChakra';

export default function ComingSoonModal({ isOpen, onClose, demo }) {
  const { openOrderModal, openCallbackModal } = useOrderModal();
  const containerRef = useRef(null);

  // Escape key handler, trackpad wheel listener, and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Focus container so precision trackpad and keys target modal immediately
    if (containerRef.current) {
      containerRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Explicit global wheel forwarder for Windows Precision Trackpads
    const handleGlobalWheel = (e) => {
      if (containerRef.current) {
        containerRef.current.scrollTop += e.deltaY;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleGlobalWheel, { passive: true });
    
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleGlobalWheel);
      document.body.style.overflow = originalOverflow || 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !demo || typeof document === 'undefined') return null;

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
  };

  const handlePreOrder = (e) => {
    if (e) e.stopPropagation();
    onClose();
    openOrderModal({
      selectedDemo: demo.title,
      templateId: demo.templateId || demo.slug,
      category: demo.category,
      flow: 'template',
      websiteType: `Pre-Order: ${demo.title}`,
      initialRequirements: `I want to pre-order and reserve the "${demo.title}" (${demo.category}) template.`,
      price: demo.priceInr || demo.price
    });
  };

  const handleRequestPriority = (e) => {
    if (e) e.stopPropagation();
    onClose();
    openCallbackModal({
      topic: `Priority Demo Request: ${demo.title}`,
      notes: `Client requested priority preview for ${demo.title}`
    });
  };

  return createPortal(
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={(e) => e.stopPropagation()}
      style={{ WebkitOverflowScrolling: 'touch', outline: 'none' }}
      className="fixed inset-0 z-[99999999] w-full h-full max-w-full bg-[#07090e]/98 backdrop-blur-3xl overflow-y-auto overflow-x-hidden text-slate-100 animate-in fade-in duration-200 focus:outline-none"
    >
      {/* Dynamic Cosmic Aurora Glow Elements (Strictly Contained with overflow-hidden) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] lg:w-[1200px] h-[400px] bg-gradient-to-r from-amber-500/15 via-purple-600/20 to-pink-500/15 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 w-[350px] sm:w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Scrollable Inner Canvas */}
      <div className="min-h-full w-full max-w-full flex flex-col relative pb-20 sm:pb-32 overflow-x-hidden">
        
        {/* TOP FLOATING NAVIGATION BAR */}
        <header className="sticky top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-2xl border-b border-slate-800/90 px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-2xl shrink-0">
          
          {/* Left: Back button */}
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700/80 transition-all cursor-pointer shadow-md group shrink-0"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] sm:text-xs">Back to Demos</span>
          </button>

          {/* Center: Badge */}
          <div className="hidden md:inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-widest shadow-inner truncate">
            <AshokaChakra size={11} />
            <span>LOCAL2BRAND Pre-Launch Experience</span>
          </div>

          {/* Right: Close (X) */}
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition-all cursor-pointer hover:rotate-90 duration-200 shrink-0"
            title="Close Full Screen"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* MAIN FULL-SCREEN SHOWCASE CONTAINER */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 w-full min-w-0 flex-1">
          
          {/* TOP STATUS HERO */}
          <div className="text-center space-y-3.5 max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
            
            {/* Animated Neon Pulse Radar Pill */}
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-400/80 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.3)] max-w-full">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider truncate">
                ⚡ Full-Stack Interactive Demo Under Active Build
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight break-words">
              {demo.title}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto leading-relaxed">
              {demo.description || demo.shortDescription || 'This high-performance commercial website template is undergoing final staging and performance audits. Reserve early access today to lock in launch pricing.'}
            </p>

          </div>

          {/* SIDE-BY-SIDE INTERACTIVE FULL-SCREEN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start max-w-6xl mx-auto w-full min-w-0">
            
            {/* LEFT 7-COL: HERO IMAGE & FEATURE LOOKBOOK */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 min-w-0">
              <div className="relative aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-slate-700/80 shadow-2xl group bg-slate-900">
                <img
                  src={demo.heroImage}
                  alt={demo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Glassmorphic Overlay Tag */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-between p-4 sm:p-6">
                  <span className="px-2.5 sm:px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 text-[10px] sm:text-xs font-bold self-start">
                    {demo.category}
                  </span>

                  <div className="flex items-center justify-between text-[11px] sm:text-xs gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold bg-slate-900/90 px-2.5 sm:px-3 py-1 rounded-full border border-slate-700">
                      <Star className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
                      <span>{demo.rating || '4.9'} ({demo.reviewsCount || '24'} Reviews)</span>
                    </div>
                    <span className="text-emerald-400 font-bold bg-slate-900/90 px-2.5 sm:px-3 py-1 rounded-full border border-slate-700">
                      ● Ready in {demo.turnaround || '48 Hours'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checklist of Included Capabilities */}
              {Array.isArray(demo.features) && demo.features.length > 0 && (
                <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
                  <span className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-wider block">
                    Included Enterprise Deliverables
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {demo.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-200 font-semibold min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT 5-COL: PRE-ORDER & LAUNCH RESERVATION CARD */}
            <div className="lg:col-span-5 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-900/95 border-2 border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.25)] space-y-5 sm:space-y-6 relative overflow-hidden min-w-0">
              
              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-purple-400 bg-purple-950/80 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-purple-800/80 inline-block">
                  ⚡ EXCLUSIVE PRE-LAUNCH PASS
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
                  Order Before Live Launch
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Lock in early bird deployment with free 1-year SSL, custom domain & instant WhatsApp funnels.
                </p>
              </div>

              {/* Price Box */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Special Launch Price</span>
                  <div className="text-xl sm:text-3xl font-black text-white">
                    {demo.priceInr || '₹4,999'} <span className="text-xs font-normal text-slate-400">/ {demo.price || '$99'}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-extrabold px-2 sm:px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    SAVE 20%
                  </span>
                </div>
              </div>

              {/* Guarantees List */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Express {demo.turnaround || '48-Hour'} Guaranteed Turnaround</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full Source Code & Admin Panel Ownership</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>100% Mobile & Desktop Fully Responsive</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handlePreOrder}
                  className="w-full py-3 sm:py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-black text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className="truncate">Pre-Order & Customize Now</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={handleRequestPriority}
                  className="w-full py-2.5 sm:py-3 px-5 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Request Priority Callback</span>
                </button>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>,
    document.body
  );
}
