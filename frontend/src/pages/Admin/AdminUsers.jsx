import React, { useState, useEffect } from 'react';
import { Users, Shield, ShieldCheck, Trash2, UserCheck, AlertCircle, Mail, Phone, Building } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/common/CommonUI';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/users');
      if (res.success) setUsers(res.users || []);
    } catch (err) {
      console.warn('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change role to ${newRole.toUpperCase()}?`)) return;
    try {
      await api.put(`/auth/users/${userId}`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert('Failed to update role: ' + err.message);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.put(`/auth/users/${userId}`, { status: newStatus });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u)));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Permanently delete this user account?')) return;
    try {
      await api.delete(`/auth/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <>
      <SEO title="User Management — Admin" description="Manage platform accounts and administrative roles." />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Registered Users ({users.length})</h1>
          <p className="text-xs sm:text-sm text-slate-500">Manage client accounts, grant admin privileges, or suspend access.</p>
        </div>

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
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <span>{u.name}</span>
                        {u._id === currentUser?.id && (
                          <span className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.2 rounded font-bold">You</span>
                        )}
                      </div>
                      <div className="text-slate-400">{u.company || 'Individual Client'}</div>
                    </td>

                    <td className="p-4">
                      <div>{u.email}</div>
                      <div className="text-slate-400">{u.phone || 'No phone'}</div>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleRoleToggle(u._id, u.role)}
                        disabled={u._id === currentUser?.id}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer disabled:opacity-50 ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </button>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleStatusToggle(u._id, u.status)}
                        disabled={u._id === currentUser?.id}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer disabled:opacity-50 ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {u.status || 'active'}
                      </button>
                    </td>

                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      {u._id !== currentUser?.id && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
