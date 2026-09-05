import React, { useState, useEffect, useCallback } from 'react';
import { 
  Inbox, 
  Mail, 
  Search, 
  Filter, 
  CheckCheck, 
  Trash2, 
  RefreshCw, 
  Clock, 
  ExternalLink, 
  Eye, 
  Layers, 
  Sparkles,
  Radio,
  FileText,
  PhoneCall
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import notificationApi from '../../services/notificationApi';
import NotificationDetailModal from '../common/NotificationDetailModal';

export default function UserInboxTab() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchInbox = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getInbox({
        limit: 50,
        category: selectedCategory,
        unreadOnly,
        search: searchTerm,
      });

      if (res?.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Failed to load user inbox:', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, unreadOnly, searchTerm]);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  const handleMarkRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const getCategoryBadge = (category = '') => {
    const c = category.toLowerCase();
    if (c.includes('order')) {
      return {
        label: 'Order Update',
        icon: <Layers className="w-3.5 h-3.5" />,
        className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
      };
    }
    if (c.includes('callback')) {
      return {
        label: 'Callback Status',
        icon: <PhoneCall className="w-3.5 h-3.5" />,
        className: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
      };
    }
    if (c.includes('lead') || c.includes('proposal')) {
      return {
        label: 'Proposal Quote',
        icon: <FileText className="w-3.5 h-3.5" />,
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
      };
    }
    if (c.includes('broadcast')) {
      return {
        label: 'Announcement',
        icon: <Radio className="w-3.5 h-3.5" />,
        className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
      };
    }
    return {
      label: category || 'Notification',
      icon: <Mail className="w-3.5 h-3.5" />,
      className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30'
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Inbox className="w-5 h-5 text-purple-600" />
              <span>Personal Inbox &amp; Email Alerts</span>
            </h2>
            {unreadCount > 0 && (
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-purple-600 text-white shadow-xs">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Your personal log of order milestones, proposal estimates, email replicas, and project announcements.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={fetchInbox}
            disabled={loading}
            className="py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="py-2 px-3 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/70 dark:bg-[#0c1017]/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'Orders', label: 'Order Updates' },
            { id: 'Broadcasts', label: 'Announcements' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notifications..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
              unreadOnly
                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/40'
                : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>Unread</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white/80 dark:bg-[#0c1017]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Loading personal inbox...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-14 px-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
              No notifications yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Whenever your order status changes or a proposal quote is ready, you'll receive updates and email replicas right here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {notifications.map((item) => {
              const categoryBadge = getCategoryBadge(item.category);
              return (
                <div
                  key={item._id}
                  onClick={() => {
                    if (!item.isRead) handleMarkRead(item._id);
                    setSelectedNotification(item);
                  }}
                  className={`p-4 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 ${
                    !item.isRead ? 'bg-purple-500/[0.04] dark:bg-purple-500/[0.08]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="relative shrink-0 mt-0.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${categoryBadge.className}`}>
                        {categoryBadge.icon}
                      </div>
                      {!item.isRead && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-600 ring-2 ring-white dark:ring-[#0c1017]" />
                      )}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${categoryBadge.className}`}>
                          {categoryBadge.label}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.createdAt)}
                        </span>
                      </div>

                      <h4 className={`text-xs sm:text-sm ${!item.isRead ? 'font-extrabold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!item.isRead) handleMarkRead(item._id);
                        setSelectedNotification(item);
                      }}
                      className="p-1.5 px-2.5 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    {item.link && (
                      <Link
                        to={item.link}
                        className="p-1.5 px-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notification / Email Viewer Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onMarkRead={(id) => handleMarkRead(id)}
        />
      )}
    </div>
  );
}
