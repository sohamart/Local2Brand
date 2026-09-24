import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { storageHub } from './storageHub.js';
import { providerRegistry } from './providerRegistry.js';
import { storageLogger } from './storageLogger.js';
import { SiteSettings } from '../../models/SiteSettings.js';
import { User } from '../../models/User.js';

/**
 * Admin Migration & Non-Destructive Backup Replication Utility
 * Scans existing Cloudinary records and copies them to secondary persistent cloud storage.
 * GUARANTEE: NEVER modifies, deletes, or invalidates the original Cloudinary records.
 */
class MigrationScanner {
  constructor() {
    this.isRunning = false;
    this.backedUpUrls = new Set(); // Prevent duplicate copies in memory
  }

  /**
   * Scan all database models & settings for media URLs
   */
  async scanMediaRecords() {
    const urls = new Set();

    try {
      // 1. Scan SiteSettings
      const settings = await SiteSettings.findOne();
      if (settings) {
        if (settings.logoLightUrl) urls.add(settings.logoLightUrl);
        if (settings.logoDarkUrl) urls.add(settings.logoDarkUrl);
        if (settings.bannerImage) urls.add(settings.bannerImage);

        if (settings.countryThemes && typeof settings.countryThemes === 'object') {
          Object.values(settings.countryThemes).forEach((theme) => {
            if (theme?.videoUrl) urls.add(theme.videoUrl);
            if (theme?.posterUrl) urls.add(theme.posterUrl);
          });
        }

        if (settings.appConfig) {
          if (settings.appConfig.apkDownloadUrl) urls.add(settings.appConfig.apkDownloadUrl);
          if (Array.isArray(settings.appConfig.screenshots)) {
            settings.appConfig.screenshots.forEach((s) => s && urls.add(s));
          }
        }
      }

      // 2. Scan Users
      const users = await User.find({ avatar: { $exists: true, $ne: '' } }).select('avatar').limit(200);
      users.forEach((u) => {
        if (u.avatar) urls.add(u.avatar);
      });
    } catch (e) {
      console.warn('Media scan warning:', e.message);
    }

    const allUrls = Array.from(urls).filter((u) => typeof u === 'string' && u.startsWith('http'));
    const cloudinaryUrls = allUrls.filter((u) => u.includes('cloudinary.com') || u.includes('res.cloudinary.com'));

    return {
      totalFound: allUrls.length,
      cloudinaryCount: cloudinaryUrls.length,
      cloudinaryUrls,
      allUrls,
    };
  }

  /**
   * Explicit Admin-triggered non-destructive backup copy to another provider
   */
  async backupMediaUrl(mediaUrl, targetProviderName = 'imagekit') {
    if (!mediaUrl || typeof mediaUrl !== 'string') {
      throw new Error('Invalid media URL provided');
    }

    if (this.backedUpUrls.has(`${mediaUrl}::${targetProviderName}`)) {
      return {
        success: true,
        alreadyBackedUp: true,
        message: 'Asset already backed up during this session',
        mediaUrl,
      };
    }

    const targetProvider = providerRegistry.get(targetProviderName);
    if (!targetProvider || !targetProvider.isConfigured()) {
      throw new Error(`Target backup provider '${targetProviderName}' is not configured`);
    }

    const isVideo = mediaUrl.includes('/video/') || Boolean(mediaUrl.match(/\.(mp4|webm|mov|mkv|avi|ogg)$/i));
    const targetFolder = isVideo ? 'local2brand_videos_backup' : 'local2brand_assets_backup';

    // Download media stream into a buffer in memory
    const buffer = await this.downloadToBuffer(mediaUrl);

    // Upload to target backup provider
    const result = await targetProvider.upload(buffer, {
      folder: targetFolder,
      originalName: path.basename(new URL(mediaUrl).pathname) || `backup-${Date.now()}`,
      resourceType: isVideo ? 'video' : 'auto',
      isBackup: true,
    });

    this.backedUpUrls.add(`${mediaUrl}::${targetProviderName}`);

    await storageLogger.logEvent({
      eventType: 'REPLICATION_SUCCESS',
      provider: 'cloudinary',
      targetProvider: targetProviderName,
      mediaUrl: result.url,
      fileSizeBytes: result.bytes || buffer.length,
      success: true,
      message: `Non-destructive backup copy created on '${targetProviderName}' for '${mediaUrl}'`,
    });

    return {
      success: true,
      originalUrl: mediaUrl,
      backupUrl: result.url,
      provider: targetProviderName,
      bytes: result.bytes || buffer.length,
    };
  }

  /**
   * Helper to download remote file to Buffer
   */
  downloadToBuffer(url) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      client
        .get(url, (res) => {
          if (res.statusCode >= 400) {
            return reject(new Error(`Failed to download original asset: HTTP ${res.statusCode}`));
          }
          const chunks = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => resolve(Buffer.concat(chunks)));
        })
        .on('error', (err) => reject(err));
    });
  }
}

export const migrationScanner = new MigrationScanner();
export default migrationScanner;
