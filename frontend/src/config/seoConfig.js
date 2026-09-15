/**
 * Centralized SEO Configuration for Weblets
 * Official Website: https://weblets.bond
 * Brand: Weblets
 * 
 * Defines canonical metadata, search engine directives, Open Graph,
 * Twitter cards, and Schema.org structured data for all indexable pages.
 */

export const BRAND = {
  name: 'weblets agency',
  legalName: 'weblets agency - lets make website together',
  alternateNames: ['weblets', 'weblets agency', 'Weblets', 'Weblets Agency', 'weblets.bond', 'lets make website together'],
  domain: 'https://weblets.bond',
  tagline: 'lets make website together',
  description: 'weblets agency - lets make website together. High-converting bespoke websites, e-commerce stores, responsive commercial templates, and WhatsApp lead funnels with 48-hour to 7-day express delivery.',
  logo: 'https://weblets.bond/logo.png',
  logoDark: 'https://weblets.bond/logo-dark.png',
  favicon: 'https://weblets.bond/favicon.png',
  email: 'contact@weblets.bond',
  phone: '+918710043923',
  displayPhone: '+91 87100 43923',
  address: {
    streetAddress: 'Kolkata & Bangalore Hubs',
    addressLocality: 'Kolkata',
    addressRegion: 'West Bengal',
    postalCode: '700001',
    addressCountry: 'IN'
  },
  geo: {
    region: 'IN-WB',
    placename: 'Kolkata, West Bengal, India',
    latitude: '22.5726',
    longitude: '88.3639'
  },
  priceRange: '₹4,999 - ₹49,999 / $149 - $1,499',
  founders: [
    {
      name: 'Soham Dutta',
      jobTitle: 'Lead Architect & Full-Stack Systems',
      url: 'https://linkedin.com/in/soham-dutta'
    },
    {
      name: 'Sayantan',
      jobTitle: 'Technical Lead & Frontend Engineering',
      url: 'https://weblets.bond/team'
    },
    {
      name: 'Achinta',
      jobTitle: 'Operations & Product Delivery Lead',
      url: 'https://weblets.bond/team'
    }
  ],
  socials: [
    'https://instagram.com/weblets_official',
    'https://linkedin.com/company/weblets',
    'https://github.com/weblets',
    'https://twitter.com/weblets'
  ]
};

export const DEFAULT_KEYWORDS = [
  'weblets agency',
  'weblets',
  'lets make website together',
  'weblets.bond',
  'weblets agency website',
  'weblets web development',
  'weblets website design',
  'weblets software',
  'weblets MERN development',
  'bespoke web development',
  'fast website agency',
  'ecommerce website',
  'WhatsApp order website',
  'restaurant website template',
  'salon booking website',
  'real estate website',
  'high converting landing pages'
].join(', ');

