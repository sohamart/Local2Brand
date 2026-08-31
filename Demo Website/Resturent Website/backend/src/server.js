import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { initSocketServer } from './sockets/socketHandler.js';
import apiRouter from './routes/apiRoutes.js';

const app = express();
const server = http.createServer(app);

// Connect Database
connectDB();

// Setup WebSockets
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
app.set('io', io);
initSocketServer(io);

// Security & Core Middlewares
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    engine: 'GourmetOS Multi-Tenant SaaS Backend',
    version: '1.0.0',
    platform: 'Managed by Local2Brand Agency'
  });
});

// Master REST API Routing
app.use('/api', apiRouter);

// Central Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`👑 GourmetOS Multi-Tenant SaaS Server Running on Port ${PORT}`);
  console.log(`⚡ Managed & Powered by Local2Brand Agency`);
  console.log(`🌐 Health: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
