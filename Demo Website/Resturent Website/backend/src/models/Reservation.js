import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  guests: { type: Number, required: true, default: 2 },
  date: { type: String, required: true },
  time: { type: String, required: true },
  tableNumber: String,
  occasion: String,
  specialRequests: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
