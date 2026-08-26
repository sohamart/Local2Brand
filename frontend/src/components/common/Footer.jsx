import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin, ArrowUpRight, Heart, Sparkles } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useOrderModal } from '../../context/OrderModalContext';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../../utils/whatsapp';
import AshokaChakra from './AshokaChakra';

export default function Footer() {
  const { openOrderModal } = useOrderModal();

  const handleWhatsAppClick = () => {
    openWhatsAppChat(generateWhatsAppGeneralUrl());
  };

  return (
    <footer className="relative border-t border-slate-200/80 bg-white/75 backdrop-blur-xl pt-16 pb-12 overflow-hidden">
      {/* Soft L2B liquid glow in footer */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-gradient-to-r from-amber-300/20 via-purple-300/20 to-emerald-300/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-200/70">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-purple-500/25 border border-white/80 bg-white">
                <img 
                  src="/logo.jpg" 
                  alt="LOCAL2BRAND Official 3D Logo" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                    LOCAL<span className="l2b-gradient-text">2</span>BRAND
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 px-1.5 py-0.2 rounded">
                    <AshokaChakra size={11} />
                    <span>IN</span>
                  </span>
                </div>
                <span className="text-[11px] font-bold l2b-gradient-text tracking-wider uppercase mt-0.5">
                  {siteConfig.tagline}
                </span>
              </div>
            </Link>
            
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              We design and engineer bespoke, high-converting websites that empower Indian businesses, creators, and ambitious enterprises to compete and win on a global stage.
            </p>

            {/* Direct WhatsApp Callout */}
            <div className="pt-2">
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all shadow-sm cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Instant WhatsApp Consultation (English / Hindi / Regional)</span>
              </button>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              {siteConfig.navLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="hover:text-purple-600 transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-600" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Solutions
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/services" className="hover:text-purple-600 transition-colors">
                  Business Websites (from ₹9,999)
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-purple-600 transition-colors">
                  High-Converting Landing Pages
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-purple-600 transition-colors">
                  Creative Portfolios
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-purple-600 transition-colors">
                  D2C & E-commerce Stores
                </Link>
              </li>
              <li>
                <Link to="/demos" className="hover:text-purple-600 transition-colors">
                  Ready-Made Templates (48h Delivery)
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <a 
                href={`mailto:${siteConfig.email}`} 
                className="flex items-center gap-2 hover:text-purple-600 transition-colors"
              >
                <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{siteConfig.email}</span>
              </a>
              <a 
                href={`tel:${siteConfig.whatsappNumber}`} 
                className="flex items-center gap-2 hover:text-purple-600 transition-colors"
              >
                <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{siteConfig.phone}</span>
              </a>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WhatsApp: {siteConfig.displayWhatsapp}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Pan-India Studio • Global Edge Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Indian Flag Accent & Animated Chakra */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {siteConfig.brandName}.</span>
            <span className="inline-flex items-center gap-1.5 text-amber-950 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/70 shadow-2xs">
              <AshokaChakra size={12} />
              <span>Proudly Built in India</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-900 transition-colors">About Us</Link>
            <Link to="/pricing" className="hover:text-slate-900 transition-colors">INR (₹) & USD Pricing</Link>
            <Link to="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
          </div>
        </div>

        {/* Bottom Indian Flag Tricolor Micro-Line */}
        <div className="mt-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/80 via-blue-500/60 to-emerald-500/80 w-full" />
      </div>
    </footer>
  );
}
