export const siteConfig = {
  brandName: "LOCAL2BRAND",
  domain: "local2brand.cyou",
  tagline: "Build Local. Think Global.",
  
  // Default Brand Details (Managed live via Database & Admin Customization)
  whatsappNumber: "918710043923",
  displayWhatsApp: "+91 87100 43923",
  phone: "+91 87100 43923",
  email: "local2brand.contact@gmail.com",
  
  turnaroundTime: "48 Hours",
  startingPrice: "$399",
  startingPriceInr: "₹9,999",

  isMaintenanceMode: false,
  isComingSoonMode: false,

  // Social Links
  socialLinks: {
    instagram: "https://instagram.com/local2brand_official",
    instagramHandle: "@local2brand_official",
    whatsapp: "https://wa.me/918710043923",
    linkedin: "https://linkedin.com/company/local2brand",
    github: "https://github.com/local2brand",
    twitter: "https://twitter.com/local2brand"
  },

  // Primary Navigation Structure
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Templates", href: "/demos" },
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "Track Order", href: "/track-order" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "App", href: "/app" }
  ],

  appConfig: {
    enabled: true,
    isComingSoon: false,
    showComingSoonPopup: false,
    comingSoonTitle: 'LOCAL2BRAND Mobile App — Launching Soon',
    comingSoonMessage: 'We are polishing our next-gen mobile application for Android & iOS. Register for early beta access!',
    appName: 'LOCAL2BRAND Mobile',
    appSubtitle: 'Build Local. Think Global. Supercharge Your Business On The Go.',
    appDescription: 'Manage client orders, track engineering sprints in real-time, preview live demo templates, and receive instant WhatsApp push dispatches directly from your mobile device.',
    version: 'v2.4.0',
    fileSize: '24.8 MB',
    minAndroid: 'Android 8.0 & above',
    minIos: 'iOS 15.0 & above',
    packageName: 'com.local2brand.app',
    apkDownloadUrl: 'https://local2brand.cyou/downloads/local2brand-v2.4.0.apk',
    playStoreUrl: '',
    appStoreUrl: '',
    indusStoreUrl: '',
    qrCodeUrl: '',
    screenshots: [],
    features: [],
    changelog: []
  }
};
