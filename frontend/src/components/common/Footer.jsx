import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useOrderModal } from '../../context/OrderModalContext';
import { generateWhatsAppGeneralUrl, openWhatsAppChat, getSanitizedWhatsAppNumber } from '../../utils/whatsapp';
import AshokaChakra from './AshokaChakra';
import ThemeToggle from './ThemeToggle';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

export default function Footer() {
  const { openOrderModal } = useOrderModal();
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    openWhatsAppChat(generateWhatsAppGeneralUrl());
  };

  const getInstagramUsername = () => {
    const handle = siteConfig.socialLinks.instagramHandle || siteConfig.socialLinks.instagram || '@local2brand';
    return handle.replace(/https?:\/\/(www\.)?instagram\.com\//, '').replace(/@/, '').replace(/\/$/, '');
  };

  return (
    <footer className="relative z-10 pt-16 pb-10 border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-950/80 backdrop-blur-2xl transition-colors duration-300">
      {/* Subtle Top Indian Flag Accent Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-blue-600 to-emerald-600 opacity-85" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top CTA Bento Ribbon inside Footer */}
        <div className="glass-panel p-6 sm:p-10 rounded-hero border border-white dark:border-slate-700/80 shadow-glass mb-14 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <AshokaChakra size={13} />
              <span>Launch Special • Save 20% Today</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ready to Turn Your Local Business Into a Big Brand?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Connect directly with our engineering team on WhatsApp. Get a high-converting, 48-hour delivered website customized for your brand.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => openOrderModal({ websiteType: 'General Inquiries from Footer' })}
              className="w-full sm:w-auto px-6 py-3.5 rounded-btn text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <span>Get Your Website (₹9,999 / $399)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhatsAppClick}
              className="w-full sm:w-auto px-5 py-3.5 rounded-btn text-sm font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp Chat</span>
            </button>
          </div>
        </div>

        {/* 4-Column Directory Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-200/80 dark:border-slate-800">

          {/* Col 1 & 2: Brand & Indian Heritage Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-purple-500/20 border border-white dark:border-slate-700 bg-white dark:bg-slate-900">
                <img
                  src="/logo.jpg"
                  alt="LOCAL2BRAND Official 3D Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                    LOCAL<span className="l2b-gradient-text">2</span>BRAND
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/40 px-1.5 py-0.5 rounded shadow-2xs">
                    <AshokaChakra size={11} />
                    <span>IN</span>
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-0.5">
                  {siteConfig.tagline}
                </span>
              </div>
            </Link>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              We empower Indian businesses and ambitious global brands with world-class digital experiences, liquid glass interfaces, and rapid 48-hour turnarounds.
            </p>

            {/* Direct Official Contact Coordinates from .env */}
            <div className="space-y-1.5 pt-2 text-xs font-semibold">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <a href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${getSanitizedWhatsAppNumber()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  WhatsApp: {siteConfig.displayWhatsApp}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 shrink-0" />
                <a
                  href={siteConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  Instagram: @{getInstagramUsername()}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Navigation Links */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              {siteConfig.navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Live Website Showcases */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Website Showcases</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/demos" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  All 12 Live Demos
                </Link>
              </li>
              <li>
                <Link to="/demos/lms" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  LMS & Course Selling
                </Link>
              </li>
              <li>
                <Link to="/demos/cafe" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Cafe & Roastery
                </Link>
              </li>
              <li>
                <Link to="/demos/realestate" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Real Estate & Villas
                </Link>
              </li>
              <li>
                <Link to="/demos/jewellery" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Jewellery & Luxury
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: WhatsApp Instant Ordering Engine */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Launch Your Project</h4>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Order directly on WhatsApp. 48-Hour delivery guarantee on all showcase live website setups.
            </p>
            <button
              onClick={() => openOrderModal()}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Project Order</span>
            </button>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>48-Hour Turnaround Guarantee on showcase websites.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright, Legal Links, and Made in India Badge */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {currentYear} {siteConfig.brandName}. All rights reserved.</p>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-500/40 flex items-center gap-1">
              <AshokaChakra size={11} />
              <span>Made with Pride in India</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle showLabel={true} />
            <a
              href={siteConfig.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center gap-1 font-semibold"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@{getInstagramUsername()}</span>
            </a>
            <a
              href={`https://wa.me/${getSanitizedWhatsAppNumber()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
