import express from 'express';
import { getSettings, updateSettings, streamSettingsEvents, getSettingsVersion } from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public: Real-time Server-Sent Events stream for live settings sync
router.get('/events', streamSettingsEvents);
router.get('/stream', streamSettingsEvents);

// Public: Fast settings version check for mobile & cross-device auto sync
router.get('/version', getSettingsVersion);

// Public: Get site settings
router.get('/', getSettings);


// Admin: Update site settings
router.put('/', protect, adminOnly, updateSettings);

export default router;

