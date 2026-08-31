import { PortfolioDemo } from '../models/PortfolioDemo.js';
import { dataStore } from '../config/dataAdapter.js';
import mongoose from 'mongoose';
import { readLocalStore, writeLocalStore } from '../config/store.js';

const DEFAULT_DEMOS = [
  {
    _id: 'demo_lms',
    title: 'SkillCraft Pro LMS & Online Course Selling Platform',
    slug: 'lms',
    category: 'LMS & Courses',
    badge: 'EdTech Flagship',
    price: '$199',
    priceInr: '₹6,999',
    turnaround: '3 - 7 Days',
    status: 'published',
    isFeatured: true,
    order: 1,
    liveUrl: 'https://skillcraft-lms-demo.vercel.app',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop',
    description: 'Complete full-stack LMS & video course selling platform with curriculum player, student dashboard, quiz engine, and 1-click checkout.',
    features: ['Full Video Lecture Player', 'Student Dashboard with Progress', '1-Click Course Checkout', 'Certificate Generation']
  },
  {
    _id: 'demo_restaurant',
    title: 'Royal Nawabi Fine Dining & Table Reservation Hub',
    slug: 'restaurant',
    category: 'Restaurant',
    badge: 'Best Seller',
    price: '$149',
    priceInr: '₹5,999',
    turnaround: '2 - 4 Days',
    status: 'published',
    isFeatured: true,
    order: 2,
    liveUrl: 'https://royal-nawabi-demo.vercel.app',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop',
    description: 'Ultra-luxurious restaurant web app with digital dynamic food menus, online table reservation, takeaway delivery, and chef specials.',
    features: ['Digital Interactive Food Menu', 'Online Table Booking System', 'WhatsApp Takeaway Orders', 'Chef Specials Showcase']
  },
  {
    _id: 'demo_cafe',
    title: 'Velvet Roast Artisan Café & Bakery Experience',
    slug: 'cafe',
    category: 'Cafe',
    badge: 'Trending',
    price: '$129',
    priceInr: '₹4,999',
    turnaround: '2 - 3 Days',
    status: 'published',
    isFeatured: true,
    order: 3,
    liveUrl: 'https://velvet-roast-demo.vercel.app',
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1400&auto=format&fit=crop',
    description: 'Aesthetic café website designed for coffee shops, bakeries, and brunch spots with signature brew lookbooks and fast takeout funnel.',
    features: ['Aesthetic Visual Menu & Coffee Brews', 'Takeout Pickup Ordering', 'Instagram Feed Embed', 'Google Maps Store Locator']
  },
  {
    _id: 'demo_salon',
    title: 'Aura Luxe Unisex Luxury Salon & Spa Studio',
    slug: 'salon',
    category: 'Salon',
    badge: 'High Demand',
    price: '$149',
    priceInr: '₹5,499',
    turnaround: '2 - 4 Days',
    status: 'published',
    isFeatured: false,
    order: 4,
    liveUrl: 'https://aura-luxe-salon-demo.vercel.app',
    thumbnail: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1400&auto=format&fit=crop',
    description: 'Premium beauty salon & wellness spa portal with stylist portfolios, service rate-cards, and instant appointment booking.',
    features: ['Stylist Portfolio & Reviews', 'Service Rate-Card with Duration', 'Appointment Booking Calendar', 'WhatsApp Booking Sync']
  },
  {
    _id: 'demo_gym',
    title: 'IronForge Elite Fitness & CrossFit Club',
    slug: 'gym',
    category: 'Gym',
    badge: 'High ROI',
    price: '$159',
    priceInr: '₹5,999',
    turnaround: '3 - 5 Days',
    status: 'coming_soon',
    isFeatured: false,
    order: 5,
    liveUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop',
    description: 'High-energy fitness club web experience with membership tier pricing, trainer rosters, class schedules, and trial pass booking.',
    features: ['Membership Tier Calculator', 'Live Class Weekly Schedule', 'Trainer Profiles & Specializations', 'Free 1-Day Trial Pass Lead Capture']
  },
  {
    _id: 'demo_hotel',
    title: 'Grand Heritage Palace Resort & Luxury Suites',
    slug: 'hotel',
    category: 'Hotel',
    badge: 'Luxury',
    price: '$249',
    priceInr: '₹8,999',
    turnaround: '4 - 7 Days',
    status: 'coming_soon',
    isFeatured: false,
    order: 6,
    liveUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop',
    description: 'Grand resort & hotel website with 360 room showcases, seasonal tariff cards, amenities, and direct room booking engine.',
    features: ['Room Categories & Tariff Grid', 'Virtual 360 Suite Tours', 'Direct Booking Enquiry Form', 'Local Sightseeing & Concierge Guide']
  },
  {
    _id: 'demo_real_estate',
    title: 'PrimeEstate Luxury Villas & Commercial Realty',
    slug: 'real_estate',
    category: 'Real Estate',
    badge: 'Enterprise',
    price: '$279',
    priceInr: '₹9,999',
    turnaround: '4 - 7 Days',
    status: 'coming_soon',
    isFeatured: false,
    order: 7,
    liveUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop',
    description: 'Modern real estate property portal with property filters, floor plans, neighborhood insights, and broker lead captures.',
    features: ['Interactive Property Search & Filters', 'High-Res Floor Plans & Amenities', 'EMI & Loan Calculator Widget', 'Instant Agent Callback & Site Visit Booking']
  }
];

