import React from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function DashboardLoader({
  title = 'Loading...',
  subtitle = '',
  role = 'client'
}) {
  const isAdmin = role === 'admin';
  const { settings } = useSiteSettings();
  const activeLogo = settings?.logoLightUrl || settings?.logoDarkUrl || '/logo.png';
  const brandName = settings?.brandName || 'WEBLETS';

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
      
      {/* Minimal Logo Mark with Glowing Spinner */}
      <div className="relative mb-3 flex items-center justify-center">
        {/* Glowing spinning ring */}
        <div className={`w-14 h-14 border-2 border-transparent ${
          isAdmin ? 'border-t-amber-500 border-r-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'border-t-purple-600 border-r-purple-600/40 shadow-[0_0_20px_rgba(168,85,247,0.35)]'
        } rounded-full animate-spin`} />
        
        {/* Small Brand Logo in center (Glowing Circular Orb) */}
        <div className="absolute inset-0 m-auto w-9 h-9 rounded-full overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-1 ring-purple-400/30 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-1 flex items-center justify-center">
          <img
            src={activeLogo}
            alt={brandName}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = '/logo.png';
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
