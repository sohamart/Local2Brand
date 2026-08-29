const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');
const emailService = require('../services/emailService');

// Admin: Get all customer accounts with order metrics
router.get('/admin/all', requireAdmin, (req, res) => {
  try {
    const users = db.prepare(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        u.address, 
        u.role, 
        u.profile_image,
        u.created_at,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(CASE WHEN o.order_status != 'cancelled' THEN o.total ELSE 0 END), 0) as total_spent,
        MAX(o.created_at) as last_order_date
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY total_orders DESC, u.created_at DESC
    `).all();

    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch customer directory' });
  }
});

// Admin: Get all Registered Delivery Riders
router.get('/admin/riders', requireAdmin, (req, res) => {
  try {
    const riders = db.prepare(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        u.address, 
        u.role, 
        u.profile_image,
        u.created_at,
        (SELECT COUNT(*) FROM orders WHERE (driver_phone = u.phone OR driver_name = u.name) AND order_status = 'delivered') as completed_deliveries,
        (SELECT COUNT(*) FROM orders WHERE (driver_phone = u.phone OR driver_name = u.name) AND order_status = 'out_for_delivery') as active_deliveries
      FROM users u
      WHERE u.role = 'delivery'
      ORDER BY u.created_at DESC
    `).all();

    res.json(riders);
  } catch (err) {
    console.error('Fetch riders error:', err);
    res.status(500).json({ error: 'Failed to fetch delivery riders' });
  }
});

// Admin: Register New Delivery Partner / Rider
router.post('/admin/create-rider', requireAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, vehicle, address, profile_image } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Rider name, email, phone number and initial password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'A user or rider with this email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const riderAddress = vehicle ? `${vehicle} • ${address || 'Hub Station'}` : (address || 'Express Delivery Hub');
    const riderImage = profile_image || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=80';

    const result = db.prepare(`
      INSERT INTO users (name, email, password, phone, address, role, profile_image)
      VALUES (?, ?, ?, ?, ?, 'delivery', ?)
    `).run(name.trim(), normalizedEmail, hashedPassword, phone.trim(), riderAddress.trim(), riderImage);

    const createdRider = db.prepare('SELECT id, name, email, phone, address, role, profile_image, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);

    // Send Welcome Rider Email
    emailService.sendMail({
      to: normalizedEmail,
      subject: `🛵 Welcome to L'Amour Gourmet Delivery Fleet, ${name}!`,
      html: `
        <div style="background-color: #171310; color: #F3E9D8; padding: 24px; border-radius: 12px; font-family: monospace;">
          <h2 style="color: #E8AC4E;">🛵 Delivery Partner Account Activated</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>You have been registered as an official delivery partner for <strong>L'Amour Gourmet & Grill</strong>.</p>
          <div style="background-color: #231d19; padding: 14px; border-radius: 8px; margin: 14px 0; border: 1px dashed #A9865A;">
            <p style="margin: 0 0 4px 0;"><strong>Portal Login:</strong> http://localhost:5173</p>
            <p style="margin: 0 0 4px 0;"><strong>Rider Email:</strong> ${normalizedEmail}</p>
            <p style="margin: 0 0 4px 0;"><strong>Vehicle / Station:</strong> ${riderAddress}</p>
          </div>
          <p style="color: #92b584;">Log in and open the Rider Hub to accept live orders and broadcast your route telemetry.</p>
        </div>
      `
    }).catch(() => {});

    res.status(201).json({
      message: `Rider ${name} registered successfully!`,
      rider: createdRider
    });
  } catch (err) {
    console.error('Register rider error:', err);
    res.status(500).json({ error: 'Failed to register delivery rider' });
  }
});

// Admin: Delete Rider
router.delete('/admin/rider/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare("DELETE FROM users WHERE id = ? AND role = 'delivery'").run(id);
    res.json({ message: 'Rider account removed successfully' });
  } catch (err) {
    console.error('Delete rider error:', err);
    res.status(500).json({ error: 'Failed to delete rider' });
  }
});

module.exports = router;
