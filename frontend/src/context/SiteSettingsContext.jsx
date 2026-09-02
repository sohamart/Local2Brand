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
      supportEmail: staticFallback.email || 'stackaddacontact@gmail.com',
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
      announcementBar: {
        enabled: true,
        text: '🔥 Special Launch Offer: Get 20% OFF + Free SSL & Domain with code INDIA2025',
        link: '/pricing',
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
            navLinks: prev.navLinks,
          };
          localStorage.setItem('l2b_cached_settings', JSON.stringify(merged));
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

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
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
