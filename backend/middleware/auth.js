import jwt from 'jsonwebtoken';
import { dataStore } from '../config/dataAdapter.js';
import { connectDB } from '../config/db.js';
import mongoose from 'mongoose';

const getJwtSecret = () => process.env.JWT_SECRET || 'local2brand_super_secure_jwt_secret_key_2026';

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
    return res.status(401).json({
      success: false,
      isAuthError: true,
      message: 'Invalid or expired session token. Please log in again.',
    });
  }

  if (!decoded || !decoded.id) {
    return res.status(401).json({
      success: false,
      isAuthError: true,
      message: 'Invalid token payload.',
    });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    let user = await dataStore.findUserById(decoded.id);

    // If cold start query returned null, retry once with explicit connectDB
    if (!user) {
      await connectDB();
      user = await dataStore.findUserById(decoded.id);
    }

    // If user not found by ID but token has admin role, fallback to master admin
    if (!user && decoded.role === 'admin') {
      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@local2brand.com').toLowerCase().trim();
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
    const decoded = jwt.verify(token, getJwtSecret());

    if (decoded && decoded.id) {
      if (mongoose.connection.readyState !== 1) {
        await connectDB();
      }

      const user = await dataStore.findUserById(decoded.id);
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
