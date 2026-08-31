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
    ];

    const updates = {};
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    if (req.user) updates.updatedBy = req.user.id;

    const settings = await dataStore.updateSettings(updates);

    return res.status(200).json({
      success: true,
      message: 'Site settings updated successfully',
      settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating settings',
    });
  }
};
