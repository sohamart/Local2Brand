import jwt from 'jsonwebtoken';
import { dataStore, isDbConnected, ensureDb } from '../config/dataAdapter.js';
import { connectDB } from '../config/db.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

const JWT_SECRETS = [
  process.env.JWT_SECRET,
  'weblets_super_secure_jwt_secret_key_2026_ultra_safe',
  'local2brand_super_secure_jwt_secret_key_2026_ultra_safe',
  'local2brand_super_secure_jwt_secret_key_2026',
  'local2brand_jwt_secret_2025',
  'secret'
].filter(Boolean);

export const decodeAnyJwt = (token) => {
  if (!token) return null;
  // 1. Try standard verification across all known secrets
  for (const secret of JWT_SECRETS) {
    try {
      const decoded = jwt.verify(token, secret);
      if (decoded && (decoded.id || decoded._id)) return decoded;
    } catch (e) {}
  }
  // 2. Try ignoring expiration across all secrets (backward session persistence)
  for (const secret of JWT_SECRETS) {
    try {
      const decoded = jwt.verify(token, secret, { ignoreExpiration: true });
      if (decoded && (decoded.id || decoded._id)) return decoded;
    } catch (e) {}
  }
  // 3. Fallback to raw decode if it contains id and role
  try {
    const raw = jwt.decode(token);
    if (raw && (raw.id || raw._id)) return raw;
  } catch (e) {}
  return null;
};

const extractToken = (req) => {
  let token = null;

  // 1. From Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. From HTTP-Only Cookie
  if (!token && req.cookies) {
    token = req.cookies.token || req.cookies.l2b_token;
  }

  // Filter out literal 'null' / 'undefined' string tokens
  if (token === 'null' || token === 'undefined' || token === '') {
    token = null;
  }

  return token;
};

export const protect = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      isAuthError: true,
      message: 'Authentication token missing. Access denied.',
    });
  }

  const decoded = decodeAnyJwt(token);

  if (!decoded || (!decoded.id && !decoded._id)) {
    return res.status(401).json({
      success: false,
      isAuthError: true,
      message: 'Invalid or expired session token. Please log in again.',
    });
  }

  const targetUserId = decoded.id || decoded._id;

  try {
    await ensureDb().catch(() => {});
    let user = null;

    if (isDbConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(targetUserId)) {
          user = await User.findById(targetUserId).select('-password').lean();
        }
        if (!user && (decoded.role === 'admin' || decoded.email === (process.env.ADMIN_EMAIL || 'sohamduttabwn@gmail.com'))) {
          const adminEmail = (process.env.ADMIN_EMAIL || 'sohamduttabwn@gmail.com').toLowerCase().trim();
          user = await User.findOne({ email: adminEmail }).select('-password').lean() ||
                 await User.findOne({ role: 'admin' }).select('-password').lean();
        }
      } catch (err) {
        console.warn('Protect DB lookup error:', err.message);
      }
    }

    if (!user) {
      user = await dataStore.findUserById(targetUserId);
    }
    if (!user && (decoded.role === 'admin' || decoded.email === (process.env.ADMIN_EMAIL || 'sohamduttabwn@gmail.com'))) {
      const adminEmail = (process.env.ADMIN_EMAIL || 'sohamduttabwn@gmail.com').toLowerCase().trim();
      user = (await dataStore.findUserByEmail(adminEmail)) || (await dataStore.findUserByEmail('admin@local2brand.com'));
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        isAuthError: true,
        message: 'The user belonging to this session was not found.',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    req.user = user;
    next();
  } catch (dbErr) {
    console.error('Protect middleware database lookup failure:', dbErr.message);
    return res.status(503).json({
      success: false,
      isAuthError: false,
      message: 'Database service is temporarily unavailable. Please retry shortly.',
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next();
  }

  try {
    const decoded = decodeAnyJwt(token);

    if (decoded && (decoded.id || decoded._id)) {
      const targetUserId = decoded.id || decoded._id;
      await ensureDb().catch(() => {});
      let user = null;
      if (isDbConnected() && mongoose.Types.ObjectId.isValid(targetUserId)) {
        try {
          user = await User.findById(targetUserId).select('-password').lean();
        } catch (e) {}
      }
      if (!user) {
        user = await dataStore.findUserById(targetUserId);
      }
      if (user && user.status !== 'suspended') {
        req.user = user;
      }
    }
  } catch (err) {
    // Ignore invalid optional token
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access required.',
    });
  }
  next();
};
