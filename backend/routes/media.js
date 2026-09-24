import express from 'express';
import {
  getCloudinaryUsage,
  getAllCloudinaryMedia,
  deleteCloudinaryImage,
  bulkDeleteCloudinaryMedia,
  triggerBackupMigration,
  getStorageEvents,
} from '../controllers/mediaController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Admin Multi-Cloud Media Management
router.get('/usage', protect, adminOnly, getCloudinaryUsage);
router.get('/all', protect, adminOnly, getAllCloudinaryMedia);
router.delete('/item', protect, adminOnly, deleteCloudinaryImage);
router.delete('/:public_id(*)', protect, adminOnly, deleteCloudinaryImage);
router.post('/delete-bulk', protect, adminOnly, bulkDeleteCloudinaryMedia);
router.post('/backup', protect, adminOnly, triggerBackupMigration);
router.get('/events', protect, adminOnly, getStorageEvents);

export default router;
