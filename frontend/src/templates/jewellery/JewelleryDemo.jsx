import React, { useState, useMemo } from 'react';
import {
  Gem,
  Sparkles,
  ShieldCheck,
  Calendar,
  Phone,
  Send,
  CheckCircle2,
  Star,
  Tag,
  ChevronDown,
  Search,
  MapPin,
  Heart,
  ArrowRight
} from 'lucide-react';
import { jewelleryConfig } from './config';

export default function JewelleryDemo({ customConfig }) {
  const config = customConfig || jewelleryConfig;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const [loungeBooking, setLoungeBooking] = useState({
    name: '',
    phone: '',
    date: '',
    category: 'Bridal Chokers & Polki',
    notes: ''
  });

  const filteredItems = useMemo(() => {
    return config.items.filter(item => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchSearch = searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.weight.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [config.items, selectedCategory, searchQuery]);

  const handleInquireItem = (item) => {
    const text =
      `💍 *JEWELLERY INQUIRY - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👑 *Item:* ${item.name}\n` +
      `⚖️ *Weight:* ${item.weight}\n` +
      `💰 *Price:* ₹${item.price.toLocaleString('en-IN')}\n` +
      `🔍 *Hallmark:* ${item.hallmark}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi, I want to check making charges and book a viewing appointment!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleLoungeSubmit = (e) => {
    e.preventDefault();
    const text =
      `👑 *VIP BRIDAL LOUNGE APPOINTMENT - ${config.businessName}*\n\n` +
      `👤 Client Name: *${loungeBooking.name}*\n` +
      `📞 WhatsApp Phone: *${loungeBooking.phone}*\n` +
      `📅 Viewing Date: *${loungeBooking.date || 'This Weekend'}*\n` +
      `💍 Preferred Collection: *${loungeBooking.category}*\n` +
      (loungeBooking.notes ? `📝 Note: ${loungeBooking.notes}\n` : '') +
      `\nPlease reserve our private VIP bridal suite with high-tea refreshments.`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0805] text-[#faf6ee] font-sans selection:bg-[#d4af37] selection:text-black overflow-x-hidden">
      
      {/* Live Gold Rate Ticker */}
      <div className="bg-[#1c160a] text-[#d4af37] text-xs font-bold py-2 px-4 text-center border-b border-[#3b2e14] shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-6 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Gem className="w-3.5 h-3.5" />
            <span>22K Gold: <strong>{config.liveGoldRate.gold22k}</strong></span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>24K Pure Gold: <strong>{config.liveGoldRate.gold24k}</strong></span>
          <span className="hidden sm:inline">•</span>
          <span>Silver: <strong>{config.liveGoldRate.silver}</strong></span>
          <span className="text-[10px] opacity-75 hidden md:inline">({config.liveGoldRate.lastUpdated})</span>
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#120e07]/95 backdrop-blur-2xl border-b border-[#2e230f] px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#f3e5ab] text-black flex items-center justify-center font-black shadow-lg">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-base text-white block leading-none">{config.businessName}</span>
              <span className="text-[10px] text-[#d4af37] tracking-widest uppercase mt-0.5 block font-bold">{config.businessSubtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#dcd1ba]">
            <a href="#collection" className="hover:text-[#d4af37]">Atelier</a>
            <a href="#offers" className="hover:text-[#d4af37]">Privilege</a>
            <a href="#lounge" className="hover:text-[#d4af37]">VIP Lounge</a>
            <a href="#reviews" className="hover:text-[#d4af37]">Reviews</a>
            <a href="#location" className="hover:text-[#d4af37]">Boutique</a>
          </div>

          <a
            href="#lounge"
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#d4af37] hover:bg-[#e6c250] text-black transition-all shadow-md"
          >
            Book VIP Lounge
          </a>
        </div>
      </nav>

      {/* Hero Showcase */}
      <header className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Jewellery Atelier" className="w-full h-full object-cover brightness-[0.25] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0805] via-[#0a0805]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#241c0c] text-[#d4af37] border border-[#4d3a14] shadow-xl">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% BIS 916 HUID Laser Inscribed • IGI Certified Solitaires</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Heirloom Polki & <span className="bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] bg-clip-text text-transparent">Royal Diamond Masterpieces</span>
          </h1>

          <p className="text-sm sm:text-base text-[#dcd1ba] max-w-xl mx-auto leading-relaxed">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#collection"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#d4af37] hover:bg-[#e6c250] text-black shadow-xl shadow-amber-500/20 flex items-center gap-2"
            >
              <Gem className="w-4 h-4" />
              <span>Explore Atelier Vault</span>
            </a>
            <a
              href="#lounge"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#1a1409] text-white border border-[#3d2e13] hover:bg-[#261d0d] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#d4af37]" />
              <span>VIP Bridal Suite Pass</span>
            </a>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-xs text-[#dcd1ba]">
            <div className="p-3 rounded-2xl bg-[#140f07] border border-[#2b200d]">
              <span className="block font-black text-[#d4af37] text-sm">BIS 916 HUID</span>
              <span className="text-[11px]">100% Govt Certified Gold</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#140f07] border border-[#2b200d]">
              <span className="block font-black text-[#d4af37] text-sm">IGI Certified</span>
              <span className="text-[11px]">VVS-EF Diamond Solitaires</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#140f07] border border-[#2b200d]">
              <span className="block font-black text-[#d4af37] text-sm">100% Buyback</span>
              <span className="text-[11px]">Lifetime Exchange Guarantee</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#140f07] border border-[#2b200d]">
              <span className="block font-black text-[#d4af37] text-sm">0% Making Deals</span>
              <span className="text-[11px]">Special Solitaire Privilege</span>
            </div>
          </div>
        </div>
      </header>

      {/* Privilege Offers Bar */}
      <section id="offers" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-5 sm:p-6 rounded-3xl bg-[#171208] border border-[#3b2c12] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Bridal Season Privilege</span>
              <h3 className="text-base sm:text-lg font-bold text-white">0% Making Charges on Selected Solitaire Rings & Polki!</h3>
            </div>
          </div>

          <a
            href="#lounge"
            className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e6c250] text-black font-bold text-xs uppercase"
          >
            Claim Gold Voucher
          </a>
        </div>
      </section>

      {/* Collection Suite */}
      <section id="collection" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Master Crafts</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Signature Atelier Vault</h2>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar justify-start sm:justify-center mb-8">
          {config.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'bg-[#140f07] text-[#dcd1ba] border border-[#2e230f] hover:bg-[#20180b]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-[#140f07] border border-[#2e230f] overflow-hidden flex flex-col justify-between hover:border-[#d4af37]/60 transition-all shadow-xl group"
            >
              <div className="h-72 overflow-hidden relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-[#d4af37]">
                  {item.weight}
                </span>
                {item.isBestseller && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#d4af37] text-black text-[10px] font-black uppercase">
                    Bestseller
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-white">{item.name}</h3>
                  <div className="text-xl font-black text-[#d4af37] mt-1">₹{item.price.toLocaleString('en-IN')}</div>
                  <span className="text-[11px] text-[#d4af37]/80 block mt-1 font-medium">{item.hallmark}</span>
                  <p className="text-xs text-[#b8ab91] leading-relaxed mt-2">{item.description}</p>
                </div>

                <button
                  onClick={() => handleInquireItem(item)}
                  className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e6c250] text-black font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Inquire Price on WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP Bridal Lounge Form */}
      <section id="lounge" className="py-20 px-4 sm:px-8 bg-[#0e0a05] border-y border-[#2e230f]">
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#171107] border border-[#3b2c12] space-y-4 shadow-2xl">
          <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#d4af37]" />
            <span>Book Private VIP Bridal Viewing Lounge</span>
          </h3>

          <form onSubmit={handleLoungeSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Your Full Name *"
              value={loungeBooking.name}
              onChange={(e) => setLoungeBooking({ ...loungeBooking, name: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#0a0703] border border-[#3b2c12] text-xs text-white"
            />
            <input
              type="tel"
              required
              placeholder="WhatsApp Phone *"
              value={loungeBooking.phone}
              onChange={(e) => setLoungeBooking({ ...loungeBooking, phone: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#0a0703] border border-[#3b2c12] text-xs text-white"
            />
            <input
              type="date"
              required
              value={loungeBooking.date}
              onChange={(e) => setLoungeBooking({ ...loungeBooking, date: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#0a0703] border border-[#3b2c12] text-xs text-white"
            />
            <button
              type="submit"
              className="sm:col-span-2 md:col-span-3 py-3 rounded-xl bg-[#d4af37] hover:bg-[#e6c250] text-black font-bold text-xs uppercase cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Reserve VIP Suite on WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Patron Reviews</span>
          <h2 className="font-serif text-3xl font-bold text-white">Trust of Generations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#140f07] border border-[#2e230f] space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, r) => <Star key={r} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-[#dcd1ba] italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#2e230f]">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-[#d4af37]/40" />
                <div>
                  <span className="font-bold text-xs text-white block">{t.name}</span>
                  <span className="text-[10px] text-[#d4af37]">{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Purity & Quality</span>
          <h2 className="font-serif text-3xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {config.faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl bg-[#140f07] border border-[#2e230f] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-[#b8ab91] leading-relaxed border-t border-[#2e230f] pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 bg-[#060503] border-t border-[#2e230f] text-[#8e816a] text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <span className="font-serif font-bold text-base text-white block">{config.businessName}</span>
            <p className="text-xs">{config.tagline}</p>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Atelier Address</span>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <span>{config.address}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Showroom Hours</span>
            <div>Weekdays: {config.hours.weekdays}</div>
            <div>Sunday: {config.hours.sunday}</div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">WhatsApp Concierge</span>
            <a
              href={`https://wa.me/${config.whatsapp}`}
              className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e6c250] text-black font-bold text-xs flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp: {config.phone}</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#2e230f] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {config.businessName}. All rights reserved.</span>
          <span className="text-[#d4af37] font-bold">Production Ready Platform by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
