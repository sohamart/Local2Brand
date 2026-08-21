import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, Phone, Mail, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Your Workspace Profile</h1>
        <p className="text-xs text-slate-500">Manage contact information and account details.</p>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] p-6 space-y-6 glass-panel">
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/5 pb-5">
          <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-lg text-black">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{user.name}</h3>
            <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-350 dark:bg-slate-900 dark:border-white/10 text-slate-600 dark:text-slate-400 uppercase tracking-wide mt-1">
              Role: {user.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={14} />
              Profile updated successfully (Mock save)
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User size={12} className="text-yellow-600 dark:text-yellow-450" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={12} className="text-yellow-600 dark:text-yellow-450" />
                Email Address
              </label>
              <input
                type="email"
                required
                disabled
                value={formData.email}
                className="w-full px-4 py-3 bg-slate-200/50 dark:bg-slate-950/50 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-500 focus:outline-none cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Phone size={12} className="text-yellow-600 dark:text-yellow-450" />
                Phone Number
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold liquid-btn"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
