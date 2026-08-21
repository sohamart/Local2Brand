import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const { register, user, error, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !phone || !password) {
      setFormError('Please fill out all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    const res = await register(name, email, phone, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setFormError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 p-6 md:p-8 rounded-3xl shadow-xl space-y-6 text-left glass-panel">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Create Client Account</h2>
          <p className="text-xs text-slate-650 dark:text-slate-400">Register to submit website blueprints and trace code progress.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(formError || error) && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
              {formError || error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                placeholder="john@gmail.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                placeholder="+8801700000000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                placeholder="Min 6 chars"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold liquid-btn"
          >
            {loading ? 'Initializing account...' : 'Create Account'}
            <UserPlus size={14} />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-200 dark:border-white/5">
          <p className="text-xs text-slate-650 dark:text-slate-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
