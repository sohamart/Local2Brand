import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Partially Paid'],
      default: 'Pending',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    billingDate: {
      type: Date,
      default: Date.now,
    },
    downloadUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
