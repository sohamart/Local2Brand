import React from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

/**
 * Universal Apple-grade, responsive upload engine with real-time percentage, 
 * live MB counter, and continuous progress smoothing in Toastify.
 * Pristine dark mode & light mode UI with high contrast and smooth micro-animations.
 *
 * @param {Object} params
 * @param {File} [params.file] Single file to upload
 * @param {FileList|File[]} [params.files] Multiple files to upload
 * @param {string} [params.endpoint='/upload'] API upload endpoint
 * @param {string} [params.title='Uploading...'] Title shown in toast
 * @param {string} [params.successMessage] Message shown upon completion
 * @returns {Promise<Object>} API response
 */
export const uploadWithToast = async ({
  file,
  files,
  endpoint = '/upload',
  title = 'Uploading media...',
  successMessage,
}) => {
  const fileToUpload = file || (files && files[0]);
  const totalFiles = files?.length || 1;
  const fileName = fileToUpload?.name || 'File';
  
  // Calculate total size in MB accurately
  let totalBytes = 0;
  if (files && files.length > 0) {
    Array.from(files).forEach(f => { totalBytes += (f.size || 0); });
  } else if (file) {
    totalBytes = file.size || 0;
  }
  const totalMB = Math.max(0.1, Number((totalBytes / (1024 * 1024)).toFixed(1)));

  const formData = new FormData();
  if (files && files.length > 0) {
    Array.from(files).forEach((f) => {
      formData.append('files', f);
    });
  } else if (file) {
    formData.append('file', file);
  }

  let currentPercent = 0;
  let currentLoadedMB = 0;
  let isComplete = false;

  // Render Modern Toast Progress UI (Dark & Light Mode Optimized, Real-time Exact Tracking)
  const renderProgressUI = (pct, mb, statusText) => {
    const displayMB = typeof mb === 'number' ? mb.toFixed(1) : mb;
    return (
      <div className="w-full select-none py-1 space-y-2.5">
        {/* Header with Title and Live Percentage Badge */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="relative flex h-2.5 w-2.5 shrink-0 mt-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
            </span>
            <span className="font-extrabold text-[11px] sm:text-xs text-slate-900 dark:text-slate-100 break-words leading-tight">
              {title}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono text-xs font-black shrink-0 border border-purple-500/30 shadow-xs">
            {pct}%
          </span>
        </div>

        {/* Animated Gradient Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/80 dark:border-slate-700 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-150 ease-out relative overflow-hidden"
            style={{ width: `${Math.max(4, pct)}%` }}
          >
            {/* Shimmer Light Sweep */}
            <div className="absolute inset-0 bg-white/30 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12" />
          </div>
        </div>

        {/* Footer: Exact MB Progress + Live Status */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0">
            {displayMB} MB <span className="text-slate-400 dark:text-slate-500 font-normal">/ {totalMB} MB</span>
          </span>
          <span className="font-bold text-purple-600 dark:text-purple-400 text-right text-[10px] sm:text-[11px] pl-2 break-words">
            {statusText || (pct >= 100 ? '☁️ Cloud CDN Syncing...' : `${pct}% Streamed`)}
          </span>
        </div>
      </div>
    );
  };

  // Initialize Toast with pristine backdrop and borders
  const toastId = toast.loading(renderProgressUI(0, 0, 'Preparing upload...'), {
    autoClose: false,
    closeButton: false,
    className: '!bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white !border !border-slate-200 dark:!border-slate-700/80 !rounded-2xl !shadow-2xl sm:min-w-[350px]',
  });

  const progressHandler = ({ percent, loaded }) => {
    if (isComplete) return;

    const exactLoadedMB = Number((loaded / (1024 * 1024)).toFixed(1));
    const status = percent >= 100 ? '☁️ Syncing to Cloud CDN...' : `Uploading ${exactLoadedMB} MB (${percent}%)...`;

    toast.update(toastId, {
      render: renderProgressUI(percent, exactLoadedMB, status),
      isLoading: true,
      autoClose: false,
    });
  };

  try {
    let uploadResult = null;

    // Check if single or multiple files
    const fileListToUpload = files && files.length > 0 ? Array.from(files) : file ? [file] : [];
    const isVideo = fileListToUpload.some(f => f?.type?.startsWith('video/') || Boolean(f?.name?.match(/\.(mp4|webm|mov|mkv|avi|ogg)$/i)));

    // 1. Try Direct Cloudinary Signed Upload (Bypasses Vercel 4.5MB serverless limit)
    let directSig = null;
    try {
      const sigRes = await api.get(`/upload/signature?resource_type=${isVideo ? 'video' : 'auto'}`);
      if (sigRes?.directUpload && sigRes?.signature && sigRes?.cloudName && sigRes?.apiKey) {
        directSig = sigRes;
      }
    } catch (sigErr) {
      console.warn('Direct upload signature unavailable, falling back to server upload:', sigErr.message);
    }

    if (directSig) {
      // Direct high-speed upload straight from client browser to Cloudinary CDN edge
      const directUploadPromises = fileListToUpload.map(async (singleFile) => {
        const directData = new FormData();
        directData.append('file', singleFile);
        directData.append('api_key', directSig.apiKey);
        directData.append('timestamp', directSig.timestamp);
        directData.append('signature', directSig.signature);
        directData.append('folder', directSig.folder || (isVideo ? 'local2brand_videos' : 'local2brand_assets'));

        const targetUrl = `https://api.cloudinary.com/v1_1/${directSig.cloudName}/${isVideo ? 'video' : 'auto'}/upload`;
        const cloudData = await api.uploadWithProgress(targetUrl, directData, progressHandler);

        return cloudData?.secure_url || cloudData?.url;
      });

      const uploadedUrls = await Promise.all(directUploadPromises);
      const validUrls = uploadedUrls.filter(Boolean);

      if (validUrls.length > 0) {
        uploadResult = {
          success: true,
          url: validUrls[0],
          urls: validUrls,
          message: `${validUrls.length} file(s) uploaded directly to Cloud CDN`,
        };
      }
    }

    // 2. Fallback to standard server /api/upload if direct upload was skipped or failed
    if (!uploadResult) {
      const standardFormData = new FormData();
      if (files && files.length > 0) {
        Array.from(files).forEach((f) => standardFormData.append('files', f));
      } else if (file) {
        standardFormData.append('file', file);
      }

      uploadResult = await api.uploadWithProgress(endpoint, standardFormData, progressHandler);
    }

    isComplete = true;

    if (uploadResult?.success || uploadResult?.url || uploadResult?.urls?.length) {
      // 100% Instant Completion State
      toast.update(toastId, {
        render: (
          <div className="space-y-1.5 select-none py-1">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-0.5">
                <span className="text-xs font-black">✓</span>
              </div>
              <div className="font-extrabold text-[11px] sm:text-xs text-slate-900 dark:text-white break-words flex-1 leading-tight">
                {successMessage || (totalFiles > 1 ? `${totalFiles} files uploaded successfully!` : `${fileName} uploaded!`)}
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 font-mono pl-7">
              <span className="font-bold text-slate-700 dark:text-slate-300">{totalMB} MB / {totalMB} MB (100%)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Cloud CDN Active</span>
            </div>
          </div>
        ),
        type: 'success',
        isLoading: false,
        autoClose: 2500,
        closeButton: true,
        className: '!bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white !border !border-emerald-500/30 dark:!border-emerald-500/40 !rounded-2xl !shadow-2xl sm:min-w-[350px]',
      });
      return uploadResult;
    } else {
      throw new Error(uploadResult?.message || 'Upload failed');
    }
  } catch (err) {
    isComplete = true;

    const errorMessage = err.message || 'Upload failed';

    // High Contrast Error Toast (Dark & Light Mode, Full Text Visible, No Cutoff)
    toast.update(toastId, {
      render: (
        <div className="space-y-1.5 select-none py-1">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30 mt-0.5">
              <span className="text-xs font-black">✕</span>
            </div>
            <div className="font-extrabold text-[11px] sm:text-xs text-rose-600 dark:text-rose-400 break-words flex-1 leading-tight">
              Upload Notice: {errorMessage}
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono pl-7">
            <span>{totalMB} MB</span>
            <span className="text-rose-500 font-medium text-[9px] sm:text-[10px]">Check network & retry</span>
          </div>
        </div>
      ),
      type: 'error',
      isLoading: false,
      autoClose: 6000,
      closeButton: true,
      className: '!bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white !border !border-rose-500/40 dark:!border-rose-500/50 !rounded-2xl !shadow-2xl sm:min-w-[350px]',
    });
    throw err;
  }
};



