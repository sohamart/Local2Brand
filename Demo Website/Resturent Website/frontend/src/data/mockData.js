// Multi-Tenant Mock Dataset for GourmetOS

export const RESTAURANTS = [
  {
    id: 'rest-001',
    name: 'The Royal Spice',
    slug: 'royal-spice',
    tagline: 'Imperial Flavors & Heritage Gastronomy',
    description: 'An opulent journey through age-old royal recipes, authentic wood-smoked kebabs, aromatic dum biryanis, and rare culinary traditions.',
    logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80',
    heroImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Royal Indian', 'Awadhi', 'Mughlai', 'Tandoor'],
    rating: 4.9,
    reviewCount: 428,
    currency: '₹',
    currencyCode: 'INR',
    phone: '+91 98765 43210',
    email: 'concierge@royalspice.com',
    address: 'Palace Road, Regal Heritage Enclave, South Delhi, India',
    openingHours: '12:00 PM – 11:30 PM Everyday',
    theme: {
      template: 'luxury',
      primary: '#e63946',
      secondary: '#dfa645',
      accent: '#2a9d8f',
      fontHeading: 'Playfair Display',
      fontBody: 'Outfit',
      borderRadius: '18px',
      heroLayout: 'cinematic-split'
    },
    sections: {
      hero: { enabled: true, title: 'Epicurean Grandeur of the Royals', subtitle: 'Indulge in time-honored Nawabi delicacies curated with pure saffron, silver vark, and ancient wood-fire alchemy.' },
      specials: { enabled: true, title: "Chef's Signature Degustation", subtitle: 'Masterpieces crafted exclusively for tonight by our royal ustad chefs.' },
      story: { enabled: true, title: 'A Legacy of Royal Hospitality' },
      offers: { enabled: true, title: 'Privilege Club Offers & Feasts' },
      reviews: { enabled: true, title: 'Patron Acclaim & Royal Chronicles' },
      reservation: { enabled: true, title: 'Reserve Your Royal Banquet Table' }
    }
  },
  {
    id: 'rest-002',
    name: 'Bella Italia Ristorante',
    slug: 'bella-italia',
    tagline: 'Artisan Wood-Fired & Authentic Italian Trattoria',
    description: 'Rustic trattoria experience serving 72-hour fermented sourdough Neapolitan pizzas, handcrafted egg pastas, and Amalfi coastal seafood.',
    logo: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=1600&auto=format&fit=crop&q=80',
    heroImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Neapolitan Pizza', 'Handmade Pasta', 'Tuscan Grill', 'Dolci'],
    rating: 4.8,
    reviewCount: 312,
    currency: '₹',
    currencyCode: 'INR',
    phone: '+91 98111 22334',
    email: 'ciao@bellaitalia.com',
    address: 'Boutique Boulevard, Indiranagar, Bengaluru, India',
    openingHours: '12:30 PM – 11:00 PM (Closed Mondays)',
    theme: {
      template: 'modern',
      primary: '#d90429',
      secondary: '#2b9348',
      accent: '#ffb703',
      fontHeading: 'Plus Jakarta Sans',
      fontBody: 'Plus Jakarta Sans',
      borderRadius: '16px',
      heroLayout: 'full-width-overlay'
    },
    sections: {
      hero: { enabled: true, title: 'Authentic Neapolitan Mastery', subtitle: 'Wood-fired pizzas with San Marzano tomatoes, fresh Fior di Latte, and cold-pressed EVOO.' },
      specials: { enabled: true, title: "Pizzaiolo's Daily Specials" },
      story: { enabled: true, title: 'From Napoli to Your Plate' },
      offers: { enabled: true, title: 'Aperitivo & Feast Combos' },
      reviews: { enabled: true, title: 'Guest Testimonials' },
      reservation: { enabled: true, title: 'Book an Intimate Dining Experience' }
    }
  },
  {
    id: 'rest-003',
    name: 'Zenith Bistro & Lounge',
    slug: 'zenith-bistro',
    tagline: 'Modern European & Avant-Garde Gastronomy',
    description: 'High-concept culinary artistry featuring molecular textures, botanical cocktails, and farm-to-fork seasonal tasting menus.',
    logo: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&auto=format&fit=crop&q=80',
    heroImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Modern European', 'Molecular', 'Seafood', 'Cocktail Bar'],
    rating: 4.95,
    reviewCount: 519,
    currency: '₹',
    currencyCode: 'INR',
    phone: '+91 99000 88776',
    email: 'vip@zenithbistro.com',
    address: 'Rooftop 24, Cyber City Skyline, Gurugram, India',
    openingHours: '05:00 PM – 01:00 AM (Dinner Only)',
    theme: {
      template: 'minimal',
      primary: '#0ea5e9',
      secondary: '#f59e0b',
      accent: '#6366f1',
      fontHeading: 'Cinzel',
      fontBody: 'Outfit',
      borderRadius: '24px',
      heroLayout: 'minimal-centered'
    },
    sections: {
      hero: { enabled: true, title: 'Culinary Art Meets Sky-High Luxury', subtitle: 'An unforgettable multisensory evening over panoramic city skyline views.' },
      specials: { enabled: true, title: 'Tasting Degustation Sequence' },
      story: { enabled: true, title: 'Philosophy of Avant-Garde' },
      offers: { enabled: true, title: 'VIP Membership Privileges' },
      reviews: { enabled: true, title: 'Critic Accolades' },
      reservation: { enabled: true, title: 'Reserve Skyline Lounge Seating' }
    }
  }
];

