const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

// Public Store Settings
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM site_settings').all();
    const settings = {};
    rows.forEach(r => {
      // Hide secret key in public endpoint
      if (r.key === 'razorpay_key_secret') {
        settings['has_razorpay_secret'] = !!(r.value && !r.value.includes('YourSecretKeyHere'));
      } else {
        settings[r.key] = r.value;
      }
    });

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Admin: Get all settings (including raw key values for configuration)
router.get('/admin', requireAdmin, (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM site_settings').all();
    const settings = {};
    rows.forEach(r => {
      settings[r.key] = r.value;
    });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin settings' });
  }
});

// Admin: Update settings
router.put('/admin', requireAdmin, (req, res) => {
  try {
    const updates = req.body;
    const updateStmt = db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)');

    const updateMany = db.transaction((settingsObj) => {
      for (const [k, v] of Object.entries(settingsObj)) {
        updateStmt.run(k, String(v));
      }
    });

    updateMany(updates);

    res.json({ message: 'Settings saved successfully' });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Admin: Send Test Email
router.post('/admin/test-email', requireAdmin, async (req, res) => {
  try {
    const { target_email } = req.body;
    const emailService = require('../services/emailService');

    const result = await emailService.sendMail({
      to: target_email || 'admin@restaurant.com',
      subject: "✨ L'Amour Gourmet Test Email Notification",
      html: `
        <div style="background-color: #171310; color: #F3E9D8; padding: 24px; border-radius: 12px; font-family: monospace;">
          <h2 style="color: #E8AC4E;">🔥 SMTP & Email System Active</h2>
          <p>This is a test notification from L'Amour Gourmet & Grill management server.</p>
          <p style="color: #92b584;">All automated notifications (registration, logins, orders, OTPs, tables, and newsletters) are configured and working properly.</p>
          <p style="color: #A9865A; font-size: 11px;">Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    });

    res.json({ message: 'Test email processed', result });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ error: err.message || 'Failed to send test email' });
  }
});

module.exports = router;
