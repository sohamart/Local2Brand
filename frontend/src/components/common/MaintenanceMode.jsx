import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  KeyRound, 
  MessageCircle, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../../utils/whatsapp';
import AshokaChakra from './AshokaChakra';

export default function MaintenanceMode({ onBypassSuccess }) {
  // Target Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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
          minutes: Math.floor((difference / 1000 / 60) % 60),
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

  const handleWhatsAppContact = () => {
    openWhatsAppChat(
      generateWhatsAppGeneralUrl('Hello LOCAL2BRAND, I saw your Coming Soon / Launch countdown and want to discuss a project.')
    );
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-between p-4 sm:p-8 relative overflow-hidden font-sans text-slate-900 selection:bg-purple-600 selection:text-white">
      
      {/* Background Ambient Liquid Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-400/20 via-purple-500/20 to-pink-500/25 rounded-full blur-[110px] pointer-events-none" />
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

        {/* Top Right Direct WhatsApp Quick Pill */}
        <button
          onClick={handleWhatsAppContact}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
          <span className="hidden xs:inline">WhatsApp Founders</span>
        </button>
      </header>

      {/* Center Main Countdown & Announcement Stage */}
      <main className="w-full max-w-4xl mx-auto text-center space-y-8 py-8 sm:py-12 relative z-10">
        
        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200 shadow-sm text-xs font-bold text-slate-800 animate-float">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span className="text-amber-900">
            {siteConfig.isMaintenanceMode ? '🛠️ Scheduled Infrastructure Upgrade' : '🚀 Grand Platform Launch'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-purple-600">48h Delivery Coming Soon</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Something <span className="l2b-gradient-text">Massive</span> Is On The Way.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            We are fine-tuning our Apple-grade liquid glass website templates and direct WhatsApp order engine for Indian businesses.
          </p>
        </div>

        {/* Live Glass Countdown Timer Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto pt-2">
          {/* Days */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white shadow-floating flex flex-col items-center justify-center relative overflow-hidden group">
            <span className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
              Days
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 opacity-60" />
          </div>

          {/* Hours */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white shadow-floating flex flex-col items-center justify-center relative overflow-hidden group">
            <span className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
              Hours
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-60" />
          </div>

          {/* Minutes */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white shadow-floating flex flex-col items-center justify-center relative overflow-hidden group">
            <span className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
              Minutes
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 opacity-60" />
          </div>

          {/* Seconds */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white shadow-floating flex flex-col items-center justify-center relative overflow-hidden group">
            <span className="text-3xl sm:text-5xl font-black text-pink-600 tracking-tight font-mono animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
              Seconds
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-pink-600 opacity-80" />
          </div>
        </div>

        {/* Action Callouts */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={handleWhatsAppContact}
            className="w-full sm:w-auto px-7 py-3.5 rounded-btn text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp for Early Launch</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Early Bird Perks */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 pt-2">
          <span className="inline-flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            20% OFF Launch Code: INDIA2025
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            48h Turnaround Guaranteed
          </span>
        </div>

      </main>

      {/* Bottom Footer & Admin Bypass Launcher */}
      <footer className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 pb-2 border-t border-slate-200/80 text-xs text-slate-500 relative z-10">
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
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
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
