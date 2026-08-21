import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, MessageSquare, PlusCircle, CheckCircle, Calendar, FileCode, Landmark } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Overview = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projRes = await API.get('/projects');
        const invRes = await API.get('/notifications'); // notifications fallback
        const notifRes = await API.get('/notifications');

        if (projRes.data?.projects) {
          setProjects(projRes.data.projects);
        }
        if (notifRes.data?.notifications) {
          setNotifications(notifRes.data.notifications.slice(0, 3));
        }

        // Mock invoices
        setInvoices([
          { invoiceNumber: 'L2B-2026-001', amount: 15000, status: 'Partially Paid', dueDate: '2026-09-05' }
        ]);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const activeProject = projects.find(p => p.status !== 'Completed' && p.status !== 'Launched') || projects[0];

  return (
    <div className="space-y-6 text-left">
      {/* Greetings */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Hello, {user.name}</h1>
        <p className="text-xs text-slate-500">Welcome to your Local2Brand client workspace.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Project Overview */}
          <div className="lg:col-span-2 space-y-6">
            {activeProject ? (
              <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-6 glass-panel">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-650 dark:text-yellow-400 font-bold uppercase font-mono">
                      Active Project
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">{activeProject.name}</h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{activeProject.category} Website Design</p>
                  </div>
                  <Link
                    to={`/dashboard/projects`}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-white/5 text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white flex items-center gap-1"
                  >
                    View Timeline
                    <ArrowRight size={12} />
                  </Link>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-650 dark:text-slate-400">Launch Progress</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold">{activeProject.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-500"
                      style={{ width: `${activeProject.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-white/5 pt-4 text-center">
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium">Current Stage</p>
                    <p className="text-xs font-bold text-slate-850 dark:text-slate-200 mt-0.5 truncate">{activeProject.currentStage}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium">Budget</p>
                    <p className="text-xs font-bold text-slate-850 dark:text-slate-200 mt-0.5">₹{activeProject.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium">Expected Launch</p>
                    <p className="text-xs font-bold text-slate-850 dark:text-slate-200 mt-0.5">
                      {new Date(activeProject.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-slate-900/40 border border-dashed border-slate-350 dark:border-white/5 rounded-2xl p-10 text-center space-y-4 glass-panel">
                <p className="text-slate-650 dark:text-slate-400 text-xs">No projects initiated yet.</p>
                <Link
                  to="/start-project"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold liquid-btn"
                >
                  Start Your Project
                  <PlusCircle size={14} />
                </Link>
              </div>
            )}

            {/* Quick Actions Panel */}
            <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-4 glass-panel">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to={activeProject ? `/dashboard/messages` : '#'}
                  className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 hover:border-yellow-500/30 text-center space-y-2 hover:bg-slate-200/50 dark:hover:bg-slate-900/40 transition-all flex flex-col items-center justify-center"
                >
                  <MessageSquare size={20} className="text-yellow-600 dark:text-yellow-400" />
                  <span className="text-[10px] font-bold text-slate-650 dark:text-slate-350">Message Team</span>
                </Link>
                <Link
                  to="/start-project"
                  className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 hover:border-yellow-500/30 text-center space-y-2 hover:bg-slate-200/50 dark:hover:bg-slate-900/40 transition-all flex flex-col items-center justify-center"
                >
                  <PlusCircle size={20} className="text-yellow-600 dark:text-yellow-400" />
                  <span className="text-[10px] font-bold text-slate-650 dark:text-slate-350">New Request</span>
                </Link>
                <Link
                  to={activeProject ? `/dashboard/files` : '#'}
                  className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 hover:border-yellow-500/30 text-center space-y-2 hover:bg-slate-200/50 dark:hover:bg-slate-900/40 transition-all flex flex-col items-center justify-center"
                >
                  <FileCode size={20} className="text-yellow-600 dark:text-yellow-400" />
                  <span className="text-[10px] font-bold text-slate-650 dark:text-slate-350">Upload Files</span>
                </Link>
                <Link
                  to={activeProject ? `/dashboard/invoices` : '#'}
                  className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 hover:border-yellow-500/30 text-center space-y-2 hover:bg-slate-200/50 dark:hover:bg-slate-900/40 transition-all flex flex-col items-center justify-center"
                >
                  <Landmark size={20} className="text-yellow-600 dark:text-yellow-400" />
                  <span className="text-[10px] font-bold text-slate-650 dark:text-slate-350">Invoices</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Activity Logs */}
          <div className="space-y-6 lg:col-span-1">
            {/* Activity Logs */}
            <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-5 glass-panel">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Recent Notifications</h3>
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif._id} className="flex items-start gap-3 border-b border-slate-200 dark:border-white/5 pb-3.5 last:border-b-0 last:pb-0">
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-650 dark:text-yellow-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle size={14} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{notif.title}</p>
                        <p className="text-[10px] text-slate-650 dark:text-slate-400 leading-relaxed">{notif.description}</p>
                        <span className="text-[9px] text-slate-600 block mt-1">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs">No updates logged.</p>
                )}
              </div>
            </div>

            {/* Invoice summary status card */}
            {invoices.length > 0 && (
              <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-4 glass-panel">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 font-mono">Invoice Summary</h3>
                <div className="flex justify-between items-center text-xs p-3 bg-slate-100 dark:bg-slate-950 border border-slate-250 dark:border-white/5 rounded-xl">
                  <div>
                    <p className="font-bold text-slate-850 dark:text-slate-200">{invoices[0].invoiceNumber}</p>
                    <p className="text-[10px] text-slate-550 mt-0.5">Due: {new Date(invoices[0].dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-yellow-600 dark:text-yellow-450">₹{invoices[0].amount.toLocaleString()}</p>
                    <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-450 uppercase tracking-wide mt-1">
                      {invoices[0].status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
