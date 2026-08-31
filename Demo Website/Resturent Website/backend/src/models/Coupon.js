import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  code: { type: String, required: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  value: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  description: String,
  isActive: { type: Boolean, default: true },
  expiresAt: String
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
