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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded static files
app.use('/uploads', express.static(uploadsDir));

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

// Root Endpoint
app.get('/', (req, res) => {
  res.send('🚀 LOCAL2BRAND API Server is running smoothly.');
});

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

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    await dataStore.seedDefaultAdmin();
    await dataStore.getSettings();

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
