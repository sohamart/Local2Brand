import mongoose from 'mongoose';
import dns from 'dns';

// Ensure reliable SRV DNS resolution on Windows & restricted networks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);
} catch (e) {
  // Ignored if custom DNS is not permitted
}

// Global cached connection for Vercel Serverless environment
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Prevent unhandled error crashes
mongoose.connection.on('error', (err) => {
  console.warn('⚠️ MongoDB connection event error:', err.message);
});

// Enable buffer commands so Mongoose queues operations during initial connection rather than throwing
mongoose.set('bufferCommands', true);

export const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('⚠️ MONGODB_URI is not set in environment variables.');
  }

  const connectionString = mongoUri || 'mongodb://127.0.0.1:27017/local2brand';

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(connectionString, opts).then((mongooseInstance) => {
      console.log(`✅ MongoDB Connected Successfully: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error(`❌ MongoDB Connection Error: ${err.message}`);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.warn(`⚠️ MongoDB connection attempt failed: ${error.message}`);
    return null;
  }
};

