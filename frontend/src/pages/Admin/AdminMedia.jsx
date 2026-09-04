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
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';
import { SEO } from '../../components/common/CommonUI';

export default function AdminMedia() {
  const [usage, setUsage] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState('');
  const fileInputRef = useRef(null);

  const fetchMediaData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setIsRefreshing(true);

      const [usageRes, mediaRes] = await Promise.allSettled([
        api.get('/media/usage'),
        api.get('/media/all?max_results=100')
      ]);

      if (usageRes.status === 'fulfilled' && usageRes.value?.success) {
        setUsage(usageRes.value.usage);
      }

      if (mediaRes.status === 'fulfilled' && mediaRes.value?.success) {
        setMediaList(mediaRes.value.resources || []);
      }
    } catch (err) {
      console.error('Error loading media assets:', err);
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMediaData();
  }, []);

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('Cloudinary CDN URL copied to clipboard! 📋');
    setTimeout(() => setCopiedUrl(''), 3000);
  };

  const handleDeleteSingle = async (item, e) => {
    if (e) e.stopPropagation();
    const publicId = item.public_id;
    if (!window.confirm(`⚠️ Permanently delete image "${publicId}" from Cloudinary storage?`)) return;

    try {
      const res = await api.delete(`/media/${encodeURIComponent(publicId)}`);
      if (res?.success) {
        setMediaList((prev) => prev.filter((m) => m.public_id !== publicId));
        setSelectedIds((prev) => prev.filter((id) => id !== publicId));
        toast.success(`Image deleted from Cloudinary.`);
        fetchMediaData(true);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete media from Cloudinary');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`⚠️ Permanently delete ${selectedIds.length} selected image(s) from Cloudinary storage?`)) return;

    try {
      const res = await api.post('/media/delete-bulk', { public_ids: selectedIds });
      if (res?.success) {
        setMediaList((prev) => prev.filter((m) => !selectedIds.includes(m.public_id)));
        setSelectedIds([]);
        toast.success(`${selectedIds.length} image(s) deleted from Cloudinary.`);
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
    const toastId = toast.loading(`Uploading ${files.length} image(s) to Cloudinary... ☁️`);

    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));

    try {
      const res = await api.post('/upload', formData);
      if (res?.success) {
        toast.update(toastId, {
          render: `${files.length} image(s) uploaded to Cloudinary successfully! 🎉`,
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
        fetchMediaData(true);
      }
    } catch (err) {
      toast.update(toastId, {
        render: `Upload failed: ${err.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 4000
      });
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
      <SEO title="Cloudinary Storage & Media Manager — Admin" description="Live cloud storage usage metrics and media manager." />

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
              Monitor real-time storage quota, bandwidth, remaining space, and manage all client &amp; project assets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*"
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
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Refresh cloud metrics & images"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Live Cloudinary Metrics Card */}
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
                  Active image files &amp; brand assets
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
                  {usage.cloudName || 'tm2pwzjj'}
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
          <div className="p-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
            <p className="text-xs text-slate-400 font-bold">Connecting to Cloudinary Asset Vault...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="p-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Media Files Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Upload photos or wait for clients to submit project specifications with image attachments.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((item) => {
              const isSelected = selectedIds.includes(item.public_id);

              return (
                <div
                  key={item.public_id}
                  className={`group relative rounded-2xl border overflow-hidden bg-white dark:bg-slate-900 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-600 ring-2 ring-purple-400/30 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  {/* Select Checkbox */}
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

                  {/* Image Preview */}
                  <div
                    onClick={() => setPreviewImage(item)}
                    className="relative aspect-square bg-slate-950 overflow-hidden cursor-pointer group-hover:opacity-95"
                  >
                    <img
                      src={item.secure_url}
                      alt={item.public_id}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
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

        {/* Full Image Preview Modal */}
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
                    {previewImage.width}x{previewImage.height} • {previewImage.sizeFormatted} • {previewImage.format?.toUpperCase()}
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
                <img
                  src={previewImage.secure_url}
                  alt={previewImage.public_id}
                  className="max-h-[70vh] w-auto object-contain rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleCopyLink(previewImage.secure_url)}
                  className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Cloudinary CDN URL</span>
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
