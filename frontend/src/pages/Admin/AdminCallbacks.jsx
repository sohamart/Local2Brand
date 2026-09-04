import React, { useState, useEffect } from 'react';
import { PhoneCall, Trash2, CheckCircle2, Clock, Filter, Phone, Mail, User, AlertCircle, RefreshCw, MessageSquare, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { SEO } from '../../components/common/CommonUI';
import { toast } from 'react-toastify';

export default function AdminCallbacks() {
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  useEffect(() => {
    fetchCallbacks(false);
    // Real-time live auto-refresh every 3 seconds while on this page
    const pollInterval = setInterval(() => {
      fetchCallbacks(true);
    }, 3000);
    return () => clearInterval(pollInterval);
  }, [statusFilter]);

  const fetchCallbacks = async (silent = false) => {
    if (!silent) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await api.get(`/callbacks?status=${statusFilter}`);
      if (res?.success) {
        setCallbacks(res.callbacks || []);
        setLastSyncTime(new Date());
      }
    } catch (err) {
      console.warn('Error fetching callbacks:', err);
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.put(`/callbacks/${id}`, { status: newStatus });
      if (res?.success) {
        setCallbacks((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
        );
        toast.success(`Callback status changed to "${newStatus}"`);
      }
    } catch (err) {
      toast.error('Failed to update status: ' + (err.message || 'Error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ Are you sure you want to permanently delete this callback request from the database? Client & admin email notifications will be sent.')) return;
    try {
      await api.delete(`/callbacks/${id}`);
      setCallbacks((prev) => prev.filter((c) => c._id !== id));
      toast.success('Callback request deleted from database. Notifications dispatched.');
    } catch (err) {
      toast.error('Delete failed: ' + (err.message || 'Error'));
    }
  };

  const filteredCallbacks = callbacks.filter((cb) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (cb.name && cb.name.toLowerCase().includes(q)) ||
      (cb.phone && cb.phone.includes(q)) ||
      (cb.email && cb.email.toLowerCase().includes(q)) ||
      (cb.topic && cb.topic.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <SEO title="Callback Requests — Admin" description="Manage real-time client callback requests." />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Callback Requests ({callbacks.length})
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Desk
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Queue of clients requesting instant &amp; scheduled consultation calls.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => fetchCallbacks(false)}
              disabled={isRefreshing}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              title="Refresh callback queue"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-xs"
              >
                <option value="all">All Statuses ({callbacks.length})</option>
                <option value="pending">Pending</option>
                <option value="called">Called / In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, phone number, email, or topic..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Callback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && callbacks.length === 0 ? (
            <div className="col-span-full p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 animate-pulse flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
              <span>Loading callback queue...</span>
            </div>
          ) : filteredCallbacks.length === 0 ? (
            <div className="col-span-full p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">No Callback Requests Found</h3>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                No callback entries matching "{statusFilter}". Any new callback submitted from the AI Chatbot or website modal will appear here in real-time.
              </p>
            </div>
          ) : (
            filteredCallbacks.map((cb) => {
              const cleanPhone = (cb.phone || '').replace(/[^0-9+]/g, '');
              return (
                <div
                  key={cb._id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {cb.name || 'Anonymous Visitor'}
                          </h3>
                        </div>
                        <a
                          href={`tel:${cleanPhone}`}
                          className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{cb.phone}</span>
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(cb._id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                        title="Delete callback request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1.5 border border-slate-100 dark:border-slate-800/80">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Slot / Preferred Time</span>
                        <strong className="text-amber-600 dark:text-amber-400 font-bold">{cb.preferredTime || '⚡ ASAP'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Topic / Inquiry</span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{cb.topic || 'General Website Consultation'}</span>
                      </div>
                      {cb.email && (
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Email</span>
                          <a href={`mailto:${cb.email}`} className="text-purple-600 dark:text-purple-400 font-mono hover:underline text-[11px]">
                            {cb.email}
                          </a>
                        </div>
                      )}
                      {cb.notes && (
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Notes</span>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] italic bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                            {cb.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        {cb.createdAt ? new Date(cb.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recent'}
                      </span>
                      <select
                        value={cb.status || 'pending'}
                        onChange={(e) => handleStatusChange(cb._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-black border focus:outline-none cursor-pointer ${
                          cb.status === 'resolved'
                            ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                            : cb.status === 'called'
                            ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                            : cb.status === 'cancelled'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200'
                            : 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                        }`}
                      >
                        <option value="pending">⏳ Pending Call</option>
                        <option value="called">📞 Called / In Progress</option>
                        <option value="resolved">✅ Resolved / Closed</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </div>

                    {/* Direct action buttons: Call Now & WhatsApp */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call Now</span>
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${cb.name}, this is LOCAL2BRAND following up on your website callback request.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
