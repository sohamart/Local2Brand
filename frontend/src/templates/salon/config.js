/**
 * Aura Luxe Unisex Salon & Aesthetic Spa - Production Configuration
 */
export const salonConfig = {
  businessName: import.meta.env.VITE_DEMO_SALON_NAME || "Aura Luxe Unisex Salon & Spa",
  businessSubtitle: "Celebrity Hair Styling, Medi-Facials & Bridal Studio",
  tagline: import.meta.env.VITE_DEMO_SALON_TAGLINE || "Advanced Olaplex Treatments • Hydra-Infusion Skin Glow • Bespoke Airbrush Bridal Makeovers",
  city: import.meta.env.VITE_DEMO_SALON_CITY || "Delhi NCR / Mumbai, India",
  phone: import.meta.env.VITE_DEMO_SALON_PHONE || "+91 98765 43212",
  whatsapp: import.meta.env.VITE_DEMO_SALON_WHATSAPP || "919876543212",
  address: "M-Block Market, Greater Kailash II, New Delhi - 110048",
  landmark: "Next to Starbucks, 2nd & 3rd Floor Luxury Studio",
  hours: "Mon - Sun: 10:00 AM - 9:00 PM (Appointments Preferred)",
  heroImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop",

  activeCoupons: [
    { code: "GLOW15", discountPercent: 15, minOrder: 1500, label: "15% OFF on Medi-Facial Combos above ₹1,500" },
    { code: "BRIDAL20", discountPercent: 20, minOrder: 10000, label: "20% OFF on Full Bridal Package Advance Bookings" }
  ],

  categories: [
    "All",
    "Hair & Balayage",
    "Advanced Medi-Facials",
    "Nails & Lashes",
    "Bridal & Glam"
  ],

  services: [
    {
      id: 1,
      name: "Custom Balayage & Olaplex Reconstruction",
      category: "Hair & Balayage",
      price: 4500,
      duration: "150 Mins",
      rating: "4.9 ★ (120+ reviews)",
      description: "Hand-painted dimensional blonde, caramel, or mocha balayage with Olaplex No. 1 & 2 bond repairing therapy."
    },
    {
      id: 2,
      name: "Keratin Protein Smoothening & Gloss",
      category: "Hair & Balayage",
      price: 3800,
      duration: "120 Mins",
      rating: "4.8 ★ (95+ reviews)",
      description: "Formaldehyde-free Brazilian keratin treatment for mirror-shine frizz-free hair for up to 5 months."
    },
    {
      id: 3,
      name: "7-Step Hydra-Infusion Medi-Facial",
      category: "Advanced Medi-Facials",
      price: 3200,
      duration: "75 Mins",
      rating: "5.0 ★ (180+ reviews)",
      description: "Deep vortex vacuum extraction, lactic acid peel, hyaluronic serum infusion, and cryo cold globe massage."
    },
    {
      id: 4,
      name: "24K Gold Collagen Radiance Facial",
      category: "Advanced Medi-Facials",
      price: 2600,
      duration: "60 Mins",
      rating: "4.9 ★ (70+ reviews)",
      description: "Pure 24-karat gold leaf mask infused with botanical peptides for instant wedding and red-carpet glow."
    },
    {
      id: 5,
      name: "Russian E-File Gel Extensions & Chrome Art",
      category: "Nails & Lashes",
      price: 2200,
      duration: "90 Mins",
      rating: "4.9 ★ (110+ reviews)",
      description: "Dry electric-file cuticle cleanup with sculpted builder gel extensions and high-gloss chrome powder finish."
    },
    {
      id: 6,
      name: "Signature HD Airbrush Bridal Makeover",
      category: "Bridal & Glam",
      price: 18000,
      duration: "180 Mins",
      rating: "5.0 ★ (85+ reviews)",
      description: "Full luxury bridal airbrush makeup with mink lashes, custom hair styling, saree/lehenga draping & jewelry setting."
    }
  ],

  testimonials: [
    {
      name: "Rhea Singhania (Fashion Influencer)",
      comment: "Aura Luxe is my go-to for hair coloring in Delhi! The balayage came out so natural and healthy without any damage.",
      rating: 5
    },
    {
      name: "Pooja Malhotra (Bride)",
      comment: "Booked my bridal makeup and spa package. The team was punctual, calm, and made me look like a dream on my D-Day!",
      rating: 5
    }
  ]
};
