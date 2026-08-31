import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: 'LOCAL2BRAND',
      trim: true,
    },
    domain: {
      type: String,
      default: 'local2brand.com',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Build Local. Think Global.',
      trim: true,
    },
    supportEmail: {
      type: String,
      default: 'hello@local2brand.com',
      trim: true,
    },
    displayPhone: {
      type: String,
      default: '',
      trim: true,
    },
    turnaroundTime: {
      type: String,
      default: '48 Hours',
    },
    startingPriceUsd: {
      type: String,
      default: '$399',
    },
    startingPriceInr: {
      type: String,
      default: '₹9,999',
    },
    isMaintenanceMode: {
      type: Boolean,
      default: false,
    },
    isComingSoonMode: {
      type: Boolean,
      default: false,
    },
    maintenanceMessage: {
      type: String,
      default: 'We are currently upgrading our platform to serve you better. We will be back online shortly!',
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/local2brand' },
      instagramHandle: { type: String, default: '@local2brand' },
      linkedin: { type: String, default: 'https://linkedin.com/company/local2brand' },
      github: { type: String, default: 'https://github.com/local2brand' },
      twitter: { type: String, default: 'https://twitter.com/local2brand' },
    },
    heroConfig: {
      badge: { type: String, default: '🇮🇳 India’s #1 Fast-Track Web Experience Engine' },
      title: { type: String, default: 'Transform Your Local Business Into A Global Brand' },
      subtitle: { type: String, default: 'World-class UI/UX design, sub-second performance, and instant lead capture for ambitious businesses ready to scale.' },
    },
    announcementBar: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: '🔥 Special Launch Offer: Get 20% OFF + Free SSL & Domain with code INDIA2025' },
      link: { type: String, default: '/pricing' },
    },
    bannerImage: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);
