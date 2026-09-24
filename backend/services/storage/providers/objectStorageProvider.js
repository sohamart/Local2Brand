import fs from 'fs';
import path from 'path';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';

/**
 * Generic Persistent Object Storage Provider
 * Implements S3-compatible cloud storage (AWS S3, MinIO, Wasabi, Cloudflare R2, Backblaze B2, Tigris, etc.)
 * Configurable dynamically via environment variables.
 * If credentials are not configured, gracefully reports isConfigured() = false with zero crash risk.
 */
class ObjectStorageProvider {
  constructor() {
    this.name = 'objectStorage';
    this.client = null;
    this.initClient();
  }

  initClient() {
    const bucket = process.env.OBJECT_STORAGE_BUCKET;
    const accessKeyId = process.env.OBJECT_STORAGE_ACCESS_KEY;
    const secretAccessKey = process.env.OBJECT_STORAGE_SECRET_KEY;
    const endpoint = process.env.OBJECT_STORAGE_ENDPOINT;
    const region = process.env.OBJECT_STORAGE_REGION || 'auto';

    if (bucket && accessKeyId && secretAccessKey) {
      try {
        const clientConfig = {
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        };

        if (endpoint) {
          clientConfig.endpoint = endpoint;
          clientConfig.forcePathStyle = true; // Required for MinIO & some custom S3 endpoints
        }

        this.client = new S3Client(clientConfig);
        console.log(`✅ Object Storage SDK Initialized (${process.env.OBJECT_STORAGE_PROVIDER || 'S3-Compatible'})`);
      } catch (err) {
        console.warn('⚠️ Object Storage initialization notice:', err.message);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  isConfigured() {
    return Boolean(
      this.client &&
      process.env.OBJECT_STORAGE_BUCKET &&
      process.env.OBJECT_STORAGE_ACCESS_KEY &&
      process.env.OBJECT_STORAGE_SECRET_KEY
    );
  }

  /**
   * Upload file, buffer, or base64 to Persistent Object Storage
   */
  async upload(fileInput, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Persistent Object Storage is not configured in environment variables');
    }

    const {
      folder = 'local2brand_assets',
      originalName = `upload-${Date.now()}`,
      resourceType = 'auto',
      mimeType = 'application/octet-stream',
    } = options;

    const ext = path.extname(originalName) || (resourceType === 'video' ? '.mp4' : '.jpg');
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const uniqueKey = `${cleanFolder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;

    let bodyBuffer;
    let contentLength = 0;

    if (typeof fileInput === 'string' && fs.existsSync(fileInput)) {
      bodyBuffer = await fs.promises.readFile(fileInput);
      contentLength = bodyBuffer.length;
    } else if (Buffer.isBuffer(fileInput)) {
      bodyBuffer = fileInput;
      contentLength = fileInput.length;
    } else if (typeof fileInput === 'string' && fileInput.startsWith('data:')) {
      const parts = fileInput.split(';base64,');
      bodyBuffer = Buffer.from(parts[1], 'base64');
      contentLength = bodyBuffer.length;
    } else {
      throw new Error('Unsupported file input type for Object Storage upload');
    }

    const bucket = process.env.OBJECT_STORAGE_BUCKET;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: uniqueKey,
      Body: bodyBuffer,
      ContentType: mimeType || 'application/octet-stream',
    });

    await this.client.send(command);

    // Compute public URL
    const publicDomain = process.env.OBJECT_STORAGE_PUBLIC_DOMAIN;
    let publicUrl = '';

    if (publicDomain) {
      publicUrl = `${publicDomain.replace(/\/+$/, '')}/${uniqueKey}`;
    } else if (process.env.OBJECT_STORAGE_ENDPOINT) {
      publicUrl = `${process.env.OBJECT_STORAGE_ENDPOINT.replace(/\/+$/, '')}/${bucket}/${uniqueKey}`;
    } else {
      publicUrl = `https://${bucket}.s3.amazonaws.com/${uniqueKey}`;
    }

    return {
      provider: 'objectStorage',
      url: publicUrl,
      publicId: uniqueKey,
      key: uniqueKey,
      bucket,
      bytes: contentLength,
      format: ext.replace('.', ''),
      resourceType: resourceType === 'video' ? 'video' : 'image',
    };
  }

  /**
   * Delete object from Persistent Object Storage
   */
  async delete(identifier, options = {}) {
    if (!this.isConfigured()) {
      return { success: false, message: 'Persistent Object Storage not configured' };
    }

    let key = identifier;
    if (identifier.startsWith('http')) {
      // Extract key from URL
      try {
        const urlObj = new URL(identifier);
        key = urlObj.pathname.replace(/^\/+/, '');
        const bucket = process.env.OBJECT_STORAGE_BUCKET;
        if (key.startsWith(`${bucket}/`)) {
          key = key.substring(bucket.length + 1);
        }
      } catch (e) {
        key = identifier;
      }
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.OBJECT_STORAGE_BUCKET,
      Key: key,
    });

    await this.client.send(command);
    return { success: true, provider: 'objectStorage', key };
  }

  /**
   * Lightweight health check probe
   */
  async healthCheck() {
    if (!this.isConfigured()) {
      return { healthy: false, status: 'NOT_CONFIGURED', error: 'Credentials not configured' };
    }

    const start = Date.now();
    try {
      const command = new HeadBucketCommand({
        Bucket: process.env.OBJECT_STORAGE_BUCKET,
      });
      await this.client.send(command);
      return {
        healthy: true,
        status: 'HEALTHY',
        latencyMs: Date.now() - start,
      };
    } catch (err) {
      return {
        healthy: false,
        status: 'DEGRADED',
        error: err.message,
        latencyMs: Date.now() - start,
      };
    }
  }

  /**
   * Get quota / usage
   */
  async getUsage() {
    if (!this.isConfigured()) {
      return {
        provider: 'objectStorage',
        configured: false,
        status: 'NOT_CONFIGURED',
        plan: process.env.OBJECT_STORAGE_PROVIDER || 'S3-Compatible Object Storage',
        usage: { usedFormatted: 'N/A', limitFormatted: 'Quota: Unavailable' },
      };
    }

    return {
      provider: 'objectStorage',
      configured: true,
      status: 'HEALTHY',
      plan: process.env.OBJECT_STORAGE_PROVIDER || 'S3-Compatible Object Storage',
      usage: { usedFormatted: 'Available', limitFormatted: 'Quota: Unavailable' },
    };
  }
}

export const objectStorageProvider = new ObjectStorageProvider();
export default objectStorageProvider;
