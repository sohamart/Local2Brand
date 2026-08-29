import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Clock, 
  Navigation, 
  Car, 
  Wifi, 
  Flame, 
  ShieldCheck 
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function LocationMapSection() {
  const { settings } = useSettings();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || "12/A Park Avenue, Central City")}`;

  return (
    <section id="location" className="py-24 bg-[#171310] relative border-b border-[#A9865A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#231d19] border border-[#A9865A]/30 text-[#E8AC4E] text-[11px] font-mono uppercase tracking-widest mb-3">
            <MapPin className="w-3 h-3 text-[#D8632C]" />
            <span>Open Flame Dining Hub</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F3E9D8] tracking-tight mb-4">
            Visit Our <span className="italic font-normal text-[#E8AC4E]">Restaurant & Tandoor</span>
          </h2>
          <p className="text-[#D6C8B2] text-sm sm:text-base font-sans">
            Centrally located with outdoor charcoal terrace and live master kitchen view.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Info Card (Left) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#231d19] border border-[#A9865A]/30 flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#171310] border border-[#A9865A]/30 flex items-center justify-center shrink-0 text-[#E8AC4E]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#F3E9D8] mb-1">Physical Location</h4>
                  <p className="text-[#D6C8B2] text-xs sm:text-sm font-sans">{settings.address}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#171310] border border-[#A9865A]/30 flex items-center justify-center shrink-0 text-[#E8AC4E]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#F3E9D8] mb-1">Kitchen & Delivery Hours</h4>
                  <p className="text-[#D6C8B2] text-xs sm:text-sm font-mono">{settings.opening_hours}</p>
                  <span className="inline-block mt-1 font-mono text-[10px] text-[#92b584] bg-[#33402E]/30 px-2 py-0.5 rounded border border-[#33402E]">
                    OPEN 7 DAYS A WEEK
                  </span>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono">
                <a
                  href={`tel:${settings.phone}`}
                  className="btn-brass-pill p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E8AC4E]" />
                  <span>Call: {settings.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent("Hello L'Amour Gourmet, I'm visiting or have a question!")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brass-pill p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:border-[#25D366]/50"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="pt-6 border-t border-[#A9865A]/20 grid grid-cols-3 gap-3 text-center font-mono">
              <div className="p-3 rounded-xl bg-[#171310] border border-[#A9865A]/20">
                <Car className="w-4 h-4 text-[#A9865A] mx-auto mb-1" />
                <span className="text-[10px] text-[#D6C8B2]">Valet Parking</span>
              </div>
              <div className="p-3 rounded-xl bg-[#171310] border border-[#A9865A]/20">
                <Wifi className="w-4 h-4 text-[#A9865A] mx-auto mb-1" />
                <span className="text-[10px] text-[#D6C8B2]">Free High-Speed Wi-Fi</span>
              </div>
              <div className="p-3 rounded-xl bg-[#171310] border border-[#A9865A]/20">
                <Flame className="w-4 h-4 text-[#D8632C] mx-auto mb-1" />
                <span className="text-[10px] text-[#D6C8B2]">Open Tandoor</span>
              </div>
            </div>

          </div>

          {/* Map Frame (Right) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#A9865A]/30 shadow-2xl bg-[#0f0c0a] flex flex-col min-h-[380px]">
            
            <iframe
              title="Restaurant Location"
              width="100%"
              height="100%"
              className="flex-1 min-h-[340px] border-0 filter contrast-125 saturate-125 opacity-85"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address || "12/A Park Avenue")}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            ></iframe>

            {/* Bottom Bar */}
            <div className="p-4 bg-[#171310] border-t border-[#A9865A]/20 flex items-center justify-between flex-wrap gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-[#D6C8B2]">
                <ShieldCheck className="w-4 h-4 text-[#92b584]" />
                <span>Live GPS Navigation Active</span>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brass-pill px-4 py-1.5 rounded-full text-[#E8AC4E] font-bold flex items-center gap-1.5"
              >
                <Navigation className="w-3 h-3" />
                <span>Open in Google Maps</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
