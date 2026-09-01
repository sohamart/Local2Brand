import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, Building, ArrowRight, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/common/CommonUI';
import PhoneInputWithCountry, { validatePhoneNumber } from '../../components/common/PhoneInputWithCountry';
import PasswordStrengthMeter, { calculatePasswordStrength } from '../../components/common/PasswordStrengthMeter';

export default function Register() {
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
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
        phone: fullPhone
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Create Account — LOCAL2BRAND" description="Join LOCAL2BRAND to manage your digital projects, proposals, and dynamic website assets." />

      <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center relative">
        <div className="w-full max-w-md">
          
          <div className="glass-panel p-6 sm:p-8 rounded-hero border border-white dark:border-slate-800 shadow-glass-lg relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl">
            
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 text-[11px] font-bold">
                <Sparkles size={12} className="text-purple-500" />
                <span>Fast-Track Account Setup</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Create Your Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Track your website build status & proposals in one place.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

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

              {/* REQUIRED Country-Aware Phone Number */}
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
                <span>{loading ? 'Creating Account...' : 'Register & Enter Dashboard 🚀'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

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
