import { PortfolioDemo } from '../models/PortfolioDemo.js';
import { dataStore } from '../config/dataAdapter.js';
import mongoose from 'mongoose';
import { readLocalStore, writeLocalStore } from '../config/store.js';

const DEFAULT_DEMOS = [
  {
    _id: 'demo_lms',
    title: 'SkillCraft Pro LMS & Online Course Selling Platform',
    slug: 'lms',
    shortName: 'LMS Platform',
    category: 'LMS & Courses',
    badge: 'EdTech Flagship',
    price: '$199',
    priceInr: '₹6,999',
    turnaround: '3 - 7 Days',
    status: 'published',
    isFeatured: true,
    order: 1,
    heroOrder: 1,
    heroTag: 'Video Curriculum & Instant Checkout',
    heroStat: 'Full-Stack EdTech',
    rating: '5.0 ★ (78+ Reviews)',
    iconName: 'GraduationCap',
    liveUrl: 'https://stackadda.me',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop',
    description: 'Complete full-stack LMS & video course selling platform with curriculum player, student dashboard, quiz engine, and 1-click checkout.',
    features: ['Full Video Lecture Player', 'Student Dashboard with Progress', '1-Click Course Checkout', 'Certificate Generation']
  },
  {
    _id: 'demo_restaurant',
    title: 'Royal Nawabi Fine Dining & Table Reservation Hub',
    slug: 'restaurant',
    shortName: 'Fine Dining Hub',
    category: 'Restaurant',
    badge: 'Best Seller',
    price: '$149',
    priceInr: '₹5,999',
    turnaround: '2 - 4 Days',
    status: 'published',
    isFeatured: true,
    order: 2,
    heroOrder: 2,
    heroTag: 'Table Booking & Digital Dynamic Menu',
    heroStat: 'High Conversion',
    rating: '5.0 ★ (64+ Reviews)',
    iconName: 'Utensils',
    liveUrl: 'https://royal-nawabi-demo.vercel.app',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop',
    description: 'Ultra-luxurious restaurant web app with digital dynamic food menus, online table reservation, takeaway delivery, and chef specials.',
    features: ['Digital Interactive Food Menu', 'Online Table Booking System', 'WhatsApp Takeaway Orders', 'Chef Specials Showcase']
  },
  {
    _id: 'demo_cafe',
    title: 'Velvet Roast Artisan Café & Bakery Experience',
    slug: 'cafe',
    shortName: 'Artisan Cafe',
    category: 'Cafe',
    badge: 'Trending',
    price: '$129',
    priceInr: '₹4,999',
    turnaround: '2 - 3 Days',
    status: 'published',
    isFeatured: true,
    order: 3,
    heroOrder: 3,
    heroTag: 'Curated Brews & Instant WhatsApp Takeaway',
    heroStat: 'Trending Hub',
    rating: '4.9 ★ (36+ Reviews)',
    iconName: 'Sparkles',
    liveUrl: 'https://velvet-roast-demo.vercel.app',
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1400&auto=format&fit=crop',
    description: 'Aesthetic café website designed for coffee shops, bakeries, and brunch spots with signature brew lookbooks and fast takeout funnel.',
    features: ['Aesthetic Visual Menu & Coffee Brews', 'Takeout Pickup Ordering', 'Instagram Feed Embed', 'Google Maps Store Locator']
  },
  {
    _id: 'demo_salon',
    title: 'Aura Luxe Unisex Luxury Salon & Spa Studio',
    slug: 'salon',
    shortName: 'Luxury Salon',
    category: 'Salon',
    badge: 'High Demand',
    price: '$149',
    priceInr: '₹5,499',
    turnaround: '2 - 4 Days',
    status: 'published',
    isFeatured: true,
    order: 4,
    heroOrder: 4,
    heroTag: 'Stylist Roster & VIP Appointments',
    heroStat: 'High Demand',
    rating: '4.9 ★ (52+ Reviews)',
    iconName: 'Sparkles',
    liveUrl: 'https://aura-luxe-salon-demo.vercel.app',
    thumbnail: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1400&auto=format&fit=crop',
    description: 'Premium beauty salon & wellness spa portal with stylist portfolios, service rate-cards, and instant appointment booking.',
    features: ['Stylist Portfolio & Reviews', 'Service Rate-Card with Duration', 'Appointment Booking Calendar', 'WhatsApp Booking Sync']
  },
  {
    _id: 'demo_gym',
    title: 'IronForge Elite Fitness & CrossFit Club',
    slug: 'gym',
    shortName: 'Fitness Club',
    category: 'Gym',
    badge: 'High ROI',
    price: '$159',
    priceInr: '₹5,999',
    turnaround: '3 - 5 Days',
    status: 'coming_soon',
    isFeatured: false,
    order: 5,
    heroOrder: 5,
    heroTag: 'Live Class Schedule & Trial Pass Funnel',
    heroStat: 'High Energy',
    rating: '4.8 ★ (29+ Reviews)',
    iconName: 'Zap',
    liveUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop',
    description: 'High-energy fitness club web experience with membership tier pricing, trainer rosters, class schedules, and trial pass booking.',
    features: ['Membership Tier Calculator', 'Live Class Weekly Schedule', 'Trainer Profiles & Specializations', 'Free 1-Day Trial Pass Lead Capture']
  },
  {
    _id: 'demo_hotel',
    title: 'Grand Heritage Palace Resort & Luxury Suites',
    slug: 'hotel',
    shortName: 'Resort & Suites',
    category: 'Hotel',
    badge: 'Luxury',
    price: '$249',
    priceInr: '₹8,999',
    turnaround: '4 - 7 Days',
    status: 'coming_soon',
    isFeatured: false,
    order: 6,
    heroOrder: 6,
    heroTag: 'Virtual 360 Tours & Direct Room Booking',
    heroStat: 'Ultra Luxury',
    rating: '4.9 ★ (43+ Reviews)',
    iconName: 'Building2',
    liveUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop',
    description: 'Grand resort & hotel website with 360 room showcases, seasonal tariff cards, amenities, and direct room booking engine.',
    features: ['Room Categories & Tariff Grid', 'Virtual 360 Suite Tours', 'Direct Booking Enquiry Form', 'Local Sightseeing & Concierge Guide']
  },
  {
    _id: 'demo_real_estate',
    title: 'PrimeEstate Luxury Villas & Commercial Realty',
    slug: 'real_estate',
    shortName: 'Prime Real Estate',
    category: 'Real Estate',
    badge: 'Enterprise',
    price: '$279',
    priceInr: '₹9,999',
    turnaround: '4 - 7 Days',
    status: 'coming_soon',
    isFeatured: false,
    order: 7,
    heroOrder: 7,
    heroTag: 'Virtual Tours & High-Ticket Inquiries',
    heroStat: 'Ultra Modern',
    rating: '5.0 ★ (39+ Reviews)',
    iconName: 'Building2',
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
        const cleanDemos = DEFAULT_DEMOS.map(({ _id, ...d }) => d);
        await PortfolioDemo.insertMany(cleanDemos);
      }
      const filter = {};
      if (category && category !== 'all') filter.category = category;
      const rawDemos = await PortfolioDemo.find(filter).sort({ order: 1, createdAt: -1 });
      const demos = rawDemos.map((d) => {
        const obj = d.toObject ? d.toObject() : d;
        if (!obj.status) obj.status = 'published';
        return obj;
      });
      return res.status(200).json({ success: true, count: demos.length, demos });
    } else {
      let demos = readLocalStore('demos');
      if (!demos || demos.length === 0) {
        demos = [...DEFAULT_DEMOS];
        writeLocalStore('demos', demos);
      }
      demos = demos.map((d) => ({
        ...d,
        status: d.status || 'published'
      }));
      if (category && category !== 'all') {
        demos = demos.filter((d) => d.category?.toLowerCase() === category.toLowerCase());
      }
      demos.sort((a, b) => (a.order || 1) - (b.order || 1));
      return res.status(200).json({ success: true, count: demos.length, demos });
    }

  } catch (error) {
    console.error('getDemos error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error fetching demos' });
  }
};


