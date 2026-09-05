import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mail,
  Bell,
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
  Zap,
  Radio,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Link2
} from 'lucide-react';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';
import { toast } from 'react-toastify';
import { oneSignalService } from '../../services/oneSignal';
import { uploadWithToast } from '../../utils/toastUpload';

// ==========================================
// EMAIL TEMPLATES PRESETS
// ==========================================
const EMAIL_TEMPLATE_PRESETS = [
  {
    id: 'no_orders_2days',
    name: '⏰ 2 Days No Order / Project Help',
    subject: '👋 Quick question regarding your website project (VIP Founder Assistance)',
    heading: 'Can We Help You Launch Your Website This Week?',
    message: `Hi there!\n\nWe noticed you registered on LOCAL2BRAND but haven't finalized your website project order yet. Whether you are wondering about the right design, features, tech stack, or budget — our engineering team is here to assist you.\n\n⚡ For the next 48 hours, we are offering an exclusive ₹2,000 launch credit on all packages, including free .IN domain connection, Tier-4 SSL certificate, and WhatsApp direct ordering.\n\nWould you like to schedule a quick 15-minute consultation or select a live demo to fast-track your launch?`,
    actionText: 'Claim ₹2,000 Credit & Start Project',
    actionUrl: 'https://local2brand.vercel.app/pricing',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
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
    imageUrl: '',
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
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
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
    imageUrl: '',
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
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=800&auto=format&fit=crop&q=80',
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
    imageUrl: '',
    isImportant: true,
  },
];

// ==========================================
// PUSH NOTIFICATION PRESETS
// ==========================================
const PUSH_TEMPLATE_PRESETS = [
  {
    id: 'push_flash_sale',
    name: '⚡ ₹2,000 Launch Credit (Flash Offer)',
    title: '⚡ Limited Time: ₹2,000 Website Launch Credit!',
    message: 'Claim ₹2,000 credit on all standard & custom web packages today. Free .IN domain + SSL included!',
    url: 'https://local2brand.vercel.app/pricing',
    bigPicture: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'push_new_demos',
    name: '🚀 New Website Demos & Templates',
    title: '🎉 New Ultra-Fast Website Templates Live!',
    message: 'Explore our latest 48-hour delivery demos with 1-click WhatsApp lead integration.',
    url: 'https://local2brand.vercel.app/demos',
    bigPicture: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'push_order_reminder',
    name: '📋 Complete Your Website Blueprint',
    title: '📋 Your Website Blueprint is Waiting',
    message: 'Finish submitting your project requirements in 2 minutes so our engineers can start building.',
    url: 'https://local2brand.vercel.app/track-order',
    bigPicture: '',
  },
  {
    id: 'push_founder_call',
    name: '📞 Free 15-Min Strategy Call',
    title: '🤝 Schedule a Free 15-Min Strategy Call',
    message: 'Need help choosing the right tech stack or design? Book a quick 1-on-1 call with our founder.',
    url: 'https://local2brand.vercel.app/contact',
    bigPicture: '',
  },
  {
    id: 'push_security',
    name: '🔒 Platform Status & Speed Upgrade',
    title: '⚡ High-Speed Edge Network Active',
    message: 'All client sites are now protected with Tier-4 SSL and sub-second global CDN edge caching.',
    url: 'https://local2brand.vercel.app/dashboard',
    bigPicture: '',
  },
  {
    id: 'push_custom',
    name: '✏️ Blank / Custom Push',
    title: '',
    message: '',
    url: 'https://local2brand.vercel.app/dashboard',
    bigPicture: '',
  },
];

