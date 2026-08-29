const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

// Get all menu items & categories (Public)
router.get('/', (req, res) => {
  try {
    const { category, veg, search } = req.query;
    let query = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (veg !== undefined && veg !== '') {
      query += ' AND is_veg = ?';
      params.push(veg === 'true' ? 1 : 0);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY is_bestseller DESC, id ASC';

    const items = db.prepare(query).all(...params);
    const categories = db.prepare('SELECT * FROM categories ORDER BY display_order ASC').all();

    res.json({
      items,
      categories
    });
  } catch (err) {
    console.error('Menu fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Admin: Add new menu item
router.post('/', requireAdmin, (req, res) => {
  try {
    const { name, description, price, original_price, category, image, is_veg, is_spicy, is_bestseller, prep_time } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Dish name, price and category are required' });
    }

    const defaultImg = is_veg 
      ? 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80';

    const result = db.prepare(`
      INSERT INTO menu_items (name, description, price, original_price, category, image, is_veg, is_spicy, is_bestseller, prep_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      description || '',
      parseFloat(price),
      original_price ? parseFloat(original_price) : null,
      category,
      image || defaultImg,
      is_veg ? 1 : 0,
      is_spicy ? 1 : 0,
      is_bestseller ? 1 : 0,
      prep_time || '20 mins'
    );

    const newItem = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Menu item added successfully', item: newItem });
  } catch (err) {
    console.error('Add menu item error:', err);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

// Admin: Update menu item
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, original_price, category, image, is_veg, is_spicy, is_bestseller, is_available, prep_time } = req.body;

    db.prepare(`
      UPDATE menu_items SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        original_price = COALESCE(?, original_price),
        category = COALESCE(?, category),
        image = COALESCE(?, image),
        is_veg = COALESCE(?, is_veg),
        is_spicy = COALESCE(?, is_spicy),
        is_bestseller = COALESCE(?, is_bestseller),
        is_available = COALESCE(?, is_available),
        prep_time = COALESCE(?, prep_time)
      WHERE id = ?
    `).run(
      name,
      description,
      price !== undefined ? parseFloat(price) : null,
      original_price !== undefined ? parseFloat(original_price) : null,
      category,
      image,
      is_veg !== undefined ? (is_veg ? 1 : 0) : null,
      is_spicy !== undefined ? (is_spicy ? 1 : 0) : null,
      is_bestseller !== undefined ? (is_bestseller ? 1 : 0) : null,
      is_available !== undefined ? (is_available ? 1 : 0) : null,
      prep_time,
      id
    );

    const updatedItem = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    res.json({ message: 'Menu item updated successfully', item: updatedItem });
  } catch (err) {
    console.error('Update menu item error:', err);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Admin: Toggle Availability
router.patch('/:id/availability', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const item = db.prepare('SELECT is_available FROM menu_items WHERE id = ?').get(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const newStatus = item.is_available ? 0 : 1;
    db.prepare('UPDATE menu_items SET is_available = ? WHERE id = ?').run(newStatus, id);

    res.json({ message: `Item marked as ${newStatus ? 'in stock' : 'out of stock'}`, is_available: newStatus });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle availability' });
  }
});

// Admin: Delete menu item
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);
    res.json({ message: 'Menu item removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

module.exports = router;
