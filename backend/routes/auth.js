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
  sendVerificationOtp,
  verifyEmailOtp,
  adminToggleVerifyUser,
  adminResendUserOtp,
  sendRewardEmail,
} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendVerificationOtp);
router.post('/verify-otp', verifyEmailOtp);

// Authenticated user routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/claim-reward-email', protect, sendRewardEmail);



// Admin-only user management routes
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id', protect, adminOnly, updateUserRole);
router.put('/users/:id/toggle-verify', protect, adminOnly, adminToggleVerifyUser);
router.post('/users/:id/resend-otp', protect, adminOnly, adminResendUserOtp);
router.delete('/users/:id', protect, adminOnly, deleteUser);

export default router;

