/**
 * SmileCare Laser Dental Clinic & Implant Centre - Production Configuration
 */
export const dentalConfig = {
  businessName: import.meta.env.VITE_DEMO_DENTAL_NAME || "SmileCare Advanced Dental Clinic",
  businessSubtitle: "Microscopic Laser RCT, Clear Aligners & Titanium Implants",
  tagline: import.meta.env.VITE_DEMO_DENTAL_TAGLINE || "100% Painless Laser Dentistry • AI Digital Smile Design • Certified Sterilization Protocol",
  city: import.meta.env.VITE_DEMO_DENTAL_CITY || "Kolkata / Mumbai / Bengaluru",
  phone: import.meta.env.VITE_DEMO_DENTAL_PHONE || "+91 98765 43219",
  whatsapp: import.meta.env.VITE_DEMO_DENTAL_WHATSAPP || "919876543219",
  address: "SmileCare Plaza, Sector 5, Salt Lake, Kolkata - 700091",
  hours: {
    weekdays: "9:00 AM - 8:30 PM",
    sunday: "10:00 AM - 2:00 PM",
    days: "24/7 Emergency On-Call"
  },
  heroImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1600&auto=format&fit=crop",
  theme: {
    primaryColor: import.meta.env.VITE_DEMO_DENTAL_PRIMARY_COLOR || "#06b6d4",
    accentColor: import.meta.env.VITE_DEMO_DENTAL_ACCENT_COLOR || "#22d3ee",
    bgDark: import.meta.env.VITE_DEMO_DENTAL_BG_COLOR || "#06111a"
  },

  activeCoupons: [
    { code: "SMILECHECK", discountPercent: 100, minOrder: 0, label: "FREE 3D Digital Smile Scan & Oral Cancer Screening (Worth ₹1,500)" }
  ],

  categories: [
    "All",
    "Clear Aligners",
    "Painless Laser RCT",
    "Dental Implants",
    "Cosmetic Whitening"
  ],

  treatments: [
    {
      id: 1,
      name: "Invisible Clear Aligners (No Braces)",
      category: "Clear Aligners",
      price: 45000,
      duration: "6-12 Months Plan",
      features: ["Custom 3D Digital Smile Simulation", "Zero Food Restrictions & Removable", "US FDA Approved Medical Grade Polymer", "Free Retainers Set Included"],
      popular: true
    },
    {
      id: 2,
      name: "Painless Single-Sitting Laser RCT",
      category: "Painless Laser RCT",
      price: 4500,
      duration: "45 Mins Single Sitting",
      features: ["High-Precision Dental Microscope", "Painless WaterLase Laser Disinfection", "Zirconia Lifetime Warranty Crown Available", "Zero Post-Procedure Swelling"],
      popular: false
    },
    {
      id: 3,
      name: "Permanent Titanium Dental Implants",
      category: "Dental Implants",
      price: 22000,
      duration: "Lifetime Solution",
      features: ["Swiss-Engineered Straumann Implants", "Immediate Tooth Load Functionality", "100% Biocompatible Titanium Post", "CBCT 3D Guided Keyhole Surgery"],
      popular: false
    }
  ],

  testimonials: [
    {
      name: "Dr. Sounak Chatterjee",
      rating: 5,
      comment: "Completely painless root canal treatment done under dental microscope! Dr. Roy explained every step with live digital X-rays.",
      date: "Treated 3 Weeks Ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Arpita Banerjee",
      rating: 5,
      comment: "My clear aligners gave me a perfectly straight smile in just 7 months without any ugly metal wires. Highly recommend SmileCare!",
      date: "Treated Last Month",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    }
  ],

  faqs: [
    {
      q: "Is laser root canal treatment truly painless?",
      a: "Yes! Using our advanced WaterLase dental laser and computer-controlled local anesthesia, the procedure is 100% pain-free and eliminates postoperative discomfort."
    },
    {
      q: "What is the warranty on dental implants and crowns?",
      a: "All our Swiss Straumann dental implants come with an official International Lifetime Replacement Warranty certificate."
    }
  ]
};
