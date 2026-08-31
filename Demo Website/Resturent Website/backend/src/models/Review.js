import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  author: { type: String, required: true },
  avatar: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  foodRating: { type: Number, default: 5 },
  serviceRating: { type: Number, default: 5 },
  dish: String,
  comment: { type: String, required: true },
  verifiedPurchase: { type: Boolean, default: true },
  ownerReply: String,
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
