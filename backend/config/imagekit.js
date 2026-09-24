import ImageKit from 'imagekit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
}

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

const isImageKitConfigured = Boolean(
  publicKey &&
  privateKey &&
  urlEndpoint &&
  publicKey !== 'imagekit_demo_key' &&
  privateKey !== 'imagekit_demo_private'
);

let imagekit = null;

if (isImageKitConfigured) {
  try {
    imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
    console.log('✅ ImageKit.io Storage SDK Initialized');
  } catch (err) {
    console.warn('⚠️ ImageKit initialization notice:', err.message);
  }
} else {
  // Not configured; gracefully standby
}

export { imagekit, isImageKitConfigured };
export default imagekit;
