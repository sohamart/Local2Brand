import { dataStore } from '../config/dataAdapter.js';
import { sendEmail } from '../utils/email.js';
import { getLiveTelemetryStats } from './telemetryController.js';
import mongoose from 'mongoose';

export const getAdminStats = async (req, res) => {
  try {
    let requirements = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const { default: Requirement } = await import('../models/Requirement.js');
        requirements = await Requirement.find().sort({ createdAt: -1 });
      } catch (e) {
        console.warn('MongoDB Requirement fetch notice:', e.message);
      }
    }
    
    if (requirements.length === 0) {
      const localReqs = dataStore.read('requirements') || [];
      if (localReqs.length > 0) requirements = localReqs;
    }

    let allUsers = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const { User } = await import('../models/User.js');
        allUsers = await User.find().select('-password').sort({ createdAt: -1 });
      } catch (e) {
        console.warn('MongoDB User fetch notice in stats:', e.message);
      }
    }
    
    if (allUsers.length === 0) {
      allUsers = await dataStore.getAllUsers();
    }

    const [leads, callbacks, notifications] = await Promise.all([
      dataStore.getAllLeads(),
      dataStore.getAllCallbacks(),
      dataStore.getNotifications(15),
    ]);

    const totalRequirements = requirements.length;
    const pendingRequirements = requirements.filter((r) => r.status === 'Submitted' || r.status === 'Draft' || r.status === 'Under Review').length;
    const inProgressRequirements = requirements.filter((r) => r.status === 'In Development' || r.status === 'Approved' || r.status === 'Quotation Sent').length;
    const completedRequirements = requirements.filter((r) => r.status === 'Completed').length;
    const cancelledRequirements = requirements.filter((r) => r.status === 'Cancelled').length;

    const totalLeads = leads.length;
    const pendingLeads = leads.filter((l) => l.status === 'pending').length;
    const inProgressLeads = leads.filter((l) => l.status === 'in_progress').length;
    const completedLeads = leads.filter((l) => l.status === 'completed').length;

    const totalCallbacks = callbacks.length;
    const pendingCallbacks = callbacks.filter((c) => c.status === 'pending').length;
    const totalUsers = Math.max(allUsers.length, totalRequirements);

    // Type / Industry distribution
    const counts = {};
    requirements.forEach((r) => {
      const t = r.websiteTypeName || r.websiteType || 'Custom Website';
      counts[t] = (counts[t] || 0) + 1;
    });
    leads.forEach((l) => {
      const t = l.websiteType || 'Inquiry';
      counts[t] = (counts[t] || 0) + 1;
    });
    
    let typeDistribution = Object.keys(counts).map((k) => ({ _id: k, name: k, count: counts[k] }));
    if (typeDistribution.length === 0) {
      typeDistribution = [
        { _id: 'Restaurant & Cafe', name: 'Restaurant & Cafe', count: Math.max(1, totalRequirements || 4) },
        { _id: 'E-Commerce Store', name: 'E-Commerce Store', count: Math.max(1, totalLeads || 3) },
        { _id: 'Healthcare & Clinic', name: 'Healthcare & Clinic', count: 2 },
        { _id: 'Real Estate & Builders', name: 'Real Estate & Builders', count: 2 },
        { _id: 'Fashion & Boutique', name: 'Fashion & Boutique', count: 1 },
        { _id: 'Corporate & Tech', name: 'Corporate & Tech', count: 1 }
      ];
    }

    // Status breakdown for visual donut/meter charts
    const statusBreakdown = [
      { label: 'Submitted / Review', count: pendingRequirements, color: '#9333ea' },
      { label: 'Approved & Quoted', count: requirements.filter(r => r.status === 'Approved' || r.status === 'Quotation Sent').length, color: '#3b82f6' },
      { label: 'In Development', count: requirements.filter(r => r.status === 'In Development').length, color: '#6366f1' },
      { label: 'Completed', count: completedRequirements, color: '#10b981' },
      { label: 'Cancelled', count: cancelledRequirements, color: '#f43f5e' }
    ];

    const toDateString = (val) => {
      if (!val) return '';
      if (typeof val === 'string') return val.slice(0, 10);
      if (val instanceof Date) return val.toISOString().slice(0, 10);
      try { return new Date(val).toISOString().slice(0, 10); } catch (e) { return ''; }
    };

    // Weekly day-by-day activity trend (Last 7 Days)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const weeklyTrends = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];
      const dateStr = d.toISOString().slice(0, 10);
      
      const reqsCount = requirements.filter(r => toDateString(r.createdAt) === dateStr).length;
      const leadsCount = leads.filter(l => toDateString(l.createdAt) === dateStr).length;
      
      weeklyTrends.push({
        day: dayName,
        date: dateStr,
        orders: reqsCount,
        leads: leadsCount,
        totalActivity: reqsCount + leadsCount,
      });
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalRequirements,
        pendingRequirements,
        inProgressRequirements,
        completedRequirements,
        cancelledRequirements,
        totalLeads,
        pendingLeads,
        inProgressLeads,
        completedLeads,
        totalCallbacks,
        pendingCallbacks,
        totalUsers,
      },
      statusBreakdown,
      weeklyTrends,
      typeDistribution,
      telemetry: getLiveTelemetryStats(),
      recentRequirements: requirements.slice(0, 8),
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
      ? `<div style="margin-top: 24px; margin-bottom: 8px; text-align: center;">
           <a href="${actionUrl}" target="_blank" style="background: linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #f43f5e 100%); background-color: #9333ea; color: #ffffff !important; padding: 14px 34px; text-decoration: none; border-radius: 12px; font-size: 14px; font-weight: 900; display: inline-block; box-shadow: 0 8px 24px rgba(192, 38, 211, 0.45); letter-spacing: 0.4px;">
             ${actionText} &rarr;
           </a>
         </div>`
      : '';

    const formattedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${subject}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f4f6fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="margin: 0; padding: 20px 8px; background-color: #f4f6fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <div style="width: 100%; max-width: 520px; margin: 0 auto; box-sizing: border-box;">
    
    <div style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04); box-sizing: border-box; width: 100%;">
      
      <div style="height: 4px; width: 100%; background: linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); line-height: 4px; font-size: 4px;">&nbsp;</div>

      <div style="padding: 26px 20px 18px 20px; text-align: center; border-bottom: 1px solid #f1f5f9; background-color: #ffffff; box-sizing: border-box;">
        <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background-color: #f1f5f9; border: 1px solid #e2e8f0; color: #475569; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;">
          📢 OFFICIAL AGENCY BROADCAST
        </div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; line-height: 1.2;">
          LOCAL<span style="color: #7c3aed;">2</span>BRAND
        </h1>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">
          High-Performance Digital Agency &amp; Engineering
        </p>
      </div>

      <div style="padding: 20px 20px 8px 20px; background-color: #ffffff; box-sizing: border-box;">
        ${heading ? `<h2 style="margin: 0 0 6px 0; font-size: 19px; font-weight: 800; color: #0f172a; line-height: 1.35;">${heading}</h2>` : ''}
      </div>

      <div style="padding: 6px 20px 24px 20px; font-size: 14px; line-height: 1.6; color: #334155; background-color: #ffffff; box-sizing: border-box;">
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin-bottom: 12px; box-sizing: border-box;">
          <div style="color: #334155; font-size: 14px; line-height: 1.7; word-break: break-word;">
            ${messageHtml.replace(/\n/g, '<br/>')}
          </div>
          ${ctaButton}
        </div>
      </div>

      <div style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; box-sizing: border-box;">
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b; line-height: 1.5;">
          You received this official dispatch as a registered client on LOCAL2BRAND.
        </p>
        <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
          <span>✉️ Official Contact: <a href="mailto:stackaddacontact@gmail.com" style="color: #6366f1; text-decoration: none; font-weight: 600;">stackaddacontact@gmail.com</a></span>
          <span style="margin: 0 4px; color: #cbd5e1;">•</span>
          <span>Admin: <a href="mailto:sohamduttabwn@gmail.com" style="color: #6366f1; text-decoration: none; font-weight: 600;">sohamduttabwn@gmail.com</a></span>
        </div>
        <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 600;">
          &copy; ${new Date().getFullYear()} LOCAL2BRAND Technologies Pvt. Ltd. All rights reserved.
        </p>
      </div>

    </div>
  </div>
</body>
</html>
    `;

    // Fast Parallel Broadcast Dispatch with Promise.allSettled
    const sendResults = await Promise.allSettled(
      recipients.map((email) =>
        sendEmail({
          to: email,
          subject: subject,
          html: formattedHtml,
          text: messageHtml,
        })
      )
    );

    let sentCount = 0;
    let failedCount = 0;

    sendResults.forEach((res) => {
      if (res.status === 'fulfilled' && res.value && res.value.success) {
        sentCount++;
      } else {
        failedCount++;
      }
    });

    return res.status(200).json({
      success: true,
      message: `Broadcast completed! Sent to ${sentCount} recipients.`,
      sentCount,
      failedCount,
      total: recipients.length,
    });
  } catch (error) {
    console.error('Broadcast email error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to send broadcast email' });
  }
};
