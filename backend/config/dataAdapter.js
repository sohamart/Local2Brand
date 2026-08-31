import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { readLocalStore, writeLocalStore } from './store.js';

export const isDbConnected = () => mongoose.connection.readyState === 1;

// Default initial admin & settings
const DEFAULT_ADMIN = {
  _id: 'admin_default_id_001',
  name: 'LOCAL2BRAND Master Admin',
  email: 'admin@local2brand.com',
  passwordHash: '$2a$10$w3/sX8aA2c7v4N8u2q5G6.U2xVj6fIu4qVpP.Qx7yPzQ7yPzQ7yPz', // Admin@12345
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
  supportEmail: 'hello@local2brand.com',
  displayPhone: '',
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
    link: '/pricing',
  },
  bannerImage: '',
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
  async findUserByEmail(email) {
    if (isDbConnected()) {
      const { User } = await import('../models/User.js');
      return await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    }
    const users = readLocalStore('users');
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  async findUserById(id) {
    if (!id) return null;
    if (isDbConnected()) {
      try {
        const { User } = await import('../models/User.js');
        if (mongoose.Types.ObjectId.isValid(id)) {
          const user = await User.findById(id).select('-password');
          if (user) return user;
        }
        // Fallback search by ID or email
        const userByQuery = await User.findOne({
          $or: [
            { email: (process.env.ADMIN_EMAIL || 'admin@local2brand.com').toLowerCase().trim() },
            { role: 'admin' },
          ],
        }).select('-password');
        if (userByQuery) return userByQuery;
      } catch (err) {
        console.warn('MongoDB findUserById fallback notice:', err.message);
      }
    }
    const users = readLocalStore('users') || [];
    const user = users.find((u) => u && (String(u._id || u.id) === String(id) || (id === 'admin_default_id_001' && u.role === 'admin')));
    if (!user) return null;
    const { password, passwordHash, ...rest } = user;
    return rest;
  },

  async createUser(userData) {
    if (isDbConnected()) {
      const { User } = await import('../models/User.js');
      return await User.create(userData);
    }
    const users = readLocalStore('users');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const newUser = {
      _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      passwordHash,
      role: userData.role || 'user',
      avatar: userData.avatar || '',
      phone: userData.phone || '',
      company: userData.company || '',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeLocalStore('users', users);
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  },

  async updateUser(id, updates) {
    if (isDbConnected()) {
      try {
        const { User } = await import('../models/User.js');
        if (mongoose.Types.ObjectId.isValid(id)) {
          const updated = await User.findByIdAndUpdate(id, { $set: updates }, { new: true });
          if (updated) return updated;
        }
        // Fallback search by email or admin role
        const fallbackUpdated = await User.findOneAndUpdate(
          { $or: [{ email: (process.env.ADMIN_EMAIL || 'admin@local2brand.com').toLowerCase().trim() }, { role: 'admin' }] },
          { $set: updates },
          { new: true }
        );
        if (fallbackUpdated) return fallbackUpdated;
      } catch (err) {
        console.warn('MongoDB updateUser fallback notice:', err.message);
      }
    }
    const users = readLocalStore('users') || [];
    const index = users.findIndex((u) => u && (String(u._id || u.id) === String(id) || (id === 'admin_default_id_001' && u.role === 'admin')));
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    writeLocalStore('users', users);
    return users[index];
  },

  async getAllUsers() {
    if (isDbConnected()) {
      const { User } = await import('../models/User.js');
      return await User.find().select('-password').sort({ createdAt: -1 });
    }
    const users = readLocalStore('users');
    return users.map(({ password, passwordHash, ...safe }) => safe);
  },

  // Settings
  async getSettings() {
    if (isDbConnected()) {
      try {
        const { SiteSettings } = await import('../models/SiteSettings.js');
        let s = await SiteSettings.findOne();
        if (!s) s = await SiteSettings.create(DEFAULT_SETTINGS);
        return s;
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
        let s = await SiteSettings.findOne();
        if (!s) {
          s = new SiteSettings({ ...DEFAULT_SETTINGS, ...cleanUpdates });
        } else {
          Object.assign(s, cleanUpdates);
        }
        savedSettings = await s.save();
      } catch (err) {
        console.warn('MongoDB updateSettings notice, syncing to local fallback:', err.message);
      }
    }

    const current = (await this.getSettings()) || {};
    const updated = {
      ...current,
      ...(savedSettings ? (savedSettings.toObject ? savedSettings.toObject() : savedSettings) : cleanUpdates),
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
      return await QueryLead.find(filter).sort({ createdAt: -1 });
    }
    let leads = readLocalStore('leads');
    if (filter.status && filter.status !== 'all') {
      leads = leads.filter((l) => l.status === filter.status);
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
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
      return await QueryLead.find({
        $or: [{ user: userId }, { email: email }],
      }).sort({ createdAt: -1 });
    }
    const leads = readLocalStore('leads');
    return leads.filter(
      (l) => (userId && l.user === userId) || (email && l.email?.toLowerCase() === email.toLowerCase())
    );
  },

  async updateLead(id, updates) {
    if (isDbConnected()) {
      const { QueryLead } = await import('../models/QueryLead.js');
      return await QueryLead.findByIdAndUpdate(id, updates, { new: true });
    }
    const leads = readLocalStore('leads');
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
    let leads = readLocalStore('leads');
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
    const cbs = readLocalStore('callbacks');
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
      return await CallbackRequest.find(filter).sort({ createdAt: -1 });
    }
    let cbs = readLocalStore('callbacks');
    if (filter.status && filter.status !== 'all') {
      cbs = cbs.filter((c) => c.status === filter.status);
    }
    return cbs;
  },

  async getUserCallbacks(userId, email) {
    if (isDbConnected()) {
      const { CallbackRequest } = await import('../models/CallbackRequest.js');
      return await CallbackRequest.find({
        $or: [{ user: userId }, { email: email }],
      }).sort({ createdAt: -1 });
    }
    const cbs = readLocalStore('callbacks');
    return cbs.filter(
      (c) => (userId && c.user === userId) || (email && c.email?.toLowerCase() === email.toLowerCase())
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
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@local2brand.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    
    if (isDbConnected()) {
      const { User } = await import('../models/User.js');
      const exists = await User.findOne({ email: adminEmail });
      if (!exists) {
        await User.create({
          name: 'LOCAL2BRAND Master Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
          phone: '+91 98765 43210',
          company: 'LOCAL2BRAND HQ',
        });
        console.log(`👑 Admin Account Created (MongoDB): ${adminEmail} / ${adminPassword}`);
      }
    } else {
      const users = readLocalStore('users');
      const exists = users.find((u) => u.email.toLowerCase() === adminEmail);
      if (!exists) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(adminPassword, salt);
        users.push({
          _id: 'admin_master_001',
          name: 'LOCAL2BRAND Master Admin',
          email: adminEmail,
          passwordHash,
          role: 'admin',
          phone: '+91 98765 43210',
          company: 'LOCAL2BRAND HQ',
          status: 'active',
          createdAt: new Date().toISOString(),
        });
        writeLocalStore('users', users);
        console.log(`👑 Admin Account Created (Resilient Store): ${adminEmail} / ${adminPassword}`);
      }
    }
  },
};
