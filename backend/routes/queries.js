import express from 'express';
import {
  createQueryLead,
  getUserQueries,
  getAllQueries,
  getQueryById,
  updateQueryStatus,
  deleteQuery,
  exportQueriesCsv,
} from '../controllers/queryController.js';
import { protect, optionalAuth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public / User create proposal inquiry
router.post('/', optionalAuth, createQueryLead);

// User view their own inquiries
router.get('/my', optionalAuth, getUserQueries);

// Admin export to CSV
router.get('/export/csv', protect, adminOnly, exportQueriesCsv);

// Admin view all inquiries
router.get('/', protect, adminOnly, getAllQueries);

// View single inquiry
router.get('/:id', protect, getQueryById);

// Admin update status & notes
router.put('/:id', protect, adminOnly, updateQueryStatus);

// Admin delete inquiry
router.delete('/:id', protect, adminOnly, deleteQuery);

export default router;
