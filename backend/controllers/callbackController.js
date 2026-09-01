import { dataStore } from '../config/dataAdapter.js';
import { sendCallbackConfirmationEmail, sendAdminCallbackAlert } from '../utils/email.js';
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

    const callback = await dataStore.createCallback({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.toLowerCase().trim() : '',
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

    // Instant alert to Admin (sohamduttabwn@gmail.com) and Brand (stackaddacontact@gmail.com)
    sendAdminCallbackAlert(callback).catch((err) => console.warn('Admin callback alert error:', err.message));

    if (callback.email) {
      sendCallbackConfirmationEmail(callback).catch((err) => console.warn('Callback email error:', err.message));
    }

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
    const { status, adminNotes } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    const callback = await dataStore.updateCallback(req.params.id, updates);
    if (!callback) return res.status(404).json({ success: false, message: 'Callback request not found' });

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
    await dataStore.deleteCallback(req.params.id);
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
