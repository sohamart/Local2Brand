import express from 'express';
import { uploadImage, deleteMedia, getSignature } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Generate signed upload parameters for direct Cloudinary client upload (Bypasses Vercel 4.5MB limits)
router.get('/signature', getSignature);
router.post('/signature', getSignature);

// Safe upload handler with explicit error interception and no timeout for 2GB streaming
router.post(
  '/',
  (req, res, next) => {
    // Disable socket timeouts for large 2GB media streaming
    if (req.socket) {
      req.socket.setTimeout(0);
    }
    req.setTimeout(0);

    upload.any()(req, res, (err) => {
      if (err) {
        console.warn('Multer upload notice:', err.message);
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload validation error',
        });
      }
      next();
    });
  },
  uploadImage
);

// Delete media from Cloudinary / local storage
router.delete('/', deleteMedia);
router.post('/delete', deleteMedia);

export default router;

