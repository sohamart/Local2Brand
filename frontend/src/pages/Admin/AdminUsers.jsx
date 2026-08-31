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
  Clock
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/common/CommonUI';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      if (res?.success) setUsers(res.users || []);
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
    try {
      await api.put(`/auth/users/${userId}`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert('Failed to update role: ' + (err.message || 'Error'));
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.put(`/auth/users/${userId}`, { status: newStatus });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u)));
    } catch (err) {
      alert('Failed to update status: ' + (err.message || 'Error'));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Permanently delete this user account?')) return;
    try {
      await api.delete(`/auth/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert('Delete failed: ' + (err.message || 'Error'));
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.company && u.company.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <SEO title="User Management — Admin" description="Manage platform accounts and administrative roles." />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Registered Users ({users.length})
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage client accounts, grant admin privileges, or suspend access.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchUsers(false)}
              disabled={isRefreshing}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Refresh user directory"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, phone number, or company..."
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

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-slate-400 text-xs">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
                        <span>Loading user directory...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-slate-400 text-xs">
                      <div className="w-10 h-10 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-2">
                        <Users className="w-5 h-5" />
                      </div>
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          <span>{u.name || 'Unnamed Client'}</span>
                          {u._id === currentUser?.id && (
                            <span className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.2 rounded font-bold">You</span>
                          )}
                        </div>
                        <div className="text-slate-400 text-[11px]">{u.company || 'Individual Client'}</div>
                      </td>

                      <td className="p-4 space-y-0.5">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{u.email}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{u.phone || 'No phone'}</div>
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleRoleToggle(u._id, u.role)}
                          disabled={u._id === currentUser?.id}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer disabled:opacity-50 transition-all ${
                            u.role === 'admin'
                              ? 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                              : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {u.role ? u.role.toUpperCase() : 'USER'}
                        </button>
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(u._id, u.status)}
                          disabled={u._id === currentUser?.id}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer disabled:opacity-50 transition-all ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800'
                          }`}
                        >
                          {u.status || 'active'}
                        </button>
                      </td>

                      <td className="p-4 text-slate-400 whitespace-nowrap text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      <td className="p-4 text-right">
                        {u._id !== currentUser?.id && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/60 cursor-pointer transition-colors"
                            title="Delete User Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
