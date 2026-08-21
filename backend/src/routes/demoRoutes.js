import express from 'express';
import { getDemos, getDemoById } from '../controllers/demoController.js';

const router = express.Router();

router.get('/', getDemos);
router.get('/:id', getDemoById);

export default router;