export const getDemoByIdOrSlug = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Demo identifier is required' });
    }

    const cleanId = String(id).trim().toLowerCase();
    const cleanHyphen = cleanId.replace(/_/g, '-');
    const cleanUnderscore = cleanId.replace(/-/g, '_');
    let demo = null;

    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          demo = await PortfolioDemo.findById(id);
        }
        if (!demo) {
          demo = await PortfolioDemo.findOne({
            $or: [
              { slug: cleanId },
              { slug: cleanHyphen },
              { slug: cleanUnderscore },
              { templateId: cleanId },
              { templateId: cleanHyphen },
              { templateId: cleanUnderscore },
              { id: cleanId },
              { title: { $regex: new RegExp(`^${cleanId}$`, 'i') } }
            ]
          });
        }
      } catch (dbErr) {
        console.warn('MongoDB query warning in getDemoByIdOrSlug:', dbErr.message);
      }
    }

    if (!demo) {
      const demos = readLocalStore('demos') || [];
      demo = demos.find((d) =>
        d.slug === cleanId ||
        d.slug === cleanHyphen ||
        d.slug === cleanUnderscore ||
        d._id === cleanId ||
        d.templateId === cleanId ||
        d.title?.toLowerCase() === cleanId
      );
    }

    if (!demo) {
      demo = DEFAULT_DEMOS.find((d) =>
        d.slug === cleanId ||
        d.slug === cleanHyphen ||
        d.slug === cleanUnderscore ||
        d._id === cleanId ||
        d.title?.toLowerCase() === cleanId
      );
    }

    if (!demo) {
      return res.status(404).json({ success: false, message: `Website template '${id}' was not found in database` });
    }

    const demoObj = demo.toObject ? demo.toObject() : demo;
    if (!demoObj.status) demoObj.status = 'published';

    return res.status(200).json({ success: true, demo: demoObj });
  } catch (error) {
    console.error('getDemoByIdOrSlug error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error fetching demo' });
  }
};

