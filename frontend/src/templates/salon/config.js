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
  hours: {
    weekdays: "10:00 AM - 9:00 PM",
    weekends: "9:30 AM - 9:30 PM",
    days: "Open 7 Days a Week"
  },
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

  stylistTiers: [
    { id: "director", name: "Artistic Creative Director", desc: "12+ Years celebrity fashion styling & advanced color correction" },
    { id: "senior", name: "Senior Master Stylist", desc: "8+ Years L'Oréal & Toni&Guy certified balayage specialist" },
    { id: "skin-expert", name: "Certified Medi-Cosmetologist", desc: "HydraFacial MD certified aesthetician & skin therapist" }
  ],

  services: [
    {
      id: 1,
      name: "Custom Balayage & Olaplex Reconstruction",
      category: "Hair & Balayage",
      price: 4500,
      duration: "150 Mins",
      rating: "4.9 ★ (120+ reviews)",
      isBestseller: true,
      description: "Hand-painted dimensional blonde, caramel, or mocha balayage with Olaplex No. 1 & 2 bond repairing therapy.",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Keratin Protein Smoothening & Gloss",
      category: "Hair & Balayage",
      price: 3800,
      duration: "120 Mins",
      rating: "4.8 ★ (95+ reviews)",
      isBestseller: false,
      description: "Formaldehyde-free Brazilian keratin treatment for mirror-shine frizz-free hair for up to 5 months.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "7-Step Hydra-Infusion Medi-Facial",
      category: "Advanced Medi-Facials",
      price: 3200,
      duration: "75 Mins",
      rating: "5.0 ★ (180+ reviews)",
      isBestseller: true,
      description: "Deep vortex vacuum extraction, lactic acid peel, hyaluronic serum infusion, and cryo cold globe massage.",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "24K Gold Collagen Radiance Facial",
      category: "Advanced Medi-Facials",
      price: 2600,
      duration: "60 Mins",
      rating: "4.9 ★ (70+ reviews)",
      isBestseller: false,
      description: "Pure 24-karat gold leaf mask infused with botanical peptides for instant wedding and red-carpet glow.",
      image: "https://images.unsplash.com/photo-1512290900672-1f03f39a0fa0?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Russian E-File Gel Extensions & Chrome Art",
      category: "Nails & Lashes",
      price: 2200,
      duration: "90 Mins",
      rating: "4.9 ★ (110+ reviews)",
      isBestseller: true,
      description: "Dry electric-file cuticle cleanup with sculpted builder gel extensions and high-gloss chrome powder finish.",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 6,
      name: "Signature HD Airbrush Bridal Makeover",
      category: "Bridal & Glam",
      price: 18000,
      duration: "180 Mins",
      rating: "5.0 ★ (85+ reviews)",
      isBestseller: true,
      description: "Full luxury bridal airbrush makeup with mink lashes, custom hair styling, saree/lehenga draping & jewelry setting.",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop"
    }
  ],

  testimonials: [
    {
      name: "Rhea Singhania (Fashion Influencer)",
      rating: 5,
      comment: "Aura Luxe is my go-to for hair coloring in Delhi! The balayage came out so natural and healthy without any damage.",
      date: "Visited 4 Days Ago",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Pooja Malhotra (Bride)",
      rating: 5,
      comment: "Booked my bridal makeup and spa package. The team was punctual, calm, and made me look like a dream on my D-Day!",
      date: "1 Week Ago",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    }
  ],

  faqs: [
    {
      q: "Do I need to book in advance for hair coloring and balayage?",
      a: "Yes, we recommend booking at least 24-48 hours in advance to secure your preferred Senior Master Stylist for thorough consultation and customized formulation."
    },
    {
      q: "Are the products used safe and formaldehyde-free?",
      a: "100%! We only use authentic imported L'Oréal Professionnel, Kérastase, Olaplex, and HydraFacial MD serums with zero harsh toxic chemicals."
    },
    {
      q: "Do you offer pre-bridal trials for makeup and hairstyles?",
      a: "Yes! Full bridal packages include a complimentary consultation and airbrush trial session at our GK-II studio."
    }
  ]
};
