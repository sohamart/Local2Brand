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
