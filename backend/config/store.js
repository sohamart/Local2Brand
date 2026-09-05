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

const getFilePath = (collection) => {
  const tmpFile = path.join(dataDir, `${collection}.json`);
  if (fs.existsSync(tmpFile)) return tmpFile;

  // Fallback candidate static directories in codebase
  const candidateDirs = [
    path.join(process.cwd(), 'data'),
    path.join(process.cwd(), 'backend', 'data'),
    path.join(process.cwd(), '..', 'backend', 'data'),
    path.join(process.cwd(), '..', 'data')
  ];

  for (const dir of candidateDirs) {
    const candidateFile = path.join(dir, `${collection}.json`);
    if (fs.existsSync(candidateFile)) return candidateFile;
  }

  return tmpFile;
};

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const readLocalStore = (collection) => {
  const file = getFilePath(collection);
  if (!fs.existsSync(file)) return [];
  try {
    const content = fs.readFileSync(file, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
};

export const writeLocalStore = (collection, data) => {
  const file = path.join(dataDir, `${collection}.json`);
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error saving store ${collection}:`, err);
  }
};
