import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null with recipientRole='admin' means broadcast to all admins
    },
    recipientEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    recipientRole: {
      type: String,
      enum: ['admin', 'user', 'all'],
      default: 'user',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['lead', 'callback', 'requirement', 'order', 'user', 'status', 'broadcast', 'system'],
      default: 'system',
    },
    category: {
      type: String,
      default: 'General',
    },
    link: {
      type: String,
      default: '',
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    emailHtml: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ['high', 'normal', 'low'],
      default: 'normal',
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipientRole: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipientEmail: 1, createdAt: -1 });

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
