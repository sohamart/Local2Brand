import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';

export default function DevicePreview({ demo, image, title, aspectRatio }) {
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const { openOrderModal } = useOrderModal();

  // Bulletproof fallback object
  const activeTitle = demo?.title || title || 'Website Demo';
  const activeImage = demo?.heroImage || demo?.image || image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop';
  const activeCategory = demo?.category || 'Website Demo';
  const activeSlug = demo?.slug || 'demo';
  const activePrice = demo?.priceInr || demo?.price || '₹9,999';
  const previewImages = demo?.previewImages || [];

  const handleOrder = () => {
    openOrderModal({
      selectedDemo: activeTitle,
      websiteType: `Template Customization: ${activeTitle}`,
      initialRequirements: `I want to order and customize the "${activeTitle}" (${activeCategory}) template.`,
      price: activePrice
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Device Viewport Selector Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 glass-panel rounded-2xl border border-white/90 shadow-glass-sm">
        
        {/* Device Switcher Pills */}
        <div className="flex items-center justify-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => setDeviceMode('tablet')}
            className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'tablet'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>

          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Viewport Meta & Quick Order */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs font-semibold text-slate-500 hidden md:block">
            {deviceMode === 'desktop' && 'Full Widescreen View (1920 × 1080)'}
            {deviceMode === 'tablet' && 'iPad / Tablet Layout (768 × 1024)'}
            {deviceMode === 'mobile' && 'iPhone / Smartphone View (375 × 812)'}
          </span>

          <button
            onClick={handleOrder}
            className="w-full sm:w-auto px-4 py-2 rounded-btn l2b-gradient-bg text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:opacity-95"
          >
            <span>Get This Website ({activePrice})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Interactive Device Stage Container */}
      <div className="p-2 sm:p-6 lg:p-8 rounded-card sm:rounded-hero glass-card border border-white flex items-center justify-center min-h-[360px] xs:min-h-[420px] sm:min-h-[600px] bg-slate-100/50 overflow-hidden">
        
        {/* Device Frame */}
        <div
          className={`transition-all duration-500 ease-out bg-white rounded-xl sm:rounded-3xl border-2 sm:border-8 border-slate-900 shadow-2xl overflow-hidden flex flex-col ${
            deviceMode === 'desktop'
              ? 'w-full max-w-5xl aspect-[16/10]'
              : deviceMode === 'tablet'
              ? 'w-[360px] sm:w-[440px] max-w-full aspect-[3/4]'
              : 'w-[280px] sm:w-[320px] max-w-full aspect-[9/19]'
          }`}
        >
          {/* Top Device Header Bar */}
          <div className="bg-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between text-white/70 text-[9px] sm:text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="font-mono truncate max-w-[150px] sm:max-w-[200px] text-white/50">
              local2brand.com/demos/{activeSlug}
            </div>
            <div className="w-6 sm:w-8" />
          </div>

          {/* Device Screen Content */}
          <div className="flex-1 overflow-y-auto bg-slate-50 relative group">
            <img
              src={activeImage}
              alt={`${activeTitle} - ${deviceMode} preview`}
              className="w-full object-cover object-top"
            />
            {previewImages && previewImages.length > 0 && (
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 bg-white">
                <div className="text-center py-1.5 sm:py-2">
                  <div className="text-[10px] sm:text-xs font-bold uppercase text-slate-400">Additional Section Previews</div>
                </div>
                {previewImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Preview section ${i + 1}`}
                    className="w-full rounded-lg sm:rounded-xl object-cover shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
