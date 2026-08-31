import mongoose from 'mongoose';

const portfolioDemoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Template/Demo title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: 'PRO READY',
    },
    liveUrl: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    techStack: {
      type: [String],
      default: ['React', 'TailwindCSS', 'Framer Motion'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const PortfolioDemo = mongoose.models.PortfolioDemo || mongoose.model('PortfolioDemo', portfolioDemoSchema);
