import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { storageHub } from '../services/storage/storageHub.js';
import { migrationScanner } from '../services/storage/migrationScanner.js';
import { storageLogger } from '../services/storage/storageLogger.js';

// Format bytes to human readable string (KB, MB, GB)
const formatBytes = (bytes = 0, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// @desc    Get live Multi-Cloud Storage Hub usage stats & provider health telemetry
// @route   GET /api/media/usage
// @access  Admin
export const getCloudinaryUsage = async (req, res) => {
  try {
    const hubTelemetry = await storageHub.getAllProviderUsage();
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'tm2pwzjj';

    // Find primary (Cloudinary) usage or first available
    const cloudinaryInfo = hubTelemetry.providers.find((p) => p.name === 'cloudinary') || {};
    const storageBytes = cloudinaryInfo.usedBytes || 0;
    const storageLimitBytes = cloudinaryInfo.limitBytes || 25 * 1024 * 1024 * 1024;
    const storagePercent = ((storageBytes / storageLimitBytes) * 100);

    return res.status(200).json({
      success: true,
      configured: isCloudinaryConfigured,
      hub: hubTelemetry,
      isFailoverActive: hubTelemetry.isFailoverActive,
      // Backward compatible usage structure for existing Admin UI
      usage: {
        cloudName,
        plan: cloudinaryInfo.status === 'HEALTHY' ? (cloudinaryInfo.plan || 'Cloudinary High-Speed CDN') : `Cloudinary (${cloudinaryInfo.status || 'Standby'})`,
        status: cloudinaryInfo.status || 'DEGRADED',
        storage: {
          usedBytes: storageBytes,
          usedFormatted: formatBytes(storageBytes),
          limitBytes: storageLimitBytes,
          limitFormatted: formatBytes(storageLimitBytes),
          percent: Number(storagePercent.toFixed(1)),
        },
        credits: cloudinaryInfo.credits || { used: 0, limit: 25, percent: 0 },
        bandwidth: {
          usedBytes: cloudinaryInfo.bandwidthBytes || 0,
          usedFormatted: formatBytes(cloudinaryInfo.bandwidthBytes || 0),
        },
        transformations: {
          used: 0,
        },
        resources: cloudinaryInfo.resources || 0,
        multiCloud: hubTelemetry.providers,
      },
    });
  } catch (error) {
    console.error('Error fetching Storage Hub telemetry:', error);
    return res.status(200).json({
      success: true,
      configured: true,
      error: error.message,
      usage: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'tm2pwzjj',
        plan: 'Multi-Cloud Standby Mode',
        storage: { used: '0 MB', limit: '25 GB', percent: 0 },
      },
    });
  }
};

// @desc    List all uploaded media assets
// @route   GET /api/media/all
// @access  Admin
export const getAllCloudinaryMedia = async (req, res) => {
  try {
    const { max_results = 100, next_cursor, prefix, resource_type } = req.query;
    let allResources = [];
    let nextCursor = null;

    if (isCloudinaryConfigured) {
      try {
        if (resource_type) {
          const options = {
            resource_type,
            type: 'upload',
            max_results: Number(max_results) || 100,
            direction: 'desc',
          };
          if (next_cursor) options.next_cursor = next_cursor;
          if (prefix) options.prefix = prefix;
          const result = await cloudinary.api.resources(options);
          allResources = result.resources || [];
          nextCursor = result.next_cursor || null;
        } else {
          const imageOptions = {
            resource_type: 'image',
            type: 'upload',
            max_results: Number(max_results) || 100,
            direction: 'desc',
          };
          const videoOptions = {
            resource_type: 'video',
            type: 'upload',
            max_results: Number(max_results) || 100,
            direction: 'desc',
          };
          if (prefix) {
            imageOptions.prefix = prefix;
            videoOptions.prefix = prefix;
          }

          const [imageRes, videoRes] = await Promise.allSettled([
            cloudinary.api.resources(imageOptions),
            cloudinary.api.resources(videoOptions),
          ]);

          const images = imageRes.status === 'fulfilled' ? imageRes.value?.resources || [] : [];
          const videos = videoRes.status === 'fulfilled' ? videoRes.value?.resources || [] : [];
          allResources = [...images, ...videos].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
      } catch (cloudErr) {
        console.warn('Notice fetching Cloudinary resources list:', cloudErr.message);
      }
    }

    const formattedResources = allResources.map((r) => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
      format: r.format || (r.resource_type === 'video' ? 'mp4' : 'jpg'),
      bytes: r.bytes,
      sizeFormatted: formatBytes(r.bytes),
      width: r.width,
      height: r.height,
      folder: r.folder || (r.public_id.includes('/') ? r.public_id.split('/')[0] : 'root'),
      created_at: r.created_at,
      resource_type: r.resource_type || (r.format === 'mp4' || r.format === 'webm' ? 'video' : 'image'),
      provider: 'cloudinary',
    }));

    return res.status(200).json({
      success: true,
      total: formattedResources.length,
      next_cursor: nextCursor,
      resources: formattedResources,
    });
  } catch (error) {
    console.error('Error fetching media resources:', error);
    return res.status(200).json({
      success: true,
      total: 0,
      resources: [],
      error: error.message,
    });
  }
};

// @desc    Delete single media image/video by public_id or URL
// @route   DELETE /api/media/:public_id
// @access  Admin
export const deleteCloudinaryImage = async (req, res) => {
  try {
    const rawPublicId = req.params.public_id || req.query.public_id;
    const publicId = decodeURIComponent(rawPublicId);

    if (!publicId) {
      return res.status(400).json({ success: false, message: 'public_id or URL is required' });
    }

    const delResult = await storageHub.deleteMedia(publicId);

    return res.status(200).json({
      success: true,
      message: `Media deleted successfully`,
      result: delResult,
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete media',
    });
  }
};

// @desc    Bulk delete multiple media by public_ids/URLs
// @route   POST /api/media/delete-bulk
// @access  Admin
export const bulkDeleteCloudinaryMedia = async (req, res) => {
  try {
    const { public_ids } = req.body;

    if (!Array.isArray(public_ids) || public_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'public_ids array is required' });
    }

    const results = await Promise.allSettled(
      public_ids.map((pid) => storageHub.deleteMedia(pid))
    );

    return res.status(200).json({
      success: true,
      message: `${public_ids.length} media asset(s) processed for deletion`,
      results,
    });
  } catch (error) {
    console.error('Error bulk deleting media:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to bulk delete images',
    });
  }
};

// @desc    Trigger explicit admin-controlled backup migration to secondary provider
// @route   POST /api/media/backup
// @access  Admin
export const triggerBackupMigration = async (req, res) => {
  try {
    const { targetProvider = 'imagekit' } = req.body || {};
    const result = await migrationScanner.backupToProvider(targetProvider);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute backup migration',
    });
  }
};

// @desc    Get real-time StorageEvent telemetry logs
// @route   GET /api/media/events
// @access  Admin
export const getStorageEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '50', 10);
    const events = await storageLogger.getRecentEvents(limit);
    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch storage events',
    });
  }
};
