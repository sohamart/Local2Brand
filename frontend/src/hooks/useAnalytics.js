import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrCreateVisitorId, getDeviceInfo } from '../utils/analytics';
import api from '../services/api';

export default function useAnalytics() {
  const location = useLocation();
  const { user } = useAuth();
  const lastTrackedPathRef = useRef(null);

  useEffect(() => {
    const currentPath = location.pathname || '/';
    const visitorId = getOrCreateVisitorId();
    const { device, browser, os } = getDeviceInfo();
    const referrer = document.referrer || '';
    const title = document.title || 'LOCAL2BRAND';

    const payload = {
      visitorId,
      userId: user?.id || user?._id || null,
      userName: user?.name || '',
      userEmail: user?.email || '',
      page: currentPath,
      title,
      referrer,
      device,
      browser,
      os,
    };

    // 1. Record Page View ONLY on actual path change (Never on component re-render)
    if (lastTrackedPathRef.current !== currentPath) {
      lastTrackedPathRef.current = currentPath;
      try {
        api.post('/analytics/track-view', payload).catch(() => {});
      } catch (e) {}
    }

    // 2. Periodic Lightweight Heartbeat (every 40 seconds)
    const sendHeartbeat = () => {
      try {
        api.post('/analytics/heartbeat', {
          visitorId,
          userId: user?.id || user?._id || null,
          userName: user?.name || '',
          userEmail: user?.email || '',
          page: currentPath,
          title: document.title || 'LOCAL2BRAND',
          device,
          browser,
          os,
        }).catch(() => {});
      } catch (e) {}
    };

    const heartbeatInterval = setInterval(sendHeartbeat, 40000);

    // 3. Heartbeat on tab focus or visibility change
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);

    // 4. Leave Beacon on unload
    const handleUnload = () => {
      try {
        const leaveData = JSON.stringify({ visitorId });
        if (navigator.sendBeacon) {
          const baseUrl = api.baseUrl || 'http://localhost:5000/api';
          navigator.sendBeacon(`${baseUrl}/analytics/leave`, leaveData);
        } else {
          api.post('/analytics/leave', { visitorId }).catch(() => {});
        }
      } catch (e) {}
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, [location.pathname, user]);
}
