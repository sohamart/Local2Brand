import React, { useState } from 'react';
import {
  Gauge,
  Sparkles,
  ShieldCheck,
  Calendar,
  Phone,
  Send,
  CheckCircle2,
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';
import { automotiveConfig } from './config';

export default function AutomotiveDemo({ customConfig }) {
  const config = customConfig || automotiveConfig;

  const [testDrive, setTestDrive] = useState({
    name: '',
    phone: '',
    vehicle: 'Porsche 911 Carrera S (992)'
  });

  const handleInquireVehicle = (v) => {
    const text =
      `🚗 *SUPERCAR INVENTORY INQUIRY - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🏎️ *Vehicle:* ${v.name} (${v.year})\n` +
      `💰 *Price:* ${v.price}\n` +
      `⚡ *Specs:* ${v.specs}\n` +
      `⏱️ *Odo:* ${v.mileage}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi SpeedShift team, I want to request the 200-point inspection report and book a VIP test drive!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTestDriveSubmit = (e) => {
    e.preventDefault();
    const text =
      `🏁 *VIP TEST DRIVE BOOKING - ${config.businessName}*\n\n` +
      `👤 Name: *${testDrive.name}*\n` +
      `📞 Phone: *${testDrive.phone}*\n` +
      `🏎️ Vehicle: *${testDrive.vehicle}*\n\n` +
      `Please confirm slot timing and showroom location pin!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-[#f1f5f9] font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#1c1208] text-amber-400 text-xs font-black uppercase tracking-wider py-2 px-4 text-center border-b border-[#3b2710]">
        <span>⚡ 200-POINT CERTIFIED PRE-OWNED SUPERCARS & SUPERBIKES • 100% NON-ACCIDENTAL CLEAR TITLE GUARANTEE</span>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0d1015]/95 backdrop-blur-2xl border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-base text-white tracking-wider block leading-none">{config.businessName}</span>
              <span className="text-[10px] text-amber-400 tracking-wider uppercase mt-0.5 block font-bold">{config.businessSubtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-black uppercase tracking-wider text-slate-400">
            <a href="#inventory" className="hover:text-amber-400">Inventory</a>
            <a href="#drive" className="hover:text-amber-400">VIP Test Drive</a>
            <a href="#location" className="hover:text-amber-400">Showroom HQ</a>
          </div>

          <a
            href="#drive"
            className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 hover:brightness-110 shadow-md"
          >
            Book Test Drive
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-[75vh] flex items-center justify-center py-16 px-4 text-center">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Supercars" className="w-full h-full object-cover brightness-[0.25]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090c] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-5">
          <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-[#2b1808] text-amber-400 border border-[#593310] inline-flex items-center gap-1.5 shadow-xl">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Exotic Supercars • Certified Performance Heritage</span>
          </span>

          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none">
            Pure Adrenaline. <span className="bg-gradient-to-r from-amber-400 via-red-500 to-amber-500 bg-clip-text text-transparent">Exotic Horsepower.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#inventory"
              className="px-7 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 hover:brightness-110 shadow-xl shadow-amber-500/25"
            >
              Explore Garage Inventory
            </a>
            <a
              href="#drive"
              className="px-7 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#141922] text-white border border-slate-700 hover:bg-[#1c2432]"
            >
              Book VIP Track Test Drive
            </a>
          </div>
        </div>
      </header>

      {/* Inventory Grid */}
      <section id="inventory" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400">Certified Exotic Fleet</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">Available In Showroom</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.inventory.map((v) => (
            <div
              key={v.id}
              className="rounded-3xl bg-[#0f141d] border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl group"
            >
              <div className="h-60 overflow-hidden relative">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-black uppercase text-amber-400">
                  {v.year}
                </span>
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 text-xs font-bold text-slate-300">
                  {v.mileage}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-black text-lg text-white">{v.name}</h3>
                  <div className="text-2xl font-black text-amber-400 mt-1">{v.price}</div>
                  <span className="text-[11px] text-slate-400 block mt-1 font-semibold">{v.specs}</span>

                  <div className="space-y-1.5 pt-3 text-xs text-slate-300">
                    {v.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleInquireVehicle(v)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Inquire Vehicle on WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Test Drive Form */}
      <section id="drive" className="py-16 px-4 sm:px-8 bg-[#0b0e14] border-t border-slate-800">
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#131924] border border-slate-700 space-y-4">
          <h3 className="font-black text-xl text-white uppercase">Book a Private VIP Test Drive</h3>
          <form onSubmit={handleTestDriveSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Your Full Name *"
              value={testDrive.name}
              onChange={(e) => setTestDrive({ ...testDrive, name: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#090c10] border border-slate-700 text-xs text-white"
            />
            <input
              type="tel"
              required
              placeholder="WhatsApp Phone *"
              value={testDrive.phone}
              onChange={(e) => setTestDrive({ ...testDrive, phone: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#090c10] border border-slate-700 text-xs text-white"
            />
            <select
              value={testDrive.vehicle}
              onChange={(e) => setTestDrive({ ...testDrive, vehicle: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#090c10] border border-slate-700 text-xs text-white"
            >
              <option value="Porsche 911 Carrera S">Porsche 911 Carrera S</option>
              <option value="Ducati Panigale V4 S">Ducati Panigale V4 S</option>
              <option value="Mercedes-AMG G 63">Mercedes-AMG G 63</option>
            </select>
            <button
              type="submit"
              className="sm:col-span-2 md:col-span-3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 font-black text-xs uppercase cursor-pointer flex items-center justify-center gap-2 shadow-md hover:brightness-110"
            >
              <Send className="w-4 h-4" />
              <span>Confirm Test Drive on WhatsApp</span>
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
          <span className="text-amber-400 font-bold">Production Ready Template by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
