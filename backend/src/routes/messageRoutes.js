import express from 'express';
import { getProjectMessages, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/:projectId')
  .get(getProjectMessages)
  .post(sendMessage);

export default router;
