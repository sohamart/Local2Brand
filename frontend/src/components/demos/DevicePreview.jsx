import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';

export default function DevicePreview({ demo, image, title, aspectRatio }) {
  const [deviceMode, setDeviceMode] = useState('desktop'); // Default to Desktop, switchable to Tablet & Mobile
  const [iframeKey, setIframeKey] = useState(0);
  const { openOrderModal } = useOrderModal();

  const activeTitle = demo?.title || title || 'Website Demo';
  const activeCategory = demo?.category || 'Website Demo';
  const activeSlug = demo?.templateId || demo?.slug || 'restaurant';
  const activePrice = demo?.priceInr || demo?.price || '₹9,999';

  const handleOrder = () => {
    openOrderModal({
      selectedDemo: activeTitle,
      websiteType: `Template Customization: ${activeTitle}`,
      initialRequirements: `I want to order and customize the "${activeTitle}" (${activeCategory}) template.`,
      price: activePrice
    });
  };

  const previewUrl = `/preview/${activeSlug}?embed=true`;
  const fullScreenUrl = `/preview/${activeSlug}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Device Viewport Selector Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 glass-panel rounded-2xl border border-white/90 dark:border-slate-700/80 shadow-glass-sm">

        {/* Device Switcher Buttons */}
        <div className="flex items-center justify-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-900/90 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>🖥️ Desktop</span>
          </button>

          <button
            onClick={() => setDeviceMode('tablet')}
            className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'tablet'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>📱 Tablet (iPad)</span>
          </button>

          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📱 Mobile (iPhone)</span>
          </button>
        </div>

        {/* Viewport Meta & Fullscreen Live Demo Link */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <button
            onClick={() => setIframeKey(k => k + 1)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition-all"
            title="Reload Preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <a
            href={fullScreenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Full-Screen Tab ↗</span>
          </a>

          <button
            onClick={handleOrder}
            className="px-4 py-1.5 rounded-xl l2b-gradient-bg text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:opacity-95"
          >
            <span>Order Template ({activePrice})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Interactive Device Stage Container */}
      <div className="p-2 sm:p-6 lg:p-8 rounded-card sm:rounded-hero glass-card border border-white dark:border-slate-700/80 flex items-center justify-center min-h-[560px] sm:min-h-[720px] bg-slate-100/50 dark:bg-slate-950/50 overflow-hidden">

        {/* Device Frame */}
        <div
          className={`transition-all duration-500 ease-out bg-slate-950 rounded-2xl sm:rounded-[36px] border-4 sm:border-8 border-slate-900 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col ${
            deviceMode === 'desktop'
              ? 'w-full max-w-5xl h-[660px]'
              : deviceMode === 'tablet'
              ? 'w-[768px] max-w-full h-[680px]'
              : 'w-[375px] max-w-full h-[680px]'
          }`}
        >
          {/* Top Device Header Bar with URL */}
          <div className="bg-slate-900 px-3 sm:px-4 py-2 flex items-center justify-between text-white/70 text-[9px] sm:text-[10px] shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="font-mono truncate max-w-[150px] sm:max-w-[280px] text-white/60 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              local2brand.com/preview/{activeSlug} • {deviceMode === 'desktop' ? 'Desktop (1024px+)' : deviceMode === 'tablet' ? 'Tablet (768px)' : 'Mobile (375px)'}
            </div>
            <span className="text-emerald-400 font-bold text-[9px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Sim</span>
            </span>
          </div>

          {/* Real Responsive Viewport Iframe Container */}
          <div className="flex-1 w-full h-full bg-slate-950 relative overflow-hidden">
            <iframe
              key={`${activeSlug}-${deviceMode}-${iframeKey}`}
              src={previewUrl}
              title={`${activeTitle} Live Interactive Preview`}
              className="w-full h-full border-0 bg-slate-950"
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
