import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, PhoneCall, Sparkles, ArrowRight, Shield, Zap, ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useOrderModal } from '../../context/OrderModalContext';
import AshokaChakra from './AshokaChakra';
import ThemeToggle from './ThemeToggle';

const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

export default function Footer() {
  const { settings } = useSiteSettings();
  const { openOrderModal, openCallbackModal } = useOrderModal();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 pt-16 pb-10 border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-950/80 backdrop-blur-2xl transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-blue-600 to-emerald-600 opacity-85" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top CTA Bento Ribbon */}
        <div className="glass-panel p-6 sm:p-10 rounded-hero border border-white dark:border-slate-700/80 shadow-glass mb-14 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <AshokaChakra size={13} />
              <span>Launch Special • Save 20% Today</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ready to Turn Your Local Business Into A Global Brand?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Connect directly with our engineering & design team. Get a high-converting, {settings.turnaroundTime} delivered website tailored for your business.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => openOrderModal({ websiteType: 'General Proposal from Footer' })}
              className="w-full sm:w-auto px-6 py-3.5 rounded-btn text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <span>Get Your Website ({settings.startingPriceInr} / {settings.startingPriceUsd})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openCallbackModal()}
              className="w-full sm:w-auto px-5 py-3.5 rounded-btn text-sm font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Request Callback</span>
            </button>
          </div>
        </div>

        {/* Directory Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-200/80 dark:border-slate-800">
          
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-purple-500/20 border border-white dark:border-slate-700 bg-white dark:bg-slate-900">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                    LOCAL<span className="l2b-gradient-text">2</span>BRAND
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/40 px-1.5 py-0.5 rounded shadow-2xs">
                    <AshokaChakra size={9} />
                    <span>INDIA</span>
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 tracking-wide mt-0.5">
                  {settings.tagline}
                </span>
              </div>
            </Link>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              Empowering ambitious Indian & global businesses with high-speed, 48-hour turnarounds, bespoke conversion UI, and direct-to-database lead capture.
            </p>

            <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>{settings.supportEmail}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Explore Showcase
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li><Link to="/demos" className="hover:text-purple-600">Template Marketplace</Link></li>
              <li><Link to="/services" className="hover:text-purple-600">Fast-Track Websites</Link></li>
              <li><Link to="/services" className="hover:text-purple-600">E-Commerce Stores</Link></li>
              <li><Link to="/pricing" className="hover:text-purple-600">Pricing Packages</Link></li>
              <li><Link to="/portfolio" className="hover:text-purple-600">Client Portfolio</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Client Portal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li><Link to="/track-order" className="font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"><span>⚡ Track Live Order</span></Link></li>
              <li><Link to="/login" className="hover:text-purple-600">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-purple-600">Register Account</Link></li>
              <li><Link to="/dashboard" className="hover:text-purple-600">Client Dashboard</Link></li>
              <li><Link to="/about" className="hover:text-purple-600">About Founders</Link></li>
              <li><Link to="/contact" className="hover:text-purple-600">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Direct Actions
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={() => openOrderModal()}
                className="w-full text-left p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200 text-xs font-bold hover:bg-purple-100 transition-colors"
              >
                Instant Proposal Builder
              </button>
              <button
                onClick={() => openCallbackModal()}
                className="w-full text-left p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                Schedule Founder Call
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} {settings.brandName}. All rights reserved. Crafted with Pride in India 🇮🇳.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="hover:text-purple-600">Privacy Policy</Link>
            <span>•</span>
            <Link to="/pricing" className="hover:text-purple-600">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
