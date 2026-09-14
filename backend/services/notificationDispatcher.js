import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendEmail, wrapAgencyEmail, getAdminRecipients, getClientUrl } from '../utils/email.js';

/**
 * Platform-Wide Unified In-App Mailbox & Real-Time Email Dispatcher
 * Manages user & admin in-app notifications and automatically sends email alerts.
 */
class NotificationDispatcher {
  /**
   * Create an in-app notification record and dispatch email
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
  }) {
    if (!title || !message) return null;

    let notificationRecord = null;

    try {
      // 1. Resolve Recipient ID and Email
      let finalRecipient = recipient;
      let finalEmail = (recipientEmail || '').toLowerCase().trim();

      if (!finalEmail && finalRecipient && recipientRole !== 'admin') {
        try {
          const uDoc = await User.findById(finalRecipient).select('email name');
          if (uDoc?.email) finalEmail = uDoc.email.trim().toLowerCase();
        } catch (e) {}
      }

      if (!finalRecipient && finalEmail && recipientRole !== 'admin') {
        try {
          const user = await User.findOne({ email: new RegExp(`^${finalEmail}$`, 'i') }).select('_id');
          if (user?._id) finalRecipient = user._id;
        } catch (e) {}
      }

      // 2. Save In-App Notification in MongoDB
      try {
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
      } catch (dbErr) {
        console.warn('Notification DB create notice:', dbErr.message);
      }

      // 3. Mirror In-App Alert via Email to Target Recipients
      this.sendNotificationEmail({
        recipientRole,
        targetEmail: finalEmail,
        title,
        message,
        category,
        link,
        emailHtml,
        priority,
      }).catch((emailErr) => console.warn('Notification email dispatch notice:', emailErr.message));

      return {
        success: true,
        notification: notificationRecord,
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
   * Helper to format and send branded email for in-app notifications
   */
  async sendNotificationEmail({
    recipientRole,
    targetEmail,
    title,
    message,
    category = 'Notification',
    link = '',
    emailHtml = '',
    priority = 'normal',
  }) {
    const clientUrl = getClientUrl();
    const resolvedLink = link.startsWith('http') ? link : `${clientUrl}${link.startsWith('/') ? link : `/${link}`}`;

    let recipients = [];
    if (recipientRole === 'admin') {
      recipients = getAdminRecipients();
    } else if (targetEmail && targetEmail.includes('@')) {
      recipients = [targetEmail];
    }

    if (recipients.length === 0) return { success: false, reason: 'No recipients' };

    const contentHtml = emailHtml || `
      <div style="margin: 10px 0 16px 0;">
        <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6; font-size: 14px;">
          ${message}
        </p>
        <div class="bg-box border-theme" style="background-color: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 14px 16px; margin: 16px 0; box-sizing: border-box;">
          <div style="font-size: 11px; color: #a855f7; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 4px;">Category: ${category}</div>
          <div style="font-size: 13px; color: #ffffff; font-weight: 700;">${title}</div>
        </div>
      </div>
    `;

    const html = wrapAgencyEmail({
      preheader: message.slice(0, 120),
      headerBadge: category ? category.toUpperCase() : 'WEBLETS NOTIFICATION',
      title: title,
      subtitle: `Official Alert &bull; WEBLETS Studio`,
      contentHtml,
      ctaText: recipientRole === 'admin' ? 'Open Admin Panel' : 'View in Client Hub',
      ctaUrl: resolvedLink || clientUrl,
    });

    return await sendEmail({
      to: recipients,
      subject: `[WEBLETS] ${title}`,
      html,
      text: `${title}\n\n${message}\n\nLink: ${resolvedLink}`,
      priority: priority === 'high' ? 'high' : 'normal',
    });
  }

  /**
   * Dispatch an alert targeted directly to administrators
   */
  async dispatchToAdmin({
    title,
    message,
    type = 'system',
    category = 'Admin Alert',
    link = '/admin/inbox',
    data = {},
    emailHtml = '',
    priority = 'high',
  }) {
    return await this.dispatch({
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
    });
  }

  /**
   * Dispatch an alert targeted directly to a specific user
   */
  async dispatchToUser({
    userId = null,
    email = '',
    title,
    message,
    type = 'order_status',
    category = 'Order Update',
    link = '/dashboard',
    data = {},
    emailHtml = '',
    priority = 'normal',
  }) {
    return await this.dispatch({
      recipient: userId,
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
    });
  }
}

export const notificationDispatcher = new NotificationDispatcher();
export default notificationDispatcher;
