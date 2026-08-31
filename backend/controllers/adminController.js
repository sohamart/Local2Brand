import { dataStore } from '../config/dataAdapter.js';
import { sendEmail } from '../utils/email.js';

export const getAdminStats = async (req, res) => {
  try {
    const [leads, callbacks, users, notifications] = await Promise.all([
      dataStore.getAllLeads(),
      dataStore.getAllCallbacks(),
      dataStore.getAllUsers(),
      dataStore.getNotifications(10),
    ]);

    const totalLeads = leads.length;
    const pendingLeads = leads.filter((l) => l.status === 'pending').length;
    const inProgressLeads = leads.filter((l) => l.status === 'in_progress').length;
    const completedLeads = leads.filter((l) => l.status === 'completed').length;

    const totalCallbacks = callbacks.length;
    const pendingCallbacks = callbacks.filter((c) => c.status === 'pending').length;
    const totalUsers = users.filter((u) => u.role !== 'admin').length;

    // Type distribution
    const counts = {};
    leads.forEach((l) => {
      const t = l.websiteType || 'Custom Website';
      counts[t] = (counts[t] || 0) + 1;
    });
    const typeDistribution = Object.keys(counts).map((k) => ({ _id: k, count: counts[k] }));

    return res.status(200).json({
      success: true,
      stats: {
        totalLeads,
        pendingLeads,
        inProgressLeads,
        completedLeads,
        totalCallbacks,
        pendingCallbacks,
        totalUsers,
      },
      typeDistribution,
      recentLeads: leads.slice(0, 6),
      recentCallbacks: callbacks.slice(0, 6),
      notifications,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin metrics',
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { readLocalStore, writeLocalStore } = await import('../config/store.js');
    const notifs = readLocalStore('notifications');
    const idx = notifs.findIndex((n) => n._id.toString() === req.params.id.toString());
    if (idx !== -1) {
      notifs[idx].isRead = true;
      writeLocalStore('notifications', notifs);
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Mass Broadcast Email to All Registered Users / Clients
export const sendBroadcastEmail = async (req, res) => {
  try {
    const { subject, heading, messageHtml, actionText, actionUrl, targetAudience = 'all', customEmails = '' } = req.body;

    if (!subject || !messageHtml) {
      return res.status(400).json({ success: false, message: 'Subject and Message content are required' });
    }

    let recipients = [];

    if (targetAudience === 'custom' && customEmails) {
      recipients = customEmails.split(',').map((e) => e.trim()).filter(Boolean);
    } else {
      const allUsers = await dataStore.getAllUsers();
      if (targetAudience === 'clients') {
        recipients = allUsers.filter((u) => u.role !== 'admin').map((u) => u.email);
      } else if (targetAudience === 'admins') {
        recipients = allUsers.filter((u) => u.role === 'admin').map((u) => u.email);
      } else {
        recipients = allUsers.map((u) => u.email);
      }
    }

    // Deduplicate
    recipients = [...new Set(recipients.filter((e) => e && e.includes('@')))];

    if (recipients.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid recipient email addresses found' });
    }

    const ctaButton = actionText && actionUrl
      ? `<div style="text-align: center; margin: 28px 0 10px 0;">
           <a href="${actionUrl}" style="background: linear-gradient(135deg, #9333ea 0%, #db2777 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 14px; font-size: 14px; font-weight: 800; display: inline-block; box-shadow: 0 10px 25px rgba(147, 51, 234, 0.4); letter-spacing: 0.3px;">
             ${actionText} &rarr;
           </a>
         </div>`
      : '';

    const formattedHtml = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${subject}</title>
  <style>
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100% !important; }
    table, td { border-collapse: collapse !important; }
  </style>
</head>
<body style="margin: 0; padding: 16px 8px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto; width: 100%;">
    <tr>
      <td align="center" style="padding: 0;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; border-top: 5px solid #9333ea; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
          
          <tr>
            <td style="padding: 28px 24px 16px 24px; text-align: center; border-bottom: 1px solid #f1f5f9; background-color: #ffffff; border-top-left-radius: 12px; border-top-right-radius: 12px;">
              <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background-color: #f3e8ff; border: 1px solid #e9d5ff; color: #7e22ce; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;">
                📢 OFFICIAL AGENCY BROADCAST
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; line-height: 1.2;">
                LOCAL<span style="color: #c026d3;">2</span>BRAND
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">
                HIGH-PERFORMANCE DIGITAL AGENCY &amp; ENGINEERING
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 24px 10px 24px; background-color: #ffffff;">
              ${heading ? `<h2 style="margin: 0 0 6px 0; font-size: 19px; font-weight: 800; color: #0f172a; line-height: 1.35;">${heading}</h2>` : ''}
            </td>
          </tr>

          <tr>
            <td style="padding: 6px 24px 24px 24px; font-size: 14px; line-height: 1.6; color: #334155; background-color: #ffffff;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 12px;">
                <div style="color: #334155; font-size: 14px; line-height: 1.7; word-break: break-word;">
                  ${messageHtml.replace(/\n/g, '<br/>')}
                </div>
                ${ctaButton}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                You received this official dispatch as a registered client on LOCAL2BRAND.
              </p>
              <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
                <span>✉️ Official Contact: <a href="mailto:stackaddacontact@gmail.com" style="color: #7c3aed; text-decoration: none; font-weight: 600;">stackaddacontact@gmail.com</a></span>
                <span style="margin: 0 4px; color: #cbd5e1;">•</span>
                <span>Admin: <a href="mailto:sohamduttabwn@gmail.com" style="color: #7c3aed; text-decoration: none; font-weight: 600;">sohamduttabwn@gmail.com</a></span>
              </div>
              <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 600;">
                &copy; ${new Date().getFullYear()} LOCAL2BRAND Technologies Pvt. Ltd. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    let sentCount = 0;
    let failedCount = 0;

    // Send emails
    for (const email of recipients) {
      try {
        const result = await sendEmail({
          to: email,
          subject: subject,
          html: formattedHtml,
          text: messageHtml
        });
        if (result.success) sentCount++;
        else failedCount++;
      } catch (err) {
        failedCount++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Broadcast completed! Sent to ${sentCount} recipients.`,
      sentCount,
      failedCount,
      totalRecipients: recipients.length
    });
  } catch (error) {
    console.error('Broadcast email error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to send broadcast email' });
  }
};
