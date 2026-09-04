import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

// Helper to upload a buffer to Cloudinary via stream
const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
};

// @desc    Upload single or multiple images (FormData or Base64 Data URI)
// @route   POST /api/upload
// @access  Public
export const uploadImage = async (req, res) => {
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

    // 1. Process Multipart Files
    if (filesList && filesList.length > 0) {
      for (const file of filesList) {
        const buffer = file.buffer;
        const mimetype = file.mimetype || 'image/jpeg';
        const isVideo = mimetype.startsWith('video/');
        const resourceType = isVideo ? 'video' : 'auto';

        if (isCloudinaryConfigured && buffer) {
          try {
            const result = await uploadBufferToCloudinary(buffer, {
              folder: isVideo ? 'local2brand_videos' : 'local2brand_assets',
              resource_type: resourceType,
            });
            uploadedUrls.push(result.secure_url);
          } catch (cloudErr) {
            console.warn('Cloudinary upload stream notice, using resilient data URI:', cloudErr.message);
            const base64Data = buffer.toString('base64');
            uploadedUrls.push(`data:${mimetype};base64,${base64Data}`);
          }
        } else if (buffer) {
          const base64Data = buffer.toString('base64');
          uploadedUrls.push(`data:${mimetype};base64,${base64Data}`);
        } else if (file.path) {
          if (isCloudinaryConfigured) {
            try {
              const result = await cloudinary.uploader.upload(file.path, {
                folder: isVideo ? 'local2brand_videos' : 'local2brand_assets',
                resource_type: resourceType,
              });
              uploadedUrls.push(result.secure_url);
            } catch (e) {}
          }
        }
      }
    }

    // 2. Process Base64 Data URI in JSON body
    const base64Input = req.body?.image || req.body?.file || req.body?.avatar || req.body?.data;
    if (base64Input && typeof base64Input === 'string' && (base64Input.startsWith('data:image') || base64Input.startsWith('data:video'))) {
      const isBase64Video = base64Input.startsWith('data:video');
      if (isCloudinaryConfigured) {
        try {
          const result = await cloudinary.uploader.upload(base64Input, {
            folder: isBase64Video ? 'local2brand_videos' : 'local2brand_assets',
            resource_type: isBase64Video ? 'video' : 'auto',
          });
          uploadedUrls.push(result.secure_url);
        } catch (cloudErr) {
          console.warn('Cloudinary base64 upload notice:', cloudErr.message);
          uploadedUrls.push(base64Input);
        }
      } else {
        uploadedUrls.push(base64Input);
      }
    }

    if (uploadedUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide one or more image files or valid base64 data to upload',
      });
    }

    return res.status(200).json({
      success: true,
      message: `${uploadedUrls.length} file(s) uploaded successfully`,
      url: uploadedUrls[0],
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing image upload',
    });
  }
};


