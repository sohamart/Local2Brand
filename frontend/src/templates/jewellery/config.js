/**
 * Aurum & Carats Heritage Gold & Diamond Atelier - Production Configuration
 */
export const jewelleryConfig = {
  businessName: import.meta.env.VITE_DEMO_JEWELLERY_NAME || "Aurum & Carats Heritage Atelier",
  businessSubtitle: "100% BIS 916 Hallmarked Gold, IGI Certified Solitaires & Polki",
  tagline: import.meta.env.VITE_DEMO_JEWELLERY_TAGLINE || "Zero Making Charges on Selected Gold Jewellery • Live Bullion Exchange Rates • Private VIP Bridal Viewing Lounge",
  city: import.meta.env.VITE_DEMO_JEWELLERY_CITY || "Kolkata / Mumbai / Jaipur",
  phone: import.meta.env.VITE_DEMO_JEWELLERY_PHONE || "+91 98765 43220",
  whatsapp: import.meta.env.VITE_DEMO_JEWELLERY_WHATSAPP || "919876543220",
  address: "Heritage Jewellers Row, Camac Street, Kolkata - 700016",
  hours: {
    weekdays: "10:30 AM - 8:30 PM",
    sunday: "11:00 AM - 7:00 PM",
    days: "Open 7 Days a Week"
  },
  heroImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop",
  theme: {
    primaryColor: import.meta.env.VITE_DEMO_JEWELLERY_PRIMARY_COLOR || "#d4af37",
    accentColor: import.meta.env.VITE_DEMO_JEWELLERY_ACCENT_COLOR || "#f3e5ab",
    bgDark: import.meta.env.VITE_DEMO_JEWELLERY_BG_COLOR || "#0a0805"
  },

  liveGoldRate: {
    gold22k: "₹6,850 / gm",
    gold24k: "₹7,470 / gm",
    silver: "₹92 / gm",
    lastUpdated: "Today 10:00 AM (MCX Live)"
  },

  activeCoupons: [
    { code: "GOLDZERO", discountPercent: 0, minOrder: 0, label: "0% Making Charges on Diamond Solitaire Rings & Polki Sets" }
  ],

  categories: [
    "All",
    "Bridal Chokers",
    "Solitaire Diamond Rings",
    "Temple Gold Bangles",
    "Polki & Jadau"
  ],

  items: [
    {
      id: 1,
      name: "The Royal Nizam Jadau Kundan Choker",
      category: "Bridal Chokers",
      weight: "68.5 gms (22K Gold)",
      price: 520000,
      hallmark: "BIS 916 & IGI Certified",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      isBestseller: true,
      description: "Handcrafted 22K antique finish gold choker studded with uncut syndicate polki diamonds and Zambian emerald beads."
    },
    {
      id: 2,
      name: "1.50 Carat VVS-E Solitaire Diamond Ring",
      category: "Solitaire Diamond Rings",
      weight: "4.2 gms (18K White Gold)",
      price: 245000,
      hallmark: "IGI Certified Hearts & Arrows",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
      isBestseller: true,
      description: "Triple excellent cut natural solitaire diamond set in 6-prong platinum & 18K white gold cathedral band."
    },
    {
      id: 3,
      name: "Heritage Lakshmi Temple Gold Kadas (Pair)",
      category: "Temple Gold Bangles",
      weight: "52.0 gms (22K Pure Gold)",
      price: 395000,
      hallmark: "BIS 916 HUID Laser Inscribed",
      image: "https://images.unsplash.com/photo-1611591475155-4284ec28d351?q=80&w=600&auto=format&fit=crop",
      isBestseller: false,
      description: "Intricate handcrafted Nakshi temple work featuring Goddess Lakshmi motifs with ruby cabochons."
    }
  ],

  testimonials: [
    {
      name: "Radhika Goenka",
      rating: 5,
      comment: "Ordered our complete bridal wedding jewellery set from Aurum & Carats. Flawless HUID BIS hallmarking and zero making charges on diamonds!",
      date: "Purchased Last Month",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Anil Singhania",
      rating: 5,
      comment: "Live gold rates, complete weight transparency, and a luxurious private viewing lounge for bridal fittings.",
      date: "Purchased 2 Weeks Ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    }
  ],

  faqs: [
    {
      q: "Are all jewellery pieces BIS 916 Hallmarked with HUID?",
      a: "Yes! Every single gold ornament comes with government-mandated 6-digit laser HUID (Hallmark Unique Identification) and digital authenticity certificates."
    },
    {
      q: "Do you offer old gold exchange and valuation?",
      a: "We offer 100% value gold exchange based on computerized German XRF Karatmeter purity testing with zero deduction on gold weight."
    }
  ]
};
