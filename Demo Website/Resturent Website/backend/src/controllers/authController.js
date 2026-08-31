import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'gourmetos_super_secure_jwt_secret_key_2026_antigravity', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, restaurantId } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: role || 'customer',
      restaurantId: restaurantId || req.tenantId || null,
      loyaltyPoints: 100,
      referralCode: name.slice(0, 4).toUpperCase() + '20'
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
        avatar: user.avatar,
        loyaltyPoints: user.loyaltyPoints,
        referralCode: user.referralCode,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
