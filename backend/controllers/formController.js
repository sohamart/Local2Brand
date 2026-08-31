import FormConfig from '../models/FormConfig.js';
import { defaultFormSchema } from '../config/defaultFormSchema.js';
import { dataStore } from '../config/dataAdapter.js';
import mongoose from 'mongoose';

// Ensure default published form exists in store or MongoDB
export const ensureDefaultForm = async () => {
  if (mongoose.connection.readyState === 1) {
    const count = await FormConfig.countDocuments();
    if (count === 0) {
      const form = new FormConfig(defaultFormSchema);
      await form.save();
      console.log('✅ Default Dynamic Form Configuration Seeded (Version 1.0)');
      return form;
    }
  } else {
    let form = dataStore.find('form_configs', (f) => f.status === 'published');
    if (!form) {
      form = {
        _id: 'form_config_default_v1',
        ...defaultFormSchema,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dataStore.create('form_configs', form);
      console.log('✅ Default Form Configuration Seeded in Local Store (Version 1.0)');
    }
    return form;
  }
};

// @desc    Get Published Form Configuration for Client Onboarding
// @route   GET /api/forms/published
// @access  Public
export const getPublishedForm = async (req, res) => {
  try {
    let form;
    if (mongoose.connection.readyState === 1) {
      form = await FormConfig.findOne({ status: 'published' }).sort({ versionNumber: -1 });
      if (!form) {
        form = await ensureDefaultForm();
      }
    } else {
      form = dataStore.find('form_configs', (f) => f.status === 'published') || (await ensureDefaultForm());
    }

    res.status(200).json({
      success: true,
      form
    });
  } catch (error) {
    console.error('Error fetching published form:', error);
    res.status(500).json({ success: false, message: 'Server error fetching form schema' });
  }
};

// @desc    Get All Form Versions & Drafts (Admin)
// @route   GET /api/admin/forms
// @access  Admin
export const getAllForms = async (req, res) => {
  try {
    let forms;
    if (mongoose.connection.readyState === 1) {
      forms = await FormConfig.find().sort({ createdAt: -1 });
    } else {
      forms = dataStore.read('form_configs');
    }

    res.status(200).json({
      success: true,
      forms
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create New Form or Draft
// @route   POST /api/admin/forms
// @access  Admin
export const createForm = async (req, res) => {
  try {
    const { name, version, categories, steps, questions } = req.body;

    const newFormData = {
      name: name || 'Custom Website Requirement Form',
      version: version || '1.1',
      versionNumber: 2,
      status: 'draft',
      isPublished: false,
      categories: categories || defaultFormSchema.categories,
      steps: steps || defaultFormSchema.steps,
      questions: questions || defaultFormSchema.questions,
      updatedBy: req.user?._id
    };

    let form;
    if (mongoose.connection.readyState === 1) {
      form = new FormConfig(newFormData);
      await form.save();
    } else {
      form = dataStore.create('form_configs', newFormData);
    }

    res.status(201).json({
      success: true,
      message: 'Draft form created successfully',
      form
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Form (Steps, Categories, Questions, Conditional Logic)
// @route   PUT /api/admin/forms/:id
// @access  Admin
export const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updatedAt = new Date();

    let updatedForm;
    if (mongoose.connection.readyState === 1) {
      updatedForm = await FormConfig.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } else {
      updatedForm = dataStore.update('form_configs', id, updateData);
    }

    if (!updatedForm) {
      return res.status(404).json({ success: false, message: 'Form configuration not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Form configuration updated successfully',
      form: updatedForm
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Publish Form Version (Draft -> Published)
// @route   POST /api/admin/forms/:id/publish
// @access  Admin
export const publishForm = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      // Set all other forms to archived/draft
      await FormConfig.updateMany({ _id: { $ne: id } }, { status: 'archived', isPublished: false });
      const published = await FormConfig.findByIdAndUpdate(
        id,
        { status: 'published', isPublished: true, publishedAt: new Date() },
        { new: true }
      );
      return res.status(200).json({ success: true, message: 'Form configuration published live!', form: published });
    } else {
      const all = dataStore.read('form_configs');
      all.forEach((f) => {
        if (f._id === id) {
          f.status = 'published';
          f.isPublished = true;
          f.publishedAt = new Date().toISOString();
        } else {
          f.status = 'archived';
          f.isPublished = false;
        }
      });
      dataStore.save('form_configs', all);
      const published = dataStore.findById('form_configs', id);
      return res.status(200).json({ success: true, message: 'Form configuration published live!', form: published });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
