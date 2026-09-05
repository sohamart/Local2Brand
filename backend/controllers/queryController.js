import { dataStore } from '../config/dataAdapter.js';
import mongoose from 'mongoose';
import {
  sendLeadConfirmationEmail,
  sendAdminNewLeadAlert,
  sendLeadStatusUpdateEmail,
  sendContactFormConfirmationEmail,
  sendQueryDeletionEmail,
  sendAdminQueryDeletionAlert
} from '../utils/email.js';
import oneSignalBackend from '../services/oneSignalService.js';


export const createQueryLead = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      businessName,
      websiteType,
      selectedDemo,
      selectedServices,
      selectedFeatures,
      industry,
      themePreference,
      budget,
      timeline,
      requirements,
      couponCode,
      discountPercent,
      estimatedPrice,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone number are required to submit an inquiry',
      });
    }

    const validUserId = req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)
      ? req.user._id
      : (req.body.user && mongoose.Types.ObjectId.isValid(req.body.user) ? req.body.user : null);

    const lead = await dataStore.createLead({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      businessName: businessName || '',
      websiteType: websiteType || 'Custom Website',
      selectedDemo: selectedDemo || '',
      selectedServices: Array.isArray(selectedServices) ? selectedServices : [],
      selectedFeatures: Array.isArray(selectedFeatures) ? selectedFeatures : [],
      industry: industry || 'General Business',
      themePreference: themePreference || 'Modern Glassmorphic',
      budget: budget || '₹9,999 - ₹19,999',
      timeline: timeline || 'Express 48 Hours',
      requirements: requirements || '',
      couponCode: couponCode || '',
      discountPercent: Number(discountPercent) || 0,
      estimatedPrice: estimatedPrice || '',
      user: validUserId,
      userId: req.user?._id?.toString() || req.user?.id || (validUserId ? String(validUserId) : null),
      ipAddress: req.ip || '',
    });

    dataStore.createNotification({
      title: 'New Project Proposal Inquiry',
      message: `${lead.name} requested a quote for ${lead.websiteType} (${lead.budget})`,
      type: 'lead',
      link: `/admin/leads`,
    }).catch((err) => console.warn('Admin notification error:', err.message));

    // Await delivery of all push notifications & emails before responding
    const targetUser = lead.userId || lead.user?._id || lead.user || lead.email;

    await Promise.allSettled([
      sendAdminNewLeadAlert(lead),
      (lead.industry === 'Direct Contact Form' || lead.websiteType?.includes('Contact Form'))
        ? sendContactFormConfirmationEmail(lead)
        : sendLeadConfirmationEmail(lead),
      oneSignalBackend.sendNotificationToAdmins({
        title: '💼 New Proposal Inquiry',
        message: `${lead.name} requested quote for ${lead.businessName || lead.websiteType} (${lead.budget})`,
        url: '/admin/leads',
        data: { type: 'new_lead', leadId: lead._id }
      }),
      targetUser ? oneSignalBackend.sendNotificationToUser(targetUser, {
        title: '💼 Project Inquiry Received',
        message: `Hi ${lead.name}, we received your proposal request. Our engineering team is preparing your roadmap!`,
        url: '/dashboard',
        data: { type: 'lead_confirmation', leadId: lead._id }
      }) : Promise.resolve(),
    ]);

    return res.status(201).json({
      success: true,
      message: 'Your project proposal inquiry has been submitted! Our team will contact you shortly.',
      leadId: lead._id,
      lead,
    });
  } catch (error) {
    console.error('Error creating inquiry lead:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error submitting proposal inquiry',
    });
  }
};

export const getUserQueries = async (req, res) => {
  try {
    const userId = req.user?._id?.toString() || req.user?.id;
    const userEmail = (req.user?.email || req.query.email || '').toLowerCase().trim();

    if (!userId && !userEmail) {
      return res.status(200).json({ success: true, count: 0, leads: [] });
    }

    const allLeads = await dataStore.getAllLeads();
    const leads = allLeads.filter((l) => {
      const matchId = userId && (l.userId === userId || l.user?.toString() === userId || l.user?._id?.toString() === userId);
      const matchEmail = userEmail && (l.email?.toLowerCase().trim() === userEmail);
      return matchId || matchEmail;
    });

    return res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving leads',
    });
  }
};

export const getAllQueries = async (req, res) => {
  try {
    const { status } = req.query;
    const leads = await dataStore.getAllLeads({ status });
    return res.status(200).json({
      success: true,
      total: leads.length,
      leads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving leads',
    });
  }
};

export const getQueryById = async (req, res) => {
  try {
    const leads = await dataStore.getAllLeads();
    const lead = leads.find((l) => l._id.toString() === req.params.id.toString());
    if (!lead) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    return res.status(200).json({ success: true, lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQueryStatus = async (req, res) => {
  try {
    const { status, adminNotes, drivePdfLink, pdfUrl, documentUrl } = req.body;
    const resolvedPdf = drivePdfLink || pdfUrl || documentUrl;
    const updates = {};
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;
    if (resolvedPdf !== undefined) {
      updates.drivePdfLink = resolvedPdf;
      updates.pdfUrl = resolvedPdf;
    }

    const lead = await dataStore.updateLead(req.params.id, updates);
    if (!lead) return res.status(404).json({ success: false, message: 'Inquiry not found' });

    const targetUser = lead.userId || lead.user?._id || lead.user || lead.email;

    // Await delivery of status update email and push notification
    await Promise.allSettled([
      lead.email ? sendLeadStatusUpdateEmail(lead) : Promise.resolve(),
      targetUser && status ? oneSignalBackend.sendNotificationToUser(targetUser, {
        title: `💼 Proposal Update: ${status}`,
        message: `Your inquiry for ${lead.businessName || lead.websiteType || 'website project'} has been updated to "${status}".`,
        url: '/dashboard',
        data: { type: 'lead_status_update', leadId: lead._id, status }
      }) : Promise.resolve(),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      lead,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating inquiry',
    });
  }
};

export const deleteQuery = async (req, res) => {
  try {
    const id = req.params.id;
    let lead = null;

    try {
      const leads = await dataStore.getAllLeads();
      lead = leads.find((l) => l._id?.toString() === id.toString() || l.id?.toString() === id.toString());
    } catch (e) {
      console.warn('Error finding lead before deletion:', e.message);
    }

    await dataStore.deleteLead(id);

    if (lead) {
      if (lead.email) {
        sendQueryDeletionEmail(lead).catch((err) => console.warn('Query deletion email error:', err.message));
      }
      sendAdminQueryDeletionAlert(lead).catch((err) => console.warn('Admin query deletion alert error:', err.message));
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting inquiry',
    });
  }
};

export const exportQueriesCsv = async (req, res) => {
  try {
    const leads = await dataStore.getAllLeads();
    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Business', 'Type', 'Industry', 'Budget', 'Timeline', 'Estimate', 'Status'];
    const rows = leads.map((l) => [
      l._id.toString(),
      new Date(l.createdAt).toLocaleDateString(),
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.businessName || '').replace(/"/g, '""')}"`,
      `"${(l.websiteType || '').replace(/"/g, '""')}"`,
      `"${(l.industry || '').replace(/"/g, '""')}"`,
      `"${(l.budget || '').replace(/"/g, '""')}"`,
      `"${(l.timeline || '').replace(/"/g, '""')}"`,
      `"${(l.estimatedPrice || '').replace(/"/g, '""')}"`,
      l.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=local2brand-leads-${Date.now()}.csv`);
    return res.status(200).send(csvContent);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error exporting CSV',
    });
  }
};
