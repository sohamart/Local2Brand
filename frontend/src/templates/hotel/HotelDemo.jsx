import React, { useState } from 'react';
import {
  Hotel,
  Calendar,
  Users,
  MapPin,
  Phone,
  Send,
  Sparkles,
  CheckCircle2,
  Coffee,
  Waves,
  ShieldCheck,
  Star,
  Tag,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { hotelConfig } from './config';

export default function HotelDemo({ customConfig }) {
  const config = customConfig || hotelConfig;
  const [openFaq, setOpenFaq] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '2 Adults',
    selectedRoom: 'Royal Lakefront Heritage Suite',
    specialRequests: ''
  });

  const handleBookSuite = (room) => {
    const text =
      `🏨 *SUITE RESERVATION - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👑 *Room Selected:* ${room.name}\n` +
      `💰 *Tariff:* ₹${room.price.toLocaleString('en-IN')}/Night\n` +
      `📐 *Size:* ${room.size} (${room.capacity})\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi Concierge, I would like to check availability and book this suite!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCustomBooking = (e) => {
    e.preventDefault();
    const text =
      `🌴 *HOTEL STAY INQUIRY - ${config.businessName}*\n\n` +
      `👤 Guest Name: *${bookingForm.name}*\n` +
      `📞 WhatsApp Phone: *${bookingForm.phone}*\n` +
      `📅 Check-in: *${bookingForm.checkIn || 'Upcoming Weekend'}*\n` +
      `📅 Check-out: *${bookingForm.checkOut || 'Open'}*\n` +
      `👥 Guests: *${bookingForm.guests}*\n` +
      `🛏️ Suite: *${bookingForm.selectedRoom}*\n` +
      (bookingForm.specialRequests ? `📝 Requests: ${bookingForm.specialRequests}\n` : '') +
      `\nPlease confirm availability & special tariff on WhatsApp!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-[#f8fafc] font-sans selection:bg-[#c5a059] selection:text-black overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#1a140a] text-[#dfba73] text-xs font-bold py-2 px-4 text-center border-b border-[#3d2e14] shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span>👑 5-STAR HERITAGE LAKEFRONT PALACE & RESORT • USE CODE <strong>STAYROYAL</strong> FOR 15% OFF</span>
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0c121e]/95 backdrop-blur-2xl border-b border-[#1e293b] px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#c5a059] to-[#dfba73] text-black flex items-center justify-center font-black shadow-lg">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-base text-white block leading-none">{config.businessName}</span>
              <span className="text-[10px] text-[#c5a059] tracking-widest uppercase mt-0.5 block font-bold">{config.businessSubtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
            <a href="#suites" className="hover:text-[#c5a059]">Suites & Villas</a>
            <a href="#offers" className="hover:text-[#c5a059]">Offers</a>
            <a href="#book" className="hover:text-[#c5a059]">Direct Booking</a>
            <a href="#reviews" className="hover:text-[#c5a059]">Reviews</a>
            <a href="#location" className="hover:text-[#c5a059]">Location</a>
          </div>

          <a
            href="#book"
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#c5a059] text-black hover:bg-[#dfba73] transition-all shadow-md"
          >
            Check Availability
          </a>
        </div>
      </nav>

      {/* Hero Showcase */}
      <header className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Luxury Palace Resort" className="w-full h-full object-cover brightness-[0.25] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#221c0e] text-[#dfba73] border border-[#4d3a19] inline-flex items-center gap-1.5 shadow-xl">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Condé Nast Top Heritage Resort Winner</span>
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            An Enchanting Stay In The <span className="text-[#c5a059]">Lap of Royal Luxury</span>
          </h1>

          <p className="text-sm sm:text-base text-[#cbd5e1] max-w-xl mx-auto leading-relaxed">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#suites"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#c5a059] text-black hover:bg-[#dfba73] shadow-xl flex items-center gap-2"
            >
              <Hotel className="w-4 h-4" />
              <span>Explore Palace Suites</span>
            </a>
            <a
              href="#book"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#141b2a] text-white border border-[#334155] hover:bg-[#1e293b] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#c5a059]" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-xs text-[#94a3b8]">
            <div className="p-3 rounded-2xl bg-[#111927] border border-[#1e293b]">
              <span className="block font-black text-[#c5a059] text-sm">Lakefront Suites</span>
              <span className="text-[11px]">Private Plunge Pools</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#111927] border border-[#1e293b]">
              <span className="block font-black text-[#c5a059] text-sm">24/7 Butler</span>
              <span className="text-[11px]">Dedicated Royal Service</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#111927] border border-[#1e293b]">
              <span className="block font-black text-[#c5a059] text-sm">Boat Transfer</span>
              <span className="text-[11px]">Private Palace Jetty</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#111927] border border-[#1e293b]">
              <span className="block font-black text-[#c5a059] text-sm">Ayurvedic Spa</span>
              <span className="text-[11px]">Holistic Wellness Treatments</span>
            </div>
          </div>
        </div>
      </header>

      {/* Promo Offers Bar */}
      <section id="offers" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-5 sm:p-6 rounded-3xl bg-[#131b2a] border border-[#23334d] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/20 border border-[#c5a059]/50 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-[#c5a059]" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#c5a059]">Royal Getaway Offer</span>
              <h3 className="text-base sm:text-lg font-bold text-white">Save 15% on 2+ Nights Weekend Bookings!</h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {config.activeCoupons.map((c) => (
              <div key={c.code} className="px-4 py-2 rounded-2xl bg-[#070b12] border border-dashed border-[#c5a059]/60 flex items-center gap-3">
                <div>
                  <span className="font-mono font-black text-[#c5a059] text-xs block">{c.code}</span>
                  <span className="text-[10px] text-[#94a3b8]">{c.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suites Showcase */}
      <section id="suites" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c5a059]">Sanctuaries of Peace</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Palace Suites & Plunge Pool Villas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.rooms.map((room) => (
            <div
              key={room.id}
              className="rounded-3xl bg-[#0f172a] border border-[#1e293b] overflow-hidden flex flex-col justify-between hover:border-[#c5a059]/50 transition-all shadow-xl group"
            >
              <div className="h-60 overflow-hidden relative">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-xs font-bold text-[#dfba73]">
                  {room.size} • {room.capacity}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">{room.name}</h3>
                  <div className="text-2xl font-black text-[#c5a059] mt-1">
                    ₹{room.price.toLocaleString('en-IN')} <span className="text-xs font-normal text-[#94a3b8]">/ Night</span>
                  </div>

                  <div className="space-y-1.5 pt-3 text-xs text-[#cbd5e1]">
                    {room.amenities.map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleBookSuite(room)}
                  className="w-full py-3 rounded-xl bg-[#c5a059] text-black font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#dfba73] cursor-pointer shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Book on WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Concierge Reservation Form */}
      <section id="book" className="py-20 px-4 sm:px-8 bg-[#0b1019] border-y border-[#1e293b]">
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#131b2e] border border-[#25324b] space-y-4">
          <h3 className="font-serif font-bold text-xl text-white">Direct Concierge Reservation</h3>
          <form onSubmit={handleCustomBooking} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Your Full Name *"
              value={bookingForm.name}
              onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#0a0f1a] border border-[#25324b] text-xs text-white"
            />
            <input
              type="tel"
              required
              placeholder="WhatsApp Phone *"
              value={bookingForm.phone}
              onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#0a0f1a] border border-[#25324b] text-xs text-white"
            />
            <input
              type="date"
              required
              value={bookingForm.checkIn}
              onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#0a0f1a] border border-[#25324b] text-xs text-white"
            />
            <button
              type="submit"
              className="sm:col-span-2 md:col-span-3 py-3 rounded-xl bg-[#c5a059] text-black font-black text-xs uppercase hover:bg-[#dfba73] cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Inquire Dates via WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c5a059]">Guest Experiences</span>
          <h2 className="font-serif text-3xl font-bold text-white">Memories at The Grand Mirage</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#0f172a] border border-[#1e293b] space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, r) => <Star key={r} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-[#cbd5e1] italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#1e293b]">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-[#c5a059]/40" />
                <div>
                  <span className="font-bold text-xs text-white block">{t.name}</span>
                  <span className="text-[10px] text-[#c5a059]">{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c5a059]">Concierge Help</span>
          <h2 className="font-serif text-3xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {config.faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl bg-[#0f172a] border border-[#1e293b] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#c5a059] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-[#94a3b8] leading-relaxed border-t border-[#1e293b] pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 bg-[#05080e] border-t border-[#1e293b] text-[#64748b] text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <span className="font-serif font-bold text-base text-white block">{config.businessName}</span>
            <p className="text-xs">{config.tagline}</p>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Palace Location</span>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <span>{config.address}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Check-In / Out</span>
            <div>Check-in: {config.hours.checkIn}</div>
            <div>Check-out: {config.hours.checkOut}</div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Concierge WhatsApp</span>
            <a
              href={`https://wa.me/${config.whatsapp}`}
              className="px-4 py-2 rounded-xl bg-[#c5a059] text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#dfba73]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp: {config.phone}</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {config.businessName}. All rights reserved.</span>
          <span className="text-[#c5a059] font-bold">Production Ready Platform by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
