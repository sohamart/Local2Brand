import React from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

/**
 * Universal Apple-grade, responsive upload engine with real-time percentage, 
 * live MB counter, and adaptive 2-stage progress smoothing in Toastify.
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
  
  // Calculate total size in MB
  let totalBytes = 0;
  if (files && files.length > 0) {
    Array.from(files).forEach(f => { totalBytes += (f.size || 0); });
  } else if (file) {
    totalBytes = file.size || 0;
  }
  const totalMB = Math.max(0.1, Number((totalBytes / (1024 * 1024)).toFixed(1)));

  const formData = new FormData();
  if (files && files.length > 0) {
    Array.from(files).forEach(f => {
      formData.append('images', f);
      formData.append('image', f);
      formData.append('file', f);
    });
  } else if (file) {
    formData.append('images', file);
    formData.append('image', file);
    formData.append('file', file);
  }

  let currentPercent = 0;
  let currentLoadedMB = 0;
  let isComplete = false;
  let isCloudProcessing = false;

  // Render Modern Toast Progress UI
  const renderProgressUI = (pct, mb, statusText) => (
    <div className="w-full select-none py-1 space-y-2.5">
      {/* Header with Title and Live Percentage Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping shrink-0" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
            {title}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-lg bg-purple-500/10 dark:bg-purple-400/20 text-purple-700 dark:text-purple-300 font-mono text-xs font-black shrink-0 border border-purple-500/20 shadow-xs">
          {pct}%
        </span>
      </div>

      {/* Ultra-Smooth Animated Gradient Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
          style={{ width: `${Math.max(3, pct)}%` }}
        >
          {/* Shimmer Light Sweep */}
          <div className="absolute inset-0 bg-white/30 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12" />
        </div>
      </div>

      {/* Footer: MB Progress + Live Status */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {mb} MB <span className="text-slate-400 dark:text-slate-500">/ {totalMB} MB</span>
        </span>
        <span className="font-bold text-purple-600 dark:text-purple-400 truncate max-w-[140px]">
          {statusText || (pct >= 90 ? '⚡ Cloud Processing...' : `${pct}% Uploaded`)}
        </span>
      </div>
    </div>
  );

  // Initialize Toast
  const toastId = toast.loading(renderProgressUI(0, '0.0', 'Initializing...'), {
    autoClose: false,
    closeButton: false,
    className: '!bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white !border !border-slate-200 dark:!border-slate-800 !rounded-2xl !shadow-2xl !backdrop-blur-xl',
  });

  // Smooth Cloud Processing Simulation Ticker (increments progress smoothly from 65% to 98% while Cloudinary processes)
  let cloudInterval = null;
  const startCloudProcessingTicker = () => {
    if (isCloudProcessing) return;
    isCloudProcessing = true;

    // Step from currentPercent towards 98% smoothly
    cloudInterval = setInterval(() => {
      if (isComplete) {
        clearInterval(cloudInterval);
        return;
      }

      if (currentPercent < 98) {
        const increment = currentPercent < 80 ? 3 : currentPercent < 92 ? 1.5 : 0.4;
        currentPercent = Math.min(98, Number((currentPercent + increment).toFixed(1)));
        currentLoadedMB = Number(((currentPercent / 100) * totalMB).toFixed(1));

        const stageText = currentPercent < 80 
          ? '☁️ Uploading to CDN...' 
          : currentPercent < 92 
          ? '⚡ Encoding Video...' 
          : '✨ Finalizing Assets...';

        toast.update(toastId, {
          render: renderProgressUI(Math.round(currentPercent), currentLoadedMB, stageText),
          isLoading: true,
          autoClose: false,
        });
      }
    }, 250);
  };

  try {
    const uploadPromise = api.uploadWithProgress(endpoint, formData, ({ percent, loadedMB }) => {
      if (isComplete) return;

      // Map client upload to 0% -> 60%
      const mappedPercent = Math.min(60, Math.round(percent * 0.6));
      currentPercent = mappedPercent;
      currentLoadedMB = loadedMB;

      toast.update(toastId, {
        render: renderProgressUI(mappedPercent, loadedMB, `Streaming ${mappedPercent}%...`),
        isLoading: true,
        autoClose: false,
      });

      if (percent >= 98) {
        startCloudProcessingTicker();
      }
    });

    const res = await uploadPromise;
    isComplete = true;
    if (cloudInterval) clearInterval(cloudInterval);

    if (res?.success || res?.url || res?.urls?.length) {
      // 100% Completion State
      toast.update(toastId, {
        render: (
          <div className="space-y-1.5 select-none py-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <span className="text-xs">✓</span>
              </div>
              <div className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 truncate">
                {successMessage || (totalFiles > 1 ? `${totalFiles} files uploaded successfully!` : `${fileName} uploaded!`)}
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono pl-7">
              <span>{totalMB} MB Completed</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% • Fast CDN</span>
            </div>
          </div>
        ),
        type: 'success',
        isLoading: false,
        autoClose: 3500,
        closeButton: true,
      });
      return res;
    } else {
      throw new Error(res?.message || 'Upload failed');
    }
  } catch (err) {
    isComplete = true;
    if (cloudInterval) clearInterval(cloudInterval);

    toast.update(toastId, {
      render: (
        <div className="space-y-1.5 select-none py-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <span className="text-xs">✕</span>
            </div>
            <div className="font-extrabold text-xs text-rose-600 dark:text-rose-400 truncate">
              Upload Failed: {err.message || 'Network error'}
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono pl-7">
            {totalMB} MB • Please check network and retry
          </div>
        </div>
      ),
      type: 'error',
      isLoading: false,
      autoClose: 4000,
      closeButton: true,
    });
    throw err;
  }
};
