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

    // Geo-Fence Delivery Restriction Check (Burdwan, West Bengal, India)
    const isRestricted = db.prepare("SELECT value FROM site_settings WHERE key = 'delivery_restriction_enabled'").get()?.value !== 'false';
    if (isRestricted) {
      const allowedCity = (db.prepare("SELECT value FROM site_settings WHERE key = 'delivery_allowed_city'").get()?.value || 'Burdwan').toLowerCase();
      const rawPincodes = db.prepare("SELECT value FROM site_settings WHERE key = 'delivery_allowed_pincodes'").get()?.value || '713101, 713102, 713103, 713104, 713105';
      const allowedPincodes = rawPincodes.split(',').map(p => p.trim()).filter(Boolean);

      const addressLower = delivery_address.toLowerCase();
      const pinMatch = delivery_address.match(/\b\d{6}\b/);
      const userPin = pinMatch ? pinMatch[0] : null;

      const hasCityKeywords = 
        addressLower.includes('burdwan') || 
        addressLower.includes('bardhaman') || 
        addressLower.includes('barddhaman') ||
        addressLower.includes('purba bardhaman') ||
        addressLower.includes('curzon gate') ||
        addressLower.includes('golapbag') ||
        addressLower.includes('badamtala') ||
        addressLower.includes('birhata') ||
        addressLower.includes('khagragarh') ||
        addressLower.includes('nutanganj') ||
        addressLower.includes('bajepratappur') ||
        addressLower.includes('ullhas') ||
        addressLower.includes('borehat') ||
        addressLower.includes('shaktigarh') ||
        (userPin && allowedPincodes.includes(userPin));

      if (userPin && allowedPincodes.length > 0 && !allowedPincodes.includes('*') && !allowedPincodes.includes(userPin)) {
        return res.status(400).json({
          error: `Delivery is currently limited to Burdwan (PIN: ${allowedPincodes.join(', ')}), West Bengal. Pincode ${userPin} is outside our delivery zone.`
        });
      }

      if (!hasCityKeywords) {
        return res.status(400).json({
          error: `We currently deliver exclusively within Burdwan (Bardhaman), West Bengal, India. Please enter an address located in Burdwan.`
        });
      }
    }

    const orderId = generateOrderId();
    const itemsJson = JSON.stringify(items);
    const initialPaymentStatus = payment_status || (payment_method === 'cod' ? 'pending' : (payment_method === 'razorpay' ? 'paid' : 'pending'));

    // Driver mock coordinates near restaurant
    const restLat = parseFloat(db.prepare("SELECT value FROM site_settings WHERE key = 'restaurant_lat'").get()?.value || '22.5726');
    const restLng = parseFloat(db.prepare("SELECT value FROM site_settings WHERE key = 'restaurant_lng'").get()?.value || '88.3639');
    const crypto = require('crypto');
    const deliveryOtp = crypto.randomInt(1000, 10000).toString();

    db.prepare(`
      INSERT INTO orders (
        id, user_id, customer_name, customer_email, customer_phone,
        delivery_address, delivery_notes, items_json, subtotal,
        delivery_fee, discount, total, payment_method, payment_status,
        razorpay_order_id, razorpay_payment_id, order_status,
        estimated_delivery_time, driver_name, driver_phone, driver_lat, driver_lng, delivery_otp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', '30-40 mins', 'Vikram Express', '+91 98300 55443', ?, ?, ?)
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
      restLng,
      deliveryOtp
    );

    const createdOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    createdOrder.items = JSON.parse(createdOrder.items_json);

    // Send Customer Invoice & Admin Notification Emails asynchronously
    const emailService = require('../services/emailService');
    emailService.sendOrderConfirmationEmail(createdOrder).catch(err => {
      console.error('Order confirmation email error:', err.message);
    });
    emailService.sendAdminNewOrderNotification(createdOrder).catch(err => {
      console.error('Admin order alert email error:', err.message);
    });

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

    // Ensure unique randomized OTP is present
    if (!order.delivery_otp) {
      const crypto = require('crypto');
      const freshOtp = crypto.randomInt(1000, 10000).toString();
      db.prepare('UPDATE orders SET delivery_otp = ? WHERE id = ?').run(freshOtp, order.id);
      order.delivery_otp = freshOtp;
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

      if (order_status) {
        const emailService = require('../services/emailService');
        emailService.sendOrderStatusUpdateEmail(updatedOrder, order_status).catch(err => {
          console.error('Order status update email error:', err.message);
        });
      }
    }

    res.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (err) {
    console.error('Order update error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// ==========================================
// DELIVERY PARTNER / RIDER APIS
// ==========================================

// Rider: Get Available Orders to Accept & Pick Up
router.get('/driver/available', authenticateToken, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE order_status IN ('received', 'preparing')
      ORDER BY created_at ASC
    `).all();

    const parsed = orders.map(o => ({
      ...o,
      items: JSON.parse(o.items_json)
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Rider available orders error:', err);
    res.status(500).json({ error: 'Failed to fetch available orders' });
  }
});

