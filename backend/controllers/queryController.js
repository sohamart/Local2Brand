import { dataStore } from '../config/dataAdapter.js';
import { sendLeadConfirmationEmail, sendAdminNewLeadAlert, sendLeadStatusUpdateEmail } from '../utils/email.js';

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
      user: req.user ? req.user.id : null,
      ipAddress: req.ip || '',
    });

    dataStore.createNotification({
      title: 'New Project Proposal Inquiry',
      message: `${lead.name} requested a quote for ${lead.websiteType} (${lead.budget})`,
      type: 'lead',
      link: `/admin/leads`,
    }).catch((err) => console.warn('Admin notification error:', err.message));

    sendLeadConfirmationEmail(lead).catch((err) => console.warn('Client lead email error:', err.message));
    sendAdminNewLeadAlert(lead).catch((err) => console.warn('Admin lead alert error:', err.message));

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
      message: error.message || 'Error submitting project inquiry',
    });
  }
};

export const getUserQueries = async (req, res) => {
  try {
    const leads = await dataStore.getUserLeads(req.user.id, req.user.email);
    return res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving your inquiries',
    });
  }
};

export const getAllQueries = async (req, res) => {
  try {
    const { status, search } = req.query;
    const leads = await dataStore.getAllLeads({ status, search });
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
    const { status, adminNotes } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    const lead = await dataStore.updateLead(req.params.id, updates);
    if (!lead) return res.status(404).json({ success: false, message: 'Inquiry not found' });

    if (status) {
      sendLeadStatusUpdateEmail(lead).catch((err) => console.warn('Status update email error:', err.message));
    }

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
    await dataStore.deleteLead(req.params.id);
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
