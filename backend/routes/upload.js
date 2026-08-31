import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Upload image (Supports auth user or admin)
router.post('/', upload.single('image'), uploadImage);

export default router;
