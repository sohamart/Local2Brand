import express from 'express';
import {
  saveRequirementDraft,
  submitRequirement,
  getMyRequirements,
  getRequirementById,
  getAllRequirements,
  updateRequirementStatus,
  deleteRequirement
} from '../controllers/requirementController.js';
import { protect, optionalAuth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Client routes
router.post('/', optionalAuth, saveRequirementDraft);
router.post('/submit', optionalAuth, submitRequirement);
router.post('/:id/submit', optionalAuth, submitRequirement);
router.get('/my', optionalAuth, getMyRequirements);
router.get('/user/me', optionalAuth, getMyRequirements);
router.get('/:id', optionalAuth, getRequirementById);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllRequirements);
router.put('/admin/:id', protect, adminOnly, updateRequirementStatus);
router.patch('/admin/:id', protect, adminOnly, updateRequirementStatus);
router.patch('/admin/:id/status', protect, adminOnly, updateRequirementStatus);
router.patch('/:id/status', protect, adminOnly, updateRequirementStatus);
router.put('/admin/:id/status', protect, adminOnly, updateRequirementStatus);
router.put('/:id/status', protect, adminOnly, updateRequirementStatus);
router.delete('/admin/:id', protect, adminOnly, deleteRequirement);
router.delete('/:id', protect, adminOnly, deleteRequirement);

export default router;

