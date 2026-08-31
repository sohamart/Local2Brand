import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  image: String,
  variant: String,
  addons: [String],
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
  specialNotes: String
});

const orderSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderNumber: { type: String, required: true },
  
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    address: String
  },

  orderType: {
    type: String,
    enum: ['delivery', 'pickup', 'dine_in'],
    default: 'delivery'
  },

  items: [orderItemSchema],

  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },

  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod', 'upi_qr'],
    default: 'razorpay'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,

  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },

  estimatedTime: { type: String, default: '30-40 mins' },
  kitchenNotes: String
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
