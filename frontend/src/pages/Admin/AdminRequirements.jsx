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
  Download,
  RefreshCw,
  MessageSquare,
  Globe,
  CreditCard,
  Palette,
  Server,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  Check,
  Tag,
  ShieldCheck,
  CheckCheck,
  Utensils,
  MapPin,
  MessageCircle,
  Zap,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';
import { toast } from 'react-toastify';

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeInspectTab, setActiveInspectTab] = useState('all_steps'); // 'all_steps' | 'workflow' | 'client' | 'media'
  const [copiedId, setCopiedId] = useState(false);

  // Edit State
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editQuotedAmount, setEditQuotedAmount] = useState('');

  const fetchRequirements = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setIsRefreshing(true);
      const res = await api.get(`/requirements/admin/all?status=${statusFilter}&search=${encodeURIComponent(search)}`);
      if (res?.success && res.requirements) {
        setRequirements(res.requirements);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  };

  const contentScrollRef = React.useRef(null);

  useEffect(() => {
    if (selectedReq) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedReq]);

  useEffect(() => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }
  }, [activeInspectTab, selectedReq]);

  useEffect(() => {
    fetchRequirements(false);
    // Real-time live auto-poll every 3s
    const pollInterval = setInterval(() => {
      fetchRequirements(true);
    }, 3000);
    return () => clearInterval(pollInterval);
  }, [statusFilter, search]);

  const handleOpenDetail = (req) => {
    setSelectedReq(req);
    setEditStatus(req.status || 'Submitted');
    setEditNotes(req.internalNotes || '');
    setEditQuotedAmount(req.quotedAmount || '');
    setActiveInspectTab('all_steps');
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    toast.success(`Copied ${id} to clipboard!`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveStatus = async () => {
    if (!selectedReq) return;
    setUpdating(true);
    try {
      const res = await api.patch(`/requirements/admin/${selectedReq.requirementId || selectedReq._id}/status`, {
        status: editStatus,
        internalNotes: editNotes,
        quotedAmount: editQuotedAmount
      });
      if (res.success) {
        setSelectedReq(res.requirement);
        toast.success(`Status updated to "${editStatus}"! Notification email sent.`);
        fetchRequirements(true);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update');
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
            <span>Client Specifications &amp; Orders Desk</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Requirement Submissions ({requirements.length})
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Desk
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage comprehensive multi-step client website specifications, quotas, dynamic form answers, and sprint roadmap.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchRequirements(false)}
          disabled={isRefreshing}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
          title="Refresh requirements queue"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
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
            onKeyDown={(e) => e.key === 'Enter' && fetchRequirements(false)}
            placeholder="Search by ID, business, name, email, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
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

      {/* Requirements Desktop Table & Mobile Cards */}
      <div className="glass-panel rounded-2xl border border-white dark:border-slate-800 overflow-hidden shadow-sm">
        
        {/* Loading state */}
        {loading && requirements.length === 0 && (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-xs font-semibold">Loading requirement submissions...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && requirements.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-2">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold block">No client website requirements found in this filter.</span>
          </div>
        )}

        {/* 1. Mobile Cards View (Visible on screens < lg) */}
        {!loading && requirements.length > 0 && (
          <div className="block lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {requirements.map((req) => (
              <div key={req._id || req.requirementId} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400 block">
                      {req.requirementId}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                      {req.clientInfo?.businessName || req.websiteTypeName}
                    </h3>
                    <div className="text-[11px] text-slate-500">
                      {req.clientInfo?.ownerName || 'Client'} • {req.websiteTypeName || req.websiteType}
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shrink-0 ${STATUS_COLORS[req.status] || STATUS_COLORS.Submitted}`}>
                    {req.status || 'Submitted'}
                  </span>
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
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone</span>
                    <a href={`tel:${req.clientInfo?.mobile}`} className="text-purple-600 font-mono font-semibold">
                      {req.clientInfo?.mobile}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Admin Engine</span>
                    <strong className="text-slate-700 dark:text-slate-300 truncate block">{req.adminPanelType}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    {new Date(req.createdAt || req.submittedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleOpenDetail(req)}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-purple-500 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Answers</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Desktop Table View (Visible on lg+) */}
        {!loading && requirements.length > 0 && (
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="p-4">Requirement ID</th>
                  <th className="p-4">Client &amp; Business</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Budget &amp; Timeline</th>
                  <th className="p-4">Admin &amp; Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {requirements.map((req) => (
                  <tr key={req._id || req.requirementId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {req.requirementId}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{req.clientInfo?.businessName || req.websiteTypeName}</div>
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
                      {new Date(req.createdAt || req.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(req)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300 hover:bg-purple-100 font-bold flex items-center gap-1.5 inline-flex cursor-pointer transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect All Answers</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* COMPREHENSIVE STEP-BY-STEP INSPECT MODAL                 */}
      {/* ======================================================== */}
      {selectedReq && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl overflow-hidden animate-in fade-in select-text"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedReq(null);
          }}
        >
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] h-[92vh] flex flex-col">
            
            {/* Modal Fixed Top Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/80 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl l2b-gradient-bg text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                      {selectedReq.requirementId}
                    </span>
                    <button
                      onClick={() => handleCopyId(selectedReq.requirementId)}
                      className="text-slate-400 hover:text-purple-600 cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${STATUS_COLORS[selectedReq.status] || STATUS_COLORS.Submitted}`}>
                      {selectedReq.status || 'Submitted'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate mt-0.5">
                    {selectedReq.clientInfo?.businessName || selectedReq.websiteTypeName || 'Project Submission'}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedReq(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Segmented Navigation Bar */}
            <div className="px-4 sm:px-6 pt-3 pb-2 bg-slate-100/60 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveInspectTab('all_steps')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeInspectTab === 'all_steps'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>12-Step Form Breakdown &amp; All Answers</span>
              </button>

              <button
                onClick={() => setActiveInspectTab('workflow')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeInspectTab === 'workflow'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Workflow &amp; Quota Manager</span>
              </button>

              <button
                onClick={() => setActiveInspectTab('client')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeInspectTab === 'client'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Client &amp; Social Profile</span>
              </button>

              <button
                onClick={() => setActiveInspectTab('media')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeInspectTab === 'media'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Media &amp; Photos ({selectedReq.images?.length || 0})</span>
              </button>
            </div>

            {/* Modal Smooth Scrollable Body */}
            <div
              ref={contentScrollRef}
              className="p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-6 flex-1 text-xs scroll-smooth custom-scrollbar"
            >
              
              {/* TAB 1: ALL 12 STEPS COMPLETE BREAKDOWN */}
              {activeInspectTab === 'all_steps' && (
                <div className="space-y-6">
                  
                  {/* Quick Workflow Snapshot Bar */}
                  <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-purple-600 shrink-0" />
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          Category: {selectedReq.websiteTypeName || selectedReq.websiteType}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Budget: <strong className="text-emerald-600 dark:text-emerald-400">{selectedReq.budget}</strong> • Delivery: <strong className="text-slate-700 dark:text-slate-300">{selectedReq.timeline}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveInspectTab('workflow')}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 shadow-xs cursor-pointer"
                      >
                        Edit Status / Quote &rarr;
                      </button>
                    </div>
                  </div>

                  {/* STEP 1: Category & Vision */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">1</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Category &amp; Project Vision</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Selected Industry</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.websiteTypeName || selectedReq.websiteType}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Project Priority</span><strong className="text-purple-600 dark:text-purple-400 text-xs">{selectedReq.projectPriority || 'Normal'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Form Engine</span><strong className="text-slate-700 dark:text-slate-300 text-xs">{selectedReq.formVersion ? `Version ${selectedReq.formVersion}` : 'Default Standard'}</strong></div>
                    </div>
                  </div>

                  {/* STEP 2: Business Profile */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">2</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Business Profile &amp; Contact Details</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Business / Brand Name</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.businessName || 'N/A'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Owner / Founder Name</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.ownerName || 'N/A'}</strong></div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone / WhatsApp</span>
                        <a href={`tel:${selectedReq.clientInfo?.mobile}`} className="text-emerald-600 hover:underline font-mono font-bold text-xs">
                          {selectedReq.clientInfo?.mobile}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Client Email</span>
                        <a href={`mailto:${selectedReq.clientInfo?.email}`} className="text-purple-600 hover:underline text-xs font-semibold">
                          {selectedReq.clientInfo?.email}
                        </a>
                      </div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">City &amp; State</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.city ? `${selectedReq.clientInfo.city}, ${selectedReq.clientInfo.state || ''}` : 'N/A'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">PIN Code</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.pincode || 'N/A'}</strong></div>
                      {selectedReq.clientInfo?.address && (
                        <div className="col-span-full"><span className="text-slate-500 block text-[10px] uppercase font-bold">Full Physical Address</span><span className="text-slate-800 dark:text-slate-200 text-xs font-medium">{selectedReq.clientInfo.address}</span></div>
                      )}
                    </div>
                  </div>

                  {/* STEP 3: Industry Specific Questions & Answers */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/70 space-y-3">
                    <div className="flex items-center gap-2 border-b border-purple-200 dark:border-purple-800/70 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">3</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Industry Tailored Specifications &amp; Dynamic Answers</h4>
                    </div>
                    {selectedReq.answers && Object.keys(selectedReq.answers).length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {Object.entries(selectedReq.answers).map(([qKey, aVal]) => (
                          <div key={qKey} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                            <span className="text-[10px] font-extrabold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
                              {qKey.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                            </span>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {Array.isArray(aVal) ? aVal.join(', ') : typeof aVal === 'boolean' ? (aVal ? 'Yes' : 'No') : String(aVal || 'N/A')}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-500 italic p-2">Standard industry configurations applied.</div>
                    )}
                  </div>

                  {/* STEP 4: Configured Pages & Sitemaps */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">4</span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Pages &amp; Sitemaps Configured</h4>
                      </div>
                      <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                        {selectedReq.selectedPages?.length || 0} Custom Pages
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedReq.selectedPages && selectedReq.selectedPages.length > 0 ? (
                        selectedReq.selectedPages.map((page) => (
                          <span key={page} className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-xs">
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{page}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">No specific pages listed.</span>
                      )}
                    </div>
                  </div>

                  {/* STEP 5: Features & Logic Modules */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">5</span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Features &amp; Logic Engines</h4>
                      </div>
                      <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                        {selectedReq.selectedFeatures?.length || 0} Modules
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedReq.selectedFeatures && selectedReq.selectedFeatures.length > 0 ? (
                        selectedReq.selectedFeatures.map((feat) => (
                          <span key={feat} className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 shadow-xs">
                            <Zap className="w-3.5 h-3.5 text-purple-600" />
                            <span>{feat}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">No extra logic engines configured.</span>
                      )}
                    </div>
                    {selectedReq.orderMethods?.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Order Placement Flows:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedReq.orderMethods.map((m) => (
                            <span key={m} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                              ✓ {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* STEP 6: Payment Gateways */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">6</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Payment Gateways &amp; Checkout Setup</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedReq.paymentMethods && selectedReq.paymentMethods.length > 0 ? (
                        selectedReq.paymentMethods.map((pm) => (
                          <span key={pm} className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold text-xs flex items-center gap-1.5 shadow-xs">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{pm}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">No online payment gateway selected (Direct Lead / Inquiry based).</span>
                      )}
                    </div>
                  </div>

                  {/* STEP 7: Admin CMS Panel */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">7</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Admin CMS &amp; Back-Office Management</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Admin Panel Engine</span>
                        <strong className="text-purple-600 dark:text-purple-400 text-xs">{selectedReq.adminPanelType || 'Standard Portal'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Admin Capabilities</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedReq.adminFeatures?.length ? (
                            selectedReq.adminFeatures.map((af) => (
                              <span key={af} className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-semibold">
                                {af}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400">Default capabilities</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 8: WhatsApp & Email Alerts */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">8</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">WhatsApp &amp; Email Automation Alerts</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">WhatsApp Push Alerts</span>
                        <strong className="text-emerald-600 dark:text-emerald-400 text-xs">
                          {selectedReq.whatsappNumber ? `Enabled (${selectedReq.whatsappNumber})` : 'Standard Lead Dispatch'}
                        </strong>
                        {selectedReq.whatsappOptions?.length > 0 && (
                          <div className="text-[11px] text-slate-500 mt-1">Options: {selectedReq.whatsappOptions.join(', ')}</div>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Email Notifications</span>
                        <strong className="text-slate-800 dark:text-slate-200 text-xs">
                          {selectedReq.emailIntegration ? 'Active Automated Receipts' : 'Enabled'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* STEP 9: Design & Branding Style */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">9</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Design Style, Colors &amp; Brand Persona</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">UI Theme / Visual Persona</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.designStyle || 'Modern Glassmorphic'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Has Brand Logo</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.hasLogo === 'yes' ? 'Yes, Available' : 'Needs Custom Logo Creation'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Content Readiness</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.contentReady || 'Needs Copywriting'}</strong></div>
                    </div>
                    {selectedReq.preferredColors?.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Brand Color Palette:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedReq.preferredColors.map((col) => (
                            <span key={col} className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: col }} />
                              <span>{col}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* STEP 10: Store Photos & Logo Preview */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">10</span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Uploaded Photos, Assets &amp; Logo</h4>
                      </div>
                      <span className="text-xs font-bold text-purple-600">
                        {selectedReq.images?.length || 0} Files
                      </span>
                    </div>
                    {selectedReq.images && selectedReq.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selectedReq.images.map((imgUrl, i) => (
                          <a
                            key={i}
                            href={imgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 block shadow-xs"
                          >
                            <img src={imgUrl} alt={`Upload ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <ExternalLink className="w-4 h-4" />
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-500 italic">No media assets uploaded by client (Stock assets / Demo photos will be used).</div>
                    )}
                  </div>

                  {/* STEP 11: Domain & Cloud Hosting */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">11</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Domain, Cloud Hosting &amp; Infrastructure</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Domain Status</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.domainStatus || 'Need New Domain'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Custom Domain Name</span><strong className="text-purple-600 dark:text-purple-400 font-mono text-xs">{selectedReq.domainName || 'N/A'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Hosting Setup</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.hostingStatus || 'Cloud NVMe Included'}</strong></div>
                    </div>
                  </div>

                  {/* STEP 12: Delivery Speed & Additional Notes */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">12</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Delivery Timeline &amp; Client Special Notes</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Target Handover Timeline</span><strong className="text-purple-600 dark:text-purple-400 text-xs">{selectedReq.timeline}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Selected Investment Tier</span><strong className="text-emerald-600 dark:text-emerald-400 text-xs">{selectedReq.budget}</strong></div>
                    </div>
                    {selectedReq.additionalNotes && (
                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800">
                        <span className="text-[10px] font-extrabold uppercase text-purple-700 dark:text-purple-300 block mb-1">Client Special Instructions / Notes:</span>
                        <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{selectedReq.additionalNotes}</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 2: WORKFLOW & STATUS UPDATER */}
              {activeInspectTab === 'workflow' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-4">
                    <div className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-purple-600" />
                      <span>Workflow Status &amp; Client Quota Sign-off</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Project Sprint Status
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-purple-700 dark:text-purple-300 focus:outline-purple-500"
                        >
                          {['Submitted', 'Under Review', 'Quotation Sent', 'Approved', 'In Development', 'Completed', 'Cancelled'].map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Changing status will automatically send a branded roadmap update email to the client.
                        </span>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Official Quoted Investment
                        </label>
                        <input
                          type="text"
                          value={editQuotedAmount}
                          onChange={(e) => setEditQuotedAmount(e.target.value)}
                          placeholder="e.g. ₹24,999 (Inclusive of GST)"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-purple-500"
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Displays prominently on the client's live Track Order page.
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Private Engineering &amp; Client Status Notes
                      </label>
                      <textarea
                        rows={4}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Add technical sprint notes, Figma design links, staging URLs, or handover instructions..."
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    <button
                      onClick={handleSaveStatus}
                      disabled={updating}
                      className="px-6 py-3 rounded-xl l2b-gradient-bg text-white font-bold text-xs hover:opacity-95 shadow-md cursor-pointer transition-all disabled:opacity-50"
                    >
                      {updating ? 'Saving & Dispatching Email...' : 'Save & Dispatch Status Update 🚀'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: CLIENT CONTACT & SOCIALS */}
              {activeInspectTab === 'client' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" />
                      <span>Complete Client Profile &amp; Routing Handles</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Owner / Contact</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.ownerName || 'N/A'}</strong></div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                        <a href={`tel:${selectedReq.clientInfo?.mobile}`} className="text-emerald-600 font-mono font-bold text-xs">
                          {selectedReq.clientInfo?.mobile}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Email Address</span>
                        <a href={`mailto:${selectedReq.clientInfo?.email}`} className="text-purple-600 text-xs font-semibold">
                          {selectedReq.clientInfo?.email}
                        </a>
                      </div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Location</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.city}, {selectedReq.clientInfo?.state} ({selectedReq.clientInfo?.pincode})</strong></div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Digital &amp; Social Presence:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {selectedReq.clientInfo?.existingWebsite && (
                          <a href={selectedReq.clientInfo.existingWebsite} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-purple-600 hover:underline">
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate">Current Website</span>
                          </a>
                        )}
                        {selectedReq.clientInfo?.facebookUrl && (
                          <a href={selectedReq.clientInfo.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-blue-600 hover:underline">
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate">Facebook Page</span>
                          </a>
                        )}
                        {selectedReq.clientInfo?.instagramUrl && (
                          <a href={selectedReq.clientInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-pink-600 hover:underline">
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate">Instagram Profile</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MEDIA & PHOTOS */}
              {activeInspectTab === 'media' && (
                <div className="space-y-4">
                  {selectedReq.images && selectedReq.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {selectedReq.images.map((img, i) => (
                        <div key={i} className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                          <img src={img} alt={`Media ${i + 1}`} className="w-full aspect-video object-cover rounded-xl" />
                          <a
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[11px] flex items-center justify-center gap-1 hover:bg-purple-100"
                          >
                            <span>Open Full Size</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                      <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="font-semibold">No media photos were uploaded with this specification.</p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Fixed Bottom Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-500 font-mono">
                Order ID: <strong>{selectedReq.requirementId}</strong> • Submitted: {new Date(selectedReq.createdAt || selectedReq.submittedAt).toLocaleString()}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${selectedReq.clientInfo?.mobile?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${selectedReq.clientInfo?.ownerName || 'Client'}, this is the LOCAL2BRAND Engineering Desk regarding your website order ${selectedReq.requirementId}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 flex items-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Client</span>
                </a>

                <button
                  onClick={() => setSelectedReq(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  Close Inspect
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