// Rider: Get My Active Delivery Orders
router.get('/driver/my-active', authenticateToken, (req, res) => {
  try {
    const riderPhone = req.user.phone || '';
    const riderName = req.user.name || '';

    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE order_status = 'out_for_delivery'
        AND (driver_phone = ? OR driver_name = ? OR driver_phone = '+91 98300 55443')
      ORDER BY created_at DESC
    `).all(riderPhone, riderName);

    const parsed = orders.map(o => ({
      ...o,
      items: JSON.parse(o.items_json)
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Rider active orders error:', err);
    res.status(500).json({ error: 'Failed to fetch active rider deliveries' });
  }
});

// Rider: Get My Delivery History / Summary
router.get('/driver/history', authenticateToken, (req, res) => {
  try {
    const riderPhone = req.user.phone || '';
    const riderName = req.user.name || '';

    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE order_status = 'delivered'
        AND (driver_phone = ? OR driver_name = ? OR driver_phone = '+91 98300 55443')
      ORDER BY updated_at DESC
      LIMIT 50
    `).all(riderPhone, riderName);

    const parsed = orders.map(o => ({
      ...o,
      items: JSON.parse(o.items_json)
    }));

    const totalEarnings = parsed.reduce((sum, o) => sum + (o.delivery_fee > 0 ? o.delivery_fee : 40), 0);

    res.json({
      history: parsed,
      stats: {
        completedCount: parsed.length,
        totalEarnings,
        rating: 4.9
      }
    });
  } catch (err) {
    console.error('Rider history error:', err);
    res.status(500).json({ error: 'Failed to fetch delivery history' });
  }
});

// Rider: Accept Order to Deliver
router.post('/driver/:id/accept', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const riderName = req.user.name || 'Vikram Express';
    const riderPhone = req.user.phone || '+91 98300 55443';
    const riderVehicle = req.body.vehicle || 'Express Thermal Bike (DL 04 EV 8892)';

    // Get current restaurant location for initial driver coords
    const restLat = parseFloat(db.prepare("SELECT value FROM site_settings WHERE key = 'restaurant_lat'").get()?.value || '22.5726');
    const restLng = parseFloat(db.prepare("SELECT value FROM site_settings WHERE key = 'restaurant_lng'").get()?.value || '88.3639');

    db.prepare(`
      UPDATE orders SET
        order_status = 'out_for_delivery',
        driver_name = ?,
        driver_phone = ?,
        driver_vehicle = ?,
        driver_lat = ?,
        driver_lng = ?,
        estimated_delivery_time = '20-25 mins',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(riderName, riderPhone, riderVehicle, restLat, restLng, id);

    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (updatedOrder) {
      updatedOrder.items = JSON.parse(updatedOrder.items_json);
      const emailService = require('../services/emailService');
      emailService.sendOrderStatusUpdateEmail(updatedOrder, 'out_for_delivery').catch(() => {});
    }

    res.json({
      message: `Order #${id} accepted! You are now in charge of delivery.`,
      order: updatedOrder
    });
  } catch (err) {
    console.error('Rider accept order error:', err);
    res.status(500).json({ error: 'Failed to accept order' });
  }
});

// Rider: Update Status (e.g. mark delivered with customer OTP, collect cash)
router.patch('/driver/:id/status', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status, driver_lat, driver_lng, otp } = req.body;

    const existingOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // If rider is marking the order as delivered, verify customer Delivery OTP
    if (order_status === 'delivered' && existingOrder.delivery_otp) {
      const providedOtp = (otp || '').toString().trim();
      const expectedOtp = existingOrder.delivery_otp.toString().trim();

      if (!providedOtp || providedOtp !== expectedOtp) {
        return res.status(400).json({ 
          error: 'Incorrect Delivery OTP PIN. Please ask the customer for their 4-digit Handover PIN displayed on their live order screen.' 
        });
      }
    }

    db.prepare(`
      UPDATE orders SET
        order_status = COALESCE(?, order_status),
        payment_status = COALESCE(?, payment_status),
        driver_lat = COALESCE(?, driver_lat),
        driver_lng = COALESCE(?, driver_lng),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(order_status, payment_status, driver_lat, driver_lng, id);

    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (updatedOrder) {
      updatedOrder.items = JSON.parse(updatedOrder.items_json);
      if (order_status) {
        const emailService = require('../services/emailService');
        emailService.sendOrderStatusUpdateEmail(updatedOrder, order_status).catch(() => {});
      }
    }

    res.json({
      message: order_status === 'delivered' 
        ? `✅ Order #${id} verified with OTP and marked delivered!` 
        : `Order #${id} updated to ${order_status || 'updated'}`,
      order: updatedOrder
    });
  } catch (err) {
    console.error('Rider update status error:', err);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
});

// Rider: Broadcast Live GPS Location Update
router.post('/driver/location', authenticateToken, (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const riderPhone = req.user.phone || '';
    const riderName = req.user.name || '';

    db.prepare(`
      UPDATE orders SET
        driver_lat = ?,
        driver_lng = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE order_status = 'out_for_delivery'
        AND (driver_phone = ? OR driver_name = ? OR driver_phone = '+91 98300 55443')
    `).run(parseFloat(lat), parseFloat(lng), riderPhone, riderName);

    res.json({ success: true, message: 'GPS coordinates broadcasted to live customer tracker' });
  } catch (err) {
    console.error('Rider location broadcast error:', err);
    res.status(500).json({ error: 'Failed to update GPS location' });
  }
});

module.exports = router;
