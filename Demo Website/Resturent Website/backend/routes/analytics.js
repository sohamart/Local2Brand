const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

// Track page visit & heartbeat (Public)
router.post('/visit', (req, res) => {
  try {
    const { path, sessionId, referrer } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    if (sessionId) {
      // Upsert active session ping
      db.prepare(`
        INSERT INTO active_sessions (session_id, last_ping, current_page)
        VALUES (?, CURRENT_TIMESTAMP, ?)
        ON CONFLICT(session_id) DO UPDATE SET last_ping = CURRENT_TIMESTAMP, current_page = ?
      `).run(sessionId, path || '/', path || '/');
    }

    if (path) {
      db.prepare(`
        INSERT INTO page_views (path, referrer, user_agent, ip, session_id)
        VALUES (?, ?, ?, ?, ?)
      `).run(path, referrer || '', userAgent, ip, sessionId || '');
    }

    res.json({ recorded: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

// Admin: Analytics Summary & Real-time Live Visitors
router.get('/admin/overview', requireAdmin, (req, res) => {
  try {
    // Active visitors in last 3 minutes
    const liveThresholdMinutes = 3;
    const activeVisitorsCount = db.prepare(`
      SELECT COUNT(DISTINCT session_id) as count 
      FROM active_sessions 
      WHERE last_ping >= datetime('now', '-${liveThresholdMinutes} minutes')
    `).get()?.count || 1;

    // Total Page Views
    const totalViews = db.prepare('SELECT COUNT(*) as count FROM page_views').get()?.count || 0;

    // Page views today
    const viewsToday = db.prepare(`
      SELECT COUNT(*) as count FROM page_views 
      WHERE date(created_at) = date('now')
    `).get()?.count || 0;

    // Total Orders & Revenue
    const orderStats = db.prepare(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(CASE WHEN order_status != 'cancelled' THEN total ELSE 0 END), 0) as total_revenue,
        COUNT(CASE WHEN order_status IN ('received', 'preparing', 'out_for_delivery') THEN 1 END) as active_orders
      FROM orders
    `).get();

    // Today's revenue
    const todayRevenue = db.prepare(`
      SELECT COALESCE(SUM(total), 0) as today_revenue
      FROM orders 
      WHERE date(created_at) = date('now') AND order_status != 'cancelled'
    `).get()?.today_revenue || 0;

    // Top visited pages
    const topPages = db.prepare(`
      SELECT path, COUNT(*) as visits 
      FROM page_views 
      GROUP BY path 
      ORDER BY visits DESC 
      LIMIT 6
    `).all();

    // Total Registered Customers
    const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get()?.count || 0;

    // Total Reservations
    const totalReservations = db.prepare('SELECT COUNT(*) as count FROM reservations').get()?.count || 0;

    // Recent Page Views Log
    const recentLogs = db.prepare(`
      SELECT id, path, ip, user_agent, created_at 
      FROM page_views 
      ORDER BY created_at DESC 
      LIMIT 15
    `).all();

    res.json({
      activeVisitors: Math.max(1, activeVisitorsCount),
      totalPageViews: totalViews,
      viewsToday,
      totalRevenue: orderStats.total_revenue,
      todayRevenue,
      totalOrders: orderStats.total_orders,
      activeOrders: orderStats.active_orders,
      totalCustomers,
      totalReservations,
      topPages,
      recentLogs
    });
  } catch (err) {
    console.error('Analytics overview error:', err);
    res.status(500).json({ error: 'Failed to generate analytics overview' });
  }
});

module.exports = router;
