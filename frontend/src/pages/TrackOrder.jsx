import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Check,
  Clock,
  Sparkles,
  ArrowLeft,
  Copy,
  ExternalLink,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Layers,
  FileText,
  AlertCircle,
  RefreshCw,
  Sun,
  Moon,
  ChevronRight,
  Zap,
  Globe
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useOrderModal } from '../context/OrderModalContext';
import api from '../services/api';
import AshokaChakra from '../components/common/AshokaChakra';
import { SEO } from '../components/common/CommonUI';

const STATUS_BADGES = {
  'Draft': 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  'Submitted': 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
  'Under Review': 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
  'Quotation Sent': 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
  'Approved': 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
  'In Development': 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
  'Completed': 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-800',
  'Cancelled': 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  'Rejected': 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
};

const TRACKING_STAGES = [
  { id: 1, key: 'Submitted', name: 'Requirement Logged & Spec Audit', desc: 'Specifications received & queued for architect review', pct: 15 },
  { id: 2, key: 'Under Review', name: 'Scope & Architecture Review', desc: 'Senior engineers analyzing modules, stack & UI wireframes', pct: 35 },
  { id: 3, key: 'Quotation Sent', name: 'Quotation & Plan Approval', desc: 'Scope finalized & investment tier ready for sign-off', pct: 55 },
  { id: 4, key: 'In Development', name: 'Rapid Development Sprint', desc: 'Liquid glassmorphic UI, responsive layouts & custom logic coding', pct: 80 },
  { id: 5, key: 'Approved', name: 'SEO, Speed Audit & Testing', desc: '98+ Google Lighthouse benchmarking, SSL & DNS configuration', pct: 95 },
  { id: 6, key: 'Completed', name: 'Live Handover & VIP Launch', desc: 'Domain published live with 24/7 dedicated support', pct: 100 },
];

const getStageProgress = (status) => {
  switch (status) {
    case 'Draft': return 10;
    case 'Submitted': return 20;
    case 'Under Review': return 40;
    case 'Quotation Sent': return 60;
    case 'Approved': return 75;
    case 'In Development': return 85;
    case 'Completed': return 100;
    case 'Cancelled': return 0;
    case 'Rejected': return 0;
    default: return 25;
  }
};

