import React, { useState, useMemo } from 'react';
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
  Star,
  Tag,
  ChevronDown,
  Search,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { dentalConfig } from './config';

export default function DentalDemo({ customConfig }) {
  const config = customConfig || dentalConfig;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState(null);

  const [appointment, setAppointment] = useState({
    patientName: '',
    phone: '',
    date: '',
    concern: 'General Consultation & 3D Smile Scan',
    notes: ''
  });

  const filteredTreatments = useMemo(() => {
    return selectedCategory === "All"
      ? config.treatments
      : config.treatments.filter(t => t.category === selectedCategory);
  }, [config.treatments, selectedCategory]);

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
      `🔍 Primary Concern: *${appointment.concern}*\n` +
      (appointment.notes ? `📝 Note: ${appointment.notes}\n` : '') +
      `\nPlease confirm appointment timing and clinic location pin.`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#06111a] text-[#f1f5f9] font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#0c2234] text-cyan-400 text-xs font-bold py-2 px-4 text-center border-b border-[#133854] shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span>🦷 100% PAINLESS WATERLASE LASER DENTISTRY • USE CODE <strong>SMILECHECK</strong> FOR FREE 3D SMILE SCAN</span>
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0a1b29]/95 backdrop-blur-2xl border-b border-cyan-900/40 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            <a href="#offers" className="hover:text-cyan-400">Scan Offer</a>
            <a href="#book" className="hover:text-cyan-400">Book Doctor</a>
            <a href="#reviews" className="hover:text-cyan-400">Testimonials</a>
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

      {/* Hero Showcase */}
      <header className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Dental Clinic" className="w-full h-full object-cover brightness-[0.25] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06111a] via-[#06111a]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d2a40] text-cyan-400 border border-[#194a6d] shadow-xl">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>US FDA Approved • Class-10 Autoclave Sterilization</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Painless Dentistry for a <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent">Confident, Radiant Smile</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#treatments"
              className="px-7 py-3 rounded-full text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-500/25 flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>Explore Laser Treatments</span>
            </a>
            <a
              href="#book"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#10273b] text-white border border-cyan-800 hover:bg-[#183954] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Doctor WhatsApp Slot</span>
            </a>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-xs text-slate-300">
            <div className="p-3 rounded-2xl bg-[#0a1f2e] border border-cyan-900/60">
              <span className="block font-black text-cyan-400 text-sm">100% Pain-Free</span>
              <span className="text-[11px]">WaterLase Dental Laser</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0a1f2e] border border-cyan-900/60">
              <span className="block font-black text-cyan-400 text-sm">Swiss Straumann</span>
              <span className="text-[11px]">Lifetime Implants Warranty</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0a1f2e] border border-cyan-900/60">
              <span className="block font-black text-cyan-400 text-sm">Invisible Aligners</span>
              <span className="text-[11px]">No Ugly Metal Braces</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0a1f2e] border border-cyan-900/60">
              <span className="block font-black text-cyan-400 text-sm">Microscopic RCT</span>
              <span className="text-[11px]">Single-Sitting 45 Mins</span>
            </div>
          </div>
        </div>
      </header>

      {/* Free Scan Offers Bar */}
      <section id="offers" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0d2232] border border-cyan-800/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">First-Time Patient Privilege</span>
              <h3 className="text-base sm:text-lg font-bold text-white">Complimentary 3D Digital Smile Scan (Worth ₹1,500)!</h3>
            </div>
          </div>

          <a
            href="#book"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase"
          >
            Claim Free Scan
          </a>
        </div>
      </section>

      {/* Treatments Suite */}
      <section id="treatments" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Advanced Dental Care</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Specialized Treatment Suites</h2>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar justify-start sm:justify-center mb-8">
          {config.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-[#0b1d2c] text-slate-300 border border-cyan-900/50 hover:bg-[#152e44]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTreatments.map((t) => (
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
      <section id="book" className="py-20 px-4 sm:px-8 bg-[#081724] border-y border-cyan-900/40">
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0f283d] border border-cyan-800/60 space-y-4 shadow-2xl">
          <h3 className="font-bold text-xl text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <span>Book Your Dental Consultation</span>
          </h3>

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
              <option value="General Consultation & 3D Smile Scan">General Checkup & 3D Scan</option>
              <option value="Toothache / Laser Root Canal">Toothache / Laser RCT</option>
              <option value="Invisible Clear Aligners">Clear Aligners / Braces</option>
              <option value="Titanium Dental Implants">Dental Implants</option>
            </select>
            <button
              type="submit"
              className="sm:col-span-2 md:col-span-3 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Confirm Appointment via WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Patient Experiences</span>
          <h2 className="text-3xl font-black text-white">Loved by 12,000+ Happy Smiles</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#0b1d2c] border border-cyan-900/50 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, r) => <Star key={r} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-cyan-900/40">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-cyan-400" />
                <div>
                  <span className="font-bold text-xs text-white block">{t.name}</span>
                  <span className="text-[10px] text-cyan-400">{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Patient FAQs</span>
          <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {config.faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl bg-[#0b1d2c] border border-cyan-900/50 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-cyan-900/40 pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 bg-[#040c13] border-t border-cyan-900/40 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <span className="font-bold text-base text-white block">{config.businessName}</span>
            <p className="text-xs">{config.tagline}</p>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Clinic Address</span>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{config.address}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Doctor Hours</span>
            <div>Weekdays: {config.hours.weekdays}</div>
            <div>Sunday: {config.hours.sunday}</div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">WhatsApp Desk</span>
            <a
              href={`https://wa.me/${config.whatsapp}`}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp: {config.phone}</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-cyan-900/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {config.businessName}. All rights reserved.</span>
          <span className="text-cyan-400 font-bold">Production Ready Platform by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
