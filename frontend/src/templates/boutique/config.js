/**
 * Vogue & Thread Designer Boutique & Couture - Production Configuration
 */
export const boutiqueConfig = {
  businessName: import.meta.env.VITE_DEMO_BOUTIQUE_NAME || "Vogue & Thread Designer Couture",
  businessSubtitle: "Handloom Banarasi Sarees, Bridal Lehengas & Bespoke Tailoring",
  tagline: import.meta.env.VITE_DEMO_BOUTIQUE_TAGLINE || "Authentic Katan Silk • Zardozi Hand Embroidery • Custom Sizing & Worldwide Shipping",
  city: import.meta.env.VITE_DEMO_BOUTIQUE_CITY || "Kolkata / Varanasi / Delhi",
  phone: import.meta.env.VITE_DEMO_BOUTIQUE_PHONE || "+91 98765 43217",
  whatsapp: import.meta.env.VITE_DEMO_BOUTIQUE_WHATSAPP || "919876543217",
  address: "Park Street Galleria, 2nd Floor, Kolkata - 700016",
  hours: "Mon - Sat: 11:00 AM - 8:30 PM",
  heroImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop",

  activeCoupons: [
    { code: "COUTURE10", discountPercent: 10, minOrder: 5000, label: "10% OFF on Orders Above ₹5,000" }
  ],

  products: [
    {
      id: 1,
      name: "Crimson Velvet Royal Bridal Lehenga",
      category: "Bridal Couture",
      price: 45000,
      fabric: "Pure Micro Velvet with Real Zari Embroidery",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop",
      description: "Heavy hand-embroidered Kalidar lehenga with double organza dupatta, custom unstitched blouse piece included."
    },
    {
      id: 2,
      name: "Pure Katan Silk Banarasi Saree (Gold Kadwa)",
      category: "Handloom Sarees",
      price: 18500,
      fabric: "100% Pure Silk with Gold & Silver Zari",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop",
      description: "Handwoven in Varanasi using heritage Kadwa weaving technique, certified Silk Mark India guarantee."
    },
    {
      id: 3,
      name: "Pastel Mint Chanderi Anarkali Set",
      category: "Festive Pret",
      price: 8900,
      fabric: "Pure Chanderi Silk with Gotta Patti Work",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop",
      description: "Flowing floor-length Anarkali kurta with flared churidar and hand-painted floral organza dupatta."
    }
  ]
};
