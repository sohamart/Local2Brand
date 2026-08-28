/**
 * Karat Royale Heritage Gold & Solitaire Atelier - Production Configuration
 */
export const jewelleryConfig = {
  businessName: import.meta.env.VITE_DEMO_JEWELLERY_NAME || "Karat Royale Fine Jewellery",
  businessSubtitle: "22K BIS Hallmarked Gold, Solitaire Diamonds & Kundan Polki",
  tagline: import.meta.env.VITE_DEMO_JEWELLERY_TAGLINE || "100% Certified IGI Diamonds • Transparent Live Gold Rates • Bespoke Bridal Atelier",
  city: import.meta.env.VITE_DEMO_JEWELLERY_CITY || "Mumbai / Jaipur / Surat",
  phone: import.meta.env.VITE_DEMO_JEWELLERY_PHONE || "+91 98765 43220",
  whatsapp: import.meta.env.VITE_DEMO_JEWELLERY_WHATSAPP || "919876543220",
  address: "Zaveri Bazaar Flagship / Gold Souk Mall, Mumbai - 400002",
  hours: "Mon - Sat: 11:00 AM - 8:30 PM",
  heroImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop",

  liveGoldRate: {
    gold22k: "₹6,850 / gm",
    gold24k: "₹7,470 / gm",
    silver: "₹88 / gm"
  },

  products: [
    {
      id: 1,
      name: "The Nizam Kundan Polki Bridal Choker Set",
      category: "Bridal Heritage",
      price: "₹3,45,000",
      purity: "22K BIS Gold (916) with Uncut Polki",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      description: "Royal Jadau handcrafted choker necklace featuring natural Zambian emerald drops and South Sea pearls."
    },
    {
      id: 2,
      name: "Solitaire Halo Diamond Engagement Ring (1.5 Ct)",
      category: "Solitaire Diamonds",
      price: "₹1,85,000",
      purity: "IGI Certified VVS1 Clarity • E Color",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
      description: "Brilliant cut center solitaire encased in a sparkling pavé halo setting in 18K rose gold."
    },
    {
      id: 3,
      name: "Temple Antique Goddess Lakshmi Kadas (Pair)",
      category: "Temple Gold",
      price: "₹2,10,000",
      purity: "22K Yellow Gold (Weight: 32g)",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
      description: "Traditional South Indian Nakshi nakas work with intricate filigree and ruby accents."
    }
  ]
};
