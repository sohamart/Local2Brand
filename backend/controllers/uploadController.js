import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import fs from 'fs';

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

    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const baseUrl = `${protocol}://${host}`;

    const uploadedUrls = [];

    for (const file of filesList) {
      const filePath = file.path;

      if (isCloudinaryConfigured) {
        try {
          const result = await cloudinary.uploader.upload(filePath, {
            folder: 'local2brand_assets',
            resource_type: 'image',
          });
          uploadedUrls.push(result.secure_url);
          try { fs.unlinkSync(filePath); } catch (e) {}
        } catch (cloudErr) {
          console.warn('Cloudinary upload fallback to local:', cloudErr.message);
          uploadedUrls.push(`${baseUrl}/uploads/${file.filename}`);
        }
      } else {
        uploadedUrls.push(`${baseUrl}/uploads/${file.filename}`);
      }
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
