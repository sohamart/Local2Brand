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
      ? `<div style="text-align: center; margin: 28px 0;">
           <a href="${actionUrl}" style="background: linear-gradient(135deg, #9333ea, #db2777); color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">
             ${actionText}
           </a>
         </div>`
      : '';

    const formattedHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #a855f7; margin: 0; font-size: 24px;">LOCAL<span style="color: #ec4899;">2</span>BRAND</h1>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Official Announcement</p>
        </div>
        <div style="background: #1e293b; padding: 24px; border-radius: 10px; border: 1px solid #334155;">
          ${heading ? `<h2 style="color: #38bdf8; margin-top: 0; font-size: 18px;">${heading}</h2>` : ''}
          <div style="color: #cbd5e1; line-height: 1.7; font-size: 14px;">
            ${messageHtml.replace(/\n/g, '<br/>')}
          </div>
          ${ctaButton}
        </div>
        <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 24px;">
          © ${new Date().getFullYear()} LOCAL2BRAND. All rights reserved.<br/>
          You received this email because you have an account on LOCAL2BRAND.
        </p>
      </div>
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
