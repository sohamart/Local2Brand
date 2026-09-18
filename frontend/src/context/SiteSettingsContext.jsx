import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { siteConfig as staticFallback } from '../config/siteConfig';

const SiteSettingsContext = createContext();

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('l2b_cached_settings');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.brandName === 'LOCAL2BRAND' || parsed.tagline === 'Build Local. Think Global.' || (parsed.appConfig?.appName && parsed.appConfig.appName.includes('LOCAL2BRAND'))) {
            parsed.brandName = 'WEBLETS';
            parsed.domain = 'weblets.bond';
            parsed.tagline = 'Lets make website together';
            parsed.supportEmail = 'contact@weblets.bond';
            if (parsed.appConfig) {
              parsed.appConfig.appName = 'WEBLETS Web App';
              parsed.appConfig.appSubtitle = 'Official Inbuilt Web App & Client Portal';
              parsed.appConfig.packageName = 'com.weblets.webapp';
            }
            localStorage.setItem('l2b_cached_settings', JSON.stringify(parsed));
          }
          return {
            ...parsed,
            appConfig: {
              ...(staticFallback.appConfig || {}),
              ...(parsed.appConfig || {}),
            },
            navLinks: staticFallback.navLinks || [
              { label: 'Home', href: '/' },
              { label: 'Templates', href: '/demos' },
              { label: 'Services', href: '/services' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Track Order', href: '/track-order' },
              { label: 'Portfolio', href: '/portfolio' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ],
          };
        } catch (e) {}
      }
    }

    return {
      brandName: staticFallback.brandName || 'WEBLETS',
      domain: staticFallback.domain || 'weblets.bond',
      tagline: staticFallback.tagline || 'Lets make website together',
      supportEmail: staticFallback.email || 'contact@weblets.bond',
      displayPhone: staticFallback.phone || '+91 87100 43923',
      turnaroundTime: staticFallback.turnaroundTime || '48 Hours',
      startingPriceUsd: staticFallback.startingPrice || '$399',
      startingPriceInr: staticFallback.startingPriceInr || '₹9,999',
      logoLightUrl: '/logo.png',
      logoDarkUrl: '/logo-dark.png',
      isMaintenanceMode: false,
      isComingSoonMode: false,
      maintenanceMessage: 'We are currently upgrading our platform. We will be back online shortly!',
      targetLaunchDate: '',
      socialLinks: {
        instagram: 'https://instagram.com/weblets.bond',
        instagramHandle: '@weblets.bond',
        linkedin: 'https://linkedin.com/company/weblets',
        github: 'https://github.com/weblets',
        twitter: 'https://twitter.com/weblets',
        whatsapp: 'https://wa.me/918710043923',
      },
      heroConfig: {
        badge: '⚡ Modern High-Converting Web Experience Engine',
        title: 'Lets Make Website Together — Fast, Modern & Scalable',
        subtitle: 'World-class UI/UX design, sub-second performance, and instant lead capture for ambitious businesses ready to scale.',
      },
      importantUpdates: {
        enabled: true,
        speed: 'normal',
        showForLoggedInOnly: false,
        items: [
          {
            id: 'update-1',
            text: '🚀 Platform Upgrade: New AI Assistant, Instant Callback & 48-Hour Rapid Delivery are now active!',
            badge: 'SYSTEM UPDATE',
            badgeType: 'purple',
            link: '/dashboard',
            isActive: true,
          },
          {
            id: 'update-2',
            text: '🎁 Special Launch Incentive: Play Interactive Games for up to 20% OFF & free custom domain setup.',
            badge: 'OFFER',
            badgeType: 'amber',
            link: '/pricing',
            isActive: true,
          },
          {
            id: 'update-3',
            text: '⚡ Live Client Desk: 15-Minute Instant Founder Callback is now live for all project inquiries.',
            badge: 'LIVE SUPPORT',
            badgeType: 'emerald',
            link: '/contact',
            isActive: true,
          },
        ],
      },
      announcementBar: {
        enabled: false,
        text: '🔥 Special Launch Offer: Get 20% OFF + Free SSL & Domain with code WEBLETS20',
        link: '/pricing',
        badge: 'FLASH OFFER',
        promoCode: 'WEBLETS20',
        discountPercent: 20,
        btnText: 'Claim Offer',
      },
      luckyWheel: {
        enabled: true,
        activeGame: 'wheel',
        title: '🎡 Interactive Rewards & Launch Gifts',
        subtitle: 'Play our interactive launch game to win instant discounts, free domains, and launch vouchers!',
        btnText: 'Play & Win Prize',
        rewardVoucher: 'WEBLETS20',
        rewardDiscount: 20,
        campaignVersion: 1,
        lastResetDate: new Date().toISOString(),
      },
      bannerImage: '',
      appConfig: staticFallback.appConfig || {
        enabled: true,
        isComingSoon: false,
        showComingSoonPopup: false,
        comingSoonTitle: 'Weblets Mobile App — Launching Soon',
        comingSoonMessage: 'We are polishing our next-gen mobile application for Android & iOS. Register for early beta access!',
        appName: 'Weblets Mobile',
        appSubtitle: 'Lets make website together. Supercharge Your Business On The Go.',
        appDescription: 'Manage client orders, track engineering sprints in real-time, preview live demo templates, and receive instant WhatsApp push dispatches directly from your mobile device.',
        version: 'v2.4.0',
        fileSize: '24.8 MB',
        minAndroid: 'Android 8.0 & above',
        minIos: 'iOS 15.0 & above',
        packageName: 'com.weblets.app',
        apkDownloadUrl: 'https://weblets.bond/downloads/weblets-v2.4.0.apk',
        playStoreUrl: '',
        appStoreUrl: '',
        indusStoreUrl: '',
        qrCodeUrl: '',
        screenshots: [],
        features: [],
        changelog: []
      },
      navLinks: staticFallback.navLinks || [
        { label: 'Home', href: '/' },
        { label: 'Templates', href: '/demos' },
        { label: 'Services', href: '/services' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Track Order', href: '/track-order' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    };
  });

  const [loading, setLoading] = useState(true);
  const broadcastChannelRef = useRef(null);
  const currentVersionRef = useRef(settings?.updatedAt || '');

  // Helper to merge settings cleanly and update caches & sub-events
  const applySettings = useCallback((incomingSettings, broadcastCrossTab = true) => {
    if (!incomingSettings || typeof incomingSettings !== 'object') return;

    if (incomingSettings.updatedAt) {
      currentVersionRef.current = new Date(incomingSettings.updatedAt).getTime().toString();
    }

    setSettings((prev) => {
      const merged = {
        ...prev,
        ...incomingSettings,
        announcementBar: incomingSettings.announcementBar
          ? {
              ...prev.announcementBar,
              ...incomingSettings.announcementBar,
              enabled: Boolean(incomingSettings.announcementBar.enabled),
            }
          : prev.announcementBar,
        importantUpdates: incomingSettings.importantUpdates
          ? {
              ...prev.importantUpdates,
              ...incomingSettings.importantUpdates,
              enabled: Boolean(incomingSettings.importantUpdates.enabled),
            }
          : prev.importantUpdates,
        luckyWheel: incomingSettings.luckyWheel
          ? {
              ...prev.luckyWheel,
              ...incomingSettings.luckyWheel,
              enabled: Boolean(incomingSettings.luckyWheel.enabled),
            }
          : prev.luckyWheel,
        appConfig: incomingSettings.appConfig
          ? {
              ...(prev.appConfig || {}),
              ...incomingSettings.appConfig,
              enabled: incomingSettings.appConfig.enabled !== false,
              isComingSoon: Boolean(incomingSettings.appConfig.isComingSoon),
              showComingSoonPopup: Boolean(incomingSettings.appConfig.showComingSoonPopup),
              screenshots: Array.isArray(incomingSettings.appConfig.screenshots)
                ? incomingSettings.appConfig.screenshots
                : prev.appConfig?.screenshots || [],
              features: Array.isArray(incomingSettings.appConfig.features)
                ? incomingSettings.appConfig.features
                : prev.appConfig?.features || [],
              changelog: Array.isArray(incomingSettings.appConfig.changelog)
                ? incomingSettings.appConfig.changelog
                : prev.appConfig?.changelog || [],
            }
          : prev.appConfig,
        navLinks: prev.navLinks,
      };

      try {
        localStorage.setItem('l2b_cached_settings', JSON.stringify(merged));
      } catch (e) {}

      // If country themes changed, synchronize dynamic themes cache & events
      if (incomingSettings.countryThemes) {
        try {
          localStorage.setItem('l2b_country_themes_cache', JSON.stringify(incomingSettings.countryThemes));
          window.dispatchEvent(new CustomEvent('l2b_country_themes_updated', { detail: incomingSettings.countryThemes }));
        } catch (e) {}
      }

      // Broadcast across tabs if requested
      if (broadcastCrossTab && broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage({
            type: 'L2B_SETTINGS_UPDATE',
            settings: merged,
            timestamp: Date.now(),
          });
        } catch (e) {}
      }

      return merged;
    });
  }, []);

  const fetchSettings = useCallback(async (isInitial = false) => {
    let attempts = 0;
    const maxAttempts = isInitial ? 3 : 1;
    let success = false;

    while (attempts < maxAttempts && !success) {
      try {
        attempts++;
        const res = await api.get('/settings', { timeout: 6000 });
        if (res && (res.success || res.settings)) {
          applySettings(res.settings || res, true);
          success = true;
          break;
        }
      } catch (err) {
        console.warn(`[SiteSettings] Attempt ${attempts}/${maxAttempts} notice:`, err?.message || err);
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    if (!success) {
      console.warn('[SiteSettings] Using cached or default site settings (backend offline or loading)');
    }

    setLoading(false);
  }, [applySettings]);

  // Fast delta version checking for cross-device mobile & serverless auto-sync
  const checkSettingsVersion = useCallback(async () => {
    try {
      const res = await api.get('/settings/version');
      if (res?.success && res.version) {
        const lastVersion = currentVersionRef.current;
        if (!lastVersion) {
          currentVersionRef.current = res.version;
        } else if (res.version !== lastVersion) {
          currentVersionRef.current = res.version;
          fetchSettings(false);
        }
      }
    } catch (e) {}
  }, [fetchSettings]);

  // Initial Fetch & Real-Time Setup
  useEffect(() => {
    fetchSettings(true);

    // 1. Setup Cross-Tab BroadcastChannel
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('l2b_site_settings_channel');
        broadcastChannelRef.current = bc;
        bc.onmessage = (e) => {
          if (e.data?.type === 'L2B_SETTINGS_UPDATE' && e.data?.settings) {
            applySettings(e.data.settings, false);
          }
        };
      } catch (e) {}
    }

    // 2. High-speed 2.5-second polling loop for cross-device / mobile sync on serverless
    const versionInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        checkSettingsVersion();
      }
    }, 2500);

    // 3. Setup Native Server-Sent Events (SSE) for Instant Long-Running Connection
    let eventSource = null;
    let reconnectTimeout = null;

    const connectSSE = () => {
      try {
        const sseUrl = `${api.baseUrl}/settings/events`;
        eventSource = new EventSource(sseUrl, { withCredentials: true });

        eventSource.addEventListener('settings_updated', (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data) {
              applySettings(data, true);
            }
          } catch (err) {
            console.warn('SSE payload parse error:', err);
          }
        });

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          clearTimeout(reconnectTimeout);
          reconnectTimeout = setTimeout(connectSSE, 6000);
        };
      } catch (err) {}
    };

    connectSSE();

    // 4. Fallback Cross-Tab Storage Event Listener
    const handleStorage = (e) => {
      if (e.key === 'l2b_cached_settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          applySettings(parsed, false);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // 5. Foreground Tab Focus & Touch Wakeup Sync
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSettingsVersion();
        fetchSettings();
      }
    };

    const handleFocus = () => {
      checkSettingsVersion();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('touchstart', handleFocus, { passive: true });

    return () => {
      clearInterval(versionInterval);
      if (eventSource) {
        eventSource.close();
      }
      clearTimeout(reconnectTimeout);
      if (broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.close();
        } catch (e) {}
      }
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('touchstart', handleFocus);
    };
  }, [applySettings, fetchSettings, checkSettingsVersion]);

  const updateLocalSettingsState = (newSettings) => {
    if (!newSettings) return;
    applySettings(newSettings, true);
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        updateLocalSettingsState,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
