import mongoose from 'mongoose';
import { dataStore } from '../config/dataAdapter.js';

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

export const updateSettings = async (req, res) => {
  try {
    const fields = [
      'brandName',
      'domain',
      'tagline',
      'supportEmail',
      'displayPhone',
      'turnaroundTime',
      'startingPriceUsd',
      'startingPriceInr',
      'isMaintenanceMode',
      'isComingSoonMode',
      'maintenanceMessage',
      'socialLinks',
      'heroConfig',
      'announcementBar',
      'bannerImage',
      'aiSettings',
    ];


    const updates = {};
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const userId = req.user?.id || req.user?._id;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      updates.updatedBy = userId;
    }

    const settings = await dataStore.updateSettings(updates);

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
