const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

// Create Reservation (Public)
router.post('/', (req, res) => {
  try {
    const { name, email, phone, guests, reservation_date, reservation_time, seating_type, special_request } = req.body;

    if (!name || !phone || !guests || !reservation_date || !reservation_time) {
      return res.status(400).json({ error: 'Name, phone, guest count, date and time are required' });
    }

    const result = db.prepare(`
      INSERT INTO reservations (name, email, phone, guests, reservation_date, reservation_time, seating_type, special_request)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      email || '',
      phone,
      parseInt(guests, 10),
      reservation_date,
      reservation_time,
      seating_type || 'Main Dining',
      special_request || ''
    );

    const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({
      message: 'Table reservation submitted successfully! We will confirm via SMS / WhatsApp.',
      reservation
    });
  } catch (err) {
    console.error('Reservation error:', err);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// Admin: Get all reservations
router.get('/admin/all', requireAdmin, (req, res) => {
  try {
    const reservations = db.prepare('SELECT * FROM reservations ORDER BY created_at DESC').all();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Admin: Update status
router.patch('/admin/:id/status', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'confirmed', 'seated', 'cancelled', 'pending'

    db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, id);
    const updated = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);

    res.json({ message: 'Reservation updated', reservation: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

module.exports = router;
