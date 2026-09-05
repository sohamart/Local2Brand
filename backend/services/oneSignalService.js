import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendEnvPath = path.join(__dirname, '..', '.env');

try {
  dotenv.config({ path: backendEnvPath, override: true });
} catch (e) {}

const ONESIGNAL_API_URL = 'https://onesignal.com/api/v1/notifications';
const DEFAULT_ICON = 'https://local2brand.com/favicon.jpg';
const DEFAULT_LOGO = 'https://local2brand.com/logo.jpg';

class OneSignalBackendService {
  constructor() {
    this.appId = process.env.ONESIGNAL_APP_ID || '';
    this.apiKey = process.env.ONESIGNAL_REST_API_KEY || '';
  }

  getCredentials() {
    try {
      dotenv.config({ path: backendEnvPath, override: true });
    } catch (e) {}
    const appId = (process.env.ONESIGNAL_APP_ID || this.appId || '').trim();
    const apiKey = (process.env.ONESIGNAL_REST_API_KEY || this.apiKey || '').trim();
    return { appId, apiKey };
  }

  /**
   * Check if OneSignal backend REST credentials are validly configured
   */
  isConfigured() {
    const { appId, apiKey } = this.getCredentials();
    return Boolean(
      appId &&
      apiKey &&
      appId.length > 5 &&
      apiKey.length > 5
    );
  }

  /**
   * Universal method to dispatch Push Notifications via OneSignal REST API
   *
   * @param {Object} options
   * @param {string|string[]} [options.userIds] Single or array of user IDs (external_id)
   * @param {string|string[]} [options.externalUserIds] Backward-compatible alias for userIds
   * @param {string[]} [options.segments] OneSignal segments (e.g. ['Total Subscriptions', 'Subscribed Users'])
   * @param {Array<Object>} [options.filters] OneSignal tag/attribute filters
   * @param {string} options.title Notification title
   * @param {string} options.message Notification message body
   * @param {string} [options.url] URL opened when user clicks the notification
   * @param {Object} [options.data] Custom JSON metadata payload
   * @param {string} [options.icon] Custom icon URL (default: Local2Brand favicon)
   * @param {string} [options.badge] Custom badge URL
   * @param {string} [options.bigPicture] Custom large image banner
   */
  async sendPushNotification({
    userIds,
    externalUserIds,
    segments,
    filters,
    title,
    message,
    url,
    data = {},
    icon = DEFAULT_ICON,
    badge = DEFAULT_ICON,
    bigPicture,
  }) {
    const { appId, apiKey } = this.getCredentials();

    if (!this.isConfigured()) {
      console.warn('ℹ️ OneSignal Backend Notice: ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY is missing in environment variables. Push skipped.');
      return {
        success: false,
        skipped: true,
        message: 'OneSignal REST API credentials not configured on server',
      };
    }

    if (!title || !message) {
      return { success: false, message: 'Notification title and message body are required.' };
    }

    // Determine target users / recipients
    const targetUserIds = [];
    if (userIds) {
      if (Array.isArray(userIds)) targetUserIds.push(...userIds.map(String));
      else targetUserIds.push(String(userIds));
    }
    if (externalUserIds) {
      if (Array.isArray(externalUserIds)) targetUserIds.push(...externalUserIds.map(String));
      else targetUserIds.push(String(externalUserIds));
    }

    const uniqueUserIds = [...new Set(targetUserIds.filter(Boolean))];

    // Base Notification Payload
    const payload = {
      app_id: appId,
      headings: { en: title },
      contents: { en: message },
      url: url || (process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/dashboard` : 'https://local2brand.com/dashboard'),
      chrome_web_icon: icon || DEFAULT_ICON,
      chrome_web_badge: badge || DEFAULT_ICON,
      firefox_icon: icon || DEFAULT_ICON,
      data: {
        ...data,
        sentAt: new Date().toISOString(),
      },
    };

    if (bigPicture) {
      payload.chrome_web_image = bigPicture;
      payload.big_picture = bigPicture;
    }

    // Set targeting
    if (uniqueUserIds.length > 0) {
      // Modern OneSignal v16 alias targeting + backward compatibility
      payload.include_aliases = {
        external_id: uniqueUserIds,
      };
      payload.target_channel = 'push';
      payload.include_external_user_ids = uniqueUserIds;
    } else if (filters && Array.isArray(filters) && filters.length > 0) {
      payload.filters = filters;
    } else if (segments && Array.isArray(segments) && segments.length > 0) {
      payload.included_segments = segments;
    } else {
      // Default to all subscribed users if no specific targets specified
      payload.included_segments = ['Total Subscriptions', 'Subscribed Users'];
    }

    try {
      console.log(`📡 Sending OneSignal Push Notification: "${title}" -> [Targets: ${uniqueUserIds.length ? uniqueUserIds.join(', ') : segments?.join(', ') || 'All Subscribed'}]`);

      const response = await fetch(ONESIGNAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Basic ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json().catch(() => ({}));

      if (response.ok && (resData.id || resData.recipients !== undefined)) {
        console.log(`✅ OneSignal Push Delivered: ID: ${resData.id}, Recipients: ${resData.recipients ?? 'Active'}`);
        return {
          success: true,
          id: resData.id,
          recipients: resData.recipients,
          data: resData,
        };
      } else {
        const errorMsg = resData.errors ? (Array.isArray(resData.errors) ? resData.errors.join(', ') : JSON.stringify(resData.errors)) : 'Unknown OneSignal error';
        console.warn('OneSignal API response warning:', errorMsg);
        return {
          success: false,
          message: errorMsg,
          data: resData,
        };
      }
    } catch (err) {
      console.error('OneSignal Push Dispatch Exception:', err);
      return {
        success: false,
        message: err.message || 'Error communicating with OneSignal REST API',
      };
    }
  }

  /**
   * Send notification to a specific registered user by their User ID
   */
  async sendNotificationToUser(userId, { title, message, url, data = {}, icon }) {
    if (!userId) return { success: false, message: 'User ID is required' };
    return this.sendPushNotification({
      userIds: [userId],
      title,
      message,
      url,
      data,
      icon,
    });
  }

  /**
   * Send notification to all administrators
   */
  async sendNotificationToAdmins({ title, message, url, data = {}, icon }) {
    return this.sendPushNotification({
      filters: [
        { field: 'tag', key: 'role', relation: '=', value: 'admin' },
      ],
      title,
      message,
      url: url || (process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/admin` : 'https://local2brand.com/admin'),
      data: { ...data, target: 'admin' },
      icon,
    });
  }

  /**
   * Broadcast push notification to all subscribed users
   */
  async broadcastPushNotification({ title, message, url, data = {}, icon, bigPicture, segment = 'Total Subscriptions' }) {
    return this.sendPushNotification({
      segments: [segment, 'Subscribed Users'],
      title,
      message,
      url,
      data,
      icon,
      bigPicture,
    });
  }
}

export const oneSignalBackend = new OneSignalBackendService();
export default oneSignalBackend;
