import React, { useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, ShoppingBag, Sparkles, Clock, Star, ArrowRight, Share2, Rocket, X, CheckCircle2 } from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import ShareDemoModal from './ShareDemoModal';

function DemoCardComponent({ demo, onShare }) {
  const { openOrderModal } = useOrderModal();
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showComingSoonPopup, setShowComingSoonPopup] = useState(false);

  // Unified Status Evaluation:
  // 1. isLive: Published in Admin AND has a working Live URL
  // 2. isPublishedNoLiveUrl: Published in Admin BUT Live URL is pending (can still be ordered directly!)
  // 3. isComingSoon: Explicitly marked as Coming Soon in Admin (Pre-Order only)
  const isComingSoon = demo.status === 'coming_soon';
  const hasLiveUrl = Boolean(demo.liveUrl && demo.liveUrl.trim().length > 0);
  const isLive = !isComingSoon && hasLiveUrl;
  const isPublishedNoLiveUrl = !isComingSoon && !hasLiveUrl;

  const handleCardClick = (e) => {
    if (isComingSoon || isPublishedNoLiveUrl) {
      e.preventDefault();
      e.stopPropagation();
      setShowComingSoonPopup(true);
    } else {
      navigate(`/demos/${demo.slug || demo._id}`);
    }
  };

  const handleGetWebsite = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowComingSoonPopup(false);
    openOrderModal({
      selectedDemo: demo.title,
      templateId: demo.templateId || demo.slug || demo._id,
      category: demo.category,
      flow: isComingSoon ? 'pre-order' : 'template',
      websiteType: isComingSoon ? `Pre-Order Template: ${demo.title}` : `Template Customization: ${demo.title}`,
      initialRequirements: `I want to ${isComingSoon ? 'pre-order' : 'order and customize'} the "${demo.title}" (${demo.category}) template.`,
      price: demo.priceInr || demo.price
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-400/60 dark:hover:border-purple-600/60 transition-all duration-200 flex flex-col justify-between relative bg-white dark:bg-slate-900 min-w-0 cursor-pointer transform-gpu"
    >
      {/* Top Image Preview Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={demo.thumbnail || demo.heroImage || demo.coverImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop'}
          alt={demo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out will-change-transform"
          loading="lazy"
        />

        {/* Top Badges & Share Icon */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
          <span className="px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] sm:text-[11px] font-bold shadow-xs">
            {demo.category}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto z-30">
            {isLive ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                <span>{demo.badge || 'LIVE'}</span>
              </span>
            ) : isPublishedNoLiveUrl ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                <span>{demo.badge || 'READY TO BUILD'}</span>
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowComingSoonPopup((prev) => !prev);
                }}
                className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-md shadow-amber-500/20 border border-amber-300 flex items-center gap-1.5 animate-pulse cursor-pointer hover:scale-105 transition-all"
              >
                <Rocket className="w-3 h-3 text-slate-950" />
                <span>{demo.badge || 'COMING SOON'}</span>
              </button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onShare) {
                  onShare(demo);
                } else {
                  setIsShareModalOpen(true);
                }
              }}
              className="w-7 h-7 rounded-full bg-white/95 dark:bg-slate-900/95 hover:bg-white text-slate-700 dark:text-slate-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110"
              title="Share Demo"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </button>
          </div>
        </div>

        {/* Hover Quick Overlay (Desktop) */}
        <div className="hidden sm:flex absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center gap-2 p-4 z-10 pointer-events-none group-hover:pointer-events-auto">
          {isLive ? (
            <Link
              to={`/demos/${demo.slug || demo._id}`}
              onClick={(e) => e.stopPropagation()}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <span>📱 Device Preview &amp; Specs</span>
              <ExternalLink className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </Link>
          ) : isPublishedNoLiveUrl ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowComingSoonPopup(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg hover:bg-emerald-500 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Preview Soon</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowComingSoonPopup(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-lg hover:bg-amber-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Live Demo Coming Soon</span>
            </button>
          )}

          <button
            onClick={handleGetWebsite}
            className="px-4 py-2 rounded-xl l2b-gradient-bg text-white font-bold text-xs shadow-lg hover:opacity-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{isComingSoon ? 'Pre-Order Now' : 'Get Website'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sleek Compact Floating Coming Soon Inline Bubble */}
        {showComingSoonPopup && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-2.5 bottom-2.5 z-40 p-3 rounded-2xl bg-slate-950/95 dark:bg-slate-900/95 backdrop-blur-xl border border-amber-500/50 shadow-2xl text-white animate-in zoom-in-95 duration-150 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${isPublishedNoLiveUrl ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  <Rocket className="w-3 h-3" />
                </span>
                <span className={`font-extrabold text-[11px] ${isPublishedNoLiveUrl ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isPublishedNoLiveUrl ? 'Catalog Ready to Order' : 'Live Preview in Testing'}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComingSoonPopup(false);
                }}
                className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[10px] text-slate-300 leading-snug">
              {isPublishedNoLiveUrl
                ? 'This website template is ready for immediate custom build & launch. Delivery in 48–72 hours!'
                : 'Interactive preview will be live shortly. You can pre-order this template today with express priority delivery!'}
            </p>

            <button
              onClick={handleGetWebsite}
              className={`w-full py-1.5 rounded-xl text-[11px] font-bold text-center shadow-xs cursor-pointer flex items-center justify-center gap-1 ${
                isPublishedNoLiveUrl
                  ? 'text-white l2b-gradient-bg'
                  : 'text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95'
              }`}
            >
              <span>{isComingSoon ? 'Pre-Order Template' : 'Get This Website'} ({demo.priceInr || '₹4,999'})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Rating & Turnaround */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <div className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{demo.rating || '4.9'}</span>
              <span className="text-slate-400 dark:text-slate-500">({demo.reviewsCount || '18'})</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium text-[11px]">
              <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{demo.turnaround || demo.turnaroundTime || '48h Express'}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
            {demo.title}
          </h3>

          {/* Short Description */}
          <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 mt-1 leading-relaxed">
            {demo.description || demo.shortDescription}
          </p>

          {/* Features Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {(demo.features || []).slice(0, 2).map((feat, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 text-[10px] font-medium truncate max-w-full"
              >
                ✓ {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Investment</span>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {demo.priceInr || '₹4,999'} <span className="text-xs font-normal text-slate-400">/ {demo.price || '$99'}</span>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
              !isComingSoon
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
                : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
            }`}>
              {!isComingSoon ? (isLive ? 'Live Ready' : 'Ready to Order') : 'Pre-Order Ready'}
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 gap-2">
            {isLive ? (
              <Link
                to={`/demos/${demo.slug || demo._id}`}
                onClick={(e) => e.stopPropagation()}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>📱 Device Preview</span>
                <ExternalLink className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </Link>
            ) : isPublishedNoLiveUrl ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowComingSoonPopup((prev) => !prev);
                }}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700/60 text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Live Soon</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowComingSoonPopup((prev) => !prev);
                }}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-700/60 text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Rocket className="w-3 h-3" />
                <span>Coming Soon</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleGetWebsite}
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:opacity-95 text-center transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <span>{isComingSoon ? 'Pre-Order' : 'Get Website'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>


      {/* Lazy Share Modal */}
      {isShareModalOpen && (
        <ShareDemoModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          demo={demo}
        />
      )}

      {/* Subtle bottom tricolor accent */}
      <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-amber-400/40 via-blue-400/30 to-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

const DemoCard = memo(DemoCardComponent);
export default DemoCard;
