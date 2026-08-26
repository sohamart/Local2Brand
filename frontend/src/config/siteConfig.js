/**
 * Centralized Site Configuration for LOCAL2BRAND
 * Dynamically populated from environment variables (.env) with robust fallbacks.
 */

export const siteConfig = {
  brandName: import.meta.env.VITE_BRAND_NAME || "LOCAL2BRAND",
  tagline: import.meta.env.VITE_BRAND_TAGLINE || "Build Local. Think Global.",
  shortDescription: import.meta.env.VITE_BRAND_SHORT_DESC || "We Build Digital Experiences That Turn Local Brands Into Big Brands.",
  fullDescription: import.meta.env.VITE_BRAND_FULL_DESC || "LOCAL2BRAND designs and develops bespoke, high-converting websites and modern digital products for ambitious businesses ready to scale locally and globally.",
  
  // WhatsApp & Contact details
  // Note: whatsappNumber should be international format without '+' or spaces for wa.me URL
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210", 
  displayWhatsapp: import.meta.env.VITE_DISPLAY_WHATSAPP || "+91 98765 43210",
  email: import.meta.env.VITE_CONTACT_EMAIL || "hello@local2brand.com",
  phone: import.meta.env.VITE_CONTACT_PHONE || "+91 98765 43210",
  address: import.meta.env.VITE_CONTACT_ADDRESS || "Pan-India Hub • Mumbai, Bengaluru, Delhi, Kolkata & Global Edge",
  hours: import.meta.env.VITE_CONTACT_HOURS || "Mon - Sat: 9:00 AM - 9:00 PM IST",

  socialLinks: {
    instagram: import.meta.env.VITE_INSTAGRAM_URL || "https://instagram.com/local2brand",
    facebook: import.meta.env.VITE_FACEBOOK_URL || "https://facebook.com/local2brand",
    linkedin: import.meta.env.VITE_LINKEDIN_URL || "https://linkedin.com/company/local2brand",
    youtube: import.meta.env.VITE_YOUTUBE_URL || "https://youtube.com/@local2brand",
    twitter: import.meta.env.VITE_TWITTER_URL || "https://twitter.com/local2brand"
  },

  navLinks: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Work", href: "/portfolio" },
    { label: "Pricing", href: "/pricing" },
    { label: "Demos", href: "/demos" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
  ],

  metrics: [
    { value: import.meta.env.VITE_METRIC_SPEED || "99.8%", label: "Average PageSpeed", subtext: "Ultra-fast load times" },
    { value: import.meta.env.VITE_METRIC_TURNAROUND || "48 Hrs", label: "Fast Turnaround", subtext: "For ready-made templates" },
    { value: import.meta.env.VITE_METRIC_RESPONSIVE || "100%", label: "Mobile Responsive", subtext: "Pixel-perfect on all devices" },
    { value: import.meta.env.VITE_METRIC_SUPPORT || "24/7", label: "Direct WhatsApp Support", subtext: "No automated bots" }
  ]
};

export default siteConfig;
