import mongoose from 'mongoose';
import StorageEvent from '../../models/StorageEvent.js';

class StorageLogger {
  /**
   * Asynchronously log storage event to MongoDB without blocking request execution
   */
  async logEvent(eventData) {
    try {
      if (mongoose.connection?.readyState !== 1) {
        return; // Skip logging if MongoDB is not connected to avoid buffering delays
      }

      // Normalize eventType aliases to standardized enum
      let eventType = eventData.eventType;
      if (eventType === 'UPLOAD_FAIL') eventType = 'UPLOAD_FAILED';
      if (eventType === 'FAILOVER') eventType = 'FAILOVER_TRIGGERED';
      if (eventType === 'DELETE_FAIL') eventType = 'DELETE_FAILED';
      if (eventType === 'REPLICATION_FAIL') eventType = 'REPLICATION_FAILED';
      if (eventType === 'MIGRATION_PROGRESS') eventType = 'MIGRATION_STARTED';

      const entry = new StorageEvent({
        ...eventData,
        eventType,
      });
      entry.save().catch((err) => {
        // Silently handled non-blocking logger notice
      });
    } catch (err) {
      // Silently handled non-blocking logger notice
    }
  }

  /**
   * Fetch recent audit trail of storage events
   */
  async getRecentEvents(limit = 50) {
    try {
      return await StorageEvent.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    } catch (err) {
      console.error('Error fetching storage events:', err.message);
      return [];
    }
  }
}

export const storageLogger = new StorageLogger();
export default storageLogger;
