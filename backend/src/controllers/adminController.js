import User from '../models/User.js';
import Project from '../models/Project.js';
import Demo from '../models/Demo.js';
import Portfolio from '../models/Portfolio.js';
import Invoice from '../models/Invoice.js';
import ContactLead from '../models/ContactLead.js';
import Notification from '../models/Notification.js';
import AdminActivity from '../models/AdminActivity.js';

// @desc    Get dashboard analytics statistics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const totalClients = await User.countDocuments({ role: 'USER' });
    const activeProjects = await Project.countDocuments({ status: { $nin: ['Completed', 'Launched', 'Pending'] } });
    const completedProjects = await Project.countDocuments({ status: { $in: ['Completed', 'Launched'] } });
    const pendingRequests = await Project.countDocuments({ status: 'Pending' });

    // Calculate revenue based on project budgets
    const projects = await Project.find({}, 'budget status');
    const revenue = projects
      .filter(p => p.status !== 'Pending')
      .reduce((sum, p) => sum + p.budget, 0);

    const pendingPayments = await Invoice.find({ status: { $ne: 'Paid' } });
    const totalPendingPaymentSum = pendingPayments.reduce((sum, inv) => sum + inv.amount, 0);

    const totalLeads = await ContactLead.countDocuments();

    // Status distribution
    const statusDistribution = {
      Pending: await Project.countDocuments({ status: 'Pending' }),
      Planning: await Project.countDocuments({ status: 'Planning' }),
      Design: await Project.countDocuments({ status: 'Design' }),
      Development: await Project.countDocuments({ status: 'Development' }),
      Testing: await Project.countDocuments({ status: 'Testing' }),
      Review: await Project.countDocuments({ status: 'Review' }),
      Completed: await Project.countDocuments({ status: 'Completed' }),
      Launched: await Project.countDocuments({ status: 'Launched' }),
    };

    res.status(200).json({
      success: true,
      stats: {
        totalClients,
        activeProjects,
        completedProjects,
        pendingRequests,
        revenue,
        totalPendingPaymentSum,
        totalLeads,
        statusDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all client users
// @route   GET /api/admin/clients
// @access  Private/Admin
export const getClients = async (req, res) => {
  try {
    const clients = await User.find({ role: 'USER' }).sort('-createdAt');
    res.status(200).json({ success: true, clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all projects
// @route   GET /api/admin/projects
// @access  Private/Admin
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('client', 'name email phone')
      .populate('assignedTeam', 'name email role')
      .sort('-createdAt');
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create project manually or accept a request
// @route   POST /api/admin/projects
// @access  Private/Admin
export const adminCreateProject = async (req, res) => {
  const { name, category, budget, deadline, description, client, status } = req.body;

  try {
    const project = await Project.create({
      name,
      category,
      budget,
      deadline,
      description,
      client,
      status: status || 'Planning',
      progress: 0,
      currentStage: 'Project Confirmed',
    });

    await AdminActivity.create({
      admin: req.user.id,
      action: 'CREATE_PROJECT',
      targetType: 'Project',
      targetId: project._id,
      description: `Created project "${name}" for client ${client}`,
    });

    // Notify user
    await Notification.create({
      recipient: client,
      title: 'Project Initiated',
      description: `Your website project "${name}" has been officially started! View progress on your dashboard.`,
      relatedProject: project._id,
      type: 'PROJECT_UPDATE',
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project details / progress / status
// @route   PUT /api/admin/projects/:id
// @access  Private/Admin
export const adminUpdateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { name, category, budget, deadline, description, status, progress, currentStage, assignedTeam } = req.body;

    if (name) project.name = name;
    if (category) project.category = category;
    if (budget) project.budget = budget;
    if (deadline) project.deadline = deadline;
    if (description) project.description = description;
    if (status) project.status = status;
    if (progress !== undefined) project.progress = progress;
    if (currentStage) project.currentStage = currentStage;
    if (assignedTeam) project.assignedTeam = assignedTeam;

    await project.save();

    await AdminActivity.create({
      admin: req.user.id,
      action: 'UPDATE_PROJECT',
      targetType: 'Project',
      targetId: project._id,
      description: `Updated project "${project.name}" details.`,
    });

    // Notify client
    await Notification.create({
      recipient: project.client,
      title: 'Project Updated',
      description: `Your project "${project.name}" progress has been updated to ${project.progress}%. Stage: ${project.currentStage}`,
      relatedProject: project._id,
      type: 'PROJECT_UPDATE',
    });

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update progress stage timeline
// @route   PUT /api/admin/projects/:id/stages
// @access  Private/Admin
export const adminUpdateProjectStage = async (req, res) => {
  const { stageName, status, adminNote, attachments } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const stage = project.stages.find(s => s.stageName === stageName);
    if (!stage) {
      return res.status(400).json({ success: false, message: 'Stage not found' });
    }

    stage.status = status || stage.status;
    stage.date = Date.now();
    if (adminNote !== undefined) stage.adminNote = adminNote;
    if (attachments) stage.attachments = attachments;

    // Auto calculate overall progress based on stages completed
    const completedStages = project.stages.filter(s => s.status === 'Completed').length;
    const totalStages = project.stages.length;
    project.progress = Math.round((completedStages / totalStages) * 100);

    // Auto set current stage as the first stage that is In Progress or Pending
    const nextActiveStage = project.stages.find(s => s.status === 'In Progress') || project.stages.find(s => s.status === 'Pending');
    if (nextActiveStage) {
      project.currentStage = nextActiveStage.stageName;
    } else {
      project.currentStage = 'Launch';
    }

    // Auto-update overall project status based on progress
    if (project.progress === 100) {
      project.status = 'Launched';
    } else if (project.progress > 85) {
      project.status = 'Review';
    } else if (project.progress > 60) {
      project.status = 'Testing';
    } else if (project.progress > 30) {
      project.status = 'Development';
    } else if (project.progress > 10) {
      project.status = 'Design';
    }

    await project.save();

    // Notify user
    await Notification.create({
      recipient: project.client,
      title: 'Project Timeline Updated',
      description: `Stage "${stageName}" is now marked as "${stage.status}". Note: ${stage.adminNote || 'No notes'}`,
      relatedProject: project._id,
      type: 'PROJECT_UPDATE',
    });

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all leads
// @route   GET /api/admin/leads
// @access  Private/Admin
export const getLeads = async (req, res) => {
  try {
    const leads = await ContactLead.find().sort('-createdAt');
    res.status(200).json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update contact lead status
// @route   PUT /api/admin/leads/:id
// @access  Private/Admin
export const updateLeadStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const lead = await ContactLead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    lead.status = status;
    await lead.save();

    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all invoices
// @route   GET /api/admin/invoices
// @access  Private/Admin
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('project', 'name')
      .populate('client', 'name email')
      .sort('-createdAt');
    res.status(200).json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create invoice
// @route   POST /api/admin/invoices
// @access  Private/Admin
export const createInvoice = async (req, res) => {
  const { invoiceNumber, project, client, amount, status, dueDate, downloadUrl } = req.body;

  try {
    const invoice = await Invoice.create({
      invoiceNumber,
      project,
      client,
      amount,
      status: status || 'Pending',
      dueDate,
      downloadUrl: downloadUrl || '',
    });

    // Notify client
    await Notification.create({
      recipient: client,
      title: 'New Invoice Issued',
      description: `Invoice ${invoiceNumber} for amount ₹${amount} has been issued. Due date: ${new Date(dueDate).toLocaleDateString()}`,
      relatedProject: project,
      type: 'INVOICE',
    });

    res.status(201).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update invoice status
// @route   PUT /api/admin/invoices/:id
// @access  Private/Admin
export const updateInvoiceStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    invoice.status = status;
    await invoice.save();

    // Notify client
    await Notification.create({
      recipient: invoice.client,
      title: 'Invoice Payment Received',
      description: `We've marked invoice ${invoice.invoiceNumber} as "${status}". Thank you!`,
      relatedProject: invoice.project,
      type: 'INVOICE',
    });

    res.status(200).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add website demo template
// @route   POST /api/admin/demos
// @access  Private/Admin
export const addDemo = async (req, res) => {
  try {
    const demo = await Demo.create(req.body);
    res.status(201).json({ success: true, demo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update website demo template
// @route   PUT /api/admin/demos/:id
// @access  Private/Admin
export const updateDemo = async (req, res) => {
  try {
    const demo = await Demo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, demo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete website demo template
// @route   DELETE /api/admin/demos/:id
// @access  Private/Admin
export const deleteDemo = async (req, res) => {
  try {
    await Demo.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Demo deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
