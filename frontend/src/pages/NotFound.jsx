import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { SEO } from '../components/common/CommonUI';

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found (404)" />
      <div className="min-h-[80vh] flex items-center justify-center px-4 pt-28 pb-16">
        <div className="glass-panel rounded-hero p-8 sm:p-14 border border-white dark:border-slate-700/80 shadow-floating text-center max-w-lg mx-auto">
          <div className="text-6xl sm:text-7xl font-black text-brand-600 dark:text-brand-400 font-mono mb-4">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Page Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8">
            The page you are looking for doesn't exist or has been moved. Explore our demo marketplace or return home.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-btn bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/demos"
              className="w-full sm:w-auto px-6 py-3 rounded-btn bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Browse Templates</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
