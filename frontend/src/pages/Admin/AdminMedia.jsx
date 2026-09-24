import React, { useState, useEffect, useRef } from 'react';
import {
  Cloud,
  HardDrive,
  Image as ImageIcon,
  Trash2,
  UploadCloud,
  RefreshCw,
  Search,
  ExternalLink,
  Copy,
  Check,
  Filter,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Layers,
  Sparkles,
  ShieldCheck,
  FileText,
  Video,
  Globe,
  Play,
  X,
  ShieldAlert,
  Server,
  Database,
  Activity,
  ArrowRightLeft,
  Save,
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { uploadWithToast } from '../../utils/toastUpload';
import AshokaChakra from '../../components/common/AshokaChakra';
import { SEO } from '../../components/common/CommonUI';
import DashboardLoader from '../../components/common/DashboardLoader';
import { COUNTRY_CULTURAL_THEMES } from '../../data/countryThemes';

export default function AdminMedia() {
  const [activeTab, setActiveTab] = useState('country_themes'); // 'country_themes' | 'library' | 'multi_cloud'
  const [usage, setUsage] = useState(null);
  const [hubInfo, setHubInfo] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Country Themes Media State
  const [countryThemes, setCountryThemes] = useState(() => {
    try {
      const cached = localStorage.getItem('l2b_country_themes_cache');
      if (cached && !cached.includes('tm2pwzjj')) {
        return JSON.parse(cached);
      }
      if (cached && cached.includes('tm2pwzjj')) {
        localStorage.removeItem('l2b_country_themes_cache');
      }
    } catch (e) {}

    const initial = {};
    Object.keys(COUNTRY_CULTURAL_THEMES).forEach((c) => {
      initial[c] = {
        videoBg: COUNTRY_CULTURAL_THEMES[c].videoBg || '',
        videoPoster: COUNTRY_CULTURAL_THEMES[c].videoPoster || '',
      };
    });
    return initial;
  });
  const [isSavingThemes, setIsSavingThemes] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState(null); // { country, field: 'videoBg' | 'videoPoster' }
  const activeUploadTargetRef = useRef({ country: null, field: null });
  const countryVideoInputRef = useRef(null);
  const countryImageInputRef = useRef(null);

  const fetchMediaData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setIsRefreshing(true);

      const [usageRes, mediaRes, settingsRes, eventsRes] = await Promise.allSettled([
        api.get('/media/usage'),
        api.get('/media/all?max_results=100'),
        api.get('/settings'),
        api.get('/media/events?limit=30')
      ]);

      if (usageRes.status === 'fulfilled' && usageRes.value?.success) {
        setUsage(usageRes.value.usage);
        if (usageRes.value.hub) {
          setHubInfo(usageRes.value.hub);
        }
      }

      if (mediaRes.status === 'fulfilled' && mediaRes.value?.success) {
        setMediaList(mediaRes.value.resources || []);
      }

      if (eventsRes.status === 'fulfilled' && eventsRes.value?.success) {
        setEventsList(eventsRes.value.events || []);
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value?.settings?.countryThemes) {
        const savedThemes = settingsRes.value.settings.countryThemes;
        const sanitized = {};
        Object.keys(COUNTRY_CULTURAL_THEMES).forEach((c) => {
          const override = savedThemes[c] || {};
          const isInvalidVideo = !override.videoBg || override.videoBg.includes('tm2pwzjj');
          const isInvalidPoster = !override.videoPoster || override.videoPoster.includes('tm2pwzjj');
          sanitized[c] = {
            videoBg: isInvalidVideo ? (COUNTRY_CULTURAL_THEMES[c]?.videoBg || '') : override.videoBg,
            videoPoster: isInvalidPoster ? (COUNTRY_CULTURAL_THEMES[c]?.videoPoster || '') : override.videoPoster,
          };
        });
        setCountryThemes(sanitized);
        try {
          localStorage.setItem('l2b_country_themes_cache', JSON.stringify(sanitized));
        } catch (e) {}
      }

      if (!silent) {
        toast.success('✨ Multi-Cloud metrics and assets synced!', { autoClose: 1800 });
      }
    } catch (err) {
      console.error('Error loading media assets:', err);
      if (!silent) {
        toast.error('Failed to sync Storage data');
      }
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleTriggerBackup = async (target = 'imagekit') => {
    try {
      setIsBackingUp(true);
      toast.info(`🔄 Initiating backup migration to ${target.toUpperCase()}...`);
      const res = await api.post('/media/backup', { targetProvider: target });
      if (res?.success) {
        toast.success(`✅ Backup completed! ${res.backedUpCount} asset(s) copied to ${target}.`);
        fetchMediaData(true);
      } else {
        toast.warn(res?.message || 'Backup notice: Target provider not configured in .env');
      }
    } catch (err) {
      toast.error(`❌ Backup error: ${err.message}`);
    } finally {
      setIsBackingUp(false);
    }
  };

  useEffect(() => {
    fetchMediaData(true);
  }, []);

  // Trigger dedicated file selector for Video or Image
  const triggerCountryUpload = (country, field) => {
    activeUploadTargetRef.current = { country, field };

    if (field === 'videoBg') {
      if (countryVideoInputRef.current) {
        countryVideoInputRef.current.value = '';
        countryVideoInputRef.current.click();
      }
    } else {
      if (countryImageInputRef.current) {
        countryImageInputRef.current.value = '';
        countryImageInputRef.current.click();
      }
    }
  };

  // Handle Cloudinary Upload for Country Videos and Posters
  const handleCountryMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    const target = activeUploadTargetRef.current;
    if (!file || !target || !target.country) {
      setUploadingTarget(null);
      activeUploadTargetRef.current = { country: null, field: null };
      return;
    }

    const { country, field } = target;
    const isVideoField = field === 'videoBg';
    setUploadingTarget({ country, field });

    try {
      const res = await uploadWithToast({
        file,
        title: `Uploading ${country} ${isVideoField ? 'Video' : 'Poster'}`,
        successMessage: `🎉 ${country} ${isVideoField ? 'Video' : 'Poster'} uploaded & saved!`,
      });

      if (res?.success && (res.url || res.urls?.[0])) {
        const uploadedUrl = res.url || res.urls[0];
        
        const updated = {
          ...countryThemes,
          [country]: {
            ...(countryThemes[country] || {}),
            [field]: uploadedUrl,
          }
        };

        setCountryThemes(updated);

        // Auto persist to settings
        await api.put('/settings', { countryThemes: updated });
        try {
          localStorage.setItem('l2b_country_themes_cache', JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('l2b_country_themes_updated', { detail: updated }));
          const bc = new BroadcastChannel('l2b_country_themes_sync');
          bc.postMessage({ type: 'THEMES_UPDATED', themes: updated });
          bc.close();
        } catch (err) {}

        fetchMediaData(true);
      }
    } catch (err) {
      console.error('Country media upload error:', err);
    } finally {
      setUploadingTarget(null);
      activeUploadTargetRef.current = { country: null, field: null };
      if (e.target) e.target.value = '';
    }
  };

  // Save all country themes
  const handleSaveCountryThemes = async () => {
    setIsSavingThemes(true);
    try {
      const res = await api.put('/settings', { countryThemes });
      if (res?.success) {
        try {
          localStorage.setItem('l2b_country_themes_cache', JSON.stringify(countryThemes));
          window.dispatchEvent(new CustomEvent('l2b_country_themes_updated', { detail: countryThemes }));
          const bc = new BroadcastChannel('l2b_country_themes_sync');
          bc.postMessage({ type: 'THEMES_UPDATED', themes: countryThemes });
          bc.close();
        } catch (e) {}
        toast.success('🎉 Country Video & Poster themes saved and broadcasted live!');
      } else {
        throw new Error(res?.message || 'Failed to save');
      }
    } catch (err) {
      toast.error(`Error saving country themes: ${err.message}`);
    } finally {
      setIsSavingThemes(false);
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('Cloudinary CDN URL copied to clipboard! 📋');
    setTimeout(() => setCopiedUrl(''), 3000);
  };

  const handleDeleteSingle = async (item, e) => {
    if (e) e.stopPropagation();
    const publicId = item.public_id;
    if (!window.confirm(`⚠️ Permanently delete media "${publicId}" from Cloudinary storage?`)) return;

    try {
      const res = await api.delete(`/media/${encodeURIComponent(publicId)}`);
      if (res?.success) {
        setMediaList((prev) => prev.filter((m) => m.public_id !== publicId));
        setSelectedIds((prev) => prev.filter((id) => id !== publicId));
        toast.success(`Media deleted from Cloudinary.`);
        fetchMediaData(true);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete media from Cloudinary');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`⚠️ Permanently delete ${selectedIds.length} selected asset(s) from Cloudinary storage?`)) return;

    try {
      const res = await api.post('/media/delete-bulk', { public_ids: selectedIds });
      if (res?.success) {
        setMediaList((prev) => prev.filter((m) => !selectedIds.includes(m.public_id)));
        setSelectedIds([]);
        toast.success(`${selectedIds.length} asset(s) deleted from Cloudinary.`);
        fetchMediaData(true);
      }
    } catch (err) {
      toast.error(err.message || 'Bulk deletion failed');
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const res = await uploadWithToast({
        files,
        title: `Uploading ${files.length} file(s) to Cloud`,
        successMessage: `🎉 ${files.length} file(s) uploaded to Cloudinary!`,
      });
      if (res?.success) {
        fetchMediaData(true);
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.public_id.toLowerCase().includes(q) ||
      m.format?.toLowerCase().includes(q) ||
      m.folder?.toLowerCase().includes(q)
    );
  });

  const toggleSelect = (publicId) => {
    setSelectedIds((prev) =>
      prev.includes(publicId) ? prev.filter((id) => id !== publicId) : [...prev, publicId]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredMedia.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMedia.map((m) => m.public_id));
    }
  };

  return (
    <>
      <SEO title="Cloudinary Storage & Media Manager — Admin" description="Live cloud storage usage metrics and media manager." noindex={true} robots="noindex, nofollow" />

      <div className="space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Cloud size={12} />
              <span>Cloudinary CDN &amp; Asset Vault</span>
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Cloud Storage &amp; Media ({mediaList.length})
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Cloud Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor real-time storage quota, remaining space, upload 2GB videos &amp; manage all country themes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,video/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload Media'}</span>
            </button>

            <button
              type="button"
              onClick={() => fetchMediaData(false)}
              disabled={isRefreshing}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
              title="Refresh cloud metrics & images"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ALWAYS-VISIBLE LIVE CLOUDINARY STORAGE & METRICS CARDS */}
        {/* ========================================================================= */}
        {usage && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Storage Quota Meter */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Storage Used / Limit</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <HardDrive className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {usage.storage?.usedFormatted || '0 Bytes'}
                </div>
                <div className="text-[11px] text-slate-500">
                  of <strong>{usage.storage?.limitFormatted || '25 GB'}</strong> Max Tier
                </div>
              </div>
              <div className="space-y-1">
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(1, usage.storage?.percent || 0))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>{usage.storage?.percent || 0}% Used</span>
                  <span>{(100 - (usage.storage?.percent || 0)).toFixed(1)}% Free</span>
                </div>
              </div>
            </div>

            {/* 2. Total Objects / Media */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Cloud Objects</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {usage.resources || mediaList.length}
                </div>
                <div className="text-[11px] text-slate-500">
                  Active video &amp; image assets
                </div>
              </div>
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cloudinary CDN Accelerated</span>
              </div>
            </div>

            {/* 3. Bandwidth Traffic */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Monthly Bandwidth</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Cloud className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {usage.bandwidth?.usedFormatted || '0 Bytes'}
                </div>
                <div className="text-[11px] text-slate-500">
                  Global edge CDN delivery
                </div>
              </div>
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Latency Delivery</span>
              </div>
            </div>

            {/* 4. Account Plan & Cloud Details */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Cloud Instance</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono truncate">
                  {usage.cloudName || 'rqfwenpk'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {usage.plan || 'Free Tier Plan'}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Credits Used: {usage.credits?.used || 0} / {usage.credits?.limit || 25}
              </div>
            </div>

          </div>
        )}

        {/* Dedicated Hidden File Inputs for Videos and Posters */}
        <input
          type="file"
          ref={countryVideoInputRef}
          onChange={handleCountryMediaUpload}
          onCancel={() => {
            setUploadingTarget(null);
            activeUploadTargetRef.current = { country: null, field: null };
          }}
          accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
          className="hidden"
        />
        <input
          type="file"
          ref={countryImageInputRef}
          onChange={handleCountryMediaUpload}
          onCancel={() => {
            setUploadingTarget(null);
            activeUploadTargetRef.current = { country: null, field: null };
          }}
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/*"
          className="hidden"
        />

        {/* Automatic Multi-Cloud Failover Alert Banner */}
        {hubInfo?.isFailoverActive && (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>⚠️ Storage Failover Engine Active</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-[10px] font-bold">
                    AUTO-PROTECTED
                  </span>
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Primary Cloudinary provider is currently degraded/standby. Uploads are seamlessly protected and routed through fallback providers (ImageKit / Cloudflare R2 / Server NVMe Buffer) with 0% downtime.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('multi_cloud')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-md transition-all active:scale-95"
            >
              Inspect Hub Status ➜
            </button>
          </div>
        )}

        {/* Tab Navigation Switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('country_themes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'country_themes'
                ? 'bg-gradient-to-r from-orange-500 via-purple-600 to-emerald-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>🌍 Country Videos &amp; Posters ({Object.keys(COUNTRY_CULTURAL_THEMES).length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'library'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Cloud Asset Vault ({mediaList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('multi_cloud')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'multi_cloud'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>🛡️ Multi-Cloud Hub &amp; Telemetry</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: COUNTRY CULTURAL THEME VIDEOS & POSTER IMAGES MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'country_themes' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Save All Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900/40 via-slate-900/90 to-indigo-900/40 border border-purple-500/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌍</span>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    Country Cultural Theme Videos &amp; Poster Media
                  </h2>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Upload up to 2 GB Cloudinary background videos &amp; high-res poster images for each country. Streamed directly via Cloudinary CDN edge nodes with zero lag.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveCountryThemes}
                disabled={isSavingThemes}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50 shrink-0"
              >
                {isSavingThemes ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving Themes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save All Country Media
                  </>
                )}
              </button>
            </div>

            {/* Country Media Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.keys(COUNTRY_CULTURAL_THEMES).map((countryKey) => {
                const baseInfo = COUNTRY_CULTURAL_THEMES[countryKey];
                const currentData = countryThemes[countryKey] || { videoBg: '', videoPoster: '' };
                const hasCloudinaryVideo = currentData.videoBg?.includes('cloudinary.com');

                return (
                  <div
                    key={countryKey}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 hover:border-purple-500/50 transition-all"
                  >
                    {/* Country Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl select-none">{baseInfo.flag}</span>
                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                            {countryKey}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                              {baseInfo.currency} ({baseInfo.symbol})
                            </span>
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                            {baseInfo.subGreeting || baseInfo.tagline}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        {baseInfo.festiveMotif || '✨'}
                      </span>
                    </div>

                    {/* Background Video Section */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          Background Video (MP4 / WebM / Cloudinary / YouTube)
                        </label>
                        {currentData.videoBg && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            hasCloudinaryVideo 
                              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60' 
                              : 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60'
                          }`}>
                            {hasCloudinaryVideo ? '⚡ Cloudinary CDN Active' : '⚡ High-Speed CDN Active'}
                          </span>
                        )}

                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentData.videoBg || ''}
                          onChange={(e) => {
                            setCountryThemes({
                              ...countryThemes,
                              [countryKey]: {
                                ...currentData,
                                videoBg: e.target.value,
                              }
                            });
                          }}
                          placeholder="e.g. https://res.cloudinary.com/.../video.mp4"
                          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-purple-600"
                        />

                        <button
                          type="button"
                          onClick={() => triggerCountryUpload(countryKey, 'videoBg')}
                          disabled={uploadingTarget?.country === countryKey && uploadingTarget?.field === 'videoBg'}
                          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95 shrink-0 disabled:opacity-50"
                          title="Upload video file directly to Cloudinary (Opens MP4, WebM, MOV)"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{uploadingTarget?.country === countryKey && uploadingTarget?.field === 'videoBg' ? 'Uploading...' : 'Upload Video'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Poster Image Section */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        Poster Image (Fallback for Network / Loading)
                      </label>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentData.videoPoster || ''}
                          onChange={(e) => {
                            setCountryThemes({
                              ...countryThemes,
                              [countryKey]: {
                                ...currentData,
                                videoPoster: e.target.value,
                              }
                            });
                          }}
                          placeholder="e.g. https://res.cloudinary.com/.../poster.jpg"
                          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-purple-600"
                        />

                        <button
                          type="button"
                          onClick={() => triggerCountryUpload(countryKey, 'videoPoster')}
                          disabled={uploadingTarget?.country === countryKey && uploadingTarget?.field === 'videoPoster'}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95 shrink-0 disabled:opacity-50"
                          title="Upload poster image directly to Cloudinary (Opens JPG, PNG, WEBP)"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{uploadingTarget?.country === countryKey && uploadingTarget?.field === 'videoPoster' ? 'Uploading...' : 'Upload Image'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Live Interactive Video Preview Container */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Play className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          <span>Video &amp; Poster Live Preview:</span>
                        </span>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-normal">
                          Hover card to play video
                        </span>
                      </div>

                      <div 
                        className="relative h-40 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-md group cursor-pointer"
                        onMouseEnter={(e) => {
                          const v = e.currentTarget.querySelector('video');
                          if (v) {
                            v.muted = true;
                            v.currentTime = 0;
                            v.play().catch(() => {});
                          }
                        }}
                        onMouseLeave={(e) => {
                          const v = e.currentTarget.querySelector('video');
                          if (v) {
                            v.pause();
                            v.currentTime = 0;
                          }
                        }}
                      >
                        {/* 1. Poster Image (Visible when resting) */}
                        {currentData.videoPoster ? (
                          <img
                            src={currentData.videoPoster}
                            alt={`${countryKey} Poster`}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-0"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-500 text-xs">
                            No Poster Image Set
                          </div>
                        )}

                        {/* 2. Video Element (Fades in & plays continuously on hover) */}
                        {currentData.videoBg && 
                         !currentData.videoBg.includes('youtube') && 
                         !currentData.videoBg.includes('tm2pwzjj') && 
                         !currentData.videoBg.includes('mixkit.co') && 
                         !currentData.videoBg.includes('googleapis.com') && (
                          <video
                            src={currentData.videoBg}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-100 group-hover:scale-105"
                          />
                        )}

                        {/* 3. Top Badges (Resting vs Playing) */}
                        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                          {/* Idle Badge */}
                          <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white/90 border border-white/10 flex items-center gap-1 group-hover:hidden transition-all">
                            <Play className="w-2.5 h-2.5 text-purple-400 fill-purple-400" />
                            <span>Preview</span>
                          </div>

                          {/* Hover Active Badge */}
                          <div className="hidden group-hover:flex px-2 py-0.5 rounded-full bg-purple-600/90 backdrop-blur-md text-[10px] font-extrabold text-white border border-purple-400/40 items-center gap-1 shadow-lg animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>Playing Video</span>
                          </div>
                        </div>

                        {/* 4. Bottom Title Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-3 pointer-events-none">
                          <div className="w-full flex items-center justify-between">
                            <div className="text-white text-xs font-bold truncate flex items-center gap-1.5 drop-shadow-md">
                              <span>{baseInfo.flag}</span>
                              <span>{countryKey} Theme Preview</span>
                            </div>
                            <span className="text-[10px] text-slate-300 font-mono bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                              {currentData.videoBg && !currentData.videoBg.includes('tm2pwzjj') && !currentData.videoBg.includes('mixkit.co') && !currentData.videoBg.includes('googleapis.com') ? '1080p Stream' : 'No Custom Video'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                );
              })}
            </div>

            {/* Bottom Save Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Click "Save All Country Media" after making edits or uploading new videos.
              </span>
              <button
                type="button"
                onClick={handleSaveCountryThemes}
                disabled={isSavingThemes}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingThemes ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CLOUD ASSET VAULT (ALL ASSETS: IMAGES & VIDEOS) */}
        {/* ========================================================================= */}
        {activeTab === 'library' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Search & Bulk Action Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by filename, format, or folder..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={selectAll}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {selectedIds.length === filteredMedia.length && filteredMedia.length > 0 ? 'Deselect All' : 'Select All'}
                </button>

                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedIds.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Media Grid */}
            {loading && mediaList.length === 0 ? (
              <div className="py-16 flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <DashboardLoader
                  title="Connecting to Cloud Asset Vault..."
                  subtitle="Fetching uploaded brand assets, videos, client logos, and media files..."
                />
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">No media assets found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery ? 'No media matches your search query.' : 'Upload your first image or video to sync it to Cloud CDN.'}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Media</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {filteredMedia.map((item) => {
                  const isSelected = selectedIds.includes(item.public_id);
                  const isVideo = item.resource_type === 'video' || item.format === 'mp4' || item.format === 'webm';

                  return (
                    <div
                      key={item.public_id}
                      className={`group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border transition-all ${
                        isSelected
                          ? 'border-purple-600 ring-2 ring-purple-600/30 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 shadow-xs'
                      }`}
                    >
                      {/* Top Checkbox */}
                      <div className="absolute top-2 left-2 z-10">
                        <button
                          type="button"
                          onClick={() => toggleSelect(item.public_id)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-black/40 text-white/80 hover:bg-black/70'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : <div className="w-3 h-3 rounded-xs border border-white/80" />}
                        </button>
                      </div>

                      {/* Top Format & Size Tag */}
                      <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-white font-mono text-[9px] font-bold uppercase">
                          {item.format}
                        </span>
                      </div>

                      {/* Image / Video Preview */}
                      <div
                        onClick={() => setPreviewImage(item)}
                        className="relative aspect-square bg-slate-950 overflow-hidden cursor-pointer group-hover:opacity-95"
                      >
                        {isVideo ? (
                          <div className="w-full h-full relative bg-slate-900 flex items-center justify-center">
                            <video
                              src={item.secure_url}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                              onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                              onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:opacity-0 transition-opacity">
                              <div className="w-9 h-9 rounded-full bg-purple-600/80 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                                <Play className="w-4 h-4 fill-white ml-0.5" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={item.secure_url}
                            alt={item.public_id}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <div className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                            <Maximize2 className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Info Footer */}
                      <div className="p-3 space-y-2 text-xs">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate text-[11px]" title={item.public_id}>
                            {item.public_id.split('/').pop()}
                          </h4>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>{item.sizeFormatted}</span>
                            {item.width && <span>{item.width}x{item.height}</span>}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(item.secure_url)}
                            className="flex-1 py-1 px-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-600 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            title="Copy CDN link"
                          >
                            {copiedUrl === item.secure_url ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedUrl === item.secure_url ? 'Copied' : 'Link'}</span>
                          </button>

                          <a
                            href={item.secure_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Open in new tab"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteSingle(item, e)}
                            className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Delete from Cloudinary"
                          >
                            <Trash2 className="w-3 h-3" />
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

        {/* ========================================================================= */}
        {/* TAB 3: MULTI-CLOUD STORAGE HUB & REAL-TIME TELEMETRY CONTROL CENTER */}
        {/* ========================================================================= */}
        {activeTab === 'multi_cloud' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Hub Header & Status Summary */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛡️</span>
                    <h3 className="text-lg font-black text-white">Multi-Cloud Storage Hub &amp; Automatic Failover Architecture</h3>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    Production-safe multi-provider storage engine. Primary uploads route to Cloudinary with automatic circuit-breaker failover to ImageKit and persistent Object Storage, guaranteeing zero data loss.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Multi-Cloud Failover: ONLINE</span>
                  </div>
                </div>
              </div>

              {/* Quick Hub Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. PRIMARY STORAGE</span>
                  <div className="text-sm font-black text-white font-mono mt-0.5">Cloudinary CDN (25 GB)</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2. AUTOMATIC FAILOVER (ACTIVE)</span>
                  <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">ImageKit.io (20 GB Global CDN)</div>
                </div>
              </div>
            </div>

            {/* Provider Health Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Cloudinary */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-black text-sm text-slate-900 dark:text-white">Cloudinary</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    hubInfo?.providers?.find(p => p.name === 'cloudinary')?.status === 'HEALTHY'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}>
                    {hubInfo?.providers?.find(p => p.name === 'cloudinary')?.status || 'STANDBY'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex justify-between"><span>Role:</span><strong className="text-purple-600 dark:text-purple-400 font-mono">PRIMARY ENGINE</strong></div>
                  <div className="flex justify-between"><span>Free Tier Quota:</span><strong className="text-slate-700 dark:text-slate-300 font-mono">25 GB High-Speed CDN</strong></div>
                  <div className="flex justify-between"><span>Circuit Breaker:</span><strong className="text-slate-700 dark:text-slate-300 font-mono">Threshold: 5 Consecutive Failures</strong></div>
                </div>
              </div>

              {/* 2. ImageKit.io */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-black text-sm text-slate-900 dark:text-white">ImageKit.io</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {hubInfo?.providers?.find(p => p.name === 'imagekit')?.status || 'HEALTHY'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex justify-between"><span>Role:</span><strong className="text-emerald-600 dark:text-emerald-400 font-mono">AUTOMATIC FAILOVER</strong></div>
                  <div className="flex justify-between"><span>Free Tier Quota:</span><strong className="text-slate-700 dark:text-slate-300 font-mono">20 GB Bandwidth &amp; Media</strong></div>
                  <div className="flex justify-between"><span>Active State:</span><strong className="text-emerald-600 dark:text-emerald-400 font-mono">Connected &amp; Serving</strong></div>
                </div>
              </div>
            </div>


            {/* One-Click Backup Migration Control Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Non-Destructive Cloud Backup &amp; Media Replication Engine</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Safely scan and replicate active media assets to your ImageKit.io persistent storage. Originals on Cloudinary are never deleted, renamed, or modified.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTriggerBackup('imagekit')}
                    disabled={isBackingUp}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    {isBackingUp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Replicating Assets to ImageKit...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Replicate Media to ImageKit.io</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Storage Event Audit Log Table */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Real-Time Storage Event Telemetry &amp; Failover Audit Log</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-400">Showing last {eventsList.length} events</span>
              </div>

              {eventsList.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-mono">
                  No storage failover events recorded yet. All uploads will be logged here in real-time.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                        <th className="py-2.5 px-3">Event Type</th>
                        <th className="py-2.5 px-3">Provider</th>
                        <th className="py-2.5 px-3">Latency</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Message</th>
                        <th className="py-2.5 px-3">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                      {eventsList.map((evt, idx) => (
                        <tr key={evt._id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] ${
                              evt.eventType === 'FAILOVER_TRIGGERED' || evt.eventType === 'FAILOVER' ? 'bg-amber-500/20 text-amber-400 font-black' :
                              evt.eventType === 'UPLOAD_SUCCESS' ? 'bg-emerald-500/15 text-emerald-400' :
                              evt.eventType === 'PROVIDER_RECOVERED' ? 'bg-blue-500/20 text-blue-400' :
                              evt.eventType === 'UPLOAD_FAILED' || evt.eventType === 'DELETE_FAILED' ? 'bg-rose-500/20 text-rose-400' :
                              'bg-slate-700 text-slate-300'
                            }`}>
                              {evt.eventType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 uppercase text-purple-400 font-bold">{evt.provider}</td>
                          <td className="py-2.5 px-3 text-slate-400">{evt.durationMs ? `${evt.durationMs}ms` : '—'}</td>
                          <td className="py-2.5 px-3">
                            <span className={evt.success ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                              {evt.success ? 'SUCCESS' : 'FAILED'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 truncate max-w-xs">{evt.message}</td>
                          <td className="py-2.5 px-3 text-slate-400 text-[10px]">
                            {new Date(evt.createdAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Full Image / Video Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in"
            onClick={() => setPreviewImage(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-md font-mono">
                    {previewImage.public_id}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {previewImage.width ? `${previewImage.width}x${previewImage.height} • ` : ''}{previewImage.sizeFormatted} • {previewImage.format?.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[70vh] flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden">
                {previewImage.resource_type === 'video' || previewImage.format === 'mp4' || previewImage.format === 'webm' ? (
                  <video
                    src={previewImage.secure_url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[70vh] w-auto rounded-xl shadow-2xl"
                  />
                ) : (
                  <img
                    src={previewImage.secure_url}
                    alt={previewImage.public_id}
                    className="max-h-[70vh] w-auto object-contain rounded-xl"
                  />
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleCopyLink(previewImage.secure_url)}
                  className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Cloud CDN URL</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      handleDeleteSingle(previewImage, e);
                      setPreviewImage(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </button>
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
