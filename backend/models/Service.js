import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    icon: {
      type: String,
      default: 'Sparkles',
    },
    shortDesc: {
      type: String,
      required: true,
    },
    fullDesc: {
      type: String,
      default: '',
    },
    startingPrice: {
      type: String,
      default: '₹9,999',
    },
    features: {
      type: [String],
      default: [],
    },
    isPopular: {
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

export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
