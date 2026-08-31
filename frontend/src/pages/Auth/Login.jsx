import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Eye, EyeOff, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import AshokaChakra from '../../components/common/AshokaChakra';
import { SEO } from '../../components/common/CommonUI';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@local2brand.com');
    setPassword('Admin@12345');
  };

  return (
    <>
      <SEO title="Log In — LOCAL2BRAND" description="Access your project dashboard, review website proposals, and manage custom features." />

      <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center relative">
        <div className="w-full max-w-md">
          
          {/* Glass Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-hero border border-white dark:border-slate-800 shadow-glass-lg relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl">
            
            {/* Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 text-[11px] font-bold">
                <Sparkles size={12} className="text-purple-500" />
                <span>Client & Admin Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Log in to view your proposals, requests & website settings.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-5 p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-purple-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-purple-500 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Logging in...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Fill Box for testing */}
            <div className="mt-5 p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-500/40 flex items-center justify-between">
              <div className="text-[11px] text-amber-900 dark:text-amber-300">
                <span className="font-bold">Master Admin Account:</span><br />
                admin@local2brand.com
              </div>
              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Fill Admin
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
                Create Account
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
