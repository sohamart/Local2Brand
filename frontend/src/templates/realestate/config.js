/**
 * Prime Haven Luxury Realty - Production Configuration
 */
export const realEstateConfig = {
  businessName: import.meta.env.VITE_DEMO_REALESTATE_NAME || "Prime Haven Luxury Realty",
  businessSubtitle: "RERA-Approved Penthouses, Sea-Facing Villas & High-ROI Commercial",
  tagline: import.meta.env.VITE_DEMO_REALESTATE_TAGLINE || "100% Clear Title Verification • Zero Brokerage on New Developments • Private VIP Site Visits",
  city: import.meta.env.VITE_DEMO_REALESTATE_CITY || "Mumbai & Pune, India",
  phone: import.meta.env.VITE_DEMO_REALESTATE_PHONE || "+91 98765 43215",
  whatsapp: import.meta.env.VITE_DEMO_REALESTATE_WHATSAPP || "919876543215",
  address: "One BKC, 12th Floor, G-Block, Bandra Kurla Complex, Mumbai - 400051",
  hours: {
    weekdays: "9:30 AM - 7:30 PM",
    weekends: "10:00 AM - 6:00 PM",
    days: "Open 7 Days for Site Visits"
  },
  heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop",
  theme: {
    primaryColor: import.meta.env.VITE_DEMO_REALESTATE_PRIMARY_COLOR || "#10b981",
    accentColor: import.meta.env.VITE_DEMO_REALESTATE_ACCENT_COLOR || "#34d399",
    bgDark: import.meta.env.VITE_DEMO_REALESTATE_BG_COLOR || "#080d17"
  },

  activeCoupons: [
    { code: "ZEROBROKERAGE", discountPercent: 0, minOrder: 0, label: "0% Brokerage & Free Stamp Duty Assistance on First 5 Bookings" }
  ],

  categories: [
    "All",
    "Penthouses",
    "Sea-Facing Villas",
    "Smart High-Rise",
    "Commercial Suites"
  ],

  properties: [
    {
      id: 1,
      title: "The Sky Penthouse at Worli Sea Face",
      category: "Penthouses",
      location: "Worli, South Mumbai",
      price: "₹18.5 Cr",
      bhk: "4 BHK Duplex",
      carpetArea: "3,850 sq.ft",
      status: "Ready to Move",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop",
      highlights: ["Unobstructed 180° Arabian Sea View", "Private Sky Deck & Plunge Pool", "4 Covered Reserved Car Parks", "RERA Reg: P51900024510"]
    },
    {
      id: 2,
      title: "Serene Meadow Luxury Hill Villa",
      category: "Sea-Facing Villas",
      location: "Khandala / Lonavala",
      price: "₹6.8 Cr",
      bhk: "5 BHK Villa",
      carpetArea: "5,200 sq.ft Plot",
      status: "Under Construction (Possession Dec 2026)",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
      highlights: ["Private Infinity Pool & Lawn", "Italian Marble Flooring Throughout", "Gated Ultra-Luxury Community", "RERA Reg: P52100038920"]
    },
    {
      id: 3,
      title: "The Crest Smart Residences",
      category: "Smart High-Rise",
      location: "Bandra West, Mumbai",
      price: "₹4.2 Cr",
      bhk: "3 BHK Premium",
      carpetArea: "1,450 sq.ft",
      status: "Ready to Move",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop",
      highlights: ["Automated IoT Home Automation", "Rooftop Clubhouse & Gym", "5 Mins from Bandra-Worli Sea Link", "RERA Reg: P51800019230"]
    }
  ],

  testimonials: [
    {
      name: "Siddharth Oberoi (Managing Director)",
      rating: 5,
      comment: "Prime Haven helped me acquire my dream Worli penthouse completely hassle-free. Transparent title check and private site tour!",
      date: "Purchased Last Month",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Meera & Rajesh Kulkarni",
      rating: 5,
      comment: "Zero brokerage and complete legal documentation handled end-to-end for our Bandra luxury apartment.",
      date: "Purchased 2 Months Ago",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    }
  ],

  faqs: [
    {
      q: "Are all listed properties RERA approved and legally verified?",
      a: "Yes, every single development in our portfolio has verified RERA registration certificates and undergoes 40-point legal title due diligence by our senior real estate counsel."
    },
    {
      q: "How does the VIP Chauffeur Site Visit work?",
      a: "We arrange a private luxury executive car pickup from your residence to escort you and your family for a guided tour of the model apartment and amenities."
    }
  ]
};
