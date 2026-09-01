import Requirement from '../models/Requirement.js';
import { dataStore } from '../config/dataAdapter.js';
import {
  sendRequirementConfirmationEmail,
  sendAdminRequirementAlert,
  sendRequirementStatusUpdateEmail
} from '../utils/email.js';
import mongoose from 'mongoose';

// Generate clean unique human-readable ID e.g. REQ-2026-98214
export const generateRequirementId = () => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `REQ-${year}-${randomSuffix}`;
};

// @desc    Create or Autosave Draft Requirement
// @route   POST /api/requirements
// @access  Public / Authenticated
export const saveRequirementDraft = async (req, res) => {
  try {
    const data = req.body;
    let requirementId = data.requirementId;

    if (!requirementId) {
      requirementId = generateRequirementId();
    }

    const validUserId = req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)
      ? req.user._id
      : (data.user && mongoose.Types.ObjectId.isValid(data.user) ? data.user : null);

    const payload = {
      ...data,
      requirementId,
      status: data.status || 'Draft',
      user: validUserId,
      ipAddress: req.ip || req.connection?.remoteAddress || ''
    };

    let doc;
    if (mongoose.connection.readyState === 1) {
      doc = await Requirement.findOneAndUpdate(
        { requirementId },
        { $set: payload },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else {
      const existing = dataStore.find('requirements', (r) => r.requirementId === requirementId);
      if (existing) {
        doc = dataStore.update('requirements', existing._id, payload);
      } else {
        doc = dataStore.create('requirements', payload);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Progress saved successfully',
      requirementId,
      requirement: doc
    });
  } catch (error) {
    console.error('Error autosaving requirement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit Finalized Requirement
// @route   POST /api/requirements/:id/submit
// @access  Public / Authenticated
export const submitRequirement = async (req, res) => {
  try {
    const { id } = req.params; // requirementId or _id
    const finalData = req.body;

    const validUserId = req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)
      ? req.user._id
      : (finalData.user && mongoose.Types.ObjectId.isValid(finalData.user) ? finalData.user : null);

    const updatePayload = {
      ...finalData,
      user: validUserId,
      status: 'Submitted',
      submittedAt: new Date()
    };

    let doc;
    if (mongoose.connection.readyState === 1) {
      doc = await Requirement.findOneAndUpdate(
        { $or: [{ requirementId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
        { $set: updatePayload },
        { new: true, upsert: true }
      );
    } else {
      const existing = dataStore.find('requirements', (r) => r.requirementId === id || r._id === id);
      if (existing) {
        doc = dataStore.update('requirements', existing._id, updatePayload);
      } else {
        doc = dataStore.create('requirements', { ...updatePayload, requirementId: id || generateRequirementId() });
      }
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Requirement session not found' });
    }

    // Admin Notification
    const businessName = doc.clientInfo?.businessName || doc.websiteTypeName || 'New Project';
    const clientName = doc.clientInfo?.ownerName || doc.clientInfo?.contactPerson || 'Client';
    const reqId = doc.requirementId || id;

    dataStore.createNotification({
      title: `New Requirement Submitted (${reqId})`,
      message: `${clientName} submitted complete specifications for ${businessName}`,
      type: 'requirement',
      link: '/admin/requirements',
    }).catch((err) => console.warn('Notification error:', err.message));

    // Send ultra-premium styled confirmation emails
    try {
      sendRequirementConfirmationEmail(doc).catch((err) => console.warn('Client requirement email error:', err.message));
      sendAdminRequirementAlert(doc).catch((err) => console.warn('Admin requirement alert error:', err.message));
    } catch (mailErr) {
      console.warn('Email dispatch error:', mailErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Your website requirements have been submitted successfully.',
      requirementId: doc.requirementId || reqId,
      requirement: doc
    });
  } catch (error) {
    console.error('Error submitting requirement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Requirements submitted by current logged-in client or matching email
// @route   GET /api/requirements/my
// @access  Authenticated / Optional
export const getMyRequirements = async (req, res) => {
  try {
    const userId = req.user?._id?.toString();
    const userEmail = (req.user?.email || req.query.email || '').toLowerCase().trim();

    let requirements = [];
    if (mongoose.connection.readyState === 1) {
      const orClauses = [];
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        orClauses.push({ user: userId });
      }
      if (userEmail) {
        orClauses.push({ 'clientInfo.email': { $regex: new RegExp(`^${userEmail}$`, 'i') } });
      }

      if (orClauses.length === 0) {
        return res.status(200).json({ success: true, count: 0, requirements: [] });
      }

      requirements = await Requirement.find({ $or: orClauses }).sort({ createdAt: -1 });
    } else {
      const allReqs = dataStore.read('requirements') || [];
      requirements = allReqs.filter((r) => {
        const matchesUser = userId && r.user?.toString() === userId;
        const matchesEmail = userEmail && r.clientInfo?.email?.toLowerCase().trim() === userEmail;
        return matchesUser || matchesEmail;
      });
      requirements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.status(200).json({
      success: true,
      count: requirements.length,
      requirements
    });
  } catch (error) {
    console.error('getMyRequirements error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Requirement / Order by ID (for Track Order & details)
// @route   GET /api/requirements/:id
// @access  Public / Authenticated
export const getRequirementById = async (req, res) => {
  try {
    const { id } = req.params;
    let doc;
    if (mongoose.connection.readyState === 1) {
      doc = await Requirement.findOne({
        $or: [
          { requirementId: id.trim() },
          { requirementId: { $regex: new RegExp(`^${id.trim()}$`, 'i') } },
          ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])
        ]
      });
    } else {
      const allReqs = dataStore.read('requirements') || [];
      doc = allReqs.find(
        (r) =>
          r.requirementId?.toLowerCase() === id.toLowerCase().trim() ||
          r._id?.toString() === id.toString()
      );
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: `Requirement order "${id}" not found.` });
    }

    res.status(200).json({ success: true, requirement: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Requirements (Admin)
// @route   GET /api/requirements/admin/all
// @access  Admin
export const getAllRequirements = async (req, res) => {
  try {
    const { status, search, limit = 100 } = req.query;

    let requirements = [];
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (search && search.trim()) {
        const s = search.trim();
        query.$or = [
          { requirementId: { $regex: s, $options: 'i' } },
          { 'clientInfo.businessName': { $regex: s, $options: 'i' } },
          { 'clientInfo.ownerName': { $regex: s, $options: 'i' } },
          { 'clientInfo.email': { $regex: s, $options: 'i' } },
          { 'clientInfo.mobile': { $regex: s, $options: 'i' } },
          { websiteType: { $regex: s, $options: 'i' } },
          { websiteTypeName: { $regex: s, $options: 'i' } }
        ];
      }
      requirements = await Requirement.find(query).sort({ createdAt: -1 }).limit(Number(limit));
    } else {
      requirements = dataStore.read('requirements') || [];
      if (status && status !== 'all') {
        requirements = requirements.filter((r) => r.status?.toLowerCase() === status.toLowerCase());
      }
      if (search && search.trim()) {
        const s = search.toLowerCase().trim();
        requirements = requirements.filter((r) =>
          r.requirementId?.toLowerCase().includes(s) ||
          r.clientInfo?.businessName?.toLowerCase().includes(s) ||
          r.clientInfo?.ownerName?.toLowerCase().includes(s) ||
          r.clientInfo?.email?.toLowerCase().includes(s) ||
          r.clientInfo?.mobile?.includes(s) ||
          r.websiteType?.toLowerCase().includes(s)
        );
      }
      requirements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json({
      success: true,
      count: requirements.length,
      requirements
    });
  } catch (error) {
    console.error('getAllRequirements error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Requirement Status (Admin)
// @route   PATCH /api/requirements/admin/:id/status
// @access  Admin
export const updateRequirementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, internalNotes, quotedAmount } = req.body;

    let updated;
    if (mongoose.connection.readyState === 1) {
      updated = await Requirement.findOneAndUpdate(
        { $or: [{ requirementId: id }, ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])] },
        { $set: { status, internalNotes, quotedAmount, updatedAt: new Date() } },
        { new: true }
      );
    } else {
      updated = dataStore.update('requirements', id, { status, internalNotes, quotedAmount, updatedAt: new Date().toISOString() });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }

    // Automatically send status update email to client
    if (updated.clientInfo?.email) {
      sendRequirementStatusUpdateEmail(updated).catch((err) => console.warn('Status email update notice:', err.message));
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      requirement: updated
    });
  } catch (error) {
    console.error('updateRequirementStatus error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
