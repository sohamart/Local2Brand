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
  Gift,
  X
} from 'lucide-react';

import WriteReviewModal from '../../components/common/WriteReviewModal';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useOrderModal } from '../../context/OrderModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import api from '../../services/api';
import { uploadWithToast } from '../../utils/toastUpload';
import AshokaChakra from '../../components/common/AshokaChakra';
import DashboardLoader from '../../components/common/DashboardLoader';
import MarqueeTicker from '../../components/common/MarqueeTicker';
import { SEO } from '../../components/common/CommonUI';


const STATUS_BADGES = {
  'Draft': 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300',
  'Submitted': 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300',
  'Under Review': 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300',
  'Quotation Sent': 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300',
  'Approved': 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300',
  'In Development': 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300',
  'Completed': 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-300',
  'Cancelled': 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300',
  'Rejected': 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300'
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

export default function UserDashboard() {
  const [searchParams] = useSearchParams();
  const { user, logout, updateProfile, loading: authLoading, openAuthModal, isAdmin } = useAuth();
  const { openOrderModal, openCallbackModal } = useOrderModal();
  const { settings } = useSiteSettings();

  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('track') ? 'track' : 'requirements';
  });

  const [submissionFilter, setSubmissionFilter] = useState('all'); // 'all' | 'requirements' | 'inquiries'
  const [requirements, setRequirements] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [callbacks, setCallbacks] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [viewingReqSpec, setViewingReqSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  // OTP Verification State
  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);
  const { updateUserSession } = useAuth();

  // Won Lucky Wheel Voucher
  const [dashboardVoucher, setDashboardVoucher] = useState(() => {
    try {
      const v = localStorage.getItem('l2b_won_voucher');
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  });
  const [voucherCopied, setVoucherCopied] = useState(false);
  const [dismissedRejectBanner, setDismissedRejectBanner] = useState(false);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer;
    if (otpResendCooldown > 0) {
      timer = setInterval(() => {
        setOtpResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpResendCooldown]);

  const handleSendVerificationOtp = async () => {
    if (!user?.email) return;
    setIsSendingOtp(true);
    try {
      const res = await api.post('/auth/send-otp', { email: user.email });
      if (res.success) {
        toast.success(res.message || 'Verification code sent to your email!');
        setOtpResendCooldown(60);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch verification code');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      toast.warn('Please enter the 6-digit verification code');
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const res = await api.post('/auth/verify-otp', {
        otp: otpCode.trim(),
        email: user?.email,
      });
      if (res.success && res.user) {
        toast.success('🎉 Email verified successfully! Your account is fully active.');
        updateUserSession({ isEmailVerified: true });
        setOtpCode('');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP code');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileCompany(user.company || '');
      setAvatarUrl(user.avatar || '');
      fetchUserData(false);

      // Real-time silent live background auto-poll every 5s
      const pollTimer = setInterval(() => {
        fetchUserData(true);
      }, 5000);
      return () => clearInterval(pollTimer);
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

  const fetchUserData = async (silent = false) => {
    if (!silent) setLoading(true);
    setIsRefreshing(true);
    try {
      const emailParam = user?.email ? `?email=${encodeURIComponent(user.email)}` : '';
      const [reqsRes, leadsRes, cbRes, revsRes] = await Promise.all([
        api.get(`/requirements/my${emailParam}`).catch(() => ({ requirements: [] })),
        api.get(`/queries/my${emailParam}`).catch(() => ({ leads: [] })),
        api.get(`/callbacks/my${emailParam}`).catch(() => ({ callbacks: [] })),
        api.get('/reviews/my').catch(() => ({ reviews: [] })),
      ]);

      let reqList = reqsRes?.requirements || [];
      const leadList = leadsRes?.leads || [];

      setRequirements(reqList);
      if (leadsRes && leadsRes.success) setInquiries(leadList);
      if (cbRes && cbRes.success) setCallbacks(cbRes.callbacks || []);
      if (revsRes && revsRes.success) setUserReviews(revsRes.reviews || []);
      setLastSyncTime(new Date());

      // Live update the currently tracked order smoothly if present
      if (trackedOrder) {
        const liveMatch = reqList.find(
          (r) => r.requirementId === trackedOrder.requirementId || r._id === trackedOrder._id
        );
        if (liveMatch) {
          setTrackedOrder(liveMatch);
        } else {
          const leadMatch = leadList.find(
            (l) => l._id === trackedOrder._id || (l.leadId && l.leadId === trackedOrder.requirementId)
          );
          if (leadMatch) {
            setTrackedOrder({
              requirementId: leadMatch.leadId || `ORD-${leadMatch._id?.slice(-6).toUpperCase()}`,
              websiteTypeName: leadMatch.websiteType || 'Custom Project',
              websiteType: leadMatch.websiteType || 'Custom Project',
              clientInfo: {
                businessName: leadMatch.businessName || leadMatch.name,
                ownerName: leadMatch.name,
                mobile: leadMatch.phone,
                email: leadMatch.email,
              },
              status: leadMatch.status === 'in_progress' ? 'In Development' : leadMatch.status === 'contacted' ? 'Under Review' : leadMatch.status === 'completed' ? 'Completed' : 'Submitted',
              budget: leadMatch.budget || 'Standard Commercial',
              timeline: leadMatch.timeline || 'Express 48 Hours',
              createdAt: leadMatch.createdAt,
            });
            if (!trackSearchId) setTrackSearchId(leadMatch.leadId || `ORD-${leadMatch._id?.slice(-6).toUpperCase()}`);
          }
        }
      } else if (reqList.length > 0) {
        const urlTrackId = searchParams.get('track');
        const match = urlTrackId
          ? reqList.find((r) => r.requirementId?.toLowerCase() === urlTrackId.toLowerCase() || r._id === urlTrackId) || reqList[0]
          : reqList[0];
        setTrackedOrder(match);
        if (!trackSearchId) setTrackSearchId(match.requirementId);
      } else if (leadList.length > 0) {
        const lead = leadList[0];
        setTrackedOrder({
          requirementId: lead.leadId || `ORD-${lead._id?.slice(-6).toUpperCase()}`,
          websiteTypeName: lead.websiteType || 'Custom Project',
          websiteType: lead.websiteType || 'Custom Project',
          clientInfo: {
            businessName: lead.businessName || lead.name,
            ownerName: lead.name,
            mobile: lead.phone,
            email: lead.email,
          },
          status: lead.status === 'in_progress' ? 'In Development' : lead.status === 'contacted' ? 'Under Review' : lead.status === 'completed' ? 'Completed' : 'Submitted',
          budget: lead.budget || 'Standard Commercial',
          timeline: lead.timeline || 'Express 48 Hours',
          createdAt: lead.createdAt,
        });
        if (!trackSearchId) setTrackSearchId(lead.leadId || `ORD-${lead._id?.slice(-6).toUpperCase()}`);
      }
    } catch (err) {
      console.error('Error fetching user data from DB:', err);
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
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
      // 1. Check in already loaded requirements
      const localMatch = requirements.find(
        (r) => r.requirementId?.toLowerCase() === id.toLowerCase() || r._id?.toString() === id
      );

      if (localMatch) {
        setTrackedOrder(localMatch);
        setTrackLoading(false);
        return;
      }

      // 2. Check in loaded inquiries
      const localLeadMatch = inquiries.find(
        (l) => l._id?.toString() === id || (l.leadId && l.leadId.toLowerCase() === id.toLowerCase())
      );

      if (localLeadMatch) {
        setTrackedOrder({
          requirementId: localLeadMatch.leadId || `ORD-${localLeadMatch._id?.slice(-6).toUpperCase()}`,
          websiteTypeName: localLeadMatch.websiteType || 'Custom Project',
          websiteType: localLeadMatch.websiteType || 'Custom Project',
          clientInfo: {
            businessName: localLeadMatch.businessName || localLeadMatch.name,
            ownerName: localLeadMatch.name,
            mobile: localLeadMatch.phone,
            email: localLeadMatch.email,
          },
          status: localLeadMatch.status === 'in_progress' ? 'In Development' : localLeadMatch.status === 'contacted' ? 'Under Review' : localLeadMatch.status === 'completed' ? 'Completed' : 'Submitted',
          budget: localLeadMatch.budget || 'Standard Commercial',
          timeline: localLeadMatch.timeline || 'Express 48 Hours',
          createdAt: localLeadMatch.createdAt,
        });
        setTrackLoading(false);
        return;
      }

      // 3. Fetch from API (/requirements/:id)
      const res = await api.get(`/requirements/${encodeURIComponent(id)}`);
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

    setUploadingAvatar(true);
    try {
      const uploadRes = await uploadWithToast({
        file,
        title: 'Uploading Avatar...',
        successMessage: 'Avatar uploaded and updated! 📸',
      });

      const finalUrl = uploadRes?.url || uploadRes?.urls?.[0];
      if (finalUrl) {
        setAvatarUrl(finalUrl);
        await updateProfile({ avatar: finalUrl });
        setSaveSuccess(true);
      }
    } catch (uploadErr) {
      console.error('Avatar upload error:', uploadErr);
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

  if (authLoading || (loading && requirements.length === 0)) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center">
        <DashboardLoader
          title="Fetching your orders & specifications from database..."
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
        {/* Important Updates & Live Sliding Marquee Ticker */}
        <MarqueeTicker className="rounded-2xl mb-6 shadow-sm" />

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
                    onError={(e) => {
                      setAvatarUrl('');
                    }}
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
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-500/40">
                  <AshokaChakra size={11} />
                  <span>Client Console</span>
                </div>

                {user?.isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-600/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Email Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/70 px-2.5 py-0.5 rounded-full border border-rose-300 dark:border-rose-600/40">
                    <AlertCircle className="w-3 h-3 text-rose-500 animate-pulse" />
                    <span>Email Unverified</span>
                  </span>
                )}
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
              onClick={() => openOrderModal()}
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

        {/* Email Verification Required Alert Card */}
        {user && !user.isEmailVerified && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50/95 via-rose-50/95 to-purple-50/95 dark:from-[#1c1208] dark:via-[#1c0a15] dark:to-[#140824] border-2 border-amber-400/60 dark:border-amber-500/40 shadow-glass mb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-2xs">
                      ACTION REQUIRED
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                      Verify Your Email Address
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                    We sent a 6-digit OTP code to <strong className="text-purple-600 dark:text-purple-400 font-mono">{user.email}</strong> when you registered. Enter it below to unlock instant roadmap dispatches.
                  </p>
                </div>
              </div>

              {/* OTP Form Controls */}
              <form onSubmit={handleVerifyOtp} className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-Digit OTP"
                  className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-600 text-sm font-mono font-bold tracking-widest text-center w-36 focus:outline-purple-500 text-slate-900 dark:text-white shadow-xs"
                />

                <button
                  type="submit"
                  disabled={isVerifyingOtp || otpCode.length < 6}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:opacity-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
                >
                  {isVerifyingOtp ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Code</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendVerificationOtp}
                  disabled={isSendingOtp || otpResendCooldown > 0}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 cursor-pointer transition-all shrink-0"
                >
                  {isSendingOtp
                    ? 'Sending...'
                    : otpResendCooldown > 0
                    ? `Resend in ${otpResendCooldown}s`
                    : 'Resend OTP ✉️'}
                </button>
              </form>
            </div>
          </div>
        )}


        {/* Active Lucky Wheel Reward Banner */}
        {dashboardVoucher && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-amber-500/15 border-2 border-purple-400/50 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Gift className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                    🎉 Active Lucky Wheel Reward
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {dashboardVoucher.label}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Use coupon code <strong className="font-mono text-purple-600 dark:text-purple-400 font-black tracking-wider">{dashboardVoucher.code}</strong> for {dashboardVoucher.discountPercent || 20}% OFF your next custom website build!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={async () => {
                  try {
                    if (navigator.clipboard) {
                      await navigator.clipboard.writeText(dashboardVoucher.code);
                    }
                  } catch (e) {}
                  setVoucherCopied(true);
                  toast.info(`Copied "${dashboardVoucher.code}" to clipboard!`);
                  setTimeout(() => setVoucherCopied(false), 2500);
                }}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                {voucherCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{voucherCopied ? 'Copied' : 'Copy Code'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  openOrderModal({
                    promoCode: dashboardVoucher.code,
                    discountPercent: dashboardVoucher.discountPercent || 20,
                    autoApplyOffer: true,
                    initialRequirements: `I won the Lucky Wheel reward "${dashboardVoucher.label}" with promo code "${dashboardVoucher.code}". Please apply this discount to my website project!`,
                  });
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-black text-white l2b-gradient-bg shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Apply &amp; Start Project</span>
              </button>
            </div>
          </div>
        )}

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
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-600" />
                    <span>My Website Orders & Submitted Specifications</span>
                  </h2>
                  {isRefreshing && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 border border-purple-300/80 dark:border-purple-800 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin text-purple-600" />
                      <span>Syncing with Database...</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  View all requirements, chosen features, live delivery status, and sprint milestones directly from MongoDB.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => fetchUserData(false)}
                  disabled={isRefreshing}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                  title="Refresh Data from Database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-600' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={() => openOrderModal()}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Submit New Order</span>
                </button>
              </div>
            </div>

            {/* Sub-Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap pb-1">
              <button
                type="button"
                onClick={() => setSubmissionFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  submissionFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Submissions ({requirements.length + inquiries.length})
              </button>
              <button
                type="button"
                onClick={() => setSubmissionFilter('requirements')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  submissionFilter === 'requirements'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Website Specifications ({requirements.length})
              </button>
              <button
                type="button"
                onClick={() => setSubmissionFilter('inquiries')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  submissionFilter === 'inquiries'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Proposal Inquiries ({inquiries.length})
              </button>
            </div>

            {/* Non-Accepted / Rejected / Cancelled Orders Notification Banner - Specific Project Clarity */}
            {(() => {
              const rejectedList = requirements.filter((r) => r.status === 'Rejected' || r.status === 'Cancelled' || r.isDeleted);
              if (rejectedList.length === 0 || dismissedRejectBanner) return null;

              return (
                <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/70 border border-rose-300/80 dark:border-rose-800 shadow-sm relative overflow-hidden space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/80 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-rose-900 dark:text-rose-200">
                            {rejectedList.length === 1
                              ? `Project Submission #${rejectedList[0].requirementId} was Not Accepted`
                              : `${rejectedList.length} Specific Project Submissions were Not Accepted`}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-200/80 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200">
                            Revision Available
                          </span>
                        </div>
                        <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                          Only specific order{' '}
                          <strong className="underline font-mono">
                            {rejectedList.map((r) => `#${r.requirementId} (${r.clientInfo?.businessName || r.websiteTypeName || 'Project'})`).join(', ')}
                          </strong>{' '}
                          was not approved. {requirements.length > rejectedList.length && (
                            <span className="font-semibold text-emerald-700 dark:text-emerald-300 ml-1">
                              Your other {requirements.length - rejectedList.length} active project(s) remain completely unaffected.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openOrderModal()}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-xs cursor-pointer transition-all"
                      >
                        Revise Project
                      </button>
                      <button
                        onClick={() => setDismissedRejectBanner(true)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all cursor-pointer"
                        title="Dismiss notification"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Cards of Specific Rejected Orders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-rose-200/70 dark:border-rose-900/60">
                    {rejectedList.map((r) => (
                      <div
                        key={r._id || r.requirementId}
                        className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/80 flex items-center justify-between text-xs gap-2"
                      >
                        <div className="min-w-0">
                          <span className="font-mono font-bold text-rose-700 dark:text-rose-400 block truncate">
                            #{r.requirementId}
                          </span>
                          <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate block">
                            {r.clientInfo?.businessName || r.websiteTypeName || 'Custom Project'}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setViewingReqSpec(r);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-[11px] font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shrink-0 cursor-pointer"
                        >
                          View Reason
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Empty State */}
            {requirements.length === 0 && inquiries.length === 0 ? (
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
                {/* 1. Full Requirements Specifications */}
                {(submissionFilter === 'all' || submissionFilter === 'requirements') &&
                  requirements.map((req) => (
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

                        {/* Rejection / Cancellation Notice on Card */}
                        {(req.status === 'Rejected' || req.status === 'Cancelled' || req.isDeleted) && (
                          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 space-y-1.5 text-xs">
                            <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-extrabold uppercase text-[10px] tracking-wider">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span>{req.status === 'Rejected' ? 'Project Submission Not Accepted' : 'Order Cancelled / Removed'}</span>
                            </div>
                            <p className="text-slate-800 dark:text-slate-200 font-bold">
                              {req.rejectionReason || req.deletionReason || req.internalNotes
                                ? `Reason: ${req.rejectionReason || req.deletionReason || req.internalNotes}`
                                : 'Project parameters could not be accepted under current scope. Check your email for details.'}
                            </p>
                            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                              💡 Check your email for full details or submit a revised project specification.
                            </p>
                          </div>
                        )}

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

                {/* 2. Instant Proposal Inquiries */}
                {(submissionFilter === 'all' || submissionFilter === 'inquiries') &&
                  inquiries.map((lead) => {
                    const leadTrackingId = lead.leadId || `ORD-${lead._id?.slice(-6).toUpperCase()}`;
                    return (
                      <div
                        key={lead._id}
                        className="glass-panel p-5 sm:p-6 rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 shadow-glass space-y-4 bg-white/90 dark:bg-slate-900/90 hover:border-indigo-400 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Top Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                                  {leadTrackingId}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                                  Instant Proposal
                                </span>
                              </div>
                              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1.5 break-words">
                                {lead.businessName || lead.websiteType || 'Website Project Inquiry'}
                              </h3>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                {lead.websiteType} {lead.selectedDemo ? `(${lead.selectedDemo})` : ''}
                              </p>
                            </div>

                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${
                                lead.status === 'completed'
                                  ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 border-teal-300'
                                  : lead.status === 'in_progress'
                                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 border-indigo-300'
                                  : lead.status === 'contacted'
                                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 border-blue-300'
                                  : 'bg-purple-100 dark:bg-purple-950 text-purple-700 border-purple-300'
                              }`}
                            >
                              {lead.status === 'in_progress' ? 'In Development' : lead.status === 'contacted' ? 'Under Review' : lead.status === 'completed' ? 'Completed' : 'Submitted'}
                            </span>
                          </div>

                          {/* Lead Key Metrics */}
                          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div>
                              <span className="text-slate-400 block text-[10px] font-bold">Estimated Budget</span>
                              <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{lead.budget || 'Standard'}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] font-bold">Speed Target</span>
                              <strong className="text-slate-900 dark:text-white font-extrabold">{lead.timeline || 'Express 48h'}</strong>
                            </div>
                            <div className="col-span-2 mt-1">
                              <span className="text-slate-400 block text-[10px] font-bold">Client Contact</span>
                              <span className="text-slate-700 dark:text-slate-300 font-semibold truncate block">
                                {lead.name} • {lead.phone}
                              </span>
                            </div>
                          </div>

                          {lead.requirements && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl italic">
                              "{lead.requirements}"
                            </p>
                          )}
                        </div>

                        {/* Bottom Actions Bar */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                          <div className="text-[11px] text-slate-400 font-medium">
                            Submitted: {new Date(lead.createdAt).toLocaleDateString()}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openCallbackModal({ topic: `Discussion for Proposal ${leadTrackingId}` })}
                              className="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-purple-200 dark:border-purple-800"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                              <span>Request Callback</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setTrackedOrder({
                                  requirementId: leadTrackingId,
                                  websiteTypeName: lead.websiteType || 'Custom Project',
                                  websiteType: lead.websiteType || 'Custom Project',
                                  clientInfo: {
                                    businessName: lead.businessName || lead.name,
                                    ownerName: lead.name,
                                    mobile: lead.phone,
                                    email: lead.email,
                                  },
                                  status: lead.status === 'in_progress' ? 'In Development' : lead.status === 'contacted' ? 'Under Review' : lead.status === 'completed' ? 'Completed' : 'Submitted',
                                  budget: lead.budget || 'Standard Commercial',
                                  timeline: lead.timeline || 'Express 48 Hours',
                                  createdAt: lead.createdAt,
                                });
                                setTrackSearchId(leadTrackingId);
                                setActiveTab('track');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                            >
                              <Compass className="w-3.5 h-3.5" />
                              <span>Track Milestone &rarr;</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: REAL-TIME PROJECT ROADMAP & ORDER TRACKER          */}
        {/* ======================================================== */}
        {activeTab === 'track' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search / Select Order Bar */}
            <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass bg-white/80 dark:bg-slate-900/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-purple-600" />
                    <span>Real-Time Project Roadmap &amp; Order Tracker</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select one of your registered website orders or enter an Order Tracking ID.
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
                    placeholder="Enter Order / Requirement ID (e.g. REQ-2026-XXXXX)..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono font-bold text-purple-700 dark:text-purple-300 placeholder:font-sans placeholder-slate-400 focus:outline-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={trackLoading}
                  className="px-6 py-3 rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-1.5"
                >
                  {trackLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Track Sprint</span>
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                          {trackedOrder.requirementId}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(trackedOrder.requirementId);
                            toast.success(`Copied ${trackedOrder.requirementId}!`);
                          }}
                          className="p-1 text-slate-400 hover:text-purple-600 cursor-pointer"
                          title="Copy ID"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800 text-[10px] font-black tracking-wider uppercase shadow-2xs">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span>Live Sync Active</span>
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                        {trackedOrder.clientInfo?.businessName || trackedOrder.websiteTypeName || 'Custom Website Project'}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {trackedOrder.websiteTypeName || trackedOrder.websiteType} • Submitted on {new Date(trackedOrder.createdAt || trackedOrder.submittedAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1.5">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border transition-all duration-500 ${STATUS_BADGES[trackedOrder.status] || STATUS_BADGES.Submitted}`}>
                        {trackedOrder.status || 'Submitted'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        Target Delivery: <strong className="text-purple-600 dark:text-purple-400">{trackedOrder.timeline || 'Express (48-72h)'}</strong>
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
                    <button
                      onClick={() => openCallbackModal({ topic: `Status Discussion for Order ${trackedOrder.requirementId}` })}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Request a Callback</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="glass-panel p-10 sm:p-14 rounded-3xl text-center space-y-4 border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 flex items-center justify-center mx-auto text-purple-600 shadow-sm">
                  <Compass className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No project order selected for tracking</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Select one of your submitted orders above or enter an Order Tracking ID to see the live milestone delivery sprint.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CLIENT REVIEWS */}
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] my-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 flex flex-col overflow-hidden animate-in zoom-in-95">
            
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
              
              {/* Rejection / Cancellation Status Alert in Modal */}
              {(viewingReqSpec.status === 'Rejected' || viewingReqSpec.status === 'Cancelled' || viewingReqSpec.isDeleted) && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-extrabold uppercase text-[11px] tracking-wider">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{viewingReqSpec.status === 'Rejected' ? 'Submission Not Accepted' : 'Order Cancelled / Removed'}</span>
                  </div>
                  <p className="text-slate-900 dark:text-slate-100 font-bold text-xs leading-relaxed">
                    {viewingReqSpec.rejectionReason || viewingReqSpec.deletionReason || viewingReqSpec.internalNotes
                      ? `Reason: ${viewingReqSpec.rejectionReason || viewingReqSpec.deletionReason || viewingReqSpec.internalNotes}`
                      : 'Project parameters could not be accepted under the current configuration.'}
                  </p>
                </div>
              )}

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
              <button
                type="button"
                onClick={() => {
                  const req = viewingReqSpec;
                  setViewingReqSpec(null);
                  openCallbackModal({ topic: `Spec Discussion for Order ${req.requirementId}` });
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Request a Callback</span>
              </button>

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
