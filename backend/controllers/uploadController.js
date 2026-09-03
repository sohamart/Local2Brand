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

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private (or Public for guest profile setup)
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

    if (!filesList || filesList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide one or more image files to upload',
      });
    }

    const uploadedUrls = [];

    for (const file of filesList) {
      const buffer = file.buffer;
      const mimetype = file.mimetype || 'image/jpeg';

      if (isCloudinaryConfigured && buffer) {
        try {
          const result = await uploadBufferToCloudinary(buffer, {
            folder: 'local2brand_assets',
            resource_type: 'image',
          });
          uploadedUrls.push(result.secure_url);
        } catch (cloudErr) {
          console.warn('Cloudinary upload stream notice, using resilient data URI:', cloudErr.message);
          const base64Data = buffer.toString('base64');
          uploadedUrls.push(`data:${mimetype};base64,${base64Data}`);
        }
      } else if (buffer) {
        // Safe, self-contained Data URI that never 404s across serverless lambda instances
        const base64Data = buffer.toString('base64');
        uploadedUrls.push(`data:${mimetype};base64,${base64Data}`);
      } else if (file.path) {
        // Fallback for disk file if present
        if (isCloudinaryConfigured) {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: 'local2brand_assets',
              resource_type: 'image',
            });
            uploadedUrls.push(result.secure_url);
          } catch (e) {}
        }
      }
    }

    if (uploadedUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to process the uploaded file',
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

