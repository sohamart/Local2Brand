import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Send,
  Sparkles,
  CheckCircle2,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  Compass,
  ArrowRight
} from 'lucide-react';
import { realEstateConfig } from './config';

export default function RealEstateDemo({ customConfig }) {
  const config = customConfig || realEstateConfig;

  const [visitForm, setVisitForm] = useState({
    name: '',
    phone: '',
    date: '',
    property: 'The Sky Penthouse at Worli Sea Face'
  });

  const handleInquireProperty = (prop) => {
    const text =
      `🏠 *PROPERTY INQUIRY - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🏢 *Project:* ${prop.title}\n` +
      `📍 *Location:* ${prop.location}\n` +
      `💰 *Price:* ${prop.price}\n` +
      `📐 *Layout:* ${prop.bhk} (${prop.carpetArea})\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi, I want the floor plan brochure and schedule a VIP site visit!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleVisitSubmit = (e) => {
    e.preventDefault();
    const text =
      `🚗 *VIP SITE VISIT BOOKING - ${config.businessName}*\n\n` +
      `👤 Name: *${visitForm.name}*\n` +
      `📞 Phone: *${visitForm.phone}*\n` +
      `🏢 Interested Property: *${visitForm.property}*\n` +
      `📅 Preferred Date: *${visitForm.date || 'This Weekend'}*\n\n` +
      `Please arrange a site visit with your senior property consultant.`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#080d17] text-[#f1f5f9] font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#0b1b17] text-emerald-400 text-xs font-bold py-2 px-4 text-center border-b border-[#13382c]">
        <span>🏡 100% RERA-VERIFIED PRIME RESIDENTIAL & COMMERCIAL DEVELOPMENTS • ZERO BROKERAGE DIRECT DEVELOPER DEALS</span>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0d1424]/95 backdrop-blur-2xl border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-white block leading-none">{config.businessName}</span>
              <span className="text-[10px] text-emerald-400 tracking-wider uppercase mt-0.5 block font-bold">{config.businessSubtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-400">
            <a href="#properties" className="hover:text-emerald-400">Exclusive Listings</a>
            <a href="#visit" className="hover:text-emerald-400">Book Site Visit</a>
            <a href="#location" className="hover:text-emerald-400">HQ Address</a>
          </div>

          <a
            href="#visit"
            className="px-4 py-2 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md"
          >
            Schedule Site Visit
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-[75vh] flex items-center justify-center py-16 px-4 text-center">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Luxury Real Estate" className="w-full h-full object-cover brightness-[0.25]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d17] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-5">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#0b241b] text-emerald-400 border border-[#16503b] inline-flex items-center gap-1.5 shadow-xl">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Curated Ultra-Luxury Penthouses & Hill Villas</span>
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Acquire Extraordinary Homes in <span className="text-emerald-400">Prime Locations</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#properties"
              className="px-7 py-3 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20"
            >
              Browse Property Listings
            </a>
            <a
              href="#visit"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#131d31] text-white border border-slate-700 hover:bg-[#1e2c47]"
            >
              VIP Chauffeur Site Visit
            </a>
          </div>
        </div>
      </header>

      {/* Properties Grid */}
      <section id="properties" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Verified Portfolios</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Featured Luxury Residences</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.properties.map((prop) => (
            <div
              key={prop.id}
              className="rounded-3xl bg-[#0f172a] border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-xl group"
            >
              <div className="h-56 overflow-hidden relative">
                <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase">
                  {prop.status}
                </span>
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-xs font-bold text-white">
                  {prop.bhk}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-2xl font-black text-emerald-400 mb-1">{prop.price}</div>
                  <h3 className="font-bold text-base text-white">{prop.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{prop.location}</span>
                  </div>

                  <div className="space-y-1.5 pt-3 text-xs text-slate-300">
                    {prop.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleInquireProperty(prop)}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-emerald-400 cursor-pointer shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Get Floor Plan & Brochure</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP Site Visit Form */}
      <section id="visit" className="py-16 px-4 sm:px-8 bg-[#0b101c] border-t border-slate-800">
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#121c32] border border-slate-700 space-y-4">
          <h3 className="font-bold text-xl text-white">Schedule a Private VIP Site Visit</h3>
          <form onSubmit={handleVisitSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Your Full Name *"
              value={visitForm.name}
              onChange={(e) => setVisitForm({ ...visitForm, name: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#090e18] border border-slate-700 text-xs text-white"
            />
            <input
              type="tel"
              required
              placeholder="WhatsApp Phone *"
              value={visitForm.phone}
              onChange={(e) => setVisitForm({ ...visitForm, phone: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#090e18] border border-slate-700 text-xs text-white"
            />
            <input
              type="date"
              required
              value={visitForm.date}
              onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#090e18] border border-slate-700 text-xs text-white"
            />
            <button
              type="submit"
              className="sm:col-span-2 md:col-span-3 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase hover:bg-emerald-400 cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Book Site Visit on WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 border-t border-slate-800 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-sm text-white block">{config.businessName}</span>
            <span>{config.address} • {config.hours}</span>
          </div>
          <span className="text-emerald-400 font-bold">Production Ready Template by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
