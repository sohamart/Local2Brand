import mongoose from 'mongoose';

const pageViewSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    page: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    referrer: {
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
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Compound indexes for fast time-series aggregation and deduplication
pageViewSchema.index({ createdAt: -1, visitorId: 1 });
pageViewSchema.index({ createdAt: -1, page: 1 });
pageViewSchema.index({ visitorId: 1, createdAt: -1 });

export const PageView = mongoose.models.PageView || mongoose.model('PageView', pageViewSchema);
export default PageView;
