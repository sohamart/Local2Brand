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
  Star,
  RefreshCw,
  Phone,
  Compass
} from 'lucide-react';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';
import { SEO } from '../../components/common/CommonUI';

const STATUS_BADGES = {
  'Draft': 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300',
  'Submitted': 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300',
  'Under Review': 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300',
  'Quotation Sent': 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300',
  'Approved': 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300',
  'In Development': 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300',
  'Completed': 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-300',
  'Cancelled': 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300'
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRequirements: 0,
    pendingRequirements: 0,
    inProgressRequirements: 0,
    completedRequirements: 0,
    totalLeads: 0,
    pendingLeads: 0,
    totalCallbacks: 0,
    pendingCallbacks: 0,
    totalUsers: 0,
  });

  const [recentRequirements, setRecentRequirements] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentCallbacks, setRecentCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData(false);
    // Real-time live auto-poll every 3s
    const timer = setInterval(() => {
      fetchDashboardData(true);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await api.get('/admin/stats');
      if (res?.success) {
        setStats(res.stats || {});
        setRecentRequirements(res.recentRequirements || []);
        setRecentLeads(res.recentLeads || []);
        setRecentCallbacks(res.recentCallbacks || []);
      }
    } catch (err) {
      console.warn('Error fetching admin dashboard stats:', err);
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleUpdateRequirementStatus = async (id, newStatus) => {
    try {
      await api.patch(`/requirements/admin/${id}/status`, { status: newStatus });
      fetchDashboardData(true);
    } catch (err) {
      alert('Error updating requirement status: ' + err.message);
    }
  };

  const handleUpdateLeadStatus = async (id, newStatus) => {
    try {
      await api.put(`/queries/${id}`, { status: newStatus });
      fetchDashboardData(true);
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleUpdateCallbackStatus = async (id, newStatus) => {
    try {
      await api.put(`/callbacks/${id}`, { status: newStatus });
      fetchDashboardData(true);
    } catch (err) {
      alert('Error updating callback status: ' + err.message);
    }
  };

  return (
    <>
      <SEO title="Admin Overview — LOCAL2BRAND" description="Platform analytics, project requirements pipeline, and leads management." />

      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold mb-1">
              <AshokaChakra size={11} />
              <span>Master Admin Live Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Platform Analytics &amp; Project Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Real-time website specifications, founder callbacks, and lead inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchDashboardData(false)}
              disabled={isRefreshing}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              to="/admin/requirements"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Orders ({stats.totalRequirements})</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: Total Requirement Orders */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website Orders</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalRequirements}</span>
            </div>
            <div className="mt-2 text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
              <span>{stats.pendingRequirements} Pending review</span>
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

          {/* Card 3: In Development */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Development</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.inProgressRequirements || stats.inProgressLeads || 0}</span>
            </div>
            <div className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
              <span>{stats.completedRequirements || 0} Handed over</span>
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

        {/* 1. REQUIREMENT SUBMISSIONS & ORDERS PIPELINE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Live Website Orders &amp; Specifications ({recentRequirements.length})</span>
            </h2>
            <Link to="/admin/requirements" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
              <span>View all orders ({stats.totalRequirements})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentRequirements.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              No website requirements submitted yet. Submit from the Get Started form or AI Chat to see live orders appear here!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentRequirements.map((req) => (
                <div
                  key={req._id || req.requirementId}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5 hover:border-purple-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-md">
                        {req.requirementId}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                        {req.clientInfo?.businessName || req.websiteTypeName || 'Project'}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{req.clientInfo?.ownerName || 'Client'}</span>
                        <span>•</span>
                        <a href={`tel:${req.clientInfo?.mobile}`} className="text-emerald-600 hover:underline font-mono">
                          {req.clientInfo?.mobile}
                        </a>
                      </div>
                    </div>

                    <select
                      value={req.status || 'Submitted'}
                      onChange={(e) => handleUpdateRequirementStatus(req._id || req.requirementId, e.target.value)}
                      className={`text-xs font-bold p-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                        STATUS_BADGES[req.status] || STATUS_BADGES.Submitted
                      }`}
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Quotation Sent">Quotation Sent</option>
                      <option value="Approved">Approved</option>
                      <option value="In Development">In Development</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tier</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{req.budget}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Timeline</span>
                      <strong className="text-slate-800 dark:text-slate-200">{req.timeline}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      {new Date(req.createdAt || req.submittedAt).toLocaleDateString()}
                    </span>
                    <Link
                      to="/admin/requirements"
                      className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
                    >
                      <span>Manage Specs &rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Grid: Recent Inquiries & Recent Callbacks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Inquiries (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-purple-600" />
                <span>Recent Quick Inquiries</span>
              </h2>
              <Link to="/admin/leads" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                No inquiries submitted yet.
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
                        <a href={`tel:${lead.phone}`} className="text-xs text-emerald-600 font-mono">
                          {lead.phone}
                        </a>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="font-semibold text-purple-600 dark:text-purple-400">{lead.websiteType}</span>
                        <span>•</span>
                        <span>{lead.budget}</span>
                        <span>•</span>
                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateLeadStatus(lead._id, e.target.value)}
                      className="text-xs font-bold p-1.5 rounded-xl border focus:outline-none bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Callbacks Queue (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Founder Callback Queue ({recentCallbacks.length})</span>
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
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">{cb.name}</span>
                      <select
                        value={cb.status}
                        onChange={(e) => handleUpdateCallbackStatus(cb._id, e.target.value)}
                        className="text-[10px] font-bold p-1 rounded-lg border bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300"
                      >
                        <option value="pending">pending</option>
                        <option value="called">called</option>
                        <option value="resolved">resolved</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                      <a href={`tel:${cb.phone}`} className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{cb.phone}</span>
                      </a>
                      <span className="text-[11px] text-slate-400">{cb.preferredTime}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 truncate">
                      Topic: {cb.topic}
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
