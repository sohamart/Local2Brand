import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Global cached connection for Vercel Serverless environment
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Prevent unhandled error crashes & handle automatic reconnection
mongoose.connection.on('error', (err) => {
  console.warn('⚠️ MongoDB connection event notice:', err.message);
  if (cached) {
    cached.conn = null;
    cached.promise = null;
  }
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection disconnected. Resetting cache for auto-reconnect.');
  if (cached) {
    cached.conn = null;
    cached.promise = null;
  }
});

// Non-blocking bufferCommands
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('⚠️ MONGODB_URI is not set in environment variables.');
  }

  const connectionString = mongoUri || 'mongodb://127.0.0.1:27017/local2brand';

  if (!cached.promise || mongoose.connection.readyState === 0) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 15,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
    };

    cached.promise = mongoose.connect(connectionString, opts).then((mongooseInstance) => {
      console.log(`✅ MongoDB Connected Successfully: ${mongooseInstance.connection.host}`);
      cached.conn = mongooseInstance;
      return mongooseInstance;
    }).catch((err) => {
      cached.conn = null;
      cached.promise = null;
      console.error(`❌ MongoDB Connection Error: ${err.message}`);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.conn = null;
    cached.promise = null;
    console.warn(`⚠️ MongoDB connection attempt failed: ${error.message}`);
    return null;
  }
};


