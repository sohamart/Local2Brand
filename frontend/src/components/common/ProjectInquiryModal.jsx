import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Send,
  Sparkles,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  Tag,
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sliders,
  DollarSign,
  User,
  Layout,
  Layers,
  ShieldCheck,
  Lock,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import api from '../../services/api';
import AshokaChakra from './AshokaChakra';

const INDUSTRIES = [
  { id: 'Restaurant / Cafe', label: '🍽️ Restaurant / Cafe / Bakery' },
  { id: 'E-Commerce / Retail', label: '🛍️ E-Commerce / Online Store' },
  { id: 'Corporate / Agency', label: '🏢 Corporate / Agency / Brand' },
  { id: 'Real Estate / Property', label: '🏡 Real Estate / Properties' },
  { id: 'Salon / Spa / Beauty', label: '💇 Salon / Spa / Beauty Studio' },
  { id: 'Gym / Fitness Hub', label: '🏋️ Gym / Crossfit / Fitness' },
  { id: 'Hotel / Resort', label: '🏨 Hotel / Resort / Homestay' },
  { id: 'Coaching / EdTech', label: '🎓 Coaching / EdTech / Academy' },
  { id: 'Healthcare / Clinic', label: '🦷 Clinic / Doctor / Healthcare' },
  { id: 'Custom Web App / SaaS', label: '⚡ Custom Web App / Software' },
  { id: 'Other Custom Business', label: '✍️ Other / Custom Business' }
];

const FEATURES_LIST = [
  '⚡ High Speed (95+ Core Web Vitals)',
  '📱 Fully Responsive Fluid Mobile UI',
  '🔍 Google Local SEO & Rich Schema',
  '💬 Interactive Inquiry & Callback Pipeline',
  '🔐 Simple Admin Dashboard for Content',
  '💳 Payment Gateway (UPI / Razorpay / Stripe)',
  '🛒 E-Commerce Catalog & Checkout',
  '📅 Booking & Appointment Scheduling',
  '✨ 3D Micro-Animations & Dark Mode'
];

const THEMES = [
  { id: 'Modern Glassmorphic', name: '💎 Frosted Glass & Vibrant Glow', desc: 'Ultra-modern translucent glass with vibrant gradient accents' },
  { id: 'Clean Minimalist', name: '⚪ Clean Minimalist & Crisp', desc: 'Apple-inspired airy whites, sharp typography, refined spacing' },
  { id: 'Dark Luxury', name: '🌑 Dark Luxury & Obsidian', desc: 'Sleek dark obsidian panels, neon glow, premium aesthetic' },
  { id: 'Bold & Colorful', name: '🌈 Dynamic & High Energy', desc: 'Bold gradients, lively micro-interactions, high engagement' }
];

const BUDGET_OPTIONS = [
  '₹9,999 - ₹19,999 (Showcase Template)',
  '₹20,000 - ₹39,999 (Custom Business)',
  '₹40,000 - ₹79,999 (Full E-Commerce / App)',
  '₹80,000+ (Enterprise Bespoke)'
];

const TIMELINE_OPTIONS = [
  '⚡ Express (48 - 72 Hours)',
  '🗓️ 1 - 2 Weeks (Standard)',
  '⏳ 3 - 4 Weeks (Deep Custom)',
  'Flexible'
];

