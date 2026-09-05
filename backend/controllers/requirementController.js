import Requirement from '../models/Requirement.js';
import { dataStore, ensureDb, isDbConnected } from '../config/dataAdapter.js';
import { connectDB } from '../config/db.js';
import { deleteCloudinaryMedia } from '../config/cloudinary.js';
import {
  sendRequirementConfirmationEmail,
  sendAdminRequirementAlert,
  sendRequirementStatusUpdateEmail,
  sendOrderDeliveredEmail,
  sendRequirementDeletionEmail,
  sendRequirementRejectedEmail,
  sendAdminRequirementDeletionAlert
} from '../utils/email.js';

import mongoose from 'mongoose';

// Generate clean unique human-readable ID e.g. REQ-2026-98214
export const generateRequirementId = () => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `REQ-${year}-${randomSuffix}`;
};

// Helper to fetch and merge all requirements from MongoDB and Local dataStore
export const fetchAllMergedRequirements = async () => {
  await ensureDb().catch(() => {});
  let dbReqs = [];
  if (isDbConnected()) {
    try {
      dbReqs = await Requirement.find().sort({ createdAt: -1 }).lean();
    } catch (err) {
      console.warn('MongoDB Requirement.find notice:', err.message);
    }
  }

  const localReqs = dataStore.read('requirements') || [];

  const map = new Map();
  // 1. Seed with local records
  for (const r of localReqs) {
    if (!r) continue;
    const key = (r.requirementId || r._id?.toString() || '').trim().toLowerCase();
    if (key) map.set(key, r);
  }

  // 2. Overlay / Merge with DB records
  for (const r of dbReqs) {
    if (!r) continue;
    const key = (r.requirementId || r._id?.toString() || '').trim().toLowerCase();
    if (key) {
      const existing = map.get(key);
      map.set(key, { ...existing, ...r });
    }
  }

  // 3. Background auto-sync any local dataStore requirements into MongoDB if missing
  if (isDbConnected() && localReqs.length > 0) {
    setImmediate(async () => {
      try {
        for (const lr of localReqs) {
          if (!lr || !lr.requirementId) continue;
          const exists = await Requirement.findOne({ requirementId: lr.requirementId });
          if (!exists) {
            const { _id, __v, ...cleanPayload } = lr;
            await Requirement.create(cleanPayload).catch(() => {});
          }
        }
      } catch (syncErr) {
        console.warn('Background requirement sync notice:', syncErr.message);
      }
    });
  }

  const allMerged = Array.from(map.values());
  allMerged.sort((a, b) => new Date(b.createdAt || b.submittedAt || 0) - new Date(a.createdAt || a.submittedAt || 0));
  return allMerged;
};

