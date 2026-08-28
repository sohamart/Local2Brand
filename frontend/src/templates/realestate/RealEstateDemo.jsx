import React, { useState, useMemo } from 'react';
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
  Star,
  Tag,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { realEstateConfig } from './config';

export default function RealEstateDemo({ customConfig }) {
  const config = customConfig || realEstateConfig;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const [visitForm, setVisitForm] = useState({
    name: '',
    phone: '',
    date: '',
    property: 'The Sky Penthouse at Worli Sea Face',
    notes: ''
  });

  const filteredProperties = useMemo(() => {
    return config.properties.filter(p => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch = searchQuery === "" || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [config.properties, selectedCategory, searchQuery]);

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
      `📅 Preferred Date: *${visitForm.date || 'This Weekend'}*\n` +
      (visitForm.notes ? `📝 Note: ${visitForm.notes}\n` : '') +
      `\nPlease arrange a private site visit with your senior property consultant.`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#080d17] text-[#f1f5f9] font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#0b1b17] text-emerald-400 text-xs font-bold py-2 px-4 text-center border-b border-[#13382c] shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span>🏡 100% RERA-VERIFIED PRIME RESIDENTIAL & COMMERCIAL PORTFOLIOS • ZERO BROKERAGE DEVELOPER PRICING</span>
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0d1424]/95 backdrop-blur-2xl border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            <a href="#properties" className="hover:text-emerald-400">Listings</a>
            <a href="#offers" className="hover:text-emerald-400">Assistance</a>
            <a href="#visit" className="hover:text-emerald-400">Book Site Visit</a>
            <a href="#reviews" className="hover:text-emerald-400">Reviews</a>
            <a href="#location" className="hover:text-emerald-400">Realty HQ</a>
          </div>

          <a
            href="#visit"
            className="px-4 py-2 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md"
          >
            Schedule Site Visit
          </a>
        </div>
      </nav>

      {/* Hero Showcase */}
      <header className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Luxury Real Estate" className="w-full h-full object-cover brightness-[0.25] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d17] via-[#080d17]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
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
              className="px-7 py-3 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Browse Property Listings</span>
            </a>
            <a
              href="#visit"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#131d31] text-white border border-slate-700 hover:bg-[#1e2c47] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>VIP Chauffeur Site Visit</span>
            </a>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-xs text-slate-400">
            <div className="p-3 rounded-2xl bg-[#0f172a] border border-slate-800">
              <span className="block font-black text-emerald-400 text-sm">100% RERA</span>
              <span className="text-[11px]">Clear Legal Due Diligence</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0f172a] border border-slate-800">
              <span className="block font-black text-emerald-400 text-sm">0% Brokerage</span>
              <span className="text-[11px]">Direct Developer Allotment</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0f172a] border border-slate-800">
              <span className="block font-black text-emerald-400 text-sm">Private Chauffeur</span>
              <span className="text-[11px]">Complimentary Home Pickup</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0f172a] border border-slate-800">
              <span className="block font-black text-emerald-400 text-sm">₹500 Cr+</span>
              <span className="text-[11px]">Luxury Inventory Handled</span>
            </div>
          </div>
        </div>
      </header>

      {/* Assistance Promo Offers Bar */}
      <section id="offers" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1b26] border border-[#1d354a] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Buyer Privilege</span>
              <h3 className="text-base sm:text-lg font-bold text-white">Zero Brokerage & Free Stamp Duty Legal Check!</h3>
            </div>
          </div>

          <a
            href="#visit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase hover:bg-emerald-400"
          >
            Claim Buyer Pass
          </a>
        </div>
      </section>

      {/* Property Listings Suite */}
      <section id="properties" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Verified Portfolios</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Featured Luxury Residences</h2>
        </div>

        {/* Search & Category Tabs */}
        <div className="max-w-4xl mx-auto space-y-4 mb-10">
          <div className="relative">
            <Search className="w-5 h-5 text-emerald-500/70 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties by location (e.g. Worli, Bandra, Lonavala, 4 BHK...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0f172a] border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
            {config.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-[#0f172a] text-slate-400 border border-slate-800 hover:bg-[#182438]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="rounded-3xl bg-[#0f172a] border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-xl group"
            >
              <div className="h-60 overflow-hidden relative">
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

      {/* VIP Site Visit Booking Suite */}
      <section id="visit" className="py-20 px-4 sm:px-8 bg-[#0b101c] border-y border-slate-800">
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#121c32] border border-slate-700 space-y-4 shadow-2xl">
          <h3 className="font-bold text-xl text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>Schedule a Private VIP Site Visit</span>
          </h3>

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
              className="sm:col-span-2 md:col-span-3 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase hover:bg-emerald-400 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Book Site Visit on WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Happy Homeowners</span>
          <h2 className="text-3xl font-black text-white">Trusted by High Net-Worth Families</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, r) => <Star key={r} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-emerald-500/40" />
                <div>
                  <span className="font-bold text-xs text-white block">{t.name}</span>
                  <span className="text-[10px] text-emerald-400">{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Advisory Support</span>
          <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {config.faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl bg-[#0f172a] border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
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
      <footer id="location" className="py-12 px-4 sm:px-8 bg-[#05080e] border-t border-slate-800 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <span className="font-bold text-base text-white block">{config.businessName}</span>
            <p className="text-xs">{config.tagline}</p>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">HQ Address</span>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{config.address}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Office Hours</span>
            <div>Weekdays: {config.hours.weekdays}</div>
            <div>Weekends: {config.hours.weekends}</div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">WhatsApp Desk</span>
            <a
              href={`https://wa.me/${config.whatsapp}`}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-400"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp: {config.phone}</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {config.businessName}. All rights reserved.</span>
          <span className="text-emerald-400 font-bold">Production Ready Platform by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
