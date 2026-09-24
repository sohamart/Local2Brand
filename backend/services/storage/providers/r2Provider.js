import fs from 'fs';
import path from 'path';
import { PutObjectCommand, DeleteObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { s3Client, isR2Configured, bucketName, publicDomain } from '../../../config/s3r2.js';

class CloudflareR2Provider {
  constructor() {
    this.name = 'r2';
  }

  isConfigured() {
    return Boolean(isR2Configured && s3Client);
  }

  /**
   * Upload file or buffer to Cloudflare R2 / AWS S3
   */
  async upload(fileInput, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Cloudflare R2 is not configured in .env');
    }

    const {
      folder = 'local2brand_assets',
      originalName = `file-${Date.now()}`,
      mimeType = 'application/octet-stream',
    } = options;

    const ext = path.extname(originalName) || '';
    const uniqueKey = `${folder.replace(/^\//, '')}/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    let body = fileInput;
    let contentLength = 0;

    if (typeof fileInput === 'string' && fs.existsSync(fileInput)) {
      body = fs.readFileSync(fileInput);
      contentLength = body.length;
    } else if (Buffer.isBuffer(fileInput)) {
      contentLength = fileInput.length;
    } else if (typeof fileInput === 'string' && fileInput.startsWith('data:')) {
      const parts = fileInput.split(';base64,');
      body = Buffer.from(parts[1], 'base64');
      contentLength = body.length;
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      Body: body,
      ContentType: mimeType,
    });

    await s3Client.send(command);

    // Build public CDN URL
    let publicUrl = '';
    if (publicDomain) {
      const cleanDomain = publicDomain.replace(/\/$/, '');
      publicUrl = `${cleanDomain}/${uniqueKey}`;
    } else {
      publicUrl = `https://${bucketName}.r2.dev/${uniqueKey}`;
    }

    const isVideo = mimeType.startsWith('video/') || ext.match(/\.(mp4|webm|mov|mkv|avi)$/i);

    return {
      provider: 'r2',
      url: publicUrl,
      publicId: uniqueKey,
      key: uniqueKey,
      bytes: contentLength,
      format: ext.replace('.', ''),
      resourceType: isVideo ? 'video' : 'image',
    };
  }

  /**
   * Delete object from R2 bucket
   */
  async delete(identifier) {
    if (!this.isConfigured()) return { success: false, message: 'R2 not configured' };

    let key = identifier;
    if (identifier.startsWith('http')) {
      try {
        const parsed = new URL(identifier);
        key = parsed.pathname.replace(/^\//, '');
      } catch (e) {
        key = identifier;
      }
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      await s3Client.send(command);
      return { success: true, provider: 'r2', key };
    } catch (err) {
      return { success: false, provider: 'r2', error: err.message };
    }
  }

  /**
   * Lightweight health check probe (HeadBucket)
   */
  async healthCheck() {
    if (!this.isConfigured()) {
      return { healthy: false, status: 'NOT_CONFIGURED', error: 'Credentials missing' };
    }
    const start = Date.now();
    try {
      const command = new HeadBucketCommand({ Bucket: bucketName });
      await s3Client.send(command);
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
   * Get R2 usage metrics
   */
  async getUsage() {
    if (!this.isConfigured()) {
      return {
        provider: 'r2',
        configured: false,
        status: 'NOT_CONFIGURED',
        usage: { usedFormatted: '0 MB', limitFormatted: '10 GB (Free Tier, $0 Egress)' },
      };
    }

    return {
      provider: 'r2',
      configured: true,
      status: 'HEALTHY',
      plan: 'Cloudflare R2 (10 GB Free + $0 Egress Bandwidth)',
      limitBytes: 10 * 1024 * 1024 * 1024,
      limitFormatted: '10 GB',
    };
  }
}

export const r2Provider = new CloudflareR2Provider();
export default r2Provider;
