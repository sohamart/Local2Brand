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
          return {
            ...parsed,
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
      brandName: staticFallback.brandName || 'LOCAL2BRAND',
      domain: staticFallback.domain || 'local2brand.com',
      tagline: staticFallback.tagline || 'Build Local. Think Global.',
      supportEmail: staticFallback.email || 'local2brand@zohomail.in',
      displayPhone: '+91 98765 43210',
      turnaroundTime: staticFallback.turnaroundTime || '48 Hours',
      startingPriceUsd: staticFallback.startingPrice || '$399',
      startingPriceInr: staticFallback.startingPriceInr || '₹9,999',
      isMaintenanceMode: false,
      isComingSoonMode: false,
      maintenanceMessage: 'We are currently upgrading our platform. We will be back online shortly!',
      socialLinks: {
        instagram: 'https://instagram.com/local2brand',
        instagramHandle: '@local2brand',
        linkedin: 'https://linkedin.com/company/local2brand',
        github: 'https://github.com/local2brand',
        twitter: 'https://twitter.com/local2brand',
      },
      heroConfig: {
        badge: '🇮🇳 India’s #1 Fast-Track Web Experience Engine',
        title: 'Transform Your Local Business Into A Global Brand',
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
      luckyWheel: {
        enabled: true,
        activeGame: 'wheel',
        title: '🎡 Interactive Rewards & Launch Gifts',
        subtitle: 'Play our interactive launch game to win instant discounts, free domains, and launch vouchers!',
        btnText: 'Play & Win Prize',
        rewardVoucher: 'INDIA2025',
        rewardDiscount: 20,
        campaignVersion: 1,
        lastResetDate: new Date().toISOString(),
      },
      bannerImage: '',
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

  // Helper to merge settings cleanly and update caches & sub-events
  const applySettings = useCallback((incomingSettings, broadcastCrossTab = true) => {
    if (!incomingSettings || typeof incomingSettings !== 'object') return;

    setSettings((prev) => {
      const merged = {
        ...prev,
        ...incomingSettings,
        importantUpdates: incomingSettings.importantUpdates
          ? {
              ...prev.importantUpdates,
              ...incomingSettings.importantUpdates,
              enabled: incomingSettings.importantUpdates.enabled !== false,
            }
          : prev.importantUpdates,
        luckyWheel: incomingSettings.luckyWheel
          ? {
              ...prev.luckyWheel,
              ...incomingSettings.luckyWheel,
              enabled: incomingSettings.luckyWheel.enabled !== false,
            }
          : prev.luckyWheel,
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

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.get('/settings');
      if (res.success && res.settings) {
        applySettings(res.settings, true);
      }
    } catch (err) {
      console.warn('Using cached site settings (backend offline or loading)');
    } finally {
      setLoading(false);
    }
  }, [applySettings]);

  // Initial Fetch & Real-Time Server-Sent Events (SSE) stream setup
  useEffect(() => {
    fetchSettings();

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

    // 2. Setup Native Server-Sent Events (SSE) for Real-Time Server Updates
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

        eventSource.addEventListener('connected', () => {
          // SSE connection active
        });

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Attempt gentle reconnect after 5s
          clearTimeout(reconnectTimeout);
          reconnectTimeout = setTimeout(connectSSE, 5000);
        };
      } catch (err) {
        // SSE not supported or network error
      }
    };

    connectSSE();

    // 3. Fallback Cross-Tab Storage Event Listener
    const handleStorage = (e) => {
      if (e.key === 'l2b_cached_settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          applySettings(parsed, false);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // 4. Foreground Tab Focus Sync
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchSettings();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
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
    };
  }, [applySettings, fetchSettings]);

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
