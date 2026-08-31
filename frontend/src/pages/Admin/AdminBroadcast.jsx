import React, { useState } from 'react';
import {
  Send,
  Mail,
  Users,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Eye,
  RefreshCw,
  Layers,
  ArrowRight,
  Smartphone,
  Monitor,
  Zap
} from 'lucide-react';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';
import { toast } from 'react-toastify';

const TEMPLATE_PRESETS = [
  {
    id: 'launch',
    name: '🚀 New Demos & 48h Delivery',
    subject: '🎉 Exciting Launch: New Website Templates & 48h Delivery on LOCAL2BRAND!',
    heading: 'Supercharge Your Digital Brand Today!',
    message: `We are thrilled to announce new premium website templates, lightning-fast 48-hour delivery, and enterprise-grade cloud hosting for all new client projects.\n\nExplore our latest high-converting live demos and request your customized quote in just 2 minutes.`,
    actionText: 'Explore New Website Demos',
    actionUrl: 'https://local2brand.vercel.app/demos',
  },
  {
    id: 'discount',
    name: '🎁 20% Festive Discount Promo',
    subject: '🎁 Exclusive 20% OFF on Custom Website Development — Promo: INDIA2025',
    heading: 'Claim 20% Savings on Your Next Website Project!',
    message: `Upgrade your business with a brand-new website tailored to your domain. For a limited time, use promo code INDIA2025 at checkout to enjoy a flat 20% discount on any standard or pro package.\n\nOur team handles design, copywriting, domain connection, and launch within 48 hours.`,
    actionText: 'Claim 20% Discount Now',
    actionUrl: 'https://local2brand.vercel.app/get-started',
  },
  {
    id: 'callback',
    name: '📞 Free 15-Min Founder Consultation',
    subject: '📞 Need advice on your business website? Talk directly with our founding architects',
    heading: 'Book a Free 15-Minute Technical Strategy Call',
    message: `Unsure which tech stack or architecture fits your online store, LMS, or service business? Connect with our senior tech leads for a personalized 1-on-1 consultation.\n\nNo obligations — just actionable insights to scale your brand.`,
    actionText: 'Request Instant Callback',
    actionUrl: 'https://local2brand.vercel.app/contact',
  },
];

