import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShoppingBag, Sparkles, Clock, Star, ArrowRight } from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';

export default function DemoCard({ demo }) {
  const { openOrderModal } = useOrderModal();

  const handleGetWebsite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openOrderModal({
      selectedDemo: demo.title,
      websiteType: `Ready-Made Demo: ${demo.title}`,
      initialRequirements: `I want to order the "${demo.title}" (${demo.category}) website template for my business.`,
      price: demo.priceInr || demo.price
    });
  };

  return (
    <div className="group rounded-card glass-card overflow-hidden border border-white/90 dark:border-slate-700/80 shadow-glass hover:shadow-glass-highlight transition-all duration-300 flex flex-col justify-between relative">

      {/* Top Image Preview Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={demo.heroImage}
          alt={demo.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 sm:px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-white dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] sm:text-[11px] font-bold shadow-sm">
            {demo.category}
          </span>
          {demo.badge && (
            <span className="px-2.5 sm:px-3 py-1 rounded-full l2b-gradient-bg text-white text-[10px] sm:text-[11px] font-bold shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {demo.badge}
            </span>
          )}
        </div>

        {/* Quick Overlay Action on Hover (Desktop) */}
        <div className="hidden sm:flex absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-2.5 p-4">
          <Link
            to={`/demos/${demo.slug}`}
            className="px-4 py-2 rounded-btn bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            <span>📱 Device Preview & Details</span>
            <ExternalLink className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </Link>
          <button
            onClick={handleGetWebsite}
            className="px-4 py-2 rounded-btn l2b-gradient-bg text-white font-bold text-xs shadow-lg hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Get Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating & Turnaround */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <div className="flex items-center gap-1 text-amber-500 font-semibold text-[11px] sm:text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{demo.rating}</span>
              <span className="text-slate-400 dark:text-slate-500">({demo.reviewsCount})</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium text-[11px] sm:text-xs">
              <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{demo.turnaround}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            <Link to={`/demos/${demo.slug}`}>
              {demo.title}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm line-clamp-2 mt-1.5">
            {demo.shortDescription}
          </p>

          {/* Features Pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {demo.features.slice(0, 3).map((feat, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] sm:text-[11px] font-medium"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Price & Mobile Touch Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Starting at</div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {demo.priceInr || '₹9,999'} <span className="text-xs font-normal text-slate-400">/ {demo.price}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/demos/${demo.slug}`}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-center"
            >
              Device Demo
            </Link>

            <button
              onClick={handleGetWebsite}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:opacity-95 text-center cursor-pointer"
            >
              Get Website
            </button>
          </div>
        </div>

      </div>

      {/* Subtle bottom tricolor accent */}
      <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-amber-400/40 via-blue-400/30 to-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
