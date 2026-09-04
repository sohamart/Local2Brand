import multer from 'multer';
import os from 'os';
import path from 'path';

// Disk storage in temp directory for handling large files (up to 2GB) without RAM exhaustion
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || '') || '.bin';
    cb(null, `l2b-${uniqueSuffix}${ext}`);
  },
});

// File filter (images and video media)
const fileFilter = (req, file, cb) => {
  if (
    !file.mimetype ||
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype === 'application/octet-stream' ||
    file.originalname?.match(/\.(mp4|webm|ogg|mov|mkv|avi|jpg|jpeg|png|webp|gif|svg)$/i)
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only video and image formats are supported.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2024 * 1024 * 1024, // 2024 MB
    fieldSize: 2024 * 1024 * 1024, // 2024 MB
    fields: 50,
    files: 20,
  },
});





