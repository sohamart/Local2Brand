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
  hours: "Mon - Sat: 9:00 AM - 8:30 PM | Sun: 10:00 AM - 2:00 PM (Emergency On-Call)",
  heroImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1600&auto=format&fit=crop",

  treatments: [
    {
      id: 1,
      name: "Invisible Clear Aligners (No Braces)",
      price: 45000,
      duration: "6-12 Months Plan",
      features: ["Custom 3D Digital Smile Simulation", "Zero Food Restrictions & Removable", "US FDA Approved Medical Grade Polymer", "Free Retainers Set Included"],
      popular: true
    },
    {
      id: 2,
      name: "Painless Single-Sitting Laser RCT",
      price: 4500,
      duration: "45 Mins Single Sitting",
      features: ["High-Precision Dental Microscope", "Painless WaterLase Laser Disinfection", "Zirconia Lifetime Warranty Crown Available", "Zero Post-Procedure Swelling"],
      popular: false
    },
    {
      id: 3,
      name: "Permanent Titanium Dental Implants",
      price: 22000,
      duration: "Lifetime Solution",
      features: ["Swiss-Engineered Straumann Implants", "Immediate Tooth Load Functionality", "100% Biocompatible Titanium Post", "CBCT 3D Guided Keyhole Surgery"],
      popular: false
    }
  ]
};
