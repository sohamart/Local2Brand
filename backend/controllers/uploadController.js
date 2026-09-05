import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendUploadsDir = path.join(__dirname, '..', 'uploads');

// Helper to upload media files directly to Cloudinary (single or chunked)
const uploadFileToCloudinary = (filePath, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const stats = fs.statSync(filePath);
      const isVideo = options.resource_type === 'video';
      const isLarge = stats.size > 40 * 1024 * 1024; // If > 40MB, use chunked upload_large

      console.log(`☁️ Uploading to Cloudinary [Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB, Resource: ${options.resource_type || 'auto'}, Method: ${isLarge ? 'upload_large' : 'upload'}]...`);

      if (isLarge) {
        cloudinary.uploader.upload_large(
          filePath,
          {
            resource_type: isVideo ? 'video' : 'auto',
            chunk_size: 6 * 1024 * 1024, // 6 MB chunks (Cloudinary standard)
            timeout: 1200000,
            ...options,
          },
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary upload_large error:', error);
              return reject(error);
            }
            console.log('✅ Cloudinary upload_large complete:', result?.secure_url);
            resolve(result);
          }
        );
      } else {
        cloudinary.uploader.upload(
          filePath,
          {
            resource_type: isVideo ? 'video' : 'auto',
            timeout: 600000,
            ...options,
          },
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary upload error:', error);
              return reject(error);
            }
            console.log('✅ Cloudinary upload complete:', result?.secure_url);
            resolve(result);
          }
        );
      }
    } catch (err) {
      reject(err);
    }
  });
};

// Helper to upload a buffer to Cloudinary via stream (fallback if in-memory)
const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        timeout: 900000,
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// @desc    Upload single or multiple images/videos up to 2024 MB directly to Cloudinary CDN
// @route   POST /api/upload
// @access  Public
export const uploadImage = async (req, res) => {
  const tempFilesToDelete = new Set();

  try {
    let filesList = [];
    if (req.file) {
      filesList = [req.file];
    } else if (req.files) {
      if (Array.isArray(req.files)) {
        filesList = req.files;
      } else {
        Object.values(req.files).forEach((arr) => {
          if (Array.isArray(arr)) filesList.push(...arr);
        });
      }
    }

    if (filesList.length > 1) {
      const seenFiles = new Set();
      const uniqueFiles = [];
      for (const f of filesList) {
        const fileKey = `${f.originalname || ''}_${f.size || ''}_${f.mimetype || ''}`;
        if (!seenFiles.has(fileKey)) {
          seenFiles.add(fileKey);
          uniqueFiles.push(f);
        }
      }
      filesList = uniqueFiles;
    }

    const uploadedUrls = [];

    // 1. Process Multipart Files concurrently in parallel
    if (filesList && filesList.length > 0) {
      const uploadPromises = filesList.map(async (file) => {
        const filePath = file.path;
        const buffer = file.buffer;
        const mimetype = file.mimetype || 'image/jpeg';
        const isVideo = mimetype.startsWith('video/') || file.originalname?.match(/\.(mp4|webm|ogg|mov|mkv|avi)$/i);
        const resourceType = isVideo ? 'video' : 'auto';
        const targetFolder = isVideo ? 'local2brand_videos' : 'local2brand_assets';

        if (filePath) {
          tempFilesToDelete.add(filePath);
        }

        if (isCloudinaryConfigured) {
          if (filePath) {
            try {
              // Direct high-speed Cloudinary upload
              const result = await uploadFileToCloudinary(filePath, {
                folder: targetFolder,
                resource_type: resourceType,
              });
              if (result?.secure_url) {
                return result.secure_url;
              }
            } catch (cloudErr) {
              console.warn('ℹ️ Cloudinary upload notice, saving to persistent server storage:', cloudErr.message);
              
              // Fallback to server local storage if Cloudinary fails or is throttled
              const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname || '') || (isVideo ? '.mp4' : '.jpg')}`;
              const targetDir = isVideo ? path.join(backendUploadsDir, 'videos') : backendUploadsDir;
              
              try {
                if (!fs.existsSync(targetDir)) {
                  fs.mkdirSync(targetDir, { recursive: true });
                }
                const destPath = path.join(targetDir, uniqueFilename);
                await fs.promises.copyFile(filePath, destPath);
                
                const hostUrl = req.get('host');
                const protocol = req.protocol || 'http';
                return isVideo 
                  ? `${protocol}://${hostUrl}/uploads/videos/${uniqueFilename}` 
                  : `${protocol}://${hostUrl}/uploads/${uniqueFilename}`;
              } catch (fsErr) {
                console.error('Local storage fallback error:', fsErr);
                throw cloudErr;
              }
            }
          } else if (buffer) {
            try {
              const result = await uploadBufferToCloudinary(buffer, {
                folder: targetFolder,
                resource_type: resourceType,
              });
              if (result?.secure_url) {
                return result.secure_url;
              }
            } catch (cloudErr) {
              console.warn('Cloudinary buffer error:', cloudErr.message);
              if (buffer.length < 5 * 1024 * 1024) {
                return `data:${mimetype};base64,${buffer.toString('base64')}`;
              } else {
                throw cloudErr;
              }
            }
          }
        } else {
          // Offline fallback when Cloudinary is not configured
          if (filePath) {
            const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname || '') || (isVideo ? '.mp4' : '.jpg')}`;
            const targetDir = isVideo ? path.join(backendUploadsDir, 'videos') : backendUploadsDir;
            if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
            const destPath = path.join(targetDir, uniqueFilename);
            await fs.promises.copyFile(filePath, destPath);
            const hostUrl = req.get('host');
            const protocol = req.protocol || 'http';
            return isVideo 
              ? `${protocol}://${hostUrl}/uploads/videos/${uniqueFilename}` 
              : `${protocol}://${hostUrl}/uploads/${uniqueFilename}`;
          } else if (buffer && buffer.length < 5 * 1024 * 1024) {
            return `data:${mimetype};base64,${buffer.toString('base64')}`;
          }
        }
        return null;
      });

      const results = await Promise.all(uploadPromises);
      results.forEach((url) => {
        if (url) uploadedUrls.push(url);
      });
    }

    // 2. Process Base64 Data URI in JSON body
    const base64Input = req.body?.image || req.body?.file || req.body?.avatar || req.body?.data;
    if (base64Input && typeof base64Input === 'string' && (base64Input.startsWith('data:image') || base64Input.startsWith('data:video'))) {
      const isBase64Video = base64Input.startsWith('data:video');
      if (isCloudinaryConfigured) {
        const result = await cloudinary.uploader.upload(base64Input, {
          folder: isBase64Video ? 'local2brand_videos' : 'local2brand_assets',
          resource_type: isBase64Video ? 'video' : 'auto',
          timeout: 900000,
        });
        if (result?.secure_url) {
          uploadedUrls.push(result.secure_url);
        }
      } else {
        uploadedUrls.push(base64Input);
      }
    }

    if (uploadedUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid media file was processed. Please try again.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `${uploadedUrls.length} file(s) uploaded successfully`,
      url: uploadedUrls[0],
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing media upload to Cloudinary',
    });
  } finally {
    // Clean up temporary disk files safely
    for (const tempPath of tempFilesToDelete) {
      try {
        if (fs.existsSync(tempPath)) {
          await fs.promises.unlink(tempPath);
        }
      } catch (e) {
        // Ignored
      }
    }
  }
};

