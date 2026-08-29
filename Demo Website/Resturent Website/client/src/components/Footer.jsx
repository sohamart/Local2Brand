import React, { useState } from 'react';
import { 
  Flame, 
  Phone, 
  MapPin, 
  Globe, 
  Share2, 
  Send, 
  ShieldCheck, 
  MessageSquare,
  CheckCircle,
  Loader2,
  Mail,
  Sparkles
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';

export default function Footer({ onOpenAdmin, onOpenReservation, onOpenAuth }) {
  const { settings } = useSettings();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState(null); // { type: 'success' | 'error', msg: string }

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setSubscribing(true);
    setSubscribeStatus(null);

    try {
      const res = await api.subscribeNewsletter(newsletterEmail.trim());
      setSubscribeStatus({ type: 'success', msg: res.message || 'Subscribed! Check your email for your 20% discount code.' });
      setNewsletterEmail('');
    } catch (err) {
      setSubscribeStatus({ type: 'error', msg: err.message || 'Failed to subscribe. Please check email address.' });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#0f0c0a] border-t border-[#A9865A]/20 text-[#D6C8B2] text-xs font-sans">
      
      {/* Newsletter Smoke Club Banner */}
      <div className="bg-[#171310] border-b border-[#A9865A]/15 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#231d19] border border-[#A9865A]/30 text-[#E8AC4E] text-[10px] font-mono uppercase tracking-widest mb-2">
              <Sparkles className="w-3 h-3 text-[#D8632C]" />
              <span>VIP Smoke Club Newsletter</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F3E9D8]">
              Join the Artisanal Smoke Club
            </h3>
            <p className="text-[#A9865A] text-xs mt-1 font-sans">
              Subscribe to receive weekly secret tandoor recipes, weekend tasting invites, and an instant <strong>20% discount voucher</strong> sent to your email.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="w-full lg:w-auto">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-[#A9865A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email (e.g. foodlover@gmail.com)"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0f0c0a] border border-[#A9865A]/30 rounded-xl text-xs text-[#F3E9D8] placeholder-[#A9865A]/60 font-mono focus:outline-none focus:border-[#D8632C]"
                />
              </div>

              <button
                type="submit"
                disabled={subscribing}
                className="btn-ember-primary px-5 py-2.5 rounded-xl font-sans font-bold text-xs flex items-center justify-center gap-1.5 shrink-0"
              >
                {subscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Get 20% Voucher</span>
              </button>
            </form>

            {subscribeStatus && (
              <div className={`mt-2 font-mono text-[11px] flex items-center gap-1.5 ${
                subscribeStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {subscribeStatus.type === 'success' && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
                <span>{subscribeStatus.msg}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-[#A9865A]/15 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#231d19] border border-[#A9865A]/40 flex items-center justify-center text-[#D8632C]">
              <Flame className="w-5 h-5 fill-[#D8632C]" />
            </div>
            <div>
              <span className="font-display text-lg font-bold text-[#F3E9D8] tracking-tight block">
                {settings.restaurant_name}
              </span>
              <span className="font-mono text-[9px] text-[#A9865A] tracking-[0.2em] uppercase">
                Charcoal & Gourmet Grill
              </span>
            </div>
          </div>

          <p className="text-[#A9865A] leading-relaxed text-xs">
            {settings.tagline}. Romance fused with the raw theatre of the open tandoor flame.
          </p>

          <div className="flex items-center gap-2.5 text-[#A9865A]">
            <a href="#" className="w-8 h-8 rounded-lg bg-[#171310] border border-[#A9865A]/30 flex items-center justify-center hover:text-[#E8AC4E] transition-colors">
              <Globe className="w-3.5 h-3.5" />
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-[#171310] border border-[#A9865A]/30 flex items-center justify-center hover:text-[#E8AC4E] transition-colors">
              <Share2 className="w-3.5 h-3.5" />
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-[#171310] border border-[#A9865A]/30 flex items-center justify-center hover:text-[#E8AC4E] transition-colors">
              <Send className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3 font-mono">
          <h4 className="font-bold text-[#F3E9D8] uppercase tracking-wider text-xs">Dining Sections</h4>
          <ul className="space-y-2 text-[#D6C8B2]">
            <li><a href="#menu" className="hover:text-[#E8AC4E] transition-colors">Tandoor & Charcoal Menu</a></li>
            <li><button onClick={onOpenReservation} className="hover:text-[#E8AC4E] transition-colors">Reserve Table Ticket</button></li>
            <li><a href="#reviews" className="hover:text-[#E8AC4E] transition-colors">Foodie Testimonials</a></li>
            <li><a href="#location" className="hover:text-[#E8AC4E] transition-colors">Kitchen Location & Map</a></li>
            <li><button onClick={onOpenAuth} className="hover:text-[#E8AC4E] transition-colors">Customer Account Login</button></li>
          </ul>
        </div>

        {/* Operating Hours & Contact */}
        <div className="space-y-3 font-mono">
          <h4 className="font-bold text-[#F3E9D8] uppercase tracking-wider text-xs">Direct Hotlines</h4>
          <ul className="space-y-2.5 text-[#D6C8B2]">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#E8AC4E] shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#E8AC4E] shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-[#F3E9D8]">{settings.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
              <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] text-[#25D366] font-bold">
                WhatsApp Dispatch
              </a>
            </li>
            <li className="text-[10px] text-[#A9865A] pt-1">
              Fires Lit: {settings.opening_hours}
            </li>
          </ul>
        </div>

        {/* Payment & Security */}
        <div className="space-y-3 font-mono">
          <h4 className="font-bold text-[#F3E9D8] uppercase tracking-wider text-xs">Payment & Dispatch</h4>
          <p className="text-[11px] text-[#A9865A]">
            Encrypted payments via Razorpay Gateway, UPI QR, Cash on Delivery & WhatsApp Direct.
          </p>
          <div className="flex flex-wrap gap-1.5 text-[10px] text-[#E8AC4E]">
            <span className="px-2 py-0.5 bg-[#171310] rounded border border-[#A9865A]/30">Razorpay</span>
            <span className="px-2 py-0.5 bg-[#171310] rounded border border-[#A9865A]/30">UPI QR</span>
            <span className="px-2 py-0.5 bg-[#171310] rounded border border-[#A9865A]/30">COD</span>
            <span className="px-2 py-0.5 bg-[#171310] rounded border border-[#A9865A]/30">WhatsApp</span>
          </div>

          <div className="pt-3">
            <button
              onClick={onOpenAdmin}
              className="text-[11px] text-[#92b584] hover:underline flex items-center gap-1 font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Master Admin Control Portal →</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Legal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#A9865A]">
        <div>
          © {new Date().getFullYear()} {settings.restaurant_name}. Fine Dining Meets the Open Flame.
        </div>
        <div className="flex items-center gap-1 text-[#92b584]">
          <span>● SSL 256-Bit Encrypted Ticket System • Automated Email Notifications Active</span>
        </div>
      </div>
    </footer>
  );
}
