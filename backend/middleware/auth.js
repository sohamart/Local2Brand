import jwt from 'jsonwebtoken';
import { dataStore } from '../config/dataAdapter.js';
import { connectDB } from '../config/db.js';
import mongoose from 'mongoose';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token missing. Access denied.',
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'local2brand_super_secure_jwt_secret_key_2026_ultra_safe'
    );
  } catch (error) {
    return res.status(401).json({
      success: false,
      isAuthError: true,
      message: 'Invalid or expired token. Please log in again.',
    });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    let user = await dataStore.findUserById(decoded.id);

    // If user not found by ID but token has admin role, fallback to master admin
    if (!user && decoded.role === 'admin') {
      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@local2brand.com').toLowerCase().trim();
      user = await dataStore.findUserByEmail(adminEmail) || await dataStore.findUserByEmail('admin@local2brand.com');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        isAuthError: true,
        message: 'The user belonging to this token no longer exists.',
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
    console.error('Protect middleware database lookup error:', dbErr.message);
    return res.status(500).json({
      success: false,
      message: 'Temporary server error verifying credentials. Please try again.',
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'local2brand_super_secure_jwt_secret_key_2026_ultra_safe'
    );

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const user = await dataStore.findUserById(decoded.id);
    if (user && user.status !== 'suspended') {
      req.user = user;
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

