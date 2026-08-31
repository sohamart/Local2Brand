import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', default: null },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: {
    type: String,
    enum: ['developer', 'owner', 'manager', 'staff', 'customer'],
    default: 'customer'
  },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80' },
  loyaltyPoints: { type: Number, default: 0 },
  referralCode: { type: String, default: '' },
  savedAddresses: [{
    title: String,
    address: String,
    landmark: String,
    city: String,
    pincode: String,
    isDefault: Boolean
  }]
}, { timestamps: true });

userSchema.index({ email: 1, restaurantId: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
