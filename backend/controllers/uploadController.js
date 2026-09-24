import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { storageHub } from '../services/storage/storageHub.js';
import { providerState, PROVIDER_STATES } from '../services/storage/providerState.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendUploadsDir = path.join(__dirname, '..', 'uploads');

// @desc    Generate signed Cloudinary direct upload signature (Bypasses Vercel 4.5MB payload limit)
// @route   GET /api/upload/signature
// @access  Public
export const getSignature = (req, res) => {
  try {
    const cloudState = providerState.getState('cloudinary');
    const isCloudinaryActive = isCloudinaryConfigured && cloudState.status !== PROVIDER_STATES.DOWN;

    if (!isCloudinaryActive) {
      return res.status(200).json({
        success: true,
        directUpload: false,
        message: 'Direct Cloudinary upload standby. Routing through server Storage Hub.',
      });
    }

    const isVideo =
      req.query?.resource_type === 'video' ||
      req.query?.isVideo === 'true' ||
      req.body?.resource_type === 'video' ||
      req.body?.isVideo === true;

    const folder = req.query?.folder || req.body?.folder || (isVideo ? 'local2brand_videos' : 'local2brand_assets');
    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign = {
      folder,
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

    return res.status(200).json({
      success: true,
      directUpload: true,
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
      resourceType: isVideo ? 'video' : 'auto',
    });
  } catch (error) {
    console.error('Signature generation notice:', error.message);
    return res.status(200).json({
      success: true,
      directUpload: false,
      message: 'Direct upload standby. Routing through server Storage Hub.',
    });
  }
};

// @desc    Upload single or multiple images/videos up to 2024 MB via Smart Storage Hub
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
    const uploadMetadata = [];

    // 1. Process Multipart Files concurrently in parallel through Storage Hub
    if (filesList && filesList.length > 0) {
      const uploadPromises = filesList.map(async (file) => {
        const filePath = file.path;
        const buffer = file.buffer;
        const mimetype = file.mimetype || 'image/jpeg';
        const isVideo = mimetype.startsWith('video/') || Boolean(file.originalname?.match(/\.(mp4|webm|ogg|mov|mkv|avi|wmv|flv|3gp|m4v)$/i));
        const isRaw = Boolean(file.originalname?.match(/\.(apk|aab|ipa|zip|rar|7z|tar|gz|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|ai|psd|eps|cdr)$/i) || mimetype === 'application/vnd.android.package-archive');
        const resourceType = isVideo ? 'video' : isRaw ? 'raw' : 'auto';
        const targetFolder = isVideo ? 'local2brand_videos' : isRaw ? 'local2brand_packages' : 'local2brand_assets';

        if (filePath) {
          tempFilesToDelete.add(filePath);
        }

        const reqProtocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
        const reqHost = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:5000';

        const options = {
          folder: targetFolder,
          resourceType,
          originalName: file.originalname || `upload-${Date.now()}`,
          mimeType: mimetype,
          reqHost,
          reqProtocol,
        };

        const filePayload = filePath || buffer;
        const result = await storageHub.uploadWithFailover(filePayload, options);
        return result;
      });

      const results = await Promise.all(uploadPromises);
      results.forEach((resItem) => {
        if (resItem?.url) {
          uploadedUrls.push(resItem.url);
          uploadMetadata.push(resItem.storage || {});
        }
      });
    }

    // 2. Process Base64 Data URI in JSON body
    const base64Input = req.body?.image || req.body?.file || req.body?.avatar || req.body?.data;
    if (base64Input && typeof base64Input === 'string' && (base64Input.startsWith('data:image') || base64Input.startsWith('data:video'))) {
      const isBase64Video = base64Input.startsWith('data:video');
      const result = await storageHub.uploadWithFailover(base64Input, {
        folder: isBase64Video ? 'local2brand_videos' : 'local2brand_assets',
        resourceType: isBase64Video ? 'video' : 'auto',
        mimeType: isBase64Video ? 'video/mp4' : 'image/jpeg',
        reqHost: req.get('host'),
        reqProtocol: req.protocol || 'http',
      });
      if (result?.url) {
        uploadedUrls.push(result.url);
        uploadMetadata.push(result.storage || {});
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
      message: `${uploadedUrls.length} file(s) uploaded successfully via Multi-Cloud Storage Hub`,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      storage: uploadMetadata[0] || null,
      metadata: uploadMetadata,
    });
  } catch (error) {
    console.error('Multi-Cloud Media Upload Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing media upload',
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

// @desc    Delete media file(s) from whichever cloud provider hosts it
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
        deleted: [],
      });
    }

    const deletionResults = [];

    for (const item of itemsToDelete) {
      if (!item || typeof item !== 'string') continue;
      const delResult = await storageHub.deleteMedia(item);
      deletionResults.push({ item, ...delResult });
    }

    return res.status(200).json({
      success: true,
      message: `${deletionResults.length} item(s) processed for deletion`,
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
