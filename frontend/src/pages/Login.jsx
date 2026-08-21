import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const { login, user, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    // If already logged in, redirect
    if (user) {
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill out all fields.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      // Auth context hooks handles navigation since it triggers state refresh
    } else {
      setFormError(res.message || 'Invalid Credentials');
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center p-6">
      <div className="w-full max-w-[420px] bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 p-6 md:p-8 rounded-3xl shadow-xl space-y-6 text-left glass-panel">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">Enter details to check your project status dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(formError || error) && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
              {formError || error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
              placeholder="admin@gmail.com or john@gmail.com"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
              placeholder="password123"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold liquid-btn"
          >
            {loading ? 'Verifying Session...' : 'Login'}
            <LogIn size={14} />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-200 dark:border-white/5">
          <p className="text-xs text-slate-650 dark:text-slate-400 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
