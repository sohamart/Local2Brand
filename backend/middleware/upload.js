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

// File filter (images, video media, audio, documents, APK and application packages)
const fileFilter = (req, file, cb) => {
  const mime = (file.mimetype || '').toLowerCase();
  const name = (file.originalname || '').toLowerCase();

  // Allow standard image, video, audio, and generic streams
  if (
    !mime ||
    mime.startsWith('image/') ||
    mime.startsWith('video/') ||
    mime.startsWith('audio/') ||
    mime === 'application/octet-stream' ||
    mime === 'application/pdf' ||
    mime.includes('zip') ||
    mime.includes('tar') ||
    mime.includes('document') ||
    mime.includes('msword') ||
    mime.includes('sheet') ||
    mime.includes('excel') ||
    mime.includes('presentation') ||
    mime === 'application/vnd.android.package-archive' ||
    name.match(/\.(mp4|webm|ogg|mov|mkv|avi|wmv|flv|3gp|m4v|jpg|jpeg|png|webp|gif|svg|avif|jfif|heic|heif|bmp|tiff|tif|ico|apk|aab|ipa|zip|rar|7z|tar|gz|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|ai|psd|eps|cdr|mp3|wav|m4a|aac|flac)$/i)
  ) {
    // Only reject explicitly dangerous executable files
    if (name.match(/\.(exe|bat|cmd|sh|vbs|msi|com|scr)$/i)) {
      cb(new Error('Executable script files (.exe, .bat, etc.) are restricted for security reasons.'), false);
    } else {
      cb(null, true);
    }
  } else {
    // Default safe allow for user assets
    cb(null, true);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2024 * 1024 * 1024, // 2024 MB
    fieldSize: 2024 * 1024 * 1024, // 2024 MB
    fields: 100,
    files: 50,
  },
});





