import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  Building,
  Edit3,
  X,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import api from '../../services/api';
import { SEO } from '../../components/common/CommonUI';

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [adminNoteText, setAdminNoteText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchLeads(false);
    // Real-time live auto-refresh every 3s for new project proposals
    const pollTimer = setInterval(() => {
      fetchLeads(true);
    }, 3000);
    return () => clearInterval(pollTimer);
  }, [statusFilter, search]);

  const fetchLeads = async (silent = false) => {
    if (!silent) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await api.get(`/queries?status=${statusFilter}&search=${search}`);
      if (res?.success) {
        setLeads(res.leads || []);
      }
    } catch (err) {
      console.warn('Error fetching leads:', err);
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/queries/${id}`, { status: newStatus });
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l))
      );
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    try {
      await api.put(`/queries/${selectedLead._id}`, { adminNotes: adminNoteText });
      setLeads((prev) =>
        prev.map((l) => (l._id === selectedLead._id ? { ...l, adminNotes: adminNoteText } : l))
      );
      setSelectedLead((prev) => ({ ...prev, adminNotes: adminNoteText }));
      alert('Notes saved successfully');
    } catch (err) {
      alert('Failed to save notes: ' + err.message);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this lead?')) return;
    try {
      await api.delete(`/queries/${id}`);
      setLeads((prev) => prev.filter((l) => l._id !== id));
      if (selectedLead && selectedLead._id === id) setSelectedLead(null);
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleExportCsv = () => {
    window.open(`${api.baseUrl}/queries/export/csv`, '_blank');
  };

  return (
    <>
      <SEO title="Project Inquiries & Proposals — Admin" description="Manage incoming website leads and proposals." />

      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Project Proposals &amp; Inquiries ({leads.length})
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Desk
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review custom specs, update statuses, add notes, and export to CSV.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchLeads(false)}
              disabled={isRefreshing}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Refresh leads list"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, email, or business..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-purple-500"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="contacted">Contacted</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View (md+) */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Client</th>
                  <th className="p-4">Type / Industry</th>
                  <th className="p-4">Budget / Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No inquiries found matching criteria.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm">{lead.name}</div>
                        <div className="text-slate-400 flex items-center gap-2 mt-0.5">
                          <a href={`tel:${lead.phone}`} className="text-emerald-600 font-mono hover:underline">{lead.phone}</a>
                          <span>•</span>
                          <span className="truncate max-w-[150px]">{lead.email}</span>
                        </div>
                        {lead.businessName && (
                          <span className="inline-block text-[10px] font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full mt-1">
                            {lead.businessName}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{lead.websiteType}</div>
                        <div className="text-slate-400">{lead.industry}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-emerald-600 dark:text-emerald-400">{lead.budget}</div>
                        <div className="text-slate-400">{lead.timeline}</div>
                      </td>

                      <td className="p-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className="p-1.5 rounded-lg border text-[11px] font-bold focus:outline-none bg-slate-50 dark:bg-slate-800 cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-4 text-slate-400 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setAdminNoteText(lead.adminNotes || '');
                          }}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100 hover:text-purple-700 transition-colors cursor-pointer shadow-2xs"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteLead(lead._id)}
                          className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 hover:bg-red-100 transition-colors cursor-pointer shadow-2xs"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dedicated Mobile Card View (< md) */}
        <div className="block md:hidden space-y-4">
          {leads.length === 0 ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              No inquiries found matching criteria.
            </div>
          ) : (
            leads.map((lead) => {
              const cleanPhone = (lead.phone || '').replace(/\D/g, '');
              const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
              return (
                <div
                  key={lead._id}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        {lead.name}
                      </h3>
                      {lead.businessName && (
                        <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                          {lead.businessName}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(lead.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      className="text-[10px] font-black p-1.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Type</span>
                      <strong className="text-slate-800 dark:text-slate-200 truncate block">
                        {lead.websiteType}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Budget</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        {lead.budget}
                      </strong>
                    </div>
                  </div>

                  {/* 1-Tap Mobile Touch Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1 border border-emerald-200 dark:border-emerald-800"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${lead.phone}`}
                      className="px-2 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[11px] flex items-center justify-center gap-1 border border-blue-200 dark:border-blue-800"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>

                    <button
                      onClick={() => {
                        setSelectedLead(lead);
                        setAdminNoteText(lead.adminNotes || '');
                      }}
                      className="px-2 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-[11px] flex items-center justify-center gap-1 border border-purple-200 dark:border-purple-800 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Lead Details Modal */}
        {selectedLead && (
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in select-text modal-touch-scroll"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedLead(null);
            }}
          >
            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[88vh] sm:max-h-[92vh] flex flex-col min-h-0"
            >
              
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 shrink-0">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Proposal Details: {selectedLead.name}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">ID: {selectedLead._id}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1 min-h-0 custom-scrollbar modal-touch-scroll overscroll-contain"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div><strong className="block text-slate-400 text-[10px]">Phone:</strong> <a href={`tel:${selectedLead.phone}`} className="text-emerald-600 font-bold hover:underline font-mono">{selectedLead.phone}</a></div>
                  <div><strong className="block text-slate-400 text-[10px]">Email:</strong> <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">{selectedLead.email}</a></div>
                  <div><strong className="block text-slate-400 text-[10px]">Business:</strong> <span className="font-bold text-slate-900 dark:text-white">{selectedLead.businessName || 'N/A'}</span></div>
                  <div><strong className="block text-slate-400 text-[10px]">Website Type:</strong> <span className="font-bold text-purple-600 dark:text-purple-400">{selectedLead.websiteType}</span></div>
                  <div><strong className="block text-slate-400 text-[10px]">Industry:</strong> {selectedLead.industry}</div>
                  <div><strong className="block text-slate-400 text-[10px]">Theme:</strong> {selectedLead.themePreference || 'Modern'}</div>
                  <div><strong className="block text-slate-400 text-[10px]">Budget:</strong> <strong className="text-emerald-600 dark:text-emerald-400">{selectedLead.budget}</strong></div>
                  <div><strong className="block text-slate-400 text-[10px]">Timeline:</strong> {selectedLead.timeline}</div>
                  <div><strong className="block text-slate-400 text-[10px]">Coupon:</strong> {selectedLead.couponCode || 'None'}</div>
                </div>

                {selectedLead.selectedFeatures && selectedLead.selectedFeatures.length > 0 && (
                  <div>
                    <strong className="block text-slate-500 mb-1.5 uppercase font-bold text-[10px]">Requested Modules &amp; Features:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedLead.selectedFeatures.map((f, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-semibold text-[11px] border border-purple-200 dark:border-purple-800">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLead.requirements && (
                  <div>
                    <strong className="block text-slate-500 mb-1 uppercase font-bold text-[10px]">Client Notes / Instructions:</strong>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed">
                      {selectedLead.requirements}
                    </div>
                  </div>
                )}

                {/* Admin Internal Notes Editor */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <strong className="block text-slate-500 uppercase font-bold text-[10px]">Internal Admin Notes (Private):</strong>
                  <textarea
                    rows={3}
                    value={adminNoteText}
                    onChange={(e) => setAdminNoteText(e.target.value)}
                    placeholder="Add internal notes regarding phone call discussions, quotation updates, or developer assignments..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleSaveNotes}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm cursor-pointer"
                    >
                      Save Notes
                    </button>
                    <button
                      onClick={() => handleDeleteLead(selectedLead._id)}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Delete Inquiry
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
}
