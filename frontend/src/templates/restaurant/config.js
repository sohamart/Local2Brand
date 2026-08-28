/**
 * Royal Saffron Mughlai & Fine Dining - Production Sellable Website Configuration
 * Fully customizable for any restaurant, cloud kitchen, café, or bar.
 */
export const restaurantConfig = {
  businessName: import.meta.env.VITE_DEMO_RESTAURANT_NAME || "Royal Saffron",
  businessSubtitle: "Grand Mughlai, Awadhi Dum & Tandoor",
  tagline: import.meta.env.VITE_DEMO_RESTAURANT_TAGLINE || "An Authentic Royal Culinary Journey • Charcoal Simmered Since 1994",
  city: import.meta.env.VITE_DEMO_RESTAURANT_CITY || "Mumbai, India",
  phone: import.meta.env.VITE_DEMO_RESTAURANT_PHONE || "+91 98765 43210",
  whatsapp: import.meta.env.VITE_DEMO_RESTAURANT_WHATSAPP || "919876543210",
  address: "Heritage Grand Galleria, Linking Road, Bandra West, Mumbai - 400050",
  landmark: "Opposite National Park Gate, 5 Mins from Metro Station",
  deliveryRadius: "Delivering across Mumbai within 8 km (Free delivery on orders above ₹799)",
  hours: {
    lunch: "12:30 PM - 3:45 PM",
    dinner: "7:00 PM - 11:45 PM",
    days: "Open 7 Days a Week"
  },
  heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop",
  fssaiNumber: "11521018000456",
  gstNumber: "27AAACR1234F1Z5",

  activeCoupons: [
    { code: "ROYAL10", discountPercent: 10, minOrder: 500, label: "10% OFF on Orders Above ₹500" },
    { code: "FEAST20", discountPercent: 20, minOrder: 1500, label: "20% OFF on Family Feasts above ₹1,500" }
  ],

  categories: [
    "All",
    "Biryani & Rice",
    "Kebabs & Starters",
    "Royal Curries",
    "Tandoori Breads",
    "Desserts & Drinks"
  ],

  seatingZones: [
    { id: "royal-ac", name: "Royal AC Dining Hall", desc: "Plush velvet seating with traditional live instrumental sitar" },
    { id: "rooftop", name: "Rooftop Starlight Terrace", desc: "Open-air romantic ambience with panoramic skyline views" },
    { id: "pdr", name: "Private VIP Dining Cabin", desc: "Dedicated royal butler service for family & corporate parties (8-16 guests)" }
  ],

  menuItems: [
    {
      id: 1,
      name: "Dum Handi Gosht Biryani",
      category: "Biryani & Rice",
      price: 490,
      isVeg: false,
      isBestseller: true,
      portion: "Serves 1-2 (750g)",
      prepTime: "25 Mins",
      description: "Slow-cooked aromatic aged basmati rice layered with tender baby goat meat, saffron kewra milk, and roasted dry fruits in a sealed clay handi.",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Murgh Awadhi Dum Biryani",
      category: "Biryani & Rice",
      price: 390,
      isVeg: false,
      isBestseller: true,
      portion: "Serves 1-2 (750g)",
      prepTime: "20 Mins",
      description: "Succulent chicken thighs slow-infused with whole garam masala, caramelized onions, and royal saffron broth, served with burani raita.",
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Shahi Galouti Kebab (4 Pcs)",
      category: "Kebabs & Starters",
      price: 440,
      isVeg: false,
      isBestseller: true,
      portion: "4 Pieces + 2 Ulta Tawa Paratha",
      prepTime: "15 Mins",
      description: "Melt-in-mouth smoked minced lamb patties infused with 32 secret Lucknowi spices, pan-seared in desi ghee and served with mint chutney.",
      image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Murgh Malai Tikka Angara",
      category: "Kebabs & Starters",
      price: 380,
      isVeg: false,
      isBestseller: false,
      portion: "6 Pieces",
      prepTime: "15 Mins",
      description: "Boneless chicken marinated in hung curd, cashew paste, green cardamom, and cream, grilled over live charcoal tandoor.",
      image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Dahi Ke Kebab (V)",
      category: "Kebabs & Starters",
      price: 320,
      isVeg: true,
      isBestseller: true,
      portion: "6 Pieces",
      prepTime: "12 Mins",
      description: "Crisp golden patties filled with creamy spiced hung curd, bell peppers, fresh coriander, and roasted cumin.",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 6,
      name: "Murgh Begum Pasand (Butter Chicken)",
      category: "Royal Curries",
      price: 420,
      isVeg: false,
      isBestseller: true,
      portion: "500 ml Bowl",
      prepTime: "20 Mins",
      description: "Tandoori shredded chicken simmered in a velvety, buttery satin tomato gravy scented with kasuri methi and honey.",
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 7,
      name: "Dal Saffron (Slow Cooked 24h)",
      category: "Royal Curries",
      price: 310,
      isVeg: true,
      isBestseller: true,
      portion: "500 ml Bowl",
      prepTime: "10 Mins",
      description: "Our signature black urad lentils slow-cooked overnight for 24 hours on coal embers with country butter and cream.",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 8,
      name: "Paneer Lababdar",
      category: "Royal Curries",
      price: 360,
      isVeg: true,
      isBestseller: false,
      portion: "500 ml Bowl",
      prepTime: "15 Mins",
      description: "Soft malai paneer cubes tossed with grated cottage cheese in a rich, chunky tomato-cashew masala.",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 9,
      name: "Butter Garlic Naan",
      category: "Tandoori Breads",
      price: 85,
      isVeg: true,
      isBestseller: true,
      portion: "1 Piece",
      prepTime: "5 Mins",
      description: "Traditional refined flour leavened bread topped with minced garlic, fresh coriander, and melted Amul butter.",
      image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 10,
      name: "Khamiri Roti (Mughlai Classic)",
      category: "Tandoori Breads",
      price: 65,
      isVeg: true,
      isBestseller: false,
      portion: "1 Piece",
      prepTime: "5 Mins",
      description: "Thick, soft, yeast-leavened whole wheat bread baked against the clay walls of the tandoor.",
      image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 11,
      name: "Royal Shahi Tukda with Kesar Rabri",
      category: "Desserts & Drinks",
      price: 220,
      isVeg: true,
      isBestseller: true,
      portion: "2 Pieces",
      prepTime: "10 Mins",
      description: "Ghee-crisped golden bread soaked in fragrant cardamom saffron syrup, smothered with thick rabri and pistachios.",
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 12,
      name: "Rooh Afza & Rose Petal Lassi",
      category: "Desserts & Drinks",
      price: 160,
      isVeg: true,
      isBestseller: false,
      portion: "350 ml Tall Glass",
      prepTime: "5 Mins",
      description: "Thick churned creamy yogurt infused with rose essence, organic petals, and roasted crushed almonds.",
      image: "https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=600&auto=format&fit=crop"
    }
  ],

  testimonials: [
    {
      name: "Chef Kunal Kapur (Food Critic)",
      rating: 5,
      comment: "The Dum Handi Gosht Biryani has that authentic Awadhi aroma that is rare to find today. Melt in mouth kebabs!",
      date: "Visited Last Week",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Rohit & Meera Sharma",
      rating: 5,
      comment: "Celebrated our 10th wedding anniversary in the Private Dining Cabin. The hospitality and Galouti Kebabs were five-star.",
      date: "2 Days Ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Ananya Deshmukh",
      rating: 5,
      comment: "Super fast WhatsApp ordering! The packaging was hot, sealed handi with fresh raita delivered in 30 mins.",
      date: "Yesterday",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    }
  ],

  faqs: [
    {
      q: "How does online WhatsApp ordering work?",
      a: "Simply browse our digital menu, tap '+ Add to Cart' on your favorite dishes, and click 'Place Order on WhatsApp'. An itemized bill with your delivery address is instantly sent to our kitchen team for immediate cooking and live dispatch tracking!"
    },
    {
      q: "Do you cater for outdoor parties and corporate events?",
      a: "Yes! We cater for intimate gatherings (20+ guests) to grand weddings (500+ guests) with live tandoor and handi stations. Message us on WhatsApp for custom party menus."
    },
    {
      q: "Is there valet parking available for dine-in?",
      a: "Yes, we offer complimentary valet parking for all our guests at our Heritage Grand Galleria porch."
    },
    {
      q: "Are the meats 100% Halal and fresh?",
      a: "Yes, all our meats are 100% certified Halal, freshly procured daily, and marinated with pure natural spices with zero artificial colors or MSG."
    }
  ]
};
