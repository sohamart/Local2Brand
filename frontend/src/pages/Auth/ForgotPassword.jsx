import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Eye, EyeOff, KeyRound, CheckCircle2, RotateCw } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { SEO } from '../../components/common/CommonUI';
import PasswordStrengthMeter, { calculatePasswordStrength } from '../../components/common/PasswordStrengthMeter';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = Request Code, 2 = Enter Code & Reset Password, 3 = Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Handle URL query pre-fills from email link
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryEmail = params.get('email');
    const queryCode = params.get('code');

    if (queryEmail) setEmail(queryEmail.trim().toLowerCase());
    if (queryCode) {
      setOtp(queryCode.trim());
      setStep(2);
    }
  }, [location.search]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Step 1: Send Reset Code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid registered email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/forgot-password', { email: cleanEmail });
      if (res.success) {
        toast.success(res.message || 'Verification code sent to your email!');
        setStep(2);
        setCountdown(60);
      } else {
        setError(res.message || 'Failed to send reset code');
      }
    } catch (err) {
      setError(err.message || 'No account found with this email address.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend Code
  const handleResendCode = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');

    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
      if (res.success) {
        toast.success('A new 6-digit code has been sent!');
        setCountdown(60);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    const passCheck = calculatePasswordStrength(newPassword);
    if (passCheck.score < 2) {
      setError('Please choose a stronger password with letters, numbers, and symbols.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
        newPassword,
      });

      if (res.success) {
        setStep(3);
        toast.success('Password updated successfully! 🎉');
      } else {
        setError(res.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired code. Please request a new code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Forgot Password — Weblets" description="Reset your Weblets client account password securely via email verification code." />

      <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center relative">
        <div className="w-full max-w-md">
          
          <div className="glass-panel p-6 sm:p-8 rounded-hero border border-white dark:border-slate-800 shadow-glass-lg relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl">
            
            {/* Header Badge */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 text-[11px] font-bold">
                <KeyRound size={12} className="text-purple-500" />
                <span>Account Recovery</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {step === 1 ? 'Forgot Password?' : step === 2 ? 'Set New Password' : 'Password Reset Complete!'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {step === 1
                  ? 'Enter your registered email address to receive a 6-digit recovery code.'
                  : step === 2
                  ? `Enter the 6-digit code sent to ${email} and choose a strong password.`
                  : 'Your password has been successfully updated.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Request Code */}
            {step === 1 && (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <span>{loading ? 'Sending Code...' : 'Send Recovery Code 📧'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Enter Code & Set New Password */}
            {step === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    6-Digit Verification Code (OTP) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 123456"
                    className="w-full text-center tracking-[8px] font-mono text-xl py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                    <span>Didn't receive code?</span>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={countdown > 0 || resending}
                      className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
                    >
                      <RotateCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                      <span>{countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <PasswordStrengthMeter password={newPassword} showChecks={true} />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4 active:scale-95"
                >
                  <span>{loading ? 'Updating Password...' : 'Save New Password & Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 3: Success Confirmation */}
            {step === 3 && (
              <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Password Reset Successful!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Your account password has been updated. You can now log in with your new password.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Go to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-4">
              <Link to="/login" className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
                &larr; Back to Login
              </Link>
              <span>&bull;</span>
              <Link to="/register" className="font-bold text-slate-600 dark:text-slate-300 hover:underline">
                Create Account
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
