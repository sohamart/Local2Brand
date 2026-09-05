import mongoose from 'mongoose';

const RequirementSchema = new mongoose.Schema({
  requirementId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  formVersion: {
    type: String,
    default: '1.0'
  },
  websiteType: {
    type: String,
    default: 'Custom Website'
  },
  websiteTypeName: {
    type: String,
    default: 'Custom Website Project'
  },
  clientInfo: {
    businessName: { type: String, default: 'Custom Business Project' },
    ownerName: { type: String, default: 'Client' },
    contactPerson: { type: String, default: 'Client' },
    mobile: { type: String, default: 'Not Provided' },
    email: { type: String, default: 'customer@local2brand.com' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },
    pincode: { type: String, default: '' },
    existingWebsite: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    otherSocialUrls: [{ type: String }],
    hasLogo: { type: mongoose.Schema.Types.Mixed, default: 'no' },
    logoUrl: { type: String, default: '' },
    contentReady: { type: mongoose.Schema.Types.Mixed, default: 'partially' }
  },
  answers: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  selectedPages: [{ type: String }],
  selectedFeatures: [{ type: String }],
  paymentMethods: [{ type: String }],
  orderMethods: [{ type: String }],
  adminFeatures: [{ type: String }],
  adminPanelType: { type: String, default: 'Basic' },
  whatsappIntegration: { type: mongoose.Schema.Types.Mixed, default: false },
  whatsappOptions: [{ type: String }],
  whatsappNumber: { type: String, default: '' },
  emailIntegration: { type: mongoose.Schema.Types.Mixed, default: false },
  emailOptions: [{ type: String }],
  designStyle: { type: String, default: 'Modern Glassmorphic' },
  preferredColors: [{ type: String }],
  referenceWebsites: [{ type: String }],
  domainStatus: { type: String, default: 'Need help choosing' },
  domainName: { type: String, default: '' },
  hostingStatus: { type: String, default: 'Need hosting' },
  extraServices: [{ type: String }],
  budget: { type: String, default: '₹10,000 – ₹25,000' },
  timeline: { type: String, default: '⚡ Express (48 - 72 Hours)' },
  projectPriority: { type: String, default: 'Normal' },
  additionalNotes: { type: String, default: '' },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: [
      'Draft',
      'Submitted',
      'Under Review',
      'Quotation Sent',
      'Approved',
      'In Development',
      'Completed',
      'Cancelled',
      'Rejected'
    ],
    default: 'Submitted'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  deletionReason: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  internalNotes: {
    type: String,
    default: ''
  },
  quotedAmount: {
    type: String,
    default: ''
  },
  assignedAdmin: {
    type: String,
    default: ''
  },
  businessDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  images: [{ type: String }],
  uploadedImages: [{ type: String }],
  aiExecutiveSummary: {
    type: String,
    default: ''
  },
  couponCode: {
    type: String,
    default: ''
  },
  discountPercent: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true, strict: false });

export default mongoose.models.Requirement || mongoose.model('Requirement', RequirementSchema);
