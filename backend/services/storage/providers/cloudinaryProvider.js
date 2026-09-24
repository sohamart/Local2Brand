import fs from 'fs';
import { cloudinary, isCloudinaryConfigured } from '../../../config/cloudinary.js';

class CloudinaryProvider {
  constructor() {
    this.name = 'cloudinary';
  }

  isConfigured() {
    return Boolean(isCloudinaryConfigured);
  }

  /**
   * Upload file or buffer to Cloudinary
   */
  async upload(fileInput, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Cloudinary is not configured in .env');
    }

    const {
      folder = 'local2brand_assets',
      resourceType = 'auto',
      originalName = '',
      mimeType = '',
    } = options;

    const isVideo = resourceType === 'video' || (mimeType && mimeType.startsWith('video/')) || Boolean(originalName.match(/\.(mp4|webm|mov|mkv|avi)$/i));
    const targetFolder = folder || (isVideo ? 'local2brand_videos' : 'local2brand_assets');
    const actualResourceType = isVideo ? 'video' : resourceType === 'raw' ? 'raw' : 'auto';

    // 1. File path on disk
    if (typeof fileInput === 'string' && fs.existsSync(fileInput)) {
      const stats = fs.statSync(fileInput);
      const isLarge = stats.size > 10 * 1024 * 1024 || isVideo;

      return new Promise((resolve, reject) => {
        const uploadOptions = {
          folder: targetFolder,
          resource_type: actualResourceType,
          timeout: 1200000,
        };

        if (isLarge) {
          uploadOptions.chunk_size = 6 * 1024 * 1024;
          cloudinary.uploader.upload_large(fileInput, uploadOptions, (error, result) => {
            if (error) return reject(error);
            resolve({
              provider: 'cloudinary',
              url: result.secure_url || result.url,
              publicId: result.public_id,
              bytes: result.bytes || stats.size,
              format: result.format,
              resourceType: result.resource_type || actualResourceType,
              width: result.width,
              height: result.height,
              raw: result,
            });
          });
        } else {
          cloudinary.uploader.upload(fileInput, uploadOptions, (error, result) => {
            if (error) return reject(error);
            resolve({
              provider: 'cloudinary',
              url: result.secure_url || result.url,
              publicId: result.public_id,
              bytes: result.bytes || stats.size,
              format: result.format,
              resourceType: result.resource_type || actualResourceType,
              width: result.width,
              height: result.height,
              raw: result,
            });
          });
        }
      });
    }

    // 2. Buffer upload
    if (Buffer.isBuffer(fileInput)) {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: targetFolder,
            resource_type: actualResourceType,
            timeout: 900000,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              provider: 'cloudinary',
              url: result.secure_url || result.url,
              publicId: result.public_id,
              bytes: result.bytes || fileInput.length,
              format: result.format,
              resourceType: result.resource_type || actualResourceType,
              width: result.width,
              height: result.height,
              raw: result,
            });
          }
        );
        stream.end(fileInput);
      });
    }

    // 3. Base64 string
    if (typeof fileInput === 'string' && fileInput.startsWith('data:')) {
      const result = await cloudinary.uploader.upload(fileInput, {
        folder: targetFolder,
        resource_type: actualResourceType,
        timeout: 900000,
      });
      return {
        provider: 'cloudinary',
        url: result.secure_url || result.url,
        publicId: result.public_id,
        bytes: result.bytes || 0,
        format: result.format,
        resourceType: result.resource_type || actualResourceType,
        width: result.width,
        height: result.height,
        raw: result,
      };
    }

    throw new Error('Unsupported file input type for Cloudinary upload');
  }

  /**
   * Delete asset by public_id or URL
   */
  async delete(identifier, options = {}) {
    if (!this.isConfigured()) return { success: false, message: 'Cloudinary not configured' };

    let publicId = identifier;
    if (identifier.startsWith('http')) {
      const match = identifier.match(/\/upload\/(?:v\d+\/)?([^\.\?#]+)/);
      if (match) publicId = match[1];
    }

    if (!publicId) return { success: false, message: 'Invalid public_id' };

    const isVideo = options.resourceType === 'video' || identifier.includes('/video/');
    const resType = isVideo ? 'video' : 'image';

    let result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resType,
      invalidate: true,
    });

    if (result?.result !== 'ok' && isVideo) {
      result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    }

    return {
      success: result?.result === 'ok' || result?.result === 'not found',
      provider: 'cloudinary',
      publicId,
      result,
    };
  }

  /**
   * Lightweight health check probe
   */
  async healthCheck() {
    if (!this.isConfigured()) {
      return { healthy: false, status: 'NOT_CONFIGURED', error: 'Credentials missing' };
    }
    const start = Date.now();
    try {
      await cloudinary.api.ping();
      return {
        healthy: true,
        status: 'HEALTHY',
        latencyMs: Date.now() - start,
      };
    } catch (err) {
      return {
        healthy: false,
        status: 'DEGRADED',
        error: err.error?.message || err.message,
        latencyMs: Date.now() - start,
      };
    }
  }

  /**
   * Get account usage metrics
   */
  async getUsage() {
    if (!this.isConfigured()) {
      return {
        provider: 'cloudinary',
        configured: false,
        status: 'NOT_CONFIGURED',
        usage: { usedFormatted: '0 MB', limitFormatted: '25 GB' },
      };
    }

    try {
      const usageData = await cloudinary.api.usage();
      const storageBytes = usageData.storage?.usage || 0;
      const storageLimitBytes = usageData.storage?.limit || 25 * 1024 * 1024 * 1024;
      return {
        provider: 'cloudinary',
        configured: true,
        status: 'HEALTHY',
        plan: usageData.plan || 'Free Tier',
        usedBytes: storageBytes,
        limitBytes: storageLimitBytes,
        credits: usageData.credits || {},
        bandwidthBytes: usageData.bandwidth?.usage || 0,
        resources: usageData.objects?.usage || usageData.resources || 0,
      };
    } catch (err) {
      const errorMsg = err.error?.message || err.message || 'Usage API unavailable';
      return {
        provider: 'cloudinary',
        configured: true,
        status: errorMsg.toLowerCase().includes('disabled customer') ? 'DOWN' : 'DEGRADED',
        error: errorMsg,
        usedBytes: 0,
        limitBytes: 25 * 1024 * 1024 * 1024,
      };
    }
  }
}

export const cloudinaryProvider = new CloudinaryProvider();
export default cloudinaryProvider;
