/**
 * In-Memory Multi-Cloud Provider State & Circuit Breaker Manager
 * Tracks operational health states:
 * - HEALTHY: Operational and responding without errors
 * - DEGRADED: Encountered 1-4 errors; still participating with warning
 * - DOWN: Hit failure threshold (default: 5 consecutive failures); temporarily skipped
 * - NOT_CONFIGURED: Missing required API keys or environment variables
 * - DISABLED: Intentionally deactivated by configuration
 */

export const PROVIDER_STATES = {
  HEALTHY: 'HEALTHY',
  DEGRADED: 'DEGRADED',
  DOWN: 'DOWN',
  NOT_CONFIGURED: 'NOT_CONFIGURED',
  DISABLED: 'DISABLED',
};

class ProviderStateManager {
  constructor() {
    this.states = new Map();
    this.failureThreshold = parseInt(process.env.STORAGE_CIRCUIT_BREAKER_THRESHOLD || '5', 10);
    this.recoveryCheckIntervalMs = parseInt(process.env.STORAGE_RECOVERY_CHECK_INTERVAL || '300000', 10); // 5 mins
  }

  /**
   * Initialize state for a provider
   */
  initProvider(name, isConfigured) {
    if (!this.states.has(name)) {
      this.states.set(name, {
        name,
        isConfigured,
        status: isConfigured ? PROVIDER_STATES.HEALTHY : PROVIDER_STATES.NOT_CONFIGURED,
        consecutiveFailures: 0,
        consecutiveSuccesses: 0,
        lastSuccessAt: isConfigured ? new Date() : null,
        lastFailureAt: null,
        lastCheckedAt: new Date(),
        lastError: null,
        latencyMs: 0,
        totalUploads: 0,
        totalFailures: 0,
        totalBytesUploaded: 0,
      });
    } else {
      const existing = this.states.get(name);
      existing.isConfigured = isConfigured;
      if (!isConfigured) {
        existing.status = PROVIDER_STATES.NOT_CONFIGURED;
      }
    }
  }

  /**
   * Get live state of a provider
   */
  getState(name) {
    return this.states.get(name) || {
      name,
      isConfigured: false,
      status: PROVIDER_STATES.NOT_CONFIGURED,
      consecutiveFailures: 0,
      lastError: 'Provider not initialized',
    };
  }

  /**
   * Get all provider states as an array
   */
  getAllStates() {
    return Array.from(this.states.values());
  }

  /**
   * Record a successful operation (upload / ping)
   */
  recordSuccess(name, { latencyMs = 0, bytesUploaded = 0 } = {}) {
    const state = this.states.get(name);
    if (!state) return;

    state.consecutiveFailures = 0;
    state.consecutiveSuccesses += 1;
    state.lastSuccessAt = new Date();
    state.lastCheckedAt = new Date();
    state.latencyMs = latencyMs;
    state.totalUploads += 1;
    state.totalBytesUploaded += bytesUploaded;

    // Automatic recovery transition from DEGRADED or DOWN to HEALTHY
    if (state.status === PROVIDER_STATES.DEGRADED || state.status === PROVIDER_STATES.DOWN) {
      const prevStatus = state.status;
      state.status = PROVIDER_STATES.HEALTHY;
      state.lastError = null;
      console.log(`✨ [Storage Hub] Provider '${name}' RECOVERED from ${prevStatus} to HEALTHY!`);
    }
  }

  /**
   * Record a failure (upload error, 401, 403, 408, 429, 500, 503, timeout, etc.)
   */
  recordFailure(name, error) {
    const state = this.states.get(name);
    if (!state) return;

    state.consecutiveFailures += 1;
    state.consecutiveSuccesses = 0;
    state.lastFailureAt = new Date();
    state.lastCheckedAt = new Date();
    state.totalFailures += 1;

    const errMsg = error?.message || error?.error?.message || String(error || 'Unknown error');
    state.lastError = errMsg;

    // Circuit Breaker logic
    if (state.consecutiveFailures >= this.failureThreshold) {
      if (state.status !== PROVIDER_STATES.DOWN) {
        state.status = PROVIDER_STATES.DOWN;
        console.warn(`🚨 [Storage Hub] Circuit Breaker: Provider '${name}' reached ${state.consecutiveFailures} consecutive failures and is marked DOWN!`);
      }
    } else {
      if (state.status === PROVIDER_STATES.HEALTHY) {
        state.status = PROVIDER_STATES.DEGRADED;
        console.warn(`⚠️ [Storage Hub] Provider '${name}' encountered an error (${errMsg}) and is marked DEGRADED.`);
      }
    }
  }

  /**
   * Check if a provider is eligible to accept an upload request
   */
  isEligibleForUpload(name) {
    const state = this.states.get(name);
    if (!state || !state.isConfigured) return false;
    return state.status === PROVIDER_STATES.HEALTHY || state.status === PROVIDER_STATES.DEGRADED;
  }
}

export const providerState = new ProviderStateManager();
export default providerState;
