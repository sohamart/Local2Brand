import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, MailOpen } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      if (res.data?.notifications) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error('Error fetching notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await API.put(`/notifications/${id}`);
      if (res.data?.success) {
        setNotifications(prev =>
          prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error('Error reading notification', err);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Notifications</h1>
        <p className="text-xs text-slate-500">Track milestones, message alerts, and invoice dispatches.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] glass-panel">
          <p className="text-slate-600 dark:text-slate-400 text-xs">No notifications logged yet.</p>
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] p-5 divide-y divide-slate-200 dark:divide-white/5 glass-panel">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0 ${
                !notif.isRead ? 'bg-yellow-500/5 px-2.5 rounded-xl border border-yellow-500/10' : ''
              }`}
            >
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  !notif.isRead
                    ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-450 animate-pulse font-bold'
                    : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-500'
                }`}>
                  <Bell size={14} />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-xs font-bold ${!notif.isRead ? 'text-yellow-650 dark:text-yellow-450' : 'text-slate-700 dark:text-slate-300'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed">{notif.description}</p>
                  <span className="text-[9px] text-slate-550 block mt-1">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notif._id)}
                  className="p-1.5 rounded-lg border border-slate-300 dark:border-white/10 hover:border-yellow-500/40 text-slate-650 dark:text-slate-450 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                  title="Mark as read"
                >
                  <Check size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