// Helper to extract Cloudinary public_id from URL
const extractPublicId = (urlOrPublicId) => {
  if (!urlOrPublicId || typeof urlOrPublicId !== 'string') return null;
  if (!urlOrPublicId.startsWith('http')) return urlOrPublicId;
  try {
    const uploadIndex = urlOrPublicId.indexOf('/upload/');
    if (uploadIndex === -1) return null;
    let afterUpload = urlOrPublicId.substring(uploadIndex + 8);
    // Remove version tag e.g. v1725547890/
    afterUpload = afterUpload.replace(/^v\d+\//, '');
    // Remove file extension .jpg, .png, etc.
    const lastDot = afterUpload.lastIndexOf('.');
    if (lastDot !== -1) {
      afterUpload = afterUpload.substring(0, lastDot);
    }
    return afterUpload;
  } catch (e) {
    return null;
  }
};

// @desc    Delete media file(s) from Cloudinary CDN or local uploads storage
// @route   DELETE /api/upload or POST /api/upload/delete
// @access  Public
export const deleteMedia = async (req, res) => {
  try {
    const { url, urls, public_id, public_ids } = req.body || {};
    const itemsToDelete = [];

    if (url) itemsToDelete.push(url);
    if (public_id) itemsToDelete.push(public_id);
    if (Array.isArray(urls)) itemsToDelete.push(...urls);
    if (Array.isArray(public_ids)) itemsToDelete.push(...public_ids);

    if (itemsToDelete.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No media items to delete',
        deleted: []
      });
    }

    const deletionResults = [];

    for (const item of itemsToDelete) {
      if (!item || typeof item !== 'string') continue;

      // 1. Cloudinary deletion
      if (item.includes('res.cloudinary.com') || (!item.startsWith('http') && item.includes('/'))) {
        const publicId = extractPublicId(item);
        if (publicId && isCloudinaryConfigured) {
          try {
            const isVideo = item.includes('/video/') || Boolean(item.match(/\.(mp4|webm|mov|mkv|avi)$/i));
            const resType = isVideo ? 'video' : 'image';
            let destroyResult = await cloudinary.uploader.destroy(publicId, {
              resource_type: resType,
              invalidate: true,
            });
            if (destroyResult?.result !== 'ok' && isVideo) {
              destroyResult = await cloudinary.uploader.destroy(publicId, { invalidate: true });
            }
            deletionResults.push({ item, publicId, status: destroyResult?.result || 'ok' });
          } catch (cloudErr) {
            console.warn('Cloudinary destroy notice:', cloudErr.message);
          }
        }
      }

      // 2. Local uploads folder deletion
      if (item.includes('/uploads/')) {
        try {
          const filename = item.split('/uploads/').pop();
          if (filename) {
            const localFilePath = path.join(backendUploadsDir, filename);
            if (fs.existsSync(localFilePath)) {
              await fs.promises.unlink(localFilePath);
              deletionResults.push({ item, status: 'deleted_local' });
            }
          }
        } catch (fsErr) {
          console.warn('Local file unlink notice:', fsErr.message);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `${deletionResults.length} item(s) deleted successfully`,
      deleted: deletionResults,
    });
  } catch (error) {
    console.error('Delete media error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting media',
    });
  }
};



