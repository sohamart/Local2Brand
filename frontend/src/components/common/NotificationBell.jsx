import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  Inbox,
  Trash2,
  PhoneCall,
  FileText
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

  // Always ensure newest notifications are strictly at the top
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  }, [notifications]);

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

  // When popover opens, revalidate & auto mark all as read seamlessly
  useEffect(() => {
    if (isOpen) {
      fetchRecentNotifications(notifications.length === 0);
      if (unreadCount > 0) {
        const timer = setTimeout(() => {
          handleMarkAllRead();
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, fetchRecentNotifications, notifications.length, unreadCount]);

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
      setNotifications((prev) => {
        const updated = prev.map((n) => (n._id === id ? { ...n, isRead: true } : n));
        try { localStorage.setItem('l2b_cached_inbox', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });
      setUnreadCount((prev) => {
        const next = Math.max(0, prev - 1);
        try { localStorage.setItem('l2b_cached_unread', String(next)); } catch (e) {}
        return next;
      });
    } catch (err) {
      console.warn('Error marking read:', err.message);
    }
  };

  // Delete single item
  const handleDeleteNotification = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.deleteNotification(id);
      setNotifications((prev) => {
        const updated = prev.filter((n) => n._id !== id);
        try { localStorage.setItem('l2b_cached_inbox', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });
      setUnreadCount((prev) => {
        const next = Math.max(0, prev - 1);
        try { localStorage.setItem('l2b_cached_unread', String(next)); } catch (e) {}
        return next;
      });
    } catch (err) {
      console.warn('Error deleting notification:', err.message);
    }
  };

  // Mark all items read
  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => {
        const updated = prev.map((n) => ({ ...n, isRead: true }));
        try { localStorage.setItem('l2b_cached_inbox', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });
      setUnreadCount(0);
      try { localStorage.setItem('l2b_cached_unread', '0'); } catch (e) {}
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

  const getCategoryMeta = (category = '', type = '') => {
    const c = (category || type || '').toLowerCase();
    if (c.includes('order') || c.includes('requirement')) {
      return {
        badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)]',
        iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25',
        icon: <Layers className="w-3.5 h-3.5" />
      };
    }
    if (c.includes('lead') || c.includes('proposal') || c.includes('inquiry')) {
      return {
        badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
        iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25',
        icon: <FileText className="w-3.5 h-3.5" />
      };
    }
    if (c.includes('callback') || c.includes('call')) {
      return {
        badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
        iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25',
        icon: <PhoneCall className="w-3.5 h-3.5" />
      };
    }
    if (c.includes('broadcast') || c.includes('email') || c.includes('newsletter')) {
      return {
        badge: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.15)]',
        iconBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25',
        icon: <Sparkles className="w-3.5 h-3.5" />
      };
    }
    return {
      badge: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30',
      iconBg: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/25',
      icon: <Mail className="w-3.5 h-3.5" />
    };
  };

  // Lock body scroll on mobile when modal open
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const inboxLink = isAdmin ? '/admin/inbox' : '/dashboard';

  const popoverInnerContent = (
    <div 
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className="relative flex flex-col h-full max-h-[520px] overflow-hidden min-h-0 bg-white/95 dark:bg-[#0c101d]/95 backdrop-blur-3xl overscroll-contain"
      style={{ overscrollBehavior: 'contain' }}
    >
      {/* Top Ambient Glow Laser Bar */}
      <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-purple-500 via-pink-500 via-indigo-500 to-cyan-400 z-20 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
      
      {/* Background Ambient Radial Lights */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-600/15 dark:bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-600/15 dark:bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/80 backdrop-blur-md shrink-0 relative z-10">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Icon + Title + Unread Count Badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-xs shrink-0">
              <Inbox className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate tracking-tight">
                Inbox &amp; Alerts
              </h4>
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
            </div>
            {unreadCount > 0 && (
              <span className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.5)]">
                {unreadCount} new
              </span>
            )}
          </div>

          {/* Right: Mark Read button & Close (X) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="px-2.5 py-1 rounded-xl text-[10.5px] font-bold text-purple-600 dark:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 flex items-center gap-1 cursor-pointer transition-all active:scale-95 whitespace-nowrap shadow-xs"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark Read</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/80 dark:hover:bg-slate-700/80 flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-slate-200/60 dark:border-slate-700/60"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Items List */}
      <div 
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="overflow-y-auto flex-1 min-h-0 max-h-[340px] sm:max-h-[360px] p-2 space-y-1.5 overscroll-contain custom-scrollbar relative z-10 touch-pan-y"
        style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
      >
        {loadingList && sortedNotifications.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2.5">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin shadow-[0_0_12px_rgba(168,85,247,0.5)]" />
            <span className="text-[11px] font-medium">Fetching real-time updates...</span>
          </div>
        ) : sortedNotifications.length === 0 ? (
          <div className="py-10 px-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Your Inbox is All Caught Up! 🎉
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[240px] mx-auto leading-relaxed">
              Order progress, callback confirmations, and proposal alerts will appear here in real time.
            </p>
          </div>
        ) : (
          sortedNotifications.map((item) => {
            const meta = getCategoryMeta(item.category, item.type);
            const isUnread = !item.isRead;
            return (
              <div
                key={item._id}
                onClick={() => {
                  handleMarkRead(item._id);
                  setSelectedNotification(item);
                  setIsOpen(false);
                }}
                className={`p-3 rounded-2xl transition-all duration-200 cursor-pointer flex items-start gap-3 group/item border relative overflow-hidden ${
                  isUnread
                    ? 'bg-purple-500/[0.07] dark:bg-purple-500/[0.12] border-purple-500/35 dark:border-purple-500/40 shadow-[0_4px_15px_-4px_rgba(168,85,247,0.15)]'
                    : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/70 hover:border-purple-500/30 dark:hover:border-purple-500/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/30'
                }`}
              >
                {/* Unread Left Border Highlight */}
                {isUnread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                )}

                {/* Category Icon */}
                <div className="relative mt-0.5 shrink-0 pl-0.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover/item:scale-105 ${meta.iconBg}`}>
                    {meta.icon}
                  </div>
                  {isUnread && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-white dark:ring-slate-900 shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
                  )}
                </div>

                {/* Content Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${meta.badge}`}>
                      {item.category || 'Alert'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteNotification(item._id, e)}
                        className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/15 transition-colors cursor-pointer shrink-0"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <h5 className={`text-xs leading-snug line-clamp-1 ${isUnread ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-700 dark:text-slate-200'}`}>
                    {item.title}
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Push Settings Quick Toggle Section */}
      {isSupported && (
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 px-3.5 py-2.5 bg-gradient-to-r from-purple-500/[0.06] via-indigo-500/[0.04] to-transparent dark:from-purple-950/40 dark:via-indigo-950/30 shrink-0 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
              <div className="w-5 h-5 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Sparkles className="w-3 h-3" />
              </div>
              <span>Web Push Instant Alerts</span>
            </div>

            {isSubscribed ? (
              <span className="flex items-center gap-1 text-[10.5px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25 shadow-xs">
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
                className="px-3 py-1 rounded-full text-[10.5px] font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.4)] hover:opacity-95 cursor-pointer transition-all active:scale-95"
              >
                {pushLoading ? 'Enabling...' : 'Turn On'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer "View All Inbox" */}
      <div className="p-2.5 bg-slate-50/90 dark:bg-slate-950/90 border-t border-slate-200/80 dark:border-slate-800/80 shrink-0 text-center relative z-10">
        <Link
          to={inboxLink}
          onClick={() => setIsOpen(false)}
          className="w-full py-2 px-4 rounded-xl text-xs font-black text-purple-700 dark:text-purple-300 hover:text-white bg-purple-500/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 border border-purple-500/30 hover:border-transparent transition-all duration-300 flex items-center justify-center gap-1.5 shadow-xs group/btn"
        >
          <span>{isAdmin ? 'Open Admin Central Inbox' : 'View Full Inbox & History'}</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
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
          className={`relative p-2.5 rounded-2xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
            unreadCount > 0
              ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 hover:bg-purple-500/25 border border-purple-500/40 shadow-[0_0_15px_rgba(147,51,234,0.3)]'
              : isSubscribed
              ? 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-600 border border-slate-200/80 dark:border-slate-700/60 shadow-xs'
              : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-600 border border-slate-200/80 dark:border-slate-700/60 shadow-xs'
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
            <span className="absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black flex items-center justify-center shadow-[0_0_10px_rgba(147,51,234,0.6)] animate-pulse border border-white dark:border-slate-900">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : isSubscribed ? (
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          ) : null}
        </button>

        {/* Desktop Popover Card with Outer Glow Border */}
        {isOpen && (
          <div 
            data-lenis-prevent="true"
            className="hidden sm:block absolute right-0 top-full mt-2.5 w-[360px] sm:w-[390px] max-h-[520px] rounded-3xl bg-white/95 dark:bg-[#0c101d]/95 backdrop-blur-3xl border border-purple-500/35 dark:border-purple-500/40 shadow-[0_20px_60px_-15px_rgba(147,51,234,0.35),0_0_25px_1px_rgba(99,102,241,0.2)] dark:shadow-[0_25px_70px_-15px_rgba(147,51,234,0.45),0_0_35px_1px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/20 z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {popoverInnerContent}
          </div>
        )}
      </div>

      {/* Mobile Popover Modal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          data-lenis-prevent="true"
          className="sm:hidden fixed inset-0 z-[999999999] flex flex-col justify-start p-3 pt-14 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div 
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div 
            data-lenis-prevent="true"
            className="relative w-full max-h-[75dvh] rounded-3xl bg-white dark:bg-[#0c101d] border border-purple-500/40 shadow-[0_20px_60px_-15px_rgba(147,51,234,0.45),0_0_30px_1px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/20 z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          >
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
          onDelete={(id) => handleDeleteNotification(id)}
        />
      )}
    </>
  );
}
