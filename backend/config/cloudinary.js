import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured =
  cloudName &&
  apiKey &&
  apiSecret &&
  cloudName !== 'local2brand-demo' &&
  apiSecret !== 'local2brand_mock_secret';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  console.log('✅ Cloudinary Storage SDK Initialized');
} else {
  console.log('ℹ️ Cloudinary running in local disk fallback mode (set valid Cloudinary keys to sync to Cloud)');
}

export { cloudinary, isCloudinaryConfigured };

// Helper to extract public_id from a Cloudinary secure_url
export const extractCloudinaryPublicId = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return null;
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?([^\.\?#]+)/);
    return match ? match[1] : null;
  } catch (e) {
    return null;
  }
};

// Helper to permanently delete multiple media assets from Cloudinary
export const deleteCloudinaryMedia = async (urlsOrPublicIds = []) => {
  if (!isCloudinaryConfigured) return { success: false, message: 'Cloudinary not configured' };
  const items = Array.isArray(urlsOrPublicIds) ? urlsOrPublicIds : [urlsOrPublicIds];
  const publicIds = items
    .map((item) => {
      if (typeof item === 'string' && item.startsWith('http')) {
        return extractCloudinaryPublicId(item);
      }
      return typeof item === 'string' ? item : null;
    })
    .filter(Boolean);

  if (publicIds.length === 0) return { success: true, count: 0 };

  try {
    const results = await Promise.allSettled(
      publicIds.map((pid) => cloudinary.uploader.destroy(pid, { invalidate: true }))
    );
    console.log(`🗑️ Deleted ${publicIds.length} Cloudinary image(s):`, publicIds);
    return { success: true, count: publicIds.length, results };
  } catch (err) {
    console.warn('Cloudinary delete notice:', err.message);
    return { success: false, error: err.message };
  }
};
