import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function ShareDemoModal({ isOpen, onClose, demo }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !demo) return null;

  const demoTitle = demo.title || 'Website Demo';
  const demoCategory = demo.category || 'Website Template';
  const demoUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/demos/${demo.slug || demo.templateId}`
    : `https://local2brand.com/demos/${demo.slug || demo.templateId}`;

  const shareText = `Check out this amazing live interactive website demo for ${demoTitle} (${demoCategory}) by LOCAL2BRAND: ${demoUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(demoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${demoTitle} — LOCAL2BRAND`,
          text: `Check out this live interactive website demo for ${demoTitle}!`,
          url: demoUrl
        });
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Check out this high-converting live website demo for ${demoTitle} by @local2brand!`
    )}&url=${encodeURIComponent(demoUrl)}`;
    window.open(tweetUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(demoUrl)}`;
    window.open(fbUrl, '_blank');
  };

  const handleLinkedInShare = () => {
    const inUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(demoUrl)}`;
    window.open(inUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 text-slate-900 dark:text-slate-100 animate-scale">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Share Website Demo</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-[240px]">{demoTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Copy Link Input Box */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Direct Demo URL</label>
          <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 truncate flex-1">{demoUrl}</span>
            <button
              onClick={handleCopyLink}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Quick Social Share Grid */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Share Directly To</label>
          
          <div className="grid grid-cols-2 gap-2.5">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            {/* Twitter / X */}
            <button
              onClick={handleTwitterShare}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="font-black text-sm">𝕏</span>
              <span>Twitter / X</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookShare}
              className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="font-black text-sm">f</span>
              <span>Facebook</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={handleLinkedInShare}
              className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-800 dark:text-sky-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="font-black text-xs">in</span>
              <span>LinkedIn</span>
            </button>
          </div>
        </div>

        {/* Native Web Share Button if supported */}
        {typeof navigator !== 'undefined' && navigator.share && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>More Sharing Options...</span>
          </button>
        )}

      </div>
    </div>
  );
}
