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
  Star
} from 'lucide-react';
import { hotelConfig } from './config';

export default function HotelDemo({ customConfig }) {
  const config = customConfig || hotelConfig;

  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '2 Adults',
    selectedRoom: 'Royal Lakefront Heritage Suite'
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
      `📞 Phone: *${bookingForm.phone}*\n` +
      `📅 Check-in: *${bookingForm.checkIn || 'Next Weekend'}*\n` +
      `📅 Check-out: *${bookingForm.checkOut || 'Open'}*\n` +
      `👥 Guests: *${bookingForm.guests}*\n` +
      `🛏️ Suite: *${bookingForm.selectedRoom}*\n\n` +
      `Please confirm availability & tariff!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-[#f8fafc] font-sans selection:bg-[#c5a059] selection:text-black overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#1a140a] text-[#dfba73] text-xs font-bold py-2 px-4 text-center border-b border-[#3d2e14]">
        <span>👑 5-Star Heritage Luxury Stay on Lake Pichola • Use code <strong>STAYROYAL</strong> for 15% OFF</span>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0c121e]/95 backdrop-blur-2xl border-b border-[#1e293b] px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
            <a href="#amenities" className="hover:text-[#c5a059]">Amenities</a>
            <a href="#book" className="hover:text-[#c5a059]">Direct Booking</a>
          </div>

          <a
            href="#book"
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#c5a059] text-black hover:bg-[#dfba73] transition-all"
          >
            Check Availability
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-[75vh] flex items-center justify-center py-16 px-4 text-center">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Luxury Palace Resort" className="w-full h-full object-cover brightness-[0.3]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-5">
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
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#c5a059] text-black hover:bg-[#dfba73] shadow-xl"
            >
              Explore Palace Suites
            </a>
            <a
              href="#book"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#141b2a] text-white border border-[#334155] hover:bg-[#1e293b]"
            >
              WhatsApp Concierge
            </a>
          </div>
        </div>
      </header>

      {/* Suites Showcase */}
      <section id="suites" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
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
              <div className="h-56 overflow-hidden relative">
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

      {/* Quick Booking Strip */}
      <section id="book" className="py-16 px-4 sm:px-8 bg-[#0b1019] border-t border-[#1e293b]">
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
              className="sm:col-span-2 md:col-span-3 py-3 rounded-xl bg-[#c5a059] text-black font-black text-xs uppercase hover:bg-[#dfba73] cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Inquire Dates via WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-8 border-t border-[#1e293b] text-[#64748b] text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-sm text-white block">{config.businessName}</span>
            <span>{config.address} • {config.hours}</span>
          </div>
          <span className="text-[#c5a059] font-bold">Production Ready Template by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
