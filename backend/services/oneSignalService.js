/**
 * OneSignal Web Push Service (Disabled as requested)
 * All operations safely return success without dispatching external requests.
 */

class OneSignalBackendService {
  isConfigured() {
    return false;
  }

  getCredentials() {
    return { appId: '', apiKey: '', isConfigured: false, disabled: true };
  }

  async sendPushNotification() {
    return { success: true, disabled: true, note: 'OneSignal push is currently disabled.' };
  }

  async broadcastPushNotification() {
    return { success: true, disabled: true, note: 'OneSignal push is currently disabled.' };
  }

  async sendNotificationToAdmins() {
    return { success: true, disabled: true, note: 'OneSignal push is currently disabled.' };
  }

  async sendNotificationToUser() {
    return { success: true, disabled: true, note: 'OneSignal push is currently disabled.' };
  }
}

export const oneSignalBackend = new OneSignalBackendService();
export default oneSignalBackend;
