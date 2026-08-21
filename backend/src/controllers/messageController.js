import Message from '../models/Message.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';

// @desc    Get all messages for a project
// @route   GET /api/messages/:projectId
// @access  Private
export const getProjectMessages = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Role check: USER can only access their own project messages
    if (project.client.toString() !== req.user.id && req.user.role === 'USER') {
      return res.status(403).json({ success: false, message: 'Not authorized to view messages' });
    }

    const messages = await Message.find({ project: req.params.projectId })
      .populate('sender', 'name email avatar role')
      .sort('createdAt');

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a message in a project chat
// @route   POST /api/messages/:projectId
// @access  Private
export const sendMessage = async (req, res) => {
  const { text, attachments } = req.body;

  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Role check
    if (project.client.toString() !== req.user.id && req.user.role === 'USER') {
      return res.status(403).json({ success: false, message: 'Not authorized to message on this project' });
    }

    const message = await Message.create({
      sender: req.user.id,
      project: req.params.projectId,
      text,
      attachments: attachments || [],
      readBy: [req.user.id],
    });

    // Determine recipient for notification
    let recipient;
    if (req.user.role === 'USER') {
      // Notify Admin/Assigned Team (we will send to the first team member or mock a general system alert)
      recipient = project.assignedTeam.length > 0 ? project.assignedTeam[0] : null;
    } else {
      // Notify Client
      recipient = project.client;
    }

    if (recipient) {
      await Notification.create({
        recipient,
        title: 'New Message',
        description: `${req.user.name} sent a message: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`,
        relatedProject: project._id,
        type: 'NEW_MESSAGE',
      });
    }

    const populatedMessage = await message.populate('sender', 'name email avatar role');

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
