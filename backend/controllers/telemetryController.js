import { dataStore } from '../config/dataAdapter.js';

// In-memory active sessions tracker (SessionId / IP -> Timestamp & Path)
const activeSessions = new Map();
let memoryPageViews = Math.max(2, (dataStore.read('requirements') || []).length * 4); // Persistent base + dynamic

const CLEANUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes active presence window

// Helper to clean expired sessions
const cleanupExpiredSessions = () => {
  const now = Date.now();
  for (const [key, session] of activeSessions.entries()) {
    if (now - session.lastSeen > CLEANUP_WINDOW_MS) {
      activeSessions.delete(key);
    }
  }
};

export const recordPageView = async (req, res) => {
  try {
    const { sessionId, path = '/', tabId } = req.body || {};
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown_ip';
    const key = sessionId || (tabId ? `${clientIp}_${tabId}` : clientIp);

    activeSessions.set(key, {
      ip: clientIp,
      path,
      lastSeen: Date.now(),
      userAgent: req.headers['user-agent'] || '',
    });

    memoryPageViews += 1;
    cleanupExpiredSessions();

    const activeCount = Math.max(1, activeSessions.size);
    return res.status(200).json({
      success: true,
      liveOnlineUsers: activeCount,
      totalPageViews: Math.max(activeCount, memoryPageViews),
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      liveOnlineUsers: Math.max(1, activeSessions.size),
      totalPageViews: memoryPageViews,
    });
  }
};

export const recordHeartbeat = async (req, res) => {
  try {
    const { sessionId, path = '/', tabId } = req.body || {};
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown_ip';
    const key = sessionId || (tabId ? `${clientIp}_${tabId}` : clientIp);

    activeSessions.set(key, {
      ip: clientIp,
      path,
      lastSeen: Date.now(),
      userAgent: req.headers['user-agent'] || '',
    });

    cleanupExpiredSessions();

    const activeCount = Math.max(1, activeSessions.size);
    return res.status(200).json({
      success: true,
      liveOnlineUsers: activeCount,
      totalPageViews: Math.max(activeCount, memoryPageViews),
    });
  } catch (err) {
    return res.status(200).json({ success: true, liveOnlineUsers: Math.max(1, activeSessions.size) });
  }
};

export const getLiveTelemetryStats = () => {
  cleanupExpiredSessions();
  const activeCount = Math.max(1, activeSessions.size);
  return {
    liveOnlineUsers: activeCount,
    totalPageViews: Math.max(activeCount, memoryPageViews),
  };
};
