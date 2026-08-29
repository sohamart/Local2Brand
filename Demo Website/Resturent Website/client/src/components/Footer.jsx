import React from 'react';
import { 
  Flame, 
  Phone, 
  MapPin, 
  Globe, 
  Share2, 
  Send, 
  ShieldCheck, 
  MessageSquare
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer({ onOpenAdmin, onOpenReservation, onOpenAuth }) {
  const { settings } = useSettings();

  return (
    <footer className="bg-[#0f0c0a] border-t border-[#A9865A]/20 text-[#D6C8B2] text-xs font-sans">
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
          <span>● SSL 256-Bit Encrypted Ticket System</span>
        </div>
      </div>
    </footer>
  );
}
