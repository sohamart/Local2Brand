import express from 'express';
import { getAdminStats, markNotificationRead, sendBroadcastEmail } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Admin stats & metrics
router.get('/stats', protect, adminOnly, getAdminStats);

// Mark notification as read
router.put('/notifications/:id/read', protect, adminOnly, markNotificationRead);

// Mass Broadcast Email to registered clients & users
router.post('/broadcast-email', protect, adminOnly, sendBroadcastEmail);

export default router;
