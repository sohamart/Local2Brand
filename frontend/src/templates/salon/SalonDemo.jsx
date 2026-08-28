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
  ArrowRight
} from 'lucide-react';
import { salonConfig } from './config';

export default function SalonDemo({ customConfig }) {
  const config = customConfig || salonConfig;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedServices, setSelectedServices] = useState({});
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [appointmentData, setAppointmentData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '14:00',
    preferredStylist: 'Any Senior Stylist',
    notes: ''
  });

  const filteredServices = useMemo(() => {
    return selectedCategory === "All"
      ? config.services
      : config.services.filter(s => s.category === selectedCategory);
  }, [config.services, selectedCategory]);

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

  const handleCompleteBooking = (e) => {
    e.preventDefault();
    if (bookedItems.length === 0) return;
    if (!appointmentData.name || !appointmentData.phone) {
      alert("Please provide Name and Phone number!");
      return;
    }

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
      `✂️ *Preferred Stylist:* ${appointmentData.preferredStylist}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💅 *SELECTED TREATMENTS:*\n${servicesText}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 Estimated Total: ₹${subtotal}\n` +
      couponText +
      `💰 *FINAL ESTIMATE: ₹${grandTotal}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      (appointmentData.notes ? `📝 Special Notes: ${appointmentData.notes}\n` : '') +
      `\n✨ *Please confirm my appointment slot!*`;

    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0c090e] text-[#fceef5] font-sans selection:bg-[#e05697] selection:text-white overflow-x-hidden">
      
      {/* Top Offer Ticker */}
      <div className="bg-gradient-to-r from-[#e05697] to-[#b83280] text-white text-xs font-bold py-2 px-4 text-center shadow-md">
        <span>✨ Festive Glow Offer: Use code <strong>GLOW15</strong> for 15% OFF on Medi-Facials • Complimentary Hair Spa on Bridal Packages!</span>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#140e17]/95 backdrop-blur-2xl border-b border-[#3b2438] px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
            <a href="#book" className="hover:text-[#e05697]">Book Stylist</a>
            <a href="#location" className="hover:text-[#e05697]">Studio Location</a>
          </div>

          <button
            onClick={() => setIsBookingDrawerOpen(true)}
            className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#e05697] to-[#b83280] text-white hover:opacity-95 shadow-md flex items-center gap-1.5 cursor-pointer relative"
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings ({bookedItems.length})</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-8 text-center max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
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
              className="px-7 py-3 rounded-full text-xs font-bold bg-gradient-to-r from-[#e05697] to-[#b83280] text-white hover:opacity-95 shadow-xl shadow-pink-500/25"
            >
              Explore Rate Card
            </a>
            <button
              onClick={() => setIsBookingDrawerOpen(true)}
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#1f1320] text-[#fceef5] border border-[#592c52] hover:bg-[#291726] cursor-pointer"
            >
              Instant WhatsApp Appointment
            </button>
          </div>
        </div>
      </header>

      {/* Service Rate Card */}
      <section id="services" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f472b6]">Curated Treatments</span>
          <h2 className="font-serif text-3xl font-bold text-[#fceef5]">Service Rate Cards & Packages</h2>
          <p className="text-xs text-[#d8b4c8]/70">Tap <strong>+ Select Service</strong> to combine multiple treatments in one WhatsApp appointment.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-8">
          {config.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#e05697] to-[#b83280] text-white shadow-md'
                  : 'bg-[#1a101d] text-[#d8b4c8] border border-[#3b2438] hover:bg-[#291726]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((s) => {
            const isSelected = !!selectedServices[s.id];

            return (
              <div
                key={s.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                  isSelected
                    ? 'bg-[#291726] border-[#e05697] shadow-xl shadow-pink-500/10'
                    : 'bg-[#170e1a] border-[#3b2438] hover:border-[#e05697]/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-base text-[#fceef5]">{s.name}</h3>
                    <span className="font-black text-lg text-[#f472b6] shrink-0">₹{s.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#f472b6]/80 mb-2 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{s.duration}</span>
                    <span>•</span>
                    <span>{s.rating}</span>
                  </div>
                  <p className="text-xs text-[#b391a4] leading-relaxed">{s.description}</p>
                </div>

                <div className="pt-2 border-t border-[#3b2438] flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleService(s)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-[#291726] text-[#f472b6] border border-[#592c52] hover:bg-[#e05697] hover:text-white'
                    }`}
                  >
                    {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span>{isSelected ? 'Selected in Cart' : 'Select Treatment'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 border-t border-[#3b2438] text-xs text-[#b391a4]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-sm text-[#fceef5] block">{config.businessName}</span>
            <span>{config.address} • {config.hours}</span>
          </div>
          <span className="text-[#f472b6]">Production Ready Template by LOCAL2BRAND</span>
        </div>
      </footer>

      {/* Booking Slide-Over Drawer */}
      {isBookingDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#160f19] border-l border-[#3b2438] h-full flex flex-col justify-between p-5 text-pink-100 modal-touch-scroll" data-lenis-prevent="true">
            <div className="flex items-center justify-between border-b border-[#3b2438] pb-3">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-[#e05697]" />
                <h3 className="font-bold text-base text-white">Your Appointments ({bookedItems.length})</h3>
              </div>
              <button onClick={() => setIsBookingDrawerOpen(false)} className="p-1 rounded-full text-pink-300">
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
                  <button onClick={() => toggleService(item)} className="p-1.5 text-red-400">
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
                      <option value="06:30 PM">06:30 PM</option>
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
