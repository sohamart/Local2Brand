import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
dotenv.config();

// Fix Windows / Wi-Fi DNS SRV resolution issue for MongoDB Atlas (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where custom DNS is restricted
}

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gourmetos';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`\n✅ [MongoDB Atlas] Connected Successfully: ${conn.connection.host} (DB: ${conn.connection.name})\n`);
    return conn;
  } catch (error) {
    console.warn(`\n⚠️ [MongoDB Notice] Could not connect to Atlas cluster: ${error.message}`);
    console.warn(`👉 টিপস: MongoDB Atlas-এ Network Access -> 'Allow Access from Anywhere (0.0.0.0/0)' নিশ্চিত করুন।\n`);
    return null;
  }
};
