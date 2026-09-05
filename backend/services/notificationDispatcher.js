import Notification from '../models/Notification.js';
import User from '../models/User.js';
import oneSignalBackend from './oneSignalService.js';

/**
 * Platform-Wide Unified Notification & Inbox Dispatcher
 * Synchronizes In-App Inbox Records with OneSignal Push Alerts
 */
class NotificationDispatcher {
  /**
   * Create an in-app notification record and optionally trigger OneSignal push
   */
  async dispatch({
    recipient = null,
    recipientEmail = '',
    recipientRole = 'user',
    title,
    message,
    type = 'system',
    category = 'General',
    link = '',
    data = {},
    emailHtml = '',
    priority = 'normal',
    sendPush = true,
  }) {
    if (!title || !message) return null;

    let notificationRecord = null;
    let pushResult = null;

    try {
      // 1. Resolve Recipient ID if only email is provided
      let finalRecipient = recipient;
      let finalEmail = (recipientEmail || '').toLowerCase().trim();

      if (!finalRecipient && finalEmail && recipientRole !== 'admin') {
        try {
          const user = await User.findOne({ email: new RegExp(`^${finalEmail}$`, 'i') }).select('_id');
          if (user?._id) finalRecipient = user._id;
        } catch (e) {}
      }

      // 2. Save In-App Notification in MongoDB
      notificationRecord = await Notification.create({
        recipient: finalRecipient || null,
        recipientEmail: finalEmail,
        recipientRole,
        title: title.trim(),
        message: message.trim(),
        type,
        category,
        link: link || '/dashboard',
        data: data || {},
        emailHtml: emailHtml || '',
        isRead: false,
        priority,
      });

      // 3. Dispatch OneSignal Push Notification if enabled
      if (sendPush && oneSignalBackend.isConfigured()) {
        if (recipientRole === 'admin' && !finalRecipient) {
          pushResult = await oneSignalBackend.sendNotificationToAdmins({
            title,
            message,
            url: link || '/admin',
            data: { ...data, notificationId: notificationRecord._id.toString(), type },
          });
        } else if (finalRecipient || finalEmail) {
          pushResult = await oneSignalBackend.sendPushNotification({
            userIds: finalRecipient ? [finalRecipient.toString()] : [],
            emails: finalEmail ? [finalEmail] : [],
            title,
            message,
            url: link || '/dashboard',
            data: { ...data, notificationId: notificationRecord._id.toString(), type },
          });
        } else if (recipientRole === 'all') {
          pushResult = await oneSignalBackend.broadcastPushNotification({
            title,
            message,
            url: link || '/dashboard',
            data: { ...data, notificationId: notificationRecord._id.toString(), type },
          });
        }
      }

      return {
        success: true,
        notification: notificationRecord,
        pushResult,
      };
    } catch (error) {
      console.error('Notification dispatcher exception:', error);
      return {
        success: false,
        error: error.message || 'Error creating in-app notification',
      };
    }
  }

  /**
   * Dispatch an alert targeted directly to administrators
   */
  async dispatchToAdmin({
    title,
    message,
    type = 'system',
    category = 'Admin Alert',
    link = '/admin',
    data = {},
    emailHtml = '',
    priority = 'high',
    sendPush = true,
  }) {
    return this.dispatch({
      recipient: null,
      recipientRole: 'admin',
      title,
      message,
      type,
      category,
      link,
      data,
      emailHtml,
      priority,
      sendPush,
    });
  }

  /**
   * Dispatch an alert targeted to a specific client user
   */
  async dispatchToUser({
    userId,
    email = '',
    title,
    message,
    type = 'order',
    category = 'Order Update',
    link = '/dashboard',
    data = {},
    emailHtml = '',
    priority = 'normal',
    sendPush = true,
  }) {
    return this.dispatch({
      recipient: userId || null,
      recipientEmail: email,
      recipientRole: 'user',
      title,
      message,
      type,
      category,
      link,
      data,
      emailHtml,
      priority,
      sendPush,
    });
  }
}

export const notificationDispatcher = new NotificationDispatcher();
export default notificationDispatcher;
