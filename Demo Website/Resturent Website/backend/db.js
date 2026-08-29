const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

let dbPath;
if (process.env.VERCEL) {
  const tmpDbPath = path.join('/tmp', 'restaurant.db');
  const candidates = [
    path.join(__dirname, 'restaurant.db'),
    path.join(__dirname, '..', 'restaurant.db'),
    path.join(process.cwd(), 'restaurant.db')
  ];
  const foundDbPath = candidates.find(p => fs.existsSync(p));
  if (!fs.existsSync(tmpDbPath) && foundDbPath) {
    try {
      fs.copyFileSync(foundDbPath, tmpDbPath);
    } catch (err) {
      console.error('Failed to copy initial database to /tmp:', err);
    }
  }
  dbPath = fs.existsSync(tmpDbPath) ? tmpDbPath : (foundDbPath || path.join(__dirname, 'restaurant.db'));
} else {
  dbPath = path.join(__dirname, 'restaurant.db');
}

const db = new Database(dbPath);


// Concurrency mode
try {
  if (process.env.VERCEL) {
    db.pragma('journal_mode = DELETE');
  } else {
    db.pragma('journal_mode = WAL');
  }
} catch (e) {}

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    role TEXT DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    display_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    original_price REAL,
    category TEXT NOT NULL,
    image TEXT,
    is_veg INTEGER DEFAULT 1,
    is_spicy INTEGER DEFAULT 0,
    is_bestseller INTEGER DEFAULT 0,
    is_available INTEGER DEFAULT 1,
    rating REAL DEFAULT 4.8,
    prep_time TEXT DEFAULT '20-25 mins',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id INTEGER,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_notes TEXT,
    items_json TEXT NOT NULL,
    subtotal REAL NOT NULL,
    delivery_fee REAL NOT NULL,
    discount REAL DEFAULT 0,
    total REAL NOT NULL,
    payment_method TEXT NOT NULL, -- 'razorpay', 'cod', 'whatsapp', 'upi'
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    order_status TEXT DEFAULT 'received', -- 'received', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
    estimated_delivery_time TEXT,
    driver_name TEXT,
    driver_phone TEXT,
    driver_lat REAL,
    driver_lng REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    guests INTEGER NOT NULL,
    reservation_date TEXT NOT NULL,
    reservation_time TEXT NOT NULL,
    seating_type TEXT DEFAULT 'Main Dining',
    special_request TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'seated', 'cancelled'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    dish_name TEXT,
    status TEXT DEFAULT 'approved', -- 'approved', 'pending', 'hidden'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    ip TEXT,
    session_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS active_sessions (
    session_id TEXT PRIMARY KEY,
    last_ping DATETIME DEFAULT CURRENT_TIMESTAMP,
    current_page TEXT
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    otp TEXT NOT NULL,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Default Admin User if not exists
const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@restaurant.com');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO users (name, email, password, phone, address, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('Restaurant Admin', 'admin@restaurant.com', hashedPassword, '+91 98765 43210', 'Restaurant Central Hub', 'admin');
}

