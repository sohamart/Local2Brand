/**
 * Centralized Site Configuration for LOCAL2BRAND
 * All contact information, social links, brand copy, and WhatsApp configs are defined here.
 */

export const siteConfig = {
  brandName: "LOCAL2BRAND",
  tagline: "Build Local. Think Global.",
  shortDescription: "We Build Digital Experiences That Turn Local Brands Into Big Brands.",
  fullDescription: "LOCAL2BRAND designs and develops bespoke, high-converting websites and modern digital products for ambitious businesses ready to scale locally and globally.",
  
  // WhatsApp & Contact details
  // Note: whatsappNumber should be international format without '+' or spaces for wa.me URL
  whatsappNumber: "919876543210", 
  displayWhatsapp: "+91 98765 43210",
  email: "hello@local2brand.com",
  phone: "+91 98765 43210",
  address: "Digital Innovation Hub, Tech City",
  hours: "Mon - Sat: 9:00 AM - 8:00 PM IST",

  socialLinks: {
    instagram: "https://instagram.com/local2brand",
    facebook: "https://facebook.com/local2brand",
    linkedin: "https://linkedin.com/company/local2brand",
    youtube: "https://youtube.com/@local2brand",
    twitter: "https://twitter.com/local2brand"
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
    { value: "99.8%", label: "Average PageSpeed", subtext: "Ultra-fast load times" },
    { value: "48 Hrs", label: "Fast Turnaround", subtext: "For ready-made templates" },
    { value: "100%", label: "Mobile Responsive", subtext: "Pixel-perfect on all devices" },
    { value: "24/7", label: "Direct WhatsApp Support", subtext: "No automated bots" }
  ]
};

export default siteConfig;
