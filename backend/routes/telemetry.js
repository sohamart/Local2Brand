import express from 'express';
import { recordPageView, recordHeartbeat } from '../controllers/telemetryController.js';

const router = express.Router();

// Public telemetry endpoints
router.post('/view', recordPageView);
router.post('/heartbeat', recordHeartbeat);

export default router;
