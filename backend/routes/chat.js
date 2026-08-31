import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  handleChatMessage,
  getChatHistory,
  clearChatHistory,
  getChatStatus,
} from '../controllers/chatController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Rate limiter: Max 30 messages per minute per IP to prevent spam & abuse
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many chat requests sent. Please wait a minute before messaging again.',
  },
});

// Chat routes
router.post('/', chatLimiter, optionalAuth, handleChatMessage);
router.get('/history', optionalAuth, getChatHistory);
router.delete('/history', clearChatHistory);
router.get('/status', getChatStatus);

export default router;
