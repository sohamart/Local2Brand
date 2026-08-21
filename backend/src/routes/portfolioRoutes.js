import express from 'express';
import { getPortfolio, getPortfolioById } from '../controllers/portfolioController.js';

const router = express.Router();

router.get('/', getPortfolio);
router.get('/:id', getPortfolioById);

export default router;
