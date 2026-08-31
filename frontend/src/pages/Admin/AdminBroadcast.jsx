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
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';
import { toast } from 'react-toastify';

export default function AdminBroadcast() {
  const [targetAudience, setTargetAudience] = useState('all');
  const [customEmails, setCustomEmails] = useState('');
  const [subject, setSubject] = useState('🎉 Special Launch Announcement from LOCAL2BRAND!');
  const [heading, setHeading] = useState('Exciting Updates For Your Business!');
  const [messageHtml, setMessageHtml] = useState(
    `We are thrilled to announce new premium website templates, faster 48-hour delivery, and free SSL with every website order on LOCAL2BRAND.\n\nLog in to your portal now to explore our latest live demos and request a free quote for your next digital upgrade.`
  );
  const [actionText, setActionText] = useState('Explore New Website Demos');
  const [actionUrl, setActionUrl] = useState('https://local2brand.com/demos');

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [previewTab, setPreviewTab] = useState(false);

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
          details: res.details,
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
    <div className="space-y-6 max-w-5xl">
      
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
            Dispatch announcements, special offers, and platform updates directly to registered clients and users via live SMTP.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewTab(!previewTab)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Eye className="w-3.5 h-3.5 text-purple-600" />
          <span>{previewTab ? 'Hide Email Preview' : 'Show Live Preview'}</span>
        </button>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form (7 cols) */}
        <form onSubmit={handleSendBroadcast} className="lg:col-span-7 space-y-4">
          
          {/* 1. Target Audience */}
          <div className="glass-panel p-5 rounded-2xl border border-white dark:border-slate-800 space-y-3 shadow-xs">
            <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
              1. Select Target Audience
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'all', label: 'All Users', desc: 'Registered accounts' },
                { id: 'clients', label: 'Clients Only', desc: 'Non-admin users' },
                { id: 'admins', label: 'Admins Only', desc: 'Staff / Admin' },
                { id: 'custom', label: 'Custom List', desc: 'Specific emails' },
              ].map((aud) => (
                <button
                  type="button"
                  key={aud.id}
                  onClick={() => setTargetAudience(aud.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    targetAudience === aud.id
                      ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/60 text-purple-950 dark:text-purple-200 ring-2 ring-purple-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">{aud.label}</div>
                  <div className="text-[10px] text-slate-400">{aud.desc}</div>
                </button>
              ))}
            </div>

            {targetAudience === 'custom' && (
              <div className="pt-2 animate-in fade-in">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Recipient Emails (Comma Separated)
                </label>
                <input
                  type="text"
                  value={customEmails}
                  onChange={(e) => setCustomEmails(e.target.value)}
                  placeholder="client1@gmail.com, ceo@brand.in, founder@studio.com"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* 2. Email Subject & Header */}
          <div className="glass-panel p-5 rounded-2xl border border-white dark:border-slate-800 space-y-3 shadow-xs">
            <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
              2. Subject Line & Heading
            </label>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Email Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Special Launch Offer: 20% OFF on all website packages"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Internal Heading / Title</label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Exciting New Features For Your Business!"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* 3. Message Body & Call to Action */}
          <div className="glass-panel p-5 rounded-2xl border border-white dark:border-slate-800 space-y-3 shadow-xs">
            <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
              3. Message Content & CTA
            </label>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Message Body *</label>
              <textarea
                rows={5}
                required
                value={messageHtml}
                onChange={(e) => setMessageHtml(e.target.value)}
                placeholder="Type your announcement or update message here..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white leading-relaxed"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Button Text (Optional)</label>
                <input
                  type="text"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="e.g. View New Demos"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Button URL</label>
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="e.g. https://local2brand.com/demos"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={sending}
            className="w-full py-3.5 rounded-2xl font-black text-sm text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {sending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sending Broadcast Emails...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Broadcast to {targetAudience === 'all' ? 'All Registered Users' : targetAudience.toUpperCase()}</span>
              </>
            )}
          </button>
        </form>

        {/* Right Live Email Preview (5 cols) */}
        <div className={`lg:col-span-5 space-y-3 ${previewTab ? 'block' : 'hidden lg:block'}`}>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Recipient Inbox Emulation</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-600 font-bold">
              Live Preview
            </span>
          </div>

          {/* Simulated Email Card */}
          <div className="p-5 rounded-3xl bg-[#0f172a] text-slate-100 border border-slate-800 shadow-2xl space-y-4 text-xs">
            
            {/* Header */}
            <div className="text-center border-b border-slate-800/80 pb-3">
              <h2 className="text-lg font-black text-purple-400">
                LOCAL<span className="text-pink-500">2</span>BRAND
              </h2>
              <p className="text-[11px] text-slate-400">Official Announcement</p>
            </div>

            {/* Email Body Container */}
            <div className="p-4 rounded-2xl bg-[#1e293b] border border-slate-700/80 space-y-3">
              <h3 className="text-sm font-bold text-sky-400">
                {heading || 'Important Update from LOCAL2BRAND'}
              </h3>
              
              <div className="text-slate-300 leading-relaxed text-[12px] whitespace-pre-line">
                {messageHtml}
              </div>

              {actionText && actionUrl && (
                <div className="pt-2 text-center">
                  <span className="inline-block px-5 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-md">
                    {actionText}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-slate-500 pt-2">
              © {new Date().getFullYear()} LOCAL2BRAND. All rights reserved.<br />
              Delivered directly via verified SMTP.
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
