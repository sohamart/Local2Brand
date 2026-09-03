import mongoose from 'mongoose';

const activeVisitorSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    userName: {
      type: String,
      default: '',
      trim: true,
    },
    userEmail: {
      type: String,
      default: '',
      trim: true,
    },
    currentPage: {
      type: String,
      default: '/',
      trim: true,
    },
    pageTitle: {
      type: String,
      default: '',
      trim: true,
    },
    device: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
      default: 'desktop',
    },
    browser: {
      type: String,
      default: '',
      trim: true,
    },
    os: {
      type: String,
      default: '',
      trim: true,
    },
    ip: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'India',
    },
    city: {
      type: String,
      default: '',
    },
    lastSeen: {
      type: Date,
      default: Date.now,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Indexes for fast real-time active visitor queries and auto-cleanup
activeVisitorSchema.index({ lastSeen: -1 });
activeVisitorSchema.index({ lastSeen: 1, visitorId: 1 });

export const ActiveVisitor = mongoose.models.ActiveVisitor || mongoose.model('ActiveVisitor', activeVisitorSchema);
export default ActiveVisitor;
