import mongoose from 'mongoose';

const variantOptionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  priceDelta: { type: Number, default: 0 }
});

const variantGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: [variantOptionSchema]
});

const addonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const productSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  image: { type: String, default: '' },
  gallery: [{ type: String }],
  isVeg: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  spicyLevel: { type: Number, default: 1 },
  prepTime: { type: String, default: '20 min' },
  calories: { type: Number },
  rating: { type: Number, default: 4.9 },
  ratingCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  variants: [variantGroupSchema],
  addons: [addonSchema],
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
