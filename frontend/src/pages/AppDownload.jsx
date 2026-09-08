import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Monitor,
  ArrowDownToLine,
  LayoutDashboard,
  Palette,
  CheckCircle,
  Home,
  Rocket,
  Smartphone as PhoneIcon
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
  const navigate = useNavigate();
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
      appDescription: 'Install our ultra-fast inbuilt web app directly to your device home screen. Monitor active website builds, communicate in real-time with your lead developer, track live milestones, test responsive demo previews, and receive instant push updates with 0 MB storage overhead.',
      version: 'v2.4.0 (PWA)',
      fileSize: '0 MB (Web App)',
      minAndroid: 'All Android devices (Chrome / Firefox / Edge / Samsung Browser)',
      minIos: 'iOS 14.0+ (Safari / Chrome)',
      packageName: 'com.local2brand.webapp',
      androidPackageName: 'com.local2brand.webapp',
      androidUserAgent: 'local2brand-android-app',
      customUserAgent: 'local2brand-android-app',
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
  const [topBannerOpen, setTopBannerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAndroidApp, setIsAndroidApp] = useState(false);
  const [isInsideInstalledApp, setIsInsideInstalledApp] = useState(false);
  const [isAlreadyInstalled, setIsAlreadyInstalled] = useState(false);
  const [activeTabPlatform, setActiveTabPlatform] = useState('android');

  const [waitlistForm, setWaitlistForm] = useState({
    name: user?.name || '',
    phoneOrEmail: user?.email || user?.phone || '',
    platform: 'Android',
  });
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Capture PWA Install Prompt and Detect Standalone / Android Package Execution
  useEffect(() => {
    let inPwaApp = false;
    let inAndroidApp = false;

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const ua = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();
      
      const configuredPackage = (appConfig.androidPackageName || appConfig.packageName || '').trim().toLowerCase();
      const configuredAgent = (appConfig.androidUserAgent || appConfig.customUserAgent || '').trim().toLowerCase();

      // 1. Check Android App Package & User-Agent Recognition
      const isParamAndroid = 
        urlParams.get('mode') === 'android_app' ||
        urlParams.get('source') === 'android' ||
        urlParams.get('platform') === 'android' ||
        (configuredPackage && urlParams.get('package')?.toLowerCase() === configuredPackage) ||
        (configuredPackage && urlParams.get('app_package')?.toLowerCase() === configuredPackage) ||
        (configuredPackage && urlParams.get('android_package')?.toLowerCase() === configuredPackage) ||
        (configuredAgent && urlParams.get('agent')?.toLowerCase() === configuredAgent);

      const isUaAndroidMatch = 
        (configuredAgent && ua.includes(configuredAgent)) ||
        (configuredPackage && ua.includes(configuredPackage)) ||
        (ua.includes('android') && (ua.includes('; wv') || ua.includes('version/4.0') || ua.includes('local2brand')));

      const isAndroidBridge = !!(window.Android || window.AndroidBridge || window.Local2BrandAndroid);
      const isReferrerAndroid = !!(document.referrer && (document.referrer.includes('android-app://') || (configuredPackage && document.referrer.includes(configuredPackage))));

      if (isParamAndroid || isUaAndroidMatch || isAndroidBridge || isReferrerAndroid) {
        inAndroidApp = true;
      }

      // 2. Check PWA Standalone App Recognition
      const isParamApp = urlParams.get('mode') === 'app' || urlParams.get('source') === 'pwa';
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = window.navigator.standalone === true;

      if (isParamApp || isStandaloneMedia || isIosStandalone) {
        inPwaApp = true;
      }

      const isCurrentlyInside = inAndroidApp || inPwaApp;
      setIsAndroidApp(inAndroidApp);
      setIsInsideInstalledApp(isCurrentlyInside);
      setIsAlreadyInstalled(isCurrentlyInside);

      // Verify with Chromium getInstalledRelatedApps API if running in browser
      if (!isCurrentlyInside && typeof navigator !== 'undefined' && 'getInstalledRelatedApps' in navigator) {
        navigator.getInstalledRelatedApps().then((relatedApps) => {
          if (Array.isArray(relatedApps) && relatedApps.length > 0) {
            setIsAlreadyInstalled(true);
          } else {
            setIsAlreadyInstalled(false);
            try {
              localStorage.removeItem('l2b_app_installed');
              sessionStorage.removeItem('l2b_is_app');
            } catch (e) {}
          }
        }).catch(() => {});
      }
    }

    if (typeof window !== 'undefined' && window.__deferredInstallPrompt) {
      setDeferredPrompt(window.__deferredInstallPrompt);
      setIsAlreadyInstalled(false);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.__deferredInstallPrompt = e;
      setDeferredPrompt(e);
      setIsAlreadyInstalled(false);
      setIsInsideInstalledApp(false);
      try {
        localStorage.removeItem('l2b_app_installed');
        sessionStorage.removeItem('l2b_is_app');
      } catch (err) {}
    };

    const handleAppInstalled = () => {
      setIsAlreadyInstalled(true);
      setIsInsideInstalledApp(true);
      setDeferredPrompt(null);
      setTopBannerOpen(false);
      toast.success('🎉 Thanks for downloading & installing LOCAL2BRAND Web App!', {
        toastId: 'pwa-installed-notification',
      });
    };

    const handlePwaReady = () => {
      if (window.__deferredInstallPrompt) {
        setDeferredPrompt(window.__deferredInstallPrompt);
        setIsAlreadyInstalled(false);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('pwa-install-ready', handlePwaReady);

    // Detect user OS platform
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
      window.removeEventListener('pwa-install-ready', handlePwaReady);
    };
  }, [appConfig.androidPackageName, appConfig.packageName, appConfig.androidUserAgent, appConfig.customUserAgent]);

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

  // Web App 1-Tap Immediate Install Handler
  const handleInstallWebApp = async () => {
    // Show top popup banner only if not already running in standalone app
    if (!isInsideInstalledApp) {
      setTopBannerOpen(true);
    }

    const promptObj = deferredPrompt || (typeof window !== 'undefined' && window.__deferredInstallPrompt);

    if (promptObj) {
      try {
        setDownloading(true);
        setDownloadProgress(40);
        await promptObj.prompt();
        const { outcome } = await promptObj.userChoice;
        setDownloadProgress(100);
        setDownloading(false);
        if (outcome === 'accepted') {
          setIsAlreadyInstalled(true);
          setIsInsideInstalledApp(true);
          setTopBannerOpen(false);
          toast.success('🎉 Thanks for downloading & installing LOCAL2BRAND Web App!', {
            toastId: 'pwa-installed-notification',
          });
        }
        setDeferredPrompt(null);
        if (typeof window !== 'undefined') window.__deferredInstallPrompt = null;
      } catch (err) {
        setDownloading(false);
        setInstallModalOpen(true);
      }
    } else {
      if (isInsideInstalledApp || (typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true))) {
        toast.success('🎉 LOCAL2BRAND Web App is already active on your device!', {
          toastId: 'pwa-already-installed',
        });
        setIsAlreadyInstalled(true);
        setIsInsideInstalledApp(true);
      } else {
        setInstallModalOpen(true);
        toast.info('📲 Follow the quick step on screen to add LOCAL2BRAND to your home screen!', {
          toastId: 'pwa-install-guide',
        });
      }
    }
  };

  // Launch / Open Web App Workspace Handler
  const handleOpenApp = (destination = '/') => {
    toast.success('🚀 Launching LOCAL2BRAND Web App workspace...', {
      autoClose: 1500,
      toastId: 'launch-l2b-app',
    });
    if (destination === 'dashboard' || (destination === '/' && user)) {
      navigate('/dashboard');
    } else {
      navigate(destination);
    }
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

  return (
    <>
      <SEO
        title={
          isInsideInstalledApp
            ? `LOCAL2BRAND Web App — Installed & Active (${appConfig.version || 'v2.4.0'})`
            : `Install ${appConfig.appName || 'LOCAL2BRAND Web App'} (${appConfig.version || 'v2.4.0 PWA'})`
        }
        description={appConfig.appDescription || 'Install official Inbuilt Web App with 1-tap home screen access and zero storage overhead.'}
      />

      {/* TOP FLOATING INBUILT INSTALL NOTIFICATION POPUP (Only shown in browser when not yet in standalone app) */}
      {topBannerOpen && !isInsideInstalledApp && (
        <div className="fixed top-20 inset-x-3 sm:inset-x-auto sm:right-6 z-[999999] max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 rounded-3xl border-2 border-purple-500/80 shadow-[0_15px_40px_rgba(124,58,237,0.35)] animate-in slide-in-from-top-6 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0 p-0.5 overflow-hidden">
                <img src="/favicon.jpg" alt="App Logo" className="w-full h-full object-cover rounded-xl" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  Install {appConfig.appName || 'LOCAL2BRAND Web App'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  1-Tap Home Screen App • 0 MB Storage
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTopBannerOpen(false)}
              className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3.5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstallWebApp}
              className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white l2b-gradient-bg shadow-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Tap to Install Now</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTopBannerOpen(false);
                setInstallModalOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Guide
            </button>
          </div>
        </div>
      )}

      {/* Main Container - Optimized for Zero Mobile Lag & 120 FPS Fluid Scroll */}
      <div className="page-header-offset pb-24 relative overflow-hidden transform-gpu">
        
        {/* Lightweight Background Layer (Video on desktop only, static lightweight CSS on mobile) */}
        <div className="absolute top-0 inset-x-0 h-[450px] sm:h-[650px] overflow-hidden pointer-events-none -z-20">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hidden sm:block w-full h-full object-cover opacity-20 dark:opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
            src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1728-large.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent sm:hidden" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        </div>

        {/* Ambient Hero Glow - Optimized for Mobile Performance */}
        <div className="hidden sm:block absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/20 rounded-full blur-[80px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Heritage Badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full badge-tricolor-india text-[11px] font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
              <span className="flex items-center gap-1 font-black text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-500/40 text-[10px]">
                <AshokaChakra size={11} />
                <span>Made in India 🇮🇳</span>
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-slate-700 dark:text-slate-300">
                {isAndroidApp
                  ? 'Android App Active 🤖'
                  : isInsideInstalledApp
                  ? 'Installed Web App Active'
                  : 'Official Inbuilt Web App'}
              </span>
            </div>
          </div>

          {/* HERO SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Badges, CTAs */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              
              <div className="space-y-3">
                
                {/* Mobile App Icon + Store Identity Header */}
                <div className="flex items-center justify-center lg:justify-start gap-3.5 mb-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-lg shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden">
                      <img src="/favicon.jpg" alt="App Icon" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  </div>
                  <div className="text-left leading-tight">
                    {isAndroidApp ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                        <Smartphone className="w-3 h-3 text-emerald-600" />
                        <span>Android App Active</span>
                      </span>
                    ) : isInsideInstalledApp ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Installed &amp; Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span>Verified Web App</span>
                      </span>
                    )}
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {appConfig.appName || 'LOCAL2BRAND Web App'}
                    </h2>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {appConfig.version || 'v2.4.0'} • {isAndroidApp ? (appConfig.androidPackageName || appConfig.packageName || 'Android App') : isInsideInstalledApp ? 'Standalone App Workspace' : 'Official Client Companion'}
                    </span>
                  </div>
                </div>

                {/* Main Headline (Celebratory when already inside Android/PWA app) */}
                {isAndroidApp ? (
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                    Thanks For Downloading!{' '}
                    <span className="l2b-gradient-text block sm:inline">LOCAL2BRAND Android App.</span>
                  </h1>
                ) : isInsideInstalledApp ? (
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                    Thanks For Downloading!{' '}
                    <span className="l2b-gradient-text block sm:inline">LOCAL2BRAND App.</span>
                  </h1>
                ) : (
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                    Transform Your Business{' '}
                    <span className="l2b-gradient-text block sm:inline">On Your Phone.</span>
                  </h1>
                )}

                {/* Subtitle */}
                {isAndroidApp ? (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                    You have successfully opened the official LOCAL2BRAND Android application ({appConfig.androidPackageName || appConfig.packageName || 'com.local2brand.webapp'}). Enjoy ultra-fast 60-120FPS native fluidity, real-time sprint radar tracking, 50+ interactive template previews, and direct lead developer consultations.
                  </p>
                ) : isInsideInstalledApp ? (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                    You have successfully opened the official LOCAL2BRAND Web App workspace! Enjoy instant 60FPS fluid navigation, live sprint radar tracking, 50+ interactive demo previews, and direct lead developer consultations with zero device storage footprint.
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                    {appConfig.appDescription || 'Install our ultra-fast inbuilt web app directly to your device home screen with 0 MB storage overhead.'}
                  </p>
                )}
              </div>

              {/* Minimal Trust / Telemetry Capsules */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-semibold">
                {isAndroidApp ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-300 shadow-2xs font-mono">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{appConfig.androidPackageName || appConfig.packageName || 'com.local2brand.webapp'}</span>
                  </div>
                ) : isInsideInstalledApp ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-300 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active Standalone Mode</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-2xs">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>4.9 / 5.0 Rating</span>
                  </div>
                )}
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-2xs">
                  <HardDrive className="w-3.5 h-3.5 text-purple-500" />
                  <span>{isAndroidApp ? 'Hardware Accelerated' : '0 MB Storage'}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>100% Verified SSL</span>
                </div>
              </div>

              {/* Action Buttons: Open App / Direct Install */}
              <div className="pt-2 space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
                  
                  {isAndroidApp || isInsideInstalledApp ? (
                    /* INSTALLED STATE: PROMINENT "OPEN APP" ACTION BUTTON */
                    <button
                      type="button"
                      onClick={() => handleOpenApp(user ? '/dashboard' : '/')}
                      className="relative group py-4 px-8 rounded-2xl font-black text-sm sm:text-base text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98 overflow-hidden w-full sm:w-auto"
                    >
                      <Sparkles className="w-5 h-5 text-amber-300 animate-spin [animation-duration:4s]" />
                      <div className="text-left leading-tight">
                        <span className="block text-[10px] font-bold text-white/80 uppercase tracking-wider">
                          {isAndroidApp ? 'Official Android Workspace' : 'Official Web App Workspace'}
                        </span>
                        <span className="block">
                          🚀 Open App / Launch Studio
                        </span>
                      </div>
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                    </button>
                  ) : (
                    /* UNINSTALLED STATE: 1-TAP INSTALL WEB APP BUTTON */
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
                          <ArrowDownToLine className="w-5 h-5 text-amber-300 animate-bounce" />
                          <div className="text-left leading-tight">
                            <span className="block text-[10px] font-bold text-white/80 uppercase tracking-wider">
                              1-Tap Direct Install
                            </span>
                            <span className="block">
                              ⚡ Install Web App Now
                            </span>
                          </div>
                        </>
                      )}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                    </button>
                  )}

                  {/* QR Code Quick Card */}
                  <div 
                    onClick={() => setQrModalOpen(true)}
                    className="group flex items-center justify-between sm:justify-start gap-3 p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-2xs hover:border-purple-500 text-xs cursor-pointer transition-all"
                    title="Click to Open QR Code Scanner"
                  >
                    <div className="relative w-10 h-10 rounded-xl bg-white p-0.5 border border-slate-200/60 shrink-0 overflow-hidden flex items-center justify-center">
                      <img 
                        src={qrCodeImageUrl} 
                        alt="QR Code" 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div className="text-left text-[11px] leading-tight pr-2">
                      <strong className="block text-slate-900 dark:text-white font-bold group-hover:text-purple-600 transition-colors">
                        Scan with Phone
                      </strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                        {isInsideInstalledApp ? 'Share with mobile' : 'Instant mobile install'}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                      <QrCode className="w-4 h-4" />
                    </div>
                  </div>

                </div>

                {/* Quick Action Navigation Grid for Installed App Users */}
                {isInsideInstalledApp && (
                  <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
                    <button
                      type="button"
                      onClick={() => handleOpenApp('/')}
                      className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 hover:border-purple-500 flex items-center gap-2 transition-all cursor-pointer shadow-2xs group"
                    >
                      <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Home className="w-3.5 h-3.5" />
                      </div>
                      <div className="leading-tight">
                        <span className="block text-[11px] font-bold text-slate-900 dark:text-white">Studio Home</span>
                        <span className="text-[9px] text-slate-400">Main overview</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenApp('/dashboard')}
                      className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 hover:border-purple-500 flex items-center gap-2 transition-all cursor-pointer shadow-2xs group"
                    >
                      <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <LayoutDashboard className="w-3.5 h-3.5" />
                      </div>
                      <div className="leading-tight">
                        <span className="block text-[11px] font-bold text-slate-900 dark:text-white">Dashboard</span>
                        <span className="text-[9px] text-slate-400">Client portal</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenApp('/demos')}
                      className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 hover:border-purple-500 flex items-center gap-2 transition-all cursor-pointer shadow-2xs group"
                    >
                      <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                        <Palette className="w-3.5 h-3.5" />
                      </div>
                      <div className="leading-tight">
                        <span className="block text-[11px] font-bold text-slate-900 dark:text-white">50+ Demos</span>
                        <span className="text-[9px] text-slate-400">Live templates</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenApp('/track-order')}
                      className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 hover:border-purple-500 flex items-center gap-2 transition-all cursor-pointer shadow-2xs group"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Compass className="w-3.5 h-3.5" />
                      </div>
                      <div className="leading-tight">
                        <span className="block text-[11px] font-bold text-slate-900 dark:text-white">Sprint Radar</span>
                        <span className="text-[9px] text-slate-400">Track delivery</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Native Android & iOS Versions: EXPLICITLY MARKED AS COMING SOON */}
                <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  
                  {/* Android Native Version Status */}
                  <div className="px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-xs font-semibold flex items-center gap-2 shadow-2xs">
                    <PlayStoreIcon className="w-4 h-4 opacity-75 shrink-0" />
                    <div className="text-left leading-tight">
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Android Native (.apk)</span>
                      <span className="block font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                        {appConfig.androidStatus === 'active' ? 'Live Release' : '🚧 Coming Soon'}
                      </span>
                    </div>
                  </div>

                  {/* iOS Native App Store Status */}
                  <div className="px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-xs font-semibold flex items-center gap-2 shadow-2xs">
                    <AppleIcon className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
                    <div className="text-left leading-tight">
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">iOS App Store</span>
                      <span className="block font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                        {appConfig.iosStatus === 'active' ? 'Live Release' : '🚧 Coming Soon'}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column: Web App Viewport Mockup */}
            <div className="lg:col-span-5 flex justify-center items-center pt-4 lg:pt-0 relative">
              
              {/* Smartphone Chassis */}
              <div className="relative w-[260px] sm:w-[290px] max-w-full rounded-[44px] p-3 bg-slate-950 dark:bg-black border-[4px] border-slate-700 dark:border-slate-800 shadow-xl">
                
                {/* Dynamic Island Speaker Punch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black rounded-full z-30 flex items-center justify-between px-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
                </div>

                {/* Inner Phone Screen Display */}
                <div className="relative rounded-[32px] overflow-hidden bg-slate-900 aspect-[9/19] flex flex-col justify-between border border-white/10 shadow-inner">
                  
                  {/* Active Web App Screenshot Display */}
                  {screenshots[activeScreenIndex] && (
                    <img
                      src={screenshots[activeScreenIndex].url}
                      alt={screenshots[activeScreenIndex].title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-opacity duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                  )}

                  {/* In-Mockup Overlay Header */}
                  <div className="absolute top-0 inset-x-0 pt-6 pb-2.5 px-3.5 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between text-white text-[9px] z-20">
                    <div className="flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="truncate max-w-[110px]">{appConfig.appName || 'LOCAL2BRAND'}</span>
                    </div>
                    <span className="text-[8px] font-mono opacity-80">{appConfig.version || 'v2.4.0'}</span>
                  </div>

                  {/* In-Mockup Overlay Footer */}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/95 via-black/75 to-transparent text-white z-20">
                    <div className="p-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-center space-y-0.5">
                      <span className="text-[9px] font-black text-purple-300 block uppercase tracking-wider truncate">
                        {screenshots[activeScreenIndex]?.title || 'Inbuilt Web App Experience'}
                      </span>
                      <p className="text-[8px] text-white/90 line-clamp-1 leading-tight">
                        {screenshots[activeScreenIndex]?.caption || 'Supercharged for fast client responses.'}
                      </p>
                    </div>

                    {/* Screen Switcher Dots */}
                    <div className="flex items-center justify-center gap-1 pt-2">
                      {screenshots.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveScreenIndex(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            activeScreenIndex === idx ? 'w-5 bg-purple-400' : 'w-1.5 bg-white/40'
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
          <div className="mt-16 sm:mt-24">
            <SectionHeading
              badge="Web App Views"
              title="Built For Speed &amp; Precision"
              subtitle="Inspect our responsive live views tailored specifically for ambitious businesses."
            />

            {/* Grid of Web App Screenshot Cards - Touch Scroll Optimized */}
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {screenshots.map((screen, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedScreenshot(screen)}
                  className="group relative rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 p-2.5 hover:border-purple-500 transition-all duration-200 shadow-2xs cursor-pointer"
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[9/16] bg-slate-950">
                    <img
                      src={screen.url}
                      alt={screen.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80';
                      }}
                    />

                    <div className="absolute inset-0 bg-purple-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-2.5 rounded-full bg-white text-purple-950 shadow-md">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 pb-0.5 px-0.5">
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white block group-hover:text-purple-600 transition-colors truncate">
                      {screen.title}
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 leading-snug">
                      {screen.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: 6-FEATURE BENTO MATRIX */}
          <div className="mt-16 sm:mt-24">
            <SectionHeading
              badge="Architecture"
              title="Next-Generation Inbuilt Web App"
              subtitle="Explore what makes the LOCAL2BRAND platform ultra-fast and easy to use."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-purple-400 transition-all duration-200 shadow-2xs space-y-2.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-2xs">
                    {feat.icon === 'Compass' && <Compass className="w-5 h-5" />}
                    {feat.icon === 'ShieldCheck' && <ShieldCheck className="w-5 h-5" />}
                    {feat.icon === 'Layers' && <Layers className="w-5 h-5" />}
                    {feat.icon === 'MessageSquare' && <MessageSquare className="w-5 h-5" />}
                    {feat.icon === 'Flame' && <Flame className="w-5 h-5" />}
                    {feat.icon !== 'Compass' && feat.icon !== 'ShieldCheck' && feat.icon !== 'Layers' && feat.icon !== 'MessageSquare' && feat.icon !== 'Flame' && <Zap className="w-5 h-5" />}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: 3-STEP VISUAL INSTALLATION GUIDE / INSTALLED STATUS */}
          <div className="mt-16 sm:mt-24">
            <div className="bg-white/80 dark:bg-slate-900/80 p-5 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xs relative overflow-hidden">
              
              {isAndroidApp || isInsideInstalledApp ? (
                /* INSTALLED EXPERIENCE */
                <>
                  <div className="text-center max-w-2xl mx-auto space-y-1.5 mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isAndroidApp ? 'Android App Active & Ready' : 'Web App Active & Ready'}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {isAndroidApp ? 'Your Installed Android App Advantages 🎉' : 'Your Installed Web App Advantages 🎉'}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {isAndroidApp
                        ? 'You are running the official Android package with dedicated hardware acceleration and zero lag.'
                        : 'You are using the highest-tier web application stack with instant launches and zero device lag.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Feature 1 */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 relative space-y-1.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        <Zap className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {isAndroidApp ? 'Direct App Launcher Access' : '1-Tap Home Screen Launch'}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isAndroidApp
                          ? 'Launch directly from your Android device application drawer with full native hardware integration.'
                          : 'Directly launch without opening browser tabs or typing URLs. Enjoy full-screen distraction-free workspace.'}
                      </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 relative space-y-1.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        <Flame className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Sub-Second 60-120FPS Speed
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Hardware accelerated client portal engine loads staging previews and deliverables with ultra-smooth 60FPS.
                      </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 relative space-y-1.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Real-Time WhatsApp &amp; Sprint Radar
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Track live staging deployments, approve milestone mockups, and chat directly with lead architects.
                      </p>
                    </div>
                  </div>

                  {/* Bottom CTA for Installed App */}
                  <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {isAndroidApp
                          ? `Android App Active • ${appConfig.androidPackageName || appConfig.packageName || 'com.local2brand.webapp'}`
                          : `Running in Standalone Mode • Version ${appConfig.version || 'v2.4.0'}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenApp(user ? '/dashboard' : '/')}
                      className="px-6 py-2.5 rounded-xl font-bold text-white l2b-gradient-bg hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs w-full sm:w-auto justify-center"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>🚀 Open App</span>
                    </button>
                  </div>
                </>
              ) : (
                /* UNINSTALLED 3-STEP GUIDE */
                <>
                  <div className="text-center max-w-2xl mx-auto space-y-1.5 mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>3 Simple Steps</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      How To Install The Web App
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Add to your phone or desktop home screen in seconds with 0 MB storage used.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Step 1 */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 relative space-y-1.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        1
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Tap &quot;Install Web App&quot;
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Click the <strong>Install Web App Now</strong> button above or scan the QR code with your phone.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 relative space-y-1.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        2
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Add To Home Screen
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Confirm prompt or tap <strong>Add to Home screen</strong> from your browser menu or share sheet.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 relative space-y-1.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        3
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Launch &amp; Track Instantly
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Open the app from your home screen anytime. Track milestones and message our lead architect!
                      </p>
                    </div>
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                      <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>100% Safe • Zero APK permissions • Instant auto-updates</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleInstallWebApp}
                      className="px-5 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs w-full sm:w-auto justify-center"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Install Web App Now</span>
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* MODAL 1: SCREENSHOT LIGHTBOX */}
      {selectedScreenshot && (
        <div 
          onClick={() => setSelectedScreenshot(null)}
          className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xs sm:max-w-sm max-h-[85vh] w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-3 flex flex-col space-y-2"
          >
            <button
              type="button"
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors z-20 cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="rounded-2xl overflow-hidden aspect-[9/16] bg-black max-h-[60vh] flex items-center justify-center">
              <img
                src={selectedScreenshot.url}
                alt={selectedScreenshot.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-white space-y-0.5 pt-1 text-center">
              <h3 className="text-xs font-bold">{selectedScreenshot.title}</h3>
              <p className="text-[10px] text-slate-300 leading-snug">{selectedScreenshot.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: QR CODE LARGE VIEW */}
      {qrModalOpen && (
        <div 
          onClick={() => setQrModalOpen(false)}
          className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3.5 text-center"
          >
            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-0.5 pt-1">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Scan with Phone Camera
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Point your phone camera to instantly open and install {appConfig.appName || 'LOCAL2BRAND Web App'}.
              </p>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-purple-500/20 shadow-inner flex flex-col items-center justify-center">
              <img 
                src={qrCodeImageUrl} 
                alt="QR Code" 
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain" 
              />
              <span className="text-[9px] text-slate-400 font-mono mt-1">
                Version {appConfig.version || 'v2.4.0'} • Instant 1-Tap Home Screen Install
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={qrCodeImageUrl}
                download={`${(appConfig.appName || 'LOCAL2BRAND').replace(/\s+/g, '_')}_QRCode.png`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Image</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied!</span>
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
            className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setInstallModalOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 text-center sm:text-left">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 inline-block">
                ⚡ 1-Tap Home Screen Install
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                How to Add Web App to Home Screen
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Follow the simple steps for your device below:
              </p>
            </div>

            {/* Platform Selector Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTabPlatform('android')}
                className={`py-1.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTabPlatform === 'android'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTabPlatform('ios')}
                className={`py-1.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTabPlatform === 'ios'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <AppleIcon className="w-3.5 h-3.5" />
                <span>iPhone</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTabPlatform('desktop')}
                className={`py-1.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTabPlatform === 'desktop'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>

            {/* Step-by-Step Instructions based on selected platform */}
            <div className="space-y-2.5 pt-1 text-xs">
              {activeTabPlatform === 'android' && (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">1</div>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                      Tap the <strong>three vertical dots (⋮)</strong> in the top-right corner of Chrome / Android browser.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">2</div>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                      Tap <strong>&quot;Install App&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">3</div>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                      Tap <strong>&quot;Install&quot;</strong>. The app icon will immediately appear on your phone home screen!
                    </p>
                  </div>
                </div>
              )}

              {activeTabPlatform === 'ios' && (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">1</div>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                      In Safari, tap the <strong>Share button (⎋ / square with arrow)</strong> at the bottom of the screen.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">2</div>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                      Scroll down and tap <strong>&quot;Add to Home Screen&quot; (⊕)</strong>.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">3</div>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                      Tap <strong>&quot;Add&quot;</strong> in the top right. You can now launch LOCAL2BRAND directly from your iPhone home screen!
                    </p>
                  </div>
                </div>
              )}

              {activeTabPlatform === 'desktop' && (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">1</div>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                      In Chrome / Edge, look at the right side of the address / URL bar for the <strong>&quot;Install App&quot; icon (⊕)</strong>.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">2</div>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                      Click <strong>&quot;Install&quot;</strong>. The app will launch in its own dedicated, distraction-free desktop window!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setInstallModalOpen(false)}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white l2b-gradient-bg shadow-sm cursor-pointer mt-1"
            >
              Got It!
            </button>
          </div>
        </div>
      )}

    </>
  );
}
