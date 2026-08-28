/**
 * The Artisanal Roastery & Sourdough Bakery - Production Configuration
 */
export const cafeConfig = {
  businessName: import.meta.env.VITE_DEMO_CAFE_NAME || "The Artisanal Roastery",
  businessSubtitle: "Specialty Pour-Overs, Sourdough & Rooftop Garden",
  tagline: import.meta.env.VITE_DEMO_CAFE_TAGLINE || "100% Single-Origin Estate Arabica • Fresh Stone-Baked Sourdough • High-Speed Co-Working Wi-Fi",
  city: import.meta.env.VITE_DEMO_CAFE_CITY || "Bengaluru, India",
  phone: import.meta.env.VITE_DEMO_CAFE_PHONE || "+91 98765 43211",
  whatsapp: import.meta.env.VITE_DEMO_CAFE_WHATSAPP || "919876543211",
  address: "100ft Road, Near 12th Main Junction, Indiranagar, Bengaluru - 560038",
  landmark: "Opposite Metro Pillar 142, Rooftop 3rd Floor",
  fssaiNumber: "11221002000889",
  gstNumber: "29AACCA9876E1Z4",
  hours: {
    weekdays: "7:30 AM - 11:00 PM",
    weekends: "7:00 AM - 11:45 PM",
    days: "Open 7 Days a Week"
  },
  heroImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1600&auto=format&fit=crop",
  theme: {
    primaryColor: import.meta.env.VITE_DEMO_CAFE_PRIMARY_COLOR || "#c89666",
    accentColor: import.meta.env.VITE_DEMO_CAFE_ACCENT_COLOR || "#deb887",
    bgDark: import.meta.env.VITE_DEMO_CAFE_BG_COLOR || "#0f0c09"
  },

  activeCoupons: [
    { code: "BREW10", discountPercent: 10, minOrder: 300, label: "10% OFF on Orders Above ₹300" },
    { code: "ROOFTOP20", discountPercent: 20, minOrder: 750, label: "20% OFF on Artisan Bakery Combos" }
  ],

  categories: [
    "All",
    "Specialty Brews",
    "Iced & Cold Drips",
    "Artisan Bakery",
    "Gourmet Brunch"
  ],

  seatingZones: [
    { id: "rooftop", name: "Rooftop Garden Terrace", desc: "Open-air lush greenery with evening sunset acoustic vibe" },
    { id: "cowork", name: "Quiet Co-Working Loft", desc: "300 Mbps Fibre Wi-Fi, ergonomic chairs & dual power sockets at every desk" },
    { id: "espresso-bar", name: "Live Brew Bar Counter", desc: "Interactive seat facing our master barista with cupping tasting sessions" }
  ],

  menuItems: [
    {
      id: 1,
      name: "Spanish Saffron Cortado",
      category: "Specialty Brews",
      price: 240,
      roastLevel: "Medium Roast (Chikmagalur)",
      portion: "200 ml Glass",
      isBestseller: true,
      description: "Double ristretto with micro-foamed milk infused with genuine Kashmiri saffron and cinnamon.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Cascara Cold Drip with Tonic",
      category: "Iced & Cold Drips",
      price: 280,
      roastLevel: "16-Hour Slow Steep",
      portion: "350 ml Tall Glass",
      isBestseller: true,
      description: "Slow steep single origin Coorg Arabica paired with sparkling elderflower tonic and dehydrated orange slice.",
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Almond Frangipane Butter Croissant",
      category: "Artisan Bakery",
      price: 220,
      roastLevel: "Fresh Baked Daily at 7 AM",
      portion: "1 Large Piece",
      isBestseller: true,
      description: "Flaky twice-baked French butter croissant loaded with rich vanilla almond cream and toasted flakes.",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Avocado & Truffle Sourdough Toast",
      category: "Gourmet Brunch",
      price: 360,
      roastLevel: "Organic Stone-Baked Sourdough",
      portion: "2 Large Slices",
      isBestseller: true,
      description: "Hass avocado mash on toasted organic sourdough with free-range eggs, feta crumble, and white truffle oil.",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Belgian Dark Chocolate Mocha",
      category: "Specialty Brews",
      price: 260,
      roastLevel: "Dark Chocolate & Espresso",
      portion: "250 ml Mug",
      isBestseller: false,
      description: "Rich espresso combined with Belgian 70% dark chocolate ganache, sea salt caramel, and textured whole milk.",
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 6,
      name: "Matcha Coconut Iced Latte",
      category: "Iced & Cold Drips",
      price: 290,
      roastLevel: "Ceremonial Uji Matcha",
      portion: "350 ml Tall Glass",
      isBestseller: false,
      description: "Whisked Japanese ceremonial grade green tea matcha layered over iced tender coconut water and milk.",
      image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop"
    }
  ],

  testimonials: [
    {
      name: "Aakash Varma (Tech Founder)",
      rating: 5,
      comment: "My favorite co-working spot in Indiranagar! Reliable 300 Mbps Wi-Fi, incredible cold drip, and quiet rooftop garden.",
      date: "3 Days Ago",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Sneha Sen (Designer)",
      rating: 5,
      comment: "The almond croissants and saffron cortado are unbeatable. Ordering on WhatsApp is super fast when on the go.",
      date: "Yesterday",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    }
  ],

  faqs: [
    {
      q: "Is there high-speed Wi-Fi and power outlets for co-working?",
      a: "Yes! Our entire 2nd floor and rooftop terrace have dedicated 300 Mbps dual-band fibre Wi-Fi with universal power plugs at every table."
    },
    {
      q: "Are the bakery items baked fresh in-house?",
      a: "All our sourdough loaves, baguettes, and croissants are rolled and stone-baked fresh every morning at 6:30 AM using French Normandy butter and organic flour."
    },
    {
      q: "Is the café pet-friendly?",
      a: "Yes! Our Rooftop Garden Terrace is 100% pet-friendly, and we even offer complimentary puppy treats and fresh water bowls."
    }
  ]
};