// @desc    Create or Autosave Draft Requirement
// @route   POST /api/requirements
// @access  Public / Authenticated
export const saveRequirementDraft = async (req, res) => {
  try {
    const data = req.body || {};
    let requirementId = data.requirementId;

    if (!requirementId) {
      requirementId = generateRequirementId();
    }

    const validUserId = req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)
      ? req.user._id
      : (data.user && mongoose.Types.ObjectId.isValid(data.user) ? data.user : null);

    const existingClientInfo = data.clientInfo || {};
    const websiteType = data.websiteType || data.websiteTypeName || data.selectedCategory || 'Custom Website';
    const websiteTypeName = data.websiteTypeName || data.businessName || existingClientInfo.businessName || 'Custom Website Project';

    const clientInfo = {
      ...existingClientInfo,
      email: (existingClientInfo.email || req.user?.email || 'customer@local2brand.com').toLowerCase().trim(),
      ownerName: existingClientInfo.ownerName || existingClientInfo.contactPerson || req.user?.name || 'Client',
      mobile: existingClientInfo.mobile || req.user?.phone || 'Not Provided',
      businessName: existingClientInfo.businessName || websiteTypeName,
    };

    // Extract images if any
    const rawImages = [];
    if (Array.isArray(data.images)) rawImages.push(...data.images);
    if (Array.isArray(data.uploadedImages)) rawImages.push(...data.uploadedImages);
    if (data.logoFile) rawImages.push(data.logoFile);
    if (Array.isArray(data.photosFiles)) rawImages.push(...data.photosFiles);
    if (data.answers?.logoFile) rawImages.push(data.answers.logoFile);
    if (Array.isArray(data.answers?.photosFiles)) rawImages.push(...data.answers.photosFiles);
    if (data.fullFormData?.logoFile) rawImages.push(data.fullFormData.logoFile);
    if (Array.isArray(data.fullFormData?.photosFiles)) rawImages.push(...data.fullFormData.photosFiles);

    const uniqueImages = [];
    const seenUrls = new Set();
    for (const item of rawImages) {
      const url = typeof item === 'string' ? item : (item?.dataUrl || item?.url || item?.secure_url);
      if (url && !seenUrls.has(url)) {
        seenUrls.add(url);
        uniqueImages.push(typeof item === 'string' ? item : (item.dataUrl || item.url || item.secure_url || ''));
      }
    }

    const payload = {
      ...data,
      websiteType,
      websiteTypeName,
      requirementId,
      status: data.status || 'Draft',
      user: validUserId,
      userId: req.user?._id?.toString() || req.user?.id || (validUserId ? String(validUserId) : null),
      clientInfo,
      images: uniqueImages.length > 0 ? uniqueImages : (data.images || []),
      uploadedImages: uniqueImages.length > 0 ? uniqueImages : (data.uploadedImages || []),
      ipAddress: req.ip || req.connection?.remoteAddress || ''
    };

    let doc = null;
    await ensureDb().catch(() => {});
    if (isDbConnected()) {
      try {
        let existingDoc = await Requirement.findOne({ requirementId });
        if (existingDoc) {
          doc = await Requirement.findByIdAndUpdate(existingDoc._id, { $set: payload }, { new: true, setDefaultsOnInsert: true });
        } else {
          doc = await Requirement.create(payload);
        }
      } catch (dbErr) {
        console.warn('MongoDB draft save notice:', dbErr.message);
      }
    }
    
    // Always mirror in dataStore
    const existing = dataStore.find('requirements', (r) => r.requirementId === requirementId);
    if (existing) {
      dataStore.update('requirements', existing._id, payload);
    } else {
      dataStore.create('requirements', payload);
    }
    if (!doc) {
      doc = dataStore.find('requirements', (r) => r.requirementId === requirementId) || payload;
    }

    res.status(200).json({
      success: true,
      message: 'Progress saved successfully',
      requirementId: doc.requirementId || requirementId,
      requirement: doc
    });
  } catch (error) {
    console.error('Error autosaving requirement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit Finalized Requirement
// @route   POST /api/requirements/:id/submit or POST /api/requirements/submit
// @access  Public / Authenticated
export const submitRequirement = async (req, res) => {
  try {
    const { id } = req.params; // requirementId or _id
    const finalData = req.body || {};

    let targetId = (id && id !== 'new' && id !== 'undefined' && id.trim()) ? id.trim() : (finalData.requirementId || generateRequirementId());

    const validUserId = req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)
      ? req.user._id
      : (finalData.user && mongoose.Types.ObjectId.isValid(finalData.user) ? finalData.user : null);

    const existingClientInfo = finalData.clientInfo || {};
    const websiteType = finalData.websiteType || finalData.websiteTypeName || finalData.selectedCategory || 'Custom Website';
    const websiteTypeName = finalData.websiteTypeName || finalData.businessName || existingClientInfo.businessName || 'Custom Project';

    const clientInfo = {
      ...existingClientInfo,
      email: (existingClientInfo.email || req.user?.email || finalData.fullFormData?.emailAddress || 'customer@local2brand.com').toLowerCase().trim(),
      ownerName: existingClientInfo.ownerName || existingClientInfo.contactPerson || req.user?.name || finalData.fullFormData?.fullName || 'Client',
      mobile: existingClientInfo.mobile || req.user?.phone || finalData.fullFormData?.mobileNumber || 'Not Provided',
      businessName: existingClientInfo.businessName || websiteTypeName,
    };

    // Robustly extract all uploaded media, logo & photos
    const rawImages = [];
    if (Array.isArray(finalData.images)) rawImages.push(...finalData.images);
    if (Array.isArray(finalData.uploadedImages)) rawImages.push(...finalData.uploadedImages);
    if (finalData.logoFile) rawImages.push(finalData.logoFile);
    if (Array.isArray(finalData.photosFiles)) rawImages.push(...finalData.photosFiles);
    if (finalData.answers?.logoFile) rawImages.push(finalData.answers.logoFile);
    if (Array.isArray(finalData.answers?.photosFiles)) rawImages.push(...finalData.answers.photosFiles);
    if (finalData.fullFormData?.logoFile) rawImages.push(finalData.fullFormData.logoFile);
    if (Array.isArray(finalData.fullFormData?.photosFiles)) rawImages.push(...finalData.fullFormData.photosFiles);

    const uniqueImages = [];
    const seenUrls = new Set();
    for (const item of rawImages) {
      const url = typeof item === 'string' ? item : (item?.dataUrl || item?.url || item?.secure_url);
      if (url && !seenUrls.has(url)) {
        seenUrls.add(url);
        uniqueImages.push(typeof item === 'string' ? item : (item.dataUrl || item.url || item.secure_url || ''));
      }
    }

    const updatePayload = {
      ...finalData,
      websiteType,
      websiteTypeName,
      requirementId: targetId,
      user: validUserId,
      userId: req.user?._id?.toString() || req.user?.id || (validUserId ? String(validUserId) : null),
      clientInfo,
      images: uniqueImages.length > 0 ? uniqueImages : (finalData.images || []),
      uploadedImages: uniqueImages.length > 0 ? uniqueImages : (finalData.uploadedImages || []),
      status: 'Submitted',
      submittedAt: new Date()
    };

    let doc = null;
    await ensureDb().catch(() => {});

    if (isDbConnected()) {
      try {
        let existingDoc = null;
        if (mongoose.Types.ObjectId.isValid(targetId)) {
          existingDoc = await Requirement.findOne({ $or: [{ requirementId: targetId }, { _id: targetId }] });
        } else {
          existingDoc = await Requirement.findOne({
            $or: [
              { requirementId: targetId },
              { requirementId: { $regex: new RegExp(`^${targetId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
            ]
          });
        }

        if (existingDoc) {
          doc = await Requirement.findByIdAndUpdate(existingDoc._id, { $set: updatePayload }, { new: true });
        } else {
          doc = await Requirement.create(updatePayload);
        }
      } catch (mongoErr) {
        console.warn('MongoDB submission save notice:', mongoErr.message);
      }
    }
    
    // Always mirror in dataStore
    const existingDs = dataStore.find('requirements', (r) => r.requirementId?.toLowerCase() === targetId.toLowerCase() || r._id === targetId);
    if (existingDs) {
      dataStore.update('requirements', existingDs._id, updatePayload);
    } else {
      dataStore.create('requirements', updatePayload);
    }
    if (!doc) {
      doc = dataStore.find('requirements', (r) => r.requirementId?.toLowerCase() === targetId.toLowerCase() || r._id === targetId) || updatePayload;
    }

    if (!doc) {
      return res.status(500).json({ success: false, message: 'Failed to record requirement submission' });
    }

    const savedReqId = doc.requirementId || targetId;

    // Immediately respond to client so UI transitions in milliseconds
    res.status(200).json({
      success: true,
      message: 'Your website requirements have been submitted successfully.',
      requirementId: savedReqId,
      requirement: doc
    });

    // Background asynchronous dispatch for admin notifications & emails (Non-blocking)
    setImmediate(async () => {
      try {
        const businessName = doc.clientInfo?.businessName || doc.websiteTypeName || 'New Project';
        const clientName = doc.clientInfo?.ownerName || doc.clientInfo?.contactPerson || 'Client';
        const reqId = doc.requirementId || targetId;

        dataStore.createNotification({
          title: `New Requirement Submitted (${reqId})`,
          message: `${clientName} submitted complete specifications for ${businessName}`,
          type: 'requirement',
          link: '/admin/requirements',
        }).catch((err) => console.warn('Notification error:', err.message));

        sendRequirementConfirmationEmail(doc).catch((err) => console.warn('Client requirement email error:', err.message));
        sendAdminRequirementAlert(doc).catch((err) => console.warn('Admin requirement alert error:', err.message));
      } catch (bgErr) {
        console.warn('Background requirement alert error:', bgErr.message);
      }
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
    const userId = req.user?._id ? String(req.user._id) : (req.user?.id ? String(req.user.id) : null);
    const userEmail = (req.user?.email || req.query.email || '').toLowerCase().trim();
    const userPhone = (req.user?.phone || req.query.phone || '').trim();
    const cleanPhone = userPhone.replace(/\D/g, '');

    const allReqs = await fetchAllMergedRequirements();

    let requirements = allReqs.filter((r) => {
      if (!r) return false;

      // 1. User ID matching
      if (userId) {
        const rUserId = String(r.user?._id || r.user || r.userId || '');
        if (rUserId && rUserId === userId) return true;
      }

      // 2. Email matching (case-insensitive across clientInfo, root email, and form answers)
      if (userEmail) {
        const rEmail = (r.clientInfo?.email || r.email || r.fullFormData?.emailAddress || r.answers?.emailAddress || '').toLowerCase().trim();
        if (rEmail && (rEmail === userEmail || rEmail.includes(userEmail) || userEmail.includes(rEmail))) return true;
      }

      // 3. Phone matching (compare clean digits)
      if (cleanPhone && cleanPhone.length >= 7) {
        const rPhone = (r.clientInfo?.mobile || r.clientInfo?.phone || r.fullFormData?.mobileNumber || r.answers?.mobileNumber || '').replace(/\D/g, '');
        if (rPhone && (rPhone.includes(cleanPhone.slice(-10)) || cleanPhone.includes(rPhone.slice(-10)))) return true;
      }

      return false;
    });

    // If logged-in user has admin privileges and no personal orders, provide recent system orders
    if (requirements.length === 0 && req.user?.role === 'admin') {
      requirements = allReqs.slice(0, 25);
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
    const rawId = req.params.id || '';
    const cleanId = String(rawId).trim();
    if (!cleanId) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }

    const allReqs = await fetchAllMergedRequirements();
    let doc = allReqs.find(
      (r) =>
        r.requirementId?.toLowerCase() === cleanId.toLowerCase() ||
        r.requirementId === cleanId ||
        r._id?.toString() === cleanId
    );

    // 3. Fallback to QueryLead in MongoDB or dataStore if still not found
    if (!doc) {
      await ensureDb().catch(() => {});
      if (isDbConnected()) {
        try {
          const { QueryLead } = await import('../models/QueryLead.js');
          const escaped = cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const lead = await QueryLead.findOne({
            $or: [
              { leadId: cleanId },
              { leadId: { $regex: new RegExp(`^${escaped}$`, 'i') } },
              ...(mongoose.Types.ObjectId.isValid(cleanId) ? [{ _id: cleanId }] : [])
            ]
          });
          if (lead) {
            doc = {
              requirementId: lead.leadId || `ORD-${lead._id.toString().slice(-6).toUpperCase()}`,
              websiteTypeName: lead.websiteType || 'Custom Project',
              websiteType: lead.websiteType || 'Custom Project',
              clientInfo: {
                businessName: lead.businessName || lead.name,
                ownerName: lead.name,
                mobile: lead.phone,
                email: lead.email,
              },
              status: lead.status === 'in_progress' ? 'In Development' : lead.status === 'contacted' ? 'Under Review' : lead.status === 'completed' ? 'Completed' : 'Submitted',
              budget: lead.budget || 'Standard Commercial',
              timeline: lead.timeline || 'Express 48-72 Hours',
              additionalNotes: lead.requirements || '',
              createdAt: lead.createdAt
            };
          }
        } catch (leadErr) {
          console.warn('QueryLead fallback notice:', leadErr.message);
        }
      }
    }

    // 4. Fallback to dataStore queries if still not found
    if (!doc) {
      const allQueries = dataStore.read('queries') || [];
      const q = allQueries.find(
        (item) =>
          item.id === cleanId ||
          item.leadId === cleanId ||
          item.leadId?.toLowerCase() === cleanId.toLowerCase() ||
          item._id?.toString() === cleanId
      );
      if (q) {
        doc = {
          requirementId: q.leadId || q.id || `ORD-${String(q._id).slice(-6).toUpperCase()}`,
          websiteTypeName: q.websiteType || q.service || 'Custom Project',
          websiteType: q.websiteType || q.service || 'Custom Project',
          clientInfo: {
            businessName: q.businessName || q.name,
            ownerName: q.name,
            mobile: q.phone,
            email: q.email,
          },
          status: q.status === 'in_progress' ? 'In Development' : q.status === 'contacted' ? 'Under Review' : q.status === 'completed' ? 'Completed' : 'Submitted',
          budget: q.budget || 'Standard Commercial',
          timeline: q.timeline || 'Express 48-72 Hours',
          additionalNotes: q.requirements || q.message || '',
          createdAt: q.createdAt
        };
      }
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: `Requirement order "${cleanId}" not found.` });
    }

    return res.status(200).json({ success: true, requirement: doc });
  } catch (error) {
    console.error('getRequirementById error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Requirements (Admin)
// @route   GET /api/requirements/admin/all
// @access  Admin
export const getAllRequirements = async (req, res) => {
  try {
    const { status, search, limit = 200 } = req.query;

    let requirements = await fetchAllMergedRequirements();

    // Filter by status if requested
    if (status && status !== 'all') {
      const targetStatus = String(status).toLowerCase().trim();
      requirements = requirements.filter((r) => {
        const rStatus = (r.status || 'Submitted').toLowerCase().trim();
        return rStatus === targetStatus;
      });
    }

    // Filter by search query if provided
    if (search && String(search).trim()) {
      const s = String(search).toLowerCase().trim();
      requirements = requirements.filter((r) => {
        const rId = (r.requirementId || '').toLowerCase();
        const bName = (r.clientInfo?.businessName || r.websiteTypeName || '').toLowerCase();
        const oName = (r.clientInfo?.ownerName || r.clientInfo?.contactPerson || '').toLowerCase();
        const email = (r.clientInfo?.email || r.email || '').toLowerCase();
        const phone = (r.clientInfo?.mobile || r.clientInfo?.phone || '');
        const wType = (r.websiteType || r.websiteTypeName || '').toLowerCase();

        return (
          rId.includes(s) ||
          bName.includes(s) ||
          oName.includes(s) ||
          email.includes(s) ||
          phone.includes(s) ||
          wType.includes(s)
        );
      });
    }

    if (limit && Number(limit) > 0) {
      requirements = requirements.slice(0, Number(limit));
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

// @desc    Update Requirement Status & Client Details (Admin)
// @route   PUT/PATCH /api/requirements/admin/:id
// @access  Admin
export const updateRequirementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, internalNotes, quotedAmount, rejectionReason, reason, clientInfo, formData, answers, drivePdfLink, pdfUrl, documentUrl } = req.body;
    const finalRejectionReason = rejectionReason || reason || (status === 'Rejected' ? internalNotes : '');
    const resolvedPdfLink = drivePdfLink || pdfUrl || documentUrl;

    const updatePayload = {
      updatedAt: new Date()
    };

    if (status !== undefined) updatePayload.status = status;
    if (internalNotes !== undefined) updatePayload.internalNotes = internalNotes;
    if (quotedAmount !== undefined) updatePayload.quotedAmount = quotedAmount;
    if (clientInfo !== undefined) updatePayload.clientInfo = clientInfo;
    if (formData !== undefined) updatePayload.formData = formData;
    if (answers !== undefined) updatePayload.answers = answers;
    if (resolvedPdfLink !== undefined) {
      updatePayload.drivePdfLink = resolvedPdfLink;
      updatePayload.pdfUrl = resolvedPdfLink;
    }

    if (status === 'Rejected' || status === 'Cancelled') {
      updatePayload.rejectionReason = finalRejectionReason;
      updatePayload.deletionReason = finalRejectionReason;
      updatePayload.rejectedAt = new Date();
    }

    let updated = null;
    await ensureDb().catch(() => {});
    if (isDbConnected()) {
      try {
        updated = await Requirement.findOneAndUpdate(
          { $or: [{ requirementId: id }, ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])] },
          { $set: updatePayload },
          { new: true }
        ).populate('user');
      } catch (e) {
        console.warn('MongoDB update status notice:', e.message);
      }
    }

    // Always mirror update in dataStore
    const localUpdated = dataStore.update('requirements', id, { ...updatePayload, updatedAt: new Date().toISOString() });
    if (!updated) {
      updated = localUpdated;
    }

    if (!updated) {
      return res.status(200).json({
        success: true,
        message: `Status updated to ${status}`,
        requirement: { id, status, rejectionReason: finalRejectionReason }
      });
    }

    // Automatically send appropriate status/delivery/rejection email to client
    if (status === 'Rejected' || status === 'Cancelled') {
      sendRequirementRejectedEmail(updated, finalRejectionReason).catch((err) => console.warn('Rejection email notice:', err.message));
    } else if (status === 'Completed' || status === 'Delivered') {
      sendOrderDeliveredEmail(updated).catch((err) => console.warn('Delivery handover email notice:', err.message));
    } else {
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

// @desc    Delete/Cancel Requirement with reason (Admin)
// @route   DELETE /api/requirements/admin/:id or DELETE /api/requirements/:id
// @access  Admin
export const deleteRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const reason = req.body?.reason || req.query?.reason || 'Cancelled/Deleted by Administrator';
    let doc = null;

    await ensureDb().catch(() => {});
    if (isDbConnected()) {
      const query = mongoose.Types.ObjectId.isValid(id)
        ? { $or: [{ requirementId: id }, { _id: id }] }
        : { requirementId: id };
      
      // Soft-delete and archive record with status 'Cancelled' & reason so it displays in user portal
      doc = await Requirement.findOneAndUpdate(
        query,
        {
          $set: {
            isDeleted: true,
            status: 'Cancelled',
            deletionReason: reason,
            rejectionReason: reason,
            deletedAt: new Date(),
            updatedAt: new Date()
          }
        },
        { new: true }
      );
    }

    const allReqs = dataStore.read('requirements') || [];
    const existing = allReqs.find((r) => r.requirementId === id || r._id?.toString() === id);
    if (existing) {
      const localDoc = dataStore.update('requirements', existing._id, {
        isDeleted: true,
        status: 'Cancelled',
        deletionReason: reason,
        rejectionReason: reason,
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      if (!doc) doc = localDoc;
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Requirement submission not found' });
    }

    // Automatically remove attached photos from Cloudinary if needed
    try {
      const allDocImages = [
        ...(Array.isArray(doc.images) ? doc.images : []),
        ...(Array.isArray(doc.uploadedImages) ? doc.uploadedImages : []),
        ...(doc.answers && typeof doc.answers === 'object' && Array.isArray(doc.answers.images) ? doc.answers.images : [])
      ];
      if (allDocImages.length > 0) {
        deleteCloudinaryMedia(allDocImages).catch((err) => console.warn('Cloudinary auto-delete notice:', err.message));
      }
    } catch (cloudDelErr) {
      console.warn('Cloudinary delete error:', cloudDelErr.message);
    }

    // Fire email notifications to user (if email available) and admin
    try {
      if (doc.clientInfo?.email || doc.email) {
        sendRequirementDeletionEmail(doc, reason).catch((err) => console.warn('Client deletion email error:', err.message));
      }
      sendAdminRequirementDeletionAlert(doc, reason).catch((err) => console.warn('Admin deletion alert error:', err.message));
    } catch (mailErr) {
      console.warn('Deletion email dispatch error:', mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `Requirement submission #${doc.requirementId || id} cancelled and archived with reason.`,
      requirement: doc,
      deletedId: id
    });
  } catch (error) {
    console.error('deleteRequirement error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
