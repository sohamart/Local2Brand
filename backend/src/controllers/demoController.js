import Demo from '../models/Demo.js';

// @desc    Get all published demos
// @route   GET /api/demos
// @access  Public
export const getDemos = async (req, res) => {
  try {
    const demos = await Demo.find({ published: true });
    res.status(200).json({ success: true, count: demos.length, demos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get demo by ID
// @route   GET /api/demos/:id
// @access  Public
export const getDemoById = async (req, res) => {
  try {
    const demo = await Demo.findById(req.params.id);
    if (!demo) {
      return res.status(404).json({ success: false, message: 'Demo not found' });
    }
    res.status(200).json({ success: true, demo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
