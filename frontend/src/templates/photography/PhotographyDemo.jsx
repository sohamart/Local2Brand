import React, { useState, useMemo } from 'react';
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
  Tag,
  ChevronDown,
  Search,
  ArrowRight
} from 'lucide-react';
import { photographyConfig } from './config';

export default function PhotographyDemo({ customConfig }) {
  const config = customConfig || photographyConfig;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState(null);

  const [dateChecker, setDateChecker] = useState({
    name: '',
    phone: '',
    dates: '',
    destination: 'Udaipur / Goa',
    packageType: 'The Royal 3-Day Destination Wedding',
    notes: ''
  });

  const filteredPackages = useMemo(() => {
    return selectedCategory === "All"
      ? config.packages
      : config.packages.filter(p => p.category === selectedCategory);
  }, [config.packages, selectedCategory]);

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
      `📞 WhatsApp Phone: *${dateChecker.phone}*\n` +
      `📅 Wedding Dates: *${dateChecker.dates || 'Upcoming Season'}*\n` +
      `📍 City / Destination: *${dateChecker.destination}*\n` +
      `🎬 Package: *${dateChecker.packageType}*\n` +
      (dateChecker.notes ? `📝 Note: ${dateChecker.notes}\n` : '') +
      `\nPlease check team availability and share your quotation.`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#f1f5f9] font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#1c0a10] text-rose-400 text-xs font-bold py-2 px-4 text-center border-b border-[#3b1220] shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span>🎬 VOGUE & WEDMEGOOD FEATURED • 2026-27 DESTINATION WEDDING DATES NOW OPEN FOR BOOKING</span>
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0c0c10]/95 backdrop-blur-2xl border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            <a href="#offers" className="hover:text-rose-400">Offers</a>
            <a href="#checker" className="hover:text-rose-400">Check Dates</a>
            <a href="#reviews" className="hover:text-rose-400">Stories</a>
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

      {/* Hero Showcase */}
      <header className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Destination Wedding" className="w-full h-full object-cover brightness-[0.25] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
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
              className="px-7 py-3 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xl shadow-rose-500/25 hover:opacity-95 flex items-center gap-2"
            >
              <Film className="w-4 h-4" />
              <span>View Wedding Packages</span>
            </a>
            <a
              href="#checker"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#14141c] text-white border border-slate-700 hover:bg-[#1f1f2b] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>Instant Date Checker</span>
            </a>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-xs text-slate-400">
            <div className="p-3 rounded-2xl bg-[#12121a] border border-slate-800">
              <span className="block font-black text-rose-400 text-sm">250+</span>
              <span className="text-[11px]">Weddings Documented</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#12121a] border border-slate-800">
              <span className="block font-black text-rose-400 text-sm">48 Hours</span>
              <span className="text-[11px]">Instagram Teaser Delivery</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#12121a] border border-slate-800">
              <span className="block font-black text-rose-400 text-sm">Sony FX3 4K</span>
              <span className="text-[11px]">Cinema Line Prime Rig</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#12121a] border border-slate-800">
              <span className="block font-black text-rose-400 text-sm">Vogue Featured</span>
              <span className="text-[11px]">WedMeGood Gold Studio</span>
            </div>
          </div>
        </div>
      </header>

      {/* Promo Offers Bar */}
      <section id="offers" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-5 sm:p-6 rounded-3xl bg-[#1a0f16] border border-[#3b1928] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Early Booking Privilege</span>
              <h3 className="text-base sm:text-lg font-bold text-white">Save 20% on 2026-27 Destination Wedding Dates!</h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {config.activeCoupons.map((c) => (
              <div key={c.code} className="px-4 py-2 rounded-2xl bg-[#070709] border border-dashed border-rose-500/60 flex items-center gap-3">
                <div>
                  <span className="font-mono font-black text-rose-400 text-xs block">{c.code}</span>
                  <span className="text-[10px] text-slate-400">{c.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Suite */}
      <section id="packages" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Tailored Coverage</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Cinematography & Photo Packages</h2>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar justify-start sm:justify-center mb-8">
          {config.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
                  : 'bg-[#101017] text-slate-400 border border-slate-800 hover:bg-[#191924]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
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

      {/* Date Checker Form */}
      <section id="checker" className="py-20 px-4 sm:px-8 bg-[#0a0a0f] border-y border-slate-800">
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#13131d] border border-slate-700 space-y-4 shadow-2xl">
          <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-400" />
            <span>Check Wedding Date Availability</span>
          </h3>

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
              className="sm:col-span-2 md:col-span-3 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs uppercase hover:opacity-95 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Check Dates on WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Client Stories</span>
          <h2 className="font-serif text-3xl font-bold text-white">Words from Our Real Brides & Grooms</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#12121a] border border-slate-800 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, r) => <Star key={r} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-rose-500/40" />
                <div>
                  <span className="font-bold text-xs text-white block">{t.name}</span>
                  <span className="text-[10px] text-rose-400">{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Helpful Details</span>
          <h2 className="font-serif text-3xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {config.faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl bg-[#12121a] border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-rose-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 bg-[#050507] border-t border-slate-800 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <span className="font-bold text-base text-white block">{config.businessName}</span>
            <p className="text-xs">{config.tagline}</p>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Studio Location</span>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{config.address}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Studio Hours</span>
            <div>Weekdays: {config.hours.weekdays}</div>
            <div>Weekends: {config.hours.weekends}</div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">WhatsApp Desk</span>
            <a
              href={`https://wa.me/${config.whatsapp}`}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp: {config.phone}</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {config.businessName}. All rights reserved.</span>
          <span className="text-rose-400 font-bold">Production Ready Platform by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