export const CATEGORIES = [
  { id: 'cat-1', restaurantId: 'rest-001', name: 'Royal Dum Biryani', slug: 'biryani', order: 1 },
  { id: 'cat-2', restaurantId: 'rest-001', name: 'Heritage Curries & Handis', slug: 'curries', order: 2 },
  { id: 'cat-3', restaurantId: 'rest-001', name: 'Imperial Charcoal Starters', slug: 'starters', order: 3 },
  { id: 'cat-4', restaurantId: 'rest-001', name: 'Khandani Breads & Rice', slug: 'breads', order: 4 },
  { id: 'cat-5', restaurantId: 'rest-001', name: 'Mithas & Royal Desserts', slug: 'desserts', order: 5 },
  { id: 'cat-6', restaurantId: 'rest-001', name: 'Shahi Sharbat & Beverages', slug: 'beverages', order: 6 }
];

export const PRODUCTS = [
  {
    id: 'prod-101',
    restaurantId: 'rest-001',
    categoryId: 'cat-1',
    name: 'Nawabi Zafrani Mutton Dum Biryani',
    slug: 'zafrani-mutton-dum-biryani',
    description: 'Tender baby goat shank slow-steamed for 6 hours with aged long-grain basmati rice, soaked in saffron milk and Awadhi ittar in a sealed earthen handi.',
    price: 649,
    discountPrice: 589,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    isBestseller: true,
    isFeatured: true,
    spicyLevel: 2,
    prepTime: '25 min',
    calories: 780,
    rating: 4.95,
    ratingCount: 284,
    tags: ['Chef Signature', 'Slow Cooked', 'Bestseller'],
    variants: [
      {
        name: 'Portion Size',
        options: [
          { label: 'Single Handi (Serves 1)', priceDelta: 0 },
          { label: 'Royal Handi (Serves 2-3)', priceDelta: 450 },
          { label: 'Shaahi Dawat Platter (Serves 4-5)', priceDelta: 990 }
        ]
      }
    ],
    addons: [
      { name: 'Smoked Burani Garlic Raita', price: 79 },
      { name: 'Mirchi Ka Salan Bowl', price: 99 },
      { name: 'Edible 24K Gold Leaf Garnish', price: 299 }
    ]
  },
  {
    id: 'prod-102',
    restaurantId: 'rest-001',
    categoryId: 'cat-2',
    name: 'Murgh Makhani Grand Heritage',
    slug: 'murgh-makhani-grand-heritage',
    description: 'Charcoal-roasted succulent chicken tikka simmered in a velvety reduction of vine-ripened tomatoes, churned white butter, and cashew silk with kasoori methi.',
    price: 549,
    discountPrice: 499,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    isBestseller: true,
    isFeatured: true,
    spicyLevel: 1,
    prepTime: '20 min',
    calories: 650,
    rating: 4.9,
    ratingCount: 310,
    tags: ['Mild & Creamy', 'Royal Favorite'],
    variants: [
      {
        name: 'Preparation Style',
        options: [
          { label: 'Classic Boneless', priceDelta: 0 },
          { label: 'Tandoori Bone-in', priceDelta: -30 }
        ]
      }
    ],
    addons: [
      { name: 'Extra Makhani Butter Glaze', price: 59 },
      { name: 'Truffle Infusion Oil', price: 149 }
    ]
  },
  {
    id: 'prod-103',
    restaurantId: 'rest-001',
    categoryId: 'cat-2',
    name: 'Paneer Lababdar Shahjahani',
    slug: 'paneer-lababdar-shahjahani',
    description: 'Artisan soft cottage cheese cubes battoned in rich onion-tomato gravy with crushed whole spices, grated khoya, and fresh coriander microgreens.',
    price: 449,
    discountPrice: null,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    isBestseller: false,
    isFeatured: true,
    spicyLevel: 2,
    prepTime: '15 min',
    calories: 520,
    rating: 4.85,
    ratingCount: 194,
    tags: ['Pure Vegetarian', 'Chef Special'],
    variants: [
      {
        name: 'Cheese Type',
        options: [
          { label: 'Traditional Malai Paneer', priceDelta: 0 },
          { label: 'Organic A2 Buffalo Paneer', priceDelta: 80 }
        ]
      }
    ],
    addons: [
      { name: 'Charred Bell Peppers', price: 49 },
      { name: 'Grated Shahi Khoya', price: 69 }
    ]
  },
  {
    id: 'prod-104',
    restaurantId: 'rest-001',
    categoryId: 'cat-3',
    name: 'Galouti Kebab Awadhi Silk',
    slug: 'galouti-kebab-awadhi-silk',
    description: 'Legendary melt-in-mouth smoked lamb patties infused with 160 secret aromatic herbs, seared on Mahi Tawa, served on mini saffron sheermals.',
    price: 599,
    discountPrice: 549,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    isBestseller: true,
    isFeatured: true,
    spicyLevel: 2,
    prepTime: '20 min',
    calories: 490,
    rating: 4.98,
    ratingCount: 420,
    tags: ['Melt in Mouth', 'Signature'],
    variants: [
      {
        name: 'Platter Size',
        options: [
          { label: '4 Pieces with 2 Sheermal', priceDelta: 0 },
          { label: '8 Pieces with 4 Sheermal', priceDelta: 500 }
        ]
      }
    ],
    addons: [
      { name: 'Saffron Sheermal (2 pcs)', price: 119 },
      { name: 'Mint Pomegranate Chutney', price: 49 }
    ]
  },
  {
    id: 'prod-105',
    restaurantId: 'rest-001',
    categoryId: 'cat-4',
    name: 'Truffle & Zaatar Butter Naan',
    slug: 'truffle-zaatar-butter-naan',
    description: 'Clay-oven blistered leavened bread brushed with French black truffle butter and toasted Middle-Eastern zaatar herbs.',
    price: 149,
    discountPrice: null,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    isBestseller: false,
    isFeatured: false,
    spicyLevel: 0,
    prepTime: '8 min',
    calories: 220,
    rating: 4.7,
    ratingCount: 88,
    tags: ['Tandoor Fresh'],
    variants: [],
    addons: [{ name: 'Extra Truffle Butter Dip', price: 69 }]
  },
  {
    id: 'prod-106',
    restaurantId: 'rest-001',
    categoryId: 'cat-5',
    name: 'Shahi Kesari Tukda Sublime',
    slug: 'shahi-kesari-tukda-sublime',
    description: 'Crisp ghee-fried brioche steeped in saffron rabri reduction, garnished with Iranian pistachios, almonds, and pure silver foil.',
    price: 299,
    discountPrice: 249,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    isBestseller: true,
    isFeatured: true,
    spicyLevel: 0,
    prepTime: '10 min',
    calories: 410,
    rating: 4.92,
    ratingCount: 240,
    tags: ['Sweet Treat', 'Chef Favorite'],
    variants: [],
    addons: [{ name: 'Warm Saffron Rabri Shot', price: 89 }]
  }
];

