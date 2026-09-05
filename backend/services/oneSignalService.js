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
   * Intelligently resolves raw inputs (emails, user IDs, or mixed strings)
   * into matching MongoDB User _ids, email tags, and external_ids.
   */
  async resolveTargetUserIds(inputs) {
    if (!inputs) return { userIds: [], emails: [] };

    let rawList = [];
    if (Array.isArray(inputs)) {
      rawList = inputs.map(String).map((s) => s.trim()).filter(Boolean);
    } else if (typeof inputs === 'string') {
      rawList = inputs.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const emails = [];
    const directIds = [];

    for (const item of rawList) {
      if (item.includes('@')) {
        emails.push(item.toLowerCase().trim());
      } else {
        directIds.push(item.trim());
      }
    }

    const resolvedUserIds = [...directIds];

    if (emails.length > 0) {
      // 1. Query MongoDB User collection
      try {
        const { default: User } = await import('../models/User.js');
        const foundUsers = await User.find({
          email: { $in: emails.map((e) => new RegExp(`^${e}$`, 'i')) },
        }).select('_id email');

        foundUsers.forEach((u) => {
          if (u?._id) resolvedUserIds.push(u._id.toString());
        });
      } catch (err) {
        console.warn('User lookup notice in OneSignal service:', err?.message || err);
      }

      // 2. Query Requirement collection
      try {
        const { default: Requirement } = await import('../models/Requirement.js');
        const foundReqs = await Requirement.find({
          $or: [
            { 'clientInfo.email': { $in: emails.map((e) => new RegExp(`^${e}$`, 'i')) } },
            { email: { $in: emails.map((e) => new RegExp(`^${e}$`, 'i')) } },
          ],
        }).select('user clientInfo email');

        foundReqs.forEach((r) => {
          if (r?.user) resolvedUserIds.push(r.user.toString());
        });
      } catch (err) {}

      // 3. Query fallback dataStore
      try {
        const { default: dataStore } = await import('../utils/dataStore.js');
        const fallbackUsers = await dataStore.getAllUsers();
        fallbackUsers.forEach((u) => {
          const uEmail = (u.email || '').toLowerCase().trim();
          if (emails.includes(uEmail) && (u._id || u.id)) {
            resolvedUserIds.push(String(u._id || u.id));
          }
        });
      } catch (err) {}
    }

    const uniqueUserIds = [...new Set(resolvedUserIds.filter(Boolean))];
    const uniqueEmails = [...new Set(emails.filter(Boolean))];

    return {
      userIds: uniqueUserIds,
      emails: uniqueEmails,
    };
  }

  /**
   * Universal method to dispatch Push Notifications via OneSignal REST API
   *
   * @param {Object} options
   * @param {string|string[]} [options.userIds] Single or array of user IDs or email addresses
   * @param {string|string[]} [options.externalUserIds] Backward-compatible alias for userIds
   * @param {string|string[]} [options.emails] Array of client email addresses
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
    emails,
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

    // Automatically resolve raw userIds/emails into database User _ids and email tags
    const rawTargets = [
      ...(userIds ? (Array.isArray(userIds) ? userIds : [userIds]) : []),
      ...(externalUserIds ? (Array.isArray(externalUserIds) ? externalUserIds : [externalUserIds]) : []),
      ...(emails ? (Array.isArray(emails) ? emails : [emails]) : []),
    ];

    const { userIds: resolvedUserIds, emails: resolvedEmails } = await this.resolveTargetUserIds(rawTargets);

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
    if (resolvedUserIds.length > 0) {
      // Include resolved user database IDs and any raw IDs
      payload.include_aliases = {
        external_id: resolvedUserIds,
      };
      payload.target_channel = 'push';
      payload.include_external_user_ids = resolvedUserIds;
    } else if (resolvedEmails.length > 0) {
      // If no DB user found, target via email tag filters
      const emailFilters = [];
      resolvedEmails.forEach((email, idx) => {
        if (idx > 0) emailFilters.push({ operator: 'OR' });
        emailFilters.push({ field: 'tag', key: 'email', relation: '=', value: email });
      });
      payload.filters = emailFilters;
    } else if (filters && Array.isArray(filters) && filters.length > 0) {
      payload.filters = filters;
    } else if (segments && Array.isArray(segments) && segments.length > 0) {
      payload.included_segments = segments;
    } else {
      // Default to all subscribed users if no specific targets specified
      payload.included_segments = ['Total Subscriptions', 'Subscribed Users'];
    }

    try {
      const targetSummary = resolvedUserIds.length > 0
        ? `[User IDs: ${resolvedUserIds.join(', ')}]`
        : resolvedEmails.length > 0
        ? `[Emails: ${resolvedEmails.join(', ')}]`
        : segments?.join(', ') || 'All Subscribed';

      console.log(`📡 Sending OneSignal Push Notification: "${title}" -> Targets: ${targetSummary}`);

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
        let errorMsg = resData.errors ? (Array.isArray(resData.errors) ? resData.errors.join(', ') : JSON.stringify(resData.errors)) : 'Unknown OneSignal error';
        
        if (errorMsg.includes('All included players are not subscribed') || errorMsg.includes('not subscribed')) {
          errorMsg = `None of the targeted devices for (${resolvedEmails.length ? resolvedEmails.join(', ') : resolvedUserIds.join(', ')}) have active push permissions subscribed in their browser yet. Push will reach them once they log in and allow browser notifications.`;
        }

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
