import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  number: { type: String, required: true },
  capacity: { type: Number, required: true, default: 4 },
  section: { type: String, default: 'Indoor' },
  status: { type: String, enum: ['available', 'reserved', 'occupied'], default: 'available' }
}, { timestamps: true });

export default mongoose.models.Table || mongoose.model('Table', tableSchema);
