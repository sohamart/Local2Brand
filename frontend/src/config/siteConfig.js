export const siteConfig = {
  brandName: "LOCAL2BRAND",
  domain: "local2brand.com",
  tagline: "Build Local. Think Global.",
  
  // Dynamic Environment Integrations with Robust Fallbacks
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "919064971842",
  displayWhatsApp: import.meta.env.VITE_DISPLAY_WHATSAPP || "+91 90649 71842",
  phone: import.meta.env.VITE_CONTACT_PHONE || "+91 90649 71842",
  email: import.meta.env.VITE_CONTACT_EMAIL || "hello@local2brand.com",
  
  turnaroundTime: "48 Hours",
  startingPrice: "$399",
  startingPriceInr: "₹9,999",

  // Master Maintenance / Launch Gate
  isMaintenanceMode: false,
  isComingSoonMode: false,

  // Social Links
  socialLinks: {
    instagram: import.meta.env.VITE_INSTAGRAM_URL || "https://instagram.com/local2brand",
    instagramHandle: import.meta.env.VITE_INSTAGRAM_HANDLE || "@local2brand",
    whatsapp: `https://wa.me/${(import.meta.env.VITE_WHATSAPP_NUMBER || "919064971842").replace(/[^0-9]/g, '')}`,
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
    { label: "Portfolio", href: "/portfolio" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
  ]
};
