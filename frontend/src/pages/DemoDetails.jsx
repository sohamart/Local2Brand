import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Sparkles,
  Clock,
  Star,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Share2,
  MessageCircle
} from 'lucide-react';
import { SEO } from '../components/common/CommonUI';
import DevicePreview from '../components/demos/DevicePreview';
import ShareDemoModal from '../components/demos/ShareDemoModal';
import DashboardLoader from '../components/common/DashboardLoader';
import { useOrderModal } from '../context/OrderModalContext';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../utils/whatsapp';
import AshokaChakra from '../components/common/AshokaChakra';
import { formatPriceByCountry } from '../data/countryThemes';
import api from '../services/api';

export default function DemoDetails() {
  const { slug } = useParams();
  const { openOrderModal, openCallbackModal } = useOrderModal();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [demo, setDemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userCountry = typeof window !== 'undefined' ? (localStorage.getItem('l2b_user_country') || 'India') : 'India';

  useEffect(() => {
    // Strictly keep user at the top of the page on route load
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }

    let isMounted = true;
    const fetchDemo = async () => {
      if (!slug) {
        setError('No demo specified');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/demos/${slug}`);
        if (isMounted) {
          if (res.success && res.demo) {
            setDemo(res.demo);
          } else {
            setError(`Template '${slug}' was not found in the database.`);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || `Unable to load template '${slug}' from database.`);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDemo();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Robust multi-tick scroll guard: Prevents embedded live demo iframe from dragging parent window down
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }

    let count = 0;
    const scrollGuardTimer = setInterval(() => {
      count++;
      // If parent window was pulled down unexpectedly by child iframe autofocus or layout shifts, reset to 0
      if (window.scrollY > 0 && window.scrollY < 1200) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true });
        }
      }
      if (count > 25) { // 2.5 seconds total coverage
        clearInterval(scrollGuardTimer);
      }
    }, 100);

    return () => clearInterval(scrollGuardTimer);
  }, [slug, loading]);




  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center">
        <DashboardLoader title="Fetching Template Specifications from Database..." role="client" />
      </div>
    );
  }

  if (error || !demo) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-4 text-center max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-600 flex items-center justify-center mx-auto">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Template Not Found</h2>
        <p className="text-xs text-slate-500">
          {error || `The template '${slug}' is not present in the database.`}
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link to="/demos" className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm">
            Browse All Templates
          </Link>
          <Link to="/" className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleOrder = () => {
    openOrderModal({
      selectedDemo: demo.title,
      websiteType: `Template Order: ${demo.title}`,
      initialRequirements: `I want to order and customize the "${demo.title}" (${demo.category || 'Website'}) website template for my business.`,
      price: demo.priceInr || demo.price
    });
  };

  const handleAskQuestions = () => {
    if (openCallbackModal) {
      openCallbackModal({ topic: `Questions regarding ${demo.title}` });
    } else {
      const msg = `Hi LOCAL2BRAND! 👋 I have some questions regarding the "${demo.title}" template.`;
      openWhatsAppChat(msg);
    }
  };


  return (
    <>
      <SEO
        title={`${demo.title} — Live Website Template Preview`}
        description={`Interactive preview of ${demo.title}. Features ${demo.features.slice(0, 2).join(', ')}. Order via WhatsApp with 3 - 7 days turnaround.`}
      />

      <div className="page-header-offset pb-12 sm:pb-16">

        {/* Navigation Breadcrumb */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-3 sm:mb-4">
          <Link
            to="/demos"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Templates</span>
          </Link>
        </div>

        {/* Header Summary Card */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-4 sm:mb-6">
          <div className="glass-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-white dark:border-slate-700/80 shadow-glass relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                    <AshokaChakra size={11} />
                    <span>{demo.category}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                    {demo.turnaround || '2 - 4 Days'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-amber-500 font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{demo.rating || '5.0 ★'}</span>
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {demo.title}
                </h1>

                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl line-clamp-2 leading-relaxed">
                  {demo.description || demo.shortDescription}
                </p>
              </div>

              {/* Price & Primary CTA Block */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-2.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs shrink-0">
                <div className="text-left lg:text-right">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {formatPriceByCountry(demo.priceInr || demo.price || 4999, userCountry)}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    One-time investment • Full launch
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">

                  {demo.status !== 'coming_soon' && demo.liveUrl ? (
                    <a
                      href={demo.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Launch Live Website ↗</span>
                      <ExternalLink className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </a>
                  ) : demo.status !== 'coming_soon' ? (

                    <span className="flex-1 sm:flex-none px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Live Preview Coming Soon</span>
                    </span>
                  ) : (
                    <span className="flex-1 sm:flex-none px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center gap-2">
                      <span>⏳ Coming Soon</span>
                    </span>
                  )}

                  <button
                    onClick={handleOrder}
                    className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
                  >
                    <span>{demo.status === 'coming_soon' ? 'Pre-Order Website' : 'Get This Website'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>


                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="p-3.5 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    title="Share this demo"
                  >
                    <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="hidden sm:inline font-bold text-xs">Share</span>
                  </button>

                  <button
                    onClick={handleAskQuestions}
                    className="p-3.5 rounded-xl text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200/90 dark:border-emerald-500/40 transition-all cursor-pointer"
                    title="Ask question on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </button>
                </div>
              </div>

            </div>

            {/* Subtle bottom tricolor accent */}
            <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/60 via-blue-500/40 to-emerald-500/60" />
          </div>
        </div>

        {/* Share Demo Modal */}
        <ShareDemoModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          demo={demo}
        />

        {/* Interactive Device Preview Simulator */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <DevicePreview
            demo={demo}
            image={demo.image || demo.heroImage}
            title={demo.title}
            aspectRatio={demo.aspectRatio}
          />
        </div>

        {/* Template In-Depth Specifications Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Col: Included Features & Deliverables */}
            <div className="lg:col-span-8 space-y-8">

              {/* Features Box */}
              <div className="glass-card p-6 sm:p-8 rounded-card border border-white dark:border-slate-700/80 space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>Key Features & Functional Sections</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {demo.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customization Deliverables */}
              <div className="glass-card p-6 sm:p-8 rounded-card border border-white dark:border-slate-700/80 space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>What We Customize For You:</span>
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span><strong>Logo & Brand Styling:</strong> We inject your brand logos, custom font pairings, and exact color palette.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span><strong>Custom Content & Media:</strong> Upload your real high-resolution photos, product menus, portfolios, and service listings.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span><strong>Direct Lead Capture Funnel:</strong> Direct client inquiry & callback scheduling pipeline connected to your portal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span><strong>Domain Connection & Global CDN:</strong> Free SSL, custom domain mapping, and sub-second edge hosting setup.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Right Col: Specifications & Fast Checkout Box */}
            <div className="lg:col-span-4 space-y-6">

              <div className="glass-panel p-6 sm:p-8 rounded-card border border-white dark:border-slate-700/80 shadow-floating space-y-6 sticky top-24">
                <h4 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-1.5">
                  <AshokaChakra size={13} />
                  <span>Template Specifications</span>
                </h4>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Industry:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{demo.category}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Turnaround:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{demo.turnaround}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Mobile Ready:</span>
                    <span className="font-bold text-slate-900 dark:text-white">100% Tested</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Core Web Vitals:</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">98+ PageSpeed</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Ownership:</span>
                    <span className="font-bold text-slate-900 dark:text-white">100% Lifetime</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleOrder}
                    className="w-full py-4 px-6 rounded-btn font-bold text-sm text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
                  >
                    <span>Get This Website ({formatPriceByCountry(demo.priceInr || demo.price || 9999, userCountry)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                    Instant proposal calculation with 48h handover.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </>
  );
}