export const SEO_PAGES = {
  home: {
    title: 'weblets agency - lets make website together',
    description: 'weblets agency - lets make website together. High-performance bespoke websites, e-commerce stores, responsive commercial templates, and WhatsApp lead funnels with 48h delivery.',
    canonical: 'https://weblets.bond/',
    h1: 'We Build Websites That Turn Your Vision Into A Global Brand.',
    ogType: 'website',
    priority: 1.0,
    changefreq: 'daily'
  },
  services: {
    title: 'Web Development & Digital Growth Services | Weblets',
    description: 'Explore Weblets services: bespoke business websites, high-converting landing pages, e-commerce stores, portfolio showcases, and custom MERN web applications.',
    canonical: 'https://weblets.bond/services',
    h1: 'Web Development & Digital Growth Services',
    ogType: 'website',
    priority: 0.9,
    changefreq: 'weekly'
  },
  demos: {
    title: 'Live Website Templates & Interactive Demos | Weblets',
    description: 'Browse 12+ live working website demos for Restaurants, Cafes, Salons, Gyms, Real Estate, Clinics, and Boutiques with instant 48-hour customization.',
    canonical: 'https://weblets.bond/demos',
    h1: 'Live Website Demos & Interactive Niche Templates',
    ogType: 'website',
    priority: 0.95,
    changefreq: 'daily'
  },
  pricing: {
    title: 'Website Development Packages & Pricing | Weblets',
    description: 'Transparent fixed-price website packages from ₹4,999 ($149). Zero hidden fees, GST invoicing, 48-hour delivery, and turnkey hosting options.',
    canonical: 'https://weblets.bond/pricing',
    h1: 'Transparent Website Development Packages & Pricing',
    ogType: 'website',
    priority: 0.9,
    changefreq: 'weekly'
  },
  portfolio: {
    title: 'Projects & Portfolio — Digital Transformations | Weblets',
    description: 'Discover case studies and delivered digital flagships by Weblets. Real conversion results, sub-second performance, and custom UI design.',
    canonical: 'https://weblets.bond/portfolio',
    h1: 'Projects & Portfolio — Digital Transformations by Weblets',
    ogType: 'website',
    priority: 0.85,
    changefreq: 'weekly'
  },
  team: {
    title: 'Our Team — Founders & Engineering Architects | Weblets',
    description: 'Meet the founders and engineering architects behind Weblets: Soham Dutta, Sayantan, and Achinta. Direct founder access on every web project.',
    canonical: 'https://weblets.bond/team',
    h1: 'Our Team — Meet the Founders & Architects Behind Weblets',
    ogType: 'website',
    priority: 0.85,
    changefreq: 'weekly'
  },
  about: {
    title: 'About Weblets | Lets make website together',
    description: 'Learn about Weblets, our mission, and engineering philosophy. Combining Apple-grade liquid glass design, sub-second speed, and express turnarounds.',
    canonical: 'https://weblets.bond/about',
    h1: 'About Weblets — Lets make website together',
    ogType: 'website',
    priority: 0.8,
    changefreq: 'monthly'
  },
  contact: {
    title: 'Contact Weblets | Start Your Web Project',
    description: 'Get in touch with Weblets. Request an instant 15-minute phone callback, submit project requirements, or connect directly with our engineering team.',
    canonical: 'https://weblets.bond/contact',
    h1: 'Contact Weblets — Start Your Website Project',
    ogType: 'website',
    priority: 0.85,
    changefreq: 'monthly'
  },
  getStarted: {
    title: 'Get Started — Fast-Track Website Requirement Builder | Weblets',
    description: 'Launch your project with our interactive 3-minute website requirement builder. Select your niche, features, and receive an instant blueprint proposal.',
    canonical: 'https://weblets.bond/get-started',
    h1: 'Smart Website Requirement & Project Blueprint Builder',
    ogType: 'website',
    priority: 0.9,
    changefreq: 'weekly'
  },
  trackOrder: {
    title: 'Track Order — Live Project Sprint & Milestones | Weblets',
    description: 'Track your real-time website engineering sprint, design milestones, 6-stage roadmap, and live delivery timeline using your Order ID.',
    canonical: 'https://weblets.bond/track-order',
    h1: 'Track Your Website Sprint & Milestones',
    ogType: 'website',
    priority: 0.85,
    changefreq: 'daily'
  },
  appDownload: {
    title: 'Download Official Weblets Mobile App (PWA & APK) | Weblets',
    description: 'Download the official Weblets mobile app for Android and iOS. Track orders in real-time, browse live templates, and receive instant push updates.',
    canonical: 'https://weblets.bond/app',
    h1: 'Download Official Weblets Mobile App',
    ogType: 'website',
    priority: 0.85,
    changefreq: 'weekly'
  },
  terms: {
    title: 'Terms and Conditions | Weblets',
    description: 'Official Terms of Service for Weblets (weblets.bond). Transparent 48-hour SLAs, full code ownership rights, milestone sign-offs, and policies.',
    canonical: 'https://weblets.bond/terms',
    h1: 'Terms and Conditions',
    ogType: 'website',
    priority: 0.5,
    changefreq: 'monthly'
  },
  privacy: {
    title: 'Privacy Policy | Weblets',
    description: 'Learn how Weblets protects your data with enterprise-grade encryption, strict role-based access, and zero third-party data selling.',
    canonical: 'https://weblets.bond/privacy',
    h1: 'Privacy Policy',
    ogType: 'website',
    priority: 0.5,
    changefreq: 'monthly'
  },
  notFound: {
    title: 'Page Not Found (404) | Weblets',
    description: 'The requested page was not found. Browse our live website templates or return to the Weblets homepage.',
    canonical: 'https://weblets.bond/404',
    h1: 'Page Not Found',
    robots: 'noindex, nofollow'
  }
};
