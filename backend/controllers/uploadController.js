import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import fs from 'fs';

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private (or Public for guest profile setup)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file to upload',
      });
    }

    const filePath = req.file.path;

    if (isCloudinaryConfigured) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'local2brand_assets',
        resource_type: 'image',
      });

      // Remove temp local file after Cloudinary upload
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        // ignore unlink error
      }

      return res.status(200).json({
        success: true,
        message: 'Image uploaded successfully to Cloudinary',
        url: result.secure_url,
        publicId: result.public_id,
      });
    } else {
      // Return hosted local server URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const localUrl = `${baseUrl}/uploads/${req.file.filename}`;

      return res.status(200).json({
        success: true,
        message: 'Image uploaded successfully (Local storage fallback)',
        url: localUrl,
        filename: req.file.filename,
      });
    }
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing image upload',
    });
  }
};
