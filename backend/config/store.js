import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const dataDir = process.env.VERCEL
  ? path.join('/tmp', 'data')
  : path.join(process.cwd(), 'data');

try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
} catch (e) {
  // Ignored in read-only environments
}

const getFilePath = (collection) => path.join(dataDir, `${collection}.json`);

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const readLocalStore = (collection) => {
  const file = getFilePath(collection);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (err) {
    return [];
  }
};

export const writeLocalStore = (collection, data) => {
  const file = getFilePath(collection);
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error saving store ${collection}:`, err);
  }
};
