import express from 'express';
import {
  trackPageView,
  recordHeartbeat,
  recordLeave,
  getAnalyticsStats,
} from '../controllers/analyticsController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public telemetry / analytics tracking endpoints
router.post('/track-view', optionalAuth, trackPageView);
router.post('/view', optionalAuth, trackPageView);
router.post('/heartbeat', optionalAuth, recordHeartbeat);
router.post('/leave', recordLeave);

// Analytics statistics query endpoint
router.get('/stats', getAnalyticsStats);

export default router;
