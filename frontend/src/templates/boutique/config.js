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
  hours: {
    weekdays: "11:00 AM - 8:30 PM",
    weekends: "11:00 AM - 9:00 PM",
    days: "Open 7 Days a Week"
  },
  heroImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop",

  activeCoupons: [
    { code: "COUTURE10", discountPercent: 10, minOrder: 5000, label: "10% OFF on Orders Above ₹5,000" }
  ],

  categories: [
    "All",
    "Bridal Couture",
    "Handloom Sarees",
    "Festive Pret",
    "Bespoke Tailoring"
  ],

  products: [
    {
      id: 1,
      name: "Crimson Velvet Royal Bridal Lehenga",
      category: "Bridal Couture",
      price: 45000,
      fabric: "Pure Micro Velvet with Real Zari Embroidery",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop",
      isBestseller: true,
      description: "Heavy hand-embroidered Kalidar lehenga with double organza dupatta, custom unstitched blouse piece included."
    },
    {
      id: 2,
      name: "Pure Katan Silk Banarasi Saree (Gold Kadwa)",
      category: "Handloom Sarees",
      price: 18500,
      fabric: "100% Pure Silk with Gold & Silver Zari",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop",
      isBestseller: true,
      description: "Handwoven in Varanasi using heritage Kadwa weaving technique, certified Silk Mark India guarantee."
    },
    {
      id: 3,
      name: "Pastel Mint Chanderi Anarkali Set",
      category: "Festive Pret",
      price: 8900,
      fabric: "Pure Chanderi Silk with Gotta Patti Work",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop",
      isBestseller: false,
      description: "Flowing floor-length Anarkali kurta with flared churidar and hand-painted floral organza dupatta."
    }
  ],

  testimonials: [
    {
      name: "Tanvi Ganguly (Bride)",
      rating: 5,
      comment: "My bridal lehenga was tailored to perfection! The velvet embroidery and fit were pure couture level. Got so many compliments.",
      date: "Purchased Last Month",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Dr. Suniti Mukherjee",
      rating: 5,
      comment: "Authentic Silk Mark Banarasi sarees with genuine heavy zari. Super fast delivery and video consultation assistance!",
      date: "Purchased 2 Weeks Ago",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    }
  ],

  faqs: [
    {
      q: "Do you offer custom tailoring and measurements over WhatsApp?",
      a: "Yes! Our master tailoring team can schedule a live 1-on-1 WhatsApp video measurement session to ensure your blouse, lehenga, or anarkali fits flawlessly."
    },
    {
      q: "Do you ship worldwide?",
      a: "Yes, we ship express via DHL/FedEx across the USA, UK, Canada, UAE, Australia, and worldwide with full transit insurance."
    }
  ]
};
