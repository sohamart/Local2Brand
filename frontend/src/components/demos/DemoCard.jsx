import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShoppingBag, Sparkles, Clock, Star, ArrowRight, Share2, Rocket } from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import ShareDemoModal from './ShareDemoModal';

export default function DemoCard({ demo }) {
  const { openOrderModal } = useOrderModal();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleGetWebsite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openOrderModal({
      selectedDemo: demo.title,
      templateId: demo.templateId || demo.slug,
      category: demo.category,
      flow: 'template',
      websiteType: `Template Customization: ${demo.title}`,
      initialRequirements: `I want to order and customize the "${demo.title}" (${demo.category}) template.`,
      price: demo.priceInr || demo.price
    });
  };

  return (
    <div className="group rounded-3xl glass-card overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-glass hover:shadow-glass-highlight transition-all duration-300 flex flex-col justify-between relative bg-white/90 dark:bg-slate-900/90 min-w-0">

      {/* Top Image Preview Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={demo.heroImage}
          alt={demo.title}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges & Share Icon (Elevated above hover overlay) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
          <span className="px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] sm:text-[11px] font-bold shadow-xs">
            {demo.category}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto z-30">
            {demo.isPublished ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                <span>LIVE</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-md shadow-amber-500/20 border border-amber-300 flex items-center gap-1.5 animate-pulse">
                <Rocket className="w-3 h-3 text-slate-950" />
                <span>COMING SOON</span>
              </span>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsShareModalOpen(true);
              }}
              className="w-7 h-7 rounded-full bg-white/95 dark:bg-slate-900/95 hover:bg-white text-slate-700 dark:text-slate-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110"
              title="Share Demo"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </button>
          </div>
        </div>

        {/* Hover Quick Overlay (Desktop) */}
        <div className="hidden sm:flex absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-2 p-4 z-10">
          <Link
            to={`/demos/${demo.slug}`}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            <span>{demo.isPublished ? '🌐 Open Live Demo' : '🚀 View Info & Pre-Book'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </Link>
          <button
            onClick={handleGetWebsite}
            className="px-4 py-2 rounded-xl l2b-gradient-bg text-white font-bold text-xs shadow-lg hover:opacity-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{demo.isPublished ? 'Get Website' : 'Pre-Order'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Rating & Turnaround */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <div className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{demo.rating}</span>
              <span className="text-slate-400 dark:text-slate-500">({demo.reviewsCount})</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium text-[11px]">
              <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{demo.turnaround}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
            <Link to={`/demos/${demo.slug}`}>
              {demo.title}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 mt-1 leading-relaxed">
            {demo.shortDescription}
          </p>

          {/* Features Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {demo.features.slice(0, 2).map((feat, i) => (
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
                {demo.priceInr || '₹4,999'} <span className="text-xs font-normal text-slate-400">/ {demo.price}</span>
              </div>
            </div>

            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Ready in 3 - 7 Days
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/demos/${demo.slug}`}
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>{demo.isPublished ? '🌐 Live Demo' : '🚀 Coming Soon'}</span>
              <ExternalLink className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            </Link>

            <button
              onClick={handleGetWebsite}
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:opacity-95 text-center transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <span>{demo.isPublished ? 'Get Website' : 'Pre-Order'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Share Modal */}
      <ShareDemoModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        demo={demo}
      />

      {/* Subtle bottom tricolor accent */}
      <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-amber-400/40 via-blue-400/30 to-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
