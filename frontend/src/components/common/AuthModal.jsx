import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  CheckCircle2,
  TrendingUp,
  Zap,
  Star,
  Globe
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import PhoneInputWithCountry, { validatePhoneNumber } from './PhoneInputWithCountry';
import PasswordStrengthMeter, { calculatePasswordStrength } from './PasswordStrengthMeter';
import GoogleLoginButton from './GoogleLoginButton';

const AUTH_SHOWCASE_SLIDES = [
  {
    id: 'slide-1',
    category: 'E-COMMERCE & D2C',
    title: 'Lumina Botanicals Flagship',
    subtitle: 'High-Conversion Liquid Glass Store',
    description: 'Sub-second speed, instant WhatsApp checkout, and +180% online revenue jump in 30 days.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
    stats: [
      { label: 'PageSpeed', value: '99/100' },
      { label: 'Conversion', value: '4.8%' },
      { label: 'Revenue', value: '+180%' }
    ],
    badge: '48h Rapid Launch'
  },
  {
    id: 'slide-2',
    category: 'LUXURY & BRANDING',
    title: 'Solis Architectural Studio',
    subtitle: 'Editorial Fluid Spatial Portfolio',
    description: 'Cinematic layouts with Apple-grade physics that secured $2.4M in high-value commercial design retainers.',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1000&auto=format&fit=crop',
    stats: [
      { label: 'Avg Session', value: '4m 20s' },
      { label: 'Inquiries', value: '3.2x' },
      { label: 'Design Award', value: 'Nominee' }
    ],
    badge: 'Award Nominated'
  },
  {
    id: 'slide-3',
    category: 'LOCAL BUSINESS & DINING',
    title: 'Komorebi Rooftop Bistro',
    subtitle: 'Smart Booking & Digital Menu',
    description: 'Automated QR menus and WhatsApp reservation engine driving +220% weekend table bookings.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
    stats: [
      { label: 'Bookings', value: '+220%' },
      { label: 'Rating', value: '4.9 ★' },
      { label: 'Daily Calls', value: '85+' }
    ],
    badge: 'Fully Booked'
  },
  {
    id: 'slide-4',
    category: 'SAAS & HIGH TECH',
    title: 'Klystron AI Analytics',
    subtitle: 'Next-Gen Startup Product Funnel',
    description: 'Dark-mode interactive dashboard architecture scaling 10,000+ early waitlist signups in 3 weeks.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    stats: [
      { label: 'Waitlist', value: '10K+' },
      { label: 'Page Load', value: '0.42s' },
      { label: 'Retention', value: '94%' }
    ],
    badge: 'High Speed'
  }
];

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authSuccessCallback, login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'verify_otp' | 'forgot_email' | 'forgot_reset'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneDialCode, setPhoneDialCode] = useState('+91');
  const [countryCode, setCountryCode] = useState('IN');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Auto-sliding showcase state
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);

  // Auto slide interval
  useEffect(() => {
    if (!isAuthModalOpen || isSliderPaused) return;
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % AUTH_SHOWCASE_SLIDES.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, [isAuthModalOpen, isSliderPaused]);

  // Lock background smooth scroll and enable smooth modal scrolling
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) {
        window.lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      if (window.lenis) {
        window.lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [isAuthModalOpen]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isAuthModalOpen) return null;

  // Handle Login / Register / Forgot Password Submits
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password;

    try {
      if (mode === 'login') {
        if (!cleanEmail || !cleanPass) {
          throw new Error('Please enter both email and password.');
        }
        const loggedUser = await login(cleanEmail, cleanPass);
        closeAuthModal();
        if (typeof authSuccessCallback === 'function') {
          authSuccessCallback(loggedUser);
        } else {
          if (loggedUser?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }
      } else if (mode === 'register') {
        if (!name.trim() || !cleanEmail || !cleanPass) {
          throw new Error('Please fill in Name, Email and Password.');
        }

        // Validate Phone Number
        const phoneValidation = validatePhoneNumber(phone, countryCode);
        if (!phoneValidation.valid) {
          throw new Error(phoneValidation.message);
        }

        // Validate Password Strength
        const passCheck = calculatePasswordStrength(password);
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long.');
        }
        if (passCheck.score < 2) {
          throw new Error('Please create a stronger password with letters, numbers, and symbols.');
        }

        const fullPhone = `${phoneDialCode} ${phone.trim()}`;
        await register({ name: name.trim(), email: cleanEmail, password, phone: fullPhone });
        
        toast.success('Account created! A 6-digit verification code has been dispatched to your email.');
        setMode('verify_otp');
        setCountdown(60);
      } else if (mode === 'verify_otp') {
        const cleanOtp = otp.trim();
        if (!cleanOtp || cleanOtp.length < 6) {
          throw new Error('Please enter the 6-digit OTP code.');
        }

        const res = await api.post('/auth/verify-otp', { email: cleanEmail, otp: cleanOtp });
        if (res.success) {
          toast.success('Email verified successfully! 🎉 Welcome to Weblets.');
          closeAuthModal();
          if (typeof authSuccessCallback === 'function') {
            authSuccessCallback(res.user);
          } else {
            navigate('/dashboard');
          }
        } else {
          throw new Error(res.message || 'Invalid or expired OTP code.');
        }
      } else if (mode === 'forgot_email') {
        if (!cleanEmail || !cleanEmail.includes('@')) {
          throw new Error('Please enter a valid registered email address.');
        }

        const res = await api.post('/auth/forgot-password', { email: cleanEmail });
        if (res.success) {
          toast.success('A 6-digit recovery code has been sent to your email.');
          setMode('forgot_reset');
          setCountdown(60);
        } else {
          throw new Error(res.message || 'Failed to send recovery code');
        }
      } else if (mode === 'forgot_reset') {
        const cleanOtp = otp.trim();
        if (!cleanOtp || cleanOtp.length < 6) {
          throw new Error('Please enter the 6-digit OTP code.');
        }
        if (!newPassword || newPassword.length < 8) {
          throw new Error('Password must be at least 8 characters long.');
        }

        const res = await api.post('/auth/reset-password', {
          email: cleanEmail,
          otp: cleanOtp,
          newPassword,
        });

        if (res.success) {
          toast.success('Password reset successfully! Please sign in with your new password.');
          setMode('login');
          setPassword('');
          setOtp('');
        } else {
          throw new Error(res.message || 'Failed to reset password');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');

    try {
      const endpoint = mode === 'forgot_reset' ? '/auth/forgot-password' : '/auth/send-otp';
      const res = await api.post(endpoint, { email: email.trim().toLowerCase() });
      if (res.success) {
        toast.success('A new 6-digit code has been dispatched!');
        setCountdown(60);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  const currentSlide = AUTH_SHOWCASE_SLIDES[activeSlide];

  return (
    <div
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-2xl animate-in fade-in duration-200 overflow-y-auto overscroll-contain"
    >
      <div
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white dark:bg-[#070b14] rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.65)] border border-white/80 dark:border-white/15 my-auto overflow-hidden animate-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] h-auto min-h-0"
      >
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: AUTO-SLIDING WEBSITE SHOWCASE & LIVE INFORMATION PANEL (PC)   */}
        {/* ========================================================================= */}
        <div
          onMouseEnter={() => setIsSliderPaused(true)}
          onMouseLeave={() => setIsSliderPaused(false)}
          className="hidden md:flex md:col-span-5 lg:col-span-5 relative flex-col justify-between p-6 sm:p-7 overflow-hidden bg-slate-950 text-white select-none min-h-0 h-full"
        >
          {/* Background Images with Crossfade */}
          {AUTH_SHOWCASE_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === activeSlide ? 'opacity-40 scale-105' : 'opacity-0 scale-100'
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'opacity 0.7s ease-in-out, transform 4s ease-out',
              }}
            />
          ))}

          {/* Liquid Glass Dark Vignette & Aurora Shimmer Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand & Live Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-900/90 border border-purple-400/40 p-0 flex items-center justify-center shadow-md shadow-purple-500/25 ring-2 ring-purple-500/30 shrink-0">
                <img
                  src="/logo.png"
                  alt="WEBLETS"
                  className="w-full h-full object-cover scale-135 object-center"
                  onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                />
              </div>
              <div>
                <span className="text-xs font-black tracking-tight text-white block">WEBLETS</span>
                <span className="text-[9px] text-purple-300/80 block font-medium">lets make website together</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-bold text-purple-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentSlide.badge}</span>
            </div>
          </div>

          {/* Middle Dynamic Showcase Content */}
          <div className="relative z-10 space-y-4 my-auto py-6">
            <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300 key={activeSlide}">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[9px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>{currentSlide.category}</span>
              </div>
              <h3 className="text-lg lg:text-xl font-black text-white tracking-tight leading-snug">
                {currentSlide.title}
              </h3>
              <p className="text-xs font-semibold text-purple-200/90">
                {currentSlide.subtitle}
              </p>
              <p className="text-[11px] text-slate-300/80 leading-relaxed pt-1 line-clamp-3">
                {currentSlide.description}
              </p>
            </div>

            {/* Metrics Glass Cards */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {currentSlide.stats.map((st, i) => (
                <div
                  key={i}
                  className="p-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-center space-y-0.5"
                >
                  <div className="text-xs font-black text-white">{st.value}</div>
                  <div className="text-[9px] text-slate-400 font-medium truncate">{st.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Controls: Carousel Indicators & Arrows */}
          <div className="relative z-10 space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              {/* Animated Progress Indicators */}
              <div className="flex items-center gap-1.5">
                {AUTH_SHOWCASE_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeSlide
                        ? 'w-6 bg-gradient-to-r from-purple-400 to-cyan-400'
                        : 'w-1.5 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((prev) =>
                      prev === 0 ? AUTH_SHOWCASE_SLIDES.length - 1 : prev - 1
                    )
                  }
                  className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((prev) => (prev + 1) % AUTH_SHOWCASE_SLIDES.length)
                  }
                  className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1 text-slate-300 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>100% Code Ownership</span>
              </div>
              <span>48h Rapid Delivery</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: PRO MODERN AUTHENTICATION PORTAL (SIGN IN / REGISTER / OTP) */}
        {/* ========================================================================= */}
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="col-span-1 md:col-span-7 lg:col-span-7 p-5 sm:p-7 md:p-8 overflow-y-auto overscroll-contain custom-scrollbar relative bg-white dark:bg-[#080d1a] min-h-0 max-h-[90vh] flex flex-col focus:outline-none"
        >
          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer z-20"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Form Content Wrapper */}
          <div className="w-full my-auto py-1">

            {/* Top Header */}
            <div className="space-y-1 mb-4 sm:mb-5 pr-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-500/30 text-purple-900 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles size={11} className="text-purple-500" />
                <span>Secure Client Portal</span>
              </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {mode === 'login'
                ? 'Welcome Back 👋'
                : mode === 'register'
                ? 'Create Client Account 🚀'
                : mode === 'verify_otp'
                ? 'Verify Your Email 🔑'
                : mode === 'forgot_email'
                ? 'Account Recovery 🔐'
                : 'Set New Password 🔑'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mode === 'login'
                ? 'Sign in to configure requirements, track live sprints, and access dashboard.'
                : mode === 'register'
                ? 'Register to unlock your smart requirement builder and live proposals.'
                : mode === 'verify_otp'
                ? `Enter the 6-digit verification code dispatched to ${email}.`
                : mode === 'forgot_email'
                ? 'Enter your registered email to receive a password recovery code.'
                : `Enter the code sent to ${email} and choose a new password.`}
            </p>
          </div>

          {/* Mode Switcher (Login / Register) */}
          {(mode === 'login' || mode === 'register') && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-4 text-xs font-bold border border-slate-200/60 dark:border-white/5">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            
            {/* Register Name */}
            {mode === 'register' && (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Your Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 text-slate-900 dark:text-white text-xs font-semibold"
                  />
                </div>
              </div>
            )}

            {/* Email Notice on Register */}
            {mode === 'register' && (
              <div className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-purple-500/20 dark:border-purple-500/30 text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-[10px] flex items-center gap-1.5">
                      <span>Email Verification Required</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[8px] font-extrabold uppercase tracking-wider">
                        OTP
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug">
                      A <strong>6-digit verification code (OTP)</strong> will be sent to activate your account.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Email input for login / register / forgot_email */}
            {(mode === 'login' || mode === 'register' || mode === 'forgot_email') && (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {mode === 'login' ? 'Email Address or Phone Number *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={mode === 'login' ? 'text' : 'email'}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={mode === 'login' ? 'your.email@company.com or 91XXXXXXXXXX' : 'your.email@company.com'}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 text-slate-900 dark:text-white text-xs font-semibold"
                  />
                </div>
              </div>
            )}

            {/* Phone input on register */}
            {mode === 'register' && (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  WhatsApp / Phone Number *
                </label>
                <PhoneInputWithCountry
                  value={phone}
                  onChange={(val, dial) => {
                    setPhone(val);
                    if (dial) setPhoneDialCode(dial);
                  }}
                  countryCode={countryCode}
                  onCountryChange={(cc) => setCountryCode(cc)}
                  required={true}
                />
              </div>
            )}

            {/* Password for Login & Register */}
            {(mode === 'login' || mode === 'register') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Password *</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot_email');
                        setError('');
                      }}
                      className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 text-slate-900 dark:text-white text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {mode === 'register' && (
                  <PasswordStrengthMeter password={password} showChecks={true} />
                )}
              </div>
            )}

            {/* OTP Input for verify_otp & forgot_reset */}
            {(mode === 'verify_otp' || mode === 'forgot_reset') && (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-center">
                  6-Digit Verification Code (OTP) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[8px] font-mono text-xl py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 text-slate-900 dark:text-white"
                />
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || resending}
                    className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
                  >
                    <RotateCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                    <span>{countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* New Password Input for forgot_reset */}
            {mode === 'forgot_reset' && (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-9 pr-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 text-slate-900 dark:text-white text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrengthMeter password={newPassword} showChecks={true} />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3 active:scale-95"
            >
              <span>
                {loading
                  ? 'Processing...'
                  : mode === 'login'
                  ? 'Sign In & Continue'
                  : mode === 'register'
                  ? 'Create Account 🚀'
                  : mode === 'verify_otp'
                  ? 'Verify Code & Activate'
                  : mode === 'forgot_email'
                  ? 'Send Recovery Code 📧'
                  : 'Save New Password & Sign In'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Back to Login link for recovery modes */}
          {(mode === 'forgot_email' || mode === 'forgot_reset' || mode === 'verify_otp') && (
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
              >
                &larr; Back to Sign In
              </button>
            </div>
          )}

          {/* Google Login for Sign In mode only */}
          {mode === 'login' && (
            <div className="mt-3.5 space-y-2.5">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative px-2.5 bg-white dark:bg-[#080d1a] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Or
                </div>
              </div>

              <GoogleLoginButton
                onSuccess={(loggedUser) => {
                  closeAuthModal();
                  if (typeof authSuccessCallback === 'function') {
                    authSuccessCallback(loggedUser);
                  } else {
                    if (loggedUser?.role === 'admin') {
                      navigate('/admin');
                    } else {
                      navigate('/dashboard');
                    }
                  }
                }}
                onError={(err) => {
                  setError(err?.message || 'Google sign-in failed. Please try again.');
                }}
              />
            </div>
          )}

          </div>

        </div>

      </div>
    </div>
  );
}
