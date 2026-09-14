import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User, Phone, Building, ArrowRight, Sparkles, AlertCircle, Eye, EyeOff, ShieldCheck, CheckCircle2, RotateCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { SEO } from '../../components/common/CommonUI';
import PhoneInputWithCountry, { validatePhoneNumber } from '../../components/common/PhoneInputWithCountry';
import PasswordStrengthMeter, { calculatePasswordStrength } from '../../components/common/PasswordStrengthMeter';

export default function Register() {
  const [step, setStep] = useState(1); // 1 = Fill Form, 2 = Verify Email OTP
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
  });
  const [phoneDialCode, setPhoneDialCode] = useState('+91');
  const [countryCode, setCountryCode] = useState('IN');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // STEP 1: Submit Registration Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in Name, Email and Password.');
      return;
    }

    // Validate Phone Number
    const phoneValidation = validatePhoneNumber(formData.phone, countryCode);
    if (!phoneValidation.valid) {
      setError(phoneValidation.message);
      return;
    }

    // Validate Password Strength
    const passCheck = calculatePasswordStrength(formData.password);
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (passCheck.score < 2) {
      setError('Please choose a stronger password with a mix of letters, numbers, and symbols.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullPhone = `${phoneDialCode} ${formData.phone.trim()}`;
      await register({
        ...formData,
        phone: fullPhone,
      });

      // Account created, switch to OTP verification step
      toast.success('Account created! A 6-digit verification code was sent to your email.');
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');

    try {
      const res = await api.post('/auth/send-otp', { email: formData.email.trim().toLowerCase() });
      if (res.success) {
        toast.success('A new 6-digit verification code has been dispatched!');
        setCountdown(60);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/verify-otp', {
        email: formData.email.trim().toLowerCase(),
        otp: cleanOtp,
      });

      if (res.success) {
        toast.success('Email verified successfully! 🎉 Welcome to Weblets.');
        navigate(redirectPath);
      } else {
        setError(res.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code. Please request a new code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Create Account — Weblets" description="Join Weblets to manage your digital projects, proposals, and dynamic website assets." />

      <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center relative">
        <div className="w-full max-w-md">
          
          <div className="glass-panel p-6 sm:p-8 rounded-hero border border-white dark:border-slate-800 shadow-glass-lg relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl">
            
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 text-[11px] font-bold">
                <Sparkles size={12} className="text-purple-500" />
                <span>{step === 1 ? 'Fast-Track Account Setup' : 'Email Security Verification'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {step === 1 ? 'Create Your Account' : 'Verify Your Email'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {step === 1
                  ? 'Track your website build status & proposals in one place.'
                  : `Enter the 6-digit code dispatched to ${formData.email}.`}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Registration Form */}
            {step === 1 && (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-purple-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Important Email Verification Notice */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-purple-500/20 dark:border-purple-500/30 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px] flex items-center gap-1.5">
                        <span>Email Verification Required</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[9px] font-extrabold uppercase tracking-wider">
                          OTP
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        A <strong>6-digit verification code (OTP)</strong> will be dispatched to this email to activate your account.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="vikram@brand.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-purple-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Country-Aware Phone Number */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <PhoneInputWithCountry
                    value={formData.phone}
                    onChange={(val, dial) => {
                      setFormData((prev) => ({ ...prev, phone: val }));
                      if (dial) setPhoneDialCode(dial);
                    }}
                    countryCode={countryCode}
                    onCountryChange={(cc) => setCountryCode(cc)}
                    required={true}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Company / Brand (Optional)
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g. Apex Studio"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-purple-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-purple-500 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Live Password Security Strength Gauge */}
                  <PasswordStrengthMeter password={formData.password} showChecks={true} />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4 active:scale-95"
                >
                  <span>{loading ? 'Creating Account...' : 'Continue to Verification 🚀'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: OTP Verification Form */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Verification code sent to:
                  </div>
                  <div className="text-sm font-black text-purple-600 dark:text-purple-400 font-mono mt-0.5">
                    {formData.email}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 text-center">
                    Enter 6-Digit Verification Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[10px] font-mono text-2xl py-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                  
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-500 px-1">
                    <span>Didn't get code?</span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={countdown > 0 || resending}
                      className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                      <span>{countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  <span>{loading ? 'Verifying Code...' : 'Verify & Enter Dashboard 🚀'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => navigate(redirectPath)}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
                  >
                    Skip verification for now &rarr;
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
                Sign In
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
