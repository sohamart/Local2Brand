import React, { createContext, useContext, useState, useEffect } from 'react';
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
          }
        ]
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

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.success && res.settings) {
        setSettings((prev) => {
          const merged = {
            ...prev,
            ...res.settings,
            importantUpdates: {
              ...prev.importantUpdates,
              ...(res.settings.importantUpdates || {}),
              enabled: res.settings.importantUpdates?.enabled !== false,
            },
            navLinks: prev.navLinks,
          };
          try {
            localStorage.setItem('l2b_cached_settings', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      }
    } catch (err) {
      console.warn('Using default site settings (backend offline or loading)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);



  const updateLocalSettingsState = (newSettings) => {
    if (!newSettings) return;
    setSettings((prev) => {
      const merged = {
        ...prev,
        ...newSettings,
        navLinks: prev.navLinks,
      };
      try {
        localStorage.setItem('l2b_cached_settings', JSON.stringify(merged));
      } catch (e) {}
      return merged;
    });
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
