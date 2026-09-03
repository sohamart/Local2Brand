import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { readLocalStore, writeLocalStore } from './store.js';
import { connectDB } from './db.js';

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const ensureDb = async () => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (e) {
      console.warn('⚠️ ensureDb notice:', e.message);
    }
  }
  return mongoose.connection.readyState === 1;
};


// Default initial admin & settings
const DEFAULT_ADMIN = {
  _id: 'admin_default_id_001',
  name: 'LOCAL2BRAND Master Admin',
  email: 'admin@local2brand.com',
  passwordHash: '$2b$10$PW8Q2cMv0bHMFwu1nNbCDugHy2RxmvNXCjQH/fhJzWRsSzRNS7twm', // Admin@12345
  role: 'admin',
  phone: '+91 98765 43210',
  company: 'LOCAL2BRAND HQ',
  status: 'active',
  createdAt: new Date().toISOString(),
};

const DEFAULT_SETTINGS = {
  brandName: 'LOCAL2BRAND',
  domain: 'local2brand.com',
  tagline: 'Build Local. Think Global.',
  supportEmail: 'stackaddacontact@gmail.com',
  displayPhone: '+91 98765 43210',
  turnaroundTime: '48 Hours',
  startingPriceUsd: '$399',
  startingPriceInr: '₹9,999',
  isMaintenanceMode: false,
  isComingSoonMode: false,
  maintenanceMessage: 'We are currently upgrading our platform. We will be back online shortly!',
  socialLinks: {
    instagram: 'https://instagram.com/local2brand',
    instagramHandle: '@local2brand',
    linkedin: 'https://linkedin.com/company/local2brand',
    github: 'https://github.com/local2brand',
    twitter: 'https://twitter.com/local2brand',
  },
  heroConfig: {
    badge: '🇮🇳 India’s #1 Fast-Track Web Experience Engine',
    title: 'Transform Your Local Business Into A Global Brand',
    subtitle: 'World-class UI/UX design, sub-second performance, and instant lead capture for ambitious businesses ready to scale.',
  },
  announcementBar: {
    enabled: true,
    text: '🔥 Special Launch Offer: Get 20% OFF + Free SSL & Domain with code INDIA2025',
    badge: 'FLASH OFFER',
    link: '/pricing',
    promoCode: 'INDIA2025',
    discountPercent: 20,
    btnText: 'Claim Offer',
  },
  luckyWheel: {
    enabled: true,
    title: '🎡 Spin & Win Exclusive Launch Rewards',
    subtitle: 'Spin the lucky prize wheel to win instant discounts, free domains, and launch vouchers!',
    btnText: 'Spin & Win Prize',
    rewardVoucher: 'INDIA2025',
    rewardDiscount: 20,
    campaignVersion: 1,
    lastResetDate: new Date().toISOString(),
  },
  bannerImage: '',

  pricingPlans: [
    {
      id: "starter",
      name: "Starter",
      badge: "Fast Launch",
      popular: false,
      price: "$399",
      priceInr: "₹12,999",
      billingNote: "One-time investment",
      turnaround: "3 - 7 Days",
      description: "Ideal for local businesses, consultants, and creators looking to launch a polished online presence quickly.",
      features: [
        "Up to 5 High-Conversion Pages / Sections",
        "Choice of any Ready-Made Demo Template",
        "Full Customization (Branding, Colors, Content)",
        "100% Mobile & Tablet Responsive Layout",
        "WhatsApp Direct Ordering & Inquiry Integration",
        "Basic SEO Setup & Google Maps Location Embed",
        "14 Days Post-Launch Support & Minor Edits"
      ],
      notIncluded: [
        "Custom Complex Web App Logic",
        "Advanced Multi-level Catalog",
        "Dedicated Project Manager"
      ],
      ctaText: "Start with Starter",
      websiteType: "Starter Website",
      status: "published",
      order: 1
    },
    {
      id: "professional",
      name: "Professional",
      badge: "Most Popular",
      popular: true,
      price: "$799",
      priceInr: "₹24,999",
      billingNote: "One-time investment",
      turnaround: "5 - 7 Business Days",
      description: "Our flagship custom website tier for ambitious brands who want an Apple-grade, high-converting digital experience.",
      features: [
        "Up to 12 Bespoke Pages / Dynamic Architecture",
        "Bespoke Liquid Glass UI / Custom Design System",
        "GSAP Micro-Animations & Lenis Smooth Scroll",
        "Interactive WhatsApp Order Funnel with Dynamic Messages",
        "Full On-Page Technical SEO & Schema Optimization",
        "Speed Optimization (98+ Google Lighthouse Guaranteed)",
        "Social Media Feeds & Lead Capture Integration",
        "30 Days VIP Priority Post-Launch Support"
      ],
      notIncluded: [
        "Full-stack Custom SaaS Backend (Phase 4)"
      ],
      ctaText: "Get Professional",
      websiteType: "Professional Website",
      status: "published",
      order: 2
    },
    {
      id: "custom",
      name: "Custom Enterprise",
      badge: "Tailored Growth",
      popular: false,
      price: "$1,499+",
      priceInr: "₹49,999+",
      billingNote: "Scope-based pricing",
      turnaround: "10 - 15 Business Days",
      description: "Full-scale custom digital products, extensive e-commerce catalogs, and multi-location business solutions.",
      features: [
        "Unlimited Custom Pages & Modular Design Tokens",
        "Custom Component Architecture & Micro-Interactions",
        "Complete E-Commerce / Multi-Category WhatsApp Shop",
        "Interactive Calculators, Multi-Step Form Funnels",
        "Dedicated Senior UI/UX Designer & Lead Engineer",
        "Priority 24/7 WhatsApp & Strategy Call Access",
        "60 Days Dedicated Hyper-Care Support & Training",
        "Scalable code architecture ready for future Backend API"
      ],
      notIncluded: [],
      ctaText: "Discuss Custom Scope",
      websiteType: "Custom Enterprise Solution",
      status: "published",
      order: 3
    }
  ],
  demoCategories: [
    "LMS & Courses",
    "Restaurant",
    "Cafe",
    "Salon",
    "Gym",
    "Hotel",
    "Real Estate",
    "Photography",
    "Boutique",
    "Coaching",
    "Dental",
    "Jewellery",
    "Automotive",
    "Healthcare",
    "Custom"
  ],
  aiSettings: {
    enabled: true,
    customInstructions: 'Be polite, friendly, and conversion-focused. Guide users towards booking a demo or requesting a callback. Recommend the promo code INDIA2025 for 20% discount.',
    businessKnowledge: 'LOCAL2BRAND builds high-converting business websites in 48 hours. Ready demo templates start at ₹9,999 / $399. Bespoke custom builds are available for complex requirements.',
    adminShowableDetails: {
      founderName: 'Soham Dutta (Founder & Lead Architect) & Founding Team',
      founderCount: 1,
      showFoundersToAi: true,
      founders: [
        {
          name: 'Soham Dutta',
          role: 'Founder & Lead Architect',
          bio: 'Full-Stack Engineer & Product Designer leading high-performance web systems.',
          instagram: 'https://instagram.com/sohamart',
          linkedin: '',
          email: 'sohamduttabwn@gmail.com',
          phone: '+91 98765 43210',
        },
      ],
      contactPhone: '+91 98765 43210',
      contactEmail: 'stackaddacontact@gmail.com',
      officeLocation: 'Kolkata & Bangalore, India',
      workingHours: 'Monday - Saturday: 10:00 AM - 8:00 PM IST',
      whatsappSupport: '+91 98765 43210',
      instagram: 'https://instagram.com/local2brand',
      instagramHandle: '@local2brand',
    },
  },
};


