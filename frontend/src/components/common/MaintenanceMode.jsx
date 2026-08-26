import React, { useState, useEffect } from 'react';
import {
  Lock,
  KeyRound,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  Check
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import AshokaChakra from './AshokaChakra';

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function MaintenanceMode({ onBypassSuccess }) {
  // Target Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Instagram Contact Form State on Coming Soon Page
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    instagramHandle: '',
    email: '',
    requirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstaModal, setShowInstaModal] = useState(false);

  // Admin Bypass Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(siteConfig.launchTargetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const getInstagramUsername = () => {
    const rawUrl = siteConfig.socialLinks.instagram || 'https://www.instagram.com/local2brand_official?igsi=MWxjOHNjcTl0aDhjMQ==';
    const match = rawUrl.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
    return match ? match[1] : 'local2brand_official';
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInstaSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const instaUser = getInstagramUsername();

    // Format structured message for Instagram DM
    const messageText = [
      `👋 Early Project Inquiry for ${siteConfig.brandName}:`,
      `• Name: ${formData.name}`,
      `• Brand: ${formData.businessName}`,
      `• Instagram: ${formData.instagramHandle || 'N/A'}`,
      `• Email: ${formData.email || 'N/A'}`,
      `• Message: ${formData.requirements || 'Interested in early launch booking.'}`
    ].join('\n');

    // Copy to clipboard for easy pasting into Instagram DM
    if (navigator.clipboard) {
      navigator.clipboard.writeText(messageText).catch(() => { });
    }

    setShowInstaModal(true);
    setIsSubmitting(false);

    // Open Instagram DM in a new window
    setTimeout(() => {
      window.open(`https://ig.me/m/${instaUser}`, '_blank', 'noopener,noreferrer');
    }, 450);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const expectedPassword = siteConfig.adminBypassPassword || 'admin';

    if (passwordInput === expectedPassword) {
      setIsSuccess(true);
      setErrorMsg('');

      // Grant 10 minutes bypass (10 * 60 * 1000 ms)
      const tenMinutesFromNow = Date.now() + 10 * 60 * 1000;
      localStorage.setItem('l2b_admin_bypass_expiry', String(tenMinutesFromNow));

      setTimeout(() => {
        setShowAdminModal(false);
        if (onBypassSuccess) onBypassSuccess();
      }, 500);
    } else {
      setErrorMsg('Incorrect admin password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-between p-4 sm:p-8 relative overflow-hidden font-sans text-slate-900 selection:bg-pink-600 selection:text-white">

      {/* Background Ambient Liquid Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-pink-400/20 via-purple-500/20 to-indigo-500/25 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-amber-400/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Branding */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-purple-500/20 border border-white/80 bg-white">
            <img
              src="/logo.jpg"
              alt="LOCAL2BRAND Official 3D Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 leading-none">
                LOCAL<span className="l2b-gradient-text">2</span>BRAND
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80 px-1.5 py-0.5 rounded shadow-2xs">
                <AshokaChakra size={11} />
                <span>IN</span>
              </span>
            </div>
            <span className="text-[9px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
              Build Local. Think Global.
            </span>
          </div>
        </div>

        {/* Top Right Official Instagram Link */}
        <a
          href={siteConfig.socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full text-xs font-bold text-pink-800 bg-pink-50 hover:bg-pink-100 border border-pink-200/80 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
          <span>@{getInstagramUsername()}</span>
        </a>
      </header>

      {/* Center Main Stage: Countdown + Instagram DM Contact Form */}
      <main className="w-full max-w-4xl mx-auto text-center space-y-8 py-6 sm:py-10 relative z-10">

        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200 shadow-sm text-xs font-bold text-slate-800 animate-float">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
          <span className="text-pink-900">
            {siteConfig.isMaintenanceMode ? '🛠️ Scheduled Infrastructure Upgrade' : '🚀 Grand Platform Launch'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-purple-600">48h Delivery Coming Soon</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Something <span className="l2b-gradient-text">Massive</span> Is On The Way.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            We are engineering our liquid glass web agency platform for Indian businesses. Send us a message below to connect on Instagram DM!
          </p>
        </div>

        {/* Live Glass Countdown Timer Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto">
          {/* Days */}
          <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-white shadow-floating flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Days
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 opacity-60" />
          </div>

          {/* Hours */}
          <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-white shadow-floating flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Hours
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-60" />
          </div>

          {/* Minutes */}
          <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-white shadow-floating flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Minutes
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 opacity-60" />
          </div>

          {/* Seconds */}
          <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-white shadow-floating flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-3xl sm:text-4xl font-black text-pink-600 tracking-tight font-mono animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Seconds
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-pink-600 opacity-80" />
          </div>
        </div>

        {/* Coming Soon Instagram Contact Form */}
        <div className="max-w-xl mx-auto text-left pt-2">
          <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white shadow-xl relative overflow-hidden bg-white/95">
            <div className="mb-4 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-pink-700 inline-flex items-center gap-1.5 mb-1">
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram DM Contact Form</span>
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Get in touch for Early Access
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Submit this form to open our Instagram DM with your inquiry ready to send.
              </p>
            </div>

            <form onSubmit={handleInstaSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Name <span className="text-pink-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Brand / Business <span className="text-pink-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    required
                    placeholder="e.g. Acme Corp"
                    value={formData.businessName}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    name="instagramHandle"
                    placeholder="@yourhandle"
                    value={formData.instagramHandle}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="rahul@domain.com"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Project Details
                </label>
                <textarea
                  name="requirements"
                  rows="2"
                  placeholder="Tell us what kind of website you are planning..."
                  value={formData.requirements}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>{isSubmitting ? 'Opening Instagram...' : 'Submit & Connect on Instagram DM'}</span>
                <Send className="w-3.5 h-3.5 ml-1" />
              </button>
            </form>

            {/* Subtle bottom tricolor accent */}
            <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/60 via-blue-500/40 to-emerald-500/60" />
          </div>
        </div>

      </main>

      {/* Bottom Footer & Admin Bypass Launcher */}
      <footer className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2 border-t border-slate-200/80 text-xs text-slate-500 relative z-10">
        <div className="flex items-center gap-1.5">
          <AshokaChakra size={11} />
          <span>© {new Date().getFullYear()} LOCAL2BRAND. Proudly Engineered in India.</span>
        </div>

        {/* Admin Bypass Key Trigger Button */}
        <button
          onClick={() => setShowAdminModal(true)}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-800 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          title="Admin Access Bypass"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Admin Access</span>
        </button>
      </footer>

      {/* Instagram DM Success Confirmation Modal */}
      {showInstaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-md"
            onClick={() => setShowInstaModal(false)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-white z-10 animate-in fade-in zoom-in-95 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
              <InstagramIcon className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900">
              Opening Instagram DM...
            </h3>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Your inquiry has been <strong>copied to your clipboard</strong>! When Instagram opens, simply paste it into the message box to chat directly with our team.
            </p>

            <div className="pt-2 flex flex-col gap-1.5">
              <a
                href={`https://ig.me/m/${getInstagramUsername()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Open Instagram Chat</span>
              </a>

              <button
                type="button"
                onClick={() => setShowInstaModal(false)}
                className="py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Modal (Grants 10-Minute Device Bypass) */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-md transition-opacity"
            onClick={() => setShowAdminModal(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm bg-white/98 backdrop-blur-2xl rounded-3xl border border-white p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Admin Preview Access</h3>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Enter your admin password to bypass maintenance/coming soon mode on this device for <strong>10 minutes</strong>.
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {errorMsg && (
                <div className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {isSuccess && (
                <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Password verified! Unlocking site for 10 mins...</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm cursor-pointer hover:opacity-95"
              >
                Unlock Website (10 Min Preview)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Tricolor Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-blue-600 to-emerald-600" />
    </div>
  );
}
