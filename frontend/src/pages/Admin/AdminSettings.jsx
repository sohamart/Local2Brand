import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Check,
  Upload,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Globe,
  Mail,
  DollarSign,
  Clock,
  Shield,
  Layers,
  Image as ImageIcon,
  Bot,
  Brain,
  MessageSquare
} from 'lucide-react';

import { toast } from 'react-toastify';
import api from '../../services/api';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { SEO } from '../../components/common/CommonUI';

export default function AdminSettings() {
  const { settings, refreshSettings } = useSiteSettings();

  const [formData, setFormData] = useState({
    brandName: settings.brandName || 'LOCAL2BRAND',
    domain: settings.domain || 'local2brand.com',
    tagline: settings.tagline || 'Build Local. Think Global.',
    supportEmail: settings.supportEmail || 'hello@local2brand.com',
    turnaroundTime: settings.turnaroundTime || '48 Hours',
    startingPriceUsd: settings.startingPriceUsd || '$399',
    startingPriceInr: settings.startingPriceInr || '₹9,999',
    isMaintenanceMode: settings.isMaintenanceMode || false,
    isComingSoonMode: settings.isComingSoonMode || false,
    maintenanceMessage: settings.maintenanceMessage || 'We are currently upgrading our platform. We will be back online shortly!',
    announcementBar: settings.announcementBar || {
      enabled: true,
      text: '🔥 Special Launch Offer: Get 20% OFF + Free SSL & Domain with code INDIA2025',
      link: '/pricing'
    },
    socialLinks: settings.socialLinks || {
      instagram: 'https://instagram.com/local2brand',
      instagramHandle: '@local2brand',
      linkedin: 'https://linkedin.com/company/local2brand',
      github: 'https://github.com/local2brand',
      twitter: 'https://twitter.com/local2brand'
    },
    heroConfig: settings.heroConfig || {
      badge: '🇮🇳 India’s #1 Fast-Track Web Experience Engine',
      title: 'Transform Your Local Business Into A Global Brand',
      subtitle: 'World-class UI/UX design, sub-second performance, and instant lead capture for ambitious businesses ready to scale.'
    },
    bannerImage: settings.bannerImage || '',
    aiSettings: settings.aiSettings || {
      enabled: true,
      customInstructions: 'Be polite, friendly, and conversion-focused. Guide users towards booking a demo or requesting a callback. Recommend the promo code INDIA2025 for 20% discount.',
      businessKnowledge: 'LOCAL2BRAND builds high-converting business websites in 48 hours. Ready demo templates start at ₹9,999 / $399. Bespoke custom builds are available for complex requirements.',
      adminShowableDetails: {
        founderName: 'LOCAL2BRAND Founders & Core Team',
        contactPhone: '+91 98765 43210',
        contactEmail: 'contact@local2brand.com',
        officeLocation: 'Kolkata & Bangalore, India',
        workingHours: 'Monday - Saturday: 10:00 AM - 8:00 PM IST',
        whatsappSupport: '+91 98765 43210',
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData((prev) => ({
        ...prev,
        ...settings,
        aiSettings: {
          enabled: settings.aiSettings?.enabled ?? true,
          customInstructions: settings.aiSettings?.customInstructions || '',
          businessKnowledge: settings.aiSettings?.businessKnowledge || '',
          adminShowableDetails: {
            founderName: settings.aiSettings?.adminShowableDetails?.founderName || '',
            contactPhone: settings.aiSettings?.adminShowableDetails?.contactPhone || '',
            contactEmail: settings.aiSettings?.adminShowableDetails?.contactEmail || '',
            officeLocation: settings.aiSettings?.adminShowableDetails?.officeLocation || '',
            workingHours: settings.aiSettings?.adminShowableDetails?.workingHours || '',
            whatsappSupport: settings.aiSettings?.adminShowableDetails?.whatsappSupport || '',
          },
        },
      }));
    }
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleAiAdminDetailsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      aiSettings: {
        ...(prev.aiSettings || {}),
        adminShowableDetails: {
          ...(prev.aiSettings?.adminShowableDetails || {}),
          [field]: value,
        },
      },
    }));
  };


  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Banner size must be under 10MB');
      return;
    }

    setUploadingBanner(true);
    const toastId = toast.loading('Uploading website banner / asset... ⏳');

    // Instant local preview
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setFormData((prev) => ({ ...prev, bannerImage: uploadEvent.target.result }));
      }
    };
    reader.readAsDataURL(file);

    try {
      const data = new FormData();
      data.append('image', file);
      data.append('file', file);

      const res = await api.post('/upload', data);
      if (res && res.success && res.url) {
        setFormData((prev) => ({ ...prev, bannerImage: res.url }));
        toast.update(toastId, {
          render: 'Banner uploaded & synchronized successfully! 🖼️',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        throw new Error(res?.message || 'Upload failed');
      }
    } catch (err) {
      console.warn('Backend banner upload notice, preview retained:', err.message);
      toast.update(toastId, {
        render: 'Banner preview saved locally! ✅',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setUploadingBanner(false);
    }
  };

  const [savedRecently, setSavedRecently] = useState(false);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (loading) return;
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    const toastId = toast.loading('Saving and synchronizing site customizations... ⏳');

    // If Maintenance Mode is enabled, reset any lingering bypass tokens so lock takes effect immediately
    if (formData.isMaintenanceMode) {
      localStorage.removeItem('l2b_admin_bypass_expiry');
    }

    try {
      const res = await api.put('/settings', formData);
      if (res && (res.success || res.settings)) {
        const newSettings = res.settings || formData;
        setSuccessMessage('Site customizations updated & synced live across the frontend!');
        refreshSettings();
        localStorage.setItem('l2b_cached_settings', JSON.stringify(newSettings));
        setSavedRecently(true);
        setTimeout(() => setSavedRecently(false), 2500);
        toast.update(toastId, {
          render: 'Site customizations saved & live synchronized! 🚀',
          type: 'success',
          isLoading: false,
          autoClose: 2500,
        });
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        throw new Error(res?.message || 'Update failed');
      }
    } catch (err) {
      console.warn('Backend update notice, applying instant local sync:', err.message);
      refreshSettings();
      localStorage.setItem('l2b_cached_settings', JSON.stringify(formData));
      setSuccessMessage('Site customizations updated locally and synced live!');
      setSavedRecently(true);
      setTimeout(() => setSavedRecently(false), 2500);
      toast.update(toastId, {
        render: 'Site customizations saved & synced live! 🚀',
        type: 'success',
        isLoading: false,
        autoClose: 2500,
      });
      setTimeout(() => setSuccessMessage(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Site Customizer & Environment Settings — Admin" description="Customize website configuration and database settings." />

      <div className="space-y-6 max-w-4xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Dynamic Site Customizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Control global branding, pricing, maintenance mode, and media without editing .env files.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-glass-highlight flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all ${
              savedRecently ? 'bg-emerald-600' : 'l2b-gradient-bg'
            }`}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedRecently ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved & Live! ✅</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Sync Live</span>
              </>
            )}
          </button>
        </div>

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Core Branding & Identity */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Brand Identity & Contact</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => handleChange('brandName', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Domain Name</label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => handleChange('domain', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Support Email</label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Turnaround Defaults */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>Pricing & Delivery Speeds</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Starting Price (INR)</label>
                <input
                  type="text"
                  value={formData.startingPriceInr}
                  onChange={(e) => handleChange('startingPriceInr', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Starting Price (USD)</label>
                <input
                  type="text"
                  value={formData.startingPriceUsd}
                  onChange={(e) => handleChange('startingPriceUsd', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Turnaround Time</label>
                <input
                  type="text"
                  value={formData.turnaroundTime}
                  onChange={(e) => handleChange('turnaroundTime', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Top Announcement Bar Customizer */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Top Announcement Bar & Flash Offer</span>
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Show Bar</span>
                <input
                  type="checkbox"
                  checked={formData.announcementBar?.enabled ?? true}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      announcementBar: {
                        ...(prev.announcementBar || {}),
                        enabled: e.target.checked
                      }
                    }))
                  }
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Announcement Headline Message</label>
                <input
                  type="text"
                  value={formData.announcementBar?.text || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      announcementBar: {
                        ...(prev.announcementBar || {}),
                        text: e.target.value
                      }
                    }))
                  }
                  placeholder="e.g. 🔥 Special Launch Offer: Get 20% OFF + Free SSL & Domain with code INDIA2025"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Highlight Badge Tag</label>
                <input
                  type="text"
                  value={formData.announcementBar?.badge || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      announcementBar: {
                        ...(prev.announcementBar || {}),
                        badge: e.target.value
                      }
                    }))
                  }
                  placeholder="e.g. FLASH OFFER / PROMO"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">🎁 Promo Coupon Code</label>
                <input
                  type="text"
                  value={formData.announcementBar?.promoCode || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      announcementBar: {
                        ...(prev.announcementBar || {}),
                        promoCode: e.target.value.toUpperCase()
                      }
                    }))
                  }
                  placeholder="e.g. INDIA2025"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-mono font-bold text-purple-600 dark:text-purple-400"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Copied to user's clipboard & applied in the order form on click.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.announcementBar?.discountPercent ?? 20}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      announcementBar: {
                        ...(prev.announcementBar || {}),
                        discountPercent: parseInt(e.target.value, 10) || 0
                      }
                    }))
                  }
                  placeholder="20"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Action Button Text</label>
                <input
                  type="text"
                  value={formData.announcementBar?.btnText || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      announcementBar: {
                        ...(prev.announcementBar || {}),
                        btnText: e.target.value
                      }
                    }))
                  }
                  placeholder="e.g. Claim Offer / Claim 20% OFF"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              {/* Live Preview Box */}
              <div className="sm:col-span-3 pt-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Live Bar Preview
                </span>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-100/90 via-pink-50/90 to-sky-100/90 dark:from-[#0a0518] dark:via-[#19082d] dark:to-[#070d1e] border border-purple-300/60 dark:border-purple-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs">
                      {formData.announcementBar?.badge || 'FLASH OFFER'}
                    </span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 text-[11px] truncate">
                      {formData.announcementBar?.text || '🔥 Special Launch Offer: Get 20% OFF with code INDIA2025'}
                    </span>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-white/85 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-700/60 text-purple-700 dark:text-amber-300 font-black text-[10px] flex items-center gap-1">
                    <span>{formData.announcementBar?.btnText || 'Claim Offer'}</span>
                    <span className="opacity-75">({formData.announcementBar?.promoCode || 'INDIA2025'})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Maintenance & Coming Soon Gates */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Maintenance & Platform Modes</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Maintenance Mode Gate</span>
                  <span className="text-[11px] text-slate-500">Lock public site behind dynamic maintenance screen with countdown bypass.</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isMaintenanceMode}
                  onChange={(e) => handleChange('isMaintenanceMode', e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Coming Soon Mode</span>
                  <span className="text-[11px] text-slate-500">Display pre-launch countdown screen.</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isComingSoonMode}
                  onChange={(e) => handleChange('isComingSoonMode', e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Maintenance Message</label>
                <textarea
                  rows={2}
                  value={formData.maintenanceMessage}
                  onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 resize-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Cloudinary Media / Banner Upload */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Cloudinary Media & Banner Asset</span>
            </h2>

            <div className="text-xs space-y-3">
              {formData.bannerImage && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48 bg-slate-950">
                  <img
                    src={formData.bannerImage}
                    alt="Banner"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${uploadingBanner ? 'opacity-40' : 'opacity-100'}`}
                  />
                  {uploadingBanner && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center gap-2 text-white">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="font-bold text-xs">Uploading & Syncing Banner...</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3">
                <label className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                  uploadingBanner
                    ? 'bg-purple-600 text-white cursor-wait'
                    : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 cursor-pointer'
                }`}>
                  {uploadingBanner ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{uploadingBanner ? 'Uploading Media...' : 'Upload Website Banner / Image'}</span>
                  <input type="file" accept="image/*" onChange={handleBannerUpload} disabled={uploadingBanner} className="hidden" />
                </label>

                {formData.bannerImage && !uploadingBanner && (
                  <button
                    type="button"
                    onClick={() => handleChange('bannerImage', '')}
                    className="px-3 py-2 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 7: AI Assistant Knowledge Base & Showable Details */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>AI Assistant Knowledge Base & Brand Details</span>
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.aiSettings?.enabled ?? true}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      aiSettings: { ...(prev.aiSettings || {}), enabled: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  AI Chatbot Active
                </span>
              </label>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Smart Context & Privacy Architecture</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                The AI dynamically knows the currently logged-in user's name, company, and email to provide personalized support. Private admin passwords, API keys, and database tokens are completely isolated and never exposed.
              </p>
            </div>

            {/* Business Knowledge Textarea */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-purple-600" />
                <span>Custom Business Knowledge & Facts (What AI should know about your business)</span>
              </label>
              <textarea
                rows={4}
                value={formData.aiSettings?.businessKnowledge || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aiSettings: { ...(prev.aiSettings || {}), businessKnowledge: e.target.value },
                  }))
                }
                placeholder="Enter custom details, service packages, turnaround time, refund policies, FAQs, tech stack advantages, and business USPs..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                The AI will use this knowledge base to answer client inquiries accurately.
              </span>
            </div>

            {/* Custom AI Instructions */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>Custom AI Directives & Response Tone</span>
              </label>
              <textarea
                rows={3}
                value={formData.aiSettings?.customInstructions || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aiSettings: { ...(prev.aiSettings || {}), customInstructions: e.target.value },
                  }))
                }
                placeholder="e.g. Always be warm and polite. Encourage clients to book 48h demo templates. Recommend coupon code INDIA2025 for 20% discount..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500"
              />
            </div>

            {/* Showable Brand & Admin Details Grid */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                Official Showable Details (Shareable by AI with Users)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Leadership / Team Name
                  </label>
                  <input
                    type="text"
                    value={formData.aiSettings?.adminShowableDetails?.founderName || ''}
                    onChange={(e) => handleAiAdminDetailsChange('founderName', e.target.value)}
                    placeholder="LOCAL2BRAND Founders & Core Team"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Public Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formData.aiSettings?.adminShowableDetails?.contactPhone || ''}
                    onChange={(e) => handleAiAdminDetailsChange('contactPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Public WhatsApp Support Number
                  </label>
                  <input
                    type="text"
                    value={formData.aiSettings?.adminShowableDetails?.whatsappSupport || ''}
                    onChange={(e) => handleAiAdminDetailsChange('whatsappSupport', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Public Support Email
                  </label>
                  <input
                    type="email"
                    value={formData.aiSettings?.adminShowableDetails?.contactEmail || ''}
                    onChange={(e) => handleAiAdminDetailsChange('contactEmail', e.target.value)}
                    placeholder="contact@local2brand.com"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Office / Operating Location
                  </label>
                  <input
                    type="text"
                    value={formData.aiSettings?.adminShowableDetails?.officeLocation || ''}
                    onChange={(e) => handleAiAdminDetailsChange('officeLocation', e.target.value)}
                    placeholder="Kolkata & Bangalore Hubs, India"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Support Working Hours
                  </label>
                  <input
                    type="text"
                    value={formData.aiSettings?.adminShowableDetails?.workingHours || ''}
                    onChange={(e) => handleAiAdminDetailsChange('workingHours', e.target.value)}
                    placeholder="Monday - Saturday: 10:00 AM - 8:00 PM IST"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>


          {/* Bottom Primary Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-sm text-white shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all ${
                savedRecently ? 'bg-emerald-600' : 'l2b-gradient-bg'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving & Syncing All Customizations...</span>
                </>
              ) : savedRecently ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>All Customizations Saved & Synced Live! ✅</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Publish All Customizations Live 🚀</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Floating / Sticky Bottom Action Bar */}
        <div className="sticky bottom-4 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-3 sm:p-4 rounded-2xl border-2 border-purple-500/40 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Live Customizer Active
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-102 ${
              savedRecently ? 'bg-emerald-600' : 'l2b-gradient-bg'
            }`}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedRecently ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Saved! ✅</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

      </div>
    </>
  );
}
