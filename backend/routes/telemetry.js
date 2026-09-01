import express from 'express';
import {
  recordPageView,
  recordHeartbeat,
  recordLeave,
  getLiveTelemetry
} from '../controllers/telemetryController.js';

const router = express.Router();

// Public telemetry endpoints
router.post('/view', recordPageView);
router.post('/heartbeat', recordHeartbeat);
router.post('/leave', recordLeave);
router.get('/stats', getLiveTelemetry);

export default router;
