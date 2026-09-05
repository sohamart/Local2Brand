import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bell, 
  BellRing, 
  BellOff, 
  Check, 
  CheckCheck, 
  X, 
  Sparkles, 
  ExternalLink, 
  Mail, 
  Clock, 
  ChevronRight,
  Shield,
  Layers,
  Inbox
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useOneSignal from '../../hooks/useOneSignal';
import { useAuth } from '../../context/AuthContext';
import notificationApi from '../../services/notificationApi';
import NotificationDetailModal from './NotificationDetailModal';

const getCachedInbox = () => {
  try {
    const cached = localStorage.getItem('l2b_cached_inbox');
    return cached ? JSON.parse(cached) : [];
  } catch (e) {
    return [];
  }
};

const getCachedUnread = () => {
  try {
    const cached = localStorage.getItem('l2b_cached_unread');
    return cached ? Number(cached) : 0;
  } catch (e) {
    return 0;
  }
};

export default function NotificationBell({ className = '' }) {
  const { user, isAdmin } = useAuth();
  const { isSupported, permission, isSubscribed, isLoading: pushLoading, requestPermission, optIn, optOut } = useOneSignal();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showPushSettings, setShowPushSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(getCachedUnread);
  const [notifications, setNotifications] = useState(getCachedInbox);
  const [loadingList, setLoadingList] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const dropdownRef = useRef(null);

  // Fetch unread count for badge
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      if (res?.success) {
        const count = res.unreadCount || 0;
        setUnreadCount(count);
        try { localStorage.setItem('l2b_cached_unread', String(count)); } catch (e) {}
      }
    } catch (err) {
      // Non-blocking if offline or unauthenticated
    }
  }, []);

  // Fetch recent inbox items on load & silent background revalidation
  const fetchRecentNotifications = useCallback(async (showSpinner = false) => {
    if (showSpinner && notifications.length === 0) {
      setLoadingList(true);
    }
    try {
      const res = await notificationApi.getInbox({ limit: 8 });
      if (res?.success) {
        const list = res.notifications || [];
        setNotifications(list);
        try { localStorage.setItem('l2b_cached_inbox', JSON.stringify(list)); } catch (e) {}
        if (typeof res.unreadCount === 'number') {
          setUnreadCount(res.unreadCount);
          try { localStorage.setItem('l2b_cached_unread', String(res.unreadCount)); } catch (e) {}
        }
      }
    } catch (err) {
      // Non-blocking
    } finally {
      setLoadingList(false);
    }
  }, [notifications.length]);

  // Immediate fetch on website load & periodic background polling
  useEffect(() => {
    fetchUnreadCount();
    fetchRecentNotifications(true);
    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchRecentNotifications(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount, fetchRecentNotifications, user]);

  // When popover opens, revalidate
  useEffect(() => {
    if (isOpen) {
      fetchRecentNotifications(notifications.length === 0);
    }
  }, [isOpen, fetchRecentNotifications, notifications.length]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Mark single item read
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

  // Mark all items read
  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Error marking all read:', err.message);
    }
  };

  // Format relative time (e.g. 5m, 2h, 3d)
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

  const popoverInnerContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Inbox &amp; Alerts
              </h4>
              {unreadCount > 0 && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline px-2 py-1 rounded-lg cursor-pointer flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark Read</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification Items List */}
      <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
        {loadingList ? (
          <div className="py-8 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading alerts...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-10 px-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto">
              <Mail className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No notifications yet
            </p>
            <p className="text-[11px] text-slate-400">
              You will receive notifications here for orders, proposals, and updates.
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
              className={`p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/60 ${
                !item.isRead ? 'bg-purple-500/[0.04] dark:bg-purple-500/[0.08]' : ''
              }`}
            >
              {/* Unread Indicator Dot / Category Icon */}
              <div className="relative mt-1 shrink-0">
                <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                {!item.isRead && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white dark:ring-slate-900" />
                )}
              </div>

              {/* Content Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(item.category)}`}>
                    {item.category || 'Alert'}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {formatTimeAgo(item.createdAt)}
                  </span>
                </div>
                <h5 className={`text-xs leading-snug line-clamp-1 ${!item.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
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

      {/* Push Settings Quick Toggle Section */}
      {isSupported && (
        <div className="border-t border-slate-100 dark:border-slate-800/80 p-3 bg-slate-50/50 dark:bg-slate-900/30 shrink-0 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Web Push Alerts</span>
            </div>

            {isSubscribed ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3 h-3 stroke-[3]" /> Active
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
                className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                {pushLoading ? 'Enabling...' : 'Turn On'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer "View All Inbox" */}
      <div className="p-2.5 bg-slate-100/60 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 shrink-0 text-center">
        <Link
          to={inboxLink}
          onClick={() => setIsOpen(false)}
          className="w-full py-1.5 px-3 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-all flex items-center justify-center gap-1"
        >
          <span>{isAdmin ? 'Open Admin Inbox Console' : 'View Full Inbox & History'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        {/* Trigger Bell Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Notifications & Inbox"
          className={`relative p-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
            unreadCount > 0
              ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 hover:bg-purple-500/25 border border-purple-500/40 shadow-xs'
              : isSubscribed
              ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-600 border border-slate-200 dark:border-slate-700/60'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-600 border border-slate-200 dark:border-slate-700/60'
          }`}
          title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications & Inbox'}
        >
          {unreadCount > 0 ? (
            <BellRing className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-wiggle" />
          ) : (
            <Bell className="w-4 h-4" />
          )}

          {/* Dynamic Unread Badge Pill */}
          {unreadCount > 0 ? (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : isSubscribed ? (
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          ) : null}
        </button>

        {/* Desktop Popover Card (Relative to trigger) */}
        {isOpen && (
          <div className="hidden sm:block absolute right-0 top-full mt-2 w-88 md:w-96 rounded-3xl bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col max-h-[560px] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            {popoverInnerContent}
          </div>
        )}
      </div>

      {/* Mobile Popover Modal (Rendered via createPortal to body to guarantee zero clipping by drawer/sticky header) */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="sm:hidden fixed inset-0 z-[999999999] flex flex-col justify-start p-3 pt-14 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-h-[82dvh] rounded-3xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {popoverInnerContent}
          </div>
        </div>,
        document.body
      )}

      {/* Full Notification / Email Detail Modal */}
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
