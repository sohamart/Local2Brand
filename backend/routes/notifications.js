import express from 'express';
import oneSignalBackend from '../services/oneSignalService.js';
import Notification from '../models/Notification.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// 1. PUBLIC / HEALTH STATUS ROUTES
// ==========================================

// @desc    Check OneSignal Push service status
// @route   GET /api/notifications/status
// @access  Public
router.get('/status', async (req, res) => {
  const isConfigured = oneSignalBackend.isConfigured();
  const { appId, apiKey } = oneSignalBackend.getCredentials();
  const appDetails = isConfigured ? await oneSignalBackend.getAppDetails() : null;

  return res.status(200).json({
    success: true,
    configured: isConfigured,
    appIdConfigured: Boolean(appId),
    apiKeyConfigured: Boolean(apiKey),
    appIdPreview: appId ? `${appId.substring(0, 8)}...` : null,
    totalSubscribers: appDetails?.totalSubscribedUsers ?? null,
    messageablePlayers: appDetails?.messageablePlayers ?? null,
    message: isConfigured
      ? 'OneSignal Push Service is active and ready.'
      : 'OneSignal Push Service is running in standby (configure ONESIGNAL_APP_ID & ONESIGNAL_REST_API_KEY to activate).',
  });
});

// @desc    Send a test push notification (to specific user, admins, or broadcast)
// @route   POST /api/notifications/test
// @access  Public
router.post('/test', async (req, res) => {
  try {
    const {
      userId,
      title = '🎉 LOCAL2BRAND Push Test',
      message = 'Hello! Your browser push notifications are functioning smoothly.',
      url,
      bigPicture,
      target = 'user', // 'user' | 'broadcast' | 'admin'
    } = req.body || {};

    if (!oneSignalBackend.isConfigured()) {
      return res.status(200).json({
        success: false,
        configured: false,
        message: 'OneSignal credentials (ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY) are not set in .env yet.',
      });
    }

    let result;
    if (target === 'broadcast') {
      result = await oneSignalBackend.broadcastPushNotification({
        title,
        message,
        url,
        bigPicture,
      });
    } else if (target === 'admin') {
      result = await oneSignalBackend.sendNotificationToAdmins({
        title,
        message,
        url,
        bigPicture,
      });
    } else {
      if (userId) {
        result = await oneSignalBackend.sendNotificationToUser(userId, {
          title,
          message,
          url,
          bigPicture,
        });
      } else {
        result = await oneSignalBackend.broadcastPushNotification({
          title,
          message,
          url,
          bigPicture,
        });
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Test notification route error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error triggering test push notification',
    });
  }
});

// @desc    Broadcast push notification to all subscribers or targeted segment & store in inboxes
// @route   POST /api/notifications/broadcast
// @access  Public
router.post('/broadcast', async (req, res) => {
  try {
    const { title, message, url, bigPicture, segment, targetAudience = 'all', customUserIds } = req.body || {};

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Notification title and message body are required',
      });
    }

    let result;
    let savedRecipientRole = 'all';

    if (targetAudience === 'admins') {
      savedRecipientRole = 'admin';
      let adminIds = [];
      try {
        const userMod = await import('../models/User.js');
        const User = userMod.User || userMod.default;
        if (User && typeof User.find === 'function') {
          const admins = await User.find({ role: 'admin' }).select('_id email');
          adminIds = admins.map((a) => a._id.toString());
        }
      } catch (e) {}

      result = await oneSignalBackend.sendNotificationToAdmins({
        userIds: adminIds,
        title,
        message,
        url,
        bigPicture,
      });
    } else if (targetAudience === 'clients') {
      savedRecipientRole = 'user';
      let clientIds = [];
      try {
        const userMod = await import('../models/User.js');
        const User = userMod.User || userMod.default;
        if (User && typeof User.find === 'function') {
          const clients = await User.find({ role: { $ne: 'admin' } }).select('_id email');
          clientIds = clients.map((c) => c._id.toString());
        }
      } catch (e) {}

      if (clientIds.length > 0) {
        result = await oneSignalBackend.sendPushNotification({
          userIds: clientIds,
          title,
          message,
          url,
          bigPicture,
        });
      } else {
        result = await oneSignalBackend.sendPushNotification({
          filters: [
            { field: 'tag', key: 'role', relation: '!=', value: 'admin' },
          ],
          title,
          message,
          url,
          bigPicture,
        });
      }
    } else if (targetAudience === 'custom' && customUserIds) {
      result = await oneSignalBackend.sendPushNotification({
        userIds: customUserIds,
        title,
        message,
        url,
        bigPicture,
      });
    } else {
      savedRecipientRole = 'all';
      result = await oneSignalBackend.broadcastPushNotification({
        title,
        message,
        url,
        bigPicture,
        segment: segment || 'Total Subscriptions',
      });
    }

    // Also store broadcast in MongoDB Notification inbox for in-app display
    try {
      await Notification.create({
        recipient: null,
        recipientRole: savedRecipientRole,
        title,
        message,
        type: 'broadcast',
        category: 'Announcement',
        link: url || '/dashboard',
        data: { bigPicture, targetAudience },
        isRead: false,
        priority: 'high',
      });
    } catch (e) {
      console.warn('Notice saving broadcast to MongoDB inbox:', e?.message || e);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Broadcast push error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to dispatch broadcast push notification',
    });
  }
});