export const COUPONS = [
  {
    id: 'c-1',
    restaurantId: 'rest-001',
    code: 'WELCOME20',
    discountType: 'percentage',
    value: 20,
    minOrder: 499,
    maxDiscount: 200,
    description: '20% OFF on your first imperial feast (Up to ₹200)',
    isActive: true,
    expiresAt: '31 Dec 2026'
  },
  {
    id: 'c-2',
    restaurantId: 'rest-001',
    code: 'ROYAL100',
    discountType: 'fixed',
    value: 100,
    minOrder: 999,
    description: 'Flat ₹100 instant privilege discount on orders above ₹999',
    isActive: true,
    expiresAt: '31 Dec 2026'
  },
  {
    id: 'c-3',
    restaurantId: 'rest-001',
    code: 'IMPERIAL50',
    discountType: 'percentage',
    value: 15,
    minOrder: 1499,
    maxDiscount: 400,
    description: '15% Banquet discount for royal connoisseurs (Up to ₹400)',
    isActive: true,
    expiresAt: '31 Dec 2026'
  }
];

export const TABLES = [
  { id: 'tbl-1', restaurantId: 'rest-001', number: 'Table 1 (Courtyard)', capacity: 2, section: 'Courtyard Terrace', status: 'available' },
  { id: 'tbl-2', restaurantId: 'rest-001', number: 'Table 2 (Terrace View)', capacity: 4, section: 'Courtyard Terrace', status: 'available' },
  { id: 'tbl-3', restaurantId: 'rest-001', number: 'Table 3 (Royal Canopy)', capacity: 4, section: 'Royal Canopy', status: 'occupied' },
  { id: 'tbl-4', restaurantId: 'rest-001', number: 'Table 4 (Canopy Corner)', capacity: 6, section: 'Royal Canopy', status: 'available' },
  { id: 'tbl-5', restaurantId: 'rest-001', number: 'Table 5 (Heritage Indoor)', capacity: 6, section: 'Heritage Indoor', status: 'reserved' },
  { id: 'tbl-6', restaurantId: 'rest-001', number: 'Table 6 (Glass Lounge)', capacity: 4, section: 'Sheesh Mahal Glass Lounge', status: 'available' },
  { id: 'tbl-7', restaurantId: 'rest-001', number: 'Table 7 (VIP Imperial Suite)', capacity: 10, section: 'Private VIP Dining Room', status: 'available' }
];

