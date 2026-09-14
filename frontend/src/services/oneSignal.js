/**
 * OneSignal Web Push Service (Disabled as requested)
 */

class OneSignalService {
  constructor() {
    this.isInitialized = false;
  }

  isPushSupported() {
    return false;
  }

  async init() {
    return false;
  }

  getPermission() {
    return 'default';
  }

  async isSubscribed() {
    return false;
  }

  async requestPermission() {
    return { success: false, message: 'Push notifications are disabled.' };
  }

  async optIn() {
    return false;
  }

  async optOut() {
    return false;
  }

  syncUser() {}

  clearUser() {}

  subscribeListener() {
    return () => {};
  }

  notifyListeners() {}
}

export const oneSignalService = new OneSignalService();
export default oneSignalService;
