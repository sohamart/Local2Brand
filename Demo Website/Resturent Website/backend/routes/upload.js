const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const cloudinary = require('cloudinary').v2;
const db = require('../db');

// Ensure local uploads directory exists as fallback
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Use Memory Storage for multer so we can stream to Cloudinary or write to local disk
const storage = multer.memoryStorage();

// File filter (accept common image formats)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|svg/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowed.test(ext) || allowed.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WebP, GIF, SVG) are permitted!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter
});

// Helper function to resolve Cloudinary config
function getCloudinaryConfig() {
  let cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  let api_key = process.env.CLOUDINARY_API_KEY;
  let api_secret = process.env.CLOUDINARY_API_SECRET;
  let folder = process.env.CLOUDINARY_FOLDER || 'lamour_restaurant';

  try {
    const rows = db.prepare("SELECT key, value FROM site_settings WHERE key LIKE 'cloudinary_%'").all();
    rows.forEach(r => {
      if (r.key === 'cloudinary_cloud_name' && r.value) cloud_name = r.value.trim();
      if (r.key === 'cloudinary_api_key' && r.value) api_key = r.value.trim();
      if (r.key === 'cloudinary_api_secret' && r.value) api_secret = r.value.trim();
      if (r.key === 'cloudinary_folder' && r.value) folder = r.value.trim();
    });
  } catch (e) {
    // Ignore DB error and rely on process.env
  }

  const isConfigured = Boolean(
    (cloud_name && api_key && api_secret) || process.env.CLOUDINARY_URL
  );

  return {
    isConfigured,
    cloud_name,
    api_key,
    api_secret,
    folder
  };
}

// Upload Single Image endpoint
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const cloudConfig = getCloudinaryConfig();

    // 1. Try Uploading to Cloudinary if configured
    if (cloudConfig.isConfigured) {
      cloudinary.config({
        cloud_name: cloudConfig.cloud_name,
        api_key: cloudConfig.api_key,
        api_secret: cloudConfig.api_secret,
        secure: true
      });

      try {
        const uploadToCloudinary = () => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: cloudConfig.folder || 'lamour_restaurant',
                resource_type: 'auto',
                transformation: [
                  { quality: 'auto', fetch_format: 'auto' }
                ]
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );

            Readable.from(req.file.buffer).pipe(uploadStream);
          });
        };

        const result = await uploadToCloudinary();

        return res.status(201).json({
          message: 'Image uploaded successfully to Cloudinary',
          imageUrl: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          provider: 'cloudinary'
        });
      } catch (cloudErr) {
        console.warn('Cloudinary upload attempt failed, falling back to local storage:', cloudErr.message);
        // Fallback to local storage below
      }
    }

    // 2. Fallback to Local Storage
    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const uniqueName = `dish_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    fs.writeFileSync(filePath, req.file.buffer);

    const imageUrl = `/uploads/${uniqueName}`;
    return res.status(201).json({
      message: 'Image saved to local storage',
      imageUrl,
      filename: uniqueName,
      size: req.file.size,
      provider: 'local'
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to upload image' });
  }
});

// Check Cloudinary Status endpoint
router.get('/status', (req, res) => {
  const cloudConfig = getCloudinaryConfig();
  res.json({
    cloudinaryConfigured: cloudConfig.isConfigured,
    cloudName: cloudConfig.cloud_name ? `${cloudConfig.cloud_name.substring(0, 3)}***` : null,
    folder: cloudConfig.folder
  });
});

module.exports = router;
