import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
dotenv.config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Table from '../models/Table.js';
import Coupon from '../models/Coupon.js';
import Review from '../models/Review.js';
import { connectDB } from '../config/db.js';

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seeder] Cleaning existing database collections on Atlas...');

    await Promise.all([
      Restaurant.deleteMany({}),
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Table.deleteMany({}),
      Coupon.deleteMany({}),
      Review.deleteMany({})
    ]);

    // 1. Create Developer Super-Admin
    const developerUser = await User.create({
      name: 'Local2Brand Super Admin',
      email: 'admin@antigravity.io',
      password: 'password123',
      role: 'developer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'
    });

    // 2. Create Restaurant Client: The Royal Spice
    const royalSpice = await Restaurant.create({
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
        fontBody: 'Outfit'
      }
    });

    // 3. Create Owner, Staff, and Customer Users
    const owner = await User.create({
      restaurantId: royalSpice._id,
      name: 'Ranveer Shekhawat (Owner)',
      email: 'owner@royalspice.com',
      password: 'password123',
      role: 'owner',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80'
    });

    const staff = await User.create({
      restaurantId: royalSpice._id,
      name: 'Head Chef Farooq',
      email: 'chef@royalspice.com',
      password: 'password123',
      role: 'staff',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=160&auto=format&fit=crop&q=80'
    });

    const customer = await User.create({
      name: 'Soham Mukherjee',
      email: 'soham@example.com',
      password: 'password123',
      phone: '+91 98301 23456',
      role: 'customer',
      loyaltyPoints: 480,
      referralCode: 'SOHAM20'
    });

    // 4. Create Categories
    const catBiryani = await Category.create({ restaurantId: royalSpice._id, name: 'Royal Dum Biryani', slug: 'biryani', order: 1 });
    const catCurries = await Category.create({ restaurantId: royalSpice._id, name: 'Heritage Curries', slug: 'curries', order: 2 });
    const catStarters = await Category.create({ restaurantId: royalSpice._id, name: 'Imperial Starters', slug: 'starters', order: 3 });

    // 5. Create Dishes
    await Product.create([
      {
        restaurantId: royalSpice._id,
        categoryId: catBiryani._id,
        name: 'Nawabi Zafrani Mutton Dum Biryani',
        slug: 'zafrani-mutton-biryani',
        description: 'Tender baby goat shank slow-steamed for 6 hours with aged basmati rice and Kashmiri saffron in a sealed earthen handi.',
        price: 649,
        discountPrice: 589,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
        isVeg: false,
        isBestseller: true,
        isFeatured: true,
        spicyLevel: 2,
        prepTime: '25 min',
        calories: 780,
        tags: ['Royal Special', 'Chef Signature'],
        variants: [{ name: 'Portion Size', options: [{ label: 'Single Handi', priceDelta: 0 }, { label: 'Royal Handi (Serves 2-3)', priceDelta: 450 }] }],
        addons: [{ name: 'Smoked Burani Garlic Raita', price: 79 }, { name: 'Edible 24K Gold Leaf Garnish', price: 299 }]
      },
      {
        restaurantId: royalSpice._id,
        categoryId: catCurries._id,
        name: 'Murgh Makhani Grand Heritage',
        slug: 'murgh-makhani-butter-chicken',
        description: 'Charcoal-grilled boneless chicken tikka simmered in a velvet reduction of tomatoes, churned white butter, and cashew silk.',
        price: 549,
        discountPrice: 499,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
        isVeg: false,
        isBestseller: true,
        isFeatured: true,
        spicyLevel: 1,
        prepTime: '20 min',
        calories: 640
      }
    ]);

    // 6. Create Coupons & Tables
    await Coupon.create({
      restaurantId: royalSpice._id,
      code: 'WELCOME20',
      discountType: 'percentage',
      value: 20,
      minOrder: 499,
      maxDiscount: 200,
      description: '20% OFF on your royal feast (Up to ₹200)',
      expiresAt: '31 Dec 2026'
    });

    await Table.create([
      { restaurantId: royalSpice._id, number: 'Table 1', capacity: 2, section: 'Courtyard Terrace' },
      { restaurantId: royalSpice._id, number: 'Table 2', capacity: 4, section: 'Royal Canopy' },
      { restaurantId: royalSpice._id, number: 'Table 5 (VIP)', capacity: 8, section: 'Nawabi Private Suite' }
    ]);

    console.log('[Seeder] Database Seeded Successfully with Local2Brand Multi-Tenant Architecture on MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
