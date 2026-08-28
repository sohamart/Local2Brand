/**
 * The Grand Mirage Luxury Palace & Resort - Production Configuration
 */
export const hotelConfig = {
  businessName: import.meta.env.VITE_DEMO_HOTEL_NAME || "The Grand Mirage Palace & Spa",
  businessSubtitle: "5-Star Heritage Lakefront Suites & Infinity Pool",
  tagline: import.meta.env.VITE_DEMO_HOTEL_TAGLINE || "Overlooking Serene Waters • Royal Butler Concierge • Private Plunge Pools & Ayurvedic Spa",
  city: import.meta.env.VITE_DEMO_HOTEL_CITY || "Udaipur / Goa / Jaipur",
  phone: import.meta.env.VITE_DEMO_HOTEL_PHONE || "+91 98765 43214",
  whatsapp: import.meta.env.VITE_DEMO_HOTEL_WHATSAPP || "919876543214",
  address: "Haridas Ji Ki Magri, Lake Pichola Waterfront, Udaipur - 313001",
  landmark: "Private Jetty Transfer Available from City Center",
  hours: "24/7 Front Desk & Concierge Services",
  heroImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",

  activeCoupons: [
    { code: "STAYROYAL", discountPercent: 15, minOrder: 10000, label: "15% OFF on 2+ Nights Weekend Getaways" }
  ],

  rooms: [
    {
      id: 1,
      name: "Royal Lakefront Heritage Suite",
      price: 14500,
      size: "850 sq.ft",
      capacity: "2 Adults + 1 Child",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop",
      amenities: ["Private Balcony over Lake", "King Feather Bed", "Marble Jacuzzi Bathtub", "Complimentary High-Tea", "24/7 Royal Butler"]
    },
    {
      id: 2,
      name: "Presidential Plunge Pool Villa",
      price: 24000,
      size: "1,400 sq.ft",
      capacity: "4 Adults (2 Bedrooms)",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop",
      amenities: ["Private Heated Plunge Pool", "Dual Master Bedrooms", "Private Dining Courtyard", "Chauffeur Airport Pickup", "Ayurvedic Spa Pass"]
    },
    {
      id: 3,
      name: "Courtyard Garden Deluxe Room",
      price: 8500,
      size: "550 sq.ft",
      capacity: "2 Adults",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600&auto=format&fit=crop",
      amenities: ["Garden View Sitout", "Rain Shower", "Smart TV & Minibar", "Breakfast Buffet Included"]
    }
  ]
};
