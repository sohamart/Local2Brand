import { providerRegistry } from './providerRegistry.js';
import { providerState, PROVIDER_STATES } from './providerState.js';
import { storageLogger } from './storageLogger.js';

class StorageHub {
  constructor() {
    this.replicationEnabled = process.env.STORAGE_REPLICATION_ENABLED === 'true';
  }

  /**
   * Determine the storage provider responsible for a given URL or identifier
   */
  detectProviderFromUrl(urlOrId) {
    if (!urlOrId || typeof urlOrId !== 'string') return 'unknown';

    if (urlOrId.includes('res.cloudinary.com') || urlOrId.includes('cloudinary.com')) {
      return 'cloudinary';
    }
    if (urlOrId.includes('ik.imagekit.io') || urlOrId.includes('imagekit.io')) {
      return 'imagekit';
    }
    const s3Endpoint = process.env.OBJECT_STORAGE_ENDPOINT || '';
    const publicDomain = process.env.OBJECT_STORAGE_PUBLIC_DOMAIN || '';
    const bucket = process.env.OBJECT_STORAGE_BUCKET || '';

    if (
      (s3Endpoint && urlOrId.includes(s3Endpoint)) ||
      (publicDomain && urlOrId.includes(publicDomain)) ||
      (bucket && urlOrId.includes(bucket)) ||
      urlOrId.includes('.s3.') ||
      urlOrId.includes('s3.amazonaws.com') ||
      urlOrId.includes('.r2.dev') ||
      urlOrId.includes('.r2.cloudflarestorage.com')
    ) {
      return 'objectStorage';
    }
    if (urlOrId.includes('firebasestorage.googleapis.com') || urlOrId.includes('firebase')) {
      return 'firebase';
    }
    if (urlOrId.includes('/uploads/') || urlOrId.startsWith('uploads/')) {
      return 'local';
    }

    return 'unknown';
  }

  /**
   * Master Upload with Waterfall Automatic Failover
   * Iterates through providers in prioritized order:
   * 1. Cloudinary (Primary)
   * 2. ImageKit (First Failover)
   * 3. Object Storage (Second Failover)
   * 4. Local Filesystem (Development Only)
   */
  async uploadWithFailover(fileInput, options = {}) {
    const orderedProviders = providerRegistry.getOrderedProviders();
    const attempts = [];
    let successfulResult = null;

    for (let i = 0; i < orderedProviders.length; i++) {
      const provider = orderedProviders[i];

      // Check if provider is configured and not circuit-broken DOWN
      if (!provider.isConfigured()) {
        continue;
      }

      const currentState = providerState.getState(provider.name);
      if (currentState.status === PROVIDER_STATES.DOWN) {
        console.log(`⏩ [Storage Hub] Skipping provider '${provider.name}' (Status: DOWN via Circuit Breaker)`);
        continue;
      }

      const startTime = Date.now();

      try {
        console.log(`🚀 [Storage Hub] Uploading via provider: '${provider.name}'...`);
        const result = await provider.upload(fileInput, options);
        const durationMs = Date.now() - startTime;

        providerState.recordSuccess(provider.name, {
          latencyMs: durationMs,
          bytesUploaded: result.bytes || 0,
        });

        // Check if this was a failover from an earlier failed provider
        if (i > 0 && attempts.length > 0) {
          const failedProvider = attempts[attempts.length - 1].provider;
          await storageLogger.logEvent({
            eventType: 'FAILOVER_TRIGGERED',
            provider: failedProvider,
            targetProvider: provider.name,
            mediaUrl: result.url,
            publicId: result.publicId || result.key || '',
            resourceType: result.resourceType || 'auto',
            fileSizeBytes: result.bytes || 0,
            durationMs,
            success: true,
            message: `Automatic Failover: Upload failed on '${failedProvider}' and succeeded on '${provider.name}'`,
          });
        } else {
          await storageLogger.logEvent({
            eventType: 'UPLOAD_SUCCESS',
            provider: provider.name,
            mediaUrl: result.url,
            publicId: result.publicId || result.key || '',
            resourceType: result.resourceType || 'auto',
            fileSizeBytes: result.bytes || 0,
            durationMs,
            success: true,
            message: `Uploaded successfully via '${provider.name}'`,
          });
        }

        successfulResult = {
          ...result,
          storage: {
            provider: provider.name,
            assetId: result.publicId || result.key || result.name || '',
            storageKey: result.key || result.publicId || '',
            mimeType: options.mimeType || '',
            size: result.bytes || 0,
            uploadedAt: new Date().toISOString(),
            isReplica: false,
          },
        };

        // Trigger optional asynchronous background replication
        if (this.replicationEnabled) {
          this.replicateInBackground(fileInput, options, provider.name, successfulResult);
        }

        return successfulResult;
      } catch (err) {
        const durationMs = Date.now() - startTime;
        const errMsg = err?.message || err?.error?.message || String(err);
        console.warn(`⚠️ [Storage Hub] Upload failed on '${provider.name}': ${errMsg}`);

        providerState.recordFailure(provider.name, err);
        attempts.push({ provider: provider.name, error: errMsg, durationMs });

        await storageLogger.logEvent({
          eventType: 'UPLOAD_FAILED',
          provider: provider.name,
          durationMs,
          success: false,
          message: `Upload failed on '${provider.name}': ${errMsg}`,
          errorDetails: err,
        });
      }
    }

    // If all configured providers fail, throw controlled error
    throw new Error(
      `Controlled Upload Error: All configured storage providers failed. Attempts: ${attempts.map((a) => `${a.provider} (${a.error})`).join('; ')}`
    );
  }

