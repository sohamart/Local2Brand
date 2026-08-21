import React, { useState, useEffect } from 'react';
import { HelpCircle, Mail, Phone, Calendar, ArrowRight, Settings } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await API.get('/admin/leads');
      if (res.data?.leads) {
        setLeads(res.data.leads);
      }
    } catch (err) {
      console.error('Error fetching leads list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await API.put(`/admin/leads/${id}`, { status });
      if (res.data?.success) {
        setLeads(prev => prev.map(l => (l._id === id ? { ...l, status } : l)));
      }
    } catch (err) {
      console.error('Error updating lead status', err);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      New: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      Contacted: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      Negotiating: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      Converted: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      Closed: 'bg-slate-500/10 border-slate-500/25 text-slate-500',
    };
    return styles[status] || 'bg-slate-500/10 text-slate-400';
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Guest Leads Catalog</h1>
        <p className="text-xs text-slate-500 font-mono">Manage leads submitted from the public contact queries.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : leads.length === 0 ? (
        <div className="text-center py-20 bg-[#090d1a]/50 border border-white/5 rounded-2xl">
          <p className="text-slate-400 text-xs">No guest inquiries recorded yet.</p>
        </div>
      ) : (
        <div className="bg-[#090d1a] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-white/5 text-slate-400 select-none">
                  <th className="p-4 font-bold uppercase tracking-wider">Lead details</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Message</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Submission Date</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Lead status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 space-y-1.5">
                      <p className="font-bold text-slate-200">{lead.name}</p>
                      {lead.businessName && <p className="text-[10px] text-slate-500">{lead.businessName}</p>}
                      <div className="flex flex-col gap-1 mt-1 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Mail size={10} />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={10} />
                          {lead.phone}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-[10px] text-slate-400 leading-relaxed whitespace-pre-wrap">{lead.message}</p>
                    </td>
                    <td className="p-4 text-slate-500">
                      <span className="flex items-center gap-1 text-[10px]">
                        <Calendar size={11} />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className={`px-2 py-1 bg-slate-950 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wide cursor-pointer focus:outline-none ${getStatusStyle(lead.status)}`}
                      >
                        {['New', 'Contacted', 'Negotiating', 'Converted', 'Closed'].map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
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

export default AdminLeads;
