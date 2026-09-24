import mongoose from 'mongoose';

/**
 * StorageEvent Telemetry Schema
 * Stores auditable logs for multi-cloud upload, failover, recovery, replication, and migration events.
 */
const storageEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: [
        'UPLOAD_SUCCESS',
        'UPLOAD_FAILED',
        'FAILOVER_TRIGGERED',
        'PROVIDER_DEGRADED',
        'PROVIDER_DOWN',
        'PROVIDER_RECOVERED',
        'DELETE_SUCCESS',
        'DELETE_FAILED',
        'REPLICATION_SUCCESS',
        'REPLICATION_FAILED',
        'MIGRATION_STARTED',
        'MIGRATION_COMPLETED',
        'MIGRATION_FAILED',
      ],
      index: true,
    },
    provider: {
      type: String,
      required: true,
      index: true,
    },
    targetProvider: {
      type: String,
      default: null,
    },
    mediaUrl: {
      type: String,
      default: null,
    },
    publicId: {
      type: String,
      default: null,
    },
    resourceType: {
      type: String,
      enum: ['image', 'video', 'raw', 'auto', 'unknown'],
      default: 'auto',
    },
    fileSizeBytes: {
      type: Number,
      default: 0,
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    success: {
      type: Boolean,
      required: true,
      default: true,
    },
    message: {
      type: String,
      default: '',
    },
    errorDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast real-time telemetry queries in Admin panel
storageEventSchema.index({ createdAt: -1 });
storageEventSchema.index({ eventType: 1, createdAt: -1 });
storageEventSchema.index({ provider: 1, createdAt: -1 });

export const StorageEvent = mongoose.models.StorageEvent || mongoose.model('StorageEvent', storageEventSchema);
export default StorageEvent;
