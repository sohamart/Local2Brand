import { useState, useEffect, useCallback } from 'react';
import oneSignalService from '../services/oneSignal';
import { toast } from 'react-toastify';

/**
 * Custom React Hook for OneSignal Web Push Notifications
 */
export function useOneSignal() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkStatus = useCallback(async () => {
    const supported = oneSignalService.isPushSupported();
    setIsSupported(supported);

    if (!supported) {
      setIsLoading(false);
      return;
    }

    const currentPerm = oneSignalService.getPermission();
    setPermission(currentPerm);

    if (currentPerm === 'granted') {
      const subscribed = await oneSignalService.isSubscribed();
      setIsSubscribed(subscribed);
    } else {
      setIsSubscribed(false);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Initialize OneSignal
    oneSignalService.init().then(() => {
      checkStatus();
    });

    const unsubscribe = oneSignalService.subscribeListener(() => {
      checkStatus();
    });

    // Also check on visibility change (e.g. if user altered browser site settings in another tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkStatus]);

  const requestPermission = async () => {
    if (!isSupported) {
      toast.warn('Push notifications are not supported on your browser or device.');
      return false;
    }

    setIsLoading(true);
    try {
      const res = await oneSignalService.requestPermission();
      await checkStatus();

      if (res.permission === 'granted') {
        toast.success('🎉 Push notifications enabled! You will stay updated with live orders & updates.');
        return true;
      } else if (res.permission === 'denied') {
        toast.info('Notifications are blocked in your browser settings. You can enable them from the lock icon in the URL bar.');
        return false;
      }
      return false;
    } catch (err) {
      console.warn('Permission request error:', err);
      toast.error(err.message || 'Failed to request notification permission');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const optOut = async () => {
    setIsLoading(true);
    try {
      await oneSignalService.optOut();
      await checkStatus();
      toast.info('You have muted push notifications.');
      return true;
    } catch (err) {
      toast.error('Failed to update notification preferences.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggle = async () => {
    if (isSubscribed) {
      return optOut();
    } else {
      return requestPermission();
    }
  };

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    requestPermission,
    optOut,
    toggle,
    checkStatus,
  };
}

export default useOneSignal;
