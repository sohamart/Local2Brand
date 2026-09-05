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
const DEFAULT_ICON = 'https://local2brand.vercel.app/logo.jpg';
const DEFAULT_BADGE = 'https://local2brand.vercel.app/favicon.jpg';
const DEFAULT_LOGO = 'https://local2brand.vercel.app/logo.jpg';

export const resolveNotificationUrl = (url, defaultPath = '/dashboard') => {
  const prodBase = 'https://local2brand.vercel.app';
  if (!url) {
    return `${prodBase}${defaultPath.startsWith('/') ? defaultPath : `/${defaultPath}`}`;
  }

  let finalUrl = String(url).trim();

  // If comma separated (like CLIENT_URL in .env)
  if (finalUrl.includes(',')) {
    finalUrl = finalUrl.split(',')[0].trim();
  }

  // Replace localhost or 127.0.0.1 with live production URL
  if (finalUrl.includes('localhost') || finalUrl.includes('127.0.0.1')) {
    try {
      const parsed = new URL(finalUrl);
      const pathname = parsed.pathname === '/' ? defaultPath : parsed.pathname;
      return `${prodBase}${pathname || defaultPath}${parsed.search || ''}${parsed.hash || ''}`;
    } catch (e) {
      return `${prodBase}${defaultPath}`;
    }
  }

  // If relative path
  if (finalUrl.startsWith('/')) {
    return `${prodBase}${finalUrl}`;
  }

  // If already full http(s)
  if (finalUrl.startsWith('http://') || finalUrl.startsWith('https://')) {
    return finalUrl;
  }

  return `${prodBase}/${finalUrl.replace(/^\/+/, '')}`;
};

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
      inputs.forEach((item) => {
        if (typeof item === 'string') {
          item.split(',').forEach((sub) => {
            const clean = sub.trim().replace(/^[,\s]+|[,\s]+$/g, '');
            if (clean) rawList.push(clean);
          });
        } else if (item) {
          rawList.push(String(item).trim());
        }
      });
    } else if (typeof inputs === 'string') {
      inputs.split(',').forEach((sub) => {
        const clean = sub.trim().replace(/^[,\s]+|[,\s]+$/g, '');
        if (clean) rawList.push(clean);
      });
    }

    const emails = [];
    const directIds = [];

    for (const item of rawList) {
      const cleanItem = item.trim().replace(/^[,\s]+|[,\s]+$/g, '');
      if (!cleanItem) continue;
      if (cleanItem.includes('@')) {
        emails.push(cleanItem.toLowerCase());
      } else {
        directIds.push(cleanItem);
      }
    }

    const resolvedUserIds = [...directIds];

    if (emails.length > 0) {
      // 1. Query MongoDB User collection
      try {
        const userMod = await import('../models/User.js');
        const User = userMod.User || userMod.default;
        if (User && typeof User.find === 'function') {
          const foundUsers = await User.find({
            email: { $in: emails.map((e) => new RegExp(`^${e}$`, 'i')) },
          }).select('_id email');

          foundUsers.forEach((u) => {
            if (u?._id) resolvedUserIds.push(u._id.toString());
          });
        }
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

    // Guaranteed production absolute URL resolution
    const resolvedUrl = resolveNotificationUrl(url, '/dashboard');

    const payload = {
      app_id: appId,
      headings: { en: title },
      contents: { en: message },
      url: resolvedUrl,
      chrome_web_icon: icon || DEFAULT_ICON,
      chrome_web_badge: badge || DEFAULT_BADGE,
      firefox_icon: icon || DEFAULT_ICON,
      safari_icon: icon || DEFAULT_ICON,
      priority: 10,
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
      // Target specific users strictly on push channel via aliases
      payload.include_aliases = {
        external_id: resolvedUserIds,
      };
      payload.target_channel = 'push';
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
      payload.included_segments = ['Total Subscriptions', 'Active Subscriptions'];
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
          const targetDetail = resolvedEmails.length
            ? resolvedEmails.join(', ')
            : resolvedUserIds.length
            ? resolvedUserIds.join(', ')
            : filters?.length
            ? 'selected filter'
            : segments?.join(', ') || 'selected audience';
          errorMsg = `None of the targeted devices (${targetDetail}) have active push permissions subscribed in their browser yet. Push will reach them once they open the site, log in, and allow browser notifications.`;
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
   * Fetch live application stats (including total_subscribed_users and messageable_players)
   */
  async getAppDetails() {
    const { appId, apiKey } = this.getCredentials();
    if (!this.isConfigured()) return null;

    try {
      const response = await fetch(`https://onesignal.com/api/v1/apps/${appId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${apiKey}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return {
          id: data.id,
          name: data.name,
          players: data.players,
          messageablePlayers: data.messageable_players,
          totalSubscribedUsers: data.total_subscribed_users || data.players || 0,
        };
      }
    } catch (e) {
      console.warn('OneSignal getAppDetails error:', e?.message || e);
    }
    return null;
  }

  /**
   * Send notification to a specific registered user by their User ID
   */
  async sendNotificationToUser(userId, { title, message, url, data = {}, icon, bigPicture }) {
    if (!userId) return { success: false, message: 'User ID is required' };
    return this.sendPushNotification({
      userIds: [userId],
      title,
      message,
      url,
      data,
      icon,
      bigPicture,
    });
  }

  /**
   * Send notification to all administrators with multi-tier fallback
   */
  async sendNotificationToAdmins({ userIds = [], title, message, url, data = {}, icon, bigPicture }) {
    let resolvedAdminIds = [...(userIds ? (Array.isArray(userIds) ? userIds : [userIds]) : [])];

    try {
      const userMod = await import('../models/User.js');
      const User = userMod.User || userMod.default;
      if (User && typeof User.find === 'function') {
        const admins = await User.find({ role: 'admin' }).select('_id email');
        admins.forEach((a) => {
          if (a?._id) resolvedAdminIds.push(a._id.toString());
        });
      }
    } catch (e) {}

    const uniqueAdminIds = [...new Set(resolvedAdminIds.filter(Boolean))];
    const resolvedAdminUrl = resolveNotificationUrl(url, '/admin');

    let result = null;

    // 1. Try targeting specific admin User IDs
    if (uniqueAdminIds.length > 0) {
      result = await this.sendPushNotification({
        userIds: uniqueAdminIds,
        title,
        message,
        url: resolvedAdminUrl,
        data: { ...data, target: 'admin' },
        icon,
        bigPicture,
      });
    }

    // 2. If no subscribed player matched specific IDs, try role=admin tag filter
    if (!result || !result.success) {
      result = await this.sendPushNotification({
        filters: [
          { field: 'tag', key: 'role', relation: '=', value: 'admin' },
        ],
        title,
        message,
        url: resolvedAdminUrl,
        data: { ...data, target: 'admin' },
        icon,
        bigPicture,
      });
    }

    // 3. Fallback to general broadcast if admin-specific tag not populated yet
    if (!result || !result.success) {
      result = await this.broadcastPushNotification({
        title,
        message,
        url: resolvedAdminUrl,
        data: { ...data, target: 'admin' },
        icon,
        bigPicture,
      });
    }

    return result;
  }

  /**
   * Broadcast push notification to all subscribed users
   */
  async broadcastPushNotification({ title, message, url, data = {}, icon, bigPicture, segment = 'Total Subscriptions' }) {
    return this.sendPushNotification({
      segments: [segment, 'Active Subscriptions'],
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
