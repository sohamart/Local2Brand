import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  Lock,
  ArrowRight,
  Shield,
  KeyRound,
  X,
  AlertCircle,
  CheckCircle2,
  Send,
  Wrench
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import AshokaChakra from './AshokaChakra';
import ThemeToggle from './ThemeToggle';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

export default function MaintenanceMode({ onBypassSuccess }) {
  // Determine mode: Coming Soon vs Maintenance
  const isComingSoon = siteConfig.isComingSoonMode && !siteConfig.isMaintenanceMode;

  // Target Grand Launch Date from .env or fallback
  const [targetDate] = useState(() => {
    if (import.meta.env.VITE_LAUNCH_TARGET_DATE) {
      const parsed = new Date(import.meta.env.VITE_LAUNCH_TARGET_DATE).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    const d = new Date();
    d.setDate(d.getDate() + (isComingSoon ? 5 : 1));
    d.setHours(18, 0, 0, 0);
    return d.getTime();
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 8,
    minutes: 42,
    seconds: 15
  });

  // Admin Bypass Key Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Dedicated Instagram Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    instagramHandle: '',
    email: '',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstaModal, setShowInstaModal] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getInstagramUsername = () => {
    const handle = siteConfig.socialLinks.instagramHandle || siteConfig.socialLinks.instagram || '@local2brand';
    return handle.replace(/https?:\/\/(www\.)?instagram\.com\//, '').replace(/@/, '').replace(/\/$/, '');
  };

  const handleInstaSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const igUsername = getInstagramUsername();

    // Format direct DM summary to clipboard
    const modeTag = isComingSoon ? 'EARLY ACCESS INQUIRY' : 'MAINTENANCE CONTACT INQUIRY';
    const textToCopy = `✨ LOCAL2BRAND ${modeTag} ✨\n` +
      `👤 Name: ${formData.name}\n` +
      `🏢 Business: ${formData.businessName}\n` +
      (formData.instagramHandle ? `📸 My IG: ${formData.instagramHandle}\n` : '') +
      (formData.email ? `📧 Email: ${formData.email}\n` : '') +
      `📝 Requirements: ${formData.requirements || 'Inquiry'}\n` +
      `⚡ Status: Direct Founder Follow-Up`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setShowInstaModal(true);
      window.open(`https://ig.me/m/${igUsername}`, '_blank', 'noopener,noreferrer');
    }, 600);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const correctPassword =
      import.meta.env.VITE_ADMIN_BYPASS_PASSWORD ||
      import.meta.env.VITE_ADMIN_BYPASS_KEY ||
      'Local2Brand@1902';

    if (passwordInput.trim() === correctPassword.trim()) {
      setIsSuccess(true);
      setErrorMsg('');

      // Grant 10-Minute Device Session Bypass
      const expiryTimestamp = Date.now() + 10 * 60 * 1000;
      localStorage.setItem('l2b_admin_bypass_expiry', String(expiryTimestamp));

      setTimeout(() => {
        if (onBypassSuccess) onBypassSuccess();
      }, 500);
    } else {
      setErrorMsg('Incorrect admin password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#07090E] flex flex-col items-center justify-between p-3.5 sm:p-6 lg:p-8 relative overflow-x-hidden font-sans text-slate-900 dark:text-slate-100 selection:bg-pink-600 selection:text-white transition-colors duration-300">

      {/* Background Ambient Liquid Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[600px] h-[350px] bg-gradient-to-tr from-pink-400/20 via-purple-500/20 to-indigo-500/25 dark:from-pink-500/15 dark:via-purple-600/20 dark:to-indigo-600/25 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] bg-amber-400/15 dark:bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Top Header Branding */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-3 sm:py-4 gap-2 relative z-10">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-md shadow-purple-500/20 border border-white/80 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
            <img
              src="/logo.jpg"
              alt="LOCAL2BRAND Official 3D Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-extrabold text-sm sm:text-base lg:text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                LOCAL<span className="l2b-gradient-text">2</span>BRAND
              </span>
              <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/40 px-1 sm:px-1.5 py-0.5 rounded shadow-2xs">
                <AshokaChakra size={10} />
                <span>IN</span>
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-0.5 truncate max-w-[130px] sm:max-w-none">
              Build Local. Think Global.
            </span>
          </div>
        </div>

        {/* Top Right Controls: Theme Toggle + Official Instagram Link */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          {/* Instagram Link */}
          <a
            href={siteConfig.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-pink-800 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/70 hover:bg-pink-100 dark:hover:bg-pink-900/80 border border-pink-200/80 dark:border-pink-500/40 transition-all flex items-center gap-1 sm:gap-1.5 shadow-2xs cursor-pointer shrink-0"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
            <span className="hidden xs:inline">@{getInstagramUsername()}</span>
            <span className="xs:hidden">Instagram</span>
          </a>
        </div>
      </header>

      {/* Center Main Stage: Coming Soon vs Maintenance Mode UI */}
      <main className="w-full max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 py-4 sm:py-8 relative z-10">

        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 max-w-full flex-wrap justify-center">
          <span className={`w-2 h-2 rounded-full animate-ping shrink-0 ${isComingSoon ? 'bg-purple-500' : 'bg-amber-500'}`} />
          
          {isComingSoon ? (
            <>
              <span className="text-purple-900 dark:text-purple-300">
                🚀 Official Grand Launch Countdown
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
              <span className="text-pink-600 dark:text-pink-400 hidden sm:inline">48h Delivery Templates Coming Soon</span>
            </>
          ) : (
            <>
              <span className="text-amber-900 dark:text-amber-300">
                🛠️ Scheduled Infrastructure Upgrade
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
              <span className="text-purple-600 dark:text-purple-400 hidden sm:inline">Back Online Shortly</span>
            </>
          )}
        </div>

        {/* Main Headline */}
        <div className="space-y-2 sm:space-y-3 max-w-3xl mx-auto px-2">
          {isComingSoon ? (
            <>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Something <span className="l2b-gradient-text">Massive</span> Is Coming Soon.
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                We are engineering the future of high-converting web architecture for Indian brands. Connect below for early VIP access!
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                We Are Under <span className="l2b-gradient-text">Scheduled</span> Upgrade.
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                Our engineering team is deploying performance enhancements and edge optimizations. We will be back online in just a moment.
              </p>
            </>
          )}
        </div>

        {/* Live Glass Countdown Timer Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 max-w-xl mx-auto px-2">
          {/* Days */}
          <div className="glass-panel p-3 sm:p-5 rounded-2xl border border-white dark:border-slate-700/80 shadow-floating flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mt-0.5">
              Days
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 opacity-60" />
          </div>

          {/* Hours */}
          <div className="glass-panel p-3 sm:p-5 rounded-2xl border border-white dark:border-slate-700/80 shadow-floating flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mt-0.5">
              Hours
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-60" />
          </div>

          {/* Minutes */}
          <div className="glass-panel p-3 sm:p-5 rounded-2xl border border-white dark:border-slate-700/80 shadow-floating flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mt-0.5">
              Minutes
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 opacity-60" />
          </div>

          {/* Seconds */}
          <div className="glass-panel p-3 sm:p-5 rounded-2xl border border-white dark:border-slate-700/80 shadow-floating flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-pink-600 dark:text-pink-400 tracking-tight font-mono animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mt-0.5">
              Seconds
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-pink-600 opacity-80" />
          </div>
        </div>

        {/* Instagram DM Contact / Early Access Form */}
        <div className="w-full max-w-xl mx-auto text-left pt-1 px-1">
          <div className="glass-panel p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border border-white dark:border-slate-700/80 shadow-xl relative overflow-hidden bg-white/95 dark:bg-slate-900/95">
            <div className="mb-4 text-center">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-pink-700 dark:text-pink-400 inline-flex items-center gap-1.5 mb-1">
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>{isComingSoon ? 'Early VIP Access Form' : 'Emergency Contact Form'}</span>
              </span>
              <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 dark:text-white">
                {isComingSoon ? 'Connect with us on Instagram DM' : 'Need immediate assistance?'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Submit this form to open our Instagram DM with your message ready to send.
              </p>
            </div>

            <form onSubmit={handleInstaSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Your Name <span className="text-pink-600 dark:text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Brand / Business <span className="text-pink-600 dark:text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    required
                    placeholder="e.g. Acme Corp"
                    value={formData.businessName}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    name="instagramHandle"
                    placeholder="@yourhandle"
                    value={formData.instagramHandle}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="rahul@domain.com"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  {isComingSoon ? 'Project Details' : 'Message / Issue Details'}
                </label>
                <textarea
                  name="requirements"
                  rows="2"
                  placeholder={isComingSoon ? "Tell us what kind of website you are planning..." : "Let us know your inquiry during maintenance..."}
                  value={formData.requirements}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <InstagramIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">{isSubmitting ? 'Opening Instagram...' : 'Submit & Connect on Instagram DM'}</span>
                <Send className="w-3.5 h-3.5 shrink-0 ml-1" />
              </button>
            </form>

            {/* Subtle bottom tricolor accent */}
            <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/60 via-blue-500/40 to-emerald-500/60" />
          </div>
        </div>

      </main>

      {/* Bottom Footer & Admin Bypass Launcher */}
      <footer className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 pb-2 border-t border-slate-200/80 dark:border-slate-800 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 relative z-10 text-center sm:text-left">
        <div className="flex items-center gap-1.5 justify-center sm:justify-start">
          <AshokaChakra size={11} />
          <span>© {new Date().getFullYear()} LOCAL2BRAND. Proudly Engineered in India.</span>
        </div>

        {/* Admin Bypass Key Trigger Button */}
        <button
          onClick={() => setShowAdminModal(true)}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          title="Admin Access Bypass"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Admin Access</span>
        </button>
      </footer>

      {/* Instagram DM Success Confirmation Modal */}
      {showInstaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-md"
            onClick={() => setShowInstaModal(false)}
          />

          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-white dark:border-slate-700 z-10 animate-in fade-in zoom-in-95 text-center space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
              <InstagramIcon className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Opening Instagram DM...
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
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
                className="py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Modal (Grants 10-Minute Device Bypass) */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-md transition-opacity"
            onClick={() => setShowAdminModal(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl rounded-3xl border border-white dark:border-slate-700 p-5 sm:p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Admin Preview Access</h3>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Enter your admin password to bypass maintenance/coming soon mode on this device for <strong>10 minutes</strong>.
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {errorMsg && (
                <div className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {isSuccess && (
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
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
