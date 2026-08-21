import mongoose from 'mongoose';

const stageSchema = new mongoose.Schema({
  stageName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  adminNote: {
    type: String,
    default: '',
  },
  attachments: [
    {
      name: String,
      url: String,
    },
  ],
});

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a project name'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Planning', 'Design', 'Development', 'Testing', 'Review', 'Completed', 'Launched'],
      default: 'Pending',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    currentStage: {
      type: String,
      default: 'Project Confirmed',
    },
    deadline: {
      type: Date,
    },
    budget: {
      type: Number,
      required: [true, 'Please add a budget'],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTeam: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    description: {
      type: String,
      required: [true, 'Please add a project description'],
    },
    demoSelected: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Demo',
    },
    stages: {
      type: [stageSchema],
      default: [
        { stageName: 'Project Confirmed', status: 'Completed' },
        { stageName: 'Requirements', status: 'Pending' },
        { stageName: 'UI Design', status: 'Pending' },
        { stageName: 'Design Approval', status: 'Pending' },
        { stageName: 'Development', status: 'Pending' },
        { stageName: 'Testing', status: 'Pending' },
        { stageName: 'Client Review', status: 'Pending' },
        { stageName: 'Deployment', status: 'Pending' },
        { stageName: 'Launch', status: 'Pending' },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
