import React, { useState, useEffect } from 'react';
import { PhoneCall, Trash2, CheckCircle2, Clock, Filter, Phone, Mail, User, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { SEO } from '../../components/common/CommonUI';

export default function AdminCallbacks() {
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCallbacks();
  }, [statusFilter]);

  const fetchCallbacks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/callbacks?status=${statusFilter}`);
      if (res.success) {
        setCallbacks(res.callbacks || []);
      }
    } catch (err) {
      console.warn('Error fetching callbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/callbacks/${id}`, { status: newStatus });
      setCallbacks((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this callback request?')) return;
    try {
      await api.delete(`/callbacks/${id}`);
      setCallbacks((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <>
      <SEO title="Callback Requests — Admin" description="Manage direct client callback queues." />

      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Callback Requests ({callbacks.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Queue of clients requesting phone calls with founders & engineers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="called">Called</option>
              <option value="resolved">Resolved</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Callback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {callbacks.length === 0 ? (
            <div className="col-span-full p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              No callback requests found matching filter.
            </div>
          ) : (
            callbacks.map((cb) => (
              <div
                key={cb._id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{cb.name}</h3>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{cb.phone}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(cb._id)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                    <div><span className="text-slate-400">Topic:</span> <strong className="text-slate-800 dark:text-slate-200">{cb.topic}</strong></div>
                    <div><span className="text-slate-400">Preferred Time:</span> <strong className="text-slate-800 dark:text-slate-200">{cb.preferredTime}</strong></div>
                    {cb.email && <div><span className="text-slate-400">Email:</span> {cb.email}</div>}
                    {cb.notes && <div><span className="text-slate-400">Notes:</span> {cb.notes}</div>}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400">{new Date(cb.createdAt).toLocaleDateString()}</span>
                  <select
                    value={cb.status}
                    onChange={(e) => handleStatusChange(cb._id, e.target.value)}
                    className="p-1.5 rounded-lg border text-[11px] font-bold focus:outline-none bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="pending">Pending</option>
                    <option value="called">Called</option>
                    <option value="resolved">Resolved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}
