import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Authenticated user routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin-only user management routes
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id', protect, adminOnly, updateUserRole);
router.delete('/users/:id', protect, adminOnly, deleteUser);

export default router;
