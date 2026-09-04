import express from 'express';
import {
  getReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
  adminGetAllReviews,
  adminUpdateStatus,
} from '../controllers/reviewController.js';
import { protect, optionalAuth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public / Guest / Client routes
router.get('/', getReviews);
router.post('/', optionalAuth, createReview);

// Logged-in User routes
router.get('/my', optionalAuth, getMyReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Admin Management routes
router.get('/admin/all', protect, adminOnly, adminGetAllReviews);
router.patch('/admin/:id/status', protect, adminOnly, adminUpdateStatus);
router.delete('/admin/:id', protect, adminOnly, deleteReview);

export default router;
