import React, { useState } from 'react';
import {
  Camera,
  Film,
  Sparkles,
  Calendar,
  Phone,
  Send,
  CheckCircle2,
  Heart,
  Star,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { photographyConfig } from './config';

export default function PhotographyDemo({ customConfig }) {
  const config = customConfig || photographyConfig;

  const [dateChecker, setDateChecker] = useState({
    name: '',
    phone: '',
    dates: '',
    destination: 'Udaipur / Goa',
    packageType: 'The Royal 3-Day Destination Wedding'
  });

  const handleBookPackage = (pkg) => {
    const text =
      `📸 *WEDDING PHOTOGRAPHY INQUIRY - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💍 *Package:* ${pkg.name}\n` +
      `💰 *Price:* ₹${pkg.price.toLocaleString('en-IN')}\n` +
      `⏱️ *Coverage:* ${pkg.days}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi Lumiere team, I want to check your availability for our upcoming wedding dates!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDateSubmit = (e) => {
    e.preventDefault();
    const text =
      `💍 *DATE AVAILABILITY INQUIRY - ${config.businessName}*\n\n` +
      `👤 Couple Name: *${dateChecker.name}*\n` +
      `📞 Phone: *${dateChecker.phone}*\n` +
      `📅 Wedding Dates: *${dateChecker.dates || 'Upcoming Season'}*\n` +
      `📍 City / Destination: *${dateChecker.destination}*\n` +
      `🎬 Package: *${dateChecker.packageType}*\n\n` +
      `Please check team availability and share your quotation.`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#f1f5f9] font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#1c0a10] text-rose-400 text-xs font-bold py-2 px-4 text-center border-b border-[#3b1220]">
        <span>🎬 VOGUE & WEDMEGOOD FEATURED • 2026-27 DESTINATION WEDDING DATES NOW OPEN FOR BOOKING</span>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0c0c10]/95 backdrop-blur-2xl border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-black shadow-lg shadow-rose-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-white block leading-none">{config.businessName}</span>
              <span className="text-[10px] text-rose-400 tracking-wider uppercase mt-0.5 block font-bold">{config.businessSubtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-400">
            <a href="#packages" className="hover:text-rose-400">Packages</a>
            <a href="#checker" className="hover:text-rose-400">Check Dates</a>
            <a href="#location" className="hover:text-rose-400">Studio HQ</a>
          </div>

          <a
            href="#checker"
            className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md hover:opacity-95"
          >
            Check Date Availability
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-[75vh] flex items-center justify-center py-16 px-4 text-center">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Destination Wedding" className="w-full h-full object-cover brightness-[0.25]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-5">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#2b1019] text-rose-400 border border-[#541b2e] inline-flex items-center gap-1.5 shadow-xl">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cinematic Love Stories • Sony FX3 4K Full Frame</span>
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            We Immortalize Your <span className="bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">Royal Wedding Memories</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#packages"
              className="px-7 py-3 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xl shadow-rose-500/25 hover:opacity-95"
            >
              View Wedding Packages
            </a>
            <a
              href="#checker"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#14141c] text-white border border-slate-700 hover:bg-[#1f1f2b]"
            >
              Instant Date Checker
            </a>
          </div>
        </div>
      </header>

      {/* Packages */}
      <section id="packages" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Tailored Coverage</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Cinematography & Photo Packages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-7 rounded-3xl border flex flex-col justify-between relative transition-all ${
                pkg.popular
                  ? 'bg-gradient-to-b from-[#1f1118] to-[#12121a] border-rose-500/60 shadow-2xl shadow-rose-500/10 scale-105'
                  : 'bg-[#101017] border-slate-800'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-md">
                  Most Booked
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">{pkg.name}</h3>
                  <span className="text-xs text-rose-400 font-bold">{pkg.days}</span>
                </div>

                <div className="text-3xl font-black text-white">
                  ₹{pkg.price.toLocaleString('en-IN')}
                </div>

                <div className="space-y-2 pt-2 text-xs text-slate-300">
                  {pkg.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleBookPackage(pkg)}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Book Package on WhatsApp</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Date Checker */}
      <section id="checker" className="py-16 px-4 sm:px-8 bg-[#0a0a0f] border-t border-slate-800">
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#13131d] border border-slate-700 space-y-4">
          <h3 className="font-serif font-bold text-xl text-white">Check Wedding Date Availability</h3>
          <form onSubmit={handleDateSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Bride / Groom Name *"
              value={dateChecker.name}
              onChange={(e) => setDateChecker({ ...dateChecker, name: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#09090d] border border-slate-700 text-xs text-white"
            />
            <input
              type="tel"
              required
              placeholder="WhatsApp Phone *"
              value={dateChecker.phone}
              onChange={(e) => setDateChecker({ ...dateChecker, phone: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#09090d] border border-slate-700 text-xs text-white"
            />
            <input
              type="text"
              required
              placeholder="Wedding Dates (e.g. Dec 12-14) *"
              value={dateChecker.dates}
              onChange={(e) => setDateChecker({ ...dateChecker, dates: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#09090d] border border-slate-700 text-xs text-white"
            />
            <button
              type="submit"
              className="sm:col-span-2 md:col-span-3 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs uppercase hover:opacity-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Check Dates on WhatsApp</span>
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
          <span className="text-rose-400 font-bold">Production Ready Template by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
