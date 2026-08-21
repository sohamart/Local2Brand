import Project from '../models/Project.js';
import Notification from '../models/Notification.js';

// @desc    Submit a new project request (wizard flow)
// @route   POST /api/projects
// @access  Private
export const createProjectRequest = async (req, res) => {
  const { name, category, budget, deadline, description, features, demoSelected } = req.body;

  try {
    const project = await Project.create({
      name,
      category,
      budget,
      deadline,
      description,
      client: req.user.id,
      demoSelected: demoSelected || null,
      status: 'Pending',
      progress: 0,
      currentStage: 'Project Confirmed',
    });

    // Create notification for admin (simulated, but we create it in DB)
    await Notification.create({
      recipient: req.user.id, // For the client
      title: 'Project Request Received',
      description: `Your request for the project "${name}" has been submitted successfully.`,
      relatedProject: project._id,
      type: 'PROJECT_UPDATE',
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's projects
// @route   GET /api/projects
// @access  Private
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user.id })
      .populate('client', 'name email phone')
      .populate('demoSelected')
      .sort('-createdAt');
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email phone')
      .populate('assignedTeam', 'name email phone role')
      .populate('demoSelected');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Access check: User must be the client, or an admin/team member
    if (project.client._id.toString() !== req.user.id && req.user.role === 'USER') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this project' });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add file to project stage/files
// @route   POST /api/projects/:id/files
// @access  Private
export const uploadProjectFile = async (req, res) => {
  const { name, url } = req.body; // Mock file upload values

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Find current stage or general attachments
    // For simplicity, we add to project's first active or confirmed stage attachment
    const activeStage = project.stages.find(s => s.status === 'In Progress') || project.stages[0];
    activeStage.attachments.push({ name, url });
    await project.save();

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