export default function AdminBroadcast() {
  const [broadcastMode, setBroadcastMode] = useState('push'); // 'email' | 'push'

  // Push State
  const [pushTitle, setPushTitle] = useState(PUSH_TEMPLATE_PRESETS[0].title);
  const [pushMessage, setPushMessage] = useState(PUSH_TEMPLATE_PRESETS[0].message);
  const [pushUrl, setPushUrl] = useState(PUSH_TEMPLATE_PRESETS[0].url);
  const [pushBigPicture, setPushBigPicture] = useState(PUSH_TEMPLATE_PRESETS[0].bigPicture);
  const [pushAudience, setPushAudience] = useState('all');
  const [pushCustomIds, setPushCustomIds] = useState('');
  const [pushStatus, setPushStatus] = useState({ configured: true, loading: true });
  const [pushSending, setPushSending] = useState(false);
  const [pushTestSending, setPushTestSending] = useState(false);
  const [isUploadingPushImage, setIsUploadingPushImage] = useState(false);
  const pushFileInputRef = useRef(null);

  // Email State
  const [emailAudience, setEmailAudience] = useState('all');
  const [customEmails, setCustomEmails] = useState('');
  const [subject, setSubject] = useState(EMAIL_TEMPLATE_PRESETS[0].subject);
  const [heading, setHeading] = useState(EMAIL_TEMPLATE_PRESETS[0].heading);
  const [messageHtml, setMessageHtml] = useState(EMAIL_TEMPLATE_PRESETS[0].message);
  const [actionText, setActionText] = useState(EMAIL_TEMPLATE_PRESETS[0].actionText);
  const [actionUrl, setActionUrl] = useState(EMAIL_TEMPLATE_PRESETS[0].actionUrl);
  const [emailImage, setEmailImage] = useState(EMAIL_TEMPLATE_PRESETS[0].imageUrl || '');
  const [isImportant, setIsImportant] = useState(true);
  const [sendPushWithEmail, setSendPushWithEmail] = useState(true);
  const [emailSending, setEmailSending] = useState(false);
  const [isUploadingEmailImage, setIsUploadingEmailImage] = useState(false);
  const emailFileInputRef = useRef(null);

  // General & Preview State
  const [result, setResult] = useState(null);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  // Check OneSignal Push Status on mount
  useEffect(() => {
    let mounted = true;
    api.get('/notifications/status')
      .then((res) => {
        if (mounted) {
          setPushStatus({
            configured: res.configured || res.appIdConfigured,
            appIdPreview: res.appIdPreview,
            totalSubscribers: res.totalSubscribers,
            message: res.message,
            loading: false,
          });
        }
      })
      .catch(() => {
        if (mounted) setPushStatus({ configured: false, loading: false });
      });
    return () => { mounted = false; };
  }, []);

  const applyEmailPreset = (preset) => {
    setSubject(preset.subject);
    setHeading(preset.heading);
    setMessageHtml(preset.message);
    setActionText(preset.actionText);
    setActionUrl(preset.actionUrl);
    setEmailImage(preset.imageUrl || '');
    if (typeof preset.isImportant === 'boolean') {
      setIsImportant(preset.isImportant);
    }
    toast.info(`Applied email preset: ${preset.name}`);
  };

  const applyPushPreset = (preset) => {
    setPushTitle(preset.title);
    setPushMessage(preset.message);
    setPushUrl(preset.url);
    setPushBigPicture(preset.bigPicture || '');
    toast.info(`Applied push preset: ${preset.name}`);
  };

  // Upload Cloudinary Handler for Push Notification
  const handleUploadPushImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Please select an image file (PNG, JPG, WEBP, GIF).');
      return;
    }

    setIsUploadingPushImage(true);
    try {
      const res = await uploadWithToast({
        file,
        title: 'Uploading Banner to Cloudinary CDN',
        successMessage: '🎉 Push Banner uploaded to Cloudinary CDN!',
      });

      if (res?.success && (res.url || res.urls?.[0])) {
        const uploadedUrl = res.url || res.urls[0];
        setPushBigPicture(uploadedUrl);
        toast.success('Cloudinary CDN URL attached to push alert!');
      }
    } catch (err) {
      console.error('Push image upload error:', err);
      toast.error(err.message || 'Failed to upload image to Cloudinary');
    } finally {
      setIsUploadingPushImage(false);
      if (e.target) e.target.value = '';
    }
  };

  // Upload Cloudinary Handler for Email Hero Banner
  const handleUploadEmailImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Please select an image file (PNG, JPG, WEBP, GIF).');
      return;
    }

    setIsUploadingEmailImage(true);
    try {
      const res = await uploadWithToast({
        file,
        title: 'Uploading Hero Graphic to Cloudinary CDN',
        successMessage: '🎉 Email Graphic uploaded to Cloudinary CDN!',
      });

      if (res?.success && (res.url || res.urls?.[0])) {
        const uploadedUrl = res.url || res.urls[0];
        setEmailImage(uploadedUrl);
        toast.success('Cloudinary CDN image embedded in email template!');
      }
    } catch (err) {
      console.error('Email image upload error:', err);
      toast.error(err.message || 'Failed to upload image to Cloudinary');
    } finally {
      setIsUploadingEmailImage(false);
      if (e.target) e.target.value = '';
    }
  };

  // Dispatch OneSignal Web Push Broadcast
  const handleSendPushBroadcast = async (e) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushMessage.trim()) {
      toast.warning('Please enter both push title and message.');
      return;
    }

    if (!confirm(`Are you sure you want to broadcast this Web Push Notification to audience: "${pushAudience.toUpperCase()}"?`)) {
      return;
    }

    setPushSending(true);
    setResult(null);

    try {
      const res = await api.post('/notifications/broadcast', {
        title: pushTitle,
        message: pushMessage,
        url: pushUrl,
        bigPicture: pushBigPicture,
        targetAudience: pushAudience,
        customUserIds: pushCustomIds,
      });

      if (res.success) {
        toast.success('Web Push notification dispatched successfully! 🚀');
        setResult({
          type: 'success',
          message: `Push delivered successfully! OneSignal Push ID: ${res.id || 'Active'}`,
          recipients: res.recipients ?? 'Active subscribers',
        });
      } else {
        toast.error(res.message || 'Failed to dispatch push broadcast');
        setResult({
          type: 'error',
          message: res.message || 'Failed to dispatch push notification',
        });
      }
    } catch (err) {
      toast.error(err.message || 'Error communicating with notification service');
      setResult({
        type: 'error',
        message: err.message || 'Error communicating with notification service',
      });
    } finally {
      setPushSending(false);
    }
  };

  // Send Single Test Push to Current Admin / Device
  const handleSendTestPush = async () => {
    if (!pushTitle.trim() || !pushMessage.trim()) {
      toast.warning('Please enter a title and message first.');
      return;
    }

    setPushTestSending(true);
    try {
      // Ensure subscription active on this browser
      await oneSignalService.requestPermission();

      const res = await api.post('/notifications/test', {
        title: pushTitle,
        message: pushMessage,
        url: pushUrl || window.location.origin,
        bigPicture: pushBigPicture,
        target: 'admin',
      });

      if (res.success) {
        toast.success('Test push alert dispatched! Check your desktop/browser notification banner. 🔔');
      } else {
        toast.info(res.message || 'Push test sent to registered devices.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send test push');
    } finally {
      setPushTestSending(false);
    }
  };

  // Dispatch Email Broadcast
  const handleSendEmailBroadcast = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !messageHtml.trim()) {
      toast.warning('Please provide an email subject and message body.');
      return;
    }

    if (!confirm(`Are you sure you want to dispatch this email broadcast${sendPushWithEmail ? ' (+ Web Push)' : ''} to "${emailAudience.toUpperCase()}" with ${isImportant ? 'HIGH PRIORITY' : 'Standard Delivery'}?`)) {
      return;
    }

    setEmailSending(true);
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
          imageUrl: emailImage,
          targetAudience: emailAudience,
          customEmails,
          isImportant,
          sendPush: sendPushWithEmail,
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
      setEmailSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <AshokaChakra size={11} />
            <span>Omnichannel Broadcast Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Mass Client Communication
          </h1>
          <p className="text-xs text-slate-500">
            Send instant OneSignal browser push notifications and agency-grade HTML email broadcasts to all registered clients.
          </p>
        </div>

        {/* Channels Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto shadow-xs">
          <button
            type="button"
            onClick={() => { setBroadcastMode('push'); setResult(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
              broadcastMode === 'push'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>OneSignal Web Push</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            type="button"
            onClick={() => { setBroadcastMode('email'); setResult(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
              broadcastMode === 'email'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email Broadcast</span>
          </button>
        </div>
      </div>

      {/* OneSignal Live Connection Status Bar (Shown in Push mode) */}
      {broadcastMode === 'push' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/20 via-indigo-900/15 to-purple-900/20 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              📡
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-slate-900 dark:text-white">OneSignal Web Push Gateway:</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live &amp; Connected
                </span>
                {pushStatus?.totalSubscribers !== null && pushStatus?.totalSubscribers !== undefined && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                    👥 {pushStatus.totalSubscribers} Subscribed Devices
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pushes reach active desktop Chrome/Edge/Firefox and Android mobile screens even if browser tabs are closed.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendTestPush}
            disabled={pushTestSending}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 disabled:opacity-50"
          >
            {pushTestSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            <span>Test Push on My Device</span>
          </button>
        </div>
      )}

      {/* Result Status Banner */}
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
            {result.total !== undefined && (
              <div className="font-normal text-[11px] opacity-90 mt-0.5">
                Total Targeted: {result.total} • Successfully Sent: {result.sentCount} • Failed: {result.failed}
              </div>
            )}
            {result.recipients !== undefined && (
              <div className="font-normal text-[11px] opacity-90 mt-0.5">
                Recipients count: {result.recipients}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 1: ONESIGNAL WEB PUSH BROADCAST                     */}
      {/* ========================================================= */}
      {broadcastMode === 'push' && (
        <div className="space-y-6">
          
          {/* Presets Quick Loader */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Push Notification Presets:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {PUSH_TEMPLATE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPushPreset(preset)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-all cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Form (6 cols) */}
            <form onSubmit={handleSendPushBroadcast} className="lg:col-span-6 space-y-4">
              
              {/* Push Target Segment */}
              <div className="glass-panel p-5 rounded-2xl border border-white dark:border-slate-800 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                    1. Target Audience Segment
                  </label>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                    Device Subscribers
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'all', label: 'All Subscribed', desc: 'Every registered browser' },
                    { id: 'clients', label: 'Clients Only', desc: 'Non-admin users' },
                    { id: 'admins', label: 'Admins Only', desc: 'Agency Team' },
                    { id: 'custom', label: 'Custom User IDs', desc: 'Specific accounts' },
                  ].map((aud) => (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => setPushAudience(aud.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        pushAudience === aud.id
                          ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-500 text-purple-900 dark:text-purple-200 shadow-xs ring-1 ring-purple-400/50'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{aud.label}</div>
                      <div className="text-[10px] opacity-75 truncate">{aud.desc}</div>
                    </button>
                  ))}
                </div>

                {pushAudience === 'custom' && (
                  <div className="pt-2 animate-in fade-in">
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Comma-separated User IDs / Emails:
                    </label>
                    <textarea
                      rows={2}
                      value={pushCustomIds}
                      onChange={(e) => setPushCustomIds(e.target.value)}
                      placeholder="user_id_1, user_id_2, client@email.com"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-purple-500"
                    />
                  </div>
                )}
              </div>

              {/* Push Title & Message */}
              <div className="glass-panel p-5 rounded-2xl border border-white dark:border-slate-800 space-y-3 shadow-xs">
                <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                  2. Push Content
                </label>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Push Headline / Title *
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {pushTitle.length}/60
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      value={pushTitle}
                      onChange={(e) => setPushTitle(e.target.value)}
                      placeholder="e.g. ⚡ Limited Time ₹2,000 Launch Credit!"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-purple-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Push Body Text *
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {pushMessage.length}/140
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      required
                      maxLength={200}
                      value={pushMessage}
                      onChange={(e) => setPushMessage(e.target.value)}
                      placeholder="Write your push notification message..."
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Target Link & Banner Image (with Cloudinary Direct Upload) */}
              <div className="glass-panel p-5 rounded-2xl border border-white dark:border-slate-800 space-y-3 shadow-xs">
                <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                  3. Action Link &amp; Banner Image
                </label>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Click-Through Target URL
                    </label>
                    <input
                      type="text"
                      value={pushUrl}
                      onChange={(e) => setPushUrl(e.target.value)}
                      placeholder="https://local2brand.vercel.app/pricing"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-900 dark:text-white focus:outline-purple-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Expanded Banner Image (Cloudinary CDN or Web URL)
                      </label>
                      {pushBigPicture && (
                        <button
                          type="button"
                          onClick={() => setPushBigPicture('')}
                          className="text-[10px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove Image</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <input
                            type="url"
                            value={pushBigPicture}
                            onChange={(e) => setPushBigPicture(e.target.value)}
                            placeholder="Paste image URL or upload to Cloudinary..."
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-900 dark:text-white focus:outline-purple-500"
                          />
                          <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                        </div>

                        {/* Hidden native file input */}
                        <input
                          type="file"
                          ref={pushFileInputRef}
                          onChange={handleUploadPushImage}
                          accept="image/*"
                          className="hidden"
                        />

                        {/* Cloudinary Upload Button */}
                        <button
                          type="button"
                          disabled={isUploadingPushImage}
                          onClick={() => pushFileInputRef.current?.click()}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50 shadow-xs"
                        >
                          {isUploadingPushImage ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <UploadCloud className="w-3.5 h-3.5 text-purple-600" />
                          )}
                          <span>{isUploadingPushImage ? 'Uploading...' : 'Upload to Cloudinary'}</span>
                        </button>
                      </div>

                      {/* Cloudinary Live Thumbnail Preview */}
                      {pushBigPicture && (
                        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 p-2.5 flex items-center gap-3">
                          <img
                            src={pushBigPicture}
                            alt="Push Banner"
                            className="w-16 h-12 rounded-lg object-cover border border-purple-500/30 shrink-0 shadow-sm"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                                {pushBigPicture.includes('cloudinary.com') ? '☁️ Cloudinary CDN Edge' : '🌐 Web URL'}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate font-mono mt-1">
                              {pushBigPicture}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Push Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSendTestPush}
                  disabled={pushTestSending}
                  className="w-1/3 py-3 rounded-2xl font-bold text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {pushTestSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>Test Push</span>
                </button>

                <button
                  type="submit"
                  disabled={pushSending}
                  className="w-2/3 py-3 rounded-2xl font-black text-xs text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {pushSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Broadcasting Push...</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-4 h-4" />
                      <span>Broadcast Push Now</span>
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Right Live Device Push Preview (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Simulated Browser Push Alert
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-black border border-purple-300 dark:border-purple-800">
                    Live UI Preview
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewDevice === 'desktop' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs' : 'text-slate-500'
                    }`}
                    title="Desktop Chrome Toast"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewDevice === 'mobile' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs' : 'text-slate-500'
                    }`}
                    title="Mobile Android Chrome Banner"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Desktop Windows/Mac Push Simulation */}
              {previewDevice === 'desktop' && (
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                  <div className="absolute top-2 right-3 text-[10px] text-slate-400 font-mono">
                    Google Chrome • Windows/macOS Push
                  </div>

                  <div className="flex items-start gap-3.5 pt-3">
                    <img
                      src="/favicon.jpg"
                      alt="Local2Brand"
                      className="w-11 h-11 rounded-2xl object-cover border border-purple-500/40 shadow-md shrink-0"
                      onError={(e) => { e.target.src = 'https://local2brand.com/favicon.jpg'; }}
                    />

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-white truncate pr-2">
                          {pushTitle || 'LOCAL2BRAND Notification'}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">Just now</span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-snug line-clamp-3">
                        {pushMessage || 'Notification message text will appear here...'}
                      </p>

                      <div className="pt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span className="truncate">local2brand.vercel.app</span>
                        <span className="text-purple-400 font-bold flex items-center gap-0.5">
                          <span>Click to open</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {pushBigPicture && (
                    <div className="mt-3.5 rounded-xl overflow-hidden border border-slate-700 max-h-48">
                      <img
                        src={pushBigPicture}
                        alt="Push Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Chrome Push Simulation */}
              {previewDevice === 'mobile' && (
                <div className="max-w-xs mx-auto p-4 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <img src="/favicon.jpg" alt="" className="w-3.5 h-3.5 rounded-full" />
                      <span className="font-bold text-slate-200">Chrome</span>
                      <span>• local2brand.vercel.app</span>
                    </div>
                    <span>now</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <img
                      src="/favicon.jpg"
                      alt="Logo"
                      className="w-9 h-9 rounded-xl object-cover border border-purple-500/40 shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h4 className="text-xs font-black text-white truncate">
                        {pushTitle || 'LOCAL2BRAND'}
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {pushMessage || 'Notification message...'}
                      </p>
                    </div>
                  </div>

                  {pushBigPicture && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 max-h-36">
                      <img src={pushBigPicture} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {/* OneSignal Delivery Features Checklist */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                <div className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>OneSignal Delivery Capabilities</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Background Tab &amp; Closed Browser Wakeup</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Automatic Logged-in User Sync</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Instant Desktop Toast on Windows / Mac</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Android Chrome Push Notification Bar</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: MASS EMAIL BROADCAST                             */}
      {/* ========================================================= */}
      {broadcastMode === 'email' && (
        <div className="space-y-6">
          
          {/* Preset Quick Loader */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick 1-Click Email Presets:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {EMAIL_TEMPLATE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyEmailPreset(preset)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-all cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Form (6 cols) */}
            <form onSubmit={handleSendEmailBroadcast} className="lg:col-span-6 space-y-4">
              
              {/* Target Audience */}
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
                      onClick={() => setEmailAudience(aud.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        emailAudience === aud.id
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
                      Urgent headers &amp; clean DKIM to avoid spam folder.
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

                {emailAudience === 'custom' && (
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

              {/* Subject Line & Headline */}
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

              {/* Hero Graphic / Banner Image (with Cloudinary Direct Upload) */}
              <div className="glass-panel p-5 rounded-2xl border border-white dark:border-slate-800 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                    3. Promotional Banner Graphic (Optional)
                  </label>
                  {emailImage && (
                    <button
                      type="button"
                      onClick={() => setEmailImage('')}
                      className="text-[10px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        value={emailImage}
                        onChange={(e) => setEmailImage(e.target.value)}
                        placeholder="Paste image URL or upload to Cloudinary..."
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-900 dark:text-white focus:outline-purple-500"
                      />
                      <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    </div>

                    <input
                      type="file"
                      ref={emailFileInputRef}
                      onChange={handleUploadEmailImage}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={isUploadingEmailImage}
                      onClick={() => emailFileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50 shadow-xs"
                    >
                      {isUploadingEmailImage ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <UploadCloud className="w-3.5 h-3.5 text-purple-600" />
                      )}
                      <span>{isUploadingEmailImage ? 'Uploading...' : 'Upload to Cloudinary'}</span>
                    </button>
                  </div>

                  {emailImage && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 p-2.5 flex items-center gap-3">
                      <img
                        src={emailImage}
                        alt="Email Banner"
                        className="w-16 h-12 rounded-lg object-cover border border-purple-500/30 shrink-0 shadow-sm"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                            {emailImage.includes('cloudinary.com') ? '☁️ Cloudinary CDN Edge' : '🌐 Web URL'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate font-mono mt-1">
                          {emailImage}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className="glass-panel p-5 rounded-2xl border border-white dark:border-slate-800 space-y-3 shadow-xs">
                <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                  4. Message Content (Agency HTML Formatted)
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

              {/* Call-to-action */}
              <div className="glass-panel p-5 rounded-2xl border border-white dark:border-slate-800 space-y-3 shadow-xs">
                <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                  5. Call-To-Action Button (Optional)
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

              {/* Push Mirror Toggle */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    📡
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Mirror as OneSignal Push Notification</span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                        Live
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Dispatches simultaneous browser push alert to audience
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSendPushWithEmail(!sendPushWithEmail)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    sendPushWithEmail ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={sendPushWithEmail}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      sendPushWithEmail ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Dispatch Email Button */}
              <button
                type="submit"
                disabled={emailSending}
                className="w-full py-3.5 rounded-2xl font-black text-sm text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {emailSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching Broadcast Emails...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Email to {emailAudience === 'all' ? 'All Registered Users' : emailAudience.toUpperCase()}</span>
                  </>
                )}
              </button>
            </form>

            {/* Email Preview (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Live Agency Email Preview
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-black border border-emerald-300 dark:border-emerald-800">
                    WYSIWYG
                  </span>
                </div>
              </div>

              <div className="w-full rounded-2xl bg-slate-100 dark:bg-[#070a12] border border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-3.5 bg-white dark:bg-[#0b0f19] border-b border-slate-200 dark:border-slate-800 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">From: LOCAL2BRAND &lt;hello@local2brand.com&gt;</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono font-bold">TLS SSL</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 font-semibold truncate">
                    <span className="text-slate-400 dark:text-slate-500">To: </span>
                    <span>{emailAudience === 'all' ? 'All Registered Users' : `${emailAudience.toUpperCase()} Audience`}</span>
                  </div>
                  <div className="text-slate-900 dark:text-white font-bold text-xs truncate">
                    <span className="text-slate-400 dark:text-slate-500 font-normal">Subject: </span>
                    <span>{subject || 'No Subject Specified'}</span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 bg-slate-100 dark:bg-[#070a12]">
                  <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
                    <div className="h-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500" />
                    
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

                    {/* Graphic Banner in Preview */}
                    {emailImage && (
                      <div className="border-b border-slate-100 dark:border-slate-800 overflow-hidden max-h-56">
                        <img
                          src={emailImage}
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {heading && (
                      <div className="px-6 pt-5 pb-1 bg-white dark:bg-[#111827]">
                        <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                          {heading}
                        </h2>
                      </div>
                    )}

                    <div className="p-6 pt-2 space-y-4 text-xs bg-white dark:bg-[#111827]">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-slate-800 leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-200 break-words">
                        {messageHtml || 'Email body text will appear here...'}
                      </div>

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
      )}

    </div>
  );
}
