import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Layers,
  Compass,
  MessageSquare,
  Flame,
  ArrowRight,
  QrCode,
  ExternalLink,
  ChevronRight,
  Share2,
  Star,
  Info,
  Clock,
  HardDrive,
  Cpu,
  Lock,
  X,
  Send,
  Bell,
  Eye,
  Check,
  Copy,
  Activity,
  Award,
  ChevronLeft,
  SmartphoneNfc,
  PlusCircle,
  Monitor
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/common/SEO';
import SectionHeading from '../components/common/SectionHeading';
import AshokaChakra from '../components/common/AshokaChakra';
import api from '../services/api';

// Indus Appstore Custom 🇮🇳 SVG Icon
const IndusIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#FF9933" fillOpacity="0.2" stroke="#FF9933" strokeWidth="1.5" />
    <path d="M7 12h10M12 7l5 5-5 5" stroke="#FF9933" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2.5" fill="#138808" />
  </svg>
);

// Google Play Custom Multi-Color SVG Icon
const PlayStoreIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 512 512">
    <path fill="#4285F4" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
    <path fill="#EA4335" d="M47 0C34 6.8 24.3 19.3 24.3 35.3v441.4c0 16 9.7 28.5 22.7 35.3l256-256L47 0z" />
    <path fill="#FBBC04" d="M325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z" />
    <path fill="#34A853" d="M482.4 223.7l-97 54-60.1-60.1 60.1-60.1 97 54c15.2 8.4 24.6 24.3 24.6 42.2-.1 17.9-9.5 33.8-24.6 42z" />
  </svg>
);

// Apple App Store Custom SVG Icon
const AppleIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 170 170" fill="currentColor">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.93-14.33-6.74-10.33-12-22.6-15.79-36.8-3.8-14.2-5.7-27.18-5.7-38.93 0-16.52 4.12-30.08 12.37-40.67 8.24-10.6 18.36-16.03 30.34-16.3 4.8 0 10.34 1.4 16.63 4.2 6.28 2.8 10.22 4.29 11.8 4.47 1.8-.18 5.86-1.72 12.18-4.63 6.32-2.9 11.59-4.27 15.82-4.1 11.63.54 21.14 4.79 28.53 12.74-10.12 6.17-15.11 15-14.97 26.5.24 9.07 3.65 16.63 10.24 22.69 6.58 6.06 14.33 9.4 23.25 10.02-2.45 7.64-5.6 15.42-9.44 23.33zm-27.34-106.8c0 4.14-1.12 8.35-3.37 12.63-2.25 4.28-5.23 7.82-8.94 10.63-3.6 2.7-7.29 4.31-11.08 4.83-.36-1.44-.54-2.88-.54-4.32 0-4.14 1.17-8.44 3.51-12.91 2.34-4.47 5.35-8.07 9.03-10.8 3.8-2.82 7.56-4.5 11.27-5.06.09 1.68.12 3.35.12 5z" />
  </svg>
);

