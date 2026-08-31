import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { siteConfig as staticFallback } from '../config/siteConfig';

const SiteSettingsContext = createContext();

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    brandName: staticFallback.brandName || 'LOCAL2BRAND',
    domain: staticFallback.domain || 'local2brand.com',
    tagline: staticFallback.tagline || 'Build Local. Think Global.',
    supportEmail: staticFallback.email || 'hello@local2brand.com',
    displayPhone: '',
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
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  });

  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.success && res.settings) {
        setSettings((prev) => ({
          ...prev,
          ...res.settings,
          navLinks: prev.navLinks,
        }));
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
