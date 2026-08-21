import mongoose from 'mongoose';

const adminActivitySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      required: true, // e.g. 'Project', 'Demo', 'User', 'Invoice'
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdminActivity = mongoose.model('AdminActivity', adminActivitySchema);
export default AdminActivity;