  /**
   * Optional Background Replication to Secondary Persistent Providers
   * Never blocks or fails the original primary upload request.
   */
  async replicateInBackground(fileInput, options, primaryProviderName, primaryResult) {
    try {
      // Find eligible secondary persistent provider (excluding local storage)
      const backupProviders = providerRegistry
        .getOrderedProviders()
        .filter((p) => p.name !== primaryProviderName && p.name !== 'local' && p.isConfigured() && providerState.isEligibleForUpload(p.name));

      if (backupProviders.length === 0) return;

      const backupProvider = backupProviders[0];
      const start = Date.now();

      try {
        const replicaRes = await backupProvider.upload(fileInput, { ...options, isBackup: true });
        await storageLogger.logEvent({
          eventType: 'REPLICATION_SUCCESS',
          provider: primaryProviderName,
          targetProvider: backupProvider.name,
          mediaUrl: replicaRes.url,
          durationMs: Date.now() - start,
          success: true,
          message: `Replicated asset from '${primaryProviderName}' to '${backupProvider.name}'`,
        });
      } catch (repErr) {
        await storageLogger.logEvent({
          eventType: 'REPLICATION_FAILED',
          provider: primaryProviderName,
          targetProvider: backupProvider.name,
          durationMs: Date.now() - start,
          success: false,
          message: `Replication failed to '${backupProvider.name}': ${repErr.message}`,
          errorDetails: repErr,
        });
      }
    } catch (e) {
      // Non-blocking
    }
  }

  /**
   * Delete media asset from whichever provider hosts it
   */
  async deleteMedia(urlOrId, options = {}) {
    if (!urlOrId || typeof urlOrId !== 'string') {
      return { success: false, message: 'Invalid URL or public_id' };
    }

    const providerName = options.provider || this.detectProviderFromUrl(urlOrId);
    const provider = providerRegistry.get(providerName);

    if (provider && provider.isConfigured()) {
      try {
        const res = await provider.delete(urlOrId, options);
        await storageLogger.logEvent({
          eventType: 'DELETE_SUCCESS',
          provider: providerName,
          mediaUrl: urlOrId,
          success: true,
          message: `Deleted media from '${providerName}'`,
        });
        return res;
      } catch (err) {
        await storageLogger.logEvent({
          eventType: 'DELETE_FAILED',
          provider: providerName,
          mediaUrl: urlOrId,
          success: false,
          message: `Delete error on '${providerName}': ${err.message}`,
          errorDetails: err,
        });
        return { success: false, provider: providerName, error: err.message };
      }
    }

    return { success: false, message: `No active provider found for ${urlOrId}` };
  }

  /**
   * Aggregate live telemetry & metrics across all providers for Admin Dashboard
   * No fake combined free storage totals are computed.
   */
  async getAllProviderUsage() {
    const providers = providerRegistry.getAll();
    const usagePromises = providers.map(async (p) => {
      const state = providerState.getState(p.name);
      try {
        const usage = await p.getUsage();
        return {
          name: p.name,
          configured: p.isConfigured(),
          status: state.status,
          latencyMs: state.latencyMs,
          consecutiveFailures: state.consecutiveFailures,
          lastSuccessAt: state.lastSuccessAt,
          lastFailureAt: state.lastFailureAt,
          lastError: state.lastError,
          ...usage,
        };
      } catch (err) {
        return {
          name: p.name,
          configured: p.isConfigured(),
          status: state.status,
          error: err.message,
        };
      }
    });

    const results = await Promise.all(usagePromises);
    const configuredCount = results.filter((r) => r.configured).length;
    const healthyCount = results.filter((r) => r.status === PROVIDER_STATES.HEALTHY).length;

    // Check if failover is currently active (i.e. primary is degraded/down and secondary is active)
    const primaryState = providerState.getState('cloudinary');
    const isFailoverActive = primaryState.status === PROVIDER_STATES.DEGRADED || primaryState.status === PROVIDER_STATES.DOWN;

    const recentEvents = await storageLogger.getRecentEvents(40);

    return {
      providers: results,
      totalConfigured: configuredCount,
      totalHealthy: healthyCount,
      isFailoverActive,
      replicationEnabled: this.replicationEnabled,
      recentEvents,
    };
  }
}

export const storageHub = new StorageHub();
export default storageHub;
