import React, { useState } from 'react';
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Zap,
  Share2,
  CheckCircle,
  RefreshCw,
  Globe,
  Lock,
  Clock,
  Rocket,
  ShieldCheck,
  Star
} from 'lucide-react';
import AshokaChakra from '../components/common/AshokaChakra';
import ThemeToggle from '../components/common/ThemeToggle';
import { useOrderModal } from '../context/OrderModalContext';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../utils/whatsapp';
import ShareDemoModal from '../components/demos/ShareDemoModal';
import { demoWebsites, getDemoBySlug } from '../data/demos';

export default function LiveDemoViewer() {
  const params = useParams();
  const rawId = params.slug || params.templateId || 'restaurant';
  const cleanId = rawId.toLowerCase().trim();
  const [searchParams] = useSearchParams();
  const { openOrderModal } = useOrderModal();
  const [deviceMode, setDeviceMode] = useState('full'); // 'full', 'desktop', 'tablet', 'mobile'
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);

  const activeDemo = getDemoBySlug(cleanId) || demoWebsites[0];

  const handleOrder = () => {
    openOrderModal({
      selectedDemo: activeDemo.title,
      websiteType: `Live Website Project: ${activeDemo.title}`,
      initialRequirements: `I want to order and deploy a complete live website for my business based on the "${activeDemo.title}" (${activeDemo.category}) demo.`,
      price: activeDemo.priceInr || activeDemo.price
    });
  };

  const handleDirectWhatsApp = () => {
    const text = `⚡ *LIVE WEBSITE ORDER INQUIRY - LOCAL2BRAND*\n\n` +
      `Live Website: *${activeDemo.title}*\n` +
      `Category: ${activeDemo.category}\n` +
      `Status: ${activeDemo.isPublished ? 'Live Ready' : 'Pre-Order / Launching Soon'}\n` +
      `Package: *${activeDemo.priceInr || activeDemo.price}*\n\n` +
      `Hi LOCAL2BRAND team, I want to build a complete custom full-stack website for my business in 48h to 7 days!`;
    openWhatsAppChat(generateWhatsAppGeneralUrl(text));
  };

  const handleReload = () => {
    setIsLoadingIframe(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col overflow-x-hidden transition-colors duration-300">
      
      {/* 1. TOP FLOATING CONTROL BAR (Works in Light & Dark Mode) */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-sm dark:shadow-2xl transition-colors duration-300">
        
        {/* Left: Back to Marketplace & Website Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/demos"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Demos</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-3">
            <span className="text-xs font-black text-slate-900 dark:text-white">{activeDemo.title}</span>
            {activeDemo.isPublished ? (
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-700/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Online</span>
              </span>
            ) : (
              <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-700/60 flex items-center gap-1">
                <Rocket className="w-3 h-3 text-amber-500" />
                <span>Launching Soon</span>
              </span>
            )}
          </div>
        </div>

        {/* Center: Live URL & Device Switcher (Only in published mode or wide screens) */}
        <div className="flex items-center gap-2">
          {activeDemo.isPublished && activeDemo.liveUrl && (
            <a
              href={activeDemo.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono transition-all"
              title="Open full website in a new window"
            >
              <Globe className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span className="truncate max-w-[180px]">{activeDemo.liveUrl.replace('https://', '')}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}

          {/* Device Switcher */}
          {activeDemo.isPublished && (
            <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <button
                onClick={() => setDeviceMode('full')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deviceMode === 'full' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Full</span>
              </button>
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deviceMode === 'desktop' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deviceMode === 'tablet' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deviceMode === 'mobile' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Actions & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {activeDemo.isPublished && activeDemo.liveUrl && (
            <a
              href={activeDemo.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 px-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Open full website in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">Open URL</span>
            </a>
          )}

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            title="Share Demo"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </button>

          <button
            onClick={handleDirectWhatsApp}
            className="px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{activeDemo.isPublished ? 'Get This Live Website' : 'Pre-Order on WhatsApp'}</span>
            <span className="xs:hidden">Order</span>
          </button>
        </div>
      </header>

      {/* Share Modal */}
      <ShareDemoModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        demo={{ title: activeDemo.title, slug: activeDemo.slug || activeDemo.id, category: activeDemo.category }}
      />

      {/* 2. MAIN VIEWPORT (Light & Dark Mode Responsive Area) */}
      <main className="flex-1 flex flex-col justify-start items-center bg-slate-100/70 dark:bg-[#030712] py-4 sm:py-8 px-3 sm:px-6 relative transition-colors duration-300">
        
        <div
          className={`transition-all duration-300 w-full flex flex-col items-center ${
            deviceMode === 'full'
              ? 'max-w-full'
              : deviceMode === 'desktop'
              ? 'max-w-6xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl my-2'
              : deviceMode === 'tablet'
              ? 'max-w-3xl rounded-3xl overflow-hidden border-4 border-slate-200 dark:border-slate-800 shadow-2xl my-2'
              : 'max-w-sm rounded-[36px] overflow-hidden border-8 border-slate-200 dark:border-slate-800 shadow-2xl my-2'
          }`}
        >
          {/* Active Live Iframe View */}
          {activeDemo.isPublished && activeDemo.liveUrl ? (
            <div className="w-full h-[calc(100vh-85px)] relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl">
              {/* Browser bar for desktop/tablet/mobile device frames */}
              {deviceMode !== 'full' && (
                <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs shadow-inner">
                    <Lock className="w-3 h-3 text-emerald-500" />
                    <span>{activeDemo.liveUrl}</span>
                  </div>
                  <button
                    onClick={handleReload}
                    className="p-1 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    title="Reload live website"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Embedded Live Iframe */}
              <iframe
                key={iframeKey}
                src={activeDemo.liveUrl}
                title={activeDemo.title}
                className="w-full flex-1 border-0 bg-white"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsLoadingIframe(false)}
              />

              {/* Ultra-Responsive Floating Live Action & Order Bar */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 p-2.5 sm:p-3.5 rounded-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white transition-all">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  
                  {/* Left: Thumbnail & Project Meta */}
                  <div className="flex items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto">
                    <img
                      src={activeDemo.heroImage}
                      alt={activeDemo.title}
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold truncate text-slate-900 dark:text-white">
                        {activeDemo.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex-wrap mt-0.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {activeDemo.priceInr || activeDemo.price}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Clock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          48h Delivery
                        </span>
                        <span className="hidden xs:inline">•</span>
                        <span className="hidden xs:inline text-amber-600 dark:text-amber-400 font-bold">
                          20% Launch Discount
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <Link
                      to={`/details/${activeDemo.slug}`}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <span>📱 Specs & Devices</span>
                    </Link>

                    <a
                      href={activeDemo.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all"
                      title="Open full website in new tab"
                    >
                      <span>Open Tab</span>
                      <ExternalLink className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    </a>

                    <button
                      onClick={handleOrder}
                      className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl l2b-gradient-bg text-xs sm:text-sm font-bold text-white shadow-lg hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Order Website</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            /* 3. ULTRA-PREMIUM COMING SOON LAUNCHPAD (Massive, Bold & Highlighted) */
            <div className="w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 lg:p-12 glass-panel border-2 border-amber-300/80 dark:border-amber-500/40 bg-white/95 dark:bg-slate-900/95 shadow-floating relative overflow-hidden text-center transition-colors duration-300">
              
              {/* Dynamic Vibrant Ambient Back-Glow */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[400px] bg-gradient-to-r from-amber-500/20 via-purple-500/25 to-pink-500/20 dark:from-amber-500/30 dark:via-purple-500/35 dark:to-pink-500/30 rounded-full blur-[95px] pointer-events-none -z-10 animate-pulse-glow" />

              {/* TOP BIG PROMINENT COMING SOON HERO MARQUEE & BADGE */}
              <div className="max-w-3xl mx-auto space-y-6">
                
                {/* 🌟 Giant Animated Neon COMING SOON Banner */}
                <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-2 sm:p-2.5 px-5 sm:px-8 rounded-2xl sm:rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-400 dark:border-amber-400/80 shadow-lg shadow-amber-500/15 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-amber-900 dark:text-amber-300 drop-shadow-xs">
                      ⚡ LIVE DEMO COMING SOON ⚡
                    </span>
                  </div>
                  <span className="hidden sm:inline text-amber-400">•</span>
                  <span className="text-[11px] sm:text-xs font-bold text-amber-800 dark:text-amber-200 bg-amber-400/20 dark:bg-amber-400/30 px-3 py-0.5 rounded-full">
                    Pre-Launch Early Access Active
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {activeDemo.title}
                </h1>

                {/* Subtitle / Value Proposition */}
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                  {activeDemo.description || activeDemo.shortDescription}
                </p>

                {/* Live Deployment Progress Radar Bar */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-slate-950/80 border border-amber-300/60 dark:border-slate-800 text-left max-w-2xl mx-auto space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                      <Rocket className="w-4 h-4 text-amber-500 animate-bounce" />
                      <span>Full-Stack Development & Deployment</span>
                    </span>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>95% Ready • 48h Delivery</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 w-[95%] rounded-full animate-pulse" />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    💡 <strong>Good news:</strong> You don't have to wait for public release! You can pre-book this exact website today and our team will configure it with your custom branding, domain, products, and WhatsApp checkout in <strong>48 hours</strong>.
                  </p>
                </div>

                {/* Visual Preview Mockup with Holographic "COMING SOON" Watermark Stamp */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/9] max-w-2xl mx-auto border-2 border-slate-200 dark:border-slate-800 shadow-2xl group my-4 bg-slate-950">
                  <img
                    src={activeDemo.heroImage}
                    alt={activeDemo.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 brightness-75"
                  />
                  
                  {/* Center Massive COMING SOON Holographic Ribbon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                    <div className="px-6 sm:px-10 py-3 sm:py-4 rounded-2xl bg-slate-950/85 backdrop-blur-xl border-2 border-amber-400 text-white shadow-2xl text-center rotate-[-2deg] transform transition-transform group-hover:rotate-0">
                      <span className="text-xs sm:text-sm font-black tracking-widest text-amber-400 uppercase block">
                        🚀 FULL-STACK WEB APP
                      </span>
                      <span className="text-lg sm:text-3xl font-black tracking-wider text-white uppercase block">
                        COMING SOON
                      </span>
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-300 block mt-0.5">
                        Live Preview URL Launching Soon • Pre-Book Now
                      </span>
                    </div>
                  </div>

                  {/* Bottom Bar Info */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent p-4 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-left">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{activeDemo.rating} ★ ({activeDemo.reviewsCount} Verified Reviews)</span>
                      </span>
                      <h3 className="text-base sm:text-xl font-bold mt-0.5">
                        {activeDemo.title}
                      </h3>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg text-center">
                      {activeDemo.priceInr || activeDemo.price} (Complete Setup)
                    </div>
                  </div>
                </div>

                {/* Included Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl mx-auto text-left text-xs font-semibold pt-1">
                  {activeDemo.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 shadow-xs"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-slate-800 dark:text-slate-200">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Pre-Order & Contact Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
                  <button
                    onClick={handleDirectWhatsApp}
                    className="w-full sm:flex-1 px-8 py-4 rounded-2xl text-sm font-black text-white l2b-gradient-bg shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer hover:opacity-95"
                  >
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Pre-Order on WhatsApp (20% OFF)</span>
                  </button>

                  <Link
                    to="/demos"
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Browse All Demos</span>
                  </Link>
                </div>

                {/* Indian Trust & Launch Guarantee Notice */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    1-Year Free Domain & SSL Included
                  </span>
                  <span>•</span>
                  <span>Direct WhatsApp Assistance</span>
                  <span>•</span>
                  <span>₹ INR & UPI Accepted</span>
                </div>

              </div>
            </div>
          )}
        </div>

      </main>

    </div>
  );
}


