import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Building,
  Upload,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  PhoneCall,
  Sparkles,
  Zap,
  ArrowRight,
  LogOut,
  Shield,
  Layers,
  Check,
  CreditCard,
  Globe,
  ExternalLink,
  Star,
  MessageSquarePlus,
  Edit3,
  Trash2,
  Search,
  CheckCheck,
  Compass,
  Code2,
  Lock,
  MessageCircle
} from 'lucide-react';
import WriteReviewModal from '../../components/common/WriteReviewModal';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useOrderModal } from '../../context/OrderModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';
import DashboardLoader from '../../components/common/DashboardLoader';
import { SEO } from '../../components/common/CommonUI';

const STATUS_BADGES = {
  'Draft': 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300',
  'Submitted': 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300',
  'Under Review': 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300',
  'Quotation Sent': 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300',
  'Approved': 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300',
  'In Development': 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300',
  'Completed': 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-300',
  'Cancelled': 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300'
};

const TRACKING_STAGES = [
  { id: 1, key: 'Submitted', name: 'Requirement Logged', desc: 'Specifications received & queued for architect review', pct: 15 },
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
    default: return 0;
  }
};

export default function UserDashboard() {
  const [searchParams] = useSearchParams();
  const { user, logout, updateProfile, loading: authLoading, openAuthModal, isAdmin } = useAuth();
  const { openOrderModal, openCallbackModal } = useOrderModal();
  const { settings } = useSiteSettings();

  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('track') ? 'track' : 'requirements';
  });

  const [requirements, setRequirements] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [callbacks, setCallbacks] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track Order state
  const [trackSearchId, setTrackSearchId] = useState(() => searchParams.get('track') || '');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  // Profile form state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileCompany, setProfileCompany] = useState(user?.company || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileCompany(user.company || '');
      setAvatarUrl(user.avatar || '');
      fetchUserData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  // Handle URL track query parameter
  useEffect(() => {
    const urlTrackId = searchParams.get('track');
    if (urlTrackId) {
      setTrackSearchId(urlTrackId);
      setActiveTab('track');
      performTrackOrder(urlTrackId);
    }
  }, [searchParams]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [reqsRes, leadsRes, cbRes, revsRes] = await Promise.all([
        api.get('/requirements/my').catch(() => ({ requirements: [] })),
        api.get('/queries/my').catch(() => ({ leads: [] })),
        api.get('/callbacks/my').catch(() => ({ callbacks: [] })),
        api.get('/reviews/my').catch(() => ({ reviews: [] })),
      ]);

      const reqList = reqsRes?.requirements || [];
      if (reqsRes && reqsRes.success) setRequirements(reqList);
      if (leadsRes && leadsRes.success) setInquiries(leadsRes.leads || []);
      if (cbRes && cbRes.success) setCallbacks(cbRes.callbacks || []);
      if (revsRes && revsRes.success) setUserReviews(revsRes.reviews || []);

      // If tracking was opened without specific order, default to the latest requirement
      if (!trackedOrder && reqList.length > 0 && !searchParams.get('track')) {
        setTrackedOrder(reqList[0]);
      }
    } catch (err) {
      console.warn('Dashboard data fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const performTrackOrder = async (idToSearch) => {
    const id = (idToSearch || trackSearchId).trim();
    if (!id) {
      toast.warning('Please enter a Requirement / Order ID (e.g. REQ-2026-XXXXX)');
      return;
    }

    setTrackLoading(true);
    setTrackError('');

    try {
      // First check in already loaded requirements
      const localMatch = requirements.find(
        (r) => r.requirementId?.toLowerCase() === id.toLowerCase() || r._id?.toString() === id
      );

      if (localMatch) {
        setTrackedOrder(localMatch);
        setTrackLoading(false);
        return;
      }

      // Fetch from API
      const res = await api.get(`/requirements/${id}`);
      if (res?.success && res.requirement) {
        setTrackedOrder(res.requirement);
        toast.success(`Order ${res.requirement.requirementId || id} loaded! 📦`);
      } else {
        throw new Error(res?.message || 'Order ID not found');
      }
    } catch (err) {
      setTrackError(err.data?.message || err.message || `Could not find order "${id}". Please verify your Order ID.`);
      setTrackedOrder(null);
    } finally {
      setTrackLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await api.delete(`/reviews/${reviewId}`);
      if (res && res.success) {
        toast.success('Review removed successfully');
        setUserReviews((prev) => prev.filter((r) => r._id !== reviewId));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be under 10MB');
      return;
    }

    setUploadingAvatar(true);
    const toastId = toast.loading('Uploading and optimizing avatar... ⏳');

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setAvatarUrl(uploadEvent.target.result);
      }
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('file', file);

      const uploadRes = await api.post('/upload', formData);
      if (uploadRes && uploadRes.success && uploadRes.url) {
        setAvatarUrl(uploadRes.url);
        await updateProfile({ avatar: uploadRes.url });
        setSaveSuccess(true);
        toast.update(toastId, {
          render: 'Avatar updated successfully! 📸',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        });
      }
    } catch (uploadErr) {
      toast.update(toastId, {
        render: 'Upload failed: ' + uploadErr.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
        company: profileCompany.trim(),
        avatar: avatarUrl
      });
      setSaveSuccess(true);
      toast.success('Profile updated successfully! 🚀');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  if (authLoading || (loading && !user)) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center">
        <DashboardLoader
          title="Loading Client Workspace..."
          role="client"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-44 pb-20 max-w-md mx-auto px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 border border-purple-200 dark:border-purple-800 flex items-center justify-center mx-auto shadow-md">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Sign In to Client Portal</h2>
          <p className="text-xs text-slate-500">
            Please log in to track your website orders, review quotations, and view sprint roadmaps.
          </p>
        </div>
        <button
          onClick={() => openAuthModal()}
          className="w-full py-3.5 rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Log In / Create Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const currentTrackProgress = trackedOrder ? getStageProgress(trackedOrder.status) : 0;
  const currentStageIdx = trackedOrder ? getStageIndex(trackedOrder.status) : 0;

  return (
    <>
      <SEO title="Client Portal & Track Orders — LOCAL2BRAND" description="Manage your website specifications, track project milestones in realtime, and view progress." />

      <div className="page-header-offset pb-20 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-x-hidden">
        
        {/* Admin Switcher Notice Bar */}
        {(isAdmin || user?.role === 'admin') && (
          <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-amber-900 dark:text-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs w-full">
            <div className="flex items-center gap-2.5 text-xs font-bold text-center sm:text-left">
              <Shield className="w-4 h-4 text-amber-500 shrink-0" />
              <span>You are viewing the Client Portal with Master Admin privileges.</span>
            </div>
            <a
              href="/admin"
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <span>⚡ Open Master Admin Panel</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Welcome Top Banner */}
        <div className="glass-panel p-4 sm:p-7 rounded-3xl border border-white dark:border-slate-800 shadow-glass mb-6 flex flex-col md:flex-row items-center md:items-center justify-between gap-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl w-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 w-full md:w-auto min-w-0">
            <div className="relative group shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md border-2 border-white dark:border-slate-700 relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${uploadingAvatar ? 'opacity-40 scale-105' : 'opacity-100 scale-100'}`}
                  />
                ) : (
                  user?.name?.[0]?.toUpperCase() || 'U'
                )}

                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 p-1">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-[8px] sm:text-[9px] font-black text-white uppercase tracking-wider text-center">Uploading...</span>
                  </div>
                )}
              </div>

              <label
                className={`absolute -bottom-1 -right-1 p-1.5 rounded-full text-white shadow-md transition-all ${
                  uploadingAvatar
                    ? 'bg-purple-600 cursor-wait animate-pulse'
                    : 'bg-slate-900 hover:bg-purple-600 cursor-pointer'
                }`}
                title="Upload Photo"
              >
                {uploadingAvatar ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-500/40">
                <AshokaChakra size={11} />
                <span>Verified Client Console</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                Welcome, {user?.name || 'Client'}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                {user?.email} • {user?.company || 'Local Business'}
              </p>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => openOrderModal({ websiteType: 'New Project Proposal' })}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
            >
              <Zap className="w-4 h-4" />
              <span>Start New Website</span>
            </button>

            <button
              onClick={() => openCallbackModal()}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
              <span>Request Callback</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Segmented Bar (5-Column Clean Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 sm:gap-2 mb-6 p-1 sm:p-1.5 bg-slate-200/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 w-full">
          <button
            onClick={() => setActiveTab('track')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-w-0 ${
              activeTab === 'track'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
            <span className="truncate">Track Order</span>
          </button>

          <button
            onClick={() => setActiveTab('requirements')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-w-0 ${
              activeTab === 'requirements'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 shrink-0" />
            <span className="truncate">Specs ({requirements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-w-0 ${
              activeTab === 'reviews'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
            <span className="truncate">Reviews ({userReviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('callbacks')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-w-0 ${
              activeTab === 'callbacks'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
            <span className="truncate">Calls ({callbacks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-w-0 ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500 shrink-0" />
            <span className="truncate">Settings</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB: TRACK ORDER & LIVE ROADMAP PROGRESS                 */}
        {/* ======================================================== */}
        {activeTab === 'track' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search / Select Order Bar */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass bg-white/80 dark:bg-slate-900/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-purple-600" />
                    <span>Real-Time Project Roadmap &amp; Order Tracker</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter your Order ID (e.g., REQ-2026-98214) or select a project from your registered submissions.
                  </p>
                </div>

                {requirements.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">My Orders:</span>
                    <select
                      value={trackedOrder?.requirementId || ''}
                      onChange={(e) => {
                        const selected = requirements.find((r) => r.requirementId === e.target.value);
                        if (selected) {
                          setTrackedOrder(selected);
                          setTrackSearchId(selected.requirementId);
                          setTrackError('');
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-purple-700 dark:text-purple-300 focus:outline-purple-500 cursor-pointer"
                    >
                      {requirements.map((r) => (
                        <option key={r.requirementId || r._id} value={r.requirementId}>
                          {r.requirementId} — {r.clientInfo?.businessName || r.websiteTypeName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Live Search Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  performTrackOrder();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={trackSearchId}
                    onChange={(e) => setTrackSearchId(e.target.value)}
                    placeholder="Enter Order / Requirement ID (e.g. REQ-2026-98214)..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono font-bold text-purple-700 dark:text-purple-300 placeholder:font-sans placeholder-slate-400 focus:outline-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={trackLoading}
                  className="px-6 py-3 rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {trackLoading ? 'Locating...' : 'Track Sprint'}
                </button>
              </form>

              {trackError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{trackError}</span>
                </div>
              )}
            </div>

            {/* Display Tracked Order Details */}
            {trackedOrder ? (
              <div className="space-y-6">
                
                {/* 1. Milestone Roadmap Progress Card */}
                <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass bg-white/80 dark:bg-slate-900/80 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="font-mono text-xs font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                        {trackedOrder.requirementId}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                        {trackedOrder.clientInfo?.businessName || trackedOrder.websiteTypeName}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {trackedOrder.websiteTypeName || trackedOrder.websiteType} • Submitted on {new Date(trackedOrder.createdAt || trackedOrder.submittedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1.5">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${STATUS_BADGES[trackedOrder.status] || STATUS_BADGES.Submitted}`}>
                        {trackedOrder.status || 'Submitted'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        Target Delivery: <strong className="text-purple-600 dark:text-purple-400">{trackedOrder.timeline || '48 Hours'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-300">Sprint Roadmap Completion</span>
                      <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">{currentTrackProgress}% Complete</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 shadow-md transition-all duration-700"
                        style={{ width: `${currentTrackProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* 6-Stage Stepper Roadmap */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                    {TRACKING_STAGES.map((stage, idx) => {
                      const isPast = idx < currentStageIdx;
                      const isCurrent = idx === currentStageIdx;
                      const isFuture = idx > currentStageIdx;

                      return (
                        <div
                          key={stage.id}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isCurrent
                              ? 'bg-purple-50/90 dark:bg-purple-950/60 border-purple-400 dark:border-purple-600 shadow-sm scale-[1.02]'
                              : isPast
                              ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80'
                              : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                              isPast
                                ? 'bg-emerald-500 text-white'
                                : isCurrent
                                ? 'bg-purple-600 text-white animate-pulse'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                            }`}>
                              {isPast ? <Check className="w-3.5 h-3.5" /> : stage.id}
                            </span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isPast
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : isCurrent
                                ? 'bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 animate-pulse'
                                : 'text-slate-400'
                            }`}>
                              {isPast ? 'Done' : isCurrent ? 'Active Phase' : 'Upcoming'}
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                            {stage.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                            {stage.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Engineer Notes if available */}
                  {trackedOrder.internalNotes && (
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1">
                      <strong className="text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span>Engineering Team Status Note:</span>
                      </strong>
                      <p className="text-indigo-950 dark:text-indigo-300 leading-relaxed font-medium">
                        {trackedOrder.internalNotes}
                      </p>
                    </div>
                  )}

                  {/* Quoted Price if set */}
                  {trackedOrder.quotedAmount && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">
                          Official Quoted Investment
                        </span>
                        <strong className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-300">
                          {trackedOrder.quotedAmount}
                        </strong>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                        Quotation Locked
                      </span>
                    </div>
                  )}

                  {/* Quick Consultant Communication CTAs */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi LOCAL2BRAND, I want a live status update on my project Order ${trackedOrder.requirementId} (${trackedOrder.clientInfo?.businessName || ''}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Live Update</span>
                    </a>

                    <button
                      onClick={() => openCallbackModal({ topic: `Status Discussion for Order ${trackedOrder.requirementId}` })}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <PhoneCall className="w-4 h-4 text-purple-600" />
                      <span>Request Founder Call</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="glass-panel p-12 rounded-3xl text-center space-y-3 border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
                <Compass className="w-12 h-12 text-purple-400 mx-auto animate-pulse" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No project order selected for tracking</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Submit your custom website requirements via the Get Started form or enter an Order ID above to see live sprint milestones.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL WEBSITE SPECIFICATIONS */}
        {activeTab === 'requirements' && (
          <div className="space-y-4">
            {requirements.length === 0 ? (
              <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-4 border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
                <Layers className="w-12 h-12 text-purple-500 mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No website specifications yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Submit your custom website requirements, pick features, select turnaround time & get instant proposals.
                </p>
                <button
                  onClick={() => openOrderModal()}
                  className="px-6 py-3 rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-md cursor-pointer"
                >
                  Launch Requirement Wizard
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {requirements.map((req) => (
                  <div
                    key={req._id}
                    className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass space-y-4 bg-white/80 dark:bg-slate-900/80 hover:border-purple-400 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400 block">
                          {req.requirementId}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 break-words">
                          {req.clientInfo?.businessName || req.websiteTypeName}
                        </h3>
                        <p className="text-xs text-slate-500">{req.websiteTypeName || req.websiteType}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${STATUS_BADGES[req.status] || STATUS_BADGES.Submitted}`}>
                        {req.status || 'Submitted'}
                      </span>
                    </div>

                    {/* Spec Key Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Budget</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{req.budget}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Delivery Speed</span>
                        <strong className="text-slate-900 dark:text-white">{req.timeline}</strong>
                      </div>
                      <div className="mt-1">
                        <span className="text-slate-400 block text-[10px]">Pages</span>
                        <strong className="text-slate-700 dark:text-slate-300">{req.selectedPages?.length || 0} Pages</strong>
                      </div>
                      <div className="mt-1">
                        <span className="text-slate-400 block text-[10px]">Admin Panel</span>
                        <strong className="text-purple-600 dark:text-purple-400">{req.adminPanelType}</strong>
                      </div>
                    </div>

                    {/* Quoted Price if set by Admin */}
                    {req.quotedAmount && (
                      <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300">Official Quoted Price:</span>
                        <span className="font-black text-sm text-emerald-700 dark:text-emerald-300">{req.quotedAmount}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-[11px] text-slate-400">
                        Submitted: {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => {
                          setTrackedOrder(req);
                          setTrackSearchId(req.requirementId);
                          setActiveTab('track');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 hover:bg-purple-100 flex items-center gap-1 cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Track Order &rarr;</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: CLIENT REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-5">
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass bg-white/80 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>My Reviews & Feedback</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Share your verified experience with our high-speed website delivery, design, or lead generation.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingReview(null);
                  setIsReviewModalOpen(true);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write New Review</span>
              </button>
            </div>

            {userReviews.length === 0 ? (
              <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-4 border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 flex items-center justify-center mx-auto text-amber-500 shadow-sm">
                  <Star className="w-7 h-7 fill-amber-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No reviews submitted yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Tell us how your website project went! Your review will be featured on our homepage and helps other ambitious brands.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingReview(null);
                    setIsReviewModalOpen(true);
                  }}
                  className="px-6 py-3 rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Submit Your First Review</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userReviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass bg-white/80 dark:bg-slate-900/80 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                            {rev.rating || 5}.0
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            rev.status === 'approved'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                              : rev.status === 'rejected'
                              ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                              : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                          }`}
                        >
                          {rev.status === 'approved' ? '✓ Published Live' : rev.status === 'rejected' ? 'Rejected' : 'Under Review'}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {rev.projectTitle || rev.businessName || 'Website Delivery'}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        "{rev.reviewText}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingReview(rev);
                            setIsReviewModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors"
                          title="Edit review"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: CALLBACK REQUESTS */}
        {activeTab === 'callbacks' && (
          <div className="space-y-5">
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass bg-white/80 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-emerald-500" />
                  <span>Founder Callback Queue</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Queue of consultation calls scheduled with our senior engineering desk.
                </p>
              </div>

              <button
                onClick={() => openCallbackModal()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Request New Call</span>
              </button>
            </div>

            {callbacks.length === 0 ? (
              <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-4 border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
                <PhoneCall className="w-12 h-12 text-emerald-500 mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No callback requests pending</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Need direct advice on packages, custom pricing, or 48-hour delivery? Request a 15-minute consultation callback.
                </p>
                <button
                  onClick={() => openCallbackModal()}
                  className="px-6 py-3 rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Request Instant Callback</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {callbacks.map((cb) => (
                  <div
                    key={cb._id}
                    className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass bg-white/80 dark:bg-slate-900/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">{cb.name}</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        {cb.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <div><strong>Phone:</strong> {cb.phone}</div>
                      <div><strong>Time Slot:</strong> {cb.preferredTime}</div>
                      <div><strong>Topic:</strong> {cb.topic}</div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                      Requested on: {new Date(cb.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: PROFILE & ACCOUNT SETTINGS */}
        {activeTab === 'profile' && (
          <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass bg-white/80 dark:bg-slate-900/80 max-w-xl mx-auto space-y-5">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                <span>Account Profile & Credentials</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your verified client information and branding settings.
              </p>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address (Login ID)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  placeholder="e.g. Royal Bengal Sweets"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-md hover:opacity-95 cursor-pointer"
                >
                  Save Profile Changes
                </button>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <WriteReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setEditingReview(null);
          }}
          editingReview={editingReview}
          onSuccess={() => {
            fetchUserData();
            setIsReviewModalOpen(false);
            setEditingReview(null);
          }}
        />
      )}
    </>
  );
}
