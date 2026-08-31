import express from 'express';
import {
  createCallback,
  getUserCallbacks,
  getAllCallbacks,
  updateCallbackStatus,
  deleteCallback,
} from '../controllers/callbackController.js';
import { protect, optionalAuth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public / User request callback
router.post('/', optionalAuth, createCallback);

// User view own callbacks
router.get('/my', protect, getUserCallbacks);

// Admin view all callbacks
router.get('/', protect, adminOnly, getAllCallbacks);

// Admin update callback status & notes
router.put('/:id', protect, adminOnly, updateCallbackStatus);

// Admin delete callback
router.delete('/:id', protect, adminOnly, deleteCallback);

export default router;
