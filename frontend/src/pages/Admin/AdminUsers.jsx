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
  MessageCircle,
  LayoutGrid,
  List,
  UserPlus
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { SEO } from '../../components/common/CommonUI';
import DashboardLoader from '../../components/common/DashboardLoader';
import AshokaChakra from '../../components/common/AshokaChakra';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'verified' | 'unverified' | 'vip' | 'admins' | 'clients'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inspectingUser, setInspectingUser] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Admin Direct Edit State (Zero OTP required for admin)
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [isSavingDirectEdit, setIsSavingDirectEdit] = useState(false);

  useEffect(() => {
    if (inspectingUser) {
      setEditName(inspectingUser.name || '');
      setEditEmail(inspectingUser.email || '');
      setEditPhone(inspectingUser.phone || '');
      setEditCompany(inspectingUser.company || '');
    }
  }, [inspectingUser]);

  useEffect(() => {
    fetchUsers(false);
    // Real-time live auto-refresh every 15s
    const pollInterval = setInterval(() => {
      fetchUsers(true);
    }, 15000);
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
      setUsers((prev) => prev.map((u) => (u._id === userId || u.id === userId ? { ...u, role: newRole } : u)));
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
      setUsers((prev) => prev.map((u) => (u._id === userId || u.id === userId ? { ...u, status: newStatus } : u)));
      toast.success(`Account marked as ${newStatus.toUpperCase()}`);
    } catch (err) {
      toast.error('Failed to update status: ' + (err.message || 'Error'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleVerification = async (userId) => {
    // 1. Optimistic live UI update (0ms immediate feedback)
    setUsers((prev) =>
      prev.map((u) => {
        if (u._id === userId || u.id === userId) {
          return { ...u, isEmailVerified: !Boolean(u.isEmailVerified) };
        }
        return u;
      })
    );
    if (inspectingUser && (inspectingUser._id === userId || inspectingUser.id === userId)) {
      setInspectingUser((prev) => ({ ...prev, isEmailVerified: !Boolean(prev.isEmailVerified) }));
    }

    setActionLoadingId(userId);
    try {
      const res = await api.put(`/auth/users/${userId}/toggle-verify`);
      if (res?.success && res?.user) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId || u.id === userId
              ? { ...u, isEmailVerified: res.user.isEmailVerified }
              : u
          )
        );
        if (inspectingUser && (inspectingUser._id === userId || inspectingUser.id === userId)) {
          setInspectingUser((prev) => ({ ...prev, isEmailVerified: res.user.isEmailVerified }));
        }
        toast.success(res.message || 'Verification status updated!');
      } else {
        // Revert on unexpected response
        fetchUsers(true);
      }
    } catch (err) {
      toast.error('Failed to toggle verification: ' + (err.message || 'Error'));
      fetchUsers(true);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleVipWhatsapp = async (userId) => {
    // 1. Optimistic live UI update (0ms immediate feedback)
    setUsers((prev) =>
      prev.map((u) => {
        if (u._id === userId || u.id === userId) {
          return { ...u, vipWhatsappEnabled: !Boolean(u.vipWhatsappEnabled) };
        }
        return u;
      })
    );
    if (inspectingUser && (inspectingUser._id === userId || inspectingUser.id === userId)) {
      setInspectingUser((prev) => ({ ...prev, vipWhatsappEnabled: !Boolean(prev.vipWhatsappEnabled) }));
    }

    setActionLoadingId(`vip_${userId}`);
    try {
      const res = await api.put(`/auth/users/${userId}/toggle-vip-whatsapp`);
      if (res?.success && res?.user) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId || u.id === userId
              ? { ...u, vipWhatsappEnabled: res.user.vipWhatsappEnabled }
              : u
          )
        );
        if (inspectingUser && (inspectingUser._id === userId || inspectingUser.id === userId)) {
          setInspectingUser((prev) => ({ ...prev, vipWhatsappEnabled: res.user.vipWhatsappEnabled }));
        }
        toast.success(res.message || 'VIP WhatsApp Support status updated!');
      } else {
        fetchUsers(true);
      }
    } catch (err) {
      toast.error('Failed to toggle VIP WhatsApp: ' + (err.message || 'Error'));
      fetchUsers(true);
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

  const handleAdminDirectSave = async (e) => {
    if (e) e.preventDefault();
    if (!inspectingUser) return;
    const userId = inspectingUser._id || inspectingUser.id;

    if (!editEmail.includes('@')) {
      toast.warn('Please enter a valid email address');
      return;
    }

    setIsSavingDirectEdit(true);
    try {
      const res = await api.put(`/auth/users/${userId}`, {
        name: editName.trim(),
        email: editEmail.toLowerCase().trim(),
        phone: editPhone.trim(),
        company: editCompany.trim(),
      });
      if (res?.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId || u.id === userId
              ? { ...u, name: editName.trim(), email: editEmail.toLowerCase().trim(), phone: editPhone.trim(), company: editCompany.trim() }
              : u
          )
        );
        setInspectingUser((prev) => ({
          ...prev,
          name: editName.trim(),
          email: editEmail.toLowerCase().trim(),
          phone: editPhone.trim(),
          company: editCompany.trim(),
        }));
        toast.success(res.message || 'Client profile & credentials updated directly by Admin (Zero OTP)! ✅');
      }
    } catch (err) {
      toast.error('Failed to update credentials: ' + (err.message || 'Error'));
    } finally {
      setIsSavingDirectEdit(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Permanently delete this user account?')) return;
    setActionLoadingId(userId);
    try {
      await api.delete(`/auth/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId && u.id !== userId));
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
  const vipCount = users.filter((u) => u.vipWhatsappEnabled).length;
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
    if (filterType === 'vip') return Boolean(u.vipWhatsappEnabled);
    if (filterType === 'admins') return u.role === 'admin';
    if (filterType === 'clients') return u.role !== 'admin';
    return true;
  });

  return (
    <>
      <SEO title="User Directory & Client Verification — Admin" description="Manage platform client accounts, email verification status, and VIP privileges." />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>User Directory</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                  {users.length}
                </span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage client accounts, grant VIP WhatsApp developer hotlines, verify email OTP status, and moderate permissions.
            </p>
          </div>

          {/* Right Action Controls: View Switcher & Refresh */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Clean List View"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compact List</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => fetchUsers(false)}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
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
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              filterType === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>All Users</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 dark:bg-white/20">{users.length}</span>
          </button>

          <button
            onClick={() => setFilterType('vip')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              filterType === 'vip'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>💎 VIP WhatsApp</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold">{vipCount}</span>
          </button>

          <button
            onClick={() => setFilterType('verified')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              filterType === 'verified'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verified (OTP)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold">{verifiedCount}</span>
          </button>

          <button
            onClick={() => setFilterType('unverified')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
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
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
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
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
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

        {/* ========================================================================= */}
        {/* MAIN USER DIRECTORY DISPLAY (ZERO HORIZONTAL SCROLL - NEVER CUT OFF) */}
        {/* ========================================================================= */}
        {loading && users.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <DashboardLoader
              title="Loading User Directory & Client Accounts..."
              subtitle="Fetching registered client profiles and account permissions..."
              role="admin"
            />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-1">No Users Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              No registered user profiles matched your search or active filter criteria.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* ========================================================================= */
          /* VIEW 1: SMART CARDS GRID (1 Col Mobile, 2 Col Tablet, 3 Col Desktop) */
          /* ========================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredUsers.map((u) => {
              const isCurrent = u._id === currentUser?.id || u.id === currentUser?.id;
              const isBusy = actionLoadingId === u._id || actionLoadingId === `otp_${u._id}` || actionLoadingId === `vip_${u._id}`;
              const cleanPhone = (u.phone || '').replace(/[^0-9]/g, '');
              const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

              return (
                <div
                  key={u._id || u.id}
                  className={`p-5 rounded-3xl bg-white dark:bg-slate-900/90 border transition-all duration-200 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md ${
                    u.vipWhatsappEnabled
                      ? 'border-emerald-500/40 dark:border-emerald-500/30 ring-1 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-purple-500/40'
                  }`}
                >
                  {/* Top: Avatar + Client Header + Role / Status */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div
                          onClick={() => setInspectingUser(u)}
                          className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-black text-sm shadow-xs border border-white/80 dark:border-slate-700 shrink-0 cursor-pointer hover:scale-105 transition-transform"
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

                        {/* Name & Subtitle */}
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
                          <div className="text-slate-400 text-xs truncate">
                            {u.company || 'Individual Client'}
                          </div>
                        </div>
                      </div>

                      {/* Role & Status Toggles */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRoleToggle(u._id || u.id, u.role)}
                          disabled={isCurrent || isBusy}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border cursor-pointer disabled:opacity-50 transition-all ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                              : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                          title="Click to toggle Role"
                        >
                          {u.role ? u.role.toUpperCase() : 'USER'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusToggle(u._id || u.id, u.status)}
                          disabled={isCurrent || isBusy}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer disabled:opacity-50 transition-all ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800'
                          }`}
                          title="Click to toggle Status"
                        >
                          {u.status || 'active'}
                        </button>
                      </div>
                    </div>

                    {/* Middle: Contact Info Box with 1-click WhatsApp */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      {/* Email */}
                      <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a href={`mailto:${u.email}`} className="hover:underline truncate text-[11px] font-medium">
                          {u.email}
                        </a>
                      </div>

                      {/* Phone + WhatsApp Chat */}
                      <div className="flex items-center justify-between gap-2 text-[11px] pt-0.5">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono truncate">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{u.phone || 'No phone'}</span>
                        </div>

                        {u.phone && (
                          <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${u.name || 'there'}! 👋 This is from LOCAL2BRAND Admin Team.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold text-[10px] flex items-center gap-1 shrink-0 transition-colors"
                            title="Open direct WhatsApp conversation"
                          >
                            <MessageCircle className="w-3 h-3 text-emerald-500" />
                            <span>WhatsApp Chat</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Privileges & Verification Controls */}
                    <div className="space-y-2 pt-1">
                      {/* VIP WhatsApp Toggle Card */}
                      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <div className="text-[11px]">
                            <span className="font-extrabold text-slate-900 dark:text-white block leading-tight">
                              VIP WhatsApp Support
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {u.vipWhatsappEnabled ? 'Direct hotline active' : 'Standard icon only'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleVipWhatsapp(u._id || u.id)}
                          disabled={actionLoadingId === `vip_${u._id || u.id}`}
                          className={`px-3 py-1 rounded-xl text-[10px] font-black cursor-pointer shadow-xs transition-all active:scale-95 ${
                            u.vipWhatsappEnabled
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                              : 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {u.vipWhatsappEnabled ? '💎 VIP Active' : 'Grant VIP'}
                        </button>
                      </div>

                      {/* Email Verification Status & Action */}
                      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                        <div className="flex items-center gap-1.5">
                          {u.isEmailVerified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Verified (Active) ✅</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60">
                              <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              <span>Unverified ⚠️</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {!u.isEmailVerified && (
                            <button
                              type="button"
                              onClick={() => handleSendOtpToUser(u._id || u.id, u.email)}
                              disabled={actionLoadingId === `otp_${u._id || u.id}`}
                              className="px-2 py-1 rounded-xl text-[10px] font-black bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 cursor-pointer flex items-center gap-1 transition-colors"
                              title="Resend 6-digit OTP to user"
                            >
                              <Send className="w-2.5 h-2.5" />
                              <span>Send OTP</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleVerification(u._id || u.id)}
                            disabled={isBusy}
                            className={`px-3 py-1 rounded-xl text-[10px] font-black border cursor-pointer shadow-xs transition-all active:scale-95 ${
                              u.isEmailVerified
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600'
                            }`}
                            title={u.isEmailVerified ? 'Revoke verification (Make Unverified)' : 'Mark user email as verified'}
                          >
                            {u.isEmailVerified ? 'Make Unverified ⚠️' : 'Mark Verified ✅'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Metrics + Full Profile Inspector & Delete Action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                        📦 {u.ordersCount || 0} Orders
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                        💬 {u.inquiriesCount || 0} Inquiries
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setInspectingUser(u)}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px] font-extrabold flex items-center gap-1 hover:bg-purple-100 cursor-pointer transition-colors"
                        title="View & Edit Full Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u._id || u.id)}
                          disabled={isBusy}
                          className="p-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 hover:bg-red-100 cursor-pointer transition-colors"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: COMPACT CLEAN LIST (Full Width Flex Rows - ZERO SLIDE) */
          /* ========================================================================= */
          <div className="space-y-3">
            {filteredUsers.map((u) => {
              const isCurrent = u._id === currentUser?.id || u.id === currentUser?.id;
              const isBusy = actionLoadingId === u._id || actionLoadingId === `otp_${u._id}` || actionLoadingId === `vip_${u._id}`;
              const cleanPhone = (u.phone || '').replace(/[^0-9]/g, '');
              const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

              return (
                <div
                  key={u._id || u.id}
                  className={`p-4 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm ${
                    u.vipWhatsappEnabled
                      ? 'border-emerald-500/40 dark:border-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Left: User identity & contact */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      onClick={() => setInspectingUser(u)}
                      className="w-11 h-11 rounded-2xl overflow-hidden bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0 cursor-pointer"
                    >
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      ) : (
                        u.name?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          onClick={() => setInspectingUser(u)}
                          className="font-extrabold text-slate-900 dark:text-white text-sm hover:text-purple-600 cursor-pointer truncate"
                        >
                          {u.name || 'Unnamed Client'}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.2 rounded font-bold">
                            You
                          </span>
                        )}
                        <span className={`px-2 py-0.2 rounded-full text-[9px] font-black border ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {u.role ? u.role.toUpperCase() : 'USER'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                        <span className="truncate">{u.email}</span>
                        {u.phone && <span>• {u.phone}</span>}
                        {u.company && <span>• {u.company}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right: Badges + Privilege Controls + Actions */}
                  <div className="flex items-center gap-2.5 flex-wrap justify-between lg:justify-end shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    {/* VIP WhatsApp Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleVipWhatsapp(u._id || u.id)}
                      disabled={actionLoadingId === `vip_${u._id || u.id}`}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all shadow-xs ${
                        u.vipWhatsappEnabled
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {u.vipWhatsappEnabled ? '💎 VIP Active' : 'Grant VIP'}
                    </button>

                    {/* Email Verification Status & Action */}
                    <div className="flex items-center gap-1.5">
                      {u.isEmailVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Verified ✅</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60">
                          <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>Unverified ⚠️</span>
                        </span>
                      )}

                      {!u.isEmailVerified && (
                        <button
                          type="button"
                          onClick={() => handleSendOtpToUser(u._id || u.id, u.email)}
                          disabled={actionLoadingId === `otp_${u._id || u.id}`}
                          className="px-2 py-1 rounded-xl text-[10px] font-black bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 cursor-pointer flex items-center gap-1"
                          title="Resend verification OTP"
                        >
                          <Send className="w-2.5 h-2.5" />
                          <span>OTP</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleVerification(u._id || u.id)}
                        disabled={isBusy}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-black border cursor-pointer transition-all active:scale-95 ${
                          u.isEmailVerified
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600'
                        }`}
                        title={u.isEmailVerified ? 'Revoke verification (Make Unverified)' : 'Mark user email as verified'}
                      >
                        {u.isEmailVerified ? 'Make Unverified ⚠️' : 'Mark Verified ✅'}
                      </button>
                    </div>

                    {/* Quick WhatsApp Chat */}
                    {u.phone && (
                      <a
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${u.name || 'there'}! 👋 This is from LOCAL2BRAND Admin Team.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 cursor-pointer transition-colors"
                        title="WhatsApp Chat"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}

                    {/* Inspect Profile */}
                    <button
                      type="button"
                      onClick={() => setInspectingUser(u)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold hover:bg-purple-100 cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    {/* Delete button */}
                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u._id || u.id)}
                        disabled={isBusy}
                        className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 hover:bg-red-100 cursor-pointer transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* USER INSPECTION MODAL DRAWER */}
        {/* ========================================================================= */}
        {inspectingUser && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
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
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">VIP WhatsApp Status</span>
                    {inspectingUser.vipWhatsappEnabled ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>💎 VIP Hotline Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 font-bold text-xs">
                        <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>Standard Only</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* VIP Support Action Highlight Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-indigo-500/10 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        <span>VIP 1-on-1 WhatsApp Support Privilege</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {inspectingUser.vipWhatsappEnabled
                          ? 'This user sees the glowing VIP Direct WhatsApp Support button in their dashboard.'
                          : 'This user currently sees only standard contact icons without VIP priority.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleVipWhatsapp(inspectingUser._id || inspectingUser.id)}
                      disabled={actionLoadingId === `vip_${inspectingUser._id || inspectingUser.id}`}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer shadow-xs transition-all ${
                        inspectingUser.vipWhatsappEnabled
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {inspectingUser.vipWhatsappEnabled ? 'Revoke VIP' : 'Grant VIP Support 💎'}
                    </button>
                  </div>
                  {inspectingUser.vipWhatsappEnabled && (
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                      ✓ In-app inbox alert and confirmation email were dispatched to {inspectingUser.email}.
                    </p>
                  )}
                </div>

                {/* Account Email Verification Action Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {inspectingUser.isEmailVerified ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                        <span>Account Status: {inspectingUser.isEmailVerified ? 'VERIFIED (ACTIVE) ✅' : 'UNVERIFIED (PENDING) ⚠️'}</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {inspectingUser.isEmailVerified
                          ? 'Client email is verified and their account has full active access.'
                          : 'Client email is unverified and requires OTP activation.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!inspectingUser.isEmailVerified && (
                        <button
                          type="button"
                          onClick={() => handleSendOtpToUser(inspectingUser._id || inspectingUser.id, inspectingUser.email)}
                          disabled={actionLoadingId === `otp_${inspectingUser._id || inspectingUser.id}`}
                          className="px-3 py-1.5 rounded-xl font-bold text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 cursor-pointer flex items-center gap-1 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send OTP</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleVerification(inspectingUser._id || inspectingUser.id)}
                        disabled={actionLoadingId === inspectingUser._id || actionLoadingId === inspectingUser.id}
                        className={`px-3.5 py-1.5 rounded-xl font-black text-xs cursor-pointer shadow-xs transition-all active:scale-95 ${
                          inspectingUser.isEmailVerified
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                        }`}
                      >
                        {inspectingUser.isEmailVerified ? 'Make Unverified ⚠️' : 'Mark Verified ✅'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Profile & Credentials Editor (Admin Mode — Zero OTP) */}
                <form onSubmit={handleAdminDirectSave} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                        Direct Credentials Editor (Admin Mode — Zero OTP)
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      Master Override
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Update this client's name, registered email, phone, and organization directly without requiring any OTP confirmation.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Client Full Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Client Name"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Registered Email (Direct)
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="client@email.com"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-800 text-xs font-semibold text-purple-700 dark:text-purple-300 focus:outline-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        WhatsApp / Contact Mobile (Direct)
                      </label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 focus:outline-purple-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={editCompany}
                        onChange={(e) => setEditCompany(e.target.value)}
                        placeholder="Company Name"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-purple-500"
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSavingDirectEdit}
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 cursor-pointer shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      {isSavingDirectEdit ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Changes Directly (No OTP)</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

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
