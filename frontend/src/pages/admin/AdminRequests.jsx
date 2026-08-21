import React, { useState, useEffect } from 'react';
import { HelpCircle, Check, ArrowRight, XCircle } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await API.get('/admin/projects');
      if (res.data?.projects) {
        // Filter projects that are Pending
        setRequests(res.data.projects.filter(p => p.status === 'Pending'));
      }
    } catch (err) {
      console.error('Error fetching requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      const res = await API.put(`/admin/projects/${id}`, { status: 'Planning', progress: 10 });
      if (res.data?.success) {
        setRequests(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) {
      console.error('Error accepting project request', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Project Blueprint Requests</h1>
        <p className="text-xs text-slate-500">Approve requests and assign workspace timelines to clients.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] glass-panel">
          <p className="text-slate-605 dark:text-slate-400 text-xs">No pending requests registered.</p>
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] overflow-hidden shadow-lg glass-panel">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 select-none">
                  <th className="p-4 font-bold uppercase tracking-wider">Project details</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Client info</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Target Budget</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 space-y-1">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{req.name}</p>
                      <p className="text-[10px] text-slate-550">{req.category} Platform</p>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 max-w-sm truncate">{req.description}</p>
                    </td>
                    <td className="p-4 space-y-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{req.client?.name}</p>
                      <p className="text-[10px] text-slate-550">{req.client?.email}</p>
                    </td>
                    <td className="p-4 font-extrabold text-yellow-600 dark:text-yellow-450">₹{req.budget.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleAccept(req._id)}
                        className="px-3.5 py-2 text-[10px] font-bold liquid-btn flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        Accept & Plan
                        <Check size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
