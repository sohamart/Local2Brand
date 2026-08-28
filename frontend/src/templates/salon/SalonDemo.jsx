import React, { useState, useMemo } from 'react';
import {
  Scissors,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Send,
  Star,
  CheckCircle2,
  Heart,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  X,
  Tag,
  Search,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { salonConfig } from './config';

export default function SalonDemo({ customConfig }) {
  const config = customConfig || salonConfig;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState({});
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const [appointmentData, setAppointmentData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '14:00',
    stylistTier: 'senior',
    notes: ''
  });

  const filteredServices = useMemo(() => {
    return config.services.filter(s => {
      const matchCat = selectedCategory === "All" || s.category === selectedCategory;
      const matchSearch = searchQuery === "" || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [config.services, selectedCategory, searchQuery]);

  const bookedItems = useMemo(() => {
    return Object.keys(selectedServices)
      .map(id => config.services.find(s => s.id === Number(id)))
      .filter(Boolean);
  }, [selectedServices, config.services]);

  const subtotal = useMemo(() => {
    return bookedItems.reduce((sum, item) => sum + item.price, 0);
  }, [bookedItems]);

  const discount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const grandTotal = Math.max(0, subtotal - discount);

  const toggleService = (service) => {
    setSelectedServices(prev => {
      const updated = { ...prev };
      if (updated[service.id]) {
        delete updated[service.id];
      } else {
        updated[service.id] = true;
      }
      return updated;
    });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const found = config.activeCoupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid promo coupon');
      return;
    }
    if (subtotal < found.minOrder) {
      setCouponError(`Min booking value of ₹${found.minOrder} required.`);
      return;
    }
    setAppliedCoupon(found);
  };

  const handleCompleteBooking = (e) => {
    e.preventDefault();
    if (bookedItems.length === 0) return;
    if (!appointmentData.name || !appointmentData.phone) {
      alert("Please provide Name and Phone number!");
      return;
    }

    const stylistObj = config.stylistTiers.find(t => t.id === appointmentData.stylistTier);

    const servicesText = bookedItems
      .map((s, i) => `${i + 1}. *${s.name}* (₹${s.price} • ${s.duration})`)
      .join('\n');

    const couponText = appliedCoupon ? `🎁 Promo Applied: *${appliedCoupon.code}* (-₹${discount})\n` : '';

    const text =
      `💇 *VIP SALON APPOINTMENT - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Client Name:* ${appointmentData.name}\n` +
      `📞 *WhatsApp Phone:* ${appointmentData.phone}\n` +
      `📅 *Date:* ${appointmentData.date || 'Earliest Available'}\n` +
      `⏰ *Time Slot:* ${appointmentData.time}\n` +
      `✂️ *Stylist Level:* ${stylistObj ? stylistObj.name : 'Senior Stylist'}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💅 *SELECTED TREATMENTS:*\n${servicesText}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 Estimated Total: ₹${subtotal}\n` +
      couponText +
      `💰 *FINAL ESTIMATE: ₹${grandTotal}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      (appointmentData.notes ? `📝 Special Notes: ${appointmentData.notes}\n` : '') +
      `\n✨ *Please confirm my luxury appointment slot!*`;

    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0c090e] text-[#fceef5] font-sans selection:bg-[#e05697] selection:text-white overflow-x-hidden">
      
      {/* Top Announcement Ticker */}
      <div className="bg-gradient-to-r from-[#e05697] via-[#b83280] to-[#9d246c] text-white text-xs font-bold py-2 px-4 text-center shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span>✨ Festive Glow: Use code <strong>GLOW15</strong> for 15% OFF on Medi-Facials</span>
          <span className="hidden sm:inline">•</span>
          <span>Complimentary Hair Spa with Full Bridal Makeovers 👰</span>
        </div>
      </div>

      {/* Sticky Luxury Navigation */}
      <nav className="sticky top-0 z-40 bg-[#140e17]/95 backdrop-blur-2xl border-b border-[#3b2438] px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#e05697] to-[#b83280] text-white flex items-center justify-center font-black shadow-lg shadow-pink-500/20">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-base text-[#fceef5] block leading-none">{config.businessName}</span>
              <span className="text-[10px] text-[#e05697] tracking-widest uppercase mt-0.5 block font-bold">{config.businessSubtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#d8b4c8]">
            <a href="#services" className="hover:text-[#e05697]">Services & Prices</a>
            <a href="#offers" className="hover:text-[#e05697]">Offers</a>
            <a href="#book" className="hover:text-[#e05697]">Book Stylist</a>
            <a href="#reviews" className="hover:text-[#e05697]">Reviews</a>
            <a href="#location" className="hover:text-[#e05697]">Studio Map</a>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="#book"
              className="hidden sm:inline-flex px-4 py-2 rounded-full text-xs font-bold bg-[#291726] text-[#f472b6] border border-[#592c52] hover:bg-[#e05697] hover:text-white transition-all"
            >
              Book Slot
            </a>

            <button
              onClick={() => setIsBookingDrawerOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#e05697] to-[#b83280] text-white hover:opacity-95 shadow-md flex items-center gap-1.5 cursor-pointer relative"
            >
              <Calendar className="w-4 h-4" />
              <span>Bookings ({bookedItems.length})</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Showcase */}
      <header className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Luxury Salon" className="w-full h-full object-cover brightness-[0.25] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c090e] via-[#0c090e]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#291726] border border-[#592c52] text-[#f472b6] text-xs font-bold uppercase tracking-widest shadow-xl">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrity Stylists • Advanced Medi-Aesthetics</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#fceef5] tracking-tight leading-tight">
            Where Elegance Meets <span className="bg-gradient-to-r from-[#f472b6] via-[#e05697] to-[#ec4899] bg-clip-text text-transparent">Flawless Glamour</span>
          </h1>

          <p className="text-sm sm:text-base text-[#d8b4c8] max-w-xl mx-auto leading-relaxed">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#services"
              className="px-7 py-3 rounded-full text-xs font-bold bg-gradient-to-r from-[#e05697] to-[#b83280] text-white hover:opacity-95 shadow-xl shadow-pink-500/25 flex items-center gap-2"
            >
              <Scissors className="w-4 h-4" />
              <span>Explore Rate Card</span>
            </a>
            <button
              onClick={() => setIsBookingDrawerOpen(true)}
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#1f1320] text-[#fceef5] border border-[#592c52] hover:bg-[#291726] cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#f472b6]" />
              <span>Instant WhatsApp Slot</span>
            </button>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-xs text-[#d8b4c8]">
            <div className="p-3 rounded-2xl bg-[#1e1021] border border-[#3d1f44]">
              <span className="block font-black text-[#f472b6] text-sm">4.9 ★★★★★</span>
              <span className="text-[11px]">850+ Verified Reviews</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#1e1021] border border-[#3d1f44]">
              <span className="block font-black text-[#f472b6] text-sm">Olaplex Pro</span>
              <span className="text-[11px]">100% Bond Protection</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#1e1021] border border-[#3d1f44]">
              <span className="block font-black text-[#f472b6] text-sm">HydraFacial MD</span>
              <span className="text-[11px]">Vortex Deep Extraction</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#1e1021] border border-[#3d1f44]">
              <span className="block font-black text-[#f472b6] text-sm">HD Airbrush</span>
              <span className="text-[11px]">Waterproof Bridal Look</span>
            </div>
          </div>
        </div>
      </header>

      {/* Promo Coupons Bar */}
      <section id="offers" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-5 sm:p-6 rounded-3xl bg-[#1c0f20] border border-[#4a224f] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#e05697]/20 border border-[#e05697]/50 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-[#f472b6]" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#f472b6]">Exclusive Salon Offers</span>
              <h3 className="text-base sm:text-lg font-bold text-[#fceef5]">Book Online & Save on Luxury Packages!</h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {config.activeCoupons.map((c) => (
              <div key={c.code} className="px-4 py-2 rounded-2xl bg-[#0c090e] border border-dashed border-[#e05697]/60 flex items-center gap-3">
                <div>
                  <span className="font-mono font-black text-[#f472b6] text-xs block">{c.code}</span>
                  <span className="text-[10px] text-[#b391a4]">{c.label}</span>
                </div>
                <button
                  onClick={() => {
                    setCouponCode(c.code);
                    setAppliedCoupon(c);
                    setIsBookingDrawerOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#e05697] text-white font-black text-[10px] uppercase hover:opacity-90 cursor-pointer"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Rate Card Suite */}
      <section id="services" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f472b6]">Curated Treatments</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#fceef5]">Service Rate Cards & Packages</h2>
          <p className="text-xs sm:text-sm text-[#b391a4] max-w-lg mx-auto">
            Tap <strong>+ Select Treatment</strong> to add multiple services into your unified WhatsApp appointment.
          </p>
        </div>

        {/* Search & Category Tabs */}
        <div className="max-w-4xl mx-auto space-y-4 mb-10">
          <div className="relative">
            <Search className="w-5 h-5 text-[#e05697]/70 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services (e.g. Balayage, HydraFacial, Gel Nails, Bridal...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#170e1a] border border-[#3b2438] text-sm text-[#fceef5] focus:outline-none focus:border-[#e05697]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
            {config.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#e05697] to-[#b83280] text-white shadow-md'
                    : 'bg-[#170e1a] text-[#d8b4c8] border border-[#3b2438] hover:bg-[#291726]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((s) => {
            const isSelected = !!selectedServices[s.id];

            return (
              <div
                key={s.id}
                className={`rounded-3xl border overflow-hidden shadow-xl flex flex-col justify-between transition-all group ${
                  isSelected
                    ? 'bg-[#291726] border-[#e05697] shadow-pink-500/10'
                    : 'bg-[#170e1a] border-[#3b2438] hover:border-[#e05697]/50'
                }`}
              >
                <div className="relative h-52 overflow-hidden bg-black/50">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-[#f472b6]">
                    {s.duration}
                  </span>
                  {s.isBestseller && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#e05697] to-[#b83280] text-white text-[10px] font-black uppercase">
                      Popular
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-base text-[#fceef5] group-hover:text-[#f472b6] transition-colors">{s.name}</h3>
                      <span className="font-black text-lg text-[#f472b6]">₹{s.price}</span>
                    </div>
                    <span className="text-[10px] text-[#f472b6]/80 font-bold block mb-1">{s.rating}</span>
                    <p className="text-xs text-[#b391a4] leading-relaxed line-clamp-2">{s.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#3b2438] flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleService(s)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-[#291726] text-[#f472b6] border border-[#592c52] hover:bg-[#e05697] hover:text-white'
                      }`}
                    >
                      {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{isSelected ? 'Added to Appointment' : 'Select Service'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stylist & VIP Appointment Booking Suite */}
      <section id="book" className="py-20 px-4 sm:px-8 bg-[#120a15] border-y border-[#3b2438]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#291726] border border-[#592c52] text-[#f472b6] text-xs font-bold uppercase">
              <Scissors className="w-3.5 h-3.5" />
              <span>Dedicated Stylist Appointment</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#fceef5] leading-tight">
              Reserve Your Celebrity Stylist or Medi-Facial Session
            </h2>

            <p className="text-xs sm:text-sm text-[#d8b4c8] leading-relaxed">
              Experience private styling bays, sterilized diagnostic tools, and custom hair & skin consultations with instant WhatsApp confirmation.
            </p>

            <div className="space-y-2.5 pt-2">
              {config.stylistTiers.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setAppointmentData({ ...appointmentData, stylistTier: tier.id })}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    appointmentData.stylistTier === tier.id
                      ? 'bg-[#2b172a] border-[#e05697] text-[#fceef5]'
                      : 'bg-[#180e1b] border-[#3b2438] text-[#d8b4c8]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-xs text-[#fceef5]">{tier.name}</span>
                    {appointmentData.stylistTier === tier.id && <CheckCircle2 className="w-4 h-4 text-[#f472b6]" />}
                  </div>
                  <p className="text-[11px] text-[#b391a4]">{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#1a0f1e] border border-[#4a224f] shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#fceef5] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#f472b6]" />
              <span>Guest & Appointment Details</span>
            </h3>

            <form onSubmit={handleCompleteBooking} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name *"
                  value={appointmentData.name}
                  onChange={(e) => setAppointmentData({ ...appointmentData, name: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-[#0c090e] border border-[#3b2438] text-xs text-white"
                />
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp Phone *"
                  value={appointmentData.phone}
                  onChange={(e) => setAppointmentData({ ...appointmentData, phone: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-[#0c090e] border border-[#3b2438] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="date"
                  required
                  value={appointmentData.date}
                  onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-[#0c090e] border border-[#3b2438] text-xs text-white"
                />
                <select
                  value={appointmentData.time}
                  onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-[#0c090e] border border-[#3b2438] text-xs text-white"
                >
                  <option value="11:00 AM">11:00 AM (Morning Slot)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
                  <option value="04:30 PM">04:30 PM (Evening Glow)</option>
                  <option value="07:00 PM">07:00 PM (Late Spa Session)</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Specific concerns (e.g. Frizzy hair, acne extraction, bridal trial)"
                value={appointmentData.notes}
                onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c090e] border border-[#3b2438] text-xs text-white"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-gradient-to-r from-[#e05697] to-[#b83280] text-white hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Confirm Appointment on WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f472b6]">Verified Clients</span>
          <h2 className="font-serif text-3xl font-bold text-[#fceef5]">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#170e1a] border border-[#3b2438] space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, r) => <Star key={r} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-[#d8b4c8] italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#3b2438]">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-[#e05697]/40" />
                <div>
                  <span className="font-bold text-xs text-[#fceef5] block">{t.name}</span>
                  <span className="text-[10px] text-[#f472b6]">{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f472b6]">Help & Info</span>
          <h2 className="font-serif text-3xl font-bold text-[#fceef5]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {config.faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl bg-[#170e1a] border border-[#3b2438] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#fceef5] flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#f472b6] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-[#b391a4] leading-relaxed border-t border-[#3b2438] pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 bg-[#09060b] border-t border-[#3b2438] text-[#b391a4] text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <span className="font-serif font-bold text-base text-[#fceef5] block">{config.businessName}</span>
            <p className="text-xs">{config.tagline}</p>
          </div>

          <div>
            <span className="font-bold text-[#fceef5] block mb-2 uppercase">Studio Address</span>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#f472b6] shrink-0 mt-0.5" />
              <span>{config.address}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-[#fceef5] block mb-2 uppercase">Studio Hours</span>
            <div>Weekdays: {config.hours.weekdays}</div>
            <div>Weekends: {config.hours.weekends}</div>
          </div>

          <div>
            <span className="font-bold text-[#fceef5] block mb-2 uppercase">WhatsApp Support</span>
            <a
              href={`https://wa.me/${config.whatsapp}`}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#e05697] to-[#b83280] text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp: {config.phone}</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#3b2438] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {config.businessName}. All rights reserved.</span>
          <span className="text-[#f472b6] font-bold">Production Ready Platform by LOCAL2BRAND</span>
        </div>
      </footer>

      {/* Slide-Over Booking Drawer */}
      {isBookingDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#160f19] border-l border-[#3b2438] h-full flex flex-col justify-between p-5 text-pink-100 modal-touch-scroll" data-lenis-prevent="true">
            <div className="flex items-center justify-between border-b border-[#3b2438] pb-3">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-[#e05697]" />
                <h3 className="font-bold text-base text-white">Your Treatments ({bookedItems.length})</h3>
              </div>
              <button onClick={() => setIsBookingDrawerOpen(false)} className="p-1 rounded-full text-pink-300 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {bookedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#231526] border border-[#4d2948]">
                  <div>
                    <h4 className="font-bold text-xs text-white">{item.name}</h4>
                    <span className="text-xs text-[#f472b6]">₹{item.price} • {item.duration}</span>
                  </div>
                  <button onClick={() => toggleService(item)} className="p-1.5 text-red-400 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {bookedItems.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={appointmentData.name}
                    onChange={(e) => setAppointmentData({ ...appointmentData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0912] border border-[#3b2438] text-xs text-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp Phone Number *"
                    value={appointmentData.phone}
                    onChange={(e) => setAppointmentData({ ...appointmentData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0912] border border-[#3b2438] text-xs text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      required
                      value={appointmentData.date}
                      onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0f0912] border border-[#3b2438] text-xs text-white"
                    />
                    <select
                      value={appointmentData.time}
                      onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0f0912] border border-[#3b2438] text-xs text-white"
                    >
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="07:00 PM">07:00 PM</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {bookedItems.length > 0 && (
              <div className="border-t border-[#3b2438] pt-3 space-y-3">
                <div className="flex items-center justify-between text-base font-black text-white">
                  <span>Total Estimate</span>
                  <span className="text-[#f472b6]">₹{grandTotal}</span>
                </div>
                <button
                  onClick={handleCompleteBooking}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e05697] to-[#b83280] text-white font-black text-xs uppercase flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm Booking on WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
