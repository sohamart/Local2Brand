import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FolderKanban, Landmark, HelpCircle, TrendingUp, AlertCircle } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/analytics');
        if (res.data?.stats) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching admin statistics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">System Operations</h1>
        <p className="text-xs text-slate-500">Overview dashboard for platform analytics and user accounts.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : !stats ? (
        <div className="text-center py-20 bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] glass-panel">
          <p className="text-slate-655 dark:text-slate-400 text-xs">Error loading analytics dashboard.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Clients */}
            <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] p-5 flex items-center justify-between glass-panel">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Total Clients</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalClients}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-bold">
                <Users size={18} />
              </div>
            </div>

            {/* Active Projects */}
            <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] p-5 flex items-center justify-between glass-panel">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Active Projects</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.activeProjects}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-bold">
                <FolderKanban size={18} />
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] p-5 flex items-center justify-between glass-panel">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Total Revenue</span>
                <p className="text-2xl font-extrabold text-yellow-600 dark:text-yellow-450">₹{stats.revenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-bold">
                <TrendingUp size={18} />
              </div>
            </div>

            {/* Contact Leads */}
            <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] p-5 flex items-center justify-between glass-panel">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Contact Leads</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalLeads}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-bold">
                <HelpCircle size={18} />
              </div>
            </div>
          </div>

          {/* Project timeline overview */}
          <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] p-6 space-y-4 glass-panel">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Status Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {Object.entries(stats.statusDistribution).map(([status, count]) => (
                <div key={status} className="p-4 bg-slate-100 dark:bg-slate-950 border border-slate-250 dark:border-white/5 rounded-2xl">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{status}</p>
                  <p className="text-xl font-extrabold text-slate-850 dark:text-white mt-1">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
