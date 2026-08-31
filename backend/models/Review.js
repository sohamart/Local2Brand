import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userName: {
      type: String,
      required: [true, 'Client/User name is required'],
      trim: true,
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    userRole: {
      type: String,
      trim: true,
      default: 'Business Owner',
    },
    businessName: {
      type: String,
      trim: true,
      default: '',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ rating: -1, createdAt: -1 });
reviewSchema.index({ status: 1, isFeatured: -1 });

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
