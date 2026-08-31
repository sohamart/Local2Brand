import mongoose from 'mongoose';

const callbackRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    preferredTime: {
      type: String,
      default: 'As soon as possible',
    },
    topic: {
      type: String,
      default: 'General Website Discussion',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'called', 'resolved', 'cancelled'],
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
  },
  {
    timestamps: true,
  }
);

export const CallbackRequest = mongoose.models.CallbackRequest || mongoose.model('CallbackRequest', callbackRequestSchema);