export const createDemo = async (req, res) => {

  try {
    if (mongoose.connection.readyState === 1) {
      const demo = await PortfolioDemo.create(req.body);
      return res.status(201).json({ success: true, demo });
    } else {
      const demos = readLocalStore('demos') || [];
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
    let demo = null;
    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
          demo = await PortfolioDemo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        }
        if (!demo) {
          demo = await PortfolioDemo.findOneAndUpdate(
            { $or: [{ _id: req.params.id }, { slug: req.params.id }] },
            req.body,
            { new: true }
          );
        }
      } catch (e) {
        console.warn('MongoDB updateDemo notice:', e.message);
      }
    }

    if (!demo) {
      const demos = readLocalStore('demos') || [];
      const idx = demos.findIndex((d) => d._id?.toString() === req.params.id || d.slug === req.params.id || d.id === req.params.id);
      if (idx !== -1) {
        demos[idx] = { ...demos[idx], ...req.body, updatedAt: new Date().toISOString() };
        writeLocalStore('demos', demos);
        demo = demos[idx];
      }
    }

    if (!demo) {
      // If it is a new demo or not in store, create/return it
      demo = { _id: req.params.id, ...req.body, updatedAt: new Date().toISOString() };
    }

    return res.status(200).json({ success: true, demo });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDemo = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
          await PortfolioDemo.findByIdAndDelete(req.params.id);
        } else {
          await PortfolioDemo.findOneAndDelete({ $or: [{ _id: req.params.id }, { slug: req.params.id }] });
        }
      } catch (e) {}
    }

    let demos = readLocalStore('demos') || [];
    demos = demos.filter((d) => d._id?.toString() !== req.params.id && d.slug !== req.params.id && d.id !== req.params.id);
    writeLocalStore('demos', demos);
    return res.status(200).json({ success: true, message: 'Demo template deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Reorder Templates or Hero Slider
export const reorderDemos = async (req, res) => {
  try {
    const { orderedIds, heroOrderedIds, updates } = req.body;
    if (!Array.isArray(orderedIds) && !Array.isArray(heroOrderedIds) && !Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: 'orderedIds, heroOrderedIds, or updates array required' });
    }

    if (mongoose.connection.readyState === 1) {
      if (Array.isArray(orderedIds)) {
        for (let i = 0; i < orderedIds.length; i++) {
          await PortfolioDemo.findByIdAndUpdate(orderedIds[i], { order: i + 1 });
        }
      }
      if (Array.isArray(heroOrderedIds)) {
        for (let i = 0; i < heroOrderedIds.length; i++) {
          await PortfolioDemo.findByIdAndUpdate(heroOrderedIds[i], { heroOrder: i + 1, isFeatured: true });
        }
      }
      if (Array.isArray(updates)) {
        for (const item of updates) {
          const id = item._id || item.id;
          if (id) {
            await PortfolioDemo.findByIdAndUpdate(id, item);
          }
        }
      }
      const demos = await PortfolioDemo.find().sort({ order: 1 });
      return res.status(200).json({ success: true, demos });
    } else {
      let demos = readLocalStore('demos') || [];
      if (Array.isArray(orderedIds)) {
        demos = demos.map((d) => {
          const idx = orderedIds.indexOf(d._id?.toString());
          return idx !== -1 ? { ...d, order: idx + 1 } : d;
        });
      }
      if (Array.isArray(heroOrderedIds)) {
        demos = demos.map((d) => {
          const idx = heroOrderedIds.indexOf(d._id?.toString());
          return idx !== -1 ? { ...d, heroOrder: idx + 1, isFeatured: true } : d;
        });
      }
      if (Array.isArray(updates)) {
        updates.forEach((u) => {
          const idx = demos.findIndex((d) => d._id?.toString() === (u._id || u.id)?.toString());
          if (idx !== -1) {
            demos[idx] = { ...demos[idx], ...u };
          }
        });
      }
      demos.sort((a, b) => (a.order || 1) - (b.order || 1));
      writeLocalStore('demos', demos);
      return res.status(200).json({ success: true, demos });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