export default function ProjectInquiryModal() {
  const { isInquiryOpen, closeOrderModal, inquiryData } = useOrderModal();
  const { user, login, register } = useAuth();
  const { settings } = useSiteSettings();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Modal in-line auth state (if user is not logged in)
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    industry: 'Restaurant / Cafe',
    selectedFeatures: ['⚡ High Speed (95+ Core Web Vitals)', '📱 Fully Responsive Fluid Mobile UI', '🔍 Google Local SEO & Rich Schema'],
    themePreference: 'Modern Glassmorphic',
    budget: '₹9,999 - ₹19,999 (Showcase Template)',
    timeline: '⚡ Express (48 - 72 Hours)',
    requirements: '',
    couponCode: '',
    discountPercent: 0
  });

  // Reset when opened
  useEffect(() => {
    if (isInquiryOpen) {
      setSubmitted(false);
      setStep(1);
      setErrorMessage('');
      setAuthError('');

      setFormData((prev) => ({
        ...prev,
        name: user?.name || prev.name,
        email: user?.email || prev.email,
        phone: user?.phone || prev.phone,
        businessName: user?.company || prev.businessName,
        industry: inquiryData.industry || prev.industry,
        requirements: inquiryData.initialRequirements || prev.requirements,
        couponCode: inquiryData.autoApplyOffer ? 'INDIA2025' : prev.couponCode,
        discountPercent: inquiryData.autoApplyOffer ? 20 : prev.discountPercent
      }));
    }
  }, [isInquiryOpen, user, inquiryData]);

  if (!isInquiryOpen) return null;

  const handleInlineAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'login') {
        const loggedUser = await login(authEmail, authPassword);
        setFormData((prev) => ({
          ...prev,
          name: loggedUser.name,
          email: loggedUser.email,
          phone: loggedUser.phone || prev.phone,
          businessName: loggedUser.company || prev.businessName,
        }));
      } else {
        if (!authName || !authEmail || !authPassword) {
          throw new Error('Please fill in Name, Email, and Password');
        }
        const newUser = await register({
          name: authName,
          email: authEmail,
          password: authPassword,
          phone: authPhone,
        });
        setFormData((prev) => ({
          ...prev,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone || authPhone,
        }));
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => {
      const exists = prev.selectedFeatures.includes(feature);
      if (exists) {
        return { ...prev, selectedFeatures: prev.selectedFeatures.filter((f) => f !== feature) };
      } else {
        return { ...prev, selectedFeatures: [...prev.selectedFeatures, feature] };
      }
    });
  };

  const handleApplyCoupon = () => {
    if (formData.couponCode.trim().toUpperCase() === 'INDIA2025') {
      setFormData((prev) => ({ ...prev, discountPercent: 20 }));
    } else {
      alert('Invalid coupon code. Try "INDIA2025" for 20% OFF.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setErrorMessage('Please fill in Name, Phone, and Email address.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName,
        websiteType: inquiryData.selectedDemo ? `Demo: ${inquiryData.selectedDemo}` : inquiryData.websiteType || 'Custom Project',
        selectedDemo: inquiryData.selectedDemo || '',
        selectedFeatures: formData.selectedFeatures,
        industry: formData.industry,
        themePreference: formData.themePreference,
        budget: formData.budget,
        timeline: formData.timeline,
        requirements: formData.requirements,
        couponCode: formData.couponCode,
        discountPercent: formData.discountPercent,
        estimatedPrice: formData.discountPercent > 0 ? '₹7,999 (20% OFF Applied)' : '₹9,999'
      };

      await api.post('/queries', payload);
      setSubmitted(true);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit proposal inquiry. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="relative p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 flex items-center gap-1">
                <AshokaChakra size={10} />
                <span>Instant Proposal Builder</span>
              </span>
              {inquiryData.selectedDemo && (
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full">
                  Template: {inquiryData.selectedDemo}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
              {!user ? 'Sign In to Build Your Proposal' : submitted ? 'Inquiry Submitted!' : 'Configure Your Website'}
            </h2>
          </div>

          <button
            onClick={closeOrderModal}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Only when user is logged in) */}
        {user && !submitted && (
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 shrink-0">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
          
          {/* 1. AUTH GATE (Required Login First as requested!) */}
          {!user ? (
            <div className="space-y-4 max-w-md mx-auto py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mx-auto shadow-sm">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {authMode === 'login' ? 'Sign In to Continue' : 'Create Your Free Account'}
                </h3>
                <p className="text-xs text-slate-500">
                  Log in or register so you can track your proposal and quotation in real time.
                </p>
              </div>

              {/* Toggle Login / Register */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleInlineAuth} className="space-y-3 text-xs">
                {authMode === 'register' && (
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 text-slate-900 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 text-slate-900 dark:text-white"
                  />
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 text-slate-900 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-purple-500 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl font-bold text-white l2b-gradient-bg shadow-glass-highlight cursor-pointer hover:opacity-95 disabled:opacity-50 mt-1"
                >
                  {authLoading ? 'Signing in...' : authMode === 'login' ? 'Sign In & Open Proposal Form' : 'Register & Continue'}
                </button>
              </form>
            </div>
          ) : submitted ? (
            /* Success View */
            <div className="text-center py-6 sm:py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Proposal Request Received! 🎉
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you <strong>{formData.name}</strong>. Your project requirements have been saved directly to our system. Our design & engineering team will contact you shortly.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left text-xs space-y-1.5">
                <div className="flex justify-between"><span className="text-slate-500">Industry:</span> <span className="font-bold">{formData.industry}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Timeline:</span> <span className="font-bold">{formData.timeline}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Budget:</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">{formData.budget}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Confirmation Sent:</span> <span className="font-bold">{formData.email}</span></div>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={closeOrderModal}
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold text-white l2b-gradient-bg shadow-md cursor-pointer hover:opacity-95"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Wizard */
            <div>
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 1: Industry / Niche */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      1. Select Your Business Industry
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      We calibrate conversion architecture and visual lookbook based on your niche.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, industry: ind.id }))}
                        className={`p-3 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all border flex items-center justify-between cursor-pointer ${
                          formData.industry === ind.id
                            ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-950 dark:text-purple-200 shadow-xs'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{ind.label}</span>
                        {formData.industry === ind.id && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Features & Add-ons */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      2. Essential Features Needed
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Select all modules you'd like included in your web build.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    {FEATURES_LIST.map((feat) => {
                      const isChecked = formData.selectedFeatures.includes(feat);
                      return (
                        <div
                          key={feat}
                          onClick={() => handleFeatureToggle(feat)}
                          className={`p-3 rounded-xl text-xs sm:text-sm font-medium border flex items-center gap-3 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-purple-50/80 dark:bg-purple-950/50 border-purple-400 text-purple-950 dark:text-purple-200'
                              : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-400'
                          }`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span>{feat}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Theme & Budget */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      3. Theme Vibe, Budget & Timeline
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Customize visual aesthetic and delivery speed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Visual Theme</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {THEMES.map((th) => (
                        <div
                          key={th.id}
                          onClick={() => setFormData((prev) => ({ ...prev, themePreference: th.id }))}
                          className={`p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                            formData.themePreference === th.id
                              ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-950 dark:text-purple-200'
                              : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="font-bold">{th.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{th.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                        Target Budget
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-purple-500 text-slate-900 dark:text-white"
                      >
                        {BUDGET_OPTIONS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                        Target Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData((prev) => ({ ...prev, timeline: e.target.value }))}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-purple-500 text-slate-900 dark:text-white"
                      >
                        {TIMELINE_OPTIONS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Contact & Submission */}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      4. Your Contact & Project Details
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Logged in as <strong>{user?.email}</strong>. We'll generate your tailored quote.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-purple-500 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="e.g. 9876543210"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-purple-500 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="e.g. rahul@brand.com"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-purple-500 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Business / Brand Name
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={formData.businessName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                          placeholder="e.g. Urban Cafe"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-purple-500 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Project Notes / Specific Requirements
                    </label>
                    <textarea
                      rows={2}
                      value={formData.requirements}
                      onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
                      placeholder="Share your design ideas, competitors, or required pages..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-purple-500 resize-none text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-500/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-600 shrink-0" />
                      <input
                        type="text"
                        value={formData.couponCode}
                        onChange={(e) => setFormData((prev) => ({ ...prev, couponCode: e.target.value.toUpperCase() }))}
                        placeholder="Coupon (e.g. INDIA2025)"
                        className="bg-transparent text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none w-36"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer transition-colors"
                    >
                      {formData.discountPercent > 0 ? 'Applied (20% OFF)' : 'Apply'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation (Only when logged in) */}
        {user && !submitted && (
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Submit Proposal Inquiry'}</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