// Seed Demo Customer if not exists
const demoCustomer = db.prepare('SELECT id FROM users WHERE email = ?').get('customer@example.com');
if (!demoCustomer) {
  const customerPass = bcrypt.hashSync('customer123', 10);
  db.prepare(`
    INSERT INTO users (name, email, password, phone, address, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('Rahul Sharma', 'customer@example.com', customerPass, '+91 98765 12345', 'Flat 402, Royal Palms, Park Street, City', 'customer');
}

// Seed Demo Delivery Partner if not exists
const riderEmail = (process.env.DEFAULT_RIDER_EMAIL || 'rider@restaurant.com').toLowerCase().trim();
const demoRider = db.prepare('SELECT id FROM users WHERE email = ?').get(riderEmail);
if (!demoRider) {
  const riderName = process.env.DEFAULT_RIDER_NAME || 'Vikram Express (Rider)';
  const riderPass = bcrypt.hashSync(process.env.DEFAULT_RIDER_PASS || 'rider123', 10);
  const riderPhone = process.env.DEFAULT_RIDER_PHONE || '+91 98300 55443';
  const riderVehicle = process.env.DEFAULT_RIDER_VEHICLE || 'Express Thermal Bike (DL 04 EV 8892)';
  db.prepare(`
    INSERT INTO users (name, email, password, phone, address, role)
    VALUES (?, ?, ?, ?, ?, 'delivery')
  `).run(riderName, riderEmail, riderPass, riderPhone, riderVehicle);
}

// Ensure driver_vehicle and delivery_otp columns exist in orders table
try {
  db.prepare("ALTER TABLE orders ADD COLUMN driver_vehicle TEXT DEFAULT 'Express Thermal Bike (DL 04 EV 8892)'").run();
} catch (e) {
  // Column already exists
}

try {
  db.prepare("ALTER TABLE orders ADD COLUMN delivery_otp TEXT DEFAULT '4829'").run();
} catch (e) {
  // Column already exists
}

try {
  db.prepare("ALTER TABLE users ADD COLUMN profile_image TEXT").run();
} catch (e) {
  // Column already exists
}

// Seed default profile images if empty
try {
  db.prepare("UPDATE users SET profile_image = 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80' WHERE role = 'admin' AND (profile_image IS NULL OR profile_image = '')").run();
  db.prepare("UPDATE users SET profile_image = 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=80' WHERE role = 'delivery' AND (profile_image IS NULL OR profile_image = '')").run();
  db.prepare("UPDATE users SET profile_image = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80' WHERE email = 'customer@example.com' AND (profile_image IS NULL OR profile_image = '')").run();
} catch (e) {}

// Seed Default Settings using environment variables with fallbacks
const defaultSettings = {
  restaurant_name: process.env.RESTAURANT_NAME || "L'Amour Gourmet & Grill",
  tagline: process.env.RESTAURANT_TAGLINE || "Authentic Charcoal Grills & Artisanal Cuisine",
  phone: process.env.RESTAURANT_PHONE || "+91 98765 43210",
  whatsapp_number: process.env.RESTAURANT_WHATSAPP || "919876543210",
  email: process.env.RESTAURANT_EMAIL || "contact@lamourgourmet.com",
  address: process.env.RESTAURANT_ADDRESS || "12/A Park Avenue, Gourmet Boulevard, Central City",
  restaurant_lat: process.env.RESTAURANT_LAT || "22.5726",
  restaurant_lng: process.env.RESTAURANT_LNG || "88.3639",
  opening_hours: process.env.OPENING_HOURS || "11:30 AM - 11:30 PM (Mon-Sun)",
  delivery_fee: process.env.DELIVERY_FEE || "49",
  free_delivery_above: process.env.FREE_DELIVERY_ABOVE || "499",
  min_order_amount: process.env.MIN_ORDER_AMOUNT || "199",
  // Payment toggles
  enable_cod: process.env.ENABLE_COD || "true",
  enable_whatsapp_order: process.env.ENABLE_WHATSAPP_ORDER || "true",
  enable_upi_qr: process.env.ENABLE_UPI_QR || "true",
  upi_id: process.env.UPI_ID || "lamourgourmet@oksbi",
  upi_name: process.env.UPI_NAME || "L'Amour Gourmet Restaurant",
  // Razorpay dynamic integration
  enable_razorpay: process.env.ENABLE_RAZORPAY || "true",
  razorpay_key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_YourKeyHere123",
  razorpay_key_secret: process.env.RAZORPAY_KEY_SECRET || "YourSecretKeyHere",
  allow_mock_razorpay_if_unconfigured: "true",
  // Email & SMTP Notification Settings
  enable_email_notifications: process.env.ENABLE_EMAIL_NOTIFICATIONS || "true",
  smtp_host: process.env.SMTP_HOST || "smtp.gmail.com",
  smtp_port: process.env.SMTP_PORT || "587",
  smtp_user: process.env.SMTP_USER || "",
  smtp_pass: process.env.SMTP_PASS || "",
  smtp_from: process.env.SMTP_FROM || "L'Amour Gourmet <notifications@lamourgourmet.com>",
  smtp_secure: process.env.SMTP_SECURE || "false",
  admin_notification_email: process.env.ADMIN_EMAIL || "admin@restaurant.com",
  // Delivery Geo-Fence Zone & Service Area (Burdwan, WB, India)
  delivery_restriction_enabled: process.env.DELIVERY_RESTRICTION_ENABLED || "true",
  delivery_allowed_country: process.env.DELIVERY_ALLOWED_COUNTRY || "India",
  delivery_allowed_state: process.env.DELIVERY_ALLOWED_STATE || "West Bengal",
  delivery_allowed_city: process.env.DELIVERY_ALLOWED_CITY || "Burdwan",
  delivery_allowed_pincodes: process.env.DELIVERY_ALLOWED_PINCODES || "713101, 713102, 713103, 713104, 713105",
  delivery_allowed_areas: process.env.DELIVERY_ALLOWED_AREAS || "Curzon Gate, Golapbag, Badamtala, Khagragarh, Alisha, Baburbag, Birhata, Nutanganj, Bajepratappur, Ullhas, Borehat, Radhanagar, Shaktigarh"
};

const insertSetting = db.prepare('INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)');
for (const [k, v] of Object.entries(defaultSettings)) {
  insertSetting.run(k, v);
}

// Seed Categories
const categories = [
  { name: "Chef's Specials", slug: "specials", icon: "Flame", display_order: 1 },
  { name: "Charcoal Grills & Tandoor", slug: "grills", icon: "Utensils", display_order: 2 },
  { name: "Royal Starters", slug: "starters", icon: "Sparkles", display_order: 3 },
  { name: "Artisanal Main Course", slug: "mains", icon: "ChefHat", display_order: 4 },
  { name: "Dum Biryani & Rice", slug: "biryani", icon: "Soup", display_order: 5 },
  { name: "Gourmet Desserts", slug: "desserts", icon: "Cake", display_order: 6 },
  { name: "Beverages & Mocktails", slug: "beverages", icon: "Wine", display_order: 7 }
];

const insertCat = db.prepare('INSERT OR IGNORE INTO categories (name, slug, icon, display_order) VALUES (?, ?, ?, ?)');
categories.forEach(c => insertCat.run(c.name, c.slug, c.icon, c.display_order));

// Seed Menu Items if empty
const itemCount = db.prepare('SELECT COUNT(*) as count FROM menu_items').get().count;
if (itemCount === 0) {
  const seedItems = [
    {
      name: "Smoked Afghani Malai Tikka",
      description: "Tender chicken morsels marinated in cashew paste, fresh cream, cardamom, and smoked over aromatic charcoal.",
      price: 380,
      original_price: 450,
      category: "Charcoal Grills & Tandoor",
      image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80",
      is_veg: 0,
      is_spicy: 0,
      is_bestseller: 1,
      rating: 4.9,
      prep_time: "20 mins"
    },
    {
      name: "Truffle Butter Garlic Naan with Dal Makhani",
      description: "Slow-cooked 24-hour black lentils in rich dairy butter served with wood-fired truffle infused garlic naan.",
      price: 320,
      original_price: 360,
      category: "Artisanal Main Course",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
      is_veg: 1,
      is_spicy: 0,
      is_bestseller: 1,
      rating: 4.95,
      prep_time: "15 mins"
    },
    {
      name: "Awadhi Dum Mutton Biryani",
      description: "Fragrant aged basmati rice layered with succulent baby goat meat, saffron, kewra water, and sealed in clay handi.",
      price: 490,
      original_price: 550,
      category: "Dum Biryani & Rice",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
      is_veg: 0,
      is_spicy: 1,
      is_bestseller: 1,
      rating: 5.0,
      prep_time: "25 mins"
    },
    {
      name: "Crispy Peri Peri Paneer Tikka",
      description: "Farm-fresh cottage cheese cubes rubbed in zesty African peri peri glaze, charred bell peppers and minted Greek yogurt dip.",
      price: 340,
      original_price: 390,
      category: "Charcoal Grills & Tandoor",
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80",
      is_veg: 1,
      is_spicy: 1,
      is_bestseller: 0,
      rating: 4.8,
      prep_time: "15 mins"
    },
    {
      name: "L'Amour Signature Butter Chicken (Boneless)",
      description: "Old Delhi style velvety tomato satin gravy enriched with organic honey, fenugreek, and tandoori shredded chicken.",
      price: 420,
      original_price: 480,
      category: "Chef's Specials",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80",
      is_veg: 0,
      is_spicy: 0,
      is_bestseller: 1,
      rating: 4.95,
      prep_time: "20 mins"
    },
    {
      name: "Stuffed Dahi Ke Kebab with Pomegranate Dip",
      description: "Melt-in-mouth spiced hung yogurt patties stuffed with pistachio, roasted cumin, and pan-seared to golden crust.",
      price: 290,
      original_price: 340,
      category: "Royal Starters",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
      is_veg: 1,
      is_spicy: 0,
      is_bestseller: 0,
      rating: 4.7,
      prep_time: "15 mins"
    },
    {
      name: "Hyderabadi Shahi Paneer Dum Biryani",
      description: "Slow-dum cooked long grain rice infused with rose petals, aromatic spices, and marinated cottage cheese medallions.",
      price: 360,
      original_price: 410,
      category: "Dum Biryani & Rice",
      image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80",
      is_veg: 1,
      is_spicy: 1,
      is_bestseller: 0,
      rating: 4.75,
      prep_time: "20 mins"
    },
    {
      name: "Saffron Pistachio Tres Leches Cake",
      description: "Spongy vanilla genoise cake soaked in three decadent milks infused with Kashmiri saffron strands and crushed pistachios.",
      price: 240,
      original_price: 280,
      category: "Gourmet Desserts",
      image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80",
      is_veg: 1,
      is_spicy: 0,
      is_bestseller: 1,
      rating: 4.9,
      prep_time: "10 mins"
    },
    {
      name: "Smoked Passion Fruit & Rosemary Fizz",
      description: "Fresh passion fruit purée, torched rosemary, sparkling soda, and lime caviar over crushed rock ice.",
      price: 180,
      original_price: 220,
      category: "Beverages & Mocktails",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
      is_veg: 1,
      is_spicy: 0,
      is_bestseller: 0,
      rating: 4.85,
      prep_time: "5 mins"
    }
  ];

  const insertItem = db.prepare(`
    INSERT INTO menu_items (name, description, price, original_price, category, image, is_veg, is_spicy, is_bestseller, rating, prep_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  seedItems.forEach(item => {
    insertItem.run(
      item.name,
      item.description,
      item.price,
      item.original_price,
      item.category,
      item.image,
      item.is_veg,
      item.is_spicy,
      item.is_bestseller,
      item.rating,
      item.prep_time
    );
  });
}

// Seed Initial Reviews if empty
const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
if (reviewCount === 0) {
  const seedReviews = [
    { user_name: "Dr. Ananya Roy", rating: 5, comment: "Hands down the best Awadhi Biryani and Smoked Afghani Tikka in town! Delivered blazing hot within 25 minutes.", dish_name: "Awadhi Dum Mutton Biryani" },
    { user_name: "Vikram Malhotra", rating: 5, comment: "The live order tracking was spot-on and WhatsApp order button made ordering for 10 friends effortlessly fast. 10/10!", dish_name: "Chef's Specials" },
    { user_name: "Sneha Sen", rating: 5, comment: "The Saffron Tres Leches is out of this world. Luxurious ambience and exquisite flavours.", dish_name: "Saffron Pistachio Tres Leches Cake" },
    { user_name: "Rohan Kapoor", rating: 4, comment: "Very smooth Razorpay checkout, live map tracking showed the driver arriving right to my doorstep.", dish_name: "Butter Chicken" }
  ];

  const insertReview = db.prepare('INSERT INTO reviews (user_name, rating, comment, dish_name, status) VALUES (?, ?, ?, ?, ?)');
  seedReviews.forEach(r => insertReview.run(r.user_name, r.rating, r.comment, r.dish_name, 'approved'));
}

module.exports = db;
