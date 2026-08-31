import React from 'react';

export default function DashboardLoader({
  title = 'Loading...',
  subtitle = '',
  role = 'client'
}) {
  const isAdmin = role === 'admin';

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
      
      {/* Minimal Logo Mark with Subtle Spinner */}
      <div className="relative mb-3 flex items-center justify-center">
        {/* Subtle hairline spinning ring */}
        <div className={`w-12 h-12 rounded-2xl border-2 border-transparent ${
          isAdmin ? 'border-t-amber-500 border-r-amber-500/30' : 'border-t-purple-600 border-r-purple-600/30'
        } rounded-full animate-spin`} />
        
        {/* Small Brand Logo / Initial in center */}
        <div className="absolute inset-0 m-auto w-8 h-8 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center">
          <img
            src="/logo.jpg"
            alt="LOCAL2BRAND"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Small Clean Text */}
      <div className="space-y-0.5 max-w-xs">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Hairline Minimal Progress Track */}
      <div className="w-24 bg-slate-100 dark:bg-slate-800/80 rounded-full h-1 overflow-hidden mt-3">
        <div
          className={`h-full rounded-full animate-[progress_1.2s_ease-in-out_infinite] ${
            isAdmin ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'l2b-gradient-bg'
          }`}
          style={{ width: '50%' }}
        />
      </div>

    </div>
  );
}