// Generic Data Manager
export const dataStore = {
  // Generic collection operations
  read(collection) {
    return readLocalStore(collection);
  },

  save(collection, data) {
    writeLocalStore(collection, data);
  },

  find(collection, predicate) {
    const list = readLocalStore(collection);
    return list.find(predicate) || null;
  },

  findById(collection, id) {
    const list = readLocalStore(collection);
    return list.find((item) => item._id?.toString() === id?.toString() || item.id === id) || null;
  },

  create(collection, item) {
    const list = readLocalStore(collection);
    const newItem = {
      _id: item._id || `${collection.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString()
    };
    list.unshift(newItem);
    writeLocalStore(collection, list);
    return newItem;
  },

  update(collection, id, updates) {
    const list = readLocalStore(collection);
    const idx = list.findIndex((item) => item._id?.toString() === id?.toString() || item.requirementId === id || item.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
    writeLocalStore(collection, list);
    return list[idx];
  },

  // Users
  async getAllUsers() {
    await ensureDb();
    if (isDbConnected()) {
      try {
        const { User } = await import('../models/User.js');
        const dbUsers = await User.find().select('-password').sort({ createdAt: -1 });
        if (dbUsers && dbUsers.length > 0) {
          return dbUsers.map((u) => ({
            _id: u._id.toString(),
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            role: u.role,
            avatar: u.avatar || '',
            phone: u.phone || '',
            company: u.company || '',
            status: u.status || 'active',
            isEmailVerified: Boolean(u.isEmailVerified),
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
          }));
        }
      } catch (err) {
        console.warn('MongoDB getAllUsers notice:', err.message);
      }
    }
    const users = readLocalStore('users') || [];
    return users.map((u) => {
      const { password, passwordHash, ...rest } = u;
      return {
        ...rest,
        isEmailVerified: Boolean(u.isEmailVerified),
      };
    });
  },

  async findUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = String(email).toLowerCase().trim();
    await ensureDb();
    if (isDbConnected()) {
      try {
        const { User } = await import('../models/User.js');
        const escaped = cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const dbUser = await User.findOne({
          email: { $regex: new RegExp(`^${escaped}$`, 'i') }
        }).select('+password +emailOtp +emailOtpExpires');
        if (dbUser) return dbUser;
      } catch (err) {
        console.warn('MongoDB findUserByEmail notice:', err.message);
      }
    }
    const users = readLocalStore('users') || [];
    return users.find((u) => u && u.email && u.email.toLowerCase().trim() === cleanEmail) || null;
  },

  async findUserById(id) {
    if (!id) return null;
    const cleanId = String(id).trim();
    await ensureDb();
    if (isDbConnected()) {
      try {
        const { User } = await import('../models/User.js');
        if (mongoose.Types.ObjectId.isValid(cleanId)) {
          const user = await User.findById(cleanId).select('-password');
          if (user) return user;
        }
        // Fallback search by ID or email
        const userByQuery = await User.findOne({
          $or: [
            { _id: cleanId },
            { email: cleanId.toLowerCase() },
            { email: (process.env.ADMIN_EMAIL || 'admin@local2brand.com').toLowerCase().trim() },
          ],
        }).select('-password');
        if (userByQuery) return userByQuery;
      } catch (err) {
        console.warn('MongoDB findUserById fallback notice:', err.message);
      }
    }
    const users = readLocalStore('users') || [];
    const user = users.find((u) => u && (String(u._id || u.id) === cleanId || (cleanId === 'admin_default_id_001' && u.role === 'admin')));
    if (!user) return null;
    const { password, passwordHash, ...rest } = user;
    return rest;
  },

  async createUser(userData) {
    const cleanEmail = userData.email.toLowerCase().trim();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    await ensureDb();
    if (isDbConnected()) {
      try {
        const { User } = await import('../models/User.js');
        // Remove any old conflicting record with this email
        await User.deleteMany({ email: cleanEmail });
        const created = await User.create({
          name: userData.name,
          email: cleanEmail,
          password: userData.password,
          role: userData.role || 'user',
          avatar: userData.avatar || '',
          phone: userData.phone || '',
          company: userData.company || '',
          status: 'active',
          isEmailVerified: Boolean(userData.isEmailVerified),
          emailOtp: userData.emailOtp || '',
          emailOtpExpires: userData.emailOtpExpires || null,
        });

        // Sync local store
        const users = readLocalStore('users') || [];
        const filtered = users.filter((u) => u && u.email && u.email.toLowerCase().trim() !== cleanEmail);
        filtered.push({
          _id: created._id.toString(),
          id: created._id.toString(),
          name: userData.name,
          email: cleanEmail,
          password: passwordHash,
          passwordHash,
          role: userData.role || 'user',
          avatar: userData.avatar || '',
          phone: userData.phone || '',
          company: userData.company || '',
          status: 'active',
          isEmailVerified: Boolean(userData.isEmailVerified),
          createdAt: new Date().toISOString(),
        });
        writeLocalStore('users', filtered);
        return created;
      } catch (err) {
        console.warn('MongoDB User.create notice, creating locally:', err.message);
      }
    }

    const users = readLocalStore('users') || [];
    const filtered = users.filter((u) => u && u.email && u.email.toLowerCase().trim() !== cleanEmail);

    const newUser = {
      _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: userData.name,
      email: cleanEmail,
      password: passwordHash,
      passwordHash,
      role: userData.role || 'user',
      avatar: userData.avatar || '',
      phone: userData.phone || '',
      company: userData.company || '',
      status: 'active',
      isEmailVerified: Boolean(userData.isEmailVerified),
      createdAt: new Date().toISOString(),
    };
    filtered.push(newUser);
    writeLocalStore('users', filtered);
    const { passwordHash: _, password: __, ...safeUser } = newUser;
    return safeUser;
  },

  async updateUser(id, updates) {
    const cleanId = String(id).trim();
    let mongoUpdated = null;
    await ensureDb();
    if (isDbConnected()) {
      try {
        const { User } = await import('../models/User.js');
        if (mongoose.Types.ObjectId.isValid(cleanId)) {
          mongoUpdated = await User.findByIdAndUpdate(cleanId, { $set: updates }, { new: true });
        }
        if (!mongoUpdated) {
          mongoUpdated = await User.findOneAndUpdate(
            { $or: [{ email: (process.env.ADMIN_EMAIL || 'admin@local2brand.com').toLowerCase().trim() }, { role: 'admin' }] },
            { $set: updates },
            { new: true }
          );
        }
      } catch (err) {
        console.warn('MongoDB updateUser fallback notice:', err.message);
      }
    }
    const users = readLocalStore('users') || [];
    const index = users.findIndex((u) => u && (String(u._id || u.id) === cleanId || (u.role === 'admin' && (cleanId === 'admin_master_001' || cleanId === 'admin_default_id_001'))));
    if (index === -1) {
      const adminUser = {
        _id: cleanId || 'admin_master_001',
        id: cleanId || 'admin_master_001',
        name: updates.name || 'LOCAL2BRAND Master Admin',
        email: (process.env.ADMIN_EMAIL || 'admin@local2brand.com').toLowerCase().trim(),
        role: 'admin',
        avatar: updates.avatar || '',
        phone: updates.phone || '',
        company: updates.company || '',
        status: 'active',
        ...updates
      };
      users.push(adminUser);
      writeLocalStore('users', users);
      return mongoUpdated || adminUser;
    }
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    writeLocalStore('users', users);
    return mongoUpdated || users[index];
  },

  async deleteUser(id) {

    if (!id) return false;
    const cleanId = String(id).trim();
    let targetEmail = null;

    // 1. Identify target email from local store or DB
    const localUsers = readLocalStore('users') || [];
    const localTarget = localUsers.find((u) => u && (String(u._id || u.id) === cleanId || (u.email && u.email.toLowerCase() === cleanId.toLowerCase())));
    if (localTarget?.email) targetEmail = localTarget.email.toLowerCase().trim();

    // 2. Delete from MongoDB
    if (isDbConnected()) {
      try {
        const { User } = await import('../models/User.js');
        if (mongoose.Types.ObjectId.isValid(cleanId)) {
          const dbUser = await User.findById(cleanId);
          if (dbUser?.email) targetEmail = dbUser.email.toLowerCase().trim();
          await User.findByIdAndDelete(cleanId);
        }
        if (targetEmail) {
          await User.deleteMany({ email: targetEmail });
        }
      } catch (err) {
        console.warn('MongoDB deleteUser notice:', err.message);
      }
    }

    // 3. Delete from Local Store
    const remainingUsers = localUsers.filter((u) => {
      if (!u) return false;
      const matchId = String(u._id || u.id) === cleanId;
      const matchEmail = targetEmail && u.email && u.email.toLowerCase().trim() === targetEmail;
      return !matchId && !matchEmail;
    });
    writeLocalStore('users', remainingUsers);

    return true;
  },

  async getAllUsers() {
    let baseUsers = [];
    if (isDbConnected()) {
      try {
        const { User } = await import('../models/User.js');
        const dbUsers = await User.find().select('-password').sort({ createdAt: -1 });
        baseUsers = JSON.parse(JSON.stringify(dbUsers));
      } catch (err) {
        console.warn('MongoDB User.find notice:', err.message);
        const users = readLocalStore('users') || [];
        baseUsers = users.map(({ password, passwordHash, ...safe }) => safe);
      }
    } else {
      const users = readLocalStore('users') || [];
      baseUsers = users.map(({ password, passwordHash, ...safe }) => safe);
    }

    // Ensure Master Admin exists in list
    const adminEmail = (process.env.ADMIN_EMAIL || 'sohamduttabwn@gmail.com').toLowerCase().trim();
    const hasAdmin = baseUsers.some((u) => u.email && u.email.toLowerCase().trim() === adminEmail);
    if (!hasAdmin) {
      baseUsers.unshift({
        _id: 'admin_master_001',
        name: 'LOCAL2BRAND Master Admin',
        email: adminEmail,
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    }

    return baseUsers;
  },

  // Settings
  async getSettings() {
    if (isDbConnected()) {
      try {
        const { SiteSettings } = await import('../models/SiteSettings.js');
        let s = await SiteSettings.findOne().lean();
        if (s) return s;
        const created = await SiteSettings.create(DEFAULT_SETTINGS);
        return created ? (created.toObject ? created.toObject() : created) : DEFAULT_SETTINGS;
      } catch (err) {
        console.warn('MongoDB getSettings notice:', err.message);
      }
    }
    const settingsList = readLocalStore('settings');
    if (settingsList && settingsList.length > 0) return settingsList[0];
    const initial = { _id: 'settings_default_id_001', ...DEFAULT_SETTINGS };
    writeLocalStore('settings', [initial]);
    return initial;
  },

  async updateSettings(updates) {
    const { _id, ...cleanUpdates } = updates;
    let savedSettings = null;

    if (isDbConnected()) {
      try {
        const { SiteSettings } = await import('../models/SiteSettings.js');
        savedSettings = await SiteSettings.findOneAndUpdate(
          {},
          { $set: cleanUpdates },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        ).lean();
      } catch (err) {
        console.warn('MongoDB updateSettings notice, syncing to local fallback:', err.message);
      }
    }

    const currentList = readLocalStore('settings');
    const current = (currentList && currentList[0]) || DEFAULT_SETTINGS;
    const updated = {
      ...current,
      ...(savedSettings || cleanUpdates),
      updatedAt: new Date().toISOString()
    };
    writeLocalStore('settings', [updated]);
    return savedSettings || updated;
  },

  // Query Leads
  async createLead(leadData) {
    if (isDbConnected()) {
      const { QueryLead } = await import('../models/QueryLead.js');
      return await QueryLead.create(leadData);
    }
    const leads = readLocalStore('leads');
    const newLead = {
      _id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...leadData,
      status: 'pending',
      adminNotes: '',
      createdAt: new Date().toISOString(),
    };
    leads.unshift(newLead);
    writeLocalStore('leads', leads);
    return newLead;
  },

  async getAllLeads(filter = {}) {
    if (isDbConnected()) {
      const { QueryLead } = await import('../models/QueryLead.js');
      const query = {};
      if (filter.status && filter.status !== 'all') {
        query.status = filter.status;
      }
      if (filter.search && String(filter.search).trim()) {
        const s = String(filter.search).trim();
        query.$or = [
          { name: { $regex: s, $options: 'i' } },
          { email: { $regex: s, $options: 'i' } },
          { phone: { $regex: s, $options: 'i' } },
          { businessName: { $regex: s, $options: 'i' } },
          { websiteType: { $regex: s, $options: 'i' } }
        ];
      }
      return await QueryLead.find(query).sort({ createdAt: -1 });
    }
    let leads = readLocalStore('leads') || [];
    if (filter.status && filter.status !== 'all') {
      leads = leads.filter((l) => l.status === filter.status);
    }
    if (filter.search && String(filter.search).trim()) {
      const s = String(filter.search).toLowerCase().trim();
      leads = leads.filter(
        (l) =>
          l.name?.toLowerCase().includes(s) ||
          l.email?.toLowerCase().includes(s) ||
          l.phone?.includes(s) ||
          l.businessName?.toLowerCase().includes(s) ||
          l.websiteType?.toLowerCase().includes(s)
      );
    }
    return leads;
  },

  async getUserLeads(userId, email) {
    if (isDbConnected()) {
      const { QueryLead } = await import('../models/QueryLead.js');
      const conditions = [];
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        conditions.push({ user: userId });
      }
      if (email && String(email).trim()) {
        conditions.push({ email: { $regex: new RegExp(`^${String(email).trim()}$`, 'i') } });
      }
      if (conditions.length === 0) return [];
      return await QueryLead.find({ $or: conditions }).sort({ createdAt: -1 });
    }
    const leads = readLocalStore('leads') || [];
    return leads.filter(
      (l) => (userId && l.user === userId) || (email && l.email?.toLowerCase() === String(email).toLowerCase())
    );
  },

  async updateLead(id, updates) {
    if (isDbConnected()) {
      const { QueryLead } = await import('../models/QueryLead.js');
      return await QueryLead.findByIdAndUpdate(id, updates, { new: true });
    }
    const leads = readLocalStore('leads') || [];
    const idx = leads.findIndex((l) => l._id.toString() === id.toString());
    if (idx === -1) return null;
    leads[idx] = { ...leads[idx], ...updates, updatedAt: new Date().toISOString() };
    writeLocalStore('leads', leads);
    return leads[idx];
  },

  async deleteLead(id) {
    if (isDbConnected()) {
      const { QueryLead } = await import('../models/QueryLead.js');
      return await QueryLead.findByIdAndDelete(id);
    }
    let leads = readLocalStore('leads') || [];
    leads = leads.filter((l) => l._id.toString() !== id.toString());
    writeLocalStore('leads', leads);
    return true;
  },

  // Callbacks
  async createCallback(cbData) {
    if (isDbConnected()) {
      const { CallbackRequest } = await import('../models/CallbackRequest.js');
      return await CallbackRequest.create(cbData);
    }
    const cbs = readLocalStore('callbacks') || [];
    const newCb = {
      _id: 'cb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...cbData,
      status: 'pending',
      adminNotes: '',
      createdAt: new Date().toISOString(),
    };
    cbs.unshift(newCb);
    writeLocalStore('callbacks', cbs);
    return newCb;
  },

  async getAllCallbacks(filter = {}) {
    if (isDbConnected()) {
      const { CallbackRequest } = await import('../models/CallbackRequest.js');
      const query = {};
      if (filter.status && filter.status !== 'all') {
        query.status = filter.status;
      }
      if (filter.search && String(filter.search).trim()) {
        const s = String(filter.search).trim();
        query.$or = [
          { name: { $regex: s, $options: 'i' } },
          { email: { $regex: s, $options: 'i' } },
          { phone: { $regex: s, $options: 'i' } },
          { topic: { $regex: s, $options: 'i' } }
        ];
      }
      return await CallbackRequest.find(query).sort({ createdAt: -1 });
    }
    let cbs = readLocalStore('callbacks') || [];
    if (filter.status && filter.status !== 'all') {
      cbs = cbs.filter((c) => c.status === filter.status);
    }
    if (filter.search && String(filter.search).trim()) {
      const s = String(filter.search).toLowerCase().trim();
      cbs = cbs.filter(
        (c) =>
          c.name?.toLowerCase().includes(s) ||
          c.email?.toLowerCase().includes(s) ||
          c.phone?.includes(s) ||
          c.topic?.toLowerCase().includes(s)
      );
    }
    return cbs;
  },

  async getUserCallbacks(userId, email) {
    if (isDbConnected()) {
      const { CallbackRequest } = await import('../models/CallbackRequest.js');
      const conditions = [];
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        conditions.push({ user: userId });
      }
      if (email && String(email).trim()) {
        conditions.push({ email: { $regex: new RegExp(`^${String(email).trim()}$`, 'i') } });
      }
      if (conditions.length === 0) return [];
      return await CallbackRequest.find({ $or: conditions }).sort({ createdAt: -1 });
    }
    const cbs = readLocalStore('callbacks') || [];
    return cbs.filter(
      (c) => (userId && c.user === userId) || (email && c.email?.toLowerCase() === String(email).toLowerCase())
    );
  },

  async updateCallback(id, updates) {
    if (isDbConnected()) {
      const { CallbackRequest } = await import('../models/CallbackRequest.js');
      return await CallbackRequest.findByIdAndUpdate(id, updates, { new: true });
    }
    const cbs = readLocalStore('callbacks');
    const idx = cbs.findIndex((c) => c._id.toString() === id.toString());
    if (idx === -1) return null;
    cbs[idx] = { ...cbs[idx], ...updates, updatedAt: new Date().toISOString() };
    writeLocalStore('callbacks', cbs);
    return cbs[idx];
  },

  async deleteCallback(id) {
    if (isDbConnected()) {
      const { CallbackRequest } = await import('../models/CallbackRequest.js');
      return await CallbackRequest.findByIdAndDelete(id);
    }
    let cbs = readLocalStore('callbacks');
    cbs = cbs.filter((c) => c._id.toString() !== id.toString());
    writeLocalStore('callbacks', cbs);
    return true;
  },

  // Notifications
  async createNotification(notifData) {
    if (isDbConnected()) {
      const { Notification } = await import('../models/Notification.js');
      return await Notification.create(notifData);
    }
    const notifs = readLocalStore('notifications');
    const newN = {
      _id: 'notif_' + Date.now(),
      ...notifData,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    notifs.unshift(newN);
    writeLocalStore('notifications', notifs.slice(0, 50));
    return newN;
  },

  async getNotifications(limit = 15) {
    if (isDbConnected()) {
      const { Notification } = await import('../models/Notification.js');
      return await Notification.find().sort({ createdAt: -1 }).limit(limit);
    }
    const notifs = readLocalStore('notifications');
    return notifs.slice(0, limit);
  },

  async seedDefaultAdmin() {
    const adminEmails = [
      (process.env.ADMIN_EMAIL || 'admin@local2brand.com').toLowerCase().trim(),
      'admin@local2brand.com'
    ].filter(Boolean);
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    
    if (isDbConnected()) {
      const { User } = await import('../models/User.js');
      for (const email of adminEmails) {
        let exists = await User.findOne({ email }).select('+password');
        if (!exists) {
          await User.create({
            name: 'LOCAL2BRAND Master Admin',
            email,
            password: adminPassword,
            role: 'admin',
            phone: '+91 98765 43210',
            company: 'LOCAL2BRAND HQ',
          });
          console.log(`👑 Admin Account Created (MongoDB): ${email} / ${adminPassword}`);
        } else {
          // If password doesn't match current admin password, update it
          const isMatch = await exists.matchPassword(adminPassword);
          if (!isMatch) {
            exists.password = adminPassword;
            await exists.save();
            console.log(`👑 Admin Password Synced (MongoDB): ${email}`);
          }
        }
      }

    } else {
      const users = readLocalStore('users') || [];
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);

      for (const email of adminEmails) {
        const existingIdx = users.findIndex((u) => u.email?.toLowerCase() === email);
        if (existingIdx === -1) {
          users.push({
            _id: `admin_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: 'LOCAL2BRAND Master Admin',
            email,
            passwordHash,
            role: 'admin',
            phone: '+91 98765 43210',
            company: 'LOCAL2BRAND HQ',
            status: 'active',
            createdAt: new Date().toISOString(),
          });
          console.log(`👑 Admin Account Created (Resilient Store): ${email} / ${adminPassword}`);
        }
      }
      writeLocalStore('users', users);
    }
  },

  // --- Chatbot Session Management ---
  async getOrCreateChatSession(sessionId, userId = null, meta = {}) {
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    if (isDbConnected()) {
      const { ChatSession } = await import('../models/ChatSession.js');
      let session = await ChatSession.findOne({ sessionId });

      // If no session found by sessionId but user is logged in, find their latest session from the last 7 days
      if (!session && userId) {
        session = await ChatSession.findOne({
          user: userId,
          lastActiveAt: { $gte: sevenDaysAgo }
        }).sort({ lastActiveAt: -1 });
      }

      if (!session) {
        session = await ChatSession.create({
          sessionId,
          user: userId || null,
          messages: [],
          ip: meta.ip || '',
          userAgent: meta.userAgent || '',
          lastActiveAt: new Date(),
        });
      } else {
        if (userId && !session.user) {
          session.user = userId;
        }
        session.lastActiveAt = new Date();
        await session.save();
      }
      return session;
    }

    const sessions = readLocalStore('chat_sessions');
    let session = sessions.find((s) => s.sessionId === sessionId);
    if (!session && userId) {
      session = sessions.find(
        (s) => s.user?.toString() === userId.toString() && new Date(s.lastActiveAt) >= sevenDaysAgo
      );
    }

    if (!session) {
      session = {
        _id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sessionId,
        user: userId || null,
        title: 'New Conversation',
        messages: [],
        ip: meta.ip || '',
        userAgent: meta.userAgent || '',
        lastActiveAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      sessions.push(session);
      writeLocalStore('chat_sessions', sessions);
    } else {
      if (userId && !session.user) {
        session.user = userId;
      }
      session.lastActiveAt = new Date().toISOString();
      writeLocalStore('chat_sessions', sessions);
    }
    return session;
  },

  async appendChatMessages(sessionId, newMessages = []) {
    if (!sessionId || !newMessages.length) return null;

    if (isDbConnected()) {
      const { ChatSession } = await import('../models/ChatSession.js');
      const updated = await ChatSession.findOneAndUpdate(
        { sessionId },
        {
          $push: { messages: { $each: newMessages } },
          $set: { lastActiveAt: new Date() },
        },
        { new: true, upsert: true }
      );
      return updated;
    }

    const sessions = readLocalStore('chat_sessions');
    let session = sessions.find((s) => s.sessionId === sessionId);
    if (!session) {
      session = {
        _id: `chat_${Date.now()}`,
        sessionId,
        messages: [],
        lastActiveAt: new Date().toISOString(),
      };
      sessions.push(session);
    }
    session.messages.push(...newMessages);
    session.lastActiveAt = new Date().toISOString();
    writeLocalStore('chat_sessions', sessions);
    return session;
  },

  async clearChatSession(sessionId) {
    if (!sessionId) return false;

    if (isDbConnected()) {
      const { ChatSession } = await import('../models/ChatSession.js');
      await ChatSession.findOneAndUpdate(
        { sessionId },
        { $set: { messages: [], lastActiveAt: new Date() } }
      );
      return true;
    }

    const sessions = readLocalStore('chat_sessions');
    const index = sessions.findIndex((s) => s.sessionId === sessionId);
    if (index !== -1) {
      sessions[index].messages = [];
      sessions[index].lastActiveAt = new Date().toISOString();
      writeLocalStore('chat_sessions', sessions);
    }
    return true;
  },

  async getServices() {
    if (isDbConnected()) {
      const { Service } = await import('../models/Service.js');
      return await Service.find().sort({ order: 1 });
    }
    return readLocalStore('services');
  },

  async getDemos() {
    if (isDbConnected()) {
      const { PortfolioDemo } = await import('../models/PortfolioDemo.js');
      return await PortfolioDemo.find().sort({ order: 1 });
    }
    return readLocalStore('demos');
  },
};


