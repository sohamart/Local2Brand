const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');
const emailService = require('../services/emailService');

// Subscribe to Newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = db.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.json({
        message: 'You are already subscribed to the Smoke Club! Check your inbox for your 20% discount code.',
        alreadySubscribed: true
      });
    }

    db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').run(normalizedEmail);

    // Send Welcome Email with promo voucher
    emailService.sendNewsletterWelcomeEmail(normalizedEmail).catch(err => {
      console.error('Newsletter welcome email error:', err.message);
    });

    res.status(201).json({
      message: 'Subscribed successfully! We have sent your 20% discount voucher to your email.',
      email: normalizedEmail
    });
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    res.status(500).json({ error: 'Failed to subscribe to newsletter' });
  }
});

// Admin: Get all subscribers
router.get('/admin/all', requireAdmin, (req, res) => {
  try {
    const subscribers = db.prepare('SELECT id, email, created_at FROM newsletter_subscribers ORDER BY id DESC').all();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

module.exports = router;