export const RESERVATIONS = [
  {
    id: 'RES-8812',
    restaurantId: 'rest-001',
    customerName: 'Kunal Singhania',
    phone: '+91 98200 44556',
    email: 'kunal@singhania.com',
    guests: 4,
    date: 'Tonight',
    time: '08:30 PM',
    tableNumber: 'Table 3 (Royal Canopy)',
    occasion: 'Anniversary Dinner',
    status: 'confirmed'
  },
  {
    id: 'RES-8813',
    restaurantId: 'rest-001',
    customerName: 'Dr. Arpita Sen',
    phone: '+91 98311 99882',
    email: 'arpita.sen@hospital.org',
    guests: 6,
    date: 'Tomorrow',
    time: '09:00 PM',
    tableNumber: 'Table 5 (Heritage Indoor)',
    occasion: 'Family Reunion',
    status: 'confirmed'
  }
];

export const DELIVERY_RIDERS = [
  {
    id: 'rider-001',
    restaurantId: 'rest-001',
    name: 'Vikram Singh',
    phone: '+91 98300 77889',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    vehicleNumber: 'WB-02-AK-9842 (Royal Enfield Bullet)',
    status: 'online',
    rating: 4.92,
    totalDeliveries: 348,
    activeOrderId: null
  },
  {
    id: 'rider-002',
    restaurantId: 'rest-001',
    name: 'Rahul Sharma',
    phone: '+91 98111 44556',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    vehicleNumber: 'DL-04-EV-2041 (Ather 450X Electric)',
    status: 'online',
    rating: 4.88,
    totalDeliveries: 219,
    activeOrderId: null
  },
  {
    id: 'rider-003',
    restaurantId: 'rest-001',
    name: 'Amit Das',
    phone: '+91 98765 11223',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&auto=format&fit=crop&q=80',
    vehicleNumber: 'WB-20-BG-5512 (Honda Activa)',
    status: 'online',
    rating: 4.95,
    totalDeliveries: 412,
    activeOrderId: null
  }
];

export const DEMO_USERS = {
  developer: {
    id: 'user-dev-001',
    name: 'Local2Brand Super Admin',
    email: 'admin@antigravity.io',
    role: 'developer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'
  },
  owner: {
    id: 'user-owner-001',
    restaurantId: 'rest-001',
    name: 'Ranveer Shekhawat (Owner)',
    email: 'owner@royalspice.com',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80'
  },
  staff: {
    id: 'user-staff-001',
    restaurantId: 'rest-001',
    name: 'Head Chef Farooq',
    email: 'chef@royalspice.com',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=160&auto=format&fit=crop&q=80'
  },
  rider: {
    id: 'rider-001',
    restaurantId: 'rest-001',
    name: 'Vikram Singh (Delivery Valet)',
    email: 'rider@royalspice.com',
    role: 'delivery',
    phone: '+91 98300 77889',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    vehicleNumber: 'WB-02-AK-9842'
  },
  customer: {
    id: 'user-cust-001',
    name: 'Soham Mukherjee',
    email: 'soham@example.com',
    phone: '+91 98301 23456',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
    loyaltyPoints: 480,
    referralCode: 'SOHAM20',
    savedAddresses: [
      {
        id: 'addr-1',
        title: 'Home (Salt Lake Villa)',
        address: 'BD Block, Sector 1, Salt Lake City',
        landmark: 'Near City Centre 1',
        city: 'Kolkata',
        pincode: '700064',
        isDefault: true
      }
    ]
  }
};

