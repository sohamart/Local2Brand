import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
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
  X,
  RefreshCw,
  Inbox,
  Menu,
  ChevronRight,
  Sliders,
  Activity,
  Award,
  HelpCircle,
  Home as HomeIcon,
  Download,
  Flame,
  ArrowUpRight,
  Send
} from 'lucide-react';

import WriteReviewModal from '../../components/common/WriteReviewModal';
import UserInboxTab from '../../components/user/UserInboxTab';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useOrderModal } from '../../context/OrderModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import api from '../../services/api';
import { uploadWithToast } from '../../utils/toastUpload';
import AshokaChakra from '../../components/common/AshokaChakra';
import DashboardLoader from '../../components/common/DashboardLoader';
import NotificationToggle from '../../components/common/NotificationToggle';
import NotificationBell from '../../components/common/NotificationBell';
import ThemeToggle from '../../components/common/ThemeToggle';
import { SEO } from '../../components/common/CommonUI';
import notificationApi from '../../services/notificationApi';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout, updateProfile, loading: authLoading, openAuthModal, isAdmin } = useAuth();
  const { openOrderModal, openCallbackModal } = useOrderModal();
  const { settings } = useSiteSettings();

  // DEFAULT TAB IS 'profile' as requested ("r first profile er page tai thakbe")
  const [activeTab, setActiveTab] = useState(() => {
    const urlTrack = searchParams.get('track');
    const urlTab = searchParams.get('tab');
    if (urlTrack) return 'track';
    if (urlTab && ['profile', 'requirements', 'track', 'inbox', 'inquiries', 'callbacks', 'reviews'].includes(urlTab)) {
      return urlTab;
    }
    return 'profile';
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [submissionFilter, setSubmissionFilter] = useState('all'); // 'all' | 'in_progress' | 'completed' | 'cancelled'
  const [requirements, setRequirements] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [callbacks, setCallbacks] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [viewingReqSpec, setViewingReqSpec] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [callbacksLoading, setCallbacksLoading] = useState(true);
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
  const [isSavingProfile, setIsSavingProfile] = useState(false);
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
        toast.success('🎉 Email verified successfully! Your VIP client account is active.');
        updateUserSession({ isEmailVerified: true });
        setOtpCode('');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP code');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Email Change State & Handlers (OTP-Protected)
  const [isEmailChangeOpen, setIsEmailChangeOpen] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailChangeOtpCode, setEmailChangeOtpCode] = useState('');
  const [isSendingEmailChangeOtp, setIsSendingEmailChangeOtp] = useState(false);
  const [isVerifyingEmailChangeOtp, setIsVerifyingEmailChangeOtp] = useState(false);
  const [emailChangeOtpSent, setEmailChangeOtpSent] = useState(false);
  const [emailChangeCooldown, setEmailChangeCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (emailChangeCooldown > 0) {
      timer = setInterval(() => {
        setEmailChangeCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [emailChangeCooldown]);

  const handleRequestEmailChangeOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newEmailInput || !newEmailInput.includes('@')) {
      toast.warn('Please provide a valid new email address');
      return;
    }
    if (newEmailInput.toLowerCase().trim() === (user?.email || '').toLowerCase().trim()) {
      toast.warn('New email address must be different from your current email');
      return;
    }

    setIsSendingEmailChangeOtp(true);
    try {
      const res = await api.post('/auth/request-email-change', { newEmail: newEmailInput.trim() });
      if (res.success) {
        setEmailChangeOtpSent(true);
        setEmailChangeCooldown(60);
        toast.success(res.message || `6-digit security OTP sent to ${newEmailInput}!`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send email change OTP');
    } finally {
      setIsSendingEmailChangeOtp(false);
    }
  };

  const handleVerifyEmailChangeOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!emailChangeOtpCode || emailChangeOtpCode.trim().length < 6) {
      toast.warn('Please enter the 6-digit verification code');
      return;
    }

    setIsVerifyingEmailChangeOtp(true);
    try {
      const res = await api.post('/auth/verify-email-change', {
        newEmail: newEmailInput.trim(),
        otp: emailChangeOtpCode.trim(),
      });
      if (res.success) {
        if (res.token) {
          api.setToken(res.token);
        }
        if (res.user) {
          updateUserSession(res.user);
        }
        toast.success(res.message || 'Email address successfully updated! 🎉');
        setIsEmailChangeOpen(false);
        setEmailChangeOtpSent(false);
        setNewEmailInput('');
        setEmailChangeOtpCode('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to verify email change OTP');
    } finally {
      setIsVerifyingEmailChangeOtp(false);
    }
  };

  const fetchUserData = useCallback(async (silent = false) => {
    if (!silent) {
      setOrdersLoading(requirements.length === 0);
    }
    setIsRefreshing(true);
    try {
      const emailParam = user?.email ? `?email=${encodeURIComponent(user.email)}` : '';
      const [reqsRes, leadsRes, cbRes, revsRes] = await Promise.all([
        api.get(`/requirements/my${emailParam}`).catch(() => ({ requirements: [] })),
        api.get(`/queries/my${emailParam}`).catch(() => ({ leads: [] })),
        api.get(`/callbacks/my${emailParam}`).catch(() => ({ callbacks: [] })),
        api.get('/reviews/my').catch(() => ({ reviews: [] })),
      ]);

      const reqList = reqsRes?.requirements || [];
      const leadList = leadsRes?.leads || [];
      const cbList = cbRes?.callbacks || [];
      const revList = revsRes?.reviews || [];

      setRequirements(reqList);
      if (leadsRes && leadsRes.success) setInquiries(leadList);
      if (cbRes && cbRes.success) setCallbacks(cbList);
      if (revsRes && revsRes.success) setUserReviews(revList);
      setLastSyncTime(new Date());

      // Seamlessly sync active tracked order with incoming data without flipping or resetting
      setTrackedOrder((currTracked) => {
        if (currTracked) {
          const liveMatch = reqList.find(
            (r) => r.requirementId === currTracked.requirementId || r._id === currTracked._id
          );
          return liveMatch || currTracked;
        }
        return reqList.length > 0 ? reqList[0] : null;
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setOrdersLoading(false);
      setReviewsLoading(false);
      setCallbacksLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.email, requirements.length]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileCompany(user.company || '');
      setAvatarUrl(user.avatar || '');
      fetchUserData(false);

      // Smooth, gentle 30s background live auto-poll
      const pollTimer = setInterval(() => {
        fetchUserData(true);
      }, 30000);
      return () => clearInterval(pollTimer);
    } else if (!authLoading) {
      setLoading(false);
      setOrdersLoading(false);
      setReviewsLoading(false);
      setCallbacksLoading(false);
    }
  }, [user?.email, authLoading]);

  // Handle URL track or tab query parameter
  useEffect(() => {
    const urlTrackId = searchParams.get('track');
    const urlTab = searchParams.get('tab');
    if (urlTrackId) {
      setTrackSearchId(urlTrackId);
      setActiveTab('track');
      performTrackOrder(urlTrackId);
    } else if (urlTab && ['profile', 'requirements', 'inbox', 'track', 'reviews', 'callbacks', 'inquiries'].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  const performTrackOrder = async (idToSearch) => {
    const id = (idToSearch || trackSearchId).trim();
    if (!id) {
      toast.warning('Please enter a Requirement / Order ID (e.g. REQ-2026-XXXXX)');
      return;
    }

    setTrackLoading(true);
    setTrackError('');

    try {
      const localMatch = requirements.find(
        (r) => r.requirementId?.toLowerCase() === id.toLowerCase() || r._id?.toString() === id
      );

      if (localMatch) {
        setTrackedOrder(localMatch);
        setTrackLoading(false);
        return;
      }

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
        successMessage: 'Avatar updated! 📸',
      });

      const finalUrl = uploadRes?.url || uploadRes?.urls?.[0];
      if (finalUrl) {
        setAvatarUrl(finalUrl);
        await updateProfile({ avatar: finalUrl });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (uploadErr) {
      console.error('Avatar upload error:', uploadErr);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
        company: profileCompany.trim(),
      });
      setSaveSuccess(true);
      toast.success('Profile details saved successfully! ✨');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileSidebarOpen(false);
    setSearchParams({ tab: tabId });
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Auth Guard
  if (authLoading) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center bg-slate-950">
        <DashboardLoader title="Authenticating Client Console..." role="user" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-slate-950">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-purple-500/30 shadow-[0_20px_60px_-15px_rgba(147,51,234,0.3)] text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(147,51,234,0.5)]">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Client Portal Sign In
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Please sign in to access your active website roadmap, quotations, central inbox, and direct architect communication.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3.5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Sign In to Client Account</span>
            </button>
            <Link
              to="/"
              className="w-full py-3 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Back to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Count active development orders
  const activeOrdersCount = requirements.filter(
    (r) => r.status === 'In Development' || r.status === 'Under Review' || r.status === 'Quotation Sent' || r.status === 'Approved'
  ).length;

  const filteredRequirements = requirements.filter((r) => {
    if (submissionFilter === 'in_progress') {
      return ['Submitted', 'Under Review', 'Quotation Sent', 'Approved', 'In Development'].includes(r.status);
    }
    if (submissionFilter === 'completed') {
      return r.status === 'Completed';
    }
    if (submissionFilter === 'cancelled') {
      return r.status === 'Cancelled' || r.status === 'Rejected';
    }
    return true;
  });

  const NAV_ITEMS = [
    { id: 'profile', label: 'Profile & Account', icon: User, badge: null, desc: 'Identity & Security' },
    { id: 'requirements', label: 'My Projects & Orders', icon: Layers, badge: requirements.length > 0 ? requirements.length : null, desc: 'Specifications & Progress' },
    { id: 'track', label: 'Live Order Tracker', icon: Compass, badge: activeOrdersCount > 0 ? `${activeOrdersCount} live` : null, desc: '6-Stage Live Stepper' },
    { id: 'inbox', label: 'Inbox & Alerts', icon: Inbox, badge: null, desc: 'VIP Alerts & Email Messages' },
    { id: 'inquiries', label: 'Project Inquiries', icon: FileText, badge: inquiries.length > 0 ? inquiries.length : null, desc: 'Custom Quote Requests' },
    { id: 'callbacks', label: 'Scheduled Callbacks', icon: PhoneCall, badge: callbacks.length > 0 ? callbacks.length : null, desc: 'VIP Phone Discussions' },
    { id: 'reviews', label: 'Reviews & Feedback', icon: Star, badge: userReviews.length > 0 ? userReviews.length : null, desc: 'Your Testimonials' },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100/70 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <SEO
        title="Client Dashboard | Local2Brand"
        description="Access your projects, order roadmap, inbox, and account settings."
      />

      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-40 lg:hidden transition-opacity cursor-pointer"
          aria-label="Close sidebar"
        />
      )}

      {/* ========================================================================= */}
      {/* 1. LUXURY CLIENT SIDEBAR (Admin Panel Layout Matching) */}
      {/* ========================================================================= */}
      <aside
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-72 h-dvh max-h-screen bg-white/95 dark:bg-[#0c101d]/95 backdrop-blur-2xl border-r border-slate-200/90 dark:border-purple-500/20 flex flex-col justify-between transition-transform duration-300 overflow-hidden shadow-2xl lg:shadow-none ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Logo & Portal Brand Tag */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/30">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-purple-600 to-indigo-600 p-0.5 border border-purple-400/30">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-[14px]" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white leading-none block">
                LOCAL<span className="l2b-gradient-text">2</span>BRAND
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 mt-0.5">
                <AshokaChakra size={10} />
                <span>Client Hub</span>
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client Mini Profile Card in Sidebar */}
        <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-gradient-to-br from-purple-500/[0.08] via-indigo-500/[0.05] to-transparent dark:from-purple-950/40 dark:via-indigo-950/20 border border-purple-500/20 shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-purple-500/20 text-purple-600 dark:text-purple-300 font-black text-sm flex items-center justify-center border border-purple-500/30 shadow-xs">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase() || 'C'
                )}
              </div>
              {user?.isEmailVerified ? (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center shadow-xs" title="Email Verified">
                  <Check className="w-2 h-2 text-white stroke-[3]" />
                </span>
              ) : (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center shadow-xs" title="Verification Pending">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {user?.name || 'Valued Client'}
                </h4>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user?.company || user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Items List */}
        <div 
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar overscroll-contain"
        >
          <div className="px-3 pb-1.5 pt-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation Menu
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-[0_4px_15px_-3px_rgba(147,51,234,0.4)]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-purple-500/10 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 group-hover:bg-purple-500/20 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? 'bg-white text-purple-700'
                      : 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/25'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 pb-1 px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Quick Actions
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileSidebarOpen(false);
              openOrderModal();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-black text-purple-600 dark:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Start New Website</span>
          </button>

          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
            <span>Back to Public Website</span>
          </Link>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 space-y-2 shrink-0">
          {/* Direct WhatsApp Support (VIP Button if enabled by admin, "Not Provided" Tag if not) */}
          {user?.vipWhatsappEnabled ? (
            <a
              href={settings?.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello Local2Brand Founder Team! 👋 I am logged into my VIP Client Console (${user.email}). Requesting direct priority support.`)}` : 'https://wa.me/918710043923'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 border border-emerald-400/40 flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/25 active:scale-98 group cursor-pointer"
              title="VIP 1-on-1 WhatsApp Direct Developer Hotline"
            >
              <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-3.5 h-3.5 text-white animate-pulse" />
              </div>
              <span className="truncate">💎 VIP WhatsApp Support</span>
            </a>
          ) : (
            <div className="w-full p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">WhatsApp Support</span>
                </div>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  Not Provided
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Direct 1-on-1 WhatsApp is an exclusive VIP feature unlocked by Admin.
              </p>
              <button
                type="button"
                onClick={() => openCallbackModal()}
                className="w-full py-1.5 px-2 rounded-lg text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3 h-3 text-emerald-500" />
                <span>Request Voice Callback</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => logout()}
            className="w-full py-2 px-3 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA WITH HEADER */}
      {/* ========================================================================= */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#080c16]/90 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-6 flex items-center justify-between gap-2 shadow-xs">
          {/* Left: Mobile Sidebar Hamburger & Title Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                <span>Client Hub</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-purple-600 dark:text-purple-400 capitalize">{activeTab}</span>
              </div>
              <h2 className="text-xs sm:text-base font-black text-slate-900 dark:text-white truncate">
                {NAV_ITEMS.find((n) => n.id === activeTab)?.label || 'Client Console'}
              </h2>
            </div>
          </div>

          {/* Right Header Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Live Sync Refresh Button */}
            <button
              type="button"
              onClick={() => fetchUserData(false)}
              disabled={isRefreshing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Sync latest updates from server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-600' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* Quick Order Button */}
            <button
              type="button"
              onClick={() => openOrderModal()}
              className="hidden sm:flex px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_15px_rgba(147,51,234,0.35)] hover:opacity-95 items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Avatar Pill */}
            <div 
              onClick={() => selectTab('profile')}
              className="flex items-center gap-1.5 p-1 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:border-purple-500/40 transition-all shrink-0"
            >
              <div className="w-6 h-6 rounded-xl overflow-hidden bg-purple-600 text-white text-[11px] font-black flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase() || 'C'
                )}
              </div>
              <span className="hidden md:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                {user?.name?.split(' ')?.[0] || 'Profile'}
              </span>
            </div>
          </div>
        </header>

        {/* Main Body Content Container */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* ========================================================================= */}
          {/* TAB 1: PROFILE & ACCOUNT (FIRST AND PRIMARY VIEW) */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Top Hero VIP Identity Card */}
              <div className="relative p-4 sm:p-7 md:p-8 rounded-3xl bg-gradient-to-br from-white/95 via-purple-500/[0.04] to-indigo-500/[0.04] dark:from-[#0d1222]/95 dark:via-[#131028]/95 dark:to-[#0c101d]/95 backdrop-blur-2xl border border-purple-500/30 dark:border-purple-500/35 shadow-[0_20px_50px_-15px_rgba(147,51,234,0.15)] overflow-hidden">
                {/* Ambient glow orbs */}
                <div className="absolute -top-20 -right-20 w-56 h-56 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
                  {/* Left: Avatar + Details */}
                  <div className="flex items-center gap-3.5 sm:gap-6 w-full md:w-auto min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 p-0.5 shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                        <div className="w-full h-full rounded-[14px] sm:rounded-[22px] overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center font-black text-xl sm:text-2xl text-purple-600 dark:text-purple-300">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                          ) : (
                            user?.name?.[0]?.toUpperCase() || 'C'
                          )}
                        </div>
                      </div>

                      <label
                        className={`absolute -bottom-1 -right-1 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl text-white shadow-md transition-all cursor-pointer ${
                          uploadingAvatar
                            ? 'bg-purple-600 cursor-wait animate-pulse'
                            : 'bg-slate-900 dark:bg-purple-600 hover:scale-110'
                        }`}
                        title="Change Avatar Photo"
                      >
                        {uploadingAvatar ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Upload className="w-3 h-3" />
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

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 shadow-xs">
                          <AshokaChakra size={9} /> VIP Client
                        </span>

                        {user?.vipWhatsappEnabled && (
                          <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                            <Sparkles className="w-3 h-3 text-emerald-500" /> VIP WhatsApp Hotline
                          </span>
                        )}

                        {user?.isEmailVerified ? (
                          <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 animate-pulse">
                            <AlertCircle className="w-3 h-3" /> Unverified
                          </span>
                        )}
                      </div>

                      <h1 className="text-base sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug break-words">
                        {user?.name || 'Valued Client'}
                      </h1>

                      <p className="text-[11px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-400 break-all leading-relaxed">
                        {user?.email} {user?.phone ? `• ${user.phone}` : ''} {user?.company ? `• ${user.company}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quick Launch CTAs */}
                  <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => openOrderModal()}
                      className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Start Project</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openCallbackModal()}
                      className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Callback</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* OTP Verification Required Alert (If email unverified) */}
              {user && !user.isEmailVerified && (
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/[0.08] via-rose-500/[0.06] to-purple-500/[0.08] dark:from-[#211708] dark:via-[#1f0a17] dark:to-[#170c26] border-2 border-amber-400/60 dark:border-amber-500/40 shadow-md">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                        <Mail className="w-5 h-5 animate-bounce" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                            ACTION REQUIRED
                          </span>
                          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                            Verify Your Registered Email Address
                          </h3>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                          We sent a 6-digit OTP code to <strong className="text-purple-600 dark:text-purple-400 font-mono">{user.email}</strong>. Enter the code below to fully activate your client account.
                        </p>
                      </div>
                    </div>

                    {/* OTP Form */}
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
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:opacity-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        {isVerifyingOtp ? 'Verifying...' : 'Verify Code'}
                      </button>

                      <button
                        type="button"
                        onClick={handleSendVerificationOtp}
                        disabled={isSendingOtp || otpResendCooldown > 0}
                        className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer transition-all shrink-0"
                      >
                        {isSendingOtp ? 'Sending...' : otpResendCooldown > 0 ? `Resend (${otpResendCooldown}s)` : 'Resend OTP ✉️'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Metric Counters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <div 
                  onClick={() => selectTab('requirements')}
                  className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/40 shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center transition-transform group-hover:scale-110">
                      <Layers className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {requirements.length}
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                    Total Project Orders
                  </div>
                </div>

                <div 
                  onClick={() => selectTab('track')}
                  className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/40 shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-110">
                      <Compass className="w-5 h-5" />
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {activeOrdersCount}
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                    Active In-Development
                  </div>
                </div>

                <div 
                  onClick={() => selectTab('inquiries')}
                  className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-500/40 shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110">
                      <FileText className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {inquiries.length}
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                    Custom Quote Inquiries
                  </div>
                </div>

                <div 
                  onClick={() => selectTab('callbacks')}
                  className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {callbacks.length}
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                    Scheduled Callbacks
                  </div>
                </div>
              </div>

              {/* Active Lucky Wheel Coupon Voucher Card (If won) */}
              {dashboardVoucher && (
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-amber-500/15 border border-purple-400/40 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Gift className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase shadow-xs">
                          🎉 Active Lucky Wheel Voucher
                        </span>
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {dashboardVoucher.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        Use coupon code <strong className="font-mono text-purple-600 dark:text-purple-400 font-black tracking-wider">{dashboardVoucher.code}</strong> for {dashboardVoucher.discountPercent || 20}% OFF your next custom website!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          if (navigator.clipboard) await navigator.clipboard.writeText(dashboardVoucher.code);
                        } catch (e) {}
                        setVoucherCopied(true);
                        toast.info(`Copied "${dashboardVoucher.code}" to clipboard!`);
                        setTimeout(() => setVoucherCopied(false), 2500);
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
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
                      className="px-4 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xs hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Apply to New Order</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Web Push Alerts Toggle Widget */}
              <NotificationToggle />

              {/* Profile Details Edit Form Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        Account & Profile Settings
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Update your primary contact information for quotations and delivery updates
                      </p>
                    </div>
                  </div>

                  {saveSuccess && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Saved!
                    </span>
                  )}
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Full Name / Business Owner *
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-purple-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        WhatsApp / Contact Mobile *
                      </label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Email Address (Account ID)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEmailChangeOpen(!isEmailChangeOpen);
                            setEmailChangeOtpSent(false);
                            setNewEmailInput('');
                            setEmailChangeOtpCode('');
                          }}
                          className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{isEmailChangeOpen ? 'Close' : 'Change Email (OTP)'}</span>
                        </button>
                      </div>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Company / Brand Name
                      </label>
                      <input
                        type="text"
                        value={profileCompany}
                        onChange={(e) => setProfileCompany(e.target.value)}
                        placeholder="e.g. Sharma Sweets & Bakers"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Expandable Email Change OTP Panel */}
                  {isEmailChangeOpen && (
                    <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-purple-500/[0.08] via-indigo-500/[0.06] to-pink-500/[0.08] dark:from-purple-950/40 dark:via-slate-900/60 dark:to-indigo-950/40 border-2 border-purple-500/30 shadow-md space-y-3 animate-fadeIn">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                            Change Registered Account Email (OTP Required)
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            For security, a 6-digit verification code will be sent to your new email address.
                          </p>
                        </div>
                      </div>

                      {!emailChangeOtpSent ? (
                        <div className="space-y-3 pt-1">
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              New Email Address *
                            </label>
                            <input
                              type="email"
                              value={newEmailInput}
                              onChange={(e) => setNewEmailInput(e.target.value)}
                              placeholder="e.g. rahul.newemail@gmail.com"
                              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-purple-500"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleRequestEmailChangeOtp}
                              disabled={isSendingEmailChangeOtp || !newEmailInput.includes('@')}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                            >
                              {isSendingEmailChangeOtp ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Sending OTP...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3 h-3" />
                                  <span>Send Verification Code</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsEmailChangeOpen(false)}
                              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-1">
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">
                            We sent a 6-digit code to <strong className="text-purple-600 dark:text-purple-400 font-mono">{newEmailInput}</strong>. Enter the code below:
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              value={emailChangeOtpCode}
                              onChange={(e) => setEmailChangeOtpCode(e.target.value.replace(/\D/g, ''))}
                              placeholder="6-Digit OTP"
                              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-400 dark:border-purple-700 text-sm font-mono font-bold tracking-widest text-center w-36 text-slate-900 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyEmailChangeOtp}
                              disabled={isVerifyingEmailChangeOtp || emailChangeOtpCode.length < 6}
                              className="px-4 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 cursor-pointer flex items-center gap-1 shadow-xs"
                            >
                              {isVerifyingEmailChangeOtp ? 'Verifying...' : 'Verify & Update Email'}
                            </button>
                            <button
                              type="button"
                              onClick={handleRequestEmailChangeOtp}
                              disabled={isSendingEmailChangeOtp || emailChangeCooldown > 0}
                              className="px-3 py-2 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                            >
                              {isSendingEmailChangeOtp ? 'Sending...' : emailChangeCooldown > 0 ? `Resend (${emailChangeCooldown}s)` : 'Resend Code'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-3 flex items-center justify-between gap-3">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-6 py-3 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_15px_rgba(147,51,234,0.35)] hover:opacity-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      {isSavingProfile ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Profile Changes</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => logout()}
                      className="px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Latest Recent Orders Quick View */}
              {requirements.length > 0 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <Flame className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        Latest Project Orders
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => selectTab('requirements')}
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All ({requirements.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {requirements.slice(0, 2).map((req) => (
                      <div
                        key={req._id}
                        className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                            {req.requirementId}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${STATUS_BADGES[req.status] || STATUS_BADGES.Submitted}`}>
                            {req.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                            {req.clientInfo?.businessName || req.websiteTypeName || 'Custom Website Project'}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Budget: <strong className="text-slate-700 dark:text-slate-200">{req.budget}</strong> • Timeline: <strong className="text-slate-700 dark:text-slate-200">{req.timeline}</strong>
                          </p>
                        </div>

                        <div className="pt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setTrackedOrder(req);
                              setTrackSearchId(req.requirementId);
                              selectTab('track');
                            }}
                            className="flex-1 py-2 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            <span>Live Progress</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setViewingReqSpec(req)}
                            className="py-2 px-3 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Specs</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MY PROJECTS & ORDERS */}
          {/* ========================================================================= */}
          {activeTab === 'requirements' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header with Filter Pills & New Order Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: 'all', label: 'All Orders', count: requirements.length },
                    { id: 'in_progress', label: 'In Progress', count: activeOrdersCount },
                    { id: 'completed', label: 'Completed', count: requirements.filter((r) => r.status === 'Completed').length },
                    { id: 'cancelled', label: 'Cancelled', count: requirements.filter((r) => r.status === 'Cancelled' || r.status === 'Rejected').length },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setSubmissionFilter(filter.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        submissionFilter === filter.id
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{filter.label}</span>
                      <span className="text-[10px] font-black opacity-80">({filter.count})</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => openOrderModal()}
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xs hover:opacity-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Start New Website</span>
                </button>
              </div>

              {/* Orders List */}
              {ordersLoading && requirements.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-xs space-y-3">
                  <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                  <span className="font-bold">Loading your project submissions...</span>
                </div>
              ) : filteredRequirements.length === 0 ? (
                <div className="py-16 px-4 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 border border-slate-200/80 dark:border-slate-800/80 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-xs">
                    <Layers className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      No project orders found
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      Ready to launch your custom high-conversion website? Submit your requirements in 2 minutes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openOrderModal()}
                    className="px-6 py-3 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md hover:opacity-95 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Create Website Requirement</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequirements.map((req) => {
                    const currentStageIdx = getStageIndex(req.status);
                    const progressPct = getStageProgress(req.status);
                    return (
                      <div
                        key={req._id}
                        className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-purple-500/40 transition-all space-y-4"
                      >
                        {/* Card Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/25">
                              {req.requirementId}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${STATUS_BADGES[req.status] || STATUS_BADGES.Submitted}`}>
                              {req.status}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              Submitted: {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => {
                                setTrackedOrder(req);
                                setTrackSearchId(req.requirementId);
                                selectTab('track');
                              }}
                              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Compass className="w-3.5 h-3.5" />
                              <span>Live Tracker</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setViewingReqSpec(req)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Specs</span>
                            </button>
                          </div>
                        </div>

                        {/* Title & Scope Parameters */}
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                            {req.clientInfo?.businessName || req.websiteTypeName || 'Custom Website Solution'}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Category: <strong className="text-slate-700 dark:text-slate-200">{req.websiteTypeName || req.websiteType}</strong> • Investment: <strong className="text-slate-700 dark:text-slate-200">{req.budget}</strong> • Timeline: <strong className="text-slate-700 dark:text-slate-200">{req.timeline}</strong>
                          </p>
                        </div>

                        {/* 6-Stage Progress Bar Stepper Mini */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              Current Phase: <strong className="text-purple-600 dark:text-purple-400">{TRACKING_STAGES[Math.max(0, currentStageIdx)]?.name || req.status}</strong>
                            </span>
                            <span className="font-mono font-black text-purple-600 dark:text-purple-400 text-xs">
                              {progressPct}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 rounded-full transition-all duration-500"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: LIVE ORDER TRACKER */}
          {/* ========================================================================= */}
          {activeTab === 'track' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Tracker Search Header */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Live Roadmap & Sprint Stepper
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Track the active architectural design, coding sprint, and deployment status in real time
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    performTrackOrder();
                  }}
                  className="flex items-center gap-2 pt-1"
                >
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={trackSearchId}
                      onChange={(e) => setTrackSearchId(e.target.value)}
                      placeholder="Enter Order ID (e.g. REQ-2026-XXXXX)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-purple-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={trackLoading}
                    className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xs hover:opacity-95 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {trackLoading ? 'Searching...' : 'Track'}
                  </button>
                </form>
              </div>

              {/* Interactive Quick Order Selector (Shows all client's orders) */}
              {requirements.length > 0 && (
                <div className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Select Project to Track ({requirements.length})
                      </h4>
                    </div>
                    <span className="text-[10.5px] text-slate-400 font-bold hidden sm:inline">
                      Click any project to switch roadmap
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {requirements.map((req) => {
                      const isSelected = trackedOrder && (trackedOrder.requirementId === req.requirementId || trackedOrder._id === req._id);
                      const stageIdx = getStageIndex(req.status);
                      const pct = getStageProgress(req.status);
                      return (
                        <button
                          key={req._id}
                          type="button"
                          onClick={() => {
                            setTrackedOrder(req);
                            setTrackSearchId(req.requirementId);
                            setTrackError('');
                          }}
                          className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 relative overflow-hidden group ${
                            isSelected
                              ? 'bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-transparent dark:from-purple-950/60 dark:via-indigo-950/40 border-purple-500/60 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.3)] ring-2 ring-purple-500/50'
                              : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/70 hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-purple-950/20'
                          }`}
                        >
                          {/* Top row: ID + Status */}
                          <div className="flex items-center justify-between gap-1.5 w-full">
                            <span className={`font-mono text-[11px] font-black px-2 py-0.5 rounded-lg border ${
                              isSelected
                                ? 'bg-purple-600 text-white border-purple-400'
                                : 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20'
                            }`}>
                              {req.requirementId}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider border ${STATUS_BADGES[req.status] || STATUS_BADGES.Submitted}`}>
                              {req.status}
                            </span>
                          </div>

                          {/* Middle: Title */}
                          <div className="min-w-0 w-full">
                            <h5 className={`text-xs font-black truncate ${isSelected ? 'text-purple-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                              {req.clientInfo?.businessName || req.websiteTypeName || 'Custom Website'}
                            </h5>
                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              Stage: {TRACKING_STAGES[Math.max(0, stageIdx)]?.name || req.status} ({pct}%)
                            </p>
                          </div>

                          {/* Bottom: Progress Bar */}
                          <div className="w-full h-1.5 rounded-full bg-slate-200/70 dark:bg-slate-800 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${isSelected ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-slate-400 dark:bg-slate-600'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tracked Order Details */}
              {trackError ? (
                <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center space-y-2 text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-8 h-8 mx-auto" />
                  <p className="text-xs font-bold">{trackError}</p>
                </div>
              ) : trackedOrder ? (
                <div className="space-y-6">
                  {/* Order Overview Header Card */}
                  <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-xl border border-purple-500/30 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/25">
                            {trackedOrder.requirementId}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${STATUS_BADGES[trackedOrder.status] || STATUS_BADGES.Submitted}`}>
                            {trackedOrder.status}
                          </span>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                          {trackedOrder.clientInfo?.businessName || trackedOrder.websiteTypeName || 'Custom Website Solution'}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingReqSpec(trackedOrder)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Full Specs</span>
                        </button>
                      </div>
                    </div>

                    {/* 6-Stage Timeline Stepper */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Sprint Execution Stages
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {TRACKING_STAGES.map((stg, idx) => {
                          const currentStageIdx = getStageIndex(trackedOrder.status);
                          const isCompleted = idx < currentStageIdx;
                          const isCurrent = idx === currentStageIdx;
                          return (
                            <div
                              key={stg.id}
                              className={`p-4 rounded-2xl border transition-all ${
                                isCurrent
                                  ? 'bg-purple-500/10 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-purple-400/20'
                                  : isCompleted
                                  ? 'bg-emerald-500/[0.06] border-emerald-500/30'
                                  : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                  isCurrent
                                    ? 'bg-purple-600 text-white animate-pulse'
                                    : isCompleted
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                }`}>
                                  Stage 0{stg.id}
                                </span>
                                {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                {isCurrent && <Clock className="w-4 h-4 text-purple-500 animate-spin" />}
                              </div>
                              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                                {stg.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                {stg.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: CENTRAL INBOX */}
          {/* ========================================================================= */}
          {activeTab === 'inbox' && (
            <div className="animate-in fade-in duration-200">
              <UserInboxTab />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: PROJECT INQUIRIES */}
          {/* ========================================================================= */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between p-4 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 border border-slate-200/80 dark:border-slate-800/80">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Submitted Project Inquiries ({inquiries.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Custom proposals and scope requests submitted via demo inquiry forms
                  </p>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <FileText className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-xs font-bold">No custom project inquiries on record</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq._id}
                      className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 border border-slate-200/80 dark:border-slate-800/80 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/25">
                          {inq.leadId || inq._id?.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {inq.status || 'Pending'}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {inq.businessName || inq.name} • {inq.websiteType || 'Custom Project'}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {inq.message || inq.requirements || 'No extra requirements specified'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: SCHEDULED CALLBACKS */}
          {/* ========================================================================= */}
          {activeTab === 'callbacks' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between p-4 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 border border-slate-200/80 dark:border-slate-800/80">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Scheduled Callback Requests ({callbacks.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    VIP technical discussion calls with senior software architects
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openCallbackModal()}
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xs hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Request Call</span>
                </button>
              </div>

              {callbacks.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <PhoneCall className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-xs font-bold">No scheduled callbacks pending</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {callbacks.map((cb) => (
                    <div
                      key={cb._id}
                      className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 border border-slate-200/80 dark:border-slate-800/80 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/25">
                          {cb.callbackId || cb._id?.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {cb.status || 'Pending'}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {cb.preferredTime || 'ASAP (Within 15-30 mins)'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Topic: <strong className="text-slate-800 dark:text-slate-200">{cb.topic || cb.notes || 'General Project Scope'}</strong> • Phone: <strong className="text-slate-800 dark:text-slate-200">{cb.phone}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: REVIEWS & FEEDBACK */}
          {/* ========================================================================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between p-4 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 border border-slate-200/80 dark:border-slate-800/80">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Client Testimonials & Ratings ({userReviews.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your published reviews and project experience feedback
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingReview(null);
                    setIsReviewModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xs hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>Write Review</span>
                </button>
              </div>

              {userReviews.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <Star className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-xs font-bold">You haven't posted any reviews yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userReviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#0c101d]/90 border border-slate-200/80 dark:border-slate-800/80 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < (rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingReview(rev);
                              setIsReviewModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-500/10 transition-colors cursor-pointer"
                            title="Edit Review"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                        "{rev.reviewText || rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Write Review Modal */}
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
        <div 
          data-lenis-prevent="true"
          className="fixed inset-0 z-[999999999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
        >
          <div 
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            style={{ overscrollBehavior: 'contain' }}
            className="w-full max-w-2xl max-h-[90vh] my-auto rounded-3xl border border-purple-500/30 shadow-2xl bg-white dark:bg-[#0e1320] flex flex-col overflow-hidden animate-in zoom-in-95 overscroll-contain"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
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
                type="button"
                onClick={() => setViewingReqSpec(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div 
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              style={{ overscrollBehavior: 'contain' }}
              className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs overscroll-contain flex-1 min-h-0 custom-scrollbar"
            >
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
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const req = viewingReqSpec;
                  setViewingReqSpec(null);
                  openCallbackModal({ topic: `Spec Discussion for Order ${req.requirementId}` });
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Request a Callback</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const req = viewingReqSpec;
                  setViewingReqSpec(null);
                  setTrackedOrder(req);
                  setTrackSearchId(req.requirementId);
                  selectTab('track');
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
    </div>
  );
}
