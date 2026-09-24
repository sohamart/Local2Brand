import { providerRegistry } from './providerRegistry.js';
import { providerState, PROVIDER_STATES } from './providerState.js';
import { storageLogger } from './storageLogger.js';

class StorageHealthMonitor {
  constructor() {
    this.intervalHandle = null;
    this.checkIntervalMs = parseInt(process.env.STORAGE_RECOVERY_CHECK_INTERVAL || '300000', 10); // 5 mins
  }

  /**
   * Start the periodic background health checker
   */
  start() {
    if (this.intervalHandle) return;

    console.log(`🩺 [Storage Hub] Health Monitor started (Interval: ${this.checkIntervalMs / 1000}s)`);

    // Run initial lightweight probe shortly after start
    setTimeout(() => {
      this.probeAll();
    }, 5000);

    this.intervalHandle = setInterval(() => {
      this.probeAll();
    }, this.checkIntervalMs);
  }

  stop() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  /**
   * Probe all configured providers
   */
  async probeAll() {
    const providers = providerRegistry.getAll();
    for (const p of providers) {
      if (!p.isConfigured()) {
        providerState.initProvider(p.name, false);
        continue;
      }

      try {
        const start = Date.now();
        const check = await p.healthCheck();
        const duration = Date.now() - start;

        if (check.healthy) {
          const prevState = providerState.getState(p.name)?.status;
          providerState.recordSuccess(p.name, { latencyMs: duration });

          if (prevState === PROVIDER_STATES.DEGRADED || prevState === PROVIDER_STATES.DOWN) {
            storageLogger.logEvent({
              eventType: 'PROVIDER_RECOVERED',
              provider: p.name,
              durationMs: duration,
              success: true,
              message: `Provider '${p.name}' passed health check and recovered to HEALTHY`,
            });
          }
        } else {
          providerState.recordFailure(p.name, check.error || 'Health check failed');
        }
      } catch (err) {
        providerState.recordFailure(p.name, err);
      }
    }
  }
}

export const storageHealth = new StorageHealthMonitor();
export default storageHealth;
