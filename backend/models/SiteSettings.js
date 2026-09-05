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
      default: 'local2brand@zohomail.in',
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
      enabled: { type: Boolean, default: false },
      text: { type: String, default: '🔥 Special Launch Offer: Get 20% OFF + Free SSL & Domain with code INDIA2025' },
      badge: { type: String, default: 'FLASH OFFER' },
      link: { type: String, default: '/pricing' },
      promoCode: { type: String, default: 'INDIA2025' },
      discountPercent: { type: Number, default: 20 },
      btnText: { type: String, default: 'Claim Offer' },
    },
    importantUpdates: {
      enabled: { type: Boolean, default: true },
      speed: { type: String, default: 'normal' },
      showForLoggedInOnly: { type: Boolean, default: false },
      items: [
        {
          id: { type: String, default: 'update-1' },
          text: { type: String, default: '🚀 Platform Upgrade: New AI Assistant, Instant Callback & 48-Hour Rapid Delivery are now active!' },
          badge: { type: String, default: 'SYSTEM UPDATE' },
          badgeType: { type: String, default: 'purple' },
          link: { type: String, default: '/dashboard' },
          isActive: { type: Boolean, default: true },
        },
        {
          id: { type: String, default: 'update-2' },
          text: { type: String, default: '🎁 Special Launch Incentive: Spin the Lucky Wheel for up to 20% OFF & free custom domain setup.' },
          badge: { type: String, default: 'OFFER' },
          badgeType: { type: String, default: 'amber' },
          link: { type: String, default: '/pricing' },
          isActive: { type: Boolean, default: true },
        },
        {
          id: { type: String, default: 'update-3' },
          text: { type: String, default: '⚡ Live Client Desk: 15-Minute Instant Founder Callback is now live for all project inquiries.' },
          badge: { type: String, default: 'LIVE SUPPORT' },
          badgeType: { type: String, default: 'emerald' },
          link: { type: String, default: '/contact' },
          isActive: { type: Boolean, default: true },
        }
      ]
    },
    luckyWheel: {
      enabled: { type: Boolean, default: true },
      activeGame: { type: String, default: 'wheel' }, // 'wheel', 'slots', 'boxes', 'scratch'
      title: { type: String, default: '🎡 Interactive Rewards & Launch Gifts' },
      subtitle: { type: String, default: 'Play our interactive launch game to win instant discounts, free domains, and launch vouchers!' },
      btnText: { type: String, default: 'Play & Win Prize' },
      rewardVoucher: { type: String, default: 'INDIA2025' },
      rewardDiscount: { type: Number, default: 20 },
      campaignVersion: { type: Number, default: 1 },
      lastResetDate: { type: Date, default: Date.now },
      prizes: [
        {
          id: { type: String, default: 'prize-1' },
          label: { type: String, default: '20% OFF Launch Voucher' },
          subLabel: { type: String, default: 'Flat 20% Discount on any Plan' },
          code: { type: String, default: 'INDIA2025' },
          discountPercent: { type: Number, default: 20 },
          color: { type: String, default: '#8b5cf6' },
          icon: { type: String, default: '🎉' },
        },
        {
          id: { type: String, default: 'prize-2' },
          label: { type: String, default: '₹1,000 Flat Discount' },
          subLabel: { type: String, default: 'Instant ₹1,000 Savings' },
          code: { type: String, default: 'LOCAL1000' },
          discountPercent: { type: Number, default: 15 },
          color: { type: String, default: '#ec4899' },
          icon: { type: String, default: '⚡' },
        },
        {
          id: { type: String, default: 'prize-3' },
          label: { type: String, default: 'Free Custom Domain' },
          subLabel: { type: String, default: '1-Year .com / .in Domain Setup' },
          code: { type: String, default: 'FREEDOMAIN' },
          discountPercent: { type: Number, default: 10 },
          color: { type: String, default: '#06b6d4' },
          icon: { type: String, default: '🌐' },
        },
        {
          id: { type: String, default: 'prize-4' },
          label: { type: String, default: 'VIP Priority 48h Turnaround' },
          subLabel: { type: String, default: 'Express Delivery in 48 Hours' },
          code: { type: String, default: 'EXPRESS48' },
          discountPercent: { type: Number, default: 15 },
          color: { type: String, default: '#10b981' },
          icon: { type: String, default: '🚀' },
        },
        {
          id: { type: String, default: 'prize-5' },
          label: { type: String, default: 'Free SSL + Cloudflare CDN' },
          subLabel: { type: String, default: 'Lifetime Enterprise Security' },
          code: { type: String, default: 'SECURE2025' },
          discountPercent: { type: Number, default: 10 },
          color: { type: String, default: '#f59e0b' },
          icon: { type: String, default: '🛡️' },
        },
        {
          id: { type: String, default: 'prize-6' },
          label: { type: String, default: '15% OFF Starter Package' },
          subLabel: { type: String, default: 'Special Starter Pack Savings' },
          code: { type: String, default: 'STARTER15' },
          discountPercent: { type: Number, default: 15 },
          color: { type: String, default: '#6366f1' },
          icon: { type: String, default: '✨' },
        },
      ]
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
        founderCount: { type: Number, default: 1 },
        showFoundersToAi: { type: Boolean, default: true },
        founders: {
          type: [
            {
              name: { type: String, default: '' },
              role: { type: String, default: '' },
              bio: { type: String, default: '' },
              instagram: { type: String, default: '' },
              linkedin: { type: String, default: '' },
              email: { type: String, default: '' },
              phone: { type: String, default: '' },
            },
          ],
          default: [
            {
              name: 'Soham Dutta',
              role: 'Founder & Lead Architect',
              bio: 'Full-Stack Engineer & Designer leading fast-track digital products.',
              instagram: 'https://instagram.com/sohamart',
              linkedin: '',
              email: 'sohamduttabwn@gmail.com',
              phone: '+91 98765 43210',
            }
          ],
        },
        contactPhone: { type: String, default: '+91 98765 43210' },
        contactEmail: { type: String, default: 'local2brand@zohomail.in' },
        officeLocation: { type: String, default: 'Kolkata & Bangalore, India' },
        workingHours: { type: String, default: 'Monday - Saturday: 10:00 AM - 8:00 PM IST' },
        whatsappSupport: { type: String, default: '+91 98765 43210' },
        instagram: { type: String, default: 'https://instagram.com/local2brand' },
        instagramHandle: { type: String, default: '@local2brand' },
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
    countryThemes: {
      type: Object,
      default: {}
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
