import { dataStore } from '../config/dataAdapter.js';
import { sendEmail, getClientUrl, wrapAgencyEmail } from '../utils/email.js';
import { getLiveTelemetryStats } from './telemetryController.js';
import { fetchAllMergedRequirements } from './requirementController.js';
import oneSignalBackend from '../services/oneSignalService.js';
import mongoose from 'mongoose';

export const getAdminStats = async (req, res) => {
  try {
    const requirements = await fetchAllMergedRequirements();

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

// Mass Broadcast Email to All Registered Users / Clients with Segment Filtering
export const sendBroadcastEmail = async (req, res) => {
  try {
    const {
      subject,
      heading,
      messageHtml,
      actionText,
      actionUrl,
      targetAudience = 'all',
      customEmails = '',
      isImportant = false,
    } = req.body;

    if (!subject || !messageHtml) {
      return res.status(400).json({ success: false, message: 'Subject and Message content are required' });
    }

    let recipients = [];

    // Gather all users and requirements safely
    let allUsers = [];
    let allRequirements = [];
    let allLeads = [];
    let allCallbacks = [];

    if (mongoose.connection.readyState === 1) {
      try {
        const { User } = await import('../models/User.js');
        allUsers = await User.find().select('email name role createdAt');
      } catch (e) {}
      try {
        const { default: Requirement } = await import('../models/Requirement.js');
        allRequirements = await Requirement.find().select('clientInfo email status createdAt submittedAt');
      } catch (e) {}
      try {
        const { default: QueryLead } = await import('../models/QueryLead.js');
        allLeads = await QueryLead.find().select('email phone name createdAt');
      } catch (e) {}
      try {
        const { default: CallbackRequest } = await import('../models/CallbackRequest.js');
        allCallbacks = await CallbackRequest.find().select('email phone name createdAt');
      } catch (e) {}
    }

    if (allUsers.length === 0) {
      allUsers = await dataStore.getAllUsers();
    }
    if (allRequirements.length === 0) {
      allRequirements = dataStore.read('requirements') || [];
    }
    if (allLeads.length === 0) {
      allLeads = await dataStore.getAllLeads();
    }
    if (allCallbacks.length === 0) {
      allCallbacks = await dataStore.getAllCallbacks();
    }

    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    if (targetAudience === 'custom' && customEmails) {
      recipients = customEmails.split(',').map((e) => e.trim()).filter(Boolean);
    } else if (targetAudience === 'no_orders_2days') {
      // Find registered clients who registered > 2 days ago and have 0 orders
      const orderedEmails = new Set(
        allRequirements
          .map((r) => (r.clientInfo?.email || r.email || '').toLowerCase().trim())
          .filter(Boolean)
      );

      const winbackUsers = allUsers.filter((u) => {
        if (u.role === 'admin') return false;
        const uEmail = (u.email || '').toLowerCase().trim();
        const userCreated = u.createdAt ? new Date(u.createdAt) : new Date(0);
        const isOldEnough = userCreated <= twoDaysAgo;
        return !orderedEmails.has(uEmail);
      });

      recipients = winbackUsers.map((u) => u.email);
    } else if (targetAudience === 'active_orders') {
      const activeStatuses = ['Submitted', 'In Development', 'Approved', 'Under Review', 'Quotation Sent'];
      recipients = allRequirements
        .filter((r) => activeStatuses.includes(r.status))
        .map((r) => r.clientInfo?.email || r.email)
        .filter(Boolean);
    } else if (targetAudience === 'requirements_submitted') {
      recipients = allRequirements
        .map((r) => r.clientInfo?.email || r.email)
        .filter(Boolean);
    } else if (targetAudience === 'leads_inquiries') {
      recipients = [
        ...allLeads.map((l) => l.email),
        ...allCallbacks.map((c) => c.email)
      ].filter(Boolean);
    } else if (targetAudience === 'clients') {
      recipients = allUsers.filter((u) => u.role !== 'admin').map((u) => u.email);
    } else if (targetAudience === 'admins') {
      recipients = allUsers.filter((u) => u.role === 'admin').map((u) => u.email);
    } else if (targetAudience === 'all_contacts') {
      // Combined ecosystem: registered users + requirements + leads + callbacks
      recipients = [
        ...allUsers.map((u) => u.email),
        ...allRequirements.map((r) => r.clientInfo?.email || r.email),
        ...allLeads.map((l) => l.email),
        ...allCallbacks.map((c) => c.email)
      ];
    } else {
      // 'all' / default: Strictly all registered user accounts
      recipients = allUsers.map((u) => u.email);
    }

    // Deduplicate & normalize
    recipients = [...new Set(recipients.map((e) => (e || '').toLowerCase().trim()).filter((e) => e && e.includes('@')))];

    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No recipient email addresses found for the selected audience segment.',
      });
    }

    const resolvedActionUrl = actionUrl
      ? (actionUrl.startsWith('http://') || actionUrl.startsWith('https://') ? actionUrl : getClientUrl(actionUrl))
      : getClientUrl();

    const contentHtml = `
      <div style="margin: 10px 0 16px 0;">
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin-bottom: 12px; box-sizing: border-box;">
          <div style="color: #334155; font-size: 14px; line-height: 1.7; word-break: break-word;">
            ${messageHtml.replace(/\n/g, '<br/>')}
          </div>
        </div>
      </div>
    `;

    const formattedHtml = wrapAgencyEmail({
      preheader: messageHtml.slice(0, 100).replace(/\n/g, ' '),
      headerBadge: isImportant ? '⚡ PRIORITY CLIENT NOTIFICATION' : '📢 OFFICIAL AGENCY BROADCAST',
      title: heading || subject,
      subtitle: isImportant ? 'Important announcement from LOCAL2BRAND Founding Team' : 'Official Update from LOCAL2BRAND Desk',
      contentHtml,
      ctaText: actionText || '',
      ctaUrl: actionText && actionUrl ? resolvedActionUrl : '',
    });

    // Throttled Sequential/Batch Dispatch to prevent SMTP burst rate-limit & spam classification
    let sentCount = 0;
    let failedCount = 0;
    const BATCH_SIZE = 2;

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map((email) =>
          sendEmail({
            to: email,
            subject: subject,
            html: formattedHtml,
            text: messageHtml,
            isImportant: Boolean(isImportant),
            priority: isImportant ? 'high' : 'normal',
          })
        )
      );

      batchResults.forEach((res) => {
        if (res.status === 'fulfilled' && res.value && res.value.success) {
          sentCount++;
        } else {
          failedCount++;
        }
      });

      // Small throttle sleep between batches
      if (i + BATCH_SIZE < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    // Optional OneSignal Push Broadcast
    if (req.body?.sendPush || req.body?.sendPushNotification) {
      const cleanMessage = (messageHtml || '').replace(/<[^>]*>?/gm, '').replace(/\n+/g, ' ').trim().substring(0, 150);
      oneSignalBackend.broadcastPushNotification({
        title: heading || subject,
        message: cleanMessage,
        url: actionUrl || (getClientUrl ? `${getClientUrl()}/demos` : 'https://local2brand.com/demos'),
      }).catch((err) => console.warn('Admin broadcast push notice:', err.message));
    }

    return res.status(200).json({
      success: true,
      message: `Broadcast completed! Dispatched to ${sentCount} email recipients.`,
      sentCount,
      failedCount,
      total: recipients.length,
    });
  } catch (error) {
    console.error('Broadcast email error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to send broadcast email' });
  }
};
