import React, { useState } from 'react';
import {
  Gem,
  Sparkles,
  ShieldCheck,
  Calendar,
  Phone,
  Send,
  CheckCircle2,
  TrendingUp,
  Heart,
  Star,
  ArrowRight
} from 'lucide-react';
import { jewelleryConfig } from './config';

export default function JewelleryDemo({ customConfig }) {
  const config = customConfig || jewelleryConfig;

  const [appointment, setAppointment] = useState({
    name: '',
    phone: '',
    category: 'Bridal Kundan Polki Choker Set'
  });

  const handleInquireJewel = (p) => {
    const text =
      `💍 *JEWELLERY INQUIRY - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👑 *Piece:* ${p.name}\n` +
      `💰 *Price:* ${p.price}\n` +
      `✨ *Purity:* ${p.purity}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi, I want to inquire about custom weight, hallmarking certificate, and today's final making charge!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCustomConsultation = (e) => {
    e.preventDefault();
    const text =
      `💎 *VIP BRIDAL JEWELLERY CONSULTATION - ${config.businessName}*\n\n` +
      `👤 Client Name: *${appointment.name}*\n` +
      `📞 WhatsApp Phone: *${appointment.phone}*\n` +
      `✨ Interested In: *${appointment.category}*\n\n` +
      `Please schedule a private viewing in your VIP Lounge and share your latest catalog.`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0705] text-[#f7f2ea] font-sans selection:bg-[#d4af37] selection:text-black overflow-x-hidden">
      
      {/* Live Gold Rate Ticker */}
      <div className="bg-[#1e1308] text-[#f3e5ab] text-xs font-bold py-2 px-4 border-b border-[#3b2712] shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider font-black">Live Market Rates:</span>
          </div>
          <div className="flex items-center gap-4 text-[#f3e5ab]">
            <span>Gold 22K (916): <strong>{config.liveGoldRate.gold22k}</strong></span>
            <span>Gold 24K (999): <strong>{config.liveGoldRate.gold24k}</strong></span>
            <span>Silver (999): <strong>{config.liveGoldRate.silver}</strong></span>
          </div>
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#120c08]/95 backdrop-blur-2xl border-b border-[#332214] px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#f3e5ab] text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-base text-white block leading-none">{config.businessName}</span>
              <span className="text-[10px] text-[#d4af37] tracking-wider uppercase mt-0.5 block font-bold">{config.businessSubtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#d4c3aa]">
            <a href="#collections" className="hover:text-[#d4af37]">Collections</a>
            <a href="#consult" className="hover:text-[#d4af37]">VIP Lounge</a>
            <a href="#location" className="hover:text-[#d4af37]">Flagship Store</a>
          </div>

          <a
            href="#consult"
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#d4af37] text-black hover:bg-[#e6c258] transition-all shadow-md"
          >
            VIP Viewing Lounge
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-[75vh] flex items-center justify-center py-16 px-4 text-center">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Fine Jewellery" className="w-full h-full object-cover brightness-[0.25]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0705] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-5">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#2b1b0e] text-[#f3e5ab] border border-[#52371d] inline-flex items-center gap-1.5 shadow-xl">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% BIS Hallmarked 916 Gold • Certified IGI Solitaires</span>
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Heirlooms of Pure Gold & <span className="bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#e6c258] bg-clip-text text-transparent">Timeless Solitaires</span>
          </h1>

          <p className="text-sm sm:text-base text-[#d4c3aa] max-w-xl mx-auto leading-relaxed">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#collections"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#d4af37] text-black hover:bg-[#e6c258] shadow-xl shadow-amber-500/25"
            >
              Explore Masterpieces
            </a>
            <a
              href="#consult"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#1a120b] text-white border border-[#3d2a19] hover:bg-[#261b10]"
            >
              Inquire on WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Collection Showcase */}
      <section id="collections" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Masterpieces of Craftsmanship</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Signature Bridal & Solitaire Collections</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.products.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl bg-[#140e0a] border border-[#332214] overflow-hidden flex flex-col justify-between hover:border-[#d4af37]/60 transition-all shadow-xl group"
            >
              <div className="h-64 overflow-hidden relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-[#f3e5ab]">
                  {p.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-white">{p.name}</h3>
                  <div className="text-xl font-black text-[#d4af37] mt-1">{p.price}</div>
                  <span className="text-[11px] text-[#f3e5ab]/80 block mt-1 font-medium">{p.purity}</span>
                  <p className="text-xs text-[#a8957c] leading-relaxed mt-2">{p.description}</p>
                </div>

                <button
                  onClick={() => handleInquireJewel(p)}
                  className="w-full py-3 rounded-xl bg-[#d4af37] text-black font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#e6c258] cursor-pointer shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Inquire Price on WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP Consultation */}
      <section id="consult" className="py-16 px-4 sm:px-8 bg-[#0e0a07] border-t border-[#332214]">
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#18110b] border border-[#3d2a19] space-y-4">
          <h3 className="font-serif font-bold text-xl text-white">Book a Private VIP Bridal Consultation</h3>
          <form onSubmit={handleCustomConsultation} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Your Full Name *"
              value={appointment.name}
              onChange={(e) => setAppointment({ ...appointment, name: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#0a0704] border border-[#3d2a19] text-xs text-white"
            />
            <input
              type="tel"
              required
              placeholder="WhatsApp Phone *"
              value={appointment.phone}
              onChange={(e) => setAppointment({ ...appointment, phone: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#0a0704] border border-[#3d2a19] text-xs text-white"
            />
            <select
              value={appointment.category}
              onChange={(e) => setAppointment({ ...appointment, category: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#0a0704] border border-[#3d2a19] text-xs text-white"
            >
              <option value="Bridal Kundan Polki Choker Set">Bridal Kundan Polki</option>
              <option value="Solitaire Diamond Engagement Ring">Solitaire Diamond Rings</option>
              <option value="Temple 22K Gold Bangles & Kadas">Temple 22K Gold Bangles</option>
            </select>
            <button
              type="submit"
              className="sm:col-span-2 md:col-span-3 py-3 rounded-xl bg-[#d4af37] text-black font-black text-xs uppercase hover:bg-[#e6c258] cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Schedule VIP Appointment via WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 border-t border-[#332214] text-[#a8957c] text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-sm text-white block">{config.businessName}</span>
            <span>{config.address} • {config.hours}</span>
          </div>
          <span className="text-[#d4af37] font-bold">Production Ready Template by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
