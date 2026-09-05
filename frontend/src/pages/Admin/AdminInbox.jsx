import React, { useState, useEffect, useCallback } from 'react';
import { 
  Inbox, 
  Mail, 
  Search, 
  Filter, 
  CheckCheck, 
  Trash2, 
  RefreshCw, 
  Send, 
  Sparkles, 
  Clock, 
  User, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  PhoneCall,
  FileText,
  Radio,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import notificationApi from '../../services/notificationApi';
import NotificationDetailModal from '../../components/common/NotificationDetailModal';

export default function AdminInbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Broadcast modal state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    url: '/dashboard',
    sendPush: true,
    sendEmail: false,
    emailSubject: '',
  });
  const [broadcasting, setBroadcasting] = useState(false);

  // Fetch Inbox Data
  const fetchInbox = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getInbox({
        page,
        limit: 25,
        category: selectedCategory,
        unreadOnly,
        search: searchTerm,
      });

      if (res?.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
        setTotalPages(res.pagination?.pages || 1);
        setTotalCount(res.pagination?.total || (res.notifications || []).length);
      }
    } catch (err) {
      toast.error('Failed to load inbox notifications');
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, unreadOnly, searchTerm]);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  // Mark single as read
  const handleMarkRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success('Marked as read');
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All messages marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  // Delete single
  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this inbox item?')) return;
    try {
      await notificationApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      toast.success('Notification deleted');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  // Clear all
  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear your entire inbox? This cannot be undone.')) return;
    try {
      await notificationApi.clearAll();
      setNotifications([]);
      setUnreadCount(0);
      setTotalCount(0);
      toast.success('Inbox cleared successfully');
    } catch (err) {
      toast.error('Failed to clear inbox');
    }
  };

  // Send Broadcast Dispatch
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) {
      toast.warn('Please fill in broadcast title and message');
      return;
    }

    setBroadcasting(true);
    try {
      const res = await notificationApi.sendBroadcast(broadcastForm);
      if (res?.success) {
        toast.success(`Broadcast sent successfully! Reached ${res.recipientCount || 'all'} users.`);
        setShowBroadcastModal(false);
        setBroadcastForm({
          title: '',
          message: '',
          url: '/dashboard',
          sendPush: true,
          sendEmail: false,
          emailSubject: '',
        });
        fetchInbox();
      } else {
        toast.error(res?.message || 'Failed to send broadcast');
      }
    } catch (err) {
      toast.error(err.message || 'Error dispatching broadcast');
    } finally {
      setBroadcasting(false);
    }
  };

  const getCategoryBadge = (category = '') => {
    const c = category.toLowerCase();
    if (c.includes('order')) {
      return {
        label: 'Order',
        icon: <Layers className="w-3.5 h-3.5" />,
        className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
      };
    }
    if (c.includes('callback')) {
      return {
        label: 'Callback',
        icon: <PhoneCall className="w-3.5 h-3.5" />,
        className: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
      };
    }
    if (c.includes('lead') || c.includes('proposal')) {
      return {
        label: 'Proposal Lead',
        icon: <FileText className="w-3.5 h-3.5" />,
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
      };
    }
    if (c.includes('broadcast')) {
      return {
        label: 'Broadcast',
        icon: <Radio className="w-3.5 h-3.5" />,
        className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
      };
    }
    return {
      label: category || 'System',
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
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/70 dark:bg-[#0c1017]/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Admin Central Inbox
              </h1>
              {unreadCount > 0 && (
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-600 text-white shadow-xs">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Live records of all orders, callback requests, proposal inquiries, email replicas, and push broadcasts.
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={fetchInbox}
            disabled={loading}
            className="py-2.5 px-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="py-2.5 px-3.5 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowBroadcastModal(true)}
            className="py-2.5 px-4 rounded-xl text-xs font-extrabold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Compose Push Broadcast</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white/70 dark:bg-[#0c1017]/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: 'All Inboxes' },
              { id: 'Orders', label: 'Blueprint Orders' },
              { id: 'Callbacks', label: 'Callback Requests' },
              { id: 'Leads', label: 'Proposal Leads' },
              { id: 'Broadcasts', label: 'Broadcasts' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(tab.id);
                  setPage(1);
                }}
                className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Unread Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search inbox & emails..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Unread Only Toggle */}
            <button
              type="button"
              onClick={() => {
                setUnreadOnly(!unreadOnly);
                setPage(1);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                unreadOnly
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/40'
                  : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Unread Only</span>
            </button>

            {/* Clear All */}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Clear all notifications"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Notification Feed List */}
      <div className="bg-white/70 dark:bg-[#0c1017]/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold">Loading Central Inbox Records...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 px-4 text-center space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-200">
              Your Inbox is Clear
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No notifications found matching your current filter. Incoming client orders and requests will automatically appear here.
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
                  className={`p-4 sm:p-5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 ${
                    !item.isRead ? 'bg-purple-500/[0.03] dark:bg-purple-500/[0.06]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Status & Category Badge */}
                    <div className="relative shrink-0 mt-0.5">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${categoryBadge.className}`}>
                        {categoryBadge.icon}
                      </div>
                      {!item.isRead && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-600 ring-2 ring-white dark:ring-[#0c1017]" />
                      )}
                    </div>

                    {/* Message Details */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${categoryBadge.className}`}>
                          {categoryBadge.label}
                        </span>

                        {item.recipientEmail && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                            <User className="w-3 h-3" />
                            {item.recipientEmail}
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.createdAt)}
                        </span>
                      </div>

                      <h4 className={`text-sm leading-snug ${!item.isRead ? 'font-extrabold text-slate-900 dark:text-white' : 'font-semibold text-slate-800 dark:text-slate-200'}`}>
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions Right Side */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                    {item.emailHtml && (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email HTML
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (!item.isRead) handleMarkRead(item._id);
                        setSelectedNotification(item);
                      }}
                      className="p-2 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors cursor-pointer flex items-center gap-1"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden md:inline">View Details</span>
                    </button>

                    {item.link && (
                      <Link
                        to={item.link}
                        className="p-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        title="Open Resource"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleDelete(item._id, e)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 text-xs">
            <span className="text-slate-500 font-medium">
              Showing page {page} of {totalPages} ({totalCount} total alerts)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Broadcast Composer Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-xl bg-white dark:bg-[#0e131f] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">
                    Broadcast Notification
                  </h3>
                  <p className="text-xs text-slate-500">
                    Send real-time Web Push alerts and In-App messages to all subscribed clients.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Broadcast Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ⚡ Exciting Update: 2026 AI Blueprint Features Live!"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Broadcast Message *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Type the message that will pop up on users' desktop and mobile screens..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Destination URL
                </label>
                <input
                  type="text"
                  placeholder="/pricing or /dashboard"
                  value={broadcastForm.url}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={broadcastForm.sendPush}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, sendPush: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                    Send OneSignal Web Push to All Subscribed Devices
                  </span>
                </label>
                <p className="text-[11px] text-purple-700/80 dark:text-purple-300/80 pl-6">
                  Will instantly trigger a browser push notification with sound on all active mobile &amp; desktop devices.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={broadcasting}
                  className="py-2.5 px-5 rounded-xl text-xs font-extrabold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{broadcasting ? 'Broadcasting...' : 'Send Broadcast Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
