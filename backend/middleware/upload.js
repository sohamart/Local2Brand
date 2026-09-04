import multer from 'multer';

// Memory storage for serverless and local environments
const storage = multer.memoryStorage();

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
    fileSize: 2048 * 1024 * 1024, // 2 GB (2147483648 bytes)
    fieldSize: 2048 * 1024 * 1024,
    fields: 50,
    files: 20,
  },
});



