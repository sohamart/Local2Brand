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
      badge: { type: String, default: 'FLASH OFFER' },
      link: { type: String, default: '/pricing' },
      promoCode: { type: String, default: 'INDIA2025' },
      discountPercent: { type: Number, default: 20 },
      btnText: { type: String, default: 'Claim Offer' },
    },
    bannerImage: {
      type: String,
      default: '',
    },
    aiSettings: {
      enabled: { type: Boolean, default: true },
      customInstructions: {
        type: String,
        default: 'Be polite, friendly, and conversion-focused. Guide users towards booking a demo or requesting a callback. Recommend the promo code INDIA2025 for 20% discount.',
      },
      businessKnowledge: {
        type: String,
        default: 'LOCAL2BRAND builds high-converting business websites in 48 hours. Ready demo templates start at ₹9,999 / $399. Bespoke custom builds are available for complex requirements.',
      },
      adminShowableDetails: {
        founderName: { type: String, default: 'LOCAL2BRAND Founders & Core Team' },
        contactPhone: { type: String, default: '+91 98765 43210' },
        contactEmail: { type: String, default: 'contact@local2brand.com' },
        officeLocation: { type: String, default: 'Kolkata & Bangalore, India' },
        workingHours: { type: String, default: 'Monday - Saturday: 10:00 AM - 8:00 PM IST' },
        whatsappSupport: { type: String, default: '+91 98765 43210' },
      },
    },
    pricingPlans: {
      type: [
        {
          id: { type: String, default: '' },
          name: { type: String, default: '' },
          badge: { type: String, default: '' },
          popular: { type: Boolean, default: false },
          price: { type: String, default: '$399' },
          priceInr: { type: String, default: '₹12,999' },
          billingNote: { type: String, default: 'One-time investment' },
          turnaround: { type: String, default: '3 - 7 Days' },
          description: { type: String, default: '' },
          features: { type: [String], default: [] },
          notIncluded: { type: [String], default: [] },
          ctaText: { type: String, default: 'Get Started' },
          websiteType: { type: String, default: 'Starter Website' },
          status: { type: String, enum: ['published', 'coming_soon'], default: 'published' },
          order: { type: Number, default: 1 },
        }
      ],
      default: []
    },
    demoCategories: {
      type: [String],
      default: []
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
