import FormConfig from '../models/FormConfig.js';
import { defaultFormSchema } from '../config/defaultFormSchema.js';
import { dataStore } from '../config/dataAdapter.js';
import mongoose from 'mongoose';

// Ensure default published form exists in store or MongoDB
export const ensureDefaultForm = async () => {
  if (mongoose.connection.readyState === 1) {
    let form = await FormConfig.findOne({ status: 'published' });
    if (!form) {
      form = new FormConfig(defaultFormSchema);
      await form.save();
      console.log('✅ Default Dynamic Form Configuration Seeded (Version 3.0)');
    } else if (form.version !== '3.0') {
      form.name = defaultFormSchema.name;
      form.version = defaultFormSchema.version;
      form.versionNumber = defaultFormSchema.versionNumber;
      form.categories = defaultFormSchema.categories;
      form.steps = defaultFormSchema.steps;
      form.questions = defaultFormSchema.questions;
      await form.save();
      console.log('✅ Dynamic Form Configuration Upgraded to Full 10-Step Blank-First Schema (Version 3.0)');
    }
    return form;
  } else {
    let form = dataStore.find('form_configs', (f) => f.status === 'published');
    if (!form) {
      form = {
        _id: 'form_config_default_v3',
        ...defaultFormSchema,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dataStore.create('form_configs', form);
      console.log('✅ Default Form Configuration Seeded in Local Store (Version 3.0)');
    } else if (form.version !== '3.0') {
      form.name = defaultFormSchema.name;
      form.version = defaultFormSchema.version;
      form.versionNumber = defaultFormSchema.versionNumber;
      form.categories = defaultFormSchema.categories;
      form.steps = defaultFormSchema.steps;
      form.questions = defaultFormSchema.questions;
      dataStore.update('form_configs', form._id, form);
      console.log('✅ Local Store Form Configuration Upgraded to Full 10-Step Blank-First Schema (Version 3.0)');
    }
    return form;
  }
};

// @desc    Get Published Form Configuration for Client Onboarding
// @route   GET /api/forms/published
// @access  Public
export const getPublishedForm = async (req, res) => {
  try {
    let form = await ensureDefaultForm();

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
      version: version || '2.0',
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

// @desc    Reset Form to Standard Default 12-Step Schema
// @route   POST /api/forms/admin/reset-defaults
// @access  Admin
export const resetFormToDefaults = async (req, res) => {
  try {
    const { id } = req.params;

    const resetData = {
      name: defaultFormSchema.name,
      version: '2.0',
      versionNumber: 2,
      status: 'published',
      isPublished: true,
      categories: defaultFormSchema.categories,
      steps: defaultFormSchema.steps,
      questions: defaultFormSchema.questions,
      updatedAt: new Date()
    };

    let form;
    if (mongoose.connection.readyState === 1) {
      if (id) {
        form = await FormConfig.findByIdAndUpdate(id, resetData, { new: true });
      } else {
        form = await FormConfig.findOneAndUpdate({ status: 'published' }, resetData, { new: true, upsert: true });
      }
    } else {
      if (id) {
        form = dataStore.update('form_configs', id, resetData);
      } else {
        const existing = dataStore.find('form_configs', (f) => f.status === 'published');
        if (existing) {
          form = dataStore.update('form_configs', existing._id, resetData);
        } else {
          form = dataStore.create('form_configs', { _id: 'form_config_default_v2', ...resetData });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'All 12 steps and standard questions restored to official schema!',
      form
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