export const PLATFORM_METRICS = {
  totalTenants: 3,
  activeTenants: 3,
  monthlyRecurringRevenue: 74900,
  totalPlatformOrders: 3840,
  serverUptime: '99.98%',
  activeSubscribers: 2840
};

export const INITIAL_ORDERS = [
  {
    id: 'ORD-9842',
    restaurantId: 'rest-001',
    customerId: 'user-cust-001',
    customer: {
      name: 'Soham Mukherjee',
      phone: '+91 98301 23456',
      email: 'soham@example.com',
      address: 'BD Block, Sector 1, Salt Lake City, Kolkata - 700064'
    },
    orderType: 'delivery',
    items: [
      {
        productId: 'prod-101',
        name: 'Nawabi Zafrani Mutton Dum Biryani',
        variant: 'Single Handi (Serves 1)',
        addons: ['Smoked Burani Garlic Raita'],
        quantity: 2,
        unitPrice: 668,
        total: 1336
      },
      {
        productId: 'prod-104',
        name: 'Galouti Kebab Awadhi Silk',
        variant: '4 Pieces with 2 Sheermal',
        addons: ['Mint Pomegranate Chutney'],
        quantity: 1,
        unitPrice: 598,
        total: 598
      }
    ],
    subtotal: 1934,
    tax: 96.7,
    deliveryFee: 50,
    discount: 200,
    total: 1880.7,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'ready',
    deliveryOtp: '8492',
    assignedRider: null,
    estimatedTime: '20-25 mins',
    kitchenNotes: 'Extra spicy raita on the side. Pack biryani in clay sealed handi.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ORD-9843',
    restaurantId: 'rest-001',
    customerId: 'user-cust-002',
    customer: {
      name: 'Ananya Roy',
      phone: '+91 98311 44556',
      email: 'ananya.roy@gmail.com',
      address: 'Silver Oak Apartments, Salt Lake Sector 5, Kolkata'
    },
    orderType: 'delivery',
    items: [
      {
        productId: 'prod-102',
        name: 'Murgh Makhani Grand Heritage',
        variant: 'Classic Boneless',
        addons: ['Extra Makhani Butter Glaze'],
        quantity: 1,
        unitPrice: 558,
        total: 558
      },
      {
        productId: 'prod-105',
        name: 'Truffle & Zaatar Butter Naan',
        variant: null,
        addons: [],
        quantity: 3,
        unitPrice: 149,
        total: 447
      }
    ],
    subtotal: 1005,
    tax: 50.25,
    deliveryFee: 50,
    discount: 100,
    total: 1005.25,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'out_for_delivery',
    deliveryOtp: '5174',
    assignedRider: {
      id: 'rider-001',
      name: 'Vikram Singh',
      phone: '+91 98300 77889',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
      vehicleNumber: 'WB-02-AK-9842 (Royal Enfield Bullet)'
    },
    estimatedTime: '15 mins',
    kitchenNotes: 'Keep naan piping hot.',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString()
  }
];

export const REVIEWS = [
  {
    id: 'rev-1',
    restaurantId: 'rest-001',
    author: 'Sanjoy Roy',
    role: 'Food Columnist, Epicurean Times',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    rating: 5,
    foodRating: 5,
    serviceRating: 5,
    dish: 'Nawabi Zafrani Mutton Biryani',
    comment: 'The depth of flavors and aromatic saffron handi was reminiscent of the royal kitchens of Lucknow. The Galouti Kebab literally melts before you even chew.',
    verifiedPurchase: true,
    date: '2 days ago'
  }
];

export const ANALYTICS_DATA = {
  overview: {
    grossSales: 382400,
    netProfit: 218500,
    averageOrderValue: 543.5,
    repeatCustomerRate: '68.4%'
  },
  revenueTrends: [
    { day: 'Mon', revenue: 38400, orders: 48 },
    { day: 'Tue', revenue: 42100, orders: 52 },
    { day: 'Wed', revenue: 49800, orders: 64 },
    { day: 'Thu', revenue: 54200, orders: 71 },
    { day: 'Fri', revenue: 68900, orders: 94 },
    { day: 'Sat', revenue: 84500, orders: 128 },
    { day: 'Sun', revenue: 92400, orders: 142 }
  ],
  topDishes: [
    { name: 'Nawabi Zafrani Mutton Dum Biryani', sales: 412, revenue: 242668, margin: '68%' },
    { name: 'Murgh Makhani Grand Heritage', sales: 384, revenue: 191616, margin: '62%' }
  ]
};
