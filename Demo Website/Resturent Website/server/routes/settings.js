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

module.exports = router;
