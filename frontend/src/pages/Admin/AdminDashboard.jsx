import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  PhoneCall,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Layers,
  Settings,
  ExternalLink,
  Filter,
  Star
} from 'lucide-react';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';
import { SEO } from '../../components/common/CommonUI';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    pendingLeads: 0,
    inProgressLeads: 0,
    completedLeads: 0,
    totalCallbacks: 0,
    pendingCallbacks: 0,
    totalUsers: 0,
  });

  const [recentLeads, setRecentLeads] = useState([]);
  const [recentCallbacks, setRecentCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      if (res.success) {
        setStats(res.stats || {});
        setRecentLeads(res.recentLeads || []);
        setRecentCallbacks(res.recentCallbacks || []);
      }
    } catch (err) {
      console.warn('Error fetching admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeadStatus = async (id, newStatus) => {
    try {
      await api.put(`/queries/${id}`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  return (
    <>
      <SEO title="Admin Overview — LOCAL2BRAND" description="Platform analytics, leads queue, and site management metrics." />

      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold mb-1">
              <AshokaChakra size={11} />
              <span>Live Management Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Platform Analytics & Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Real-time proposals, callback requests, and user inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/reviews"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 hover:bg-amber-100 flex items-center gap-1.5 shadow-xs"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Reviews</span>
            </Link>

            <Link
              to="/admin/settings"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
            >
              <Settings className="w-3.5 h-3.5 text-purple-600" />
              <span>Site Customizer</span>
            </Link>

            <Link
              to="/admin/leads"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight flex items-center gap-1.5"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>All Inquiries</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: Total Inquiries */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Proposals</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Inbox className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalLeads}</span>
            </div>
            <div className="mt-2 text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
              <span>{stats.pendingLeads} Pending review</span>
            </div>
          </div>

          {/* Card 2: Callbacks */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Callback Requests</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalCallbacks}</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span>{stats.pendingCallbacks} Awaiting call</span>
            </div>
          </div>

          {/* Card 3: In Progress */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Development</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.inProgressLeads}</span>
            </div>
            <div className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
              <span>{stats.completedLeads} Completed</span>
            </div>
          </div>

          {/* Card 4: Registered Users */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client Accounts</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalUsers}</span>
            </div>
            <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <span>Direct database sync</span>
            </div>
          </div>

        </div>

        {/* 2-Column Grid: Recent Inquiries & Recent Callbacks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Inquiries (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-purple-600" />
                <span>Recent Proposals & Leads</span>
              </h2>
              <Link to="/admin/leads" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                No inquiries submitted yet. Submit a test proposal from the website to see it appear here!
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div
                    key={lead._id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">{lead.name}</span>
                        <span className="text-xs text-slate-400">• {lead.phone}</span>
                        {lead.businessName && (
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                            {lead.businessName}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="font-semibold text-purple-600 dark:text-purple-400">{lead.websiteType}</span>
                        <span>•</span>
                        <span>{lead.budget}</span>
                        <span>•</span>
                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateLeadStatus(lead._id, e.target.value)}
                        className={`text-xs font-bold p-1.5 rounded-xl border focus:outline-none ${
                          lead.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : lead.status === 'in_progress'
                            ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Callbacks Queue (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Callback Queue</span>
              </h2>
              <Link to="/admin/callbacks" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentCallbacks.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                No callback requests pending.
              </div>
            ) : (
              <div className="space-y-3">
                {recentCallbacks.map((cb) => (
                  <div
                    key={cb._id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">{cb.name}</span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        {cb.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Phone:</strong> {cb.phone}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Time: {cb.preferredTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </>
  );
}
