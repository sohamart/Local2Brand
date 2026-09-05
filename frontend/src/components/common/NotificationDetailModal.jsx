import React from 'react';
import { X, Mail, ExternalLink, Clock, Shield, Tag, CheckCircle2, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationDetailModal({ notification, onClose, onMarkRead }) {
  if (!notification) return null;

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

  const getCategoryColor = (category = '') => {
    const c = category.toLowerCase();
    if (c.includes('order')) return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    if (c.includes('lead') || c.includes('proposal')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    if (c.includes('callback')) return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
    if (c.includes('broadcast')) return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
    return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-[#0e131f] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-start gap-3.5 pr-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(notification.category)}`}>
                  {notification.category || 'Notification'}
                </span>
                {notification.recipientRole === 'admin' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" /> Admin Only
                  </span>
                )}
                {notification.recipientRole === 'all' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Broadcast
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-snug">
                {notification.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Meta Details Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5 bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(notification.createdAt)}</span>
          </div>
          {notification.recipientEmail && (
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Target: <strong className="font-semibold">{notification.recipientEmail}</strong></span>
            </div>
          )}
        </div>

        {/* Modal Body / Email Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Main Message Text */}
          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            {notification.message}
          </div>

          {/* Render Full Rich HTML Email Replica if present */}
          {notification.emailHtml ? (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5" />
                <span>Full Email Replica / Message Details</span>
              </div>
              <div 
                className="bg-white text-slate-900 p-5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto email-content-preview text-sm"
                dangerouslySetInnerHTML={{ __html: notification.emailHtml }}
              />
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="text-xs text-slate-400">
            {notification.isRead ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Read
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onMarkRead && onMarkRead(notification._id)}
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold cursor-pointer"
              >
                Mark as Read
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {notification.link && (
              <Link
                to={notification.link}
                onClick={onClose}
                className="py-2 px-4 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <span>Open Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
