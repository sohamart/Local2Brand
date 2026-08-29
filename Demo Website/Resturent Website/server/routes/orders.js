const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

function generateOrderId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LAM-${code}`;
}

// Create New Order
router.post('/', (req, res) => {
  try {
    const {
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      delivery_notes,
      items,
      subtotal,
      delivery_fee,
      discount,
      total,
      payment_method, // 'razorpay', 'cod', 'whatsapp', 'upi'
      payment_status,
      razorpay_order_id,
      razorpay_payment_id
    } = req.body;

    if (!customer_name || !customer_phone || !delivery_address || !items || !items.length) {
      return res.status(400).json({ error: 'Customer details, delivery address, and items are required' });
    }

    const orderId = generateOrderId();
    const itemsJson = JSON.stringify(items);
    const initialPaymentStatus = payment_status || (payment_method === 'cod' ? 'pending' : (payment_method === 'razorpay' ? 'paid' : 'pending'));

    // Driver mock coordinates near restaurant
    const restLat = parseFloat(db.prepare("SELECT value FROM site_settings WHERE key = 'restaurant_lat'").get()?.value || '22.5726');
    const restLng = parseFloat(db.prepare("SELECT value FROM site_settings WHERE key = 'restaurant_lng'").get()?.value || '88.3639');

    db.prepare(`
      INSERT INTO orders (
        id, user_id, customer_name, customer_email, customer_phone,
        delivery_address, delivery_notes, items_json, subtotal,
        delivery_fee, discount, total, payment_method, payment_status,
        razorpay_order_id, razorpay_payment_id, order_status,
        estimated_delivery_time, driver_name, driver_phone, driver_lat, driver_lng
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', '30-40 mins', 'Vikram Express', '+91 98300 55443', ?, ?)
    `).run(
      orderId,
      user_id || null,
      customer_name,
      customer_email || '',
      customer_phone,
      delivery_address,
      delivery_notes || '',
      itemsJson,
      parseFloat(subtotal) || 0,
      parseFloat(delivery_fee) || 0,
      parseFloat(discount) || 0,
      parseFloat(total) || 0,
      payment_method,
      initialPaymentStatus,
      razorpay_order_id || null,
      razorpay_payment_id || null,
      restLat,
      restLng
    );

    const createdOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    createdOrder.items = JSON.parse(createdOrder.items_json);

    res.status(201).json({
      message: 'Order placed successfully',
      order: createdOrder
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Live Track Order by ID (Public)
router.get('/track/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id.toUpperCase());

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.items = JSON.parse(order.items_json);

    // Get restaurant settings for map origin
    const restLat = parseFloat(db.prepare("SELECT value FROM site_settings WHERE key = 'restaurant_lat'").get()?.value || '22.5726');
    const restLng = parseFloat(db.prepare("SELECT value FROM site_settings WHERE key = 'restaurant_lng'").get()?.value || '88.3639');
    const restName = db.prepare("SELECT value FROM site_settings WHERE key = 'restaurant_name'").get()?.value || "L'Amour Gourmet";
    const restPhone = db.prepare("SELECT value FROM site_settings WHERE key = 'phone'").get()?.value || "+91 98765 43210";

    res.json({
      order,
      restaurant: {
        name: restName,
        phone: restPhone,
        lat: restLat,
        lng: restLng
      }
    });
  } catch (err) {
    console.error('Order track error:', err);
    res.status(500).json({ error: 'Failed to retrieve tracking details' });
  }
});

// Customer: Get My Orders
router.get('/my-orders', authenticateToken, (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    const parsedOrders = orders.map(o => ({
      ...o,
      items: JSON.parse(o.items_json)
    }));
    res.json(parsedOrders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
});

// Admin: Get All Orders with filter
router.get('/admin/all', requireAdmin, (req, res) => {
  try {
    const { status, limit } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      query += ' AND order_status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';
    if (limit) {
      query += ` LIMIT ${parseInt(limit, 10)}`;
    }

    const orders = db.prepare(query).all(...params);
    const parsedOrders = orders.map(o => ({
      ...o,
      items: JSON.parse(o.items_json)
    }));

    res.json(parsedOrders);
  } catch (err) {
    console.error('Admin fetch orders error:', err);
    res.status(500).json({ error: 'Failed to fetch admin orders' });
  }
});

// Admin: Update Order Status & Driver Assignment
router.patch('/admin/:id/status', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status, driver_name, driver_phone, estimated_delivery_time, driver_lat, driver_lng } = req.body;

    db.prepare(`
      UPDATE orders SET
        order_status = COALESCE(?, order_status),
        payment_status = COALESCE(?, payment_status),
        driver_name = COALESCE(?, driver_name),
        driver_phone = COALESCE(?, driver_phone),
        estimated_delivery_time = COALESCE(?, estimated_delivery_time),
        driver_lat = COALESCE(?, driver_lat),
        driver_lng = COALESCE(?, driver_lng),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      order_status,
      payment_status,
      driver_name,
      driver_phone,
      estimated_delivery_time,
      driver_lat,
      driver_lng,
      id
    );

    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (updatedOrder) {
      updatedOrder.items = JSON.parse(updatedOrder.items_json);
    }

    res.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (err) {
    console.error('Order update error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
