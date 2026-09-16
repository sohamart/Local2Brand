export const siteConfig = {
  brandName: "Weblets",
  domain: "weblets.bond",
  tagline: "Lets make website together",
  
  // Default Brand Details (Managed live via Database & Admin Customization)
  whatsappNumber: "918710043923",
  displayWhatsApp: "+91 87100 43923",
  phone: "+91 87100 43923",
  email: "contact@weblets.bond",
  
  turnaroundTime: "48 Hours",
  startingPrice: "$399",
  startingPriceInr: "₹9,999",

  logoLightUrl: "/logo.png",
  logoDarkUrl: "/logo-dark.png",

  isMaintenanceMode: false,
  isComingSoonMode: false,

  // Social Links
  socialLinks: {
    instagram: "https://instagram.com/weblets_official",
    instagramHandle: "@weblets_official",
    whatsapp: "https://wa.me/918710043923",
    linkedin: "https://linkedin.com/company/weblets",
    github: "https://github.com/weblets",
    twitter: "https://twitter.com/weblets"
  },

  // Primary Navigation Structure
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Templates", href: "/demos" },
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "Track Order", href: "/track-order" },
    { label: "Our Team", href: "/team" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "App", href: "/app" }
  ],

  appConfig: {
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
  }
};
