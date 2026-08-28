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
  hours: {
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    reception: "24/7 Concierge & Front Desk"
  },
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
  ],

  testimonials: [
    {
      name: "Lord & Lady Hastings (UK)",
      rating: 5,
      comment: "A breathtaking palace experience. The private boat arrival at sunset and lakefront suite jacuzzi were pure perfection.",
      date: "Stayed Last Week",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Vikramaditya Singhania",
      rating: 5,
      comment: "Celebrated our wedding anniversary here. The butler service, candlelit lakeside dinner, and spa treatments were unforgettable.",
      date: "Stayed 2 Weeks Ago",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    }
  ],

  faqs: [
    {
      q: "Is complimentary airport pickup and private boat transfer included?",
      a: "Yes, all Heritage Suites and Presidential Villas include complimentary luxury BMW airport pickup and private electric boat arrival to the palace jetty."
    },
    {
      q: "What dining experiences are available on the property?",
      a: "We have 3 fine-dining restaurants: Sheesh Mahal (Rooftop Royal Rajasthani), The Lake Pavilion (Continental & Italian), and Sunset Saffron Bar with live instrumental music."
    }
  ]
};
