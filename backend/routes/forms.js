import express from 'express';
import {
  getPublishedForm,
  getAllForms,
  createForm,
  updateForm,
  publishForm
} from '../controllers/formController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public route for client onboarding
router.get('/published', getPublishedForm);

// Admin routes for Form Builder
router.get('/admin', protect, adminOnly, getAllForms);
router.post('/admin', protect, adminOnly, createForm);
router.put('/admin/:id', protect, adminOnly, updateForm);
router.post('/admin/:id/publish', protect, adminOnly, publishForm);

export default router;
