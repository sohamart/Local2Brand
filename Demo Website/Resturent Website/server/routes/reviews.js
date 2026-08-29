const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

// Get all approved reviews (Public)
router.get('/', (req, res) => {
  try {
    const reviews = db.prepare("SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC").all();
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as avg_rating
      FROM reviews WHERE status = 'approved'
    `).get();

    res.json({
      reviews,
      stats: {
        total: stats.total_reviews || 0,
        average: stats.avg_rating ? parseFloat(stats.avg_rating.toFixed(1)) : 5.0
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Post review (Public)
router.post('/', (req, res) => {
  try {
    const { user_name, rating, comment, dish_name } = req.body;

    if (!user_name || !rating || !comment) {
      return res.status(400).json({ error: 'Name, rating, and feedback comment are required' });
    }

    const result = db.prepare(`
      INSERT INTO reviews (user_name, rating, comment, dish_name, status)
      VALUES (?, ?, ?, ?, 'approved')
    `).run(
      user_name,
      parseInt(rating, 10),
      comment,
      dish_name || 'General Dining Experience'
    );

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({
      message: 'Thank you for your generous feedback!',
      review
    });
  } catch (err) {
    console.error('Review submit error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Admin: Get all reviews including pending/hidden
router.get('/admin/all', requireAdmin, (req, res) => {
  try {
    const reviews = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin reviews' });
  }
});

// Admin: Moderate review
router.patch('/admin/:id/status', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved', 'hidden'

    db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run(status, id);
    res.json({ message: `Review status changed to ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to moderate review' });
  }
});

// Admin: Delete review
router.delete('/admin/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