const getStageIndex = (status) => {
  switch (status) {
    case 'Draft': return 0;
    case 'Submitted': return 0;
    case 'Under Review': return 1;
    case 'Quotation Sent': return 2;
    case 'Approved': return 3;
    case 'In Development': return 3;
    case 'Completed': return 5;
    case 'Cancelled': return -1;
    case 'Rejected': return -1;
    default: return 0;
  }
};

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { openOrderModal, openCallbackModal } = useOrderModal();

  const [orderIdInput, setOrderIdInput] = useState(
    searchParams.get('id') || searchParams.get('order') || searchParams.get('track') || ''
  );
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userOrders, setUserOrders] = useState([]);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  // Auto fetch user's recent orders if logged in for 1-click buttons
  useEffect(() => {
    if (user?.email) {
      api.get(`/requirements/my?email=${encodeURIComponent(user.email)}`)
        .then((res) => {
          if (res?.success && res.requirements) {
            setUserOrders(res.requirements);
            // If no search param is set, automatically track the latest order
            if (!searchParams.get('id') && !searchParams.get('order') && !searchParams.get('track') && res.requirements.length > 0) {
              const latest = res.requirements[0];
              setOrderIdInput(latest.requirementId);
              fetchOrderDetails(latest.requirementId, false);
            }
          }
        })
        .catch(() => {});
    } else {
      setUserOrders([]);
    }
  }, [user]);

  // Initial load from URL query
  useEffect(() => {
    const urlId = searchParams.get('id') || searchParams.get('order') || searchParams.get('track');
    if (urlId) {
      setOrderIdInput(urlId);
      fetchOrderDetails(urlId, false);
    }
  }, [searchParams]);

  // Live silent background polling every 3 seconds for real-time progress updates
  useEffect(() => {
    if (!trackedOrder?.requirementId) return;

    const pollTimer = setInterval(() => {
      fetchOrderDetails(trackedOrder.requirementId, true);
    }, 3000);

    return () => clearInterval(pollTimer);
  }, [trackedOrder?.requirementId]);

  const fetchOrderDetails = async (idToFetch, silent = false) => {
    const cleanId = String(idToFetch || orderIdInput || '').trim();
    if (!cleanId) return;

    if (!silent) {
      setLoading(true);
      setError('');
    }

    try {
      const res = await api.get(`/requirements/${encodeURIComponent(cleanId)}`);
      if (res?.success && res.requirement) {
        setTrackedOrder(res.requirement);
        setLastSyncTime(new Date());
        // Update URL search query cleanly only when explicit user fetch
        if (!silent) {
          const currentParam = searchParams.get('id') || searchParams.get('order') || searchParams.get('track');
          const targetId = res.requirement.requirementId || cleanId;
          if (currentParam !== targetId) {
            setSearchParams({ id: targetId }, { replace: true });
          }
        }
      } else {
        throw new Error(res?.message || 'Order not found');
      }
    } catch (err) {
      if (!silent) {
        setError(err.data?.message || err.message || `No website project found with ID "${cleanId}". Please check the ID.`);
        setTrackedOrder(null);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleBack = () => {
    try {
      if (window.history.length > 1 && window.history.state?.idx > 0) {
        navigate(-1);
      } else if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (e) {
      navigate('/');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) {
      toast.warning('Please enter your Order ID (e.g. REQ-2026-XXXXX)');
      return;
    }
    fetchOrderDetails(orderIdInput.trim(), false);
  };

  const currentProgress = trackedOrder ? getStageProgress(trackedOrder.status) : 0;
  const currentStageIdx = trackedOrder ? getStageIndex(trackedOrder.status) : 0;

  return (
    <>
      <SEO
        title="Live Order Tracking & Project Roadmap — LOCAL2BRAND"
        description="Track your real-time website project milestones, live sprint progress, architecture reviews, and delivery timeline."
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white relative overflow-x-hidden font-sans transition-colors duration-300">
        
        {/* Ambient Gradient Glow Accents */}
        <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-5 sm:right-10 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-pink-500/10 dark:bg-pink-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* ========================================================================= */}
        {/* 1. STANDALONE FOCUSED HEADER (MOBILE COMPACT & CLEAN)                      */}
        {/* ========================================================================= */}
        <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl sticky top-0 z-50 py-2.5 sm:py-3.5 px-3 sm:px-8 shadow-2xs">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Left: Brand Logo & Back */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0 text-xs font-bold"
                title="Go Back"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <Link to="/" className="flex items-center gap-2 group min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 group-hover:scale-105 transition-transform shrink-0">
                  <img
                    src="/logo.jpg"
                    alt="LOCAL2BRAND Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-xs sm:text-sm">L2B</div>';
                    }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-black text-xs sm:text-sm tracking-tight text-slate-900 dark:text-white truncate">
                    LOCAL<span className="text-purple-600 dark:text-purple-400">2</span>BRAND
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                    Project Tracker
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: Live Connection Pill, Theme, & User Quick Link */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold tracking-wider uppercase shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Real-Time Gateway</span>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white flex items-center justify-center cursor-pointer transition-all"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />}
              </button>

              {user ? (
                <Link
                  to="/dashboard"
                  className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-sm transition-all"
                >
                  Dashboard &rarr;
                </Link>
              ) : (
                <Link
                  to="/get-started"
                  className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-white l2b-gradient-bg shadow-sm transition-all"
                >
                  New Order 🚀
                </Link>
              )}
            </div>

          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. MAIN TRACKING CONTENT CONTAINER (MOBILE OPTIMIZED)                     */}
        {/* ========================================================================= */}
        <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-8 space-y-4 sm:space-y-6">
          
          {/* Top Hero Banner */}
          <div className="text-center space-y-1.5 sm:space-y-2 py-2 sm:py-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800/80 text-purple-700 dark:text-purple-300 text-[10px] sm:text-xs font-bold shadow-2xs">
              <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Universal Project Tracker</span>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Track Your Website Sprint &amp; Milestones
            </h1>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed px-2">
              Enter your Order ID (e.g. <span className="font-mono text-purple-600 dark:text-purple-300 font-bold">REQ-2026-XXXXX</span>) to view live engineering progress, architecture roadmap, and delivery stages.
            </p>
          </div>

          {/* Search Bar Card */}
          <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-glass-lg backdrop-blur-xl space-y-3 sm:space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="Enter Order ID (e.g. REQ-2026-48391)..."
                  className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono font-bold text-purple-700 dark:text-purple-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-sans focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all shrink-0"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
                <span>{loading ? 'Locating Project...' : 'Track Live Sprint'}</span>
              </button>
            </form>

            {/* User's recent orders quick pills */}
            {userOrders.length > 0 && (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap pt-0.5 text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] shrink-0">Your Orders:</span>
                {userOrders.map((ord) => (
                  <button
                    key={ord.requirementId}
                    type="button"
                    onClick={() => {
                      setOrderIdInput(ord.requirementId);
                      fetchOrderDetails(ord.requirementId, false);
                    }}
                    className={`px-2.5 py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-mono font-bold transition-all cursor-pointer border ${
                      trackedOrder?.requirementId === ord.requirementId
                        ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {ord.requirementId} ({ord.clientInfo?.businessName || ord.websiteTypeName || 'Build'})
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span className="break-words">{error}</span>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 3. TRACKED ORDER DETAILS & INTERACTIVE SPRINT ROADMAP                     */}
          {/* ========================================================================= */}
          {trackedOrder ? (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
              
              {/* Main Progress Card */}
              <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-glass-lg backdrop-blur-xl space-y-4 sm:space-y-6">
                
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3.5 sm:pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="font-mono text-[11px] sm:text-xs font-black text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 sm:py-1 rounded-full border border-purple-200 dark:border-purple-800 shadow-2xs">
                        {trackedOrder.requirementId}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(trackedOrder.requirementId);
                          toast.success(`Copied Order ID ${trackedOrder.requirementId}!`);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        title="Copy Order ID"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
                        </span>
                        <span>Auto-Syncing</span>
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight break-words pt-0.5">
                      {trackedOrder.clientInfo?.businessName || trackedOrder.websiteTypeName || 'Custom Website Sprint'}
                    </h2>
                    
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 break-words leading-relaxed">
                      Client: <strong className="text-slate-900 dark:text-slate-200">{trackedOrder.clientInfo?.ownerName || 'Verified Client'}</strong> • Type: <span className="text-purple-600 dark:text-purple-400 font-bold">{trackedOrder.websiteTypeName || trackedOrder.websiteType}</span> • Submitted: {new Date(trackedOrder.createdAt || trackedOrder.submittedAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1.5 shrink-0 pt-1 sm:pt-0">
                    <span className={`px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border shadow-xs transition-all duration-500 ${STATUS_BADGES[trackedOrder.status] || STATUS_BADGES.Submitted}`}>
                      {trackedOrder.status || 'Submitted'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      Sprint: <strong className="text-purple-600 dark:text-purple-400">{trackedOrder.timeline || 'Express (48-72 Hours)'}</strong>
                    </span>
                  </div>
                </div>

                {/* Rejection / Non-Acceptance Notice Banner */}
                {trackedOrder.status === 'Rejected' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 space-y-3">
                    <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-extrabold uppercase text-xs tracking-wider">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Project Requirement Submission Not Accepted</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 shadow-2xs">
                      <strong className="text-rose-700 dark:text-rose-400 block text-[11px] uppercase font-bold mb-1">Architect Review Reason:</strong>
                      <p className="font-semibold leading-relaxed">
                        {trackedOrder.rejectionReason || 'Project parameters could not be approved at this time. Please check your registered email for complete technical feedback from our lead engineer.'}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 text-xs">
                      <span className="text-slate-600 dark:text-slate-400">
                        Check your email for details or submit a fresh specification anytime.
                      </span>
                      <Link
                        to="/get-started"
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-center shadow-xs transition-all cursor-pointer shrink-0"
                      >
                        Submit Revised Project 🚀
                      </Link>
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                      <span>Sprint Roadmap Completion</span>
                    </span>
                    <span className="font-mono text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-extrabold">{currentProgress}% Done</span>
                  </div>
                  <div className="w-full h-3 sm:h-3.5 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 shadow-md transition-all duration-700 ease-out"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>

                {/* 6-Stage Visual Stepper Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                  {TRACKING_STAGES.map((stage, idx) => {
                    const isPast = idx < currentStageIdx;
                    const isCurrent = idx === currentStageIdx;

                    return (
                      <div
                        key={stage.id}
                        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-purple-50/90 dark:bg-purple-950/70 border-purple-300 dark:border-purple-500 shadow-xs sm:scale-[1.02]'
                            : isPast
                            ? 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800'
                            : 'bg-white/40 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-900 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                          <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-black text-[10px] sm:text-xs ${
                            isPast
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-purple-600 text-white animate-pulse'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {isPast ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : stage.id}
                          </span>
                          <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isPast
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : isCurrent
                              ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-700 animate-pulse'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}>
                            {isPast ? 'Done' : isCurrent ? 'Active Phase' : 'Upcoming'}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                          {stage.name}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                          {stage.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Admin / Engineer Status Notes */}
                {trackedOrder.internalNotes && (
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1 animate-in fade-in">
                    <strong className="text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 text-xs font-bold">
                      <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Engineering Team Status Dispatch:</span>
                    </strong>
                    <p className="text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium text-[11px] sm:text-xs">
                      {trackedOrder.internalNotes}
                    </p>
                  </div>
                )}

                {/* Quoted Price if set */}
                {trackedOrder.quotedAmount && (
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase block">
                        Official Quoted Investment
                      </span>
                      <strong className="text-sm sm:text-lg font-black text-emerald-700 dark:text-emerald-300">
                        {trackedOrder.quotedAmount}
                      </strong>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                      Quotation Locked
                    </span>
                  </div>
                )}

                {/* Quick Consultant Communication CTAs */}
                <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => openCallbackModal({ topic: `Status Discussion for Order ${trackedOrder.requirementId}` })}
                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Request a Callback</span>
                  </button>

                  <Link
                    to="/get-started"
                    className="w-full sm:w-auto sm:ml-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Submit Another Project</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-8 sm:p-16 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3 sm:space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400 shadow-md">
                <Compass className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Enter an Order ID to Track</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto px-2">
                  Get real-time milestone updates, design blueprints, and full-stack development sprint status.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/get-started"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-md inline-flex items-center gap-2 hover:opacity-95"
                >
                  <Zap className="w-4 h-4" />
                  <span>Start a New Website Order</span>
                </Link>
              </div>
            </div>
          )}

        </main>

        {/* Minimal Standalone Footer */}
        <footer className="w-full py-4 text-center border-t border-slate-200 dark:border-slate-900 text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>&copy; {new Date().getFullYear()} LOCAL2BRAND Agency. High-Performance Digital Platforms.</span>
            <div className="flex items-center gap-4 text-[11px]">
              <Link to="/contact" className="hover:text-purple-600 dark:hover:text-slate-300">Support</Link>
              <Link to="/pricing" className="hover:text-purple-600 dark:hover:text-slate-300">Pricing</Link>
              <Link to="/get-started" className="hover:text-purple-600 dark:hover:text-slate-300">Get Started</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
