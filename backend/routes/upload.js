import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

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


export default router;

