import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

// Format bytes to human readable string (KB, MB, GB)
const formatBytes = (bytes = 0, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// @desc    Get live Cloudinary account usage stats (Storage used, remaining, credits, bandwidth)
// @route   GET /api/media/usage
// @access  Admin
export const getCloudinaryUsage = async (req, res) => {
  try {
    if (!isCloudinaryConfigured) {
      return res.status(200).json({
        success: true,
        configured: false,
        message: 'Cloudinary credentials not configured in .env',
        usage: {
          cloudName: 'local_disk',
          storage: { used: '0 MB', limit: '25 GB', percent: 0 },
          credits: { used: 0, limit: 25, percent: 0 },
          bandwidth: { used: '0 MB' },
          transformations: { used: 0 },
          resources: 0
        }
      });
    }

    const usageData = await cloudinary.api.usage();
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'tm2pwzjj';

    // Parse storage
    const storageBytes = usageData.storage?.usage || 0;
    const storageLimitBytes = usageData.storage?.limit || (25 * 1024 * 1024 * 1024); // 25 GB default Free tier
    const storagePercent = usageData.storage?.used_percent || ((storageBytes / storageLimitBytes) * 100);

    // Parse credits
    const creditsUsed = usageData.credits?.usage || 0;
    const creditsLimit = usageData.credits?.limit || 25;
    const creditsPercent = usageData.credits?.used_percent || ((creditsUsed / creditsLimit) * 100);

    // Parse bandwidth
    const bandwidthBytes = usageData.bandwidth?.usage || 0;

    return res.status(200).json({
      success: true,
      configured: true,
      usage: {
        cloudName,
        plan: usageData.plan || 'Free Tier',
        storage: {
          usedBytes: storageBytes,
          usedFormatted: formatBytes(storageBytes),
          limitBytes: storageLimitBytes,
          limitFormatted: formatBytes(storageLimitBytes),
          percent: Number(storagePercent.toFixed(1))
        },
        credits: {
          used: creditsUsed,
          limit: creditsLimit,
          percent: Number(creditsPercent.toFixed(1))
        },
        bandwidth: {
          usedBytes: bandwidthBytes,
          usedFormatted: formatBytes(bandwidthBytes)
        },
        transformations: {
          used: usageData.transformations?.usage || 0
        },
        resources: usageData.objects?.usage || usageData.resources || 0,
        raw: usageData
      }
    });
  } catch (error) {
    console.error('Error fetching Cloudinary usage:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch Cloudinary usage metrics'
    });
  }
};

// @desc    List all Cloudinary uploaded media assets
// @route   GET /api/media/all
// @access  Admin
export const getAllCloudinaryMedia = async (req, res) => {
  try {
    if (!isCloudinaryConfigured) {
      return res.status(200).json({
        success: true,
        total: 0,
        resources: []
      });
    }

    const { max_results = 100, next_cursor, prefix } = req.query;

    const options = {
      type: 'upload',
      max_results: Number(max_results) || 100,
      direction: 'desc'
    };

    if (next_cursor) {
      options.next_cursor = next_cursor;
    }

    if (prefix) {
      options.prefix = prefix;
    }

    const result = await cloudinary.api.resources(options);

    const formattedResources = (result.resources || []).map((r) => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
      format: r.format,
      bytes: r.bytes,
      sizeFormatted: formatBytes(r.bytes),
      width: r.width,
      height: r.height,
      folder: r.folder || (r.public_id.includes('/') ? r.public_id.split('/')[0] : 'root'),
      created_at: r.created_at,
      resource_type: r.resource_type
    }));

    return res.status(200).json({
      success: true,
      total: formattedResources.length,
      next_cursor: result.next_cursor || null,
      resources: formattedResources
    });
  } catch (error) {
    console.error('Error fetching Cloudinary resources:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve Cloudinary media assets'
    });
  }
};

// @desc    Delete single Cloudinary image by public_id
// @route   DELETE /api/media/:public_id
// @access  Admin
export const deleteCloudinaryImage = async (req, res) => {
  try {
    if (!isCloudinaryConfigured) {
      return res.status(400).json({ success: false, message: 'Cloudinary not configured' });
    }

    // req.params.public_id may be passed encoded or via req.query
    const rawPublicId = req.params.public_id || req.query.public_id;
    const publicId = decodeURIComponent(rawPublicId);

    if (!publicId) {
      return res.status(400).json({ success: false, message: 'public_id is required' });
    }

    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });

    return res.status(200).json({
      success: true,
      message: `Media "${publicId}" deleted successfully from Cloudinary`,
      result
    });
  } catch (error) {
    console.error('Error deleting Cloudinary image:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image from Cloudinary'
    });
  }
};

// @desc    Bulk delete multiple Cloudinary images by public_ids
// @route   POST /api/media/delete-bulk
// @access  Admin
export const bulkDeleteCloudinaryMedia = async (req, res) => {
  try {
    if (!isCloudinaryConfigured) {
      return res.status(400).json({ success: false, message: 'Cloudinary not configured' });
    }

    const { public_ids } = req.body;

    if (!Array.isArray(public_ids) || public_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'public_ids array is required' });
    }

    const result = await cloudinary.api.delete_resources(public_ids, { invalidate: true });

    return res.status(200).json({
      success: true,
      message: `${public_ids.length} media asset(s) deleted from Cloudinary`,
      result
    });
  } catch (error) {
    console.error('Error bulk deleting Cloudinary images:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to bulk delete images'
    });
  }
};
