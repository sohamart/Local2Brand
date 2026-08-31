import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Send,
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  Building,
  DollarSign,
  Calendar,
  X,
  Sparkles,
  Download
} from 'lucide-react';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';

const STATUS_COLORS = {
  'Draft': 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300',
  'Submitted': 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300',
  'Under Review': 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300',
  'Quotation Sent': 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300',
  'Approved': 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300',
  'In Development': 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300',
  'Completed': 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-300',
  'Cancelled': 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300'
};

export default function AdminRequirements() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReq, setSelectedReq] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Edit State
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editQuotedAmount, setEditQuotedAmount] = useState('');

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/requirements/admin/all?status=${statusFilter}&search=${search}`);
      if (res.success && res.requirements) {
        setRequirements(res.requirements);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [statusFilter]);

  const handleOpenDetail = (req) => {
    setSelectedReq(req);
    setEditStatus(req.status || 'Submitted');
    setEditNotes(req.internalNotes || '');
    setEditQuotedAmount(req.quotedAmount || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedReq) return;
    setUpdating(true);
    try {
      const res = await api.patch(`/requirements/admin/${selectedReq._id}/status`, {
        status: editStatus,
        internalNotes: editNotes,
        quotedAmount: editQuotedAmount
      });
      if (res.success) {
        setSelectedReq(res.requirement);
        fetchRequirements();
      }
    } catch (err) {
      alert(err.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <AshokaChakra size={11} />
            <span>Client Specifications Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Requirement Submissions
          </h1>
          <p className="text-xs text-slate-500">
            Manage comprehensive multi-step client website specifications, quotas, and development handovers.
          </p>
        </div>

        <button
          onClick={fetchRequirements}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200 self-start sm:self-auto cursor-pointer"
        >
          Refresh Queue
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchRequirements()}
            placeholder="Search by ID, business, name, email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['all', 'Submitted', 'Under Review', 'Quotation Sent', 'Approved', 'In Development', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Requirements Table */}
      <div className="glass-panel rounded-2xl border border-white dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="p-4">Requirement ID</th>
                <th className="p-4">Client & Business</th>
                <th className="p-4">Category</th>
                <th className="p-4">Budget & Timeline</th>
                <th className="p-4">Admin & Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Submitted</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">Loading requirement submissions...</td>
                </tr>
              ) : requirements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">No client website requirements found in this filter.</td>
                </tr>
              ) : (
                requirements.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {req.requirementId}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{req.clientInfo?.businessName}</div>
                      <div className="text-slate-500 text-[11px]">{req.clientInfo?.ownerName} • {req.clientInfo?.mobile}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {req.websiteTypeName || req.websiteType}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">{req.budget}</div>
                      <div className="text-slate-500 text-[11px]">{req.timeline}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-700 dark:text-slate-300 font-semibold">{req.adminPanelType}</div>
                      <div className="text-slate-500 text-[11px]">{req.paymentMethods?.slice(0, 2).join(', ') || 'No Gateway'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${STATUS_COLORS[req.status] || STATUS_COLORS.Submitted}`}>
                        {req.status || 'Submitted'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(req)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300 hover:bg-purple-100 font-bold flex items-center gap-1 inline-flex cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 block">
                    Requirement Specification ({selectedReq.formVersion ? `v${selectedReq.formVersion}` : 'v1.0'})
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedReq.clientInfo?.businessName} ({selectedReq.requirementId})
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Status Update Ribbon */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3">
                <div className="font-bold text-slate-900 dark:text-white">Workflow Status & Quota Management</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    >
                      {['Submitted', 'Under Review', 'Quotation Sent', 'Approved', 'In Development', 'Completed', 'Cancelled'].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Quoted Price</label>
                    <input
                      type="text"
                      value={editQuotedAmount}
                      onChange={(e) => setEditQuotedAmount(e.target.value)}
                      placeholder="e.g. ₹24,999 + GST"
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleSaveStatus}
                      disabled={updating}
                      className="w-full py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 cursor-pointer transition-colors"
                    >
                      {updating ? 'Saving...' : 'Update Status'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-1">Client Contact</div>
                  <div><span className="text-slate-500">Owner Name:</span> <strong className="text-slate-900 dark:text-white">{selectedReq.clientInfo?.ownerName || 'N/A'}</strong></div>
                  <div><span className="text-slate-500">Phone:</span> <strong className="text-slate-900 dark:text-white">{selectedReq.clientInfo?.mobile}</strong></div>
                  <div><span className="text-slate-500">Email:</span> <strong className="text-slate-900 dark:text-white">{selectedReq.clientInfo?.email}</strong></div>
                  <div><span className="text-slate-500">City / State:</span> <strong className="text-slate-900 dark:text-white">{selectedReq.clientInfo?.city || 'N/A'}</strong></div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-1">Project Scope</div>
                  <div><span className="text-slate-500">Category:</span> <strong className="text-slate-900 dark:text-white">{selectedReq.websiteTypeName}</strong></div>
                  <div><span className="text-slate-500">Budget:</span> <strong className="text-emerald-600 dark:text-emerald-400">{selectedReq.budget}</strong></div>
                  <div><span className="text-slate-500">Timeline:</span> <strong className="text-slate-900 dark:text-white">{selectedReq.timeline}</strong></div>
                  <div><span className="text-slate-500">Design Style:</span> <strong className="text-slate-900 dark:text-white">{selectedReq.designStyle}</strong></div>
                </div>
              </div>

              {/* Selected Pages & Features */}
              <div className="space-y-3">
                <div className="font-bold text-slate-900 dark:text-white">Configured Website Pages</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedReq.selectedPages?.map((p) => (
                    <span key={p} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-bold text-slate-900 dark:text-white">Selected Functionality Modules</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedReq.selectedFeatures?.map((f) => (
                    <span key={f} className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold text-[11px] border border-purple-200 dark:border-purple-800/80">
                      ⚡ {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">Private Internal Admin Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add private meeting notes, technical constraints, team assignments..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400">
                Created on {new Date(selectedReq.createdAt).toLocaleString()}
              </span>
              <button
                onClick={() => setSelectedReq(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
