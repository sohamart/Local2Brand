import mongoose from 'mongoose';

const contactLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Negotiating', 'Converted', 'Closed'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

const ContactLead = mongoose.model('ContactLead', contactLeadSchema);
export default ContactLead;
