import mongoose from 'mongoose';
import dns from 'dns';

// Ensure reliable SRV DNS resolution on Windows & restricted networks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);
} catch (e) {
  // Ignored if custom DNS is not permitted
}

// Prevent Mongoose from throwing unhandled error events on failed background retries

mongoose.connection.on('error', (err) => {
  // Gracefully handle connection error events without crashing the process
});

mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('127.0.0.1:27017')) {
    // Try connecting once with short timeout, if unavailable run in resilient mode
    try {
      const conn = await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/local2brand', {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
      });
      console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.log(`ℹ️ MongoDB local service not active. Running in resilient persistent storage mode.`);
      return false;
    }
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas connection notice: ${error.message}`);
    console.log(`ℹ️ Running in resilient persistent storage mode.`);
    return false;
  }
};
