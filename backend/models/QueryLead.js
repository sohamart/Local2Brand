import mongoose from 'mongoose';

const queryLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    businessName: {
      type: String,
      default: '',
      trim: true,
    },
    websiteType: {
      type: String,
      default: 'Custom Website',
    },
    selectedDemo: {
      type: String,
      default: '',
    },
    selectedServices: {
      type: [String],
      default: [],
    },
    selectedFeatures: {
      type: [String],
      default: [],
    },
    industry: {
      type: String,
      default: 'General Business',
    },
    themePreference: {
      type: String,
      default: 'Modern Glassmorphic',
    },
    budget: {
      type: String,
      default: '₹9,999 - ₹19,999',
    },
    timeline: {
      type: String,
      default: 'Express 48 Hours',
    },
    requirements: {
      type: String,
      default: '',
      trim: true,
    },
    couponCode: {
      type: String,
      default: '',
      trim: true,
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
    estimatedPrice: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'contacted', 'completed', 'cancelled'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const QueryLead = mongoose.models.QueryLead || mongoose.model('QueryLead', queryLeadSchema);
