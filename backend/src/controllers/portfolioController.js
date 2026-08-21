import Portfolio from '../models/Portfolio.js';

// @desc    Get all published portfolio entries
// @route   GET /api/portfolio
// @access  Public
export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ published: true });
    res.status(200).json({ success: true, count: portfolio.length, portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get portfolio details by ID (Case study)
// @route   GET /api/portfolio/:id
// @access  Public
export const getPortfolioById = async (req, res) => {
  try {
    const project = await Portfolio.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }
    res.status(200).json({ success: true, portfolio: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
