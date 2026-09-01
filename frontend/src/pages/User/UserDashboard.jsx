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
  MessageCircle,
  Copy,
  X
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
  const [viewingReqSpec, setViewingReqSpec] = useState(null);
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
      const emailParam = user?.email ? `?email=${encodeURIComponent(user.email)}` : '';
      const [reqsRes, leadsRes, cbRes, revsRes] = await Promise.all([
        api.get(`/requirements/my${emailParam}`).catch(() => ({ requirements: [] })),
        api.get(`/queries/my${emailParam}`).catch(() => ({ leads: [] })),
        api.get(`/callbacks/my${emailParam}`).catch(() => ({ callbacks: [] })),
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
            onClick={() => setActiveTab('requirements')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-w-0 ${
              activeTab === 'requirements'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 shrink-0" />
            <span className="truncate">My Orders & Specs ({requirements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-w-0 ${
              activeTab === 'track'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
            <span className="truncate">Track Roadmap</span>
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
        {/* TAB 1: ALL WEBSITE ORDERS & SPECIFICATIONS (DEFAULT)     */}
        {/* ======================================================== */}
        {activeTab === 'requirements' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <span>My Website Orders & Submitted Specifications</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  View all requirements, chosen features, live delivery status, and sprint milestones.
                </p>
              </div>

              <button
                onClick={() => openOrderModal()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:opacity-95 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Submit New Order</span>
              </button>
            </div>

            {requirements.length === 0 ? (
              <div className="glass-panel p-8 sm:p-14 rounded-3xl text-center space-y-4 border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 flex items-center justify-center mx-auto text-purple-600 shadow-sm">
                  <Layers className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No active website orders yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Configure your website features, choose design style, select pages, and get instant proposals.
                  </p>
                </div>
                <button
                  onClick={() => openOrderModal()}
                  className="px-6 py-3 rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-md hover:opacity-95 cursor-pointer"
                >
                  🚀 Launch Requirement Form
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {requirements.map((req) => (
                  <div
                    key={req._id || req.requirementId}
                    className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-glass space-y-4 bg-white/90 dark:bg-slate-900/90 hover:border-purple-400 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-black text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                              {req.requirementId}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(req.requirementId);
                                toast.success(`Order ID ${req.requirementId} copied!`);
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                              title="Copy Order ID"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1.5 break-words">
                            {req.clientInfo?.businessName || req.websiteTypeName || 'Custom Website Build'}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{req.websiteTypeName || req.websiteType}</p>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${STATUS_BADGES[req.status] || STATUS_BADGES.Submitted}`}>
                          {req.status || 'Submitted'}
                        </span>
                      </div>

                      {/* Spec Key Metrics */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold">Budget Tier</span>
                          <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{req.budget || 'Standard Commercial'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold">Delivery Speed</span>
                          <strong className="text-slate-900 dark:text-white font-extrabold">{req.timeline || 'Express 48h'}</strong>
                        </div>
                        <div className="mt-1">
                          <span className="text-slate-400 block text-[10px] font-bold">Pages Included</span>
                          <strong className="text-slate-700 dark:text-slate-300 font-extrabold">{req.selectedPages?.length || 0} Pages</strong>
                        </div>
                        <div className="mt-1">
                          <span className="text-slate-400 block text-[10px] font-bold">Admin Engine</span>
                          <strong className="text-purple-600 dark:text-purple-400 font-extrabold truncate block">{req.adminPanelType || 'Dynamic CMS'}</strong>
                        </div>
                      </div>

                      {/* Quoted Price if set by Admin */}
                      {req.quotedAmount && (
                        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400 block">Official Price Quote</span>
                            <span className="font-black text-sm text-emerald-700 dark:text-emerald-300">{req.quotedAmount}</span>
                          </div>
                          <span className="text-[10px] font-black bg-emerald-200/80 dark:bg-emerald-900 px-2 py-0.5 rounded-md text-emerald-800 dark:text-emerald-200">
                            Approved Scope
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-400 font-medium">
                        Submitted: {new Date(req.createdAt).toLocaleDateString()}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingReqSpec(req)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          title="Inspect full answers"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Specs</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setTrackedOrder(req);
                            setTrackSearchId(req.requirementId);
                            setActiveTab('track');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>Track Milestone &rarr;</span>
                        </button>
                      </div>
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

      {/* Client Specs Detail Modal */}
      {viewingReqSpec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl max-h-[88vh] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                    {viewingReqSpec.requirementId}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${STATUS_BADGES[viewingReqSpec.status] || STATUS_BADGES.Submitted}`}>
                    {viewingReqSpec.status || 'Submitted'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                  {viewingReqSpec.clientInfo?.businessName || viewingReqSpec.websiteTypeName}
                </h3>
              </div>

              <button
                onClick={() => setViewingReqSpec(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
              {/* Client Info Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">Client / Owner</span>
                  <strong className="text-slate-900 dark:text-white">{viewingReqSpec.clientInfo?.ownerName || 'Valued Client'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">Contact Mobile</span>
                  <strong className="text-slate-900 dark:text-white">{viewingReqSpec.clientInfo?.mobile || 'Not specified'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">Email Address</span>
                  <strong className="text-slate-900 dark:text-white break-all">{viewingReqSpec.clientInfo?.email || user?.email}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">City / Location</span>
                  <strong className="text-slate-900 dark:text-white">{viewingReqSpec.clientInfo?.city || 'India'}</strong>
                </div>
              </div>

              {/* Scope & Delivery */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                  <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold block">Budget</span>
                  <span className="font-extrabold text-xs text-purple-900 dark:text-purple-200">{viewingReqSpec.budget}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block">Timeline</span>
                  <span className="font-extrabold text-xs text-emerald-900 dark:text-emerald-200">{viewingReqSpec.timeline}</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold block">Pages</span>
                  <span className="font-extrabold text-xs text-blue-900 dark:text-blue-200">{viewingReqSpec.selectedPages?.length || 0} Included</span>
                </div>
                <div className="p-3 rounded-xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800">
                  <span className="text-[10px] text-pink-700 dark:text-pink-300 font-bold block">CMS Type</span>
                  <span className="font-extrabold text-xs text-pink-900 dark:text-pink-200 truncate block">{viewingReqSpec.adminPanelType}</span>
                </div>
              </div>

              {/* Selected Pages */}
              {viewingReqSpec.selectedPages?.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Selected Pages:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingReqSpec.selectedPages.map((p, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Features */}
              {viewingReqSpec.selectedFeatures?.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Selected Features:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingReqSpec.selectedFeatures.map((f, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-bold border border-purple-200 dark:border-purple-800">
                        ✨ {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              {viewingReqSpec.paymentMethods?.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Payment Integration:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingReqSpec.paymentMethods.map((pm, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                        💳 {pm}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Step Questions & Answers (if present) */}
              {viewingReqSpec.answers && Object.keys(viewingReqSpec.answers).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Specification Answers:</h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    {Object.entries(viewingReqSpec.answers).map(([k, val]) => (
                      <div key={k} className="text-[11px] pb-1 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                        <span className="text-slate-400 capitalize font-medium">{k.replace(/([A-Z])/g, ' $1')}: </span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {Array.isArray(val) ? val.join(', ') : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Images Gallery */}
              {(viewingReqSpec.images?.length > 0 || viewingReqSpec.uploadedImages?.length > 0) && (
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Attached Assets & References:</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {(viewingReqSpec.images || viewingReqSpec.uploadedImages || []).map((img, i) => (
                      <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video hover:opacity-90">
                        <img src={img} alt={`Asset ${i}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi LOCAL2BRAND, I want to discuss specs for Order ${viewingReqSpec.requirementId} (${viewingReqSpec.clientInfo?.businessName || ''}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Consultant</span>
              </a>

              <button
                onClick={() => {
                  const req = viewingReqSpec;
                  setViewingReqSpec(null);
                  setTrackedOrder(req);
                  setTrackSearchId(req.requirementId);
                  setActiveTab('track');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Open Live Roadmap &rarr;</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
