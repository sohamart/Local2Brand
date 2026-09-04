import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, ArrowRight, Sparkles, RefreshCw, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import { formatPriceByCountry } from '../../data/countryThemes';
import ShareDemoModal from './ShareDemoModal';

export default function DevicePreview({ demo, image, title, aspectRatio }) {
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [iframeKey, setIframeKey] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const { openOrderModal } = useOrderModal();

  const userCountry = typeof window !== 'undefined' ? (localStorage.getItem('l2b_user_country') || 'India') : 'India';

  const stageRef = useRef(null);
  const [scale, setScale] = useState(1);

  const activeTitle = demo?.title || title || 'Website Demo';
  const activeCategory = demo?.category || 'Website Demo';
  const activeSlug = demo?.templateId || demo?.slug || 'restaurant';
  const activePrice = formatPriceByCountry(demo?.priceInr || demo?.price || 4999, userCountry);

  // Target viewport dimensions for authentic emulation (balanced heights)
  const targetWidth = deviceMode === 'desktop' ? 1200 : deviceMode === 'tablet' ? 768 : 375;
  const targetHeight = deviceMode === 'desktop' ? 640 : deviceMode === 'tablet' ? 620 : 560;

  // Compute responsive scale so desktop/tablet frames scale down seamlessly on mobile screens
  useEffect(() => {
    const computeScale = () => {
      if (!stageRef.current) return;
      const availableWidth = stageRef.current.clientWidth - 16; // minus padding
      if (availableWidth < targetWidth) {
        setScale(availableWidth / targetWidth);
      } else {
        setScale(1);
      }
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [deviceMode, targetWidth]);

  const handleOrder = () => {
    openOrderModal({
      selectedDemo: activeTitle,
      templateId: activeSlug,
      category: activeCategory,
      flow: 'template',
      websiteType: `Template Customization: ${activeTitle}`,
      initialRequirements: `I want to order and customize the "${activeTitle}" (${activeCategory}) template.`,
      price: activePrice
    });
  };

  const previewUrl = demo?.liveUrl || `/demos/${activeSlug}`;
  const fullScreenUrl = demo?.liveUrl || `/demos/${activeSlug}`;

  const scaledWrapperWidth = targetWidth * scale;
  const scaledWrapperHeight = targetHeight * scale;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Device Viewport Selector Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 p-2.5 sm:p-3.5 glass-panel rounded-2xl border border-white/90 dark:border-slate-700/80 shadow-glass-sm bg-white/90 dark:bg-slate-900/90">

        {/* Device Switcher Buttons */}
        <div className="flex items-center justify-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-950/90 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`flex-1 sm:flex-none px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('tablet')}
            className={`flex-1 sm:flex-none px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'tablet'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet (iPad)</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`flex-1 sm:flex-none px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile (Phone)</span>
          </button>
        </div>

        {/* Viewport Meta & Fullscreen Live Demo Link */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIframeKey(k => k + 1)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition-all cursor-pointer"
            title="Reload Preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all flex items-center gap-1 cursor-pointer"
            title="Share Demo Link"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden xs:inline">Share</span>
          </button>

          <a
            href={fullScreenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Full-Screen ↗</span>
          </a>

          <button
            type="button"
            onClick={handleOrder}
            className="px-3.5 py-1.5 rounded-lg l2b-gradient-bg text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer hover:opacity-95"
          >
            <span>Order Template ({activePrice})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Share Modal */}
      <ShareDemoModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        demo={demo || { title: activeTitle, slug: activeSlug, category: activeCategory }}
      />

      {/* Interactive Device Stage Container with Scaled Emulation */}
      <div
        ref={stageRef}
        className="p-2 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl glass-card border border-white/80 dark:border-slate-800 flex items-center justify-center bg-slate-100/60 dark:bg-slate-950/60 overflow-hidden"
      >

        {/* Outer Emulated Device Frame */}
        <div
          className="transition-all duration-300 ease-out bg-slate-950 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-slate-900 dark:border-slate-850 shadow-xl overflow-hidden flex flex-col mx-auto"
          style={{
            width: `${scaledWrapperWidth}px`,
            maxWidth: '100%'
          }}
        >
          {/* Top Device Header Bar with URL */}
          <div className="bg-slate-900 px-3 sm:px-4 py-1.5 flex items-center justify-between text-white/70 text-[9px] sm:text-[10px] shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/80" />
              <div className="w-2 h-2 rounded-full bg-amber-500/80" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
            </div>
            <div className="font-mono truncate max-w-[140px] sm:max-w-[280px] text-white/60 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              local2brand.com/preview/{activeSlug} • {deviceMode === 'desktop' ? '1200px' : deviceMode === 'tablet' ? '768px' : '375px'}
            </div>
            <span className="text-emerald-400 font-bold text-[9px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{Math.round(scale * 100)}% Sim</span>
            </span>
          </div>

          {/* Scaled Responsive Viewport Container */}
          <div
            className="bg-slate-950 relative overflow-hidden group/simulator"
            style={{
              width: `${scaledWrapperWidth}px`,
              height: `${scaledWrapperHeight}px`
            }}
            data-lenis-prevent="true"
            onMouseEnter={() => setIsInteractive(true)}
            onClick={() => setIsInteractive(true)}
          >
            <div
              style={{
                width: `${targetWidth}px`,
                height: `${targetHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left'
              }}
              className="origin-top-left"
            >
              <iframe
                key={`${activeSlug}-${deviceMode}-${iframeKey}`}
                src={previewUrl}
                title={`${activeTitle} Live Interactive Preview`}
                className={`w-full h-full border-0 bg-slate-950 block transition-opacity duration-300 ${
                  isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
                scrolling="yes"
                loading="lazy"
                tabIndex="-1"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
                onLoad={() => {
                  // Prevent live demo's autofocus/scrollTrigger from pulling parent window down
                  requestAnimationFrame(() => {
                    if (window.scrollY > 0 && window.scrollY < 800) {
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      if (window.lenis) {
                        window.lenis.scrollTo(0, { immediate: true });
                      }
                    }
                  });
                }}
              />
            </div>

            {/* Subtle Interactive Veil on initial boot */}
            {!isInteractive && (
              <div
                onClick={() => setIsInteractive(true)}
                className="absolute inset-0 bg-transparent flex items-center justify-center cursor-pointer z-20"
                title="Click or hover to interact with live simulator"
              />
            )}
          </div>
        </div>
      </div>
    </div>

  );
}



