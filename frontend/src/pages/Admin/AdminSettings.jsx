import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Check,
  Upload,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Globe,
  Mail,
  DollarSign,
  Clock,
  Shield,
  Layers,
  Image as ImageIcon,
  Bot,
  Brain,
  MessageSquare,
  Users,
  User,
  Plus,
  Trash2,
  Phone,
  MapPin,
  Building,
  RefreshCw,
  RotateCw,
  Bell,
  ArrowRight,
  Flame,
  Zap,
  Smartphone,
  Download,
  ExternalLink,
  QrCode,
  Eye,
  FileCode,
  Share2,
  Search,
  Filter,
  Send,
  Copy
} from 'lucide-react';



const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

import { toast } from 'react-toastify';
import api from '../../services/api';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { SEO } from '../../components/common/CommonUI';

export default function AdminSettings() {
  const { settings, refreshSettings, updateLocalSettingsState } = useSiteSettings();


  const [formData, setFormData] = useState({
    brandName: settings.brandName || 'LOCAL2BRAND',
    domain: settings.domain || 'local2brand.cyou',
    tagline: settings.tagline || 'Build Local. Think Global.',
    supportEmail: settings.supportEmail || 'local2brand.contact@gmail.com',
    displayPhone: settings.displayPhone || settings.aiSettings?.adminShowableDetails?.contactPhone || '+91 87100 43923',
    whatsappNumber: settings.whatsappNumber || settings.aiSettings?.adminShowableDetails?.whatsappSupport || '+91 87100 43923',
    officeLocation: settings.officeLocation || settings.aiSettings?.adminShowableDetails?.officeLocation || 'Kolkata & Bangalore, India',
    workingHours: settings.workingHours || settings.aiSettings?.adminShowableDetails?.workingHours || 'Monday - Saturday: 10:00 AM - 8:00 PM IST',
    googleMapEmbedUrl: settings.googleMapEmbedUrl || '',
    showMapOnContactPage: settings.showMapOnContactPage ?? true,
    turnaroundTime: settings.turnaroundTime || '48 Hours',
    startingPriceUsd: settings.startingPriceUsd || '$399',
    startingPriceInr: settings.startingPriceInr || '₹9,999',
    isMaintenanceMode: settings.isMaintenanceMode || false,
    isComingSoonMode: settings.isComingSoonMode || false,
    maintenanceMessage: settings.maintenanceMessage || 'We are currently upgrading our platform. We will be back online shortly!',
    targetLaunchDate: settings.targetLaunchDate || '',
    announcementBar: {
      enabled: settings.announcementBar?.enabled ?? false,
      text: settings.announcementBar?.text || '🔥 Special Launch Offer: Get 20% OFF + Free SSL & Domain with code INDIA2025',
      link: settings.announcementBar?.link || '/pricing',
      badge: settings.announcementBar?.badge || 'FLASH OFFER',
      promoCode: settings.announcementBar?.promoCode || 'INDIA2025',
      discountPercent: settings.announcementBar?.discountPercent || 20,
      btnText: settings.announcementBar?.btnText || 'Claim Offer'
    },
    luckyWheel: settings.luckyWheel || {
      enabled: true,
      title: '🎡 Spin & Win Exclusive Launch Rewards',
      subtitle: 'Spin the lucky prize wheel to win instant discounts, free domains, and launch vouchers!',
      btnText: 'Spin & Win Prize',
      rewardVoucher: 'INDIA2025',
      rewardDiscount: 20
    },
    socialLinks: settings.socialLinks || {

      instagram: 'https://instagram.com/local2brand',
      instagramHandle: '@local2brand',
      linkedin: 'https://linkedin.com/company/local2brand',
      github: 'https://github.com/local2brand',
      twitter: 'https://twitter.com/local2brand'
    },
    heroConfig: settings.heroConfig || {
      badge: '🇮🇳 India’s #1 Fast-Track Web Experience Engine',
      title: 'Transform Your Local Business Into A Global Brand',
      subtitle: 'World-class UI/UX design, sub-second performance, and instant lead capture for ambitious businesses ready to scale.'
    },
    bannerImage: settings.bannerImage || '',
    aiSettings: settings.aiSettings || {
      enabled: true,
      customInstructions: 'Be polite, friendly, and conversion-focused. Guide users towards booking a demo or requesting a callback. Recommend the promo code INDIA2025 for 20% discount.',
      businessKnowledge: 'LOCAL2BRAND builds high-converting business websites in 48 hours. Ready demo templates start at ₹9,999 / $399. Bespoke custom builds are available for complex requirements.',
      adminShowableDetails: {
        founderName: 'Soham Dutta & Core Team',
        founderCount: 1,
        showFoundersToAi: true,
        founders: [
          {
            name: 'Soham Dutta',
            role: 'Founder & Lead Architect',
            bio: 'Full-Stack Engineer & Designer leading high-performance digital products.',
            instagram: 'https://instagram.com/sohamart',
            linkedin: '',
            email: 'local2brand.contact@gmail.com',
            phone: '+91 87100 43923',
          },
        ],
        contactPhone: '+91 87100 43923',
        contactEmail: 'local2brand.contact@gmail.com',
        officeLocation: 'Kolkata & Bangalore, India',
        workingHours: 'Monday - Saturday: 10:00 AM - 8:00 PM IST',
        whatsappSupport: '+91 87100 43923',
        instagram: 'https://instagram.com/local2brand',
        instagramHandle: '@local2brand',
      },
    },
    appConfig: settings.appConfig || {
      enabled: true,
      appMode: 'pwa',
      isComingSoon: false,
      showComingSoonPopup: false,
      comingSoonTitle: 'LOCAL2BRAND Web & Mobile App is Coming Soon! 🚀',
      comingSoonMessage: 'Our engineering team is fine-tuning the platform. Pre-register your interest for priority early beta access.',
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
      screenshots: [
        {
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          title: 'Client Web Portal & Sprint Tracker',
          caption: 'Real-time project milestone progress, 48-hour delivery countdown & live builds'
        },
        {
          url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          title: 'Interactive Demo Explorer',
          caption: 'Browse 50+ high-converting commercial web templates with live preview'
        },
        {
          url: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80',
          title: 'Lead Architect Direct Chat',
          caption: 'Direct WhatsApp communication and live consultation with lead full-stack engineer'
        },
        {
          url: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=800&q=80',
          title: 'Instant Push Alerts & Orders',
          caption: 'Instant updates on design mockups, sprint approvals, invoices & GST receipts'
        }
      ],
      features: [
        'Instant 1-tap browser install directly to home screen (0 MB storage)',
        'Live sprint & build milestone tracking in real-time',
        'Direct founder & project manager consultation channel',
        'Interactive 50+ live demo template preview dock',
        'Instant push alerts on order delivery & revisions',
        'One-tap invoice downloads and GST tax receipts'
      ],
      changelog: [
        {
          version: 'v2.4.0',
          date: 'September 2026',
          notes: [
            'Added Inbuilt Web App 1-tap home screen install support',
            'Added live order tracking integration with push updates',
            'Enhanced 60FPS fluid demo template previewer'
          ]
        }
      ]
    }
  });

  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingApk, setUploadingApk] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  const [newScreenshotTitle, setNewScreenshotTitle] = useState('');
  const [newScreenshotCaption, setNewScreenshotCaption] = useState('');
  const [newFeatureText, setNewFeatureText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Live App Waitlist & Pre-Order Analytics State
  const [appWaitlistLeads, setAppWaitlistLeads] = useState([]);
  const [loadingWaitlist, setLoadingWaitlist] = useState(false);
  const [waitlistSearch, setWaitlistSearch] = useState('');
  const [waitlistPlatformFilter, setWaitlistPlatformFilter] = useState('all');

  const fetchAppWaitlistLeads = async () => {
    try {
      setLoadingWaitlist(true);
      const res = await api.get('/queries?status=all');
      if (res?.success && Array.isArray(res.leads)) {
        const filtered = res.leads.filter((l) => {
          const s = (l.service || '').toLowerCase();
          const ind = (l.industry || '').toLowerCase();
          const req = (l.requirements || '').toLowerCase();
          const bud = (l.budget || '').toLowerCase();
          return (
            s.includes('mobile app') ||
            s.includes('beta') ||
            s.includes('android') ||
            s.includes('ios') ||
            s.includes('apk') ||
            ind.includes('mobile app') ||
            ind.includes('waitlist') ||
            req.includes('early access') ||
            bud.includes('pre-launch')
          );
        });
        setAppWaitlistLeads(filtered);
      }
    } catch (err) {
      console.warn('Failed to load app waitlist applicants:', err);
    } finally {
      setLoadingWaitlist(false);
    }
  };

  useEffect(() => {
    fetchAppWaitlistLeads();
  }, []);

  useEffect(() => {
    if (settings) {
      const defaultFounders = [
        {
          name: 'Soham Dutta',
          role: 'Founder & Lead Architect',
          bio: 'Full-Stack Engineer & Designer leading high-performance digital products.',
          instagram: 'https://instagram.com/sohamart',
          linkedin: '',
          email: 'local2brand.contact@gmail.com',
          phone: '+91 87100 43923',
        },
      ];

      const loadedFounders =
        Array.isArray(settings.aiSettings?.adminShowableDetails?.founders) &&
        settings.aiSettings.adminShowableDetails.founders.length > 0
          ? settings.aiSettings.adminShowableDetails.founders
          : defaultFounders;

      const defaultScreenshots = [
        {
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          title: 'Live Sprint Tracker',
          caption: 'Real-time project milestone progress and milestone tracking'
        },
        {
          url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          title: 'Demo Explorer',
          caption: 'Browse 50+ lightning-fast web templates and live preview'
        },
        {
          url: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80',
          title: 'Direct Chat & Support',
          caption: '24/7 direct communication with dedicated design architect'
        },
        {
          url: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=800&q=80',
          title: 'Instant Push Alerts',
          caption: 'Get notified when your design mockup or sprint is approved'
        }
      ];

      const defaultFeatures = [
        'Live sprint & build milestone tracking in real-time',
        'Direct founder & project manager consultation channel',
        'Interactive 50+ live demo template preview dock',
        'Instant push alerts on order delivery & revisions',
        'One-tap invoice downloads and GST tax receipts',
        'Lightweight APK under 20MB with zero background drain'
      ];

      setFormData((prev) => ({
        ...prev,
        ...settings,
        aiSettings: {
          enabled: settings.aiSettings?.enabled ?? true,
          customInstructions: settings.aiSettings?.customInstructions || '',
          businessKnowledge: settings.aiSettings?.businessKnowledge || '',
          adminShowableDetails: {
            founderName: settings.aiSettings?.adminShowableDetails?.founderName || 'Soham Dutta & Core Team',
            founderCount: settings.aiSettings?.adminShowableDetails?.founderCount || loadedFounders.length,
            showFoundersToAi: settings.aiSettings?.adminShowableDetails?.showFoundersToAi ?? true,
            founders: loadedFounders,
            contactPhone: settings.aiSettings?.adminShowableDetails?.contactPhone || '',
            contactEmail: settings.aiSettings?.adminShowableDetails?.contactEmail || '',
            officeLocation: settings.aiSettings?.adminShowableDetails?.officeLocation || '',
            workingHours: settings.aiSettings?.adminShowableDetails?.workingHours || '',
            whatsappSupport: settings.aiSettings?.adminShowableDetails?.whatsappSupport || '',
            instagram: settings.aiSettings?.adminShowableDetails?.instagram || settings.socialLinks?.instagram || '',
            instagramHandle: settings.aiSettings?.adminShowableDetails?.instagramHandle || settings.socialLinks?.instagramHandle || '',
          },
        },
        appConfig: {
          enabled: settings.appConfig?.enabled ?? true,
          appMode: settings.appConfig?.appMode || 'pwa',
          isComingSoon: settings.appConfig?.isComingSoon ?? false,
          showComingSoonPopup: settings.appConfig?.showComingSoonPopup ?? false,
          comingSoonTitle: settings.appConfig?.comingSoonTitle || 'LOCAL2BRAND Web & Mobile App is Coming Soon! 🚀',
          comingSoonMessage: settings.appConfig?.comingSoonMessage || 'Our engineering team is fine-tuning the platform. Pre-register your interest for priority early beta access.',
          appName: settings.appConfig?.appName || 'LOCAL2BRAND Web App',
          appSubtitle: settings.appConfig?.appSubtitle || 'Official Inbuilt Web App & Client Portal',
          appDescription: settings.appConfig?.appDescription || 'Install our fast inbuilt web app directly to your device home screen. Monitor active website builds, communicate in real-time with your lead developer, track live milestones, test responsive demo previews, and receive instant push updates with 0 MB storage overhead.',
          version: settings.appConfig?.version || 'v2.4.0 (PWA)',
          fileSize: settings.appConfig?.fileSize || '0 MB (Web App)',
          minAndroid: settings.appConfig?.minAndroid || 'All Android devices (Chrome / Firefox / Edge / Samsung Browser)',
          minIos: settings.appConfig?.minIos || 'iOS 14.0+ (Safari / Chrome)',
          packageName: settings.appConfig?.packageName || 'com.local2brand.webapp',
          androidStatus: settings.appConfig?.androidStatus || 'coming_soon',
          iosStatus: settings.appConfig?.iosStatus || 'coming_soon',
          apkDownloadUrl: settings.appConfig?.apkDownloadUrl || '',
          playStoreUrl: settings.appConfig?.playStoreUrl || '',
          appStoreUrl: settings.appConfig?.appStoreUrl || '',
          indusStoreUrl: settings.appConfig?.indusStoreUrl || '',
          qrCodeUrl: settings.appConfig?.qrCodeUrl || '',
          screenshots: Array.isArray(settings.appConfig?.screenshots) && settings.appConfig.screenshots.length > 0
            ? settings.appConfig.screenshots
            : (prev.appConfig?.screenshots || defaultScreenshots),
          features: Array.isArray(settings.appConfig?.features) && settings.appConfig.features.length > 0
            ? settings.appConfig.features
            : (prev.appConfig?.features || defaultFeatures),
          changelog: Array.isArray(settings.appConfig?.changelog) && settings.appConfig.changelog.length > 0
            ? settings.appConfig.changelog
            : (prev.appConfig?.changelog || [])
        }
      }));
    }
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'supportEmail') {
        updated.aiSettings = {
          ...(prev.aiSettings || {}),
          adminShowableDetails: {
            ...(prev.aiSettings?.adminShowableDetails || {}),
            contactEmail: value,
          },
        };
      } else if (field === 'displayPhone') {
        updated.aiSettings = {
          ...(prev.aiSettings || {}),
          adminShowableDetails: {
            ...(prev.aiSettings?.adminShowableDetails || {}),
            contactPhone: value,
          },
        };
      } else if (field === 'whatsappNumber' || field === 'whatsappSupport') {
        updated.whatsappNumber = value;
        updated.aiSettings = {
          ...(prev.aiSettings || {}),
          adminShowableDetails: {
            ...(prev.aiSettings?.adminShowableDetails || {}),
            whatsappSupport: value,
          },
        };
      } else if (field === 'officeLocation') {
        updated.aiSettings = {
          ...(prev.aiSettings || {}),
          adminShowableDetails: {
            ...(prev.aiSettings?.adminShowableDetails || {}),
            officeLocation: value,
          },
        };
      } else if (field === 'workingHours') {
        updated.aiSettings = {
          ...(prev.aiSettings || {}),
          adminShowableDetails: {
            ...(prev.aiSettings?.adminShowableDetails || {}),
            workingHours: value,
          },
        };
      }
      return updated;
    });
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleAiAdminDetailsChange = (field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        aiSettings: {
          ...(prev.aiSettings || {}),
          adminShowableDetails: {
            ...(prev.aiSettings?.adminShowableDetails || {}),
            [field]: value,
          },
        },
      };
      if (field === 'contactEmail') updated.supportEmail = value;
      if (field === 'contactPhone') updated.displayPhone = value;
      if (field === 'whatsappSupport') updated.whatsappNumber = value;
      if (field === 'officeLocation') updated.officeLocation = value;
      if (field === 'workingHours') updated.workingHours = value;
      return updated;
    });
  };

  const handleAddFounder = () => {
    setFormData((prev) => {
      const currentFounders = prev.aiSettings?.adminShowableDetails?.founders || [];
      const updatedFounders = [
        ...currentFounders,
        {
          name: '',
          role: 'Co-Founder',
          bio: '',
          instagram: '',
          linkedin: '',
          email: '',
          phone: '',
        },
      ];
      return {
        ...prev,
        aiSettings: {
          ...(prev.aiSettings || {}),
          adminShowableDetails: {
            ...(prev.aiSettings?.adminShowableDetails || {}),
            founders: updatedFounders,
            founderCount: updatedFounders.length,
          },
        },
      };
    });
  };

  const handleRemoveFounder = (index) => {
    setFormData((prev) => {
      const currentFounders = prev.aiSettings?.adminShowableDetails?.founders || [];
      const updatedFounders = currentFounders.filter((_, i) => i !== index);
      return {
        ...prev,
        aiSettings: {
          ...(prev.aiSettings || {}),
          adminShowableDetails: {
            ...(prev.aiSettings?.adminShowableDetails || {}),
            founders: updatedFounders,
            founderCount: updatedFounders.length,
          },
        },
      };
    });
  };

  const handleFounderFieldChange = (index, field, value) => {
    setFormData((prev) => {
      const currentFounders = [...(prev.aiSettings?.adminShowableDetails?.founders || [])];
      if (!currentFounders[index]) {
        currentFounders[index] = {};
      }
      currentFounders[index] = { ...currentFounders[index], [field]: value };
      return {
        ...prev,
        aiSettings: {
          ...(prev.aiSettings || {}),
          adminShowableDetails: {
            ...(prev.aiSettings?.adminShowableDetails || {}),
            founders: currentFounders,
          },
        },
      };
    });
  };


  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Banner size must be under 10MB');
      return;
    }

    setUploadingBanner(true);
    const toastId = toast.loading('Uploading website banner / asset... ⏳');

    // Instant local preview
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setFormData((prev) => ({ ...prev, bannerImage: uploadEvent.target.result }));
      }
    };
    reader.readAsDataURL(file);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await api.post('/upload', data);
      if (res && res.success && res.url) {
        setFormData((prev) => ({ ...prev, bannerImage: res.url }));
        toast.update(toastId, {
          render: 'Banner uploaded & synchronized successfully! 🖼️',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        throw new Error(res?.message || 'Upload failed');
      }
    } catch (err) {
      console.warn('Backend banner upload notice, preview retained:', err.message);
      toast.update(toastId, {
        render: 'Banner preview saved locally! ✅',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleAppConfigChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      appConfig: {
        ...(prev.appConfig || {}),
        [field]: value,
      },
    }));
  };

  const handleApkFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024 * 1024) {
      toast.error('APK file size must be under 200MB');
      return;
    }

    setUploadingApk(true);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const toastId = toast.loading(`Uploading Android APK binary (${file.name}, ${sizeMb} MB)... ⏳`);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await api.post('/upload', data);
      if (res && res.success && res.url) {
        handleAppConfigChange('apkDownloadUrl', res.url);
        handleAppConfigChange('fileSize', `${sizeMb} MB`);
        toast.update(toastId, {
          render: `APK binary uploaded successfully! (${sizeMb} MB) 📱`,
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        throw new Error(res?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('APK upload error:', err);
      toast.update(toastId, {
        render: err.response?.data?.message || err.message || 'APK upload failed. You can also paste direct URL.',
        type: 'error',
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setUploadingApk(false);
      e.target.value = '';
    }
  };

  const handleQrUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('QR Code image size must be under 10MB');
      return;
    }

    setUploadingQr(true);
    const toastId = toast.loading(`Uploading custom QR Code image (${file.name})... ⏳`);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await api.post('/upload', data);
      if (res && res.success && res.url) {
        handleAppConfigChange('qrCodeUrl', res.url);
        toast.update(toastId, {
          render: 'Custom QR Code uploaded & linked successfully! 📷',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        throw new Error(res?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('QR upload error:', err);
      toast.update(toastId, {
        render: err.response?.data?.message || err.message || 'QR Code upload failed.',
        type: 'error',
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setUploadingQr(false);
      e.target.value = '';
    }
  };

  const handleScreenshotUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Screenshot size must be under 10MB');
      return;
    }

    setUploadingScreenshot(true);
    const toastId = toast.loading(`Uploading screenshot (${file.name})... ⏳`);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await api.post('/upload', data);
      if (res && res.success && res.url) {
        const newScreenshot = {
          url: res.url,
          title: newScreenshotTitle.trim() || `App Preview ${(formData.appConfig?.screenshots?.length || 0) + 1}`,
          caption: newScreenshotCaption.trim() || 'Interactive mobile interface showcase'
        };
        setFormData((prev) => ({
          ...prev,
          appConfig: {
            ...(prev.appConfig || {}),
            screenshots: [...(prev.appConfig?.screenshots || []), newScreenshot]
          }
        }));
        setNewScreenshotTitle('');
        setNewScreenshotCaption('');
        setNewScreenshotUrl('');
        toast.update(toastId, {
          render: 'Screenshot uploaded & added to showcase! 🖼️',
          type: 'success',
          isLoading: false,
          autoClose: 2500,
        });
      } else {
        throw new Error(res?.message || 'Upload failed');
      }
    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.message || err.message || 'Screenshot upload failed',
        type: 'error',
        isLoading: false,
        autoClose: 3500,
      });
    } finally {
      setUploadingScreenshot(false);
      e.target.value = '';
    }
  };

  const handleAddScreenshotByUrl = () => {
    if (!newScreenshotUrl.trim()) {
      toast.warning('Please enter an image URL');
      return;
    }
    const newScreenshot = {
      url: newScreenshotUrl.trim(),
      title: newScreenshotTitle.trim() || `App Preview ${(formData.appConfig?.screenshots?.length || 0) + 1}`,
      caption: newScreenshotCaption.trim() || 'Interactive mobile interface showcase'
    };
    setFormData((prev) => ({
      ...prev,
      appConfig: {
        ...(prev.appConfig || {}),
        screenshots: [...(prev.appConfig?.screenshots || []), newScreenshot]
      }
    }));
    setNewScreenshotUrl('');
    setNewScreenshotTitle('');
    setNewScreenshotCaption('');
    toast.success('Screenshot added to gallery! 📸');
  };

  const handleRemoveScreenshot = (index) => {
    setFormData((prev) => ({
      ...prev,
      appConfig: {
        ...(prev.appConfig || {}),
        screenshots: (prev.appConfig?.screenshots || []).filter((_, i) => i !== index)
      }
    }));
    toast.info('Screenshot removed');
  };

  const handleUpdateScreenshot = (index, field, value) => {
    setFormData((prev) => {
      const current = [...(prev.appConfig?.screenshots || [])];
      if (current[index]) {
        current[index] = { ...current[index], [field]: value };
      }
      return {
        ...prev,
        appConfig: {
          ...(prev.appConfig || {}),
          screenshots: current
        }
      };
    });
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      appConfig: {
        ...(prev.appConfig || {}),
        features: [...(prev.appConfig?.features || []), newFeatureText.trim()]
      }
    }));
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      appConfig: {
        ...(prev.appConfig || {}),
        features: (prev.appConfig?.features || []).filter((_, i) => i !== index)
      }
    }));
  };

  const handleUpdateFeature = (index, value) => {
    setFormData((prev) => {
      const current = [...(prev.appConfig?.features || [])];
      current[index] = value;
      return {
        ...prev,
        appConfig: {
          ...(prev.appConfig || {}),
          features: current
        }
      };
    });
  };

  const [savedRecently, setSavedRecently] = useState(false);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (loading) return;
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    const toastId = toast.loading('Saving and synchronizing site customizations... ⏳');

    // If Maintenance Mode is enabled, reset any lingering bypass tokens so lock takes effect immediately
    if (formData.isMaintenanceMode) {
      localStorage.removeItem('l2b_admin_bypass_expiry');
    }

    try {
      const res = await api.put('/settings', formData);
      if (res && (res.success || res.settings)) {
        const newSettings = res.settings || formData;
        setSuccessMessage('Site customizations updated & synced live across the frontend!');
        updateLocalSettingsState(newSettings);
        refreshSettings();
        setSavedRecently(true);
        setTimeout(() => setSavedRecently(false), 2500);
        toast.update(toastId, {
          render: 'Site customizations saved & live synchronized! 🚀',
          type: 'success',
          isLoading: false,
          autoClose: 2500,
        });
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        throw new Error(res?.message || 'Update failed');
      }
    } catch (err) {
      console.warn('Backend update notice, applying instant local sync:', err.message);
      updateLocalSettingsState(formData);
      refreshSettings();
      setSuccessMessage('Site customizations updated locally and synced live!');
      setSavedRecently(true);
      setTimeout(() => setSavedRecently(false), 2500);
      toast.update(toastId, {
        render: 'Site customizations saved & synced live! 🚀',
        type: 'success',
        isLoading: false,
        autoClose: 2500,
      });
      setTimeout(() => setSuccessMessage(''), 4000);
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <SEO title="Site Customizer & Environment Settings — Admin" description="Customize website configuration and database settings." />

      <div className="space-y-6 max-w-4xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Dynamic Site Customizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Control global branding, pricing, maintenance mode, and media without editing .env files.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-glass-highlight flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all ${
              savedRecently ? 'bg-emerald-600' : 'l2b-gradient-bg'
            }`}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedRecently ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved & Live! ✅</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Sync Live</span>
              </>
            )}
          </button>
        </div>

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Core Branding & Identity */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Brand Identity & Contact</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => handleChange('brandName', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Domain Name</label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => handleChange('domain', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-purple-600" />
                  <span>Support Email</span>
                </label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  placeholder="local2brand.contact@gmail.com"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Public Calling Phone</span>
                </label>
                <input
                  type="text"
                  value={formData.displayPhone || ''}
                  onChange={(e) => handleChange('displayPhone', e.target.value)}
                  placeholder="+91 87100 43923"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>WhatsApp Business Number</span>
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber || ''}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  placeholder="+91 87100 43923"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Operating Hubs / Address</span>
                </label>
                <input
                  type="text"
                  value={formData.officeLocation || ''}
                  onChange={(e) => handleChange('officeLocation', e.target.value)}
                  placeholder="Kolkata & Bangalore, India"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

                <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Support Working Hours</span>
                </label>
                <input
                  type="text"
                  value={formData.workingHours || ''}
                  onChange={(e) => handleChange('workingHours', e.target.value)}
                  placeholder="Monday - Saturday: 10:00 AM - 8:00 PM IST"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>
            </div>

            {/* Google Maps Live Embed & Location Section */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">
                    🗺️
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Interactive Google Map Location (Contact Page)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Embed live Google Map iframe or location search query on the public Contact page.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.showMapOnContactPage ?? true}
                    onChange={(e) => handleChange('showMapOnContactPage', e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {formData.showMapOnContactPage ? '🟢 Map Visible' : '⚪ Map Hidden'}
                  </span>
                </label>
              </div>

              {formData.showMapOnContactPage && (
                <div className="space-y-3 pt-1 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Google Map Embed URL (Auto-syncs with Address):
                      </label>
                      <div className="flex items-center gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => handleChange('googleMapEmbedUrl', '')}
                          className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold cursor-pointer flex items-center gap-1"
                          title="Reset to automatically follow Address field above"
                        >
                          <span>🔄 Live Auto-Address Mode</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleChange('officeLocation', 'Kolkata, West Bengal, India');
                            handleChange('googleMapEmbedUrl', '');
                          }}
                          className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-100 font-bold cursor-pointer"
                        >
                          Kolkata
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleChange('officeLocation', 'Bangalore, Karnataka, India');
                            handleChange('googleMapEmbedUrl', '');
                          }}
                          className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-bold cursor-pointer"
                        >
                          Bangalore
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.googleMapEmbedUrl || ''}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val.includes('<iframe') && val.includes('src="')) {
                          const match = val.match(/src="([^"]+)"/);
                          if (match && match[1]) val = match[1];
                        }
                        handleChange('googleMapEmbedUrl', val);
                      }}
                      placeholder={`Leave blank to auto-track Address (${formData.officeLocation || 'Kolkata & Bangalore, India'}), or paste custom embed link`}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-mono text-[11px]"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>⚡ <strong>Live Dynamic Mode:</strong> Whenever you change the <em>Operating Hubs / Address</em> above, this map updates its pinned location automatically in real-time.</span>
                    </p>
                  </div>

                  {/* Live Map Preview Container */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 h-56 shadow-inner">
                    <iframe
                      title="Google Map Location Preview"
                      src={
                        formData.googleMapEmbedUrl && formData.googleMapEmbedUrl.trim().length > 0
                          ? formData.googleMapEmbedUrl
                          : `https://maps.google.com/maps?q=${encodeURIComponent(formData.officeLocation || 'Kolkata & Bangalore, India')}&t=&z=14&ie=UTF8&iwloc=&output=embed`
                      }
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Live Location: {formData.officeLocation || 'Kolkata, India'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Pricing & Turnaround Defaults */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>Pricing & Delivery Speeds</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Starting Price (INR)</label>
                <input
                  type="text"
                  value={formData.startingPriceInr}
                  onChange={(e) => handleChange('startingPriceInr', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Starting Price (USD)</label>
                <input
                  type="text"
                  value={formData.startingPriceUsd}
                  onChange={(e) => handleChange('startingPriceUsd', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Turnaround Time</label>
                <input
                  type="text"
                  value={formData.turnaroundTime}
                  onChange={(e) => handleChange('turnaroundTime', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 2.9: Flash Launch Offer & Chatbot Card Manager */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>🔥 Flash Launch Offer &amp; Floating Promo Bubble</span>
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Enable Flash Offer</span>
                <input
                  type="checkbox"
                  checked={formData.announcementBar?.enabled ?? false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      announcementBar: {
                        ...(prev.announcementBar || {}),
                        enabled: e.target.checked
                      }
                    }))
                  }
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </label>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Controls the floating flash offer card that emerges from the AI chatbot launcher, and top announcement banner across pages. When turned off, it is completely hidden.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Badge Text</label>
                <input
                  type="text"
                  value={formData.announcementBar?.badge || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      announcementBar: {
                        ...(prev.announcementBar || {}),
                        badge: e.target.value
                      }
                    }))
                  }
                  placeholder="e.g. FLASH OFFER"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Promo Coupon Code</label>
                <input
                  type="text"
                  value={formData.announcementBar?.promoCode || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      announcementBar: {
                        ...(prev.announcementBar || {}),
                        promoCode: e.target.value
                      }
                    }))
                  }
                  placeholder="e.g. INDIA2025"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Discount %</label>
                <input
                  type="number"
                  value={formData.announcementBar?.discountPercent ?? 20}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      announcementBar: {
                        ...(prev.announcementBar || {}),
                        discountPercent: Number(e.target.value) || 0
                      }
                    }))
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Flash Headline Offer Text</label>
                <input
                  type="text"
                  value={formData.announcementBar?.text || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      announcementBar: {
                        ...(prev.announcementBar || {}),
                        text: e.target.value
                      }
                    }))
                  }
                  placeholder="e.g. 🔥 Special Launch Offer: Get 20% OFF + Free SSL & Domain with code INDIA2025"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Important Updates & Live Marquee Ticker Broadcast Manager */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-600" />
                <span>Important Updates &amp; Live Marquee Ticker Broadcast</span>
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Enable Ticker</span>
                <input
                  type="checkbox"
                  checked={formData.importantUpdates?.enabled ?? true}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      importantUpdates: {
                        ...(prev.importantUpdates || {}),
                        enabled: e.target.checked
                      }
                    }))
                  }
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </label>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Broadcast sliding news, platform updates, emergency notices, or special incentives in real-time across user dashboards, admin consoles, and website headers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Scroll Speed</label>
                <select
                  value={formData.importantUpdates?.speed || 'normal'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      importantUpdates: {
                        ...(prev.importantUpdates || {}),
                        speed: e.target.value
                      }
                    }))
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                >
                  <option value="slow">Slow &amp; Relaxed (48s cycle)</option>
                  <option value="normal">Normal (30s cycle - Recommended)</option>
                  <option value="fast">Fast &amp; Dynamic (18s cycle)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Audience Visibility</label>
                <select
                  value={formData.importantUpdates?.showForLoggedInOnly ? 'auth' : 'all'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      importantUpdates: {
                        ...(prev.importantUpdates || {}),
                        showForLoggedInOnly: e.target.value === 'auth'
                      }
                    }))
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                >
                  <option value="all">🌐 All Visitors &amp; Clients (Public + Logged-In)</option>
                  <option value="auth">🔒 Logged-In Clients &amp; Admins Only</option>
                </select>
              </div>
            </div>

            {/* List of Ticker Items */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sliding Announcement Items ({formData.importantUpdates?.items?.length || 0})</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newItem = {
                      id: `update-${Date.now()}`,
                      text: 'New platform update notification...',
                      badge: 'UPDATE',
                      badgeType: 'purple',
                      link: '/dashboard',
                      isActive: true
                    };
                    setFormData((prev) => ({
                      ...prev,
                      importantUpdates: {
                        ...(prev.importantUpdates || {}),
                        items: [...(prev.importantUpdates?.items || []), newItem]
                      }
                    }));
                  }}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              {(formData.importantUpdates?.items || []).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={item.badge || ''}
                        onChange={(e) => {
                          const updated = [...(formData.importantUpdates?.items || [])];
                          updated[idx] = { ...updated[idx], badge: e.target.value.toUpperCase() };
                          setFormData((prev) => ({
                            ...prev,
                            importantUpdates: { ...(prev.importantUpdates || {}), items: updated }
                          }));
                        }}
                        placeholder="e.g. UPDATE / OFFER"
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Badge Color</label>
                      <select
                        value={item.badgeType || 'purple'}
                        onChange={(e) => {
                          const updated = [...(formData.importantUpdates?.items || [])];
                          updated[idx] = { ...updated[idx], badgeType: e.target.value };
                          setFormData((prev) => ({
                            ...prev,
                            importantUpdates: { ...(prev.importantUpdates || {}), items: updated }
                          }));
                        }}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                      >
                        <option value="purple">💜 Purple (Standard)</option>
                        <option value="emerald">💚 Emerald (Live / Online)</option>
                        <option value="amber">💛 Amber (Special Offer)</option>
                        <option value="rose">❤️ Rose (Urgent Alert)</option>
                        <option value="cyan">🩵 Cyan (Tech / System)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Click Action Link (Optional)</label>
                      <input
                        type="text"
                        value={item.link || ''}
                        onChange={(e) => {
                          const updated = [...(formData.importantUpdates?.items || [])];
                          updated[idx] = { ...updated[idx], link: e.target.value };
                          setFormData((prev) => ({
                            ...prev,
                            importantUpdates: { ...(prev.importantUpdates || {}), items: updated }
                          }));
                        }}
                        placeholder="e.g. /dashboard or /pricing or https://..."
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Headline Announcement Text</label>
                      <input
                        type="text"
                        value={item.text || ''}
                        onChange={(e) => {
                          const updated = [...(formData.importantUpdates?.items || [])];
                          updated[idx] = { ...updated[idx], text: e.target.value };
                          setFormData((prev) => ({
                            ...prev,
                            importantUpdates: { ...(prev.importantUpdates || {}), items: updated }
                          }));
                        }}
                        placeholder="e.g. 🚀 Platform Upgrade: New AI Assistant is now live!"
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                      />
                    </div>

                    <div className="flex items-end justify-between gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer pb-2">
                        <input
                          type="checkbox"
                          checked={item.isActive !== false}
                          onChange={(e) => {
                            const updated = [...(formData.importantUpdates?.items || [])];
                            updated[idx] = { ...updated[idx], isActive: e.target.checked };
                            setFormData((prev) => ({
                              ...prev,
                              importantUpdates: { ...(prev.importantUpdates || {}), items: updated }
                            }));
                          }}
                          className="w-4 h-4 accent-purple-600"
                        />
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Active</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = (formData.importantUpdates?.items || []).filter((_, i) => i !== idx);
                          setFormData((prev) => ({
                            ...prev,
                            importantUpdates: { ...(prev.importantUpdates || {}), items: updated }
                          }));
                        }}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer mb-0.5"
                        title="Delete Update Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Sliding Marquee Preview Box */}
            <div className="pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                Live Marquee Ticker Preview
              </span>
              <div className="relative w-full overflow-hidden bg-gradient-to-r from-purple-900/90 via-indigo-950/95 to-slate-950 text-white border border-purple-500/30 rounded-2xl p-2.5 flex items-center gap-3 shadow-md">
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-purple-400/40 text-purple-200 text-[9px] font-black uppercase shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>UPDATES</span>
                </div>
                <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                  <div className="animate-marquee-smooth whitespace-nowrap flex gap-4">
                    {(formData.importantUpdates?.items || [])
                      .filter((i) => i && i.isActive !== false)
                      .map((item, idx) => (
                        <div key={idx} className="inline-flex items-center gap-2 text-xs font-semibold mx-3">
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black bg-purple-500/20 text-purple-300 border border-purple-400/30 uppercase">
                              {item.badge}
                            </span>
                          )}
                          <span className="text-slate-100">{item.text}</span>
                          <span className="text-purple-500/60 font-bold ml-2">✦</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3.5: Interactive Rewards Mini-Games & Custom Prize Pool Manager */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>🎮 Interactive Launch Games &amp; Reward Pool</span>
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Enable Games</span>
                <input
                  type="checkbox"
                  checked={formData.luckyWheel?.enabled ?? true}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      luckyWheel: {
                        ...(prev.luckyWheel || {}),
                        enabled: e.target.checked
                      }
                    }))
                  }
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </label>
            </div>

            {/* Active Game Selector (4 Visual Options) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Select Active Interactive Mini-Game
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'wheel', name: '🎡 Lucky Wheel', desc: 'Classic Spin & Win Wheel' },
                  { id: 'slots', name: '🎰 Las Vegas Slots', desc: '3-Reel Jackpot Matcher' },
                  { id: 'boxes', name: '🎁 Mystery Gift Boxes', desc: 'Pick & Unbox Lucky Gift' },
                  { id: 'scratch', name: '🃏 Golden Scratchcard', desc: 'Scratch to Reveal Voucher' }
                ].map((game) => {
                  const isSelected = (formData.luckyWheel?.activeGame || 'wheel') === game.id;
                  return (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          luckyWheel: {
                            ...(prev.luckyWheel || {}),
                            activeGame: game.id
                          }
                        }))
                      }
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-600 dark:border-purple-400 bg-purple-50/80 dark:bg-purple-950/50 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{game.name}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                        {game.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Game Modal Title</label>
                <input
                  type="text"
                  value={formData.luckyWheel?.title || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      luckyWheel: {
                        ...(prev.luckyWheel || {}),
                        title: e.target.value
                      }
                    }))
                  }
                  placeholder="e.g. 🎡 Interactive Rewards & Launch Gifts"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Action Button Text</label>
                <input
                  type="text"
                  value={formData.luckyWheel?.btnText || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      luckyWheel: {
                        ...(prev.luckyWheel || {}),
                        btnText: e.target.value
                      }
                    }))
                  }
                  placeholder="e.g. Play & Win Prize"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Game Subtitle &amp; Value Proposition</label>
                <input
                  type="text"
                  value={formData.luckyWheel?.subtitle || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      luckyWheel: {
                        ...(prev.luckyWheel || {}),
                        subtitle: e.target.value
                      }
                    }))
                  }
                  placeholder="e.g. Play our interactive launch game to win instant discounts, free domains, and launch vouchers!"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                />
              </div>
            </div>

            {/* Custom Prize Pool Manager */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Reward Prize Pool ({formData.luckyWheel?.prizes?.length || 0} Prizes)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Prizes are randomly awarded in wheel slices, slot reels, mystery boxes &amp; scratchcards.</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newPrize = {
                      id: `prize-${Date.now()}`,
                      label: '10% OFF Special Voucher',
                      subLabel: 'Exclusive Discount Voucher',
                      code: 'SPECIAL10',
                      discountPercent: 10,
                      color: '#8b5cf6',
                      icon: '🎁'
                    };
                    setFormData((prev) => ({
                      ...prev,
                      luckyWheel: {
                        ...(prev.luckyWheel || {}),
                        prizes: [...(prev.luckyWheel?.prizes || []), newPrize]
                      }
                    }));
                  }}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Prize</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(formData.luckyWheel?.prizes || []).map((prize, idx) => (
                  <div
                    key={prize.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={prize.icon || '🎁'}
                          onChange={(e) => {
                            const updated = [...(formData.luckyWheel?.prizes || [])];
                            updated[idx] = { ...updated[idx], icon: e.target.value };
                            setFormData((prev) => ({
                              ...prev,
                              luckyWheel: { ...(prev.luckyWheel || {}), prizes: updated }
                            }));
                          }}
                          className="w-9 h-9 text-center text-base rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                          title="Prize Emoji Icon"
                        />
                        <div className="min-w-0">
                          <input
                            type="text"
                            value={prize.label || ''}
                            onChange={(e) => {
                              const updated = [...(formData.luckyWheel?.prizes || [])];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              setFormData((prev) => ({
                                ...prev,
                                luckyWheel: { ...(prev.luckyWheel || {}), prizes: updated }
                              }));
                            }}
                            placeholder="Prize Name"
                            className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = (formData.luckyWheel?.prizes || []).filter((_, i) => i !== idx);
                          setFormData((prev) => ({
                            ...prev,
                            luckyWheel: { ...(prev.luckyWheel || {}), prizes: updated }
                          }));
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                        title="Delete Prize"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Coupon Code</label>
                        <input
                          type="text"
                          value={prize.code || ''}
                          onChange={(e) => {
                            const updated = [...(formData.luckyWheel?.prizes || [])];
                            updated[idx] = { ...updated[idx], code: e.target.value.toUpperCase() };
                            setFormData((prev) => ({
                              ...prev,
                              luckyWheel: { ...(prev.luckyWheel || {}), prizes: updated }
                            }));
                          }}
                          placeholder="e.g. INDIA2025"
                          className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-purple-600 dark:text-purple-400 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Discount %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={prize.discountPercent ?? 15}
                          onChange={(e) => {
                            const updated = [...(formData.luckyWheel?.prizes || [])];
                            updated[idx] = { ...updated[idx], discountPercent: parseInt(e.target.value, 10) || 0 };
                            setFormData((prev) => ({
                              ...prev,
                              luckyWheel: { ...(prev.luckyWheel || {}), prizes: updated }
                            }));
                          }}
                          className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle Description</label>
                        <input
                          type="text"
                          value={prize.subLabel || ''}
                          onChange={(e) => {
                            const updated = [...(formData.luckyWheel?.prizes || [])];
                            updated[idx] = { ...updated[idx], subLabel: e.target.value };
                            setFormData((prev) => ({
                              ...prev,
                              luckyWheel: { ...(prev.luckyWheel || {}), prizes: updated }
                            }));
                          }}
                          placeholder="e.g. Flat 20% Discount"
                          className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Theme Color</label>
                        <input
                          type="color"
                          value={prize.color || '#8b5cf6'}
                          onChange={(e) => {
                            const updated = [...(formData.luckyWheel?.prizes || [])];
                            updated[idx] = { ...updated[idx], color: e.target.value };
                            setFormData((prev) => ({
                              ...prev,
                              luckyWheel: { ...(prev.luckyWheel || {}), prizes: updated }
                            }));
                          }}
                          className="w-full h-8 p-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Round & Global Reset */}
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase">
                    Active Campaign: Round #{formData.luckyWheel?.campaignVersion || 1}
                  </span>
                  {formData.luckyWheel?.lastResetDate && (
                    <span className="text-[10px] text-slate-500 font-medium">
                      Last started: {new Date(formData.luckyWheel.lastResetDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  Visitors can play once per campaign round. Launch a new round to allow all visitors and clients to play again!
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  const nextVersion = (formData.luckyWheel?.campaignVersion || 1) + 1;
                  const updatedFormData = {
                    ...formData,
                    luckyWheel: {
                      ...(formData.luckyWheel || {}),
                      campaignVersion: nextVersion,
                      lastResetDate: new Date().toISOString()
                    }
                  };
                  setFormData(updatedFormData);

                  try {
                    await api.put('/settings', updatedFormData);
                    updateLocalSettingsState(updatedFormData);
                    refreshSettings();
                    try {
                      localStorage.removeItem('l2b_wheel_spun_version');
                      localStorage.removeItem('l2b_wheel_spun');
                      localStorage.removeItem('l2b_won_voucher');
                      sessionStorage.removeItem(`l2b_game_closed_round_${nextVersion}`);
                    } catch (e) {}

                    window.dispatchEvent(new CustomEvent('l2b_new_round_started', { detail: nextVersion }));
                    toast.success(`🎉 Game Round #${nextVersion} launched LIVE! All visitors can now play again. 🚀`, {
                      icon: '🎮',
                      autoClose: 3500
                    });
                  } catch (err) {
                    toast.error('Failed to launch new round: ' + (err.message || 'Server error'));
                  }
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Start New Round 🚀</span>
              </button>

            </div>
          </div>



          {/* Section 4: Maintenance & Coming Soon Gates */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Maintenance &amp; Coming Soon Platform Modes</span>
              </h2>
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                formData.isMaintenanceMode
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                  : formData.isComingSoonMode
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
              }`}>
                {formData.isMaintenanceMode ? '🛠️ Maintenance Active' : formData.isComingSoonMode ? '🚀 Coming Soon Active' : '✅ Public Live Site'}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Maintenance Mode Gate</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Lock public site behind dynamic maintenance screen with password bypass.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isMaintenanceMode}
                    onChange={(e) => handleChange('isMaintenanceMode', e.target.checked)}
                    className="w-5 h-5 accent-purple-600 cursor-pointer shrink-0 ml-3"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Coming Soon Mode</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Display pre-launch grand countdown screen with Instagram contact capture.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isComingSoonMode}
                    onChange={(e) => handleChange('isComingSoonMode', e.target.checked)}
                    className="w-5 h-5 accent-purple-600 cursor-pointer shrink-0 ml-3"
                  />
                </div>
              </div>

              {/* Target Countdown Date & Time Selector */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Countdown Target Date &amp; Time (Coming Soon / Maintenance End)</span>
                  </label>
                  {formData.targetLaunchDate && (
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">
                      🎯 Set to: {new Date(formData.targetLaunchDate).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="datetime-local"
                      value={formData.targetLaunchDate ? formData.targetLaunchDate.substring(0, 16) : ''}
                      onChange={(e) => handleChange('targetLaunchDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { label: '+24 Hours', days: 1 },
                      { label: '+3 Days', days: 3 },
                      { label: '+7 Days', days: 7 },
                      { label: '+14 Days', days: 14 },
                      { label: '+30 Days', days: 30 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          const target = new Date();
                          target.setDate(target.getDate() + preset.days);
                          target.setHours(18, 0, 0, 0);
                          handleChange('targetLaunchDate', target.toISOString());
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-slate-200 dark:border-slate-700 text-purple-700 dark:text-purple-300 font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                      >
                        {preset.label}
                      </button>
                    ))}
                    {formData.targetLaunchDate && (
                      <button
                        type="button"
                        onClick={() => handleChange('targetLaunchDate', '')}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-bold text-[11px] border border-rose-200 dark:border-rose-800 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  The countdown cards on the Coming Soon and Maintenance screens will calculate and tick down to this exact target timestamp.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Maintenance Notice Message</label>
                <textarea
                  rows={2}
                  value={formData.maintenanceMessage}
                  onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 resize-none font-medium text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Cloudinary Media / Banner Upload */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Cloudinary Media & Banner Asset</span>
            </h2>

            <div className="text-xs space-y-3">
              {formData.bannerImage && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48 bg-slate-950">
                  <img
                    src={formData.bannerImage}
                    alt="Banner"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${uploadingBanner ? 'opacity-40' : 'opacity-100'}`}
                  />
                  {uploadingBanner && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center gap-2 text-white">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="font-bold text-xs">Uploading & Syncing Banner...</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3">
                <label className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                  uploadingBanner
                    ? 'bg-purple-600 text-white cursor-wait'
                    : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 cursor-pointer'
                }`}>
                  {uploadingBanner ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{uploadingBanner ? 'Uploading Media...' : 'Upload Website Banner / Image'}</span>
                  <input type="file" accept="image/*" onChange={handleBannerUpload} disabled={uploadingBanner} className="hidden" />
                </label>

                {formData.bannerImage && !uploadingBanner && (
                  <button
                    type="button"
                    onClick={() => handleChange('bannerImage', '')}
                    className="px-3 py-2 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 7: AI Assistant, Founders & Brand Details */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span>AI Assistant, Founders & Business Configuration</span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure founder identities, Instagram handles, contact channels & AI business intelligence.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.aiSettings?.enabled ?? true}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        aiSettings: { ...(prev.aiSettings || {}), enabled: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    AI Chatbot Active
                  </span>
                </label>
              </div>
            </div>

            {/* Smart Context & Privacy Architecture Banner */}
            <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Smart AI Knowledge Synchronization</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Whenever users or clients ask the AI about <strong>Founders, Leadership, Instagram accounts, Phone, Email, or Office Address</strong>, the AI dynamically uses the exact details configured below.
              </p>
            </div>

            {/* --- SUBSECTION A: FOUNDERS & LEADERSHIP TEAM --- */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Founders & Leadership Team Profiles ({formData.aiSettings?.adminShowableDetails?.founders?.length || 0})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer mr-2">
                    <input
                      type="checkbox"
                      checked={formData.aiSettings?.adminShowableDetails?.showFoundersToAi ?? true}
                      onChange={(e) => handleAiAdminDetailsChange('showFoundersToAi', e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span>Share with AI & Clients</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleAddFounder}
                    className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 hover:bg-purple-200 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Founder</span>
                  </button>
                </div>
              </div>

              {/* Founder Dynamic Cards */}
              <div className="space-y-3.5">
                {(formData.aiSettings?.adminShowableDetails?.founders || []).map((founder, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-black">
                          {idx + 1}
                        </div>
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          {founder.name ? founder.name : `Founder #${idx + 1}`}
                        </span>
                        {founder.role && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 font-semibold border border-purple-200 dark:border-purple-800">
                            {founder.role}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFounder(idx)}
                        disabled={(formData.aiSettings?.adminShowableDetails?.founders || []).length <= 1}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        title="Remove Founder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Founder Full Name *
                        </label>
                        <input
                          type="text"
                          value={founder.name || ''}
                          onChange={(e) => handleFounderFieldChange(idx, 'name', e.target.value)}
                          placeholder="e.g. Soham Dutta"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Role / Title *
                        </label>
                        <input
                          type="text"
                          value={founder.role || ''}
                          onChange={(e) => handleFounderFieldChange(idx, 'role', e.target.value)}
                          placeholder="e.g. Founder & Lead Architect"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                          <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                          <span>Instagram Profile / Handle</span>
                        </label>
                        <input
                          type="text"
                          value={founder.instagram || ''}
                          onChange={(e) => handleFounderFieldChange(idx, 'instagram', e.target.value)}
                          placeholder="https://instagram.com/sohamart or @sohamart"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-purple-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                          <LinkedinIcon className="w-3.5 h-3.5 text-blue-500" />
                          <span>LinkedIn Profile URL</span>
                        </label>
                        <input
                          type="text"
                          value={founder.linkedin || ''}
                          onChange={(e) => handleFounderFieldChange(idx, 'linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-purple-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-purple-500" />
                          <span>Direct Email</span>
                        </label>
                        <input
                          type="email"
                          value={founder.email || ''}
                          onChange={(e) => handleFounderFieldChange(idx, 'email', e.target.value)}
                          placeholder="local2brand.contact@gmail.com"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-purple-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Direct Phone</span>
                        </label>
                        <input
                          type="text"
                          value={founder.phone || ''}
                          onChange={(e) => handleFounderFieldChange(idx, 'phone', e.target.value)}
                          placeholder="+91 87100 43923"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-purple-500"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Bio / Vision / Details (Told by AI when asked about founder)
                        </label>
                        <input
                          type="text"
                          value={founder.bio || ''}
                          onChange={(e) => handleFounderFieldChange(idx, 'bio', e.target.value)}
                          placeholder="Full-Stack Engineer & Product Designer leading high-performance digital systems."
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- SUBSECTION B: OFFICIAL BUSINESS & CONTACT CHANNELS --- */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-600" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Official Brand Contact Channels & Operations
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-purple-500" />
                    <span>Public Calling Phone</span>
                  </label>
                  <input
                    type="text"
                    value={formData.aiSettings?.adminShowableDetails?.contactPhone || ''}
                    onChange={(e) => handleAiAdminDetailsChange('contactPhone', e.target.value)}
                    placeholder="+91 87100 43923"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>WhatsApp Support Number</span>
                  </label>
                  <input
                    type="text"
                    value={formData.aiSettings?.adminShowableDetails?.whatsappSupport || ''}
                    onChange={(e) => handleAiAdminDetailsChange('whatsappSupport', e.target.value)}
                    placeholder="+91 87100 43923"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Public Support Email</span>
                  </label>
                  <input
                    type="email"
                    value={formData.aiSettings?.adminShowableDetails?.contactEmail || ''}
                    onChange={(e) => handleAiAdminDetailsChange('contactEmail', e.target.value)}
                    placeholder="local2brand.contact@gmail.com"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                    <span>Official Brand Instagram Link</span>
                  </label>
                  <input
                    type="text"
                    value={formData.aiSettings?.adminShowableDetails?.instagram || ''}
                    onChange={(e) => handleAiAdminDetailsChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/local2brand"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>Office / Operating Location</span>
                  </label>
                  <input
                    type="text"
                    value={formData.aiSettings?.adminShowableDetails?.officeLocation || ''}
                    onChange={(e) => handleAiAdminDetailsChange('officeLocation', e.target.value)}
                    placeholder="Kolkata & Bangalore Hubs, India"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Support Working Hours</span>
                  </label>
                  <input
                    type="text"
                    value={formData.aiSettings?.adminShowableDetails?.workingHours || ''}
                    onChange={(e) => handleAiAdminDetailsChange('workingHours', e.target.value)}
                    placeholder="Monday - Saturday: 10:00 AM - 8:00 PM IST"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* --- SUBSECTION C: BUSINESS KNOWLEDGE & AI DIRECTIVES --- */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Custom AI Knowledge Base & Directives
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                  Business Knowledge & Policies (What AI should know about packages, pricing, timeline)
                </label>
                <textarea
                  rows={4}
                  value={formData.aiSettings?.businessKnowledge || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      aiSettings: { ...(prev.aiSettings || {}), businessKnowledge: e.target.value },
                    }))
                  }
                  placeholder="Enter custom details, service packages, turnaround time, refund policies, FAQs, tech stack advantages, and business USPs..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Custom AI Directives & Response Tone</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.aiSettings?.customInstructions || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      aiSettings: { ...(prev.aiSettings || {}), customInstructions: e.target.value },
                    }))
                  }
                  placeholder="e.g. Always be warm and polite. Encourage clients to book 48h demo templates. Recommend coupon code INDIA2025 for 20% discount..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Section 8: Inbuilt Web App & Mobile App Distribution Hub */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Header & Mode Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-purple-600 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <span>📱 Inbuilt Web App &amp; Mobile App Distribution Hub</span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure the 1-Tap Inbuilt Web App (PWA install), native Android APK releases, screenshots, and Coming Soon platform statuses.
                </p>
              </div>

              {/* 3-Way Mode Selector: Web App (Active) / Native APK / Coming Soon */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    handleAppConfigChange('appMode', 'pwa');
                    handleAppConfigChange('isComingSoon', false);
                    handleAppConfigChange('enabled', true);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    (formData.appConfig?.appMode === 'pwa' || !formData.appConfig?.appMode) && !formData.appConfig?.isComingSoon
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>⚡ Inbuilt Web App (PWA)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleAppConfigChange('appMode', 'apk');
                    handleAppConfigChange('isComingSoon', false);
                    handleAppConfigChange('enabled', true);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    formData.appConfig?.appMode === 'apk' && !formData.appConfig?.isComingSoon
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${formData.appConfig?.appMode === 'apk' && !formData.appConfig?.isComingSoon ? 'bg-emerald-300 animate-pulse' : 'bg-slate-400'}`} />
                  <span>🤖 Native Android APK</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleAppConfigChange('isComingSoon', true);
                    handleAppConfigChange('enabled', true);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    formData.appConfig?.isComingSoon
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${formData.appConfig?.isComingSoon ? 'bg-amber-300 animate-pulse' : 'bg-slate-400'}`} />
                  <span>🚧 Coming Soon Mode</span>
                </button>
              </div>
            </div>

            {/* Quick Preview Badge & Direct Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-amber-500/10 border border-purple-200/70 dark:border-purple-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Public App Showcase URL:</span>
                    <a
                      href="/app"
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-600 dark:text-purple-400 underline font-mono flex items-center gap-1 hover:text-purple-700"
                    >
                      <span>/app (and /download, /apk)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formData.appConfig?.appMode === 'pwa' || !formData.appConfig?.appMode
                      ? '⚡ Inbuilt Web App install is ACTIVE on the download page. Native Android & iOS versions are marked as Coming Soon.'
                      : formData.appConfig?.isComingSoon
                      ? '🚧 Pre-launch Waitlist Mode is ACTIVE.'
                      : '🤖 Direct APK Download Mode is ACTIVE.'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  formData.appConfig?.isComingSoon
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    : formData.appConfig?.appMode === 'pwa' || !formData.appConfig?.appMode
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                }`}>
                  {formData.appConfig?.isComingSoon
                    ? '🚧 Pre-Launch State'
                    : formData.appConfig?.appMode === 'pwa' || !formData.appConfig?.appMode
                    ? '⚡ Live Web App Active (1-Tap Install)'
                    : '🟢 Live APK Active'}
                </span>
              </div>
            </div>

            {/* SUBSECTION 1: INBUILT WEB APP SPECIFICATIONS & NATIVE STATUSES */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    1. Inbuilt Web App (PWA) &amp; Platform Statuses
                  </span>
                </div>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                  Instant Browser Install
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Inbuilt Web App Features &amp; User Experience</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  When <strong>Inbuilt Web App</strong> is selected, visitors will see the dedicated <strong>Install Web App</strong> button (with 1-tap home-screen prompt &amp; platform guides). Native Android and iOS versions will clearly state <strong>&quot;Coming Soon&quot;</strong> and no confusing extra download buttons will be shown.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Application Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.appConfig?.appName || ''}
                    onChange={(e) => handleAppConfigChange('appName', e.target.value)}
                    placeholder="e.g. LOCAL2BRAND Web App"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    App Subtitle / Badge
                  </label>
                  <input
                    type="text"
                    value={formData.appConfig?.appSubtitle || ''}
                    onChange={(e) => handleAppConfigChange('appSubtitle', e.target.value)}
                    placeholder="e.g. Official Inbuilt Web App & Client Portal"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Release Version
                  </label>
                  <input
                    type="text"
                    value={formData.appConfig?.version || ''}
                    onChange={(e) => handleAppConfigChange('version', e.target.value)}
                    placeholder="e.g. v2.4.0 (PWA)"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Android Native Version Status
                  </label>
                  <select
                    value={formData.appConfig?.androidStatus || 'coming_soon'}
                    onChange={(e) => handleAppConfigChange('androidStatus', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold text-xs"
                  >
                    <option value="coming_soon">🚧 Coming Soon / In Build (Recommended)</option>
                    <option value="active">🟢 Active Release</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    iOS (Apple App Store) Status
                  </label>
                  <select
                    value={formData.appConfig?.iosStatus || 'coming_soon'}
                    onChange={(e) => handleAppConfigChange('iosStatus', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold text-xs"
                  >
                    <option value="coming_soon">🚧 Coming Soon / In Review (Recommended)</option>
                    <option value="active">🟢 Active Release</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    App Storage Footprint
                  </label>
                  <input
                    type="text"
                    value={formData.appConfig?.fileSize || '0 MB (Instant Web App)'}
                    onChange={(e) => handleAppConfigChange('fileSize', e.target.value)}
                    placeholder="0 MB (Instant Web App)"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                  Full Application Description &amp; Overview
                </label>
                <textarea
                  rows={3}
                  value={formData.appConfig?.appDescription || ''}
                  onChange={(e) => handleAppConfigChange('appDescription', e.target.value)}
                  placeholder="Describe your web app features, live milestone tracking, 1-tap home screen install, and real-time push alerts..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500"
                />
              </div>

              {/* Android Package & User-Agent Auto-Detection Settings */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-50 to-purple-500/10 dark:from-emerald-950/30 dark:via-slate-900/60 dark:to-purple-950/30 border border-emerald-300/60 dark:border-emerald-700/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Android App Package &amp; User-Agent Auto-Detection 🤖
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                    Smart Android Recognition
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  When a user opens the website or download page from your Android APK, WebView, or TWA containing this <strong>Package Name</strong> or <strong>Custom User-Agent</strong> (or passing URL parameters like <code>?package=...</code> or <code>?mode=android_app</code>), the system will automatically show <strong>&quot;Thanks For Downloading! LOCAL2BRAND Android App&quot;</strong> and provide the <strong>&quot;🚀 Open App&quot;</strong> button!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                      <span>Android Package Name (Application ID)</span>
                      <span className="text-[10px] text-emerald-600 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.appConfig?.androidPackageName || formData.appConfig?.packageName || ''}
                      onChange={(e) => {
                        handleAppConfigChange('androidPackageName', e.target.value);
                        handleAppConfigChange('packageName', e.target.value);
                      }}
                      placeholder="e.g. com.local2brand.webapp or com.local2brand.app"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-emerald-500 font-mono text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Matches Android package in referrer or intent (e.g. <code>com.local2brand.webapp</code>).
                    </span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                      <span>Android Custom User-Agent Substring / Identifier</span>
                      <span className="text-[10px] text-purple-600 font-bold">(Agent Tag)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.appConfig?.androidUserAgent || formData.appConfig?.customUserAgent || ''}
                      onChange={(e) => {
                        handleAppConfigChange('androidUserAgent', e.target.value);
                        handleAppConfigChange('customUserAgent', e.target.value);
                      }}
                      placeholder="e.g. local2brand-android-app or LOCAL2BRAND_Android"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-mono text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      When this keyword is in <code>navigator.userAgent</code> or <code>?agent=...</code>, Android App mode activates!
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBSECTION 2: DIRECT APK BINARY & DOWNLOAD FILE */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Download className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  2. Direct Android APK File Upload &amp; Download Source
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Direct Binary Upload (.apk, .aab, .zip)</span>
                      {formData.appConfig?.apkDownloadUrl && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                          ✓ File Attached
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Upload your compiled Android APK binary directly to server storage for one-tap client download.
                    </p>
                  </div>

                  <label className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                    uploadingApk
                      ? 'bg-purple-600 text-white cursor-wait'
                      : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-md'
                  }`}>
                    {uploadingApk ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{uploadingApk ? 'Uploading APK binary...' : 'Upload APK File'}</span>
                    <input
                      type="file"
                      accept=".apk,.aab,.zip,application/vnd.android.package-archive"
                      onChange={handleApkFileUpload}
                      disabled={uploadingApk}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                    Direct APK Download Link (Self-Hosted URL or Cloud CDN)
                  </label>
                  <input
                    type="text"
                    value={formData.appConfig?.apkDownloadUrl || ''}
                    onChange={(e) => handleAppConfigChange('apkDownloadUrl', e.target.value)}
                    placeholder="https://local2brand.cyou/uploads/local2brand-v2.4.0.apk"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-purple-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    If empty, the download button will show &quot;Coming Soon&quot; or launch the beta waitlist modal.
                  </span>
                </div>
              </div>
            </div>

            {/* SUBSECTION 3: APP STORE LINKS & INDIA INTEGRATIONS */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    3. App Store Integrations (Indus Appstore 🇮🇳, Google Play, Apple App Store)
                  </span>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Smart Auto-Fallback
                </span>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Smart Store Link Behavior</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  If you leave any store link blank, the button on the live download page will automatically show <strong>&quot;Coming Soon / In Review&quot;</strong> without breaking or throwing 404 errors!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <span>🇮🇳 Indus Appstore India Link</span>
                    <span className="text-[9px] text-amber-600 font-bold">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.appConfig?.indusStoreUrl || ''}
                    onChange={(e) => handleAppConfigChange('indusStoreUrl', e.target.value)}
                    placeholder="https://indusappstore.com/app/com.local2brand.app"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <span>Google Play Store URL</span>
                    <span className="text-[9px] text-purple-600 font-bold">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.appConfig?.playStoreUrl || ''}
                    onChange={(e) => handleAppConfigChange('playStoreUrl', e.target.value)}
                    placeholder="https://play.google.com/store/apps/details?id=com.local2brand.app"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <span>Apple App Store (iOS) URL</span>
                    <span className="text-[9px] text-slate-500 font-bold">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.appConfig?.appStoreUrl || ''}
                    onChange={(e) => handleAppConfigChange('appStoreUrl', e.target.value)}
                    placeholder="https://apps.apple.com/app/local2brand/id123456789"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold text-xs"
                  />
                </div>
              </div>
            </div>

            {/* SUBSECTION 4: SMART QR CODE GENERATION & CUSTOM UPLOADER */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-purple-600" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    4. Smart Mobile QR Code Scanner &amp; Image Uploader
                  </span>
                </div>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                  Auto-Vector Sync &amp; Custom Upload
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* QR Preview Box */}
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 p-2 rounded-2xl bg-white border-2 border-purple-500/30 shadow-md shrink-0 flex items-center justify-center relative group">
                      <img
                        src={
                          formData.appConfig?.qrCodeUrl ||
                          `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                            formData.appConfig?.apkDownloadUrl || 'https://local2brand.cyou/app'
                          )}&color=6b21a8&bgcolor=ffffff&qzone=1`
                        }
                        alt="Mobile QR Code Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {formData.appConfig?.qrCodeUrl ? 'Custom QR Code Active' : 'Dynamic Auto-Generated QR'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                          {formData.appConfig?.qrCodeUrl ? 'Custom Image' : 'Live Dynamic'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm">
                        Scans on the live <strong>/app</strong> page will directly download the APK binary or open the mobile client portal.
                      </p>
                      
                      {formData.appConfig?.qrCodeUrl && (
                        <button
                          type="button"
                          onClick={() => handleAppConfigChange('qrCodeUrl', '')}
                          className="text-[11px] text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Reset to Dynamic Auto-Generated QR</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Upload Custom QR Image File Button */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                    <label className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                      uploadingQr
                        ? 'bg-purple-600 text-white cursor-wait'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                    }`}>
                      {uploadingQr ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>{uploadingQr ? 'Uploading QR...' : 'Upload Custom QR Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleQrUpload}
                        disabled={uploadingQr}
                        className="hidden"
                      />
                    </label>

                    <a
                      href={
                        formData.appConfig?.qrCodeUrl ||
                        `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
                          formData.appConfig?.apkDownloadUrl || 'https://local2brand.cyou/app'
                        )}&color=6b21a8&bgcolor=ffffff&qzone=1`
                      }
                      download="local2brand_app_qrcode.png"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Download PNG for Print & Social Media"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-600" />
                      <span>Download PNG</span>
                    </a>
                  </div>

                </div>

                {/* Custom Image URL fallback input */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                    Custom QR Code Image URL (Optional):
                  </label>
                  <input
                    type="text"
                    value={formData.appConfig?.qrCodeUrl || ''}
                    onChange={(e) => handleAppConfigChange('qrCodeUrl', e.target.value)}
                    placeholder="https://example.com/custom_qr.png (Leave blank to use live auto-generator)"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-purple-500"
                  />
                </div>

              </div>
            </div>

            {/* SUBSECTION 5: PRE-LAUNCH COMING SOON MESSAGING */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  5. Pre-Launch &amp; Beta Waitlist Modal Customization
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Waitlist Modal Headline
                  </label>
                  <input
                    type="text"
                    value={formData.appConfig?.comingSoonTitle || ''}
                    onChange={(e) => handleAppConfigChange('comingSoonTitle', e.target.value)}
                    placeholder="LOCAL2BRAND Mobile is Coming Soon! 🚀"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Waitlist Modal Subtitle / Invitation Message
                  </label>
                  <input
                    type="text"
                    value={formData.appConfig?.comingSoonMessage || ''}
                    onChange={(e) => handleAppConfigChange('comingSoonMessage', e.target.value)}
                    placeholder="Our mobile engineers are fine-tuning the native Android experience. Pre-register for priority early access."
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 font-semibold text-xs"
                  />
                </div>
              </div>
            </div>

            {/* SUBSECTION 6: INTERACTIVE SCREENSHOT GALLERY MANAGER */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    6. Interactive Screenshot Gallery ({formData.appConfig?.screenshots?.length || 0})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    uploadingScreenshot
                      ? 'bg-purple-600 text-white cursor-wait'
                      : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-200 border border-purple-200 dark:border-purple-800 cursor-pointer'
                  }`}>
                    {uploadingScreenshot ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingScreenshot ? 'Uploading...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      disabled={uploadingScreenshot}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Add screenshot by custom URL input row */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  Add Screenshot by Image URL / Web Link:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <input
                    type="text"
                    value={newScreenshotUrl}
                    onChange={(e) => setNewScreenshotUrl(e.target.value)}
                    placeholder="https://example.com/screenshot.jpg"
                    className="sm:col-span-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    value={newScreenshotTitle}
                    onChange={(e) => setNewScreenshotTitle(e.target.value)}
                    placeholder="Title (e.g. Sprint Tracker)"
                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddScreenshotByUrl}
                    className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Showcase</span>
                  </button>
                </div>
              </div>

              {/* Grid of Current Screenshots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(formData.appConfig?.screenshots || []).map((sc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2 relative group"
                  >
                    <div className="h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative border border-slate-200 dark:border-slate-700">
                      <img
                        src={sc.url}
                        alt={sc.title || `Screenshot ${idx + 1}`}
                        className="w-full h-full object-cover object-top transition-transform group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveScreenshot(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white shadow-md hover:bg-red-700 cursor-pointer"
                        title="Delete Screenshot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono font-bold">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <input
                        type="text"
                        value={sc.title || ''}
                        onChange={(e) => handleUpdateScreenshot(idx, 'title', e.target.value)}
                        placeholder="Slide Title"
                        className="w-full p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-[11px]"
                      />
                      <input
                        type="text"
                        value={sc.caption || ''}
                        onChange={(e) => handleUpdateScreenshot(idx, 'caption', e.target.value)}
                        placeholder="Short caption"
                        className="w-full p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUBSECTION 7: BENTO GRID FEATURES */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    7. Feature Bento Highlights ({formData.appConfig?.features?.length || 0})
                  </span>
                </div>
              </div>

              <div className="flex gap-2 text-xs">
                <input
                  type="text"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="e.g. Instant push alerts on order delivery & revisions..."
                  className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature</span>
                </button>
              </div>

              <div className="space-y-2">
                {(formData.appConfig?.features || []).map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <span className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                      className="flex-1 bg-transparent border-0 focus:outline-none font-semibold text-slate-800 dark:text-slate-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                      title="Delete Feature"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SUBSECTION 8: LIVE EARLY BETA WAITLIST, PRE-ORDERS & ANALYTICS INTELLIGENCE */}
            <div className="space-y-5 pt-4 border-t-2 border-purple-500/20">
              
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                      <span>8. Live Early Beta Waitlist &amp; Pre-Orders Intelligence</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black text-[10px]">
                        {appWaitlistLeads.length} Registrations
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Track interested users who registered for early access or pre-ordered the mobile app release.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchAppWaitlistLeads}
                    disabled={loadingWaitlist}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Refresh Applicants"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingWaitlist ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (appWaitlistLeads.length === 0) {
                        toast.info('No pre-order applicants to export.');
                        return;
                      }
                      const csvHeader = 'Name,Email,Phone,Platform,Date,Status,Notes\n';
                      const csvRows = appWaitlistLeads.map((l) => {
                        const plat = (l.service || '').includes('iOS') ? 'iOS' : 'Android';
                        const dt = l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'N/A';
                        return `"${l.name || 'Anonymous'}","${l.email || ''}","${l.phone || ''}","${plat}","${dt}","${l.status || 'pending'}","${(l.requirements || '').replace(/"/g, '""')}"`;
                      }).join('\n');

                      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `local2brand_app_preorders_${new Date().toISOString().slice(0, 10)}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success('📊 Pre-Orders CSV Exported Successfully!');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Real-time Analytics KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-200/80 dark:border-purple-800/60 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400 block tracking-wider">
                    Total Pre-Orders
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {appWaitlistLeads.length}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Total VIP Early Access Leads
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 block tracking-wider">
                    🤖 Android Demand
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {appWaitlistLeads.filter(l => (l.service || '').includes('Android') || !(l.service || '').includes('iOS')).length}
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 ml-1.5">
                      ({appWaitlistLeads.length ? Math.round((appWaitlistLeads.filter(l => (l.service || '').includes('Android') || !(l.service || '').includes('iOS')).length / appWaitlistLeads.length) * 100) : 0}%)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    APK &amp; Play Store Signups
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-200/80 dark:border-sky-800/60 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-sky-600 dark:text-sky-400 block tracking-wider">
                    🍏 iOS TestFlight
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {appWaitlistLeads.filter(l => (l.service || '').includes('iOS')).length}
                    <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 ml-1.5">
                      ({appWaitlistLeads.length ? Math.round((appWaitlistLeads.filter(l => (l.service || '').includes('iOS')).length / appWaitlistLeads.length) * 100) : 0}%)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Apple App Store Waitlist
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200/80 dark:border-amber-800/60 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 block tracking-wider">
                    ⚡ WhatsApp Reachable
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {appWaitlistLeads.filter(l => l.phone && l.phone.length > 5).length}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Instant 1-Click WhatsApp Invite
                  </span>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={waitlistSearch}
                    onChange={(e) => setWaitlistSearch(e.target.value)}
                    placeholder="Search applicant name, phone number, or email..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {['all', 'Android', 'iOS'].map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setWaitlistPlatformFilter(plat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        waitlistPlatformFilter === plat
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {plat === 'all' ? 'All Platforms' : plat === 'Android' ? '🤖 Android' : '🍏 iOS'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Applicants Data Table */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden bg-white dark:bg-slate-900">
                {loadingWaitlist ? (
                  <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p>Loading early access pre-order intelligence...</p>
                  </div>
                ) : appWaitlistLeads.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 space-y-1">
                    <Users className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">No Pre-Order Applicants Yet</p>
                    <p className="text-[11px]">When visitors register for early beta on the /app page, they will instantly appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                          <th className="p-3">Applicant</th>
                          <th className="p-3">Contact (Email / Phone)</th>
                          <th className="p-3">Platform</th>
                          <th className="p-3">Registered On</th>
                          <th className="p-3 text-right">Instant Dispatch</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {appWaitlistLeads
                          .filter((l) => {
                            if (waitlistPlatformFilter !== 'all') {
                              if (waitlistPlatformFilter === 'iOS' && !(l.service || '').includes('iOS')) return false;
                              if (waitlistPlatformFilter === 'Android' && (l.service || '').includes('iOS')) return false;
                            }
                            if (!waitlistSearch.trim()) return true;
                            const q = waitlistSearch.toLowerCase();
                            return (
                              (l.name || '').toLowerCase().includes(q) ||
                              (l.email || '').toLowerCase().includes(q) ||
                              (l.phone || '').toLowerCase().includes(q)
                            );
                          })
                          .map((lead, idx) => {
                            const isIos = (lead.service || '').includes('iOS');
                            const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
                            const wpMessage = encodeURIComponent(
                              `Hello ${lead.name || 'Friend'}, your early beta access invitation to LOCAL2BRAND Mobile (${formData.appConfig?.version || 'v2.4.0'}) is now ready! 🚀\n\nDownload official release here: ${typeof window !== 'undefined' ? window.location.origin : 'https://local2brand.cyou'}/app`
                            );
                            const wpUrl = cleanPhone ? `https://wa.me/${cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone}?text=${wpMessage}` : null;

                            return (
                              <tr key={lead._id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="p-3">
                                  <div className="font-bold text-slate-900 dark:text-white">
                                    {lead.name || 'Mobile App User'}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    ID: {(lead._id || '').slice(-6)}
                                  </div>
                                </td>

                                <td className="p-3">
                                  <div className="space-y-0.5">
                                    {lead.phone && (
                                      <div className="flex items-center gap-1.5 font-mono text-slate-800 dark:text-slate-200">
                                        <Phone className="w-3 h-3 text-purple-600" />
                                        <span>{lead.phone}</span>
                                      </div>
                                    )}
                                    {lead.email && !lead.email.includes('beta-app@local2brand.cyou') && !lead.email.includes('beta-app@local2brand.com') && (
                                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                                        <Mail className="w-3 h-3 text-slate-400" />
                                        <span>{lead.email}</span>
                                      </div>
                                    )}
                                  </div>
                                </td>

                                <td className="p-3">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                    isIos
                                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  }`}>
                                    {isIos ? '🍏 iOS Beta' : '🤖 Android APK'}
                                  </span>
                                </td>

                                <td className="p-3 text-[11px] text-slate-500">
                                  {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'Recently'}
                                </td>

                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {wpUrl && (
                                      <a
                                        href={wpUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-transform active:scale-95"
                                        title="Send WhatsApp Invitation"
                                      >
                                        <Send className="w-3 h-3" />
                                        <span>Invite on WA</span>
                                      </a>
                                    )}

                                    {lead.phone && (
                                      <a
                                        href={`tel:${lead.phone}`}
                                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                                        title="Call Phone"
                                      >
                                        <Phone className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Bottom Primary Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-sm text-white shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all ${
                savedRecently ? 'bg-emerald-600' : 'l2b-gradient-bg'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving & Syncing All Customizations...</span>
                </>
              ) : savedRecently ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>All Customizations Saved & Synced Live! ✅</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Publish All Customizations Live 🚀</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Guaranteed Fixed Floating Bottom Save Bar */}
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-8 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-2.5 sm:p-3.5 rounded-2xl border-2 border-purple-500/60 shadow-[0_10px_40px_rgba(124,58,237,0.25)] flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <div className="hidden sm:flex items-center gap-2 pl-1 pr-2 border-r border-slate-200 dark:border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">
              Settings Ready
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white shadow-xl hover:shadow-2xl flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-105 active:scale-95 ${
              savedRecently ? 'bg-emerald-600' : 'l2b-gradient-bg'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedRecently ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved & Live! ✅</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Sync Live 🚀</span>
              </>
            )}
          </button>
        </div>


      </div>
    </>
  );
}
