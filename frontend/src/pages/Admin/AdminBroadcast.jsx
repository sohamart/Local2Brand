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
    id: 'no_orders_2days',
    name: '⏰ 2 Days No Order / Project Help',
    subject: '👋 Quick question regarding your website project (VIP Founder Assistance)',
    heading: 'Can We Help You Launch Your Website This Week?',
    message: `Hi there!\n\nWe noticed you registered on LOCAL2BRAND but haven't finalized your website project order yet. Whether you are wondering about the right design, features, tech stack, or budget — our engineering team is here to assist you.\n\n⚡ For the next 48 hours, we are offering an exclusive ₹2,000 launch credit on all packages, including free .IN domain connection, Tier-4 SSL certificate, and WhatsApp direct ordering.\n\nWould you like to schedule a quick 15-minute consultation or select a live demo to fast-track your launch?`,
    actionText: 'Claim ₹2,000 Credit & Start Project',
    actionUrl: 'https://local2brand.vercel.app/pricing',
    isImportant: true,
  },
  {
    id: 'launch',
    name: '🚀 48h Website Launch Blueprint',
    subject: '🎉 Exciting Launch: New Website Templates & 48h Fast Delivery on LOCAL2BRAND!',
    heading: 'Supercharge Your Digital Brand Today!',
    message: `We are thrilled to announce new premium website templates, lightning-fast 48-hour delivery, and enterprise-grade cloud hosting for all new client projects.\n\nExplore our latest high-converting live demos and request your customized quote in just 2 minutes.`,
    actionText: 'Explore New Website Demos',
    actionUrl: 'https://local2brand.vercel.app/demos',
    isImportant: true,
  },
  {
    id: 'founder_note',
    name: '🤝 Founder Direct 1-on-1 Note',
    subject: 'A quick personal note from Soham Dutta (Founder, LOCAL2BRAND)',
    heading: 'Let’s Build Something Exceptional For Your Business',
    message: `I wanted to personally reach out and thank you for connecting with LOCAL2BRAND.\n\nOur mission is simple: deliver agency-grade, sub-second websites that convert casual visitors into paying customers without bloated timelines or excessive costs.\n\nIf you have any questions or need custom architecture recommendations for your brand, reply directly to this email or click below to schedule a 15-minute strategy call.`,
    actionText: 'Schedule 15-Min Founder Call',
    actionUrl: 'https://local2brand.vercel.app/contact',
    isImportant: true,
  },
  {
    id: 'vip_discount',
    name: '🎁 VIP ₹2,000 Voucher + Free Domain',
    subject: '🎁 Exclusive Privilege: ₹2,000 Voucher + Free .IN Domain Activated For Your Account',
    heading: 'Claim ₹2,000 Savings on Your Next Website Project!',
    message: `Upgrade your business with a brand-new website tailored to your domain. For a limited time, use promo code INDIA2025 at checkout to enjoy a flat 20% discount on any standard or pro package.\n\nOur team handles design, copywriting, domain connection, and launch within 48 hours.`,
    actionText: 'Redeem Voucher Now',
    actionUrl: 'https://local2brand.vercel.app/get-started',
    isImportant: true,
  },
  {
    id: 'security_update',
    name: '🔒 Security & SSL Infrastructure Notice',
    subject: 'Important: Security & High-Speed Cloud Infrastructure Update for Your Account',
    heading: 'Your Web Infrastructure is Now Faster & More Secure',
    message: `All client websites hosted under LOCAL2BRAND now feature automatic Tier-4 Cloudflare SSL encryption, DDoS mitigation, and global edge cache replication.\n\nYour customers enjoy zero downtime, instantaneous asset delivery, and maximum trust.`,
    actionText: 'View Platform Status & Orders',
    actionUrl: 'https://local2brand.vercel.app/track-order',
    isImportant: true,
  },
  {
    id: 'whatsapp_store',
    name: '🛍️ WhatsApp Store & Lead Funnels',
    subject: '🛍️ Turn Browsers into Buyers: Instant WhatsApp Commerce Funnels Now Live!',
    heading: 'Automate Your Sales with WhatsApp Direct Lead Engines',
    message: `We have introduced 1-Click WhatsApp Ordering & Direct Inquiries across all e-commerce and catalog demo websites.\n\nClients receive instant ping notifications on their phone as soon as a customer selects a service, resulting in a 3x higher closing rate.`,
    actionText: 'Preview WhatsApp Demo',
    actionUrl: 'https://local2brand.vercel.app/demos',
    isImportant: false,
  },
  {
    id: 'newsletter',
    name: '📰 Monthly Tech & SEO Masterclass',
    subject: '📰 LOCAL2BRAND Insights: How Sub-Second Load Speed Doubles Your Inquiries',
    heading: 'Engineering Secrets for High-Converting Business Websites',
    message: `Did you know that 53% of mobile visitors abandon a website that takes over 3 seconds to load?\n\nIn this monthly digest, we break down how our custom React + Next.js architecture scores 98+ on Google Lighthouse, giving your business higher organic search rankings and instant WhatsApp lead conversion.\n\nRead our latest architecture breakdown or book an audit for your existing site!`,
    actionText: 'Explore Engineering Features',
    actionUrl: 'https://local2brand.vercel.app/pricing',
    isImportant: false,
  },
  {
    id: 'custom',
    name: '✏️ Blank / Custom Broadcast',
    subject: '',
    heading: '',
    message: '',
    actionText: 'Visit LOCAL2BRAND',
    actionUrl: 'https://local2brand.vercel.app/',
    isImportant: true,
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
  const [isImportant, setIsImportant] = useState(true);
  const [sendPush, setSendPush] = useState(true);

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
    if (typeof preset.isImportant === 'boolean') {
      setIsImportant(preset.isImportant);
    }
    toast.info(`Applied preset: ${preset.name}`);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !messageHtml.trim()) {
      toast.warning('Please provide a subject and message body.');
      return;
    }

    if (!confirm(`Are you sure you want to dispatch this broadcast${sendPush ? ' (Email + OneSignal Push)' : ' (Email Only)'} to "${targetAudience.toUpperCase()}" with ${isImportant ? 'HIGH PRIORITY' : 'Standard Delivery'}?`)) {
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const res = await api.post(
        '/admin/broadcast-email',
        {
          subject,
          heading,
          messageHtml,
          actionText,
          actionUrl,
          targetAudience,
          customEmails,
          isImportant,
          sendPush,
        },
        { timeout: 120000 }
      );

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
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                1. Target Audience Segment
              </label>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                Segment Engine
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'all', label: 'Registered Users', desc: 'Active user accounts' },
                { id: 'no_orders_2days', label: '⏰ 2d+ No Order', desc: 'Registered winback' },
                { id: 'active_orders', label: 'Active Orders', desc: 'In development' },
                { id: 'requirements_submitted', label: 'Req Submitted', desc: 'Blueprint logged' },
                { id: 'leads_inquiries', label: 'Inquiries & Leads', desc: 'Form & Callbacks' },
                { id: 'clients', label: 'Clients Only', desc: 'Non-admin users' },
                { id: 'admins', label: 'Admins Only', desc: 'Staff / Admin' },
                { id: 'all_contacts', label: 'All Contacts', desc: 'Users + Leads (6)' },
                { id: 'custom', label: 'Custom List', desc: 'Specific emails' },
              ].map((aud) => (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => setTargetAudience(aud.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    targetAudience === aud.id
                      ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-500 text-purple-900 dark:text-purple-200 shadow-xs ring-1 ring-purple-400/50'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs">{aud.label}</div>
                  <div className="text-[10px] opacity-75 truncate">{aud.desc}</div>
                </button>
              ))}
            </div>

            {/* Inbox Placement Toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  🎯 Primary / Inbox Priority Delivery
                </span>
                <span className="text-[10px] text-slate-400">
                  Adds urgent headers & removes bot flags to prevent falling into Promotions/Spam tab.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsImportant(!isImportant)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isImportant
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                }`}
              >
                {isImportant ? '✅ Inbox Priority Active' : '⚪ Standard Delivery'}
              </button>
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

          {/* 5. OneSignal Push Notification Option */}
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                📡
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Send OneSignal Web Push Notification</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instant browser alert sent to all subscribed desktop &amp; mobile users
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSendPush(!sendPush)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                sendPush ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              role="switch"
              aria-checked={sendPush}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  sendPush ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
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
                    ✉️ local2brand@zohomail.in • sohamduttabwn@gmail.com
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
