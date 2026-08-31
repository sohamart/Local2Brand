import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Protect process from uncaught rejections
process.on('uncaughtException', (err) => {
  console.warn('⚠️ Process Notice (Uncaught Exception):', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.warn('⚠️ Process Notice (Unhandled Rejection):', reason?.message || reason);
});

import { connectDB } from './config/db.js';
import { dataStore } from './config/dataAdapter.js';

// Import Routes
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import queryRoutes from './routes/queries.js';
import callbackRoutes from './routes/callbacks.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';
import serviceRoutes from './routes/services.js';
import demoRoutes from './routes/demos.js';
import formRoutes from './routes/forms.js';
import requirementRoutes from './routes/requirements.js';
import reviewRoutes from './routes/reviews.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists safely (handles read-only Vercel serverless environments)
const uploadsDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'uploads');

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  // Gracefully ignored on read-only environments
}

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Dynamic Allowed Origins for CORS
const allowedOrigins = [
  'https://local2brand.vercel.app',
  'https://www.local2brand.com',
  'https://local2brand.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed list or any Vercel preview domain (*.vercel.app)
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, origin);
    }
    
    return callback(null, origin);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded static files if available
try {
  app.use('/uploads', express.static(uploadsDir));
} catch (e) {}

// Serverless DB Auto-Connect Middleware
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await connectDB();
      await dataStore.seedDefaultAdmin();
      await dataStore.getSettings();
      dbInitialized = true;
    } catch (e) {
      console.warn('DB initialization notice:', e.message);
    }
  }
  next();
});

// Root API Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 LOCAL2BRAND Enterprise Backend API is live & operational',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      settings: '/api/settings',
      demos: '/api/demos',
      requirements: '/api/requirements',
      callbacks: '/api/callbacks',
    },
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'LOCAL2BRAND Enterprise Backend API',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/callbacks', callbackRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/demos', demoRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/reviews', reviewRoutes);

// Global 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server locally if not running on Vercel Serverless
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const startServer = async () => {
    try {
      await connectDB();
      await dataStore.seedDefaultAdmin();
      await dataStore.getSettings();
      dbInitialized = true;

      app.listen(PORT, () => {
        console.log(`\n🚀 LOCAL2BRAND Backend running on http://localhost:${PORT}`);
        console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 API Base: http://localhost:${PORT}/api\n`);
      });
    } catch (err) {
      console.error('Error during server startup:', err.message);
    }
  };

  startServer();
}

export default app;
