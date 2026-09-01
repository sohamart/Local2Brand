import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

// Generate unique per-tab ID in memory
const getTabId = () => {
  if (typeof window === 'undefined') return 'server';
  if (!window.__L2B_TAB_ID__) {
    window.__L2B_TAB_ID__ = 'tab_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
  }
  return window.__L2B_TAB_ID__;
};

export default function useLivePresence() {
  const location = useLocation();
  const hasSentInitialView = useRef(false);

  useEffect(() => {
    const tabId = getTabId();
    const currentPath = location.pathname || '/';

    // 1. Send pageview once per session/navigation
    if (!hasSentInitialView.current) {
      hasSentInitialView.current = true;
      try {
        api.post('/telemetry/view', { tabId, path: currentPath }).catch(() => {});
      } catch (e) {}
    }

    // 2. High-Frequency Real-Time Heartbeat (Every 4 seconds)
    const sendHeartbeat = () => {
      try {
        api.post('/telemetry/heartbeat', { tabId, path: currentPath }).catch(() => {});
      } catch (e) {}
    };

    sendHeartbeat();
    const heartbeatTimer = setInterval(sendHeartbeat, 4000);

    // 3. Instant ping when tab becomes visible or focused
    const handleFocusOrVisibility = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    };

    window.addEventListener('focus', handleFocusOrVisibility);
    window.addEventListener('visibilitychange', handleFocusOrVisibility);

    // 4. Instant Unload Beacon on Tab/Window Close
    const handleUnload = () => {
      try {
        const payload = JSON.stringify({ tabId });
        if (navigator.sendBeacon) {
          const baseUrl = api.baseUrl || 'http://localhost:5000/api';
          navigator.sendBeacon(`${baseUrl}/telemetry/leave`, payload);
        } else {
          api.post('/telemetry/leave', { tabId }).catch(() => {});
        }
      } catch (e) {}
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      clearInterval(heartbeatTimer);
      window.removeEventListener('focus', handleFocusOrVisibility);
      window.removeEventListener('visibilitychange', handleFocusOrVisibility);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, [location.pathname]);
}
