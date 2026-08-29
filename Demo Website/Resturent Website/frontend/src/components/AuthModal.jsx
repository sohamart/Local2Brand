import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Loader2, 
  KeyRound,
  Flame,
  ArrowLeft,
  CheckCircle,
  Key,
  Bike
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function AuthModal({ isOpen, onClose, defaultAdminMode = false, onLoginSuccess }) {
  const { login, register } = useAuth();
  
  // 'customer' | 'rider' | 'admin' | 'register'
  const [authMode, setAuthMode] = useState(defaultAdminMode ? 'admin' : 'customer');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Password

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (defaultAdminMode) {
      setAuthMode('admin');
    }
  }, [defaultAdminMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      let loggedInUser;
      if (authMode === 'register') {
        loggedInUser = await register(formData);
      } else {
        loggedInUser = await login(formData.email.trim(), formData.password);
      }
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(loggedInUser);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!resetEmail.trim()) {
      setError('Please enter your registered email address.');
      return;
    }
    setLoading(true);

    try {
      const res = await api.forgotPassword(resetEmail.trim());
      setSuccessMsg(res.message || `OTP sent to ${resetEmail}`);
      setResetStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!resetOtp.trim() || !newPassword.trim()) {
      setError('Please provide OTP and your new password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.resetPassword({
        email: resetEmail.trim(),
        otp: resetOtp.trim(),
        newPassword
      });
      setSuccessMsg(res.message || 'Password reset successfully!');
      setTimeout(() => {
        setIsForgotPassword(false);
        setResetStep(1);
        setFormData(prev => ({ ...prev, email: resetEmail, password: '' }));
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Check OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (type) => {
    setIsForgotPassword(false);
    setError('');
    setSuccessMsg('');
    if (type === 'admin') {
      setAuthMode('admin');
      setFormData({
        email: 'admin@restaurant.com',
        password: 'admin123',
        name: '',
        phone: '',
        address: ''
      });
    } else if (type === 'rider') {
      setAuthMode('rider');
      setFormData({
        email: 'rider@restaurant.com',
        password: 'rider123',
        name: '',
        phone: '',
        address: ''
      });
    } else {
      setAuthMode('customer');
      setFormData({
        email: 'customer@example.com',
        password: 'customer123',
        name: '',
        phone: '',
        address: ''
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div 
        className="relative w-full max-w-md bg-[#231d19] border border-[#A9865A]/40 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-8 text-[#F3E9D8] my-3 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#171310] text-[#A9865A] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#171310] border border-[#A9865A]/30 flex items-center justify-center mx-auto mb-3 text-[#E8AC4E]">
            {isForgotPassword ? (
              <Key className="w-6 h-6 text-[#E8AC4E]" />
            ) : authMode === 'rider' ? (
              <Bike className="w-6 h-6 text-[#D8632C]" />
            ) : authMode === 'admin' ? (
              <ShieldCheck className="w-6 h-6 text-[#92b584]" />
            ) : (
              <Flame className="w-6 h-6 text-[#D8632C]" />
            )}
          </div>

          <h3 className="font-display text-2xl font-bold text-[#F3E9D8]">
            {isForgotPassword 
              ? 'Reset Password' 
              : authMode === 'rider'
              ? 'Rider Partner Hub'
              : authMode === 'admin' 
              ? 'Kitchen Admin Hub' 
              : authMode === 'register' 
              ? 'Register New Account' 
              : 'Customer Sign In'}
          </h3>
          <p className="font-mono text-xs text-[#A9865A] mt-1">
            {isForgotPassword 
              ? 'We will send a 6-digit verification code to your email' 
              : authMode === 'rider'
              ? 'Pick up orders, broadcast live GPS route & collect payments'
              : authMode === 'admin' 
              ? 'Manage live dispatch, menu items & payment switches' 
              : authMode === 'register' 
              ? 'Register a new account to place orders and track live deliveries' 
              : 'Access your order history & live tracking'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {!isForgotPassword && (
          <div className="grid grid-cols-4 gap-1 bg-[#171310] p-1 mb-4 rounded-xl border border-[#A9865A]/20 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => { setAuthMode('customer'); setError(''); }}
              className={`py-1.5 rounded-lg transition-all text-center ${
                authMode === 'customer' ? 'bg-[#E8AC4E] text-[#171310] font-bold shadow' : 'text-[#D6C8B2] hover:text-white'
              }`}
            >
              User
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('rider'); setError(''); }}
              className={`py-1.5 rounded-lg transition-all text-center ${
                authMode === 'rider' ? 'bg-[#D8632C] text-white font-bold shadow' : 'text-[#D6C8B2] hover:text-white'
              }`}
            >
              Rider
            </button>
            
            <button
              type="button"
              onClick={() => { setAuthMode('admin'); setError(''); }}
              className={`py-1.5 rounded-lg transition-all text-center ${
                authMode === 'admin' ? 'bg-[#33402E] text-[#92b584] font-bold shadow' : 'text-[#D6C8B2] hover:text-white'
              }`}
            >
              Admin
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('register'); setError(''); }}
              className={`py-1.5 rounded-lg transition-all text-center ${
                authMode === 'register' ? 'bg-[#E8AC4E] text-[#171310] font-bold shadow' : 'text-[#D6C8B2] hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Demo Fast Fill Buttons */}
        {!isForgotPassword && (
          <div className="grid grid-cols-3 gap-1.5 mb-5 font-mono">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-1 px-1.5 rounded-lg bg-[#171310] border border-[#A9865A]/30 text-[10px] text-[#E8AC4E] font-bold text-center hover:border-[#E8AC4E] transition-colors truncate"
            >
              ⚡ User Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('rider')}
              className="py-1 px-1.5 rounded-lg bg-[#171310] border border-[#D8632C]/50 text-[10px] text-[#D8632C] font-bold text-center hover:border-[#D8632C] transition-colors truncate"
            >
              🛵 Rider Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1 px-1.5 rounded-lg bg-[#171310] border border-[#33402E] text-[10px] text-[#92b584] font-bold text-center hover:border-[#92b584] transition-colors truncate"
            >
              👑 Admin Demo
            </button>
          </div>
        )}

        {/* Notification / Error / Success message */}
        {error && (
          <div className="p-2.5 mb-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 font-mono text-xs">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 mb-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. FORGOT PASSWORD FLOW */}
        {isForgotPassword ? (
          <div className="space-y-4 font-mono text-xs">
            {resetStep === 1 ? (
              <form onSubmit={handleSendResetOtp} className="space-y-4">
                <div>
                  <label className="text-[#D6C8B2] block mb-1">Enter your account email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#A9865A] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. customer@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#171310] border border-[#A9865A]/40 rounded-xl text-[#F3E9D8] focus:outline-none focus:border-[#D8632C]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-ember-primary w-full py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>Send 6-Digit OTP Code</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="text-[#D6C8B2] block mb-1">6-Digit Verification OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit OTP code"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/40 rounded-xl text-[#E8AC4E] text-center font-bold tracking-widest text-base focus:outline-none focus:border-[#D8632C]"
                  />
                </div>

                <div>
                  <label className="text-[#D6C8B2] block mb-1">New Password (min 6 chars)</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/40 rounded-xl text-[#F3E9D8] focus:outline-none focus:border-[#D8632C]"
                  />
                </div>

                <div>
                  <label className="text-[#D6C8B2] block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/40 rounded-xl text-[#F3E9D8] focus:outline-none focus:border-[#D8632C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-ember-primary w-full py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  <span>Set New Password & Return</span>
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => { setIsForgotPassword(false); setResetStep(1); setError(''); }}
              className="w-full text-center text-[#A9865A] hover:text-[#E8AC4E] transition-colors flex items-center justify-center gap-1 mt-2 text-[11px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        ) : (
          /* 2. REGULAR LOGIN & REGISTER FORM */
          <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
            {authMode === 'register' && (
              <div>
                <label className="text-[#D6C8B2] block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#A9865A] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/40 rounded-xl text-[#F3E9D8] focus:outline-none focus:border-[#D8632C]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[#D6C8B2] block mb-1">
                {authMode === 'rider' ? 'Rider Email' : authMode === 'admin' ? 'Admin Email' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A9865A] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder={authMode === 'rider' ? 'rider@restaurant.com' : authMode === 'admin' ? 'admin@restaurant.com' : 'you@example.com'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/40 rounded-xl text-[#F3E9D8] focus:outline-none focus:border-[#D8632C]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[#D6C8B2]">Password</label>
                {authMode !== 'register' && (
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(''); }}
                    className="text-[11px] text-[#A9865A] hover:text-[#E8AC4E] transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A9865A] absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/40 rounded-xl text-[#F3E9D8] focus:outline-none focus:border-[#D8632C]"
                />
              </div>
            </div>

            {authMode === 'register' && (
              <>
                <div>
                  <label className="text-[#D6C8B2] block mb-1">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#A9865A] absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/40 rounded-xl text-[#F3E9D8] focus:outline-none focus:border-[#D8632C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#D6C8B2] block mb-1">Delivery Address (Optional)</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#A9865A] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Flat 402, Park Street, City"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/40 rounded-xl text-[#F3E9D8] focus:outline-none focus:border-[#D8632C]"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 mt-4 shadow-lg transition-all ${
                authMode === 'rider'
                  ? 'bg-[#D8632C] hover:bg-[#e67540] text-slate-950 font-bold'
                  : authMode === 'admin'
                  ? 'bg-[#33402E] hover:bg-[#3e4f38] text-[#92b584] border border-[#92b584]/40 font-bold'
                  : 'btn-ember-primary'
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : authMode === 'rider' ? (
                <Bike className="w-4 h-4" />
              ) : authMode === 'admin' ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span>
                {authMode === 'rider'
                  ? 'Sign In to Rider Hub'
                  : authMode === 'admin' 
                  ? 'Access Admin Dashboard' 
                  : authMode === 'register' 
                  ? 'Register Account' 
                  : 'Sign In'}
              </span>
            </button>

            {/* Quick Helper Switcher for New Users */}
            <div className="text-center mt-3 font-mono text-xs text-[#A9865A]">
              {authMode === 'register' ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('customer'); setError(''); }}
                    className="text-[#E8AC4E] font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  New customer?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setError(''); }}
                    className="text-[#E8AC4E] font-bold hover:underline"
                  >
                    Register here
                  </button>
                </p>
              )}
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
