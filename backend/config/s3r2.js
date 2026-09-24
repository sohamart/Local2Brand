import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicDomain = process.env.R2_PUBLIC_DOMAIN; // e.g. https://cdn.yourdomain.com or https://pub-xxx.r2.dev

const isR2Configured = Boolean(
  accessKeyId &&
  secretAccessKey &&
  bucketName &&
  accessKeyId !== 'r2_demo_access_key'
);

let s3Client = null;

if (isR2Configured) {
  try {
    const endpoint = accountId
      ? `https://${accountId}.r2.cloudflarestorage.com`
      : process.env.S3_CUSTOM_ENDPOINT || undefined;

    s3Client = new S3Client({
      region: process.env.AWS_REGION || 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    console.log('✅ Cloudflare R2 / S3 Object Storage SDK Initialized');
  } catch (err) {
    console.warn('⚠️ R2/S3 initialization notice:', err.message);
  }
}

export { s3Client, isR2Configured, bucketName, publicDomain };
export default s3Client;
