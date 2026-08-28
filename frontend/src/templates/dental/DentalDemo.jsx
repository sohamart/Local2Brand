import React, { useState } from 'react';
import {
  Activity,
  Sparkles,
  ShieldCheck,
  Calendar,
  Phone,
  Send,
  CheckCircle2,
  Clock,
  HeartPulse,
  Smile,
  ArrowRight
} from 'lucide-react';
import { dentalConfig } from './config';

export default function DentalDemo({ customConfig }) {
  const config = customConfig || dentalConfig;

  const [appointment, setAppointment] = useState({
    patientName: '',
    phone: '',
    date: '',
    concern: 'General Consultation & Dental Checkup'
  });

  const handleBookTreatment = (t) => {
    const text =
      `🦷 *DENTAL TREATMENT APPOINTMENT - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🩺 *Procedure:* ${t.name}\n` +
      `💰 *Estimated Cost:* ₹${t.price.toLocaleString('en-IN')}\n` +
      `⏱️ *Duration:* ${t.duration}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi Doctor, I would like to book a consultation slot for this treatment!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleConsultation = (e) => {
    e.preventDefault();
    const text =
      `🩺 *DOCTOR CONSULTATION BOOKING - ${config.businessName}*\n\n` +
      `👤 Patient Name: *${appointment.patientName}*\n` +
      `📞 WhatsApp Phone: *${appointment.phone}*\n` +
      `📅 Preferred Date: *${appointment.date || 'Earliest Available'}*\n` +
      `🔍 Primary Concern: *${appointment.concern}*\n\n` +
      `Please confirm appointment timing and clinic location pin.`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#06111a] text-[#f1f5f9] font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#0c2234] text-cyan-400 text-xs font-bold py-2 px-4 text-center border-b border-[#133854]">
        <span>🦷 100% PAINLESS WATERLASE LASER DENTISTRY • FREE DIGITAL 3D SMILE SCAN ON ALL CONSULTATIONS</span>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0a1b29]/95 backdrop-blur-2xl border-b border-cyan-900/40 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-white block leading-none">{config.businessName}</span>
              <span className="text-[10px] text-cyan-400 tracking-wider uppercase mt-0.5 block font-bold">{config.businessSubtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#treatments" className="hover:text-cyan-400">Treatments</a>
            <a href="#book" className="hover:text-cyan-400">Book Doctor</a>
            <a href="#location" className="hover:text-cyan-400">Clinic Map</a>
          </div>

          <a
            href="#book"
            className="px-4 py-2 rounded-full text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md"
          >
            Book Appointment
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-[75vh] flex items-center justify-center py-16 px-4 text-center">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Dental Clinic" className="w-full h-full object-cover brightness-[0.25]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06111a] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-5">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#0d2a40] text-cyan-400 border border-[#194a6d] inline-flex items-center gap-1.5 shadow-xl">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>US FDA Approved • 10-Class Sterilization</span>
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Painless Dentistry for a <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent">Confident, Radiant Smile</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#treatments"
              className="px-7 py-3 rounded-full text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-500/25"
            >
              Explore Laser Treatments
            </a>
            <a
              href="#book"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#10273b] text-white border border-cyan-800 hover:bg-[#183954]"
            >
              Doctor WhatsApp Slot
            </a>
          </div>
        </div>
      </header>

      {/* Treatments Grid */}
      <section id="treatments" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Advanced Dental Care</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Specialized Treatment Suites</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.treatments.map((t) => (
            <div
              key={t.id}
              className={`p-7 rounded-3xl border flex flex-col justify-between relative transition-all ${
                t.popular
                  ? 'bg-gradient-to-b from-[#0f293d] to-[#0a1c2b] border-cyan-400 shadow-2xl shadow-cyan-500/10 scale-105'
                  : 'bg-[#0b1d2c] border-cyan-900/50'
              }`}
            >
              {t.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-md">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-white">{t.name}</h3>
                  <span className="text-xs text-cyan-300 font-semibold">{t.duration}</span>
                </div>

                <div className="text-2xl font-black text-white">
                  ₹{t.price.toLocaleString('en-IN')}
                </div>

                <div className="space-y-2 pt-2 text-xs text-slate-300">
                  {t.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleBookTreatment(t)}
                className="mt-6 w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Book Treatment on WhatsApp</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Book Doctor Form */}
      <section id="book" className="py-16 px-4 sm:px-8 bg-[#081724] border-t border-cyan-900/40">
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0f283d] border border-cyan-800/60 space-y-4">
          <h3 className="font-bold text-xl text-white">Book Your Dental Consultation</h3>
          <form onSubmit={handleConsultation} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Patient Full Name *"
              value={appointment.patientName}
              onChange={(e) => setAppointment({ ...appointment, patientName: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#081724] border border-cyan-900 text-xs text-white"
            />
            <input
              type="tel"
              required
              placeholder="WhatsApp Phone *"
              value={appointment.phone}
              onChange={(e) => setAppointment({ ...appointment, phone: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#081724] border border-cyan-900 text-xs text-white"
            />
            <select
              value={appointment.concern}
              onChange={(e) => setAppointment({ ...appointment, concern: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#081724] border border-cyan-900 text-xs text-white"
            >
              <option value="Toothache / Root Canal">Toothache / Root Canal</option>
              <option value="Clear Aligners / Teeth Straightening">Clear Aligners / Straightening</option>
              <option value="Dental Implants & Missing Teeth">Dental Implants</option>
              <option value="Teeth Whitening & Cleaning">Teeth Whitening & Cleaning</option>
            </select>
            <button
              type="submit"
              className="sm:col-span-2 md:col-span-3 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Confirm Appointment via WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 border-t border-cyan-900/40 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-sm text-white block">{config.businessName}</span>
            <span>{config.address} • {config.hours}</span>
          </div>
          <span className="text-cyan-400 font-bold">Production Ready Template by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
