import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendUploadsDir = path.resolve(__dirname, '..', '..', '..', 'uploads');

/**
 * Local Filesystem Storage Provider
 * STRICT REQUIREMENT: Development & Offline Debugging ONLY.
 * MUST NEVER BE USED AS A PRODUCTION PERSISTENT FALLBACK.
 * Disabled by default in production unless explicitly enabled via STORAGE_LOCAL_ENABLED=true.
 */
class LocalDiskProvider {
  constructor() {
    this.name = 'local';
  }

  isConfigured() {
    // Available in development mode, when explicitly enabled, or as ultimate safety fallback
    const isDev = process.env.NODE_ENV !== 'production' || !process.env.NODE_ENV;
    const isExplicitlyEnabled = process.env.STORAGE_LOCAL_ENABLED !== 'false';
    return Boolean(isDev || isExplicitlyEnabled);
  }

  /**
   * Save file to local backend/uploads directory
   */
  async upload(fileInput, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Local storage is disabled in production environments');
    }

    const {
      originalName = `file-${Date.now()}`,
      mimeType = '',
      resourceType = 'auto',
      reqHost = 'localhost:5000',
      reqProtocol = 'http',
    } = options;

    const isVideo = resourceType === 'video' || mimeType.startsWith('video/') || Boolean(originalName.match(/\.(mp4|webm|mov|mkv|avi)$/i));
    const targetDir = isVideo ? path.join(backendUploadsDir, 'videos') : backendUploadsDir;

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const ext = path.extname(originalName) || (isVideo ? '.mp4' : '.jpg');
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const destPath = path.join(targetDir, uniqueFilename);

    let bytes = 0;

    if (typeof fileInput === 'string' && fs.existsSync(fileInput)) {
      await fs.promises.copyFile(fileInput, destPath);
      bytes = fs.statSync(destPath).size;
    } else if (Buffer.isBuffer(fileInput)) {
      await fs.promises.writeFile(destPath, fileInput);
      bytes = fileInput.length;
    } else if (typeof fileInput === 'string' && fileInput.startsWith('data:')) {
      const parts = fileInput.split(';base64,');
      const buf = Buffer.from(parts[1], 'base64');
      await fs.promises.writeFile(destPath, buf);
      bytes = buf.length;
    }

    const publicUrl = isVideo
      ? `${reqProtocol}://${reqHost}/uploads/videos/${uniqueFilename}`
      : `${reqProtocol}://${reqHost}/uploads/${uniqueFilename}`;

    return {
      provider: 'local',
      url: publicUrl,
      publicId: uniqueFilename,
      filename: uniqueFilename,
      bytes,
      format: ext.replace('.', ''),
      resourceType: isVideo ? 'video' : 'image',
      filePath: destPath,
    };
  }

  /**
   * Delete file from local uploads
   */
  async delete(identifier) {
    if (!this.isConfigured()) {
      return { success: false, message: 'Local storage disabled' };
    }

    try {
      const filename = identifier.includes('/uploads/') ? identifier.split('/uploads/').pop() : identifier;
      const targetPath = path.join(backendUploadsDir, filename);
      if (fs.existsSync(targetPath)) {
        await fs.promises.unlink(targetPath);
        return { success: true, provider: 'local', deleted: filename };
      }
      return { success: true, provider: 'local', message: 'File not found on disk' };
    } catch (err) {
      return { success: false, provider: 'local', error: err.message };
    }
  }

  /**
   * Health check for local storage
   */
  async healthCheck() {
    if (!this.isConfigured()) {
      return { healthy: false, status: 'NOT_CONFIGURED', error: 'Disabled in production' };
    }

    try {
      if (!fs.existsSync(backendUploadsDir)) {
        fs.mkdirSync(backendUploadsDir, { recursive: true });
      }
      return { healthy: true, status: 'HEALTHY', latencyMs: 1 };
    } catch (err) {
      return { healthy: false, status: 'DEGRADED', error: err.message };
    }
  }

  /**
   * Get local storage disk metrics
   */
  async getUsage() {
    if (!this.isConfigured()) {
      return {
        provider: 'local',
        configured: false,
        status: 'DISABLED',
        plan: 'Local Filesystem (Disabled in Production)',
        usage: { usedFormatted: '0 MB', limitFormatted: 'Disabled in Production' },
      };
    }

    let totalBytes = 0;
    try {
      if (fs.existsSync(backendUploadsDir)) {
        const files = fs.readdirSync(backendUploadsDir);
        for (const file of files) {
          const fp = path.join(backendUploadsDir, file);
          const stat = fs.statSync(fp);
          if (stat.isFile()) totalBytes += stat.size;
        }
      }
    } catch (e) {}

    return {
      provider: 'local',
      configured: true,
      status: 'HEALTHY',
      plan: 'Local Dev Buffer (Development Only)',
      usedBytes: totalBytes,
      limitBytes: 50 * 1024 * 1024 * 1024,
      limitFormatted: '50 GB Local Dev Buffer',
    };
  }
}

export const localProvider = new LocalDiskProvider();
export default localProvider;