// ==========================================
// 2. IN-APP INBOX & PERSONAL NOTIFICATIONS API
// ==========================================

// @desc    Get Inbox Notifications for Authenticated User / Admin (or Guest Broadcasts)
// @route   GET /api/notifications/inbox
// @access  Public / Optional Auth
router.get('/inbox', optionalAuth, async (req, res) => {
  try {
    const user = req.user;

    const { page = 1, limit = 25, type, unreadOnly, search } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
    const skip = (pageNum - 1) * limitNum;

    const now = new Date();
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    // Asynchronous non-blocking background cleanup for read items older than 3 days
    Notification.deleteMany({
      isRead: true,
      $or: [
        { expiresAt: { $lte: now } },
        { readAt: { $lte: threeDaysAgo } }
      ]
    }).catch(() => {});

    // Scope query based on role or guest
    const conditions = [];

    if (user) {
      if (user.role === 'admin') {
        // Admin sees: admin-targeted alerts, global broadcasts, alerts assigned to admin user, or sent to admin email
        conditions.push(
          { recipientRole: 'admin' },
          { recipientRole: 'all' },
          { recipient: user._id },
          { recipientEmail: user.email?.toLowerCase().trim() }
        );
      } else {
        // Regular user sees: personal notifications (by user ID), personal notifications by email, or global broadcasts
        conditions.push(
          { recipient: user._id },
          { recipientRole: 'all' }
        );
        if (user.email) {
          conditions.push({ recipientEmail: user.email.toLowerCase().trim() });
        }
      }
    } else {
      // Unauthenticated visitor sees global announcements & broadcasts
      conditions.push({ recipientRole: 'all' });
    }

    const filter = {
      $or: conditions,
      // Exclude read notifications older than 3 days
      $and: [
        {
          $or: [
            { isRead: false },
            { 
              isRead: true, 
              $or: [
                { expiresAt: { $gt: now } },
                { readAt: { $gt: threeDaysAgo } },
                { expiresAt: null, readAt: null }
              ] 
            }
          ]
        }
      ]
    };

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (unreadOnly === 'true' || unreadOnly === true) {
      filter.isRead = false;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const s = search.trim();
      filter.$and.push({
        $or: [
          { title: { $regex: s, $options: 'i' } },
          { message: { $regex: s, $options: 'i' } },
          { category: { $regex: s, $options: 'i' } },
          { recipientEmail: { $regex: s, $options: 'i' } },
        ],
      });
    }

    // High-speed lightweight projection (excludes heavy emailHtml for instantaneous list loads)
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .select('-emailHtml')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({
        $or: conditions,
        isRead: false,
      }),
    ]);

    return res.status(200).json({
      success: true,
      notifications,
      total,
      unreadCount,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  } catch (error) {
    console.error('Fetch inbox error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch notifications inbox',
    });
  }
});

// @desc    Get live unread count for fast polling / navbar badges
// @route   GET /api/notifications/unread-count
// @access  Public / Optional Auth
router.get('/unread-count', optionalAuth, async (req, res) => {
  try {
    const user = req.user;
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

    const unreadCount = await Notification.countDocuments({
      $or: conditions,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    return res.status(200).json({ success: true, unreadCount: 0 });
  }
});

// @desc    Get a single notification with full details & HTML email replica
// @route   GET /api/notifications/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id).lean();

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch notification details',
    });
  }
});

// @desc    Mark a single notification as read (auto expires 3 days after read)
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // Auto delete 3 days after read

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true, readAt: now, expiresAt },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark notification as read',
    });
  }
});

// @desc    Mark all notifications in scope as read (auto expires 3 days after read)
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
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // Auto delete 3 days after read

    const result = await Notification.updateMany(
      { $or: conditions, isRead: false },
      { isRead: true, readAt: now, expiresAt }
    );

    return res.status(200).json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: 'All notifications marked as read (will auto-archive in 3 days)',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark all notifications as read',
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
