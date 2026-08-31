import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Upload image (Supports any field name: image, file, avatar, etc.)
router.post('/', upload.any(), uploadImage);

export default router;
