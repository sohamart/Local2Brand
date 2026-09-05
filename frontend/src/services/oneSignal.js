/**
 * OneSignal Web Push Notification Service (v16 SDK)
 * Handles client initialization, user identity sync, and push subscription lifecycle.
 */

class OneSignalService {
  constructor() {
    this.appId = import.meta.env.VITE_ONESIGNAL_APP_ID || '';
    this.isInitialized = false;
    this.initPromise = null;
    this.listeners = new Set();
  }

  /**
   * Check if push notifications and service workers are supported in the current environment
   */
  isPushSupported() {
    if (typeof window === 'undefined') return false;
    return Boolean(
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  }

  /**
   * Initialize OneSignal Web SDK
   */
  async init() {
    if (typeof window === 'undefined') return false;
    if (this.isInitialized) return true;
    if (this.initPromise) return this.initPromise;

    if (!this.appId) {
      console.warn('ℹ️ OneSignal Notice: VITE_ONESIGNAL_APP_ID is not configured in environment variables.');
      return false;
    }

    if (!this.isPushSupported()) {
      console.warn('ℹ️ OneSignal Notice: Push notifications are not supported on this browser.');
      return false;
    }

    this.initPromise = new Promise((resolve) => {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          await OneSignal.init({
            appId: this.appId,
            serviceWorkerParam: { scope: '/' },
            serviceWorkerPath: '/OneSignalSDKWorker.js',
            serviceWorkerUpdaterPath: '/OneSignalSDKWorker.js',
            allowLocalhostAsSecureOrigin: true,
            notifyButton: {
              enable: false, // We use our custom Apple-grade UI toggle & bell
            },
            promptOptions: {
              slidedown: {
                prompts: [
                  {
                    type: 'push',
                    autoPrompt: true,
                    text: {
                      actionMessage: "Get instant real-time notifications for order milestones, blueprints, and offers from LOCAL2BRAND.",
                      acceptButton: 'Allow Notifications',
                      cancelButton: 'Later',
                    },
                    delay: {
                      pageViews: 1,
                      timeDelay: 2,
                    },
                  },
                ],
              },
            },
          });

          this.isInitialized = true;
          console.log('✅ OneSignal Web Push SDK Initialized');

          // Ensure worker is fully updated and active on older mobile browsers
          if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((reg) => {
              reg.update().catch(() => {});
            }).catch(() => {});
          }

          // Ensure token refresh and active optIn if permission was already granted in browser
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            try {
              if (OneSignal.User?.PushSubscription?.optIn) {
                OneSignal.User.PushSubscription.optIn().catch(() => {});
              }
            } catch (e) {}
          } else if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            // Fresh prompt for all unprompted / previous visitors
            setTimeout(() => {
              try {
                if (OneSignal.Slidedown?.promptPush) {
                  OneSignal.Slidedown.promptPush({ force: true }).catch(() => {});
                }
              } catch (e) {}
            }, 800);
          }

          // Listen to push subscription changes
          if (OneSignal.User?.PushSubscription?.addEventListener) {
            OneSignal.User.PushSubscription.addEventListener('change', (event) => {
              this.notifyListeners({
                type: 'subscriptionChange',
                optedIn: event?.current?.optedIn,
                id: event?.current?.id,
              });
            });
          }

          // Listen to permission changes
          if (OneSignal.Notifications?.addEventListener) {
            OneSignal.Notifications.addEventListener('permissionChange', (permission) => {
              this.notifyListeners({
                type: 'permissionChange',
                permission,
              });
            });
          }

          resolve(true);
        } catch (err) {
          console.warn('OneSignal initialization notice:', err.message);
          resolve(false);
        }
      });
    });

    return this.initPromise;
  }

  /**
   * Get current notification permission ('default', 'granted', 'denied')
   */
  getPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
    return Notification.permission;
  }

  /**
   * Check if user is actively subscribed and opted in
   */
  async isSubscribed() {
    if (!this.isPushSupported()) return false;
    if (typeof window === 'undefined') return false;

    if (Notification.permission !== 'granted') return false;

    try {
      if (localStorage.getItem('l2b_push_muted') === 'true') {
        return false;
      }
    } catch (e) {}

    return new Promise((resolve) => {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push((OneSignal) => {
        try {
          const pushSub = OneSignal.User?.PushSubscription;
          if (pushSub && typeof pushSub.optedIn === 'boolean') {
            resolve(pushSub.optedIn);
            return;
          }
          resolve(Notification.permission === 'granted');
        } catch (e) {
          resolve(Notification.permission === 'granted');
        }
      });
    });
  }

  /**
   * Request native browser permission and opt in to push
   */
  async requestPermission() {
    if (!this.isPushSupported()) {
      throw new Error('Push notifications are not supported on this browser or device.');
    }

    await this.init();

    return new Promise((resolve, reject) => {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          // Request notification permission
          if (OneSignal.Notifications?.requestPermission) {
            await OneSignal.Notifications.requestPermission();
          } else if (Notification.requestPermission) {
            await Notification.requestPermission();
          }

          const currentPerm = Notification.permission;

          if (currentPerm === 'granted') {
            if (OneSignal.User?.PushSubscription?.optIn) {
              await OneSignal.User.PushSubscription.optIn();
            }
            try { localStorage.removeItem('l2b_push_muted'); } catch (e) {}

            // Auto sync cached user if available
            try {
              const cached = localStorage.getItem('l2b_cached_user');
              if (cached) {
                this.syncUser(JSON.parse(cached));
              }
            } catch (e) {}

            this.notifyListeners({ type: 'permissionGranted', isSubscribed: true });
            resolve({ success: true, permission: 'granted' });
          } else if (currentPerm === 'denied') {
            resolve({ success: false, permission: 'denied', message: 'Notification permission was blocked in browser settings.' });
          } else {
            resolve({ success: false, permission: currentPerm });
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Opt in / Unmute push notifications
   */
  async optIn() {
    if (typeof window === 'undefined') return;

    return new Promise((resolve) => {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          if (OneSignal.User?.PushSubscription?.optIn) {
            await OneSignal.User.PushSubscription.optIn();
          }
          try { localStorage.removeItem('l2b_push_muted'); } catch (e) {}
          this.notifyListeners({ type: 'optIn', isSubscribed: true });
          resolve(true);
        } catch (e) {
          console.warn('OneSignal optIn error:', e);
          resolve(false);
        }
      });
    });
  }

  /**
   * Opt out / Mute push notifications
   */
  async optOut() {
    if (typeof window === 'undefined') return;

    return new Promise((resolve) => {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          if (OneSignal.User?.PushSubscription?.optOut) {
            await OneSignal.User.PushSubscription.optOut();
          }
          try { localStorage.setItem('l2b_push_muted', 'true'); } catch (e) {}
          this.notifyListeners({ type: 'optOut', isSubscribed: false });
          resolve(true);
        } catch (e) {
          console.warn('OneSignal optOut error:', e);
          resolve(false);
        }
      });
    });
  }

  /**
   * Associate authenticated user identity with OneSignal
   * Prevents duplicates and enables targeted backend notifications
   */
  syncUser(user) {
    if (!user || (!user._id && !user.id)) return;
    if (typeof window === 'undefined') return;

    const externalId = String(user._id || user.id);

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        if (OneSignal.login) {
          await OneSignal.login(externalId);
        }

        const tags = {
          userId: externalId,
          role: user.role || 'client',
        };

        if (user.email) {
          tags.email = user.email.toLowerCase().trim();
          if (OneSignal.User?.addEmail) {
            OneSignal.User.addEmail(user.email).catch(() => {});
          }
        }

        if (user.name) {
          tags.name = user.name;
        }

        // Add tags using v16 bulk method
        if (OneSignal.User?.addTags) {
          await OneSignal.User.addTags(tags);
        } else if (OneSignal.User?.addTag) {
          for (const [k, v] of Object.entries(tags)) {
            OneSignal.User.addTag(k, v);
          }
        }
      } catch (err) {
        console.warn('OneSignal user sync notice:', err.message);
      }
    });
  }

  /**
   * Clear user association on logout
   */
  clearUser() {
    if (typeof window === 'undefined') return;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        if (OneSignal.User?.removeTags) {
          await OneSignal.User.removeTags(['role', 'userId', 'email', 'name']).catch(() => {});
        }
        if (OneSignal.logout) {
          await OneSignal.logout().catch(() => {});
        }
      } catch (e) {
        console.warn('OneSignal clearUser notice:', e);
      }
    });
  }

  /**
   * Subscribe to lifecycle changes
   */
  subscribeListener(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notifyListeners(data) {
    this.listeners.forEach((fn) => {
      try {
        fn(data);
      } catch (e) {}
    });
  }
}

export const oneSignalService = new OneSignalService();
export default oneSignalService;