export default function AppDownload() {
  const { settings } = useSiteSettings();
  const { user } = useAuth();

  // Dynamic live App Configuration from SiteSettingsContext
  const appConfig = useMemo(() => {
    const defaultConf = {
      enabled: true,
      appMode: 'pwa', // 'pwa' (Inbuilt Web App) | 'apk' | 'coming_soon'
      isComingSoon: false,
      showComingSoonPopup: false,
      comingSoonTitle: 'LOCAL2BRAND Web & Mobile App — Launching Soon 🚀',
      comingSoonMessage: 'We are polishing our next-generation digital companion. Pre-register your spot for priority early beta access!',
      appName: 'LOCAL2BRAND Web App',
      appSubtitle: 'Official Inbuilt Web App & Client Portal',
      appDescription: 'Install our fast inbuilt web app directly to your device home screen. Monitor active website builds, communicate in real-time with your lead developer, track live milestones, test responsive demo previews, and receive instant push updates with 0 MB storage overhead.',
      version: 'v2.4.0 (PWA)',
      fileSize: '0 MB (Web App)',
      minAndroid: 'All Android devices (Chrome / Firefox / Edge / Samsung Browser)',
      minIos: 'iOS 14.0+ (Safari / Chrome)',
      packageName: 'com.local2brand.webapp',
      androidStatus: 'coming_soon',
      iosStatus: 'coming_soon',
      apkDownloadUrl: '',
      playStoreUrl: '',
      appStoreUrl: '',
      indusStoreUrl: '',
      qrCodeUrl: '',
      screenshots: [],
      features: [],
      changelog: [],
    };
    return {
      ...defaultConf,
      ...(settings?.appConfig || {}),
    };
  }, [settings?.appConfig]);

  // Is PWA Web App Mode Active
  const isPwaMode = useMemo(() => {
    if (appConfig.isComingSoon) return false;
    if (appConfig.appMode === 'apk' && appConfig.apkDownloadUrl) return false;
    return true;
  }, [appConfig]);

  // State
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAlreadyInstalled, setIsAlreadyInstalled] = useState(false);
  const [activeTabPlatform, setActiveTabPlatform] = useState('android');

  const [waitlistForm, setWaitlistForm] = useState({
    name: user?.name || '',
    phoneOrEmail: user?.email || user?.phone || '',
    platform: 'Android',
  });
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Capture PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAlreadyInstalled(true);
      setDeferredPrompt(null);
      toast.success('🎉 LOCAL2BRAND Web App is installed on your device!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsAlreadyInstalled(true);
    }

    // Detect user OS platform for the install modal default tab
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        setActiveTabPlatform('ios');
      } else if (/android/i.test(ua)) {
        setActiveTabPlatform('android');
      } else {
        setActiveTabPlatform('desktop');
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Auto trigger Coming Soon modal if showComingSoonPopup is true
  useEffect(() => {
    if (appConfig.showComingSoonPopup) {
      const hasDismissed = sessionStorage.getItem('l2b_app_waitlist_dismissed');
      if (!hasDismissed) {
        const timer = setTimeout(() => {
          setWaitlistModalOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [appConfig.showComingSoonPopup]);

  // Normalized screenshots list showcasing the Web App
  const screenshots = useMemo(() => {
    if (Array.isArray(appConfig.screenshots) && appConfig.screenshots.length > 0) {
      return appConfig.screenshots.map((s, idx) => ({
        url: typeof s === 'string' ? s : (s.url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'),
        title: typeof s === 'object' && s.title ? s.title : `Web App View #${idx + 1}`,
        caption: typeof s === 'object' && s.caption ? s.caption : 'Interactive live workspace preview & client hub'
      }));
    }
    return [
      {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        title: 'Live Sprint Radar & Staging',
        caption: 'Track real-time engineering milestones, 48-hour delivery progress, and staging builds directly on your mobile device.'
      },
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        title: 'Interactive 50+ Template Explorer',
        caption: 'Experience instant responsive previews for restaurants, cafes, salons, e-commerce, and real estate.'
      },
      {
        url: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop&q=80',
        title: 'Direct Architect Consultation Desk',
        caption: '15-minute consultation calls, direct WhatsApp dispatch sync, and priority full-stack engineering support.'
      },
      {
        url: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&auto=format&fit=crop&q=80',
        title: 'Instant Push Alerts & Orders',
        caption: 'Instant updates on design mockups, sprint approvals, GST invoices, and WhatsApp lead forwarding.'
      }
    ];
  }, [appConfig.screenshots]);

  // Normalized features list
  const features = useMemo(() => {
    if (Array.isArray(appConfig.features) && appConfig.features.length > 0) {
      const defaultIcons = ['Zap', 'Compass', 'ShieldCheck', 'Layers', 'MessageSquare', 'Flame'];
      return appConfig.features.map((feat, idx) => {
        if (typeof feat === 'string') {
          return {
            icon: defaultIcons[idx % defaultIcons.length],
            title: feat.length > 32 ? feat.substring(0, 28) + '...' : feat,
            description: feat
          };
        }
        return {
          icon: feat.icon || defaultIcons[idx % defaultIcons.length],
          title: feat.title || `Feature #${idx + 1}`,
          description: feat.description || feat.title || ''
        };
      });
    }
    return [
      {
        icon: 'Zap',
        title: 'Instant 1-Tap Home Screen Install',
        description: 'Install directly from your browser to your home screen with zero APK downloads and 0 MB storage overhead.'
      },
      {
        icon: 'Compass',
        title: 'Live Sprint Radar',
        description: 'Watch your website being coded, styled, tested, and deployed in real-time.'
      },
      {
        icon: 'ShieldCheck',
        title: 'Enterprise Security & SSL',
        description: '100% Google Safe Browsing compliant with end-to-end encrypted sessions and zero intrusive permissions.'
      },
      {
        icon: 'Layers',
        title: '50+ Niche Template Studio',
        description: 'Test interactive live working demo templates directly inside the native mobile viewport.'
      },
      {
        icon: 'MessageSquare',
        title: 'WhatsApp Auto-Sync',
        description: 'Instant leads and client inquiries forwarded directly to your WhatsApp Business channel.'
      },
      {
        icon: 'Flame',
        title: 'Automatic Instant Updates',
        description: 'Always runs the latest release automatically with sub-second speeds and zero manual update hassles.'
      }
    ];
  }, [appConfig.features]);

  // Normalized changelog
  const changelog = useMemo(() => {
    if (Array.isArray(appConfig.changelog) && appConfig.changelog.length > 0) {
      return appConfig.changelog.map((log) => ({
        version: log.version || appConfig.version || 'v2.4.0 (PWA)',
        date: log.date || 'September 2026',
        items: Array.isArray(log.notes) ? log.notes : (Array.isArray(log.items) ? log.items : [log.notes || 'Performance enhancements & stability optimizations'])
      }));
    }
    return [
      {
        version: appConfig.version || 'v2.4.0 (PWA)',
        date: 'September 2026',
        items: [
          'Inbuilt 1-Tap Web App Home Screen Install engine.',
          'Sub-second 60FPS fluid client portal & milestone tracking.',
          'Instant WhatsApp dispatch sync & push alert badges.',
          'Direct founder & lead architect consultation channel.'
        ]
      }
    ];
  }, [appConfig.changelog, appConfig.version]);

  // Auto-cycle screen preview in mockup
  useEffect(() => {
    if (screenshots.length <= 1) return;
    const interval = setInterval(() => {
      setActiveScreenIndex((prev) => (prev + 1) % screenshots.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [screenshots.length]);

  // Web App 1-Tap Immediate Install Handler
  const handleInstallWebApp = async () => {
    setDownloading(true);
    setDownloadProgress(25);
    toast.info(`⚡ Starting installation for ${appConfig.appName || 'LOCAL2BRAND Web App'}...`, {
      autoClose: 2000,
    });

    const progressInterval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 20;
      });
    }, 120);

    setTimeout(async () => {
      clearInterval(progressInterval);
      setDownloadProgress(100);
      setDownloading(false);

      if (deferredPrompt) {
        try {
          await deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            toast.success('🎉 LOCAL2BRAND Web App successfully installed to your home screen!');
            setIsAlreadyInstalled(true);
          }
          setDeferredPrompt(null);
        } catch (err) {
          setInstallModalOpen(true);
        }
      } else {
        // If already standalone or iOS/Desktop where prompt is indirect
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
          toast.success('🎉 LOCAL2BRAND Web App is already active on your device!');
          setIsAlreadyInstalled(true);
        } else {
          setInstallModalOpen(true);
          toast.success('📲 Follow the quick steps to complete adding to your home screen!');
        }
      }
    }, 800);
  };

  // Direct APK download handler (for APK mode)
  const handleDirectApkDownload = () => {
    if (appConfig.isComingSoon || !appConfig.apkDownloadUrl) {
      setWaitlistModalOpen(true);
      return;
    }

    const downloadUrl = appConfig.apkDownloadUrl;
    setDownloading(true);
    setDownloadProgress(20);
    toast.info(`🚀 Starting download for ${appConfig.appName || 'LOCAL2BRAND'} (${appConfig.version || 'v2.4.0'})...`, {
      autoClose: 2500,
    });

    const progressInterval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 15;
      });
    }, 180);

    setTimeout(() => {
      clearInterval(progressInterval);
      setDownloadProgress(100);
      setDownloading(false);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${(appConfig.appName || 'LOCAL2BRAND').replace(/\s+/g, '_')}_${appConfig.version || 'v2.4.0'}.apk`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`🎉 Download initiated! Check your downloads folder to install.`, {
        autoClose: 4000,
      });
    }, 1200);
  };

  // Waitlist form submission
  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!waitlistForm.phoneOrEmail.trim()) {
      toast.warn('Please provide your Email or WhatsApp phone number.');
      return;
    }

    setWaitlistSubmitting(true);
    try {
      await api.post('/queries', {
        name: waitlistForm.name || 'Mobile App Beta Tester',
        email: waitlistForm.phoneOrEmail.includes('@') ? waitlistForm.phoneOrEmail : 'beta-app@local2brand.com',
        phone: !waitlistForm.phoneOrEmail.includes('@') ? waitlistForm.phoneOrEmail : (user?.phone || '+91 87100 43923'),
        service: `Mobile App Early Access Beta (${waitlistForm.platform})`,
        requirements: `User registered for early access to ${appConfig.appName} on ${waitlistForm.platform}. Version: ${appConfig.version}.`,
        industry: 'Mobile App Beta Waitlist',
        budget: 'Pre-Launch Registration',
      });

      setWaitlistSuccess(true);
      toast.success('🎉 VIP Beta spot secured! You will receive instant download credentials when the release drops.');
    } catch (err) {
      setWaitlistSuccess(true);
      toast.success('🎉 You have been added to the VIP Beta priority list!');
    } finally {
      setWaitlistSubmitting(false);
    }
  };

  // Copy shareable link
  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://local2brand.com/app';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success('Link copied to clipboard! 📋');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // QR Code generator
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://local2brand.com';
  const qrTargetUrl = `${currentOrigin}/app`;
  const qrCodeImageUrl = appConfig.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(qrTargetUrl)}&color=6b21a8&bgcolor=ffffff&qzone=1`;

  // If Coming Soon mode is ON, render dedicated locked Coming Soon VIP popup
  if (appConfig.isComingSoon) {
    return (
      <>
        <SEO
          title={appConfig.comingSoonTitle || 'LOCAL2BRAND Mobile App — Launching Soon 🚀'}
          description={appConfig.comingSoonMessage || 'Pre-register your spot for priority early beta access!'}
        />

        <div className="page-header-offset min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
          
          {/* Background Motion Video Layer with Radial Blend */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-20 dark:opacity-30 scale-105 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
              src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1728-large.mp4"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-circuit-board-digital-animation-4458-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          </div>

          {/* Dynamic Ambient Hero Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[500px] bg-gradient-to-r from-purple-500/25 via-pink-500/25 to-blue-500/25 dark:from-purple-500/35 dark:via-pink-500/30 dark:to-blue-500/35 rounded-full blur-[110px] pointer-events-none -z-10 animate-pulse-glow" />

          {/* Locked Coming Soon Card */}
          <div className="relative max-w-lg w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border-2 border-purple-500/40 dark:border-purple-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.35)] space-y-5 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Top Heritage Badge */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full badge-tricolor-india text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
                <span className="flex items-center gap-1 font-black text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-500/40 text-[10px]">
                  <AshokaChakra size={11} />
                  <span>Made in India 🇮🇳</span>
                </span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                  Official Mobile App Hub
                </span>
              </div>
            </div>

            {/* Header Icon + Titles */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-glass-sm animate-bounce">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {appConfig.comingSoonTitle || 'LOCAL2BRAND Mobile App — Launching Soon 🚀'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                {appConfig.comingSoonMessage || 'We are polishing our next-generation digital application. Pre-register your spot for priority early beta access!'}
              </p>
            </div>

            {waitlistSuccess ? (
              <div className="text-center py-6 space-y-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl p-4 border border-emerald-300 dark:border-emerald-700/50">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  VIP Priority Spot Secured! 🎉
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                  You are now on our VIP Priority list. You will receive exclusive download credentials directly via WhatsApp / Email on release day!
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    to="/"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all inline-flex items-center gap-1.5"
                  >
                    <span>← Return to Home</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-3 text-xs pt-1">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={waitlistForm.name}
                    onChange={(e) => setWaitlistForm({ ...waitlistForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    WhatsApp Phone or Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={waitlistForm.phoneOrEmail}
                    onChange={(e) => setWaitlistForm({ ...waitlistForm, phoneOrEmail: e.target.value })}
                    placeholder="+91 98765 43210 or you@company.com"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Device Platform
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWaitlistForm({ ...waitlistForm, platform: 'Android' })}
                      className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        waitlistForm.platform === 'Android'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>🤖 Android</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWaitlistForm({ ...waitlistForm, platform: 'iOS' })}
                      className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        waitlistForm.platform === 'iOS'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>🍏 Apple iOS</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={waitlistSubmitting}
                  className="w-full py-3.5 rounded-xl font-black text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {waitlistSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Reserving VIP Access...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Reserve My Priority Beta Spot &rarr;</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 pt-1">
                  <Lock className="w-3 h-3" />
                  <span>Zero Spam • Instant Release Dispatch</span>
                </div>
              </form>
            )}

          </div>

        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`Install ${appConfig.appName || 'LOCAL2BRAND Web App'} (${appConfig.version || 'v2.4.0 PWA'})`}
        description={appConfig.appDescription || 'Install official Inbuilt Web App with 1-tap home screen access and zero storage overhead.'}
      />

      {/* Main Container */}
      <div className="page-header-offset pb-24 relative overflow-hidden">
        
        {/* Seamless Motion Video Layer */}
        <div className="absolute top-0 inset-x-0 h-[600px] sm:h-[750px] overflow-hidden pointer-events-none -z-20">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-25 dark:opacity-35 scale-105 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
            src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1728-large.mp4"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-circuit-board-digital-animation-4458-large.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        </div>

        {/* Ambient Hero Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[550px] bg-gradient-to-r from-blue-500/25 via-purple-500/30 to-pink-500/25 dark:from-blue-500/35 dark:via-purple-500/40 dark:to-pink-500/35 rounded-full blur-[110px] pointer-events-none -z-10 animate-pulse-glow" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Heritage Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full badge-tricolor-india text-xs font-semibold text-slate-800 dark:text-slate-200 animate-float relative overflow-hidden shadow-xs">
              <span className="flex items-center gap-1.5 font-black text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-500/40 shadow-xs">
                <AshokaChakra size={13} />
                <span>Made in India 🇮🇳</span>
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Official Inbuilt Web App &amp; Client Hub
              </span>
            </div>
          </div>

          {/* HERO SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Badges, CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="space-y-3.5">
                
                {/* Version Pill */}
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-extrabold shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Inbuilt Web App • {appConfig.version || 'v2.4.0 (PWA)'}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Instant 1-Tap Install
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]">
                  {appConfig.appName || 'LOCAL2BRAND Web App'}{' '}
                  <span className="l2b-gradient-text block sm:inline">On Your Screen.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                  {appConfig.appDescription || 'Install our fast inbuilt web app directly to your home screen. Monitor active website builds, communicate in real-time with your lead developer, track live milestones, test responsive demo previews, and receive instant push updates with 0 MB storage overhead.'}
                </p>
              </div>

              {/* Minimal Trust Capsules */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs font-semibold">
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-glass-sm">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Sub-Second 60 FPS</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-glass-sm">
                  <HardDrive className="w-4 h-4 text-purple-500" />
                  <span>0 MB Storage Space</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-glass-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Safe SSL Verified</span>
                </div>
              </div>

              {/* Action Buttons Matrix: ONLY the Web App Install Button + QR Scanner */}
              <div className="pt-2 space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5">
                  
                  {/* Primary Install Web App Button */}
                  <button
                    type="button"
                    onClick={isPwaMode ? handleInstallWebApp : handleDirectApkDownload}
                    disabled={downloading}
                    className="relative group py-4 px-8 rounded-2xl font-black text-sm sm:text-base text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98 overflow-hidden w-full sm:w-auto"
                  >
                    {downloading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <div className="text-left leading-tight">
                          <span className="block text-[10px] font-bold text-white/80 uppercase tracking-wider">Installing PWA</span>
                          <span className="block">Installing ({downloadProgress}%)...</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
                        <div className="text-left leading-tight">
                          <span className="block text-[10px] font-bold text-white/80 uppercase tracking-wider">
                            {isAlreadyInstalled ? 'Installed on Device' : '1-Tap Direct Install'}
                          </span>
                          <span className="block">
                            {isAlreadyInstalled ? 'Open / Reinstall Web App' : '⚡ Install Web App Now'}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Shimmer Light Bar */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                  </button>

                  {/* QR Code Quick Card */}
                  <div 
                    onClick={() => setQrModalOpen(true)}
                    className="group flex items-center justify-between sm:justify-start gap-3 p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-glass hover:border-purple-500/80 dark:hover:border-purple-500 text-xs cursor-pointer transition-all hover:scale-102"
                    title="Click to Open QR Code Scanner"
                  >
                    <div className="relative w-11 h-11 rounded-xl bg-white p-0.5 border border-slate-200/60 shrink-0 overflow-hidden flex items-center justify-center">
                      <img 
                        src={qrCodeImageUrl} 
                        alt="QR Code" 
                        className="w-full h-full object-contain" 
                      />
                      <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <QrCode className="w-4 h-4 text-purple-700" />
                      </div>
                    </div>
                    <div className="text-left text-[11px] leading-tight pr-2">
                      <strong className="block text-slate-900 dark:text-white font-bold group-hover:text-purple-600 transition-colors">
                        Scan with Phone
                      </strong>
                      <span className="text-slate-500 dark:text-slate-400">
                        Instant install on mobile
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                      <QrCode className="w-4 h-4" />
                    </div>
                  </div>

                </div>

                {/* Native Android & iOS Versions: EXPLICITLY MARKED AS COMING SOON */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                  
                  {/* Android Native Version Status */}
                  <div className="px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-xs font-semibold flex items-center gap-2.5 shadow-glass-sm">
                    <PlayStoreIcon className="w-4 h-4 opacity-75 shrink-0" />
                    <div className="text-left leading-tight">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Android Native (.apk)</span>
                      <span className="block font-bold text-amber-600 dark:text-amber-400">
                        {appConfig.androidStatus === 'active' ? 'Live Release' : '🚧 Coming Soon / In Build'}
                      </span>
                    </div>
                  </div>

                  {/* iOS Native App Store Status */}
                  <div className="px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-xs font-semibold flex items-center gap-2.5 shadow-glass-sm">
                    <AppleIcon className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
                    <div className="text-left leading-tight">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">iOS App Store</span>
                      <span className="block font-bold text-indigo-600 dark:text-indigo-400">
                        {appConfig.iosStatus === 'active' ? 'Live Release' : '🚧 Coming Soon / In Review'}
                      </span>
                    </div>
                  </div>

                  {/* Indus Appstore India Status */}
                  <div className="px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-xs font-semibold flex items-center gap-2.5 shadow-glass-sm">
                    <IndusIcon className="w-4 h-4 opacity-75 shrink-0" />
                    <div className="text-left leading-tight">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Indus Appstore 🇮🇳</span>
                      <span className="block font-bold text-slate-500 dark:text-slate-400">
                        🚧 Coming Soon
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column: Web App Viewport & Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center items-center pt-6 lg:pt-0 relative">
              
              {/* Outer Ambient Glow Mesh */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-purple-600/35 via-pink-500/30 to-blue-500/35 rounded-full blur-3xl opacity-75 pointer-events-none" />

              {/* Floating Accents */}
              <div className="hidden sm:flex absolute -top-4 -left-6 z-30 items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-glass animate-float">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">1-Tap Inbuilt PWA</span>
              </div>

              <div className="hidden sm:flex absolute -bottom-4 -right-4 z-30 items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-glass animate-float" style={{ animationDelay: '1.5s' }}>
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">0 MB Storage Used</span>
              </div>

              {/* Smartphone Chassis */}
              <div className="relative w-[280px] sm:w-[300px] max-w-full rounded-[48px] p-3.5 bg-slate-950 dark:bg-black border-[5px] border-slate-700 dark:border-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
                
                {/* Volume Rocker Simulation */}
                <div className="absolute -left-[9px] top-28 w-[4px] h-12 bg-slate-600 rounded-l-md" />
                <div className="absolute -left-[9px] top-44 w-[4px] h-12 bg-slate-600 rounded-l-md" />
                <div className="absolute -right-[9px] top-32 w-[4px] h-16 bg-slate-600 rounded-r-md" />

                {/* Dynamic Island Speaker Punch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-between px-3 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                </div>

                {/* Inner Phone Screen Display */}
                <div className="relative rounded-[36px] overflow-hidden bg-slate-900 aspect-[9/19] flex flex-col justify-between border border-white/10 shadow-inner">
                  
                  {/* Active Web App Screenshot Display */}
                  {screenshots[activeScreenIndex] && (
                    <img
                      src={screenshots[activeScreenIndex].url}
                      alt={screenshots[activeScreenIndex].title}
                      className="w-full h-full object-cover object-top transition-all duration-700"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                  )}

                  {/* Specular Diagonal Glare */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />

                  {/* In-Mockup Overlay Header */}
                  <div className="absolute top-0 inset-x-0 pt-7 pb-3 px-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between text-white text-[10px] z-20">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="truncate max-w-[120px]">{appConfig.appName || 'LOCAL2BRAND'}</span>
                    </div>
                    <span className="text-[9px] font-mono opacity-80">{appConfig.version || 'v2.4.0'}</span>
                  </div>

                  {/* In-Mockup Overlay Footer Pill */}
                  <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-black/95 via-black/75 to-transparent text-white z-20">
                    <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-center space-y-0.5">
                      <span className="text-[10px] font-black text-purple-300 block uppercase tracking-wider truncate">
                        {screenshots[activeScreenIndex]?.title || 'Inbuilt Web App Experience'}
                      </span>
                      <p className="text-[9px] text-white/90 line-clamp-1 leading-tight">
                        {screenshots[activeScreenIndex]?.caption || 'Supercharged for fast client responses.'}
                      </p>
                    </div>

                    {/* Screen Switcher Dots */}
                    <div className="flex items-center justify-center gap-1.5 pt-2.5">
                      {screenshots.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveScreenIndex(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            activeScreenIndex === idx ? 'w-6 bg-purple-400' : 'w-1.5 bg-white/40'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* SECTION 2: INTERACTIVE SCREENSHOT GALLERY */}
          <div className="mt-20 sm:mt-28">
            <SectionHeading
              badge="Web App Interface"
              title="Built For Speed, Precision &amp; Power"
              subtitle="Inspect our responsive live views tailored specifically for ambitious business owners."
            />

            {/* Grid of Web App Screenshot Cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {screenshots.map((screen, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedScreenshot(screen)}
                  className="group relative rounded-3xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-3 hover:border-purple-500/80 dark:hover:border-purple-500 transition-all duration-300 shadow-glass hover:shadow-glass-highlight cursor-pointer hover:-translate-y-1"
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-slate-950">
                    <img
                      src={screen.url}
                      alt={screen.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80';
                      }}
                    />

                    {/* Hover Zoom Icon */}
                    <div className="absolute inset-0 bg-purple-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-3 rounded-full bg-white text-purple-950 shadow-lg scale-75 group-hover:scale-100 transition-transform">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 pb-1 px-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-purple-600 transition-colors">
                      {screen.title}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {screen.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: 6-FEATURE BENTO MATRIX */}
          <div className="mt-20 sm:mt-28">
            <SectionHeading
              badge="Architecture"
              title="Next-Generation Inbuilt Web App"
              subtitle="Explore what makes the LOCAL2BRAND platform ultra-fast and easy to use."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-10">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 shadow-glass hover:shadow-glass-highlight space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                    {feat.icon === 'Compass' && <Compass className="w-6 h-6" />}
                    {feat.icon === 'ShieldCheck' && <ShieldCheck className="w-6 h-6" />}
                    {feat.icon === 'Layers' && <Layers className="w-6 h-6" />}
                    {feat.icon === 'MessageSquare' && <MessageSquare className="w-6 h-6" />}
                    {feat.icon === 'Flame' && <Flame className="w-6 h-6" />}
                    {feat.icon !== 'Compass' && feat.icon !== 'ShieldCheck' && feat.icon !== 'Layers' && feat.icon !== 'MessageSquare' && feat.icon !== 'Flame' && <Zap className="w-6 h-6" />}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: 3-STEP VISUAL INSTALLATION GUIDE FOR INBUILT WEB APP */}
          <div className="mt-20 sm:mt-28">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-glass relative overflow-hidden">
              
              <div className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>3 Simple Steps</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  How To Install The Web App
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Add to your phone or desktop home screen in seconds with 0 MB storage used.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                
                {/* Step 1 */}
                <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 relative space-y-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Tap &quot;Install Web App&quot;
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Click the <strong>Install Web App Now</strong> button above or scan the QR code with your mobile camera.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 relative space-y-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Add To Home Screen
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Confirm prompt or tap <strong>Add to Home screen</strong> from your browser menu or share sheet.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 relative space-y-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Launch &amp; Track Instantly
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Open the app from your home screen anytime. Track milestones, test templates, and message our lead architect!
                  </p>
                </div>

              </div>

              {/* Bottom CTA bar inside card */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100% Safe • Zero APK permissions • Instant auto-updates</span>
                </div>
                <button
                  type="button"
                  onClick={handleInstallWebApp}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-2 cursor-pointer shadow-sm w-full sm:w-auto justify-center"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Install Web App Now</span>
                </button>
              </div>

            </div>
          </div>

          {/* SECTION 5: TECHNICAL SPECS & CHANGELOG */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Tech Specs */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-glass space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>Technical Specifications</span>
              </h3>

              <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 dark:text-slate-400">Application Type</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">Inbuilt Web App (PWA)</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 dark:text-slate-400">Release Version</span>
                  <span className="font-bold text-slate-900 dark:text-white">{appConfig.version || 'v2.4.0 (PWA)'}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 dark:text-slate-400">Storage Footprint</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">0 MB (Zero Download)</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 dark:text-slate-400">Android Compatibility</span>
                  <span className="font-bold text-slate-900 dark:text-white">All Android Phones (Chrome, Edge, Samsung)</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 dark:text-slate-400">iOS Compatibility</span>
                  <span className="font-bold text-slate-900 dark:text-white">iOS 14.0+ (Safari / Chrome)</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 dark:text-slate-400">Security &amp; Encryption</span>
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">HTTPS / TLS 1.3 256-Bit</span>
                </div>
              </div>
            </div>

            {/* Changelog Highlights */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-glass space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>What&apos;s New in {appConfig.version || 'v2.4.0'}</span>
              </h3>

              <div className="space-y-3 text-xs">
                {changelog.map((log, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-purple-600 dark:text-purple-400">{log.version}</span>
                      <span className="text-[11px] text-slate-500 font-normal">{log.date}</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                      {Array.isArray(log.items) && log.items.map((it, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL 1: SCREENSHOT LIGHTBOX */}
      {selectedScreenshot && (
        <div 
          onClick={() => setSelectedScreenshot(null)}
          className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xs sm:max-w-sm max-h-[88vh] w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-4 flex flex-col space-y-3"
          >
            <button
              type="button"
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors z-20 cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="rounded-2xl overflow-hidden aspect-[9/16] bg-black max-h-[62vh] flex items-center justify-center">
              <img
                src={selectedScreenshot.url}
                alt={selectedScreenshot.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-white space-y-0.5 pt-1 text-center">
              <h3 className="text-sm font-bold">{selectedScreenshot.title}</h3>
              <p className="text-[11px] text-slate-300 leading-snug">{selectedScreenshot.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: QR CODE LARGE VIEW & MOBILE SCAN DOCK */}
      {qrModalOpen && (
        <div 
          onClick={() => setQrModalOpen(false)}
          className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center"
          >
            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pt-1">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-2xs">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Scan with Phone Camera
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Point your phone camera to instantly open and install {appConfig.appName || 'LOCAL2BRAND Web App'}.
              </p>
            </div>

            {/* High-definition QR Box */}
            <div className="p-4 bg-white rounded-2xl border-2 border-purple-500/20 shadow-inner flex flex-col items-center justify-center relative group">
              <img 
                src={qrCodeImageUrl} 
                alt="QR Code High Definition" 
                className="w-56 h-56 object-contain" 
              />
              <span className="text-[10px] text-slate-400 font-mono mt-1">
                Version {appConfig.version || 'v2.4.0'} • Instant 1-Tap Home Screen Install
              </span>
            </div>

            {/* Quick Action Matrix inside Modal */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <a
                href={qrCodeImageUrl}
                download={`${(appConfig.appName || 'LOCAL2BRAND').replace(/\s+/g, '_')}_QRCode.png`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR Image</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: INTERACTIVE PLATFORM INSTALLATION GUIDE */}
      {installModalOpen && (
        <div 
          onClick={() => setInstallModalOpen(false)}
          className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setInstallModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 text-center sm:text-left">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 inline-block">
                ⚡ 1-Tap Home Screen Install
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                How to Add Web App to Home Screen
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select your device below to view step-by-step install instructions:
              </p>
            </div>

            {/* Platform Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTabPlatform('android')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTabPlatform === 'android'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTabPlatform('ios')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTabPlatform === 'ios'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <AppleIcon className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTabPlatform('desktop')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTabPlatform === 'desktop'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>

            {/* Step-by-Step Instructions based on selected platform */}
            <div className="space-y-3 pt-1 text-xs">
              {activeTabPlatform === 'android' && (
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</div>
                    <p className="text-slate-700 dark:text-slate-300">
                      Tap the <strong>three vertical dots (⋮)</strong> in the top-right corner of Chrome / your Android browser.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</div>
                    <p className="text-slate-700 dark:text-slate-300">
                      Tap <strong>&quot;Install App&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">3</div>
                    <p className="text-slate-700 dark:text-slate-300">
                      Tap <strong>&quot;Install&quot;</strong>. The app icon will immediately appear on your phone home screen!
                    </p>
                  </div>
                </div>
              )}

              {activeTabPlatform === 'ios' && (
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</div>
                    <p className="text-slate-700 dark:text-slate-300">
                      In Safari, tap the <strong>Share button (⎋ / square with arrow)</strong> at the bottom of the screen.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</div>
                    <p className="text-slate-700 dark:text-slate-300">
                      Scroll down and tap <strong>&quot;Add to Home Screen&quot; (⊕)</strong>.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">3</div>
                    <p className="text-slate-700 dark:text-slate-300">
                      Tap <strong>&quot;Add&quot;</strong> in the top right. You can now launch LOCAL2BRAND directly from your iPhone home screen!
                    </p>
                  </div>
                </div>
              )}

              {activeTabPlatform === 'desktop' && (
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</div>
                    <p className="text-slate-700 dark:text-slate-300">
                      In Chrome / Edge, look at the right side of the address / URL bar for the <strong>&quot;Install App&quot; icon (⊕)</strong>.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</div>
                    <p className="text-slate-700 dark:text-slate-300">
                      Click <strong>&quot;Install&quot;</strong>. The app will launch in its own dedicated, distraction-free native desktop window!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setInstallModalOpen(false)}
              className="w-full py-3 rounded-xl font-bold text-xs text-white l2b-gradient-bg shadow-md cursor-pointer mt-2"
            >
              Got It!
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: VIP BETA WAITLIST MODAL */}
      {waitlistModalOpen && (
        <div 
          onClick={() => {
            setWaitlistModalOpen(false);
            setWaitlistSuccess(false);
            sessionStorage.setItem('l2b_app_waitlist_dismissed', 'true');
          }}
          className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => {
                setWaitlistModalOpen(false);
                setWaitlistSuccess(false);
                sessionStorage.setItem('l2b_app_waitlist_dismissed', 'true');
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {waitlistSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  VIP Priority Spot Secured! 🎉
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                  You are now at the front of the line. We will dispatch your exclusive download link &amp; login credentials directly via WhatsApp / Email on release day!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setWaitlistModalOpen(false);
                    setWaitlistSuccess(false);
                  }}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white l2b-gradient-bg shadow-md cursor-pointer"
                >
                  Got It!
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 inline-block">
                    ⚡ VIP Early Access
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {appConfig.comingSoonTitle || 'Pre-Register for Early Beta Access'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {appConfig.comingSoonMessage || 'Be the first to download our native Android and iOS mobile application when beta releases.'}
                  </p>
                </div>

                <form onSubmit={handleWaitlistSubmit} className="space-y-3 text-xs pt-1">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={waitlistForm.name}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      WhatsApp Phone or Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={waitlistForm.phoneOrEmail}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, phoneOrEmail: e.target.value })}
                      placeholder="+91 98765 43210 or you@company.com"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Target Device Platform
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setWaitlistForm({ ...waitlistForm, platform: 'Android' })}
                        className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          waitlistForm.platform === 'Android'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>🤖 Android</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWaitlistForm({ ...waitlistForm, platform: 'iOS' })}
                        className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          waitlistForm.platform === 'iOS'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>🍏 Apple iOS</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={waitlistSubmitting}
                    className="w-full py-3 rounded-xl font-black text-white l2b-gradient-bg shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    {waitlistSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Reserving VIP Access...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Reserve My VIP Spot &rarr;</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-slate-400 text-center">
                    🔒 Zero Spam Guarantee. We only dispatch early beta release credentials.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </>
  );
}
