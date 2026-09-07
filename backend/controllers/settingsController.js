import mongoose from 'mongoose';
import { dataStore } from '../config/dataAdapter.js';
import { registerSettingsListener, broadcastSiteSettingsUpdate } from '../utils/sseBroadcaster.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await dataStore.getSettings();
    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching site settings',
    });
  }
};

/**
 * Real-Time Server-Sent Events (SSE) Stream for Live Settings Synchronization
 */
export const streamSettingsEvents = async (req, res) => {
  try {
    registerSettingsListener(req, res);
  } catch (error) {
    console.error('SSE Stream Error:', error);
    res.status(500).end();
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { _id, __v, createdAt, updatedAt, ...updates } = req.body;

    const userId = req.user?.id || req.user?._id;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      updates.updatedBy = userId;
    }

    const settings = await dataStore.updateSettings(updates);

    // Broadcast updated settings live to all active connected user clients
    try {
      broadcastSiteSettingsUpdate(settings);
    } catch (broadcastErr) {
      console.warn('Live settings broadcast warning:', broadcastErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Site settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating settings',
    });
  }
};

