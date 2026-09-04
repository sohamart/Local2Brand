import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  Trash2,
  UserCheck,
  AlertCircle,
  Mail,
  Phone,
  Building,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Check,
  X,
  ExternalLink,
  Eye,
  FileText,
  MessageSquare,
  Sparkles,
  Zap,
  Filter,
  MessageCircle
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { SEO } from '../../components/common/CommonUI';
import DashboardLoader from '../../components/common/DashboardLoader';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'verified' | 'unverified' | 'admins' | 'clients'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inspectingUser, setInspectingUser] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchUsers(false);
    // Real-time live auto-refresh every 4s
    const pollInterval = setInterval(() => {
      fetchUsers(true);
    }, 4000);
    return () => clearInterval(pollInterval);
  }, []);

  const fetchUsers = async (silent = false) => {
    if (!silent) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await api.get('/auth/users');
      if (res?.success) {
        setUsers(res.users || []);
        if (inspectingUser) {
          const fresh = (res.users || []).find((u) => u._id === inspectingUser._id || u.id === inspectingUser.id);
          if (fresh) setInspectingUser(fresh);
        }
      }
    } catch (err) {
      console.warn('Error fetching users:', err);
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change role to ${newRole.toUpperCase()}?`)) return;
    setActionLoadingId(userId);
    try {
      await api.put(`/auth/users/${userId}`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      toast.success(`Role updated to ${newRole.toUpperCase()}`);
    } catch (err) {
      toast.error('Failed to update role: ' + (err.message || 'Error'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setActionLoadingId(userId);
    try {
      await api.put(`/auth/users/${userId}`, { status: newStatus });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u)));
      toast.success(`Account marked as ${newStatus.toUpperCase()}`);
    } catch (err) {
      toast.error('Failed to update status: ' + (err.message || 'Error'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleVerification = async (userId) => {
    setActionLoadingId(userId);
    try {
      const res = await api.put(`/auth/users/${userId}/toggle-verify`);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId || u.id === userId ? { ...u, isEmailVerified: res.user?.isEmailVerified } : u))
        );
        if (inspectingUser && (inspectingUser._id === userId || inspectingUser.id === userId)) {
          setInspectingUser((prev) => ({ ...prev, isEmailVerified: res.user?.isEmailVerified }));
        }
        toast.success(res.message || 'Verification status updated!');
      }
    } catch (err) {
      toast.error('Failed to toggle verification: ' + (err.message || 'Error'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSendOtpToUser = async (userId, userEmail) => {
    setActionLoadingId(`otp_${userId}`);
    try {
      const res = await api.post(`/auth/users/${userId}/resend-otp`);
      if (res.success) {
        toast.success(`🚀 6-Digit OTP dispatched to ${userEmail}!`);
      }
    } catch (err) {
      toast.error('Failed to send OTP: ' + (err.message || 'Error'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Permanently delete this user account?')) return;
    setActionLoadingId(userId);
    try {
      await api.delete(`/auth/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      if (inspectingUser && (inspectingUser._id === userId || inspectingUser.id === userId)) {
        setInspectingUser(null);
      }
      toast.success('User account deleted');
    } catch (err) {
      toast.error('Delete failed: ' + (err.message || 'Error'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const verifiedCount = users.filter((u) => u.isEmailVerified).length;
  const unverifiedCount = users.filter((u) => !u.isEmailVerified).length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const clientCount = users.filter((u) => u.role !== 'admin').length;

  const filteredUsers = users.filter((u) => {
    // 1. Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q)) ||
        (u.company && u.company.toLowerCase().includes(q));
      if (!match) return false;
    }

    // 2. Type filter
    if (filterType === 'verified') return Boolean(u.isEmailVerified);
    if (filterType === 'unverified') return !Boolean(u.isEmailVerified);
    if (filterType === 'admins') return u.role === 'admin';
    if (filterType === 'clients') return u.role !== 'admin';
    return true;
  });

  return (
    <>
      <SEO title="User Directory & Client Verification — Admin" description="Manage platform client accounts, email verification status, and admin roles." />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                User Directory ({users.length})
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage client accounts, review email OTP verification status, inspect avatars, or toggle privileges.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchUsers(false)}
              disabled={isRefreshing}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
              title="Refresh user directory"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Metric Summary Row */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              filterType === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>All Users</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 dark:bg-white/20">{users.length}</span>
          </button>

          <button
            onClick={() => setFilterType('verified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              filterType === 'verified'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verified</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold">{verifiedCount}</span>
          </button>

          <button
            onClick={() => setFilterType('unverified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              filterType === 'unverified'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-700 dark:text-amber-400 hover:bg-slate-50'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Unverified (Pending OTP)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold">{unverifiedCount}</span>
          </button>

          <button
            onClick={() => setFilterType('clients')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              filterType === 'clients'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>Clients</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 dark:bg-white/20">{clientCount}</span>
          </button>

          <button
            onClick={() => setFilterType('admins')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              filterType === 'admins'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-500" />
            <span>Admins</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 dark:bg-white/20">{adminCount}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search directory by client name, email, phone number, or company..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Users Table Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Client / User</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Email Status</th>
                  <th className="p-4">Activity</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400 text-xs">
                      <DashboardLoader
                        title="Loading User Directory & Client Accounts..."
                        subtitle="Fetching registered client profiles and account permissions..."
                        role="admin"
                      />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-slate-400 text-xs">
                      <div className="w-10 h-10 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-2">
                        <Users className="w-5 h-5" />
                      </div>
                      No users found matching your search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isCurrent = u._id === currentUser?.id || u.id === currentUser?.id;
                    const isBusy = actionLoadingId === u._id || actionLoadingId === `otp_${u._id}`;

                    return (
                      <tr key={u._id || u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        {/* User / Avatar Column */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              onClick={() => setInspectingUser(u)}
                              className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-black text-sm shadow-xs border border-white/80 dark:border-slate-700 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                              title="Click to inspect profile"
                            >
                              {u.avatar ? (
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                u.name?.[0]?.toUpperCase() || 'U'
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 truncate">
                                <span
                                  onClick={() => setInspectingUser(u)}
                                  className="hover:text-purple-600 cursor-pointer truncate"
                                >
                                  {u.name || 'Unnamed Client'}
                                </span>
                                {isCurrent && (
                                  <span className="text-[9px] bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.2 rounded font-bold shrink-0">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-400 text-[11px] truncate">
                                {u.company || 'Individual Client'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact Info Column */}
                        <td className="p-4 space-y-0.5 min-w-[180px]">
                          <div className="font-medium text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <a href={`mailto:${u.email}`} className="hover:underline truncate">
                              {u.email}
                            </a>
                          </div>
                          <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{u.phone || 'No phone provided'}</span>
                          </div>
                        </td>

                        {/* Email Verification Status & Action Column */}
                        <td className="p-4 min-w-[170px]">
                          <div className="flex flex-col items-start gap-1.5">
                            {u.isEmailVerified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/40">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span>Verified (OTP)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-600/40">
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                                <span>Unverified</span>
                              </span>
                            )}

                            {/* Verification Quick Action Controls */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleToggleVerification(u._id || u.id)}
                                disabled={isBusy}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border cursor-pointer transition-all ${
                                  u.isEmailVerified
                                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                }`}
                                title={u.isEmailVerified ? 'Mark as Unverified' : 'Mark as Verified'}
                              >
                                {u.isEmailVerified ? 'Mark Unverified' : 'Mark Verified ✅'}
                              </button>

                              {!u.isEmailVerified && (
                                <button
                                  type="button"
                                  onClick={() => handleSendOtpToUser(u._id || u.id, u.email)}
                                  disabled={actionLoadingId === `otp_${u._id}`}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800 cursor-pointer flex items-center gap-1"
                                  title="Send fresh OTP code to user's email"
                                >
                                  <Send className="w-2.5 h-2.5" />
                                  <span>Send OTP</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Activity Summary Column */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-[11px] text-slate-700 dark:text-slate-300"
                              title="Submitted Orders / Requirements"
                            >
                              📦 {u.ordersCount || 0} Orders
                            </span>
                            <span
                              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-[11px] text-slate-700 dark:text-slate-300"
                              title="Proposals / Inquiries"
                            >
                              💬 {u.inquiriesCount || 0}
                            </span>
                          </div>
                        </td>

                        {/* Role Column */}
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleRoleToggle(u._id || u.id, u.role)}
                            disabled={isCurrent || isBusy}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border cursor-pointer disabled:opacity-50 transition-all ${
                              u.role === 'admin'
                                ? 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                                : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {u.role ? u.role.toUpperCase() : 'USER'}
                          </button>
                        </td>

                        {/* Status Column */}
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleStatusToggle(u._id || u.id, u.status)}
                            disabled={isCurrent || isBusy}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer disabled:opacity-50 transition-all ${
                              u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800'
                            }`}
                          >
                            {u.status || 'active'}
                          </button>
                        </td>

                        {/* Actions Column */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {u.phone && (
                              <a
                                href={`https://wa.me/${u.phone.replace(/[^0-9]/g, '').length === 10 ? '91' + u.phone.replace(/[^0-9]/g, '') : u.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${u.name || 'there'}! 👋 This is from LOCAL2BRAND Admin Team regarding your account/website requirements.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:hover:bg-emerald-900/60 cursor-pointer transition-colors flex items-center justify-center"
                                title={`Direct WhatsApp Chat with ${u.name || 'User'} (${u.phone})`}
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => setInspectingUser(u)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                              title="Inspect Full User Profile"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {!isCurrent && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u._id || u.id)}
                                disabled={isBusy}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/60 cursor-pointer transition-colors"
                                title="Delete User Account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Inspection Modal Drawer */}
        {inspectingUser && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
          >
            <div
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
              data-lenis-prevent="true"
            >
              {/* Modal Header */}
              <div className="p-5 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-purple-950/30 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-lg shadow-md border-2 border-white dark:border-slate-700 shrink-0">
                    {inspectingUser.avatar ? (
                      <img src={inspectingUser.avatar} alt={inspectingUser.name} className="w-full h-full object-cover" />
                    ) : (
                      inspectingUser.name?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {inspectingUser.name || 'Unnamed Client'}
                    </h2>
                    <p className="text-xs text-slate-500">{inspectingUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setInspectingUser(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div
                className="p-6 overflow-y-auto space-y-5 text-xs flex-1 overscroll-contain"
                data-lenis-prevent="true"
              >
                {/* Avatar Preview High-Res */}
                {inspectingUser.avatar && (
                  <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                      User Profile Picture
                    </span>
                    <img
                      src={inspectingUser.avatar}
                      alt={inspectingUser.name}
                      className="w-24 h-24 rounded-2xl object-cover mx-auto shadow-md border border-slate-300 dark:border-slate-600"
                    />
                  </div>
                )}

                {/* Account Badges Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Email Verification</span>
                    {inspectingUser.isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Pending Verification</span>
                      </span>
                    )}
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Account Role</span>
                    <span className="font-extrabold text-purple-600 dark:text-purple-400 uppercase text-xs">
                      {inspectingUser.role || 'USER'}
                    </span>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-400">Phone Number:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{inspectingUser.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-400">Company:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{inspectingUser.company || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-400">Registered On:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {inspectingUser.createdAt ? new Date(inspectingUser.createdAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Total Orders Logged:</span>
                    <span className="font-extrabold text-purple-600 dark:text-purple-400">
                      {inspectingUser.ordersCount || 0} specifications
                    </span>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex flex-col gap-2 pt-2">
                  {inspectingUser.phone && (
                    <a
                      href={`https://wa.me/${inspectingUser.phone.replace(/[^0-9]/g, '').length === 10 ? '91' + inspectingUser.phone.replace(/[^0-9]/g, '') : inspectingUser.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${inspectingUser.name || 'there'}! 👋 This is from LOCAL2BRAND Admin Team regarding your account/website requirements.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Direct WhatsApp Chat ({inspectingUser.phone})</span>
                    </a>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleToggleVerification(inspectingUser._id || inspectingUser.id)}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{inspectingUser.isEmailVerified ? 'Mark as Unverified' : 'Mark as Verified'}</span>
                    </button>

                    <button
                      onClick={() => handleSendOtpToUser(inspectingUser._id || inspectingUser.id, inspectingUser.email)}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 hover:bg-purple-100 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Verification Code</span>
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
