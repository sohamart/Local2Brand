import express from 'express';
import oneSignalBackend from '../services/oneSignalService.js';

const router = express.Router();

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

// @desc    Broadcast push notification to all subscribers or targeted segment
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
    if (targetAudience === 'admins') {
      // Find all admin IDs in DB
      let adminIds = [];
      try {
        const { default: User } = await import('../models/User.js');
        const admins = await User.find({ role: 'admin' }).select('_id email');
        adminIds = admins.map((a) => a._id.toString());
      } catch (e) {}

      result = await oneSignalBackend.sendNotificationToAdmins({
        userIds: adminIds,
        title,
        message,
        url,
        bigPicture,
      });
    } else if (targetAudience === 'clients') {
      // Find all client IDs in DB
      let clientIds = [];
      try {
        const { default: User } = await import('../models/User.js');
        const clients = await User.find({ role: { $ne: 'admin' } }).select('_id email');
        clientIds = clients.map((c) => c._id.toString());
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
      result = await oneSignalBackend.broadcastPushNotification({
        title,
        message,
        url,
        bigPicture,
        segment: segment || 'Total Subscriptions',
      });
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

export default router;
