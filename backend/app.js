const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Global CORS & Preflight Handler
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure Database is initialized
require('./db');

// API Routes (Mounted both with /api and root paths for seamless Vercel rewrites)
const routes = ['auth', 'menu', 'orders', 'razorpay', 'reservations', 'reviews', 'settings', 'analytics', 'users', 'upload', 'newsletter'];
routes.forEach(route => {
  const router = require(`./routes/${route}`);
  app.use(`/api/${route}`, router);
  app.use(`/${route}`, router);
});


// Serve uploaded images statically
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    restaurant: "L'Amour Gourmet & Grill"
  });
});

// Serve static frontend in production if built locally
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

app.use((req, res) => {
  const indexPath = path.join(frontendDist, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send("L'Amour Gourmet API Server is running.");
  }
});

module.exports = app;
