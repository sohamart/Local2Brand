import express from 'express';
import Notification from '../models/Notification.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { ensureDb, isDbConnected, dataStore } from '../config/dataAdapter.js';

const router = express.Router();

// ==========================================
// 1. PUBLIC / STATUS ROUTE
// ==========================================

// @desc    Check Notification service status
// @route   GET /api/notifications/status
// @access  Public
router.get('/status', async (req, res) => {
  return res.status(200).json({
    success: true,
    configured: true,
    service: 'In-App Web Mailbox Engine',
    message: 'Weblets In-App Mailbox & Alert Service is active and ready.',
  });
});

// @desc    Broadcast in-app notification to all subscribers / role
// @route   POST /api/notifications/broadcast
// @access  Public
router.post('/broadcast', async (req, res) => {
  try {
    const { title, message, url, bigPicture, targetAudience = 'all' } = req.body || {};

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Notification title and message body are required',
      });
    }

    let savedRecipientRole = 'all';
    if (targetAudience === 'admins') savedRecipientRole = 'admin';
    else if (targetAudience === 'clients') savedRecipientRole = 'user';

    const notif = await Notification.create({
      recipient: null,
      recipientRole: savedRecipientRole,
      title: title.trim(),
      message: message.trim(),
      type: 'broadcast',
      category: 'Announcement',
      link: url || '/dashboard',
      data: { bigPicture, targetAudience },
      isRead: false,
      priority: 'high',
    });

    return res.status(200).json({
      success: true,
      message: 'Broadcast notification delivered to user inboxes! 🚀',
      notification: notif,
    });
  } catch (error) {
    console.error('Broadcast notification error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to dispatch broadcast notification',
    });
  }
});

// ==========================================
// 2. IN-APP INBOX & NOTIFICATIONS API
// ==========================================

// @desc    Get Inbox Notifications for User / Admin
// @route   GET /api/notifications/inbox
// @access  Public / Optional Auth
router.get('/inbox', optionalAuth, async (req, res) => {
  try {
    await ensureDb().catch(() => {});
    const user = req.user;

    const { page = 1, limit = 25, type, category } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
    const skip = (pageNum - 1) * limitNum;

    const now = new Date();
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    if (isDbConnected()) {
      Notification.deleteMany({
        isRead: true,
        $or: [
          { expiresAt: { $lte: now } },
          { readAt: { $lte: threeDaysAgo } }
        ]
      }).catch(() => {});

      const conditions = [];

      if (user) {
        if (user.role === 'admin') {
          conditions.push(
            { recipientRole: 'admin' },
            { recipientRole: 'all' },
            { recipient: user._id },
            { recipientEmail: user.email?.toLowerCase().trim() }
          );
        } else {
          conditions.push(
            { recipient: user._id },
            { recipientRole: 'all' }
          );
          if (user.email) {
            conditions.push({ recipientEmail: user.email.toLowerCase().trim() });
          }
        }
      } else {
        conditions.push({ recipientRole: 'all' });
      }

      const andClauses = [];
      if (conditions.length > 0) {
        andClauses.push({ $or: conditions });
      }

      andClauses.push({
        $or: [
          { isRead: false },
          { isRead: { $exists: false } },
          { readAt: null },
          { readAt: { $gt: threeDaysAgo } },
          { expiresAt: { $gt: now } },
          { expiresAt: null }
        ]
      });

      if (category && category !== 'all') {
        andClauses.push({
          $or: [
            { category: { $regex: category, $options: 'i' } },
            { type: { $regex: category, $options: 'i' } }
          ]
        });
      } else if (type && type !== 'all') {
        andClauses.push({ type });
      }

      const finalQuery = andClauses.length > 0 ? { $and: andClauses } : {};

      const [notifications, total, unreadCount] = await Promise.all([
        Notification.find(finalQuery).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
        Notification.countDocuments(finalQuery),
        Notification.countDocuments({
          $and: [
            conditions.length > 0 ? { $or: conditions } : {},
            { isRead: false }
          ]
        })
      ]);

      return res.status(200).json({
        success: true,
        notifications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum) || 1,
        },
        unreadCount,
      });
    }

    // Fallback if local
    return res.status(200).json({
      success: true,
      notifications: [],
      pagination: { page: 1, limit: limitNum, total: 0, pages: 1 },
      unreadCount: 0,
    });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch notifications',
    });
  }
});

// @desc    Get Unread Notification Count
// @route   GET /api/notifications/unread-count
// @access  Public / Optional Auth
router.get('/unread-count', optionalAuth, async (req, res) => {
  try {
    await ensureDb().catch(() => {});
    const user = req.user;

    if (!isDbConnected()) {
      return res.status(200).json({ success: true, count: 0 });
    }

    const conditions = [];
    if (user) {
      if (user.role === 'admin') {
        conditions.push(
          { recipientRole: 'admin' },
          { recipientRole: 'all' },
          { recipient: user._id },
          { recipientEmail: user.email?.toLowerCase().trim() }
        );
      } else {
        conditions.push(
          { recipient: user._id },
          { recipientRole: 'all' }
        );
        if (user.email) {
          conditions.push({ recipientEmail: user.email.toLowerCase().trim() });
        }
      }
    } else {
      conditions.push({ recipientRole: 'all' });
    }

    const count = await Notification.countDocuments({
      $and: [
        { $or: conditions },
        { isRead: false }
      ]
    });

    return res.status(200).json({
      success: true,
      count: count || 0,
    });
  } catch (error) {
    return res.status(200).json({ success: true, count: 0 });
  }
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true, readAt: now, expiresAt },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update notification',
    });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    const user = req.user;
    const conditions = [];

    if (user.role === 'admin') {
      conditions.push(
        { recipientRole: 'admin' },
        { recipientRole: 'all' },
        { recipient: user._id },
        { recipientEmail: user.email?.toLowerCase().trim() }
      );
    } else {
      conditions.push(
        { recipient: user._id },
        { recipientRole: 'all' }
      );
      if (user.email) {
        conditions.push({ recipientEmail: user.email.toLowerCase().trim() });
      }
    }

    const now = new Date();
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const result = await Notification.updateMany(
      { $or: conditions, isRead: false },
      { isRead: true, readAt: now, expiresAt }
    );

    return res.status(200).json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark notifications as read',
    });
  }
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Notification deleted from inbox',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete notification',
    });
  }
});

// @desc    Clear all read notifications
// @route   DELETE /api/notifications/clear-all
// @access  Private
router.delete('/clear-all', protect, async (req, res) => {
  try {
    const user = req.user;
    const conditions = [];

    if (user.role === 'admin') {
      conditions.push(
        { recipientRole: 'admin' },
        { recipientRole: 'all' },
        { recipient: user._id },
        { recipientEmail: user.email?.toLowerCase().trim() }
      );
    } else {
      conditions.push(
        { recipient: user._id },
        { recipientRole: 'all' }
      );
      if (user.email) {
        conditions.push({ recipientEmail: user.email.toLowerCase().trim() });
      }
    }

    const result = await Notification.deleteMany({
      $or: conditions,
      isRead: true,
    });

    return res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
      message: 'Cleared all read notifications',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to clear notifications',
    });
  }
});

export default router;