export default function AdminBroadcast() {
  const [targetAudience, setTargetAudience] = useState('all');
  const [customEmails, setCustomEmails] = useState('');
  const [subject, setSubject] = useState(TEMPLATE_PRESETS[0].subject);
  const [heading, setHeading] = useState(TEMPLATE_PRESETS[0].heading);
  const [messageHtml, setMessageHtml] = useState(TEMPLATE_PRESETS[0].message);
  const [actionText, setActionText] = useState(TEMPLATE_PRESETS[0].actionText);
  const [actionUrl, setActionUrl] = useState(TEMPLATE_PRESETS[0].actionUrl);

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [previewTab, setPreviewTab] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  const applyPreset = (preset) => {
    setSubject(preset.subject);
    setHeading(preset.heading);
    setMessageHtml(preset.message);
    setActionText(preset.actionText);
    setActionUrl(preset.actionUrl);
    toast.info(`Applied preset: ${preset.name}`);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !messageHtml.trim()) {
      toast.warning('Please provide a subject and message body.');
      return;
    }

    if (!confirm(`Are you sure you want to send this broadcast email to ${targetAudience === 'all' ? 'ALL registered users' : targetAudience}?`)) {
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const res = await api.post('/admin/broadcast-email', {
        subject,
        heading,
        messageHtml,
        actionText,
        actionUrl,
        targetAudience,
        customEmails,
      });

      if (res.success) {
        toast.success(`Broadcast sent successfully to ${res.sentCount} recipients! 🚀`);
        setResult({
          type: 'success',
          message: res.message || `Sent successfully to ${res.sentCount} recipients!`,
          sentCount: res.sentCount,
          total: res.total,
          failed: res.failed,
        });
      } else {
        toast.error(res.message || 'Failed to dispatch broadcast');
        setResult({
          type: 'error',
          message: res.message || 'Failed to dispatch broadcast',
        });
      }
    } catch (err) {
      toast.error(err.message || 'Network error sending broadcast email');
      setResult({
        type: 'error',
        message: err.message || 'Network error sending broadcast email',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <AshokaChakra size={11} />
            <span>Mass Communication Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Mass Email Broadcast
          </h1>
          <p className="text-xs text-slate-500">
            Dispatch announcements, promotional campaigns, and platform updates directly to registered clients via agency-grade HTML templates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewTab(!previewTab)}
          className="lg:hidden px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Eye className="w-3.5 h-3.5 text-purple-600" />
          <span>{previewTab ? 'Edit Content' : 'View Live Email Preview'}</span>
        </button>
      </div>

      {/* Preset Quick Loader */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick 1-Click Template Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TEMPLATE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-all cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 animate-in fade-in ${
            result.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/80 border-rose-300 text-rose-800 dark:text-rose-300'
          }`}
        >
          {result.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <div>
            <div className="font-extrabold text-sm">{result.message}</div>
            {result.total && (
              <div className="font-normal text-[11px] opacity-90 mt-0.5">
                Total Targeted: {result.total} • Successfully Sent: {result.sentCount} • Failed: {result.failed}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Form & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form (6 cols) */}
        <form onSubmit={handleSendBroadcast} className={`lg:col-span-6 space-y-4 ${previewTab ? 'hidden lg:block' : 'block'}`}>
          
          {/* 1. Target Audience */}
          <div className="glass-panel p-5 rounded-2xl border border-white dark:border-slate-800 space-y-3 shadow-xs">
            <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
              1. Target Audience
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'all', label: 'All Users', desc: 'Registered accounts' },
                { id: 'clients', label: 'Clients Only', desc: 'Non-admin users' },
                { id: 'admins', label: 'Admins Only', desc: 'Staff / Admin' },
                { id: 'custom', label: 'Custom List', desc: 'Specific emails' },
              ].map((aud) => (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => setTargetAudience(aud.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    targetAudience === aud.id
                      ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-500 text-purple-900 dark:text-purple-200 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs">{aud.label}</div>
                  <div className="text-[10px] opacity-75">{aud.desc}</div>
                </button>
              ))}
            </div>

            {targetAudience === 'custom' && (
              <div className="pt-2 animate-in fade-in">
                <label className="text-[11px] font-bold text-slate-500 block mb-1">
                  Comma-separated email addresses:
                </label>
                <textarea
                  rows={2}
                  value={customEmails}
                  onChange={(e) => setCustomEmails(e.target.value)}
                  placeholder="client1@example.com, client2@example.com"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-purple-500"
                />
              </div>
            )}
          </div>

          {/* 2. Email Subject & Header */}
          <div className="glass-panel p-5 rounded-2xl border border-white dark:border-slate-800 space-y-3 shadow-xs">
            <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
              2. Subject Line &amp; Headline
            </label>
            
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Email Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. 🎉 Special Launch Announcement from LOCAL2BRAND!"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Main Headline (Hero Banner Title)
                </label>
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="e.g. Exciting Updates For Your Business!"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-purple-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Message Body */}
          <div className="glass-panel p-5 rounded-2xl border border-white dark:border-slate-800 space-y-3 shadow-xs">
            <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
              3. Message Content (Agency HTML Formatted)
            </label>
            <textarea
              rows={5}
              required
              value={messageHtml}
              onChange={(e) => setMessageHtml(e.target.value)}
              placeholder="Write your email body here..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-purple-500"
            />
          </div>

          {/* 4. Call-To-Action Button */}
          <div className="glass-panel p-5 rounded-2xl border border-white dark:border-slate-800 space-y-3 shadow-xs">
            <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
              4. Call-To-Action Button (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="e.g. Explore Live Demos"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-purple-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Button Target URL
                </label>
                <input
                  type="url"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="https://local2brand.vercel.app/demos"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-900 dark:text-white focus:outline-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Dispatch Button */}
          <button
            type="submit"
            disabled={sending}
            className="w-full py-3.5 rounded-2xl font-black text-sm text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {sending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Dispatching Broadcast Emails...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Broadcast to {targetAudience === 'all' ? 'All Registered Users' : targetAudience.toUpperCase()}</span>
              </>
            )}
          </button>
        </form>

        {/* Right Live Email Preview (6 cols) */}
        <div className={`lg:col-span-6 space-y-3 ${previewTab ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Live Agency Email Preview
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-black border border-emerald-300 dark:border-emerald-800">
                WYSIWYG
              </span>
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs' : 'text-slate-500'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs' : 'text-slate-500'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Email Inbox Emulation Container */}
          <div
            className={`mx-auto rounded-2xl bg-slate-100 dark:bg-[#070a12] border border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden transition-all ${
              previewDevice === 'mobile' ? 'max-w-sm' : 'w-full'
            }`}
          >
            {/* Simulated Mail Client Header */}
            <div className="p-3.5 bg-white dark:bg-[#0b0f19] border-b border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">From: LOCAL2BRAND Agency &lt;hello@local2brand.com&gt;</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono font-bold">TLS SSL</span>
              </div>
              <div className="text-slate-700 dark:text-slate-300 font-semibold truncate">
                <span className="text-slate-400 dark:text-slate-500">To: </span>
                <span>{targetAudience === 'all' ? 'All Registered Users' : `${targetAudience.toUpperCase()} Audience`}</span>
              </div>
              <div className="text-slate-900 dark:text-white font-bold text-xs truncate">
                <span className="text-slate-400 dark:text-slate-500 font-normal">Subject: </span>
                <span>{subject || 'No Subject Specified'}</span>
              </div>
            </div>

            {/* Email Body Canvas */}
            <div className="p-4 sm:p-6 bg-slate-100 dark:bg-[#070a12]">
              <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
                
                {/* 4px Gradient Bar */}
                <div className="h-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500" />

                {/* Email Header */}
                <div className="p-6 text-center border-b border-slate-100 dark:border-slate-800/80 space-y-2 bg-white dark:bg-[#111827]">
                  <div className="inline-block px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold tracking-wider uppercase">
                    ⚡ OFFICIAL AGENCY BROADCAST
                  </div>
                  <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    LOCAL<span className="text-pink-500">2</span>BRAND
                  </h1>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide uppercase">
                    HIGH-PERFORMANCE DIGITAL AGENCY &amp; ENGINEERING
                  </p>
                </div>

                {/* Hero Title */}
                {heading && (
                  <div className="px-6 pt-5 pb-1 bg-white dark:bg-[#111827]">
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                      {heading}
                    </h2>
                  </div>
                )}

                {/* Message Box */}
                <div className="p-6 pt-2 space-y-4 text-xs bg-white dark:bg-[#111827]">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-slate-800 leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-200 break-words">
                    {messageHtml || 'Email body text will appear here...'}
                  </div>

                  {/* CTA Button */}
                  {actionText && actionUrl && (
                    <div className="pt-3 text-center">
                      <a
                        href={actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-7 py-3 rounded-xl font-black text-xs text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500 shadow-lg shadow-fuchsia-500/30 hover:opacity-95 transition-all tracking-wide"
                      >
                        {actionText} &rarr;
                      </a>
                    </div>
                  )}
                </div>

                {/* Email Footer */}
                <div className="p-4 bg-slate-50 dark:bg-[#0b0f19] border-t border-slate-200 dark:border-slate-800 text-center space-y-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                  <p>You received this official dispatch as a registered client on LOCAL2BRAND.</p>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    ✉️ stackaddacontact@gmail.com • sohamduttabwn@gmail.com
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 font-semibold pt-0.5">
                    © {new Date().getFullYear()} LOCAL2BRAND Technologies Pvt. Ltd. All rights reserved.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
