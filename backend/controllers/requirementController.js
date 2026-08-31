import Requirement from '../models/Requirement.js';
import { dataStore } from '../config/dataAdapter.js';
import { sendEmail } from '../utils/email.js';
import mongoose from 'mongoose';

// Generate clean unique human-readable ID e.g. REQ-2026-9821
const generateRequirementId = () => {
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

    const payload = {
      ...data,
      requirementId,
      status: data.status || 'Draft',
      user: req.user?._id || data.user || null,
      ipAddress: req.ip || req.connection.remoteAddress
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

    const updatePayload = {
      ...finalData,
      status: 'Submitted',
      submittedAt: new Date()
    };

    let doc;
    if (mongoose.connection.readyState === 1) {
      doc = await Requirement.findOneAndUpdate(
        { $or: [{ requirementId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
        { $set: updatePayload },
        { new: true }
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

    // Send confirmation emails
    try {
      const clientEmail = doc.clientInfo?.email || finalData.clientInfo?.email;
      const clientName = doc.clientInfo?.ownerName || doc.clientInfo?.contactPerson || 'Valued Client';
      const businessName = doc.clientInfo?.businessName || 'Your Business';
      const websiteType = doc.websiteTypeName || doc.websiteType || 'Custom Website';

      if (clientEmail) {
        await sendEmail({
          to: clientEmail,
          subject: `Website Requirements Received — LOCAL2BRAND (${doc.requirementId})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px;">
              <h2 style="color: #38bdf8; margin-top: 0;">Requirements Received! 🎉</h2>
              <p style="color: #cbd5e1;">Hi <strong>${clientName}</strong>, we have received your complete website specifications for <strong>${businessName}</strong>.</p>
              <p style="color: #94a3b8; font-size: 13px;">Requirement ID: <strong>${doc.requirementId}</strong></p>
              <p style="color: #94a3b8; font-size: 13px;">Website Type: <strong>${websiteType}</strong></p>
              <p style="color: #94a3b8; font-size: 13px;">Budget: <strong>${doc.budget || 'Custom'}</strong></p>
            </div>
          `
        });
      }

      // Notify Admin
      const adminEmail = process.env.ADMIN_EMAIL || 'contact@local2brand.com';
      await sendEmail({
        to: adminEmail,
        subject: `🚨 [NEW REQUIREMENT] ${businessName} — ${websiteType} (${doc.budget || 'Custom'})`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>New Smart Requirement Submission!</h2>
            <p><strong>Requirement ID:</strong> ${doc.requirementId}</p>
            <p><strong>Business:</strong> ${businessName}</p>
            <p><strong>Contact:</strong> ${clientName} (${doc.clientInfo?.mobile})</p>
            <p><strong>Website Type:</strong> ${websiteType}</p>
            <p><strong>Budget:</strong> ${doc.budget}</p>
            <p><strong>Timeline:</strong> ${doc.timeline}</p>
            <a href="http://localhost:5173/admin/requirements" style="display:inline-block; padding:10px 20px; background:#7c3aed; color:#fff; text-decoration:none; border-radius:8px;">View in Admin Panel</a>
          </div>
        `
      });
    } catch (mailErr) {
      console.warn('Email dispatch notice:', mailErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Your website requirements have been submitted successfully.',
      requirementId: doc.requirementId,
      requirement: doc
    });
  } catch (error) {
    console.error('Error submitting requirement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Requirements submitted by current logged-in client
// @route   GET /api/requirements/my
// @access  Authenticated / Optional
export const getMyRequirements = async (req, res) => {
  try {
    const userId = req.user?._id?.toString();
    const userEmail = req.user?.email?.toLowerCase().trim();

    let requirements = [];
    if (mongoose.connection.readyState === 1) {
      const query = {
        $or: [
          ...(userId ? [{ user: userId }] : []),
          ...(userEmail ? [{ 'clientInfo.email': userEmail }] : [])
        ]
      };
      if (query.$or.length === 0) {
        return res.status(200).json({ success: true, count: 0, requirements: [] });
      }
      requirements = await Requirement.find(query).sort({ createdAt: -1 });
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
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Requirement by ID
// @route   GET /api/requirements/:id
// @access  Public / Authenticated
export const getRequirementById = async (req, res) => {
  try {
    const { id } = req.params;
    let doc;
    if (mongoose.connection.readyState === 1) {
      doc = await Requirement.findOne({ $or: [{ requirementId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] });
    } else {
      doc = dataStore.find('requirements', (r) => r.requirementId === id || r._id === id);
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }

    res.status(200).json({ success: true, requirement: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Requirements (Admin)
// @route   GET /api/admin/requirements
// @access  Admin
export const getAllRequirements = async (req, res) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;

    let requirements = [];
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { requirementId: { $regex: search, $options: 'i' } },
          { 'clientInfo.businessName': { $regex: search, $options: 'i' } },
          { 'clientInfo.ownerName': { $regex: search, $options: 'i' } },
          { 'clientInfo.email': { $regex: search, $options: 'i' } },
          { 'clientInfo.mobile': { $regex: search, $options: 'i' } },
          { websiteType: { $regex: search, $options: 'i' } }
        ];
      }
      requirements = await Requirement.find(query).sort({ createdAt: -1 }).limit(Number(limit));
    } else {
      requirements = dataStore.read('requirements');
      if (status && status !== 'all') {
        requirements = requirements.filter((r) => r.status?.toLowerCase() === status.toLowerCase());
      }
      if (search) {
        const s = search.toLowerCase();
        requirements = requirements.filter((r) =>
          r.requirementId?.toLowerCase().includes(s) ||
          r.clientInfo?.businessName?.toLowerCase().includes(s) ||
          r.clientInfo?.ownerName?.toLowerCase().includes(s) ||
          r.clientInfo?.email?.toLowerCase().includes(s) ||
          r.clientInfo?.mobile?.includes(s)
        );
      }
    }

    res.status(200).json({
      success: true,
      count: requirements.length,
      requirements
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Requirement Status (Admin)
// @route   PATCH /api/admin/requirements/:id/status
// @access  Admin
export const updateRequirementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, internalNotes, quotedAmount } = req.body;

    let updated;
    if (mongoose.connection.readyState === 1) {
      updated = await Requirement.findByIdAndUpdate(
        id,
        { $set: { status, internalNotes, quotedAmount, updatedAt: new Date() } },
        { new: true }
      );
    } else {
      updated = dataStore.update('requirements', id, { status, internalNotes, quotedAmount, updatedAt: new Date().toISOString() });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      requirement: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
