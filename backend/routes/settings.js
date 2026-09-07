import express from 'express';
import { getSettings, updateSettings, streamSettingsEvents } from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public: Real-time Server-Sent Events stream for live settings sync
router.get('/events', streamSettingsEvents);
router.get('/stream', streamSettingsEvents);

// Public: Get site settings
router.get('/', getSettings);

// Admin: Update site settings
router.put('/', protect, adminOnly, updateSettings);

export default router;

