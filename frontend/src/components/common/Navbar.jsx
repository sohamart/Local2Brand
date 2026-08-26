import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useOrderModal } from '../../context/OrderModalContext';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../../utils/whatsapp';
import AshokaChakra from './AshokaChakra';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openOrderModal } = useOrderModal();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change & handle body scroll lock
  useEffect(() => {
    setMobileMenuOpen(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    const nextState = !mobileMenuOpen;
    setMobileMenuOpen(nextState);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = nextState ? 'hidden' : 'auto';
    }
  };

  const handleWhatsAppQuickChat = () => {
    openWhatsAppChat(generateWhatsAppGeneralUrl());
  };

  return (
    <>
      <header className={`fixed left-0 right-0 z-40 px-3 xs:px-4 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none ${
        isScrolled ? 'top-0 pt-2 sm:pt-3' : 'top-8 sm:top-9 pt-1.5 sm:pt-2'
      }`}>
        <nav
          className={`max-w-7xl mx-auto rounded-full transition-all duration-300 pointer-events-auto flex items-center justify-between px-3.5 sm:px-6 relative overflow-hidden ${
            isScrolled
              ? 'py-2 sm:py-2.5 glass-waterdrop shadow-waterdrop scale-[0.99]'
              : 'py-2.5 sm:py-3.5 glass-waterdrop shadow-waterdrop'
          }`}
        >
          {/* Brand Logo with 3D Liquid L2B Gradient */}
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl p-0.5"
          >
            {/* 3D Liquid Glass L2B Badge */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl l2b-gradient-bg p-[1.5px] shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform shrink-0 relative">
              <div className="w-full h-full bg-white/15 backdrop-blur-md rounded-[10px] flex items-center justify-center text-white font-extrabold text-sm sm:text-base tracking-tighter border border-white/40">
                L<span className="text-pink-200">2</span>B
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base lg:text-lg tracking-tight text-slate-900 leading-none">
                  LOCAL<span className="l2b-gradient-text">2</span>BRAND
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs">
                  <AshokaChakra size={11} />
                  <span>IN</span>
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5 hidden xs:block">
                Build Local. Think Global.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1 rounded-full bg-white/65 backdrop-blur-md border border-white/90 shadow-inner">
            {siteConfig.navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-slate-900 font-bold shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Direct WhatsApp Button */}
            <button
              onClick={handleWhatsAppQuickChat}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-btn text-xs font-bold text-emerald-800 bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200/80 transition-all duration-200 shadow-sm cursor-pointer"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
              <span>WhatsApp</span>
            </button>

            {/* Get Started Button (Opens Order Modal) */}
            <button
              onClick={() => openOrderModal({ websiteType: 'Custom Project Inquiry' })}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn text-xs font-bold text-white l2b-gradient-bg hover:opacity-95 shadow-glass-highlight hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Right Action Area (WhatsApp + Hamburger) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            <button
              onClick={handleWhatsAppQuickChat}
              className="p-2 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
              aria-label="WhatsApp Quick Consultation"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-600/20" />
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full text-slate-800 hover:bg-slate-100/80 border border-slate-200/70 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>

          {/* Indian Flag Tricolor Border along the BOTTOM RIM of Navbar */}
          <div 
            className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full pointer-events-none" 
            style={{
              background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 30%, #0072FF 50%, #FFFFFF 70%, #138808 100%)',
              boxShadow: '0 1px 4px rgba(255, 153, 51, 0.25)'
            }}
          />
        </nav>
      </header>

      {/* Mobile Glass Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden flex flex-col justify-between pt-20 pb-6 px-4 xs:px-6 bg-white/95 backdrop-blur-2xl animate-in fade-in duration-200 overflow-y-auto">
          
          {/* Top Links List */}
          <div className="flex flex-col space-y-1.5 mt-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-2 flex items-center justify-between">
              <span>Navigation</span>
              <span className="text-amber-700 font-bold flex items-center gap-1">
                <AshokaChakra size={13} />
                <span>Made in India</span>
              </span>
            </div>
            {siteConfig.navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-2xl text-base font-semibold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200 shadow-sm'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`
                }
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Bottom Action Bar */}
          <div className="space-y-3 pt-6 border-t border-slate-100 mt-6">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openOrderModal({ websiteType: 'Custom Project Inquiry' });
              }}
              className="w-full py-4 px-5 rounded-2xl font-bold text-sm text-white l2b-gradient-bg flex items-center justify-center gap-2 shadow-glass-highlight active:scale-[0.98] transition-transform"
            >
              <span>Start Your Website</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleWhatsAppQuickChat();
              }}
              className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-emerald-800 bg-emerald-50 border border-emerald-200/90 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Direct WhatsApp Chat</span>
            </button>

            <div className="text-center pt-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                {siteConfig.brandName} • {siteConfig.tagline}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
