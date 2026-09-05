import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Inbox,
  Bell,
  BellRing,
  Mail,
  Check,
  CheckCheck,
  X,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useOneSignal from '../../hooks/useOneSignal';
import { useAuth } from '../../context/AuthContext';
import notificationApi from '../../services/notificationApi';
import NotificationDetailModal from './NotificationDetailModal';

export default function FloatingMobileInbox() {
  const { user, isAdmin } = useAuth();
  const { isSupported, permission, isSubscribed, isLoading: pushLoading, requestPermission, optIn } = useOneSignal();

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      if (res?.success) {
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      // Non-blocking
    }
  }, []);

  // Fetch recent inbox items when modal opens
  const fetchRecentNotifications = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await notificationApi.getInbox({ limit: 12 });
      if (res?.success) {
        setNotifications(res.notifications || []);
        if (typeof res.unreadCount === 'number') {
          setUnreadCount(res.unreadCount);
        }
      }
    } catch (err) {
      console.warn('Failed to load mobile notifications:', err.message);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount, user]);

  useEffect(() => {
    if (isOpen) {
      fetchRecentNotifications();
    }
  }, [isOpen, fetchRecentNotifications]);

  const handleMarkRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Error marking read:', err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Error marking all read:', err.message);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days}d ago`;
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  const getCategoryBadgeClass = (category = '') => {
    const c = category.toLowerCase();
    if (c.includes('order')) return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    if (c.includes('lead') || c.includes('proposal')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    if (c.includes('callback')) return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
    if (c.includes('broadcast')) return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
    return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
  };

  const inboxLink = isAdmin ? '/admin/inbox' : '/dashboard';

  return (
    <>
      {/* Floating Notification Bell Trigger on Mobile (Opposite to Assistant Chatbot on bottom-right) */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-[99990] md:hidden pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Notifications & Inbox"
          className="relative group transition-transform duration-200 active:scale-95 cursor-pointer"
        >
          {/* Ambient Glow Aura when there are unread messages */}
          {unreadCount > 0 && (
            <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 opacity-60 blur-md animate-pulse pointer-events-none" />
          )}

          {/* Premium Glassmorphic Squircle Container */}
          <div className="relative w-12 h-12 rounded-2xl bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-300 group-hover:border-amber-400 dark:group-hover:border-amber-500">
            {/* Bell Icon with distinctive warm amber / violet highlight */}
            {unreadCount > 0 ? (
              <div className="relative">
                <BellRing className="w-5 h-5 text-amber-500 dark:text-amber-400 animate-wiggle drop-shadow-xs" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0b1120]" />
              </div>
            ) : (
              <Bell className="w-5 h-5 text-slate-700 dark:text-slate-200 transition-colors group-hover:text-amber-500" />
            )}
          </div>

          {/* Prominent High-Contrast Floating Notification Count Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10.5px] font-black tracking-tight flex items-center justify-center shadow-lg shadow-rose-500/50 border-2 border-white dark:border-[#0b1120] animate-bounce">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Full-Screen Mobile Bottom Sheet / Modal for Inbox via Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[999999999] flex flex-col justify-end sm:justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          {/* Backdrop Click Dismiss */}
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-h-[85dvh] rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0c1017] border-t sm:border border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm text-slate-900 dark:text-white">
                      Inbox &amp; Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Real-time updates, orders &amp; support
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline px-2 py-1 rounded-lg cursor-pointer flex items-center gap-1 bg-purple-50 dark:bg-purple-950/50"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark Read</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification Items List */}
            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60 p-2 overscroll-contain">
              {loadingList ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span>Loading inbox messages...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Your inbox is clear!
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Order confirmations, proposals, and system alerts will arrive here in real-time.
                  </p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      handleMarkRead(item._id);
                      setSelectedNotification(item);
                      setIsOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3 active:scale-[0.99] ${
                      !item.isRead
                        ? 'bg-purple-500/[0.06] dark:bg-purple-500/[0.12] border border-purple-500/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Unread Icon */}
                    <div className="relative mt-1 shrink-0">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      {!item.isRead && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-purple-600 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(item.category)}`}>
                          {item.category || 'Notification'}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>
                      <h5 className={`text-xs leading-snug line-clamp-1 ${!item.isRead ? 'font-black text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                        {item.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Web Push Alerts Opt-in Bar */}
            {isSupported && (
              <div className="border-t border-slate-100 dark:border-slate-800/80 px-4 py-2.5 bg-slate-50/70 dark:bg-slate-900/40 shrink-0">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    <span>Push Notifications</span>
                  </div>

                  {isSubscribed ? (
                    <span className="flex items-center gap-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Enabled
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        if (permission === 'granted') {
                          await optIn();
                        } else {
                          await requestPermission();
                        }
                      }}
                      disabled={pushLoading}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 cursor-pointer shadow-xs active:scale-95"
                    >
                      {pushLoading ? 'Activating...' : 'Enable Push'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-3 bg-slate-100/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <Link
                to={inboxLink}
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 px-4 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 active:scale-98"
              >
                <span>{isAdmin ? 'Open Admin Inbox Console' : 'View Full Inbox & Archives'}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Full Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onMarkRead={(id) => handleMarkRead(id)}
        />
      )}
    </>
  );
}
