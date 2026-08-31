import express from 'express';
import {
  saveRequirementDraft,
  submitRequirement,
  getMyRequirements,
  getRequirementById,
  getAllRequirements,
  updateRequirementStatus
} from '../controllers/requirementController.js';
import { protect, optionalAuth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Client routes
router.post('/', optionalAuth, saveRequirementDraft);
router.post('/:id/submit', optionalAuth, submitRequirement);
router.get('/my', optionalAuth, getMyRequirements);
router.get('/:id', optionalAuth, getRequirementById);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllRequirements);
router.patch('/admin/:id/status', protect, adminOnly, updateRequirementStatus);

export default router;
