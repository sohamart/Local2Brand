import { dataStore } from '../config/dataAdapter.js';
import {
  sendCallbackConfirmationEmail,
  sendAdminCallbackAlert,
  sendCallbackStatusUpdateEmail,
  sendCallbackResolutionEmail,
  sendCallbackDeletionEmail,
  sendAdminCallbackDeletionAlert
} from '../utils/email.js';
import oneSignalBackend from '../services/oneSignalService.js';
import mongoose from 'mongoose';


export const createCallback = async (req, res) => {
  try {
    const { name, phone, email, preferredTime, topic, notes } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required to request a callback',
      });
    }

    const validUserId = req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)
      ? req.user._id
      : null;

    const resolvedEmail = (email || req.user?.email || '').toLowerCase().trim();

    const callback = await dataStore.createCallback({
      name: name.trim(),
      phone: phone.trim(),
      email: resolvedEmail,
      preferredTime: preferredTime || '⚡ ASAP (Within 15-30 mins)',
      topic: topic || 'General Website Discussion',
      notes: notes || '',
      user: validUserId,
    });

    dataStore.createNotification({
      title: 'New Callback Request',
      message: `${callback.name} requested a call at ${callback.phone} (${callback.preferredTime})`,
      type: 'callback',
      link: `/admin/callbacks`,
    }).catch((err) => console.warn('Admin notification error:', err.message));

    // Asynchronous notifications with await to ensure delivery before response
    const callbackUserTarget = callback.user || validUserId || resolvedEmail;

    await Promise.allSettled([
      sendAdminCallbackAlert(callback),
      callback.email ? sendCallbackConfirmationEmail(callback) : Promise.resolve(),
      oneSignalBackend.sendNotificationToAdmins({
        title: '📞 New Callback Request',
        message: `${callback.name} requested a call: ${callback.phone} (${callback.preferredTime})`,
        url: '/admin/callbacks',
        data: { type: 'callback_request', callbackId: callback._id || callback.id }
      }),
      callbackUserTarget ? oneSignalBackend.sendNotificationToUser(callbackUserTarget, {
        title: '📞 Callback Request Confirmed',
        message: `Hi ${callback.name}, our specialist will call you at ${callback.phone} (${callback.preferredTime}).`,
        url: '/dashboard',
        data: { type: 'callback_confirmation', callbackId: callback._id || callback.id }
      }) : Promise.resolve(),
    ]);

    return res.status(201).json({
      success: true,
      message: 'Callback request registered! We will call you at your preferred time.',
      callback,
    });
  } catch (error) {
    console.error('Callback request error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error submitting callback request',
    });
  }
};

export const getUserCallbacks = async (req, res) => {
  try {
    const userId = req.user?._id?.toString() || req.user?.id;
    const userEmail = (req.user?.email || req.query.email || '').toLowerCase().trim();
    if (!userId && !userEmail) {
      return res.status(200).json({ success: true, count: 0, callbacks: [] });
    }
    const callbacks = await dataStore.getUserCallbacks(userId, userEmail);
    return res.status(200).json({
      success: true,
      count: callbacks.length,
      callbacks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving callbacks',
    });
  }
};

export const getAllCallbacks = async (req, res) => {
  try {
    const { status } = req.query;
    const callbacks = await dataStore.getAllCallbacks({ status });
    return res.status(200).json({
      success: true,
      total: callbacks.length,
      callbacks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving callbacks',
    });
  }
};

export const updateCallbackStatus = async (req, res) => {
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

    const callback = await dataStore.updateCallback(req.params.id, updates);
    if (!callback) return res.status(404).json({ success: false, message: 'Callback request not found' });

    const targetUser = callback.user || callback.userId || callback.email;

    // Await delivery of status update email and push notification
    await Promise.allSettled([
      callback.email ? sendCallbackStatusUpdateEmail(callback, status, adminNotes, resolvedPdf) : Promise.resolve(),
      targetUser && status ? oneSignalBackend.sendNotificationToUser(targetUser, {
        title: `📞 Callback Update: ${status}`,
        message: `Your callback request status has been updated to "${status}".`,
        url: '/dashboard',
        data: { type: 'callback_status_update', callbackId: callback._id || callback.id, status }
      }) : Promise.resolve(),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Callback request updated successfully',
      callback,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating callback request',
    });
  }
};

export const deleteCallback = async (req, res) => {
  try {
    const id = req.params.id;
    let callback = null;

    try {
      const allCallbacks = await dataStore.getAllCallbacks({});
      callback = allCallbacks.find((c) => c._id?.toString() === id.toString() || c.id?.toString() === id.toString());
    } catch (e) {
      console.warn('Error finding callback before deletion:', e.message);
    }

    await dataStore.deleteCallback(id);

    if (callback) {
      if (callback.email) {
        sendCallbackDeletionEmail(callback).catch((err) => console.warn('Callback deletion email error:', err.message));
      }
      sendAdminCallbackDeletionAlert(callback).catch((err) => console.warn('Admin callback deletion alert error:', err.message));
    }

    return res.status(200).json({
      success: true,
      message: 'Callback request deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting callback request',
    });
  }
};
