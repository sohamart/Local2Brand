import React, { useState, useMemo } from 'react';
import {
  Car,
  Gauge,
  Sparkles,
  ShieldCheck,
  Calendar,
  Phone,
  Send,
  CheckCircle2,
  Zap,
  Flame,
  Star,
  Tag,
  ChevronDown,
  Search,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { automotiveConfig } from './config';

export default function AutomotiveDemo({ customConfig }) {
  const config = customConfig || automotiveConfig;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const [testDrive, setTestDrive] = useState({
    name: '',
    phone: '',
    date: '',
    model: 'Porsche 911 Carrera S (992)',
    notes: ''
  });

  const filteredVehicles = useMemo(() => {
    return config.vehicles.filter(v => {
      const matchCat = selectedCategory === "All" || v.category === selectedCategory;
      const matchSearch = searchQuery === "" || v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.fuel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [config.vehicles, selectedCategory, searchQuery]);

  const handleInquireVehicle = (v) => {
    const text =
      `🚗 *SUPERCAR INQUIRY - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🏎️ *Vehicle:* ${v.name} (${v.year})\n` +
      `💰 *Price:* ${v.price}\n` +
      `🛣️ *Odo:* ${v.kms}\n` +
      `⚡ *Engine:* ${v.fuel}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi, I want the 200-point inspection sheet and schedule a private test drive!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTestDrive = (e) => {
    e.preventDefault();
    const text =
      `🏁 *VIP TEST DRIVE BOOKING - ${config.businessName}*\n\n` +
      `👤 Driver Name: *${testDrive.name}*\n` +
      `📞 WhatsApp Phone: *${testDrive.phone}*\n` +
      `🏎️ Selected Exotic: *${testDrive.model}*\n` +
      `📅 Test Drive Date: *${testDrive.date || 'This Weekend'}*\n` +
      (testDrive.notes ? `📝 Note: ${testDrive.notes}\n` : '') +
      `\nPlease prepare the vehicle and confirm our VIP track slot.`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-[#f1f5f9] font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#1a1205] text-amber-400 text-xs font-bold py-2 px-4 text-center border-b border-[#3d2a0a] shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span>🏎️ 200-POINT CERTIFIED EXOTIC SUPERCAR & SUPERBIKE INVENTORY • PAN-INDIA CLOSED CONTAINER DELIVERY</span>
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0d1017]/95 backdrop-blur-2xl border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-white block leading-none">{config.businessName}</span>
              <span className="text-[10px] text-amber-400 tracking-wider uppercase mt-0.5 block font-bold">{config.businessSubtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-400">
            <a href="#garage" className="hover:text-amber-400">Inventory</a>
            <a href="#offers" className="hover:text-amber-400">Privilege</a>
            <a href="#drive" className="hover:text-amber-400">VIP Test Drive</a>
            <a href="#reviews" className="hover:text-amber-400">Owners</a>
            <a href="#location" className="hover:text-amber-400">Showroom HQ</a>
          </div>

          <a
            href="#drive"
            className="px-4 py-2 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-md"
          >
            Book VIP Test Drive
          </a>
        </div>
      </nav>

      {/* Hero Showcase */}
      <header className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Supercar Showroom" className="w-full h-full object-cover brightness-[0.25] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-[#07090d]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#241a08] text-amber-400 border border-[#4d360f] shadow-xl">
            <Gauge className="w-3.5 h-3.5" />
            <span>200-Point Diagnostic Check • Non-Accidental Guarantee</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Drive Pure Adrenaline. <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">Certified Exotics.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#garage"
              className="px-7 py-3 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-xl shadow-amber-500/25 flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>Explore Supercar Inventory</span>
            </a>
            <a
              href="#drive"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#141822] text-white border border-slate-700 hover:bg-[#1c2230] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Book VIP Test Track</span>
            </a>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-xs text-slate-300">
            <div className="p-3 rounded-2xl bg-[#0e121a] border border-slate-800">
              <span className="block font-black text-amber-400 text-sm">200-Point</span>
              <span className="text-[11px]">Multipoint Diagnostic Test</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0e121a] border border-slate-800">
              <span className="block font-black text-amber-400 text-sm">Zero Tampering</span>
              <span className="text-[11px]">Verified Odometer Records</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0e121a] border border-slate-800">
              <span className="block font-black text-amber-400 text-sm">Closed Carrier</span>
              <span className="text-[11px]">Pan-India Doorstep Delivery</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0e121a] border border-slate-800">
              <span className="block font-black text-amber-400 text-sm">1-Year Warranty</span>
              <span className="text-[11px]">Extended Comprehensive Cover</span>
            </div>
          </div>
        </div>
      </header>

      {/* Privilege Offers Bar */}
      <section id="offers" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-5 sm:p-6 rounded-3xl bg-[#14161f] border border-[#2b2f3e] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Buyer Privilege</span>
              <h3 className="text-base sm:text-lg font-bold text-white">Free 9H Ceramic Coating & 1-Year Comprehensive Warranty!</h3>
            </div>
          </div>

          <a
            href="#drive"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase"
          >
            Claim Privilege Pass
          </a>
        </div>
      </section>

      {/* Inventory Suite */}
      <section id="garage" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Certified Showroom</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Featured Exotic Inventory</h2>
        </div>

        {/* Search & Category Tabs */}
        <div className="max-w-4xl mx-auto space-y-4 mb-10">
          <div className="relative">
            <Search className="w-5 h-5 text-amber-500/70 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exotics (e.g. Porsche 911, Range Rover, Panigale V4, V8...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0e121a] border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
            {config.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-[#0e121a] text-slate-400 border border-slate-800 hover:bg-[#181f2c]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => (
            <div
              key={v.id}
              className="rounded-3xl bg-[#0e121a] border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl group"
            >
              <div className="h-64 overflow-hidden relative">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-400">
                  {v.year} • {v.kms}
                </span>
                {v.isBestseller && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase">
                    Certified
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-2xl font-black text-amber-400 mb-1">{v.price}</div>
                  <h3 className="font-bold text-base text-white">{v.name}</h3>
                  <span className="text-xs text-slate-400 block mt-1">{v.fuel}</span>

                  <div className="space-y-1.5 pt-3 text-xs text-slate-300">
                    {v.specs.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleInquireVehicle(v)}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Get Diagnostic Sheet & Price</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP Test Track Form */}
      <section id="drive" className="py-20 px-4 sm:px-8 bg-[#0a0d13] border-y border-slate-800">
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#11151f] border border-slate-700 space-y-4 shadow-2xl">
          <h3 className="font-bold text-xl text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Book Private VIP Track Test Drive</span>
          </h3>

          <form onSubmit={handleTestDrive} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Your Full Name *"
              value={testDrive.name}
              onChange={(e) => setTestDrive({ ...testDrive, name: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#080a0f] border border-slate-700 text-xs text-white"
            />
            <input
              type="tel"
              required
              placeholder="WhatsApp Phone *"
              value={testDrive.phone}
              onChange={(e) => setTestDrive({ ...testDrive, phone: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#080a0f] border border-slate-700 text-xs text-white"
            />
            <input
              type="date"
              required
              value={testDrive.date}
              onChange={(e) => setTestDrive({ ...testDrive, date: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#080a0f] border border-slate-700 text-xs text-white"
            />
            <button
              type="submit"
              className="sm:col-span-2 md:col-span-3 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Confirm VIP Test Drive on WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Supercar Owners</span>
          <h2 className="text-3xl font-black text-white">Trust of Enthusiasts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, r) => <Star key={r} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-amber-500/40" />
                <div>
                  <span className="font-bold text-xs text-white block">{t.name}</span>
                  <span className="text-[10px] text-amber-400">{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Vehicle Due Diligence</span>
          <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {config.faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl bg-[#0e121a] border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenFaq === i ? setOpenFaq(null) : setOpenFaq(i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
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
      <footer id="location" className="py-12 px-4 sm:px-8 bg-[#050608] border-t border-slate-800 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <span className="font-bold text-base text-white block">{config.businessName}</span>
            <p className="text-xs">{config.tagline}</p>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Showroom Address</span>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{config.address}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Operating Hours</span>
            <div>Weekdays: {config.hours.weekdays}</div>
            <div>Weekends: {config.hours.weekends}</div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">WhatsApp Desk</span>
            <a
              href={`https://wa.me/${config.whatsapp}`}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp: {config.phone}</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {config.businessName}. All rights reserved.</span>
          <span className="text-amber-400 font-bold">Production Ready Platform by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
