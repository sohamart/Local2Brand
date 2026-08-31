import React, { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useOrderModal } from '../../context/OrderModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';
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

export default function UserDashboard() {
  const { user, logout, updateProfile, loading: authLoading, openAuthModal, isAdmin } = useAuth();
  const { openOrderModal, openCallbackModal } = useOrderModal();
  const { settings } = useSiteSettings();

  const [activeTab, setActiveTab] = useState('requirements'); // 'requirements' | 'inquiries' | 'callbacks' | 'profile'
  const [requirements, setRequirements] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [reqsRes, leadsRes, cbRes] = await Promise.all([
        api.get('/requirements/my').catch(() => ({ requirements: [] })),
        api.get('/queries/my').catch(() => ({ leads: [] })),
        api.get('/callbacks/my').catch(() => ({ callbacks: [] })),
      ]);

      if (reqsRes && reqsRes.success) setRequirements(reqsRes.requirements || []);
      if (leadsRes && leadsRes.success) setInquiries(leadsRes.leads || []);
      if (cbRes && cbRes.success) setCallbacks(cbRes.callbacks || []);
    } catch (err) {
      console.warn('Dashboard data fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const uploadRes = await api.uploadFile(file);
      if (uploadRes.success && uploadRes.url) {
        setAvatarUrl(uploadRes.url);
        await updateProfile({ avatar: uploadRes.url });
        setSaveSuccess(true);
        toast.success('Avatar updated successfully! 🖼️');
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      toast.error('Avatar upload failed: ' + err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
        company: profileCompany,
        avatar: avatarUrl,
      });
      setSaveSuccess(true);
      toast.success('Profile details saved! ✅');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      toast.error('Update failed: ' + err.message);
    }
  };

  if (authLoading || (loading && !user)) {
    return (
      <div className="min-h-screen pt-44 pb-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500">Loading Client Dashboard...</p>
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
            Please log in to track your website proposals, review quotes, and view development milestones.
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

  return (
    <>
      <SEO title="Client Portal & Projects — LOCAL2BRAND" description="Manage your website specifications, track quotes, and view development status." />

      <div className="pt-36 sm:pt-44 lg:pt-48 pb-20 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-x-hidden">
        
        {/* Admin Switcher Notice Bar (When Admin is in User Panel) */}
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
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md border-2 border-white dark:border-slate-700">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 text-white cursor-pointer hover:bg-purple-600 transition-colors shadow-md" title="Upload Photo">
                <Upload className="w-3.5 h-3.5" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-500/40">
                <AshokaChakra size={11} />
                <span>Verified Client Account</span>
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

        {/* Tab Navigation Segmented Bar (Zero Overflow 3-Column Grid) */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-6 p-1 sm:p-1.5 bg-slate-200/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 w-full">
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

        {/* TAB 1: WEBSITE SPECIFICATIONS */}
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

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>Submitted: {new Date(req.createdAt).toLocaleDateString()}</span>
                      <span className="font-semibold text-purple-600">Active Workflow</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CALLBACKS */}
        {activeTab === 'callbacks' && (
          <div className="space-y-4">
            {callbacks.length === 0 ? (
              <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-4 border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
                <PhoneCall className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No callbacks requested</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Need free consultation or custom advice? Request a phone callback from our senior technical architect.
                </p>
                <button
                  onClick={() => openCallbackModal()}
                  className="px-6 py-3 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  Schedule Callback
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {callbacks.map((cb) => (
                  <div
                    key={cb._id}
                    className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-glass space-y-2 bg-white/80 dark:bg-slate-900/80"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{cb.phone}</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {cb.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Preferred: <strong>{cb.preferredTime}</strong></p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">Topic: {cb.topic}</p>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                      Requested on {new Date(cb.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass bg-white/80 dark:bg-slate-900/80 space-y-5">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Profile & Brand Settings</h3>

            {saveSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  placeholder="e.g. Royal Bengal Sweets"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </>
  );
}
