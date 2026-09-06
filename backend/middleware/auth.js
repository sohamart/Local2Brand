import jwt from 'jsonwebtoken';
import { dataStore, isDbConnected, ensureDb } from '../config/dataAdapter.js';
import { connectDB } from '../config/db.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

const getJwtSecret = () => process.env.JWT_SECRET || 'local2brand_super_secure_jwt_secret_key_2026_ultra_safe';

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

  let decoded;
  try {
    decoded = jwt.verify(token, getJwtSecret());
  } catch (error) {
    // Also try legacy fallback secret for backward session compatibility
    try {
      decoded = jwt.verify(token, 'local2brand_super_secure_jwt_secret_key_2026');
    } catch (e2) {
      return res.status(401).json({
        success: false,
        isAuthError: true,
        message: 'Invalid or expired session token. Please log in again.',
      });
    }
  }

  if (!decoded || !decoded.id) {
    return res.status(401).json({
      success: false,
      isAuthError: true,
      message: 'Invalid token payload.',
    });
  }

  try {
    await ensureDb().catch(() => {});
    let user = null;

    if (isDbConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(decoded.id)) {
          user = await User.findById(decoded.id).select('_id name email role phone company status isEmailVerified avatar createdAt').lean();
        }
        if (!user && decoded.role === 'admin') {
          const adminEmail = (process.env.ADMIN_EMAIL || 'sohamduttabwn@gmail.com').toLowerCase().trim();
          user = await User.findOne({ email: adminEmail }).select('_id name email role phone company status isEmailVerified avatar createdAt').lean() ||
                 await User.findOne({ role: 'admin' }).select('_id name email role phone company status isEmailVerified avatar createdAt').lean();
        }
      } catch (err) {
        console.warn('Protect DB lookup error:', err.message);
      }
    }

    if (!user) {
      user = await dataStore.findUserById(decoded.id);
    }
    if (!user && decoded.role === 'admin') {
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
    let decoded;
    try {
      decoded = jwt.verify(token, getJwtSecret());
    } catch (e) {
      decoded = jwt.verify(token, 'local2brand_super_secure_jwt_secret_key_2026');
    }

    if (decoded && decoded.id) {
      await ensureDb().catch(() => {});
      let user = null;
      if (isDbConnected() && mongoose.Types.ObjectId.isValid(decoded.id)) {
        try {
          user = await User.findById(decoded.id).select('-password').lean();
        } catch (e) {}
      }
      if (!user) {
        user = await dataStore.findUserById(decoded.id);
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
