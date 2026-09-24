import { cloudinaryProvider } from './providers/cloudinaryProvider.js';
import { imagekitProvider } from './providers/imagekitProvider.js';
import { objectStorageProvider } from './providers/objectStorageProvider.js';
import { localProvider } from './providers/localProvider.js';
import { providerState } from './providerState.js';

class ProviderRegistry {
  constructor() {
    this.providers = new Map();
    this.registerDefaults();
  }

  registerDefaults() {
    this.register(cloudinaryProvider);
    this.register(imagekitProvider);
    this.register(objectStorageProvider);
    this.register(localProvider);
  }

  register(provider) {
    this.providers.set(provider.name, provider);
    providerState.initProvider(provider.name, provider.isConfigured());
  }

  get(name) {
    return this.providers.get(name);
  }

  getAll() {
    return Array.from(this.providers.values());
  }

  /**
   * Get configured providers ordered by priority:
   * 1. Cloudinary (PRIMARY)
   * 2. ImageKit.io (AUTOMATIC FAILOVER)
   */
  getOrderedProviders() {
    const customOrderStr = process.env.STORAGE_PROVIDER_ORDER || 'cloudinary,imagekit';
    const orderList = customOrderStr.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

    const ordered = [];

    for (const name of orderList) {
      const provider = this.providers.get(name);
      if (provider) {
        ordered.push(provider);
      }
    }

    for (const [name, provider] of this.providers.entries()) {
      if (!ordered.includes(provider)) {
        ordered.push(provider);
      }
    }

    return ordered;
  }
}

export const providerRegistry = new ProviderRegistry();
export default providerRegistry;
