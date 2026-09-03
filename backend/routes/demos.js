import express from 'express';
import {
  getDemos,
  getDemoByIdOrSlug,
  createDemo,
  updateDemo,
  deleteDemo,
  reorderDemos,
} from '../controllers/demoController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public: Get all demos or single demo by slug/ID
router.get('/', getDemos);
router.get('/:id', getDemoByIdOrSlug);

// Admin: Reorder demos
router.put('/reorder', protect, adminOnly, reorderDemos);

// Admin: CRUD demos
router.post('/', protect, adminOnly, createDemo);
router.put('/:id', protect, adminOnly, updateDemo);
router.delete('/:id', protect, adminOnly, deleteDemo);

export default router;

