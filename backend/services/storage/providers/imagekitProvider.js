import fs from 'fs';
import path from 'path';
import { imagekit, isImageKitConfigured } from '../../../config/imagekit.js';

class ImageKitProvider {
  constructor() {
    this.name = 'imagekit';
  }

  isConfigured() {
    return Boolean(isImageKitConfigured && imagekit);
  }

  /**
   * Upload file, buffer, or base64 to ImageKit.io
   */
  async upload(fileInput, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('ImageKit is not configured in .env');
    }

    const {
      folder = 'local2brand_assets',
      originalName = `upload-${Date.now()}`,
      resourceType = 'auto',
      mimeType = '',
    } = options;

    const fileName = path.basename(originalName) || `media-${Date.now()}`;
    let filePayload = fileInput;

    // Read disk file to buffer/base64 if path provided
    if (typeof fileInput === 'string' && fs.existsSync(fileInput)) {
      filePayload = fs.readFileSync(fileInput);
    }

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: filePayload, // buffer, base64, or URL
          fileName,
          folder: `/${folder.replace(/^\//, '')}`,
          useUniqueFileName: true,
          isPrivateFile: false,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            provider: 'imagekit',
            url: result.url,
            publicId: result.fileId,
            name: result.name,
            bytes: result.size,
            format: result.fileType,
            resourceType: result.fileType === 'non-image' ? (mimeType.startsWith('video/') ? 'video' : 'raw') : 'image',
            width: result.width,
            height: result.height,
            thumbnailUrl: result.thumbnailUrl,
            raw: result,
          });
        }
      );
    });
  }

  /**
   * Delete file by fileId or URL
   */
  async delete(identifier, options = {}) {
    if (!this.isConfigured()) return { success: false, message: 'ImageKit not configured' };

    let fileId = identifier;
    // If a full URL is passed, we can query the file details or direct fileId
    if (identifier.startsWith('http')) {
      // If we don't have fileId, we attempt to search by name/path or pass identifier
      fileId = options.fileId || identifier;
    }

    return new Promise((resolve) => {
      imagekit.deleteFile(fileId, (error, result) => {
        if (error) {
          return resolve({ success: false, provider: 'imagekit', error: error.message });
        }
        resolve({ success: true, provider: 'imagekit', result });
      });
    });
  }

  /**
   * Lightweight health check probe
   */
  async healthCheck() {
    if (!this.isConfigured()) {
      return { healthy: false, status: 'NOT_CONFIGURED', error: 'Credentials missing' };
    }
    const start = Date.now();
    return new Promise((resolve) => {
      imagekit.listFiles({ limit: 1 }, (error, result) => {
        if (error) {
          return resolve({
            healthy: false,
            status: 'DEGRADED',
            error: error.message,
            latencyMs: Date.now() - start,
          });
        }
        resolve({
          healthy: true,
          status: 'HEALTHY',
          latencyMs: Date.now() - start,
        });
      });
    });
  }

  /**
   * Get account usage
   */
  async getUsage() {
    if (!this.isConfigured()) {
      return {
        provider: 'imagekit',
        configured: false,
        status: 'NOT_CONFIGURED',
        usage: { usedFormatted: '0 MB', limitFormatted: '20 GB (Free Tier)' },
      };
    }

    // ImageKit Free tier gives 20GB bandwidth + media storage
    return {
      provider: 'imagekit',
      configured: true,
      status: 'HEALTHY',
      plan: 'Free Tier (20 GB)',
      limitBytes: 20 * 1024 * 1024 * 1024,
      limitFormatted: '20 GB',
    };
  }
}

export const imagekitProvider = new ImageKitProvider();
export default imagekitProvider;