export const getDemos = async (req, res) => {
  try {
    const { category } = req.query;

    if (mongoose.connection.readyState === 1) {
      const count = await PortfolioDemo.countDocuments();
      if (count === 0) {
        await PortfolioDemo.insertMany(DEFAULT_DEMOS);
      }
      const filter = {};
      if (category && category !== 'all') filter.category = category;
      const demos = await PortfolioDemo.find(filter).sort({ order: 1, createdAt: -1 });
      return res.status(200).json({ success: true, count: demos.length, demos });
    } else {
      let demos = readLocalStore('demos');
      if (!demos || demos.length === 0) {
        demos = [...DEFAULT_DEMOS];
        writeLocalStore('demos', demos);
      }
      if (category && category !== 'all') {
        demos = demos.filter((d) => d.category?.toLowerCase() === category.toLowerCase());
      }
      demos.sort((a, b) => (a.order || 1) - (b.order || 1));
      return res.status(200).json({ success: true, count: demos.length, demos });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Error fetching demos' });
  }
};

export const createDemo = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const demo = await PortfolioDemo.create(req.body);
      return res.status(201).json({ success: true, demo });
    } else {
      const demos = readLocalStore('demos');
      const newDemo = {
        _id: 'demo_' + Date.now(),
        ...req.body,
        order: req.body.order || demos.length + 1,
        status: req.body.status || 'published',
        createdAt: new Date().toISOString()
      };
      demos.push(newDemo);
      writeLocalStore('demos', demos);
      return res.status(201).json({ success: true, demo: newDemo });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDemo = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const demo = await PortfolioDemo.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!demo) return res.status(404).json({ success: false, message: 'Demo template not found' });
      return res.status(200).json({ success: true, demo });
    } else {
      const demos = readLocalStore('demos');
      const idx = demos.findIndex((d) => d._id?.toString() === req.params.id || d.slug === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Demo template not found' });
      demos[idx] = { ...demos[idx], ...req.body, updatedAt: new Date().toISOString() };
      writeLocalStore('demos', demos);
      return res.status(200).json({ success: true, demo: demos[idx] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDemo = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await PortfolioDemo.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: 'Demo template deleted' });
    } else {
      let demos = readLocalStore('demos');
      demos = demos.filter((d) => d._id?.toString() !== req.params.id && d.slug !== req.params.id);
      writeLocalStore('demos', demos);
      return res.status(200).json({ success: true, message: 'Demo template deleted' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Reorder Templates
export const reorderDemos = async (req, res) => {
  try {
    const { orderedIds } = req.body; // Array of IDs in new sequence
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds array required' });
    }

    if (mongoose.connection.readyState === 1) {
      for (let i = 0; i < orderedIds.length; i++) {
        await PortfolioDemo.findByIdAndUpdate(orderedIds[i], { order: i + 1 });
      }
      const demos = await PortfolioDemo.find().sort({ order: 1 });
      return res.status(200).json({ success: true, demos });
    } else {
      let demos = readLocalStore('demos');
      demos = demos.map((d) => {
        const idx = orderedIds.indexOf(d._id?.toString());
        return idx !== -1 ? { ...d, order: idx + 1 } : d;
      });
      demos.sort((a, b) => (a.order || 1) - (b.order || 1));
      writeLocalStore('demos', demos);
      return res.status(200).json({ success: true, demos });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
