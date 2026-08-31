import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { TABLES, RESERVATIONS } from '../../data/mockData';
import { Calendar as CalendarIcon, Clock, Users, Sparkles, CheckCircle2, MapPin, Heart, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TableReservationPage = () => {
  const { activeRestaurant } = useTenant();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('08:00 PM');
  const [guests, setGuests] = useState(4);
  const [selectedTable, setSelectedTable] = useState(TABLES[0]?.id || '');
  const [occasion, setOccasion] = useState('Dinner with Family');
  const [specialRequests, setSpecialRequests] = useState('');
  const [customerName, setCustomerName] = useState('Soham Mukherjee');
  const [phone, setPhone] = useState('+91 98301 23456');
  const [email, setEmail] = useState('soham@example.com');
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  const availableTables = TABLES.filter(t => t.restaurantId === activeRestaurant.id || t.restaurantId === 'rest-001');

  const timeSlots = [
    '12:30 PM', '01:30 PM', '02:00 PM',
    '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM'
  ];

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newReservation = {
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      date,
      time: timeSlot,
      guests,
      tableNumber: availableTables.find(t => t.id === selectedTable)?.number || 'Table 1',
      occasion,
      specialRequests,
      customerName,
      status: 'confirmed'
    };

    setBookingConfirmed(newReservation);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Imperial Hospitality
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">
          Reserve a Royal Banquet Table
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Immerse in fine-dining grandeur at {activeRestaurant.name}. Guaranteed reservation with instant VIP confirmation.
        </p>
      </div>

      {bookingConfirmed ? (
        /* Confirmation State */
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-amber-500/40 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 shadow-gold-glow">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              Reservation Confirmed • #{bookingConfirmed.id}
            </span>
            <h2 className="font-heading text-2xl font-bold text-white">
              We Await Your Presence, {bookingConfirmed.customerName}!
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              A private confirmation SMS & Email have been dispatched with your concierge check-in code.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 bg-white/5 rounded-2xl text-xs text-left border border-white/10">
            <div>
              <div className="text-slate-400">Date & Slot</div>
              <div className="font-bold text-white mt-0.5">{bookingConfirmed.date} at {bookingConfirmed.time}</div>
            </div>
            <div>
              <div className="text-slate-400">Reserved Table</div>
              <div className="font-bold text-amber-400 mt-0.5">{bookingConfirmed.tableNumber} ({bookingConfirmed.guests} Guests)</div>
            </div>
          </div>

          <button
            onClick={() => setBookingConfirmed(null)}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs"
          >
            Book Another Table
          </button>
        </div>
      ) : (
        /* Booking Form */
        <form onSubmit={handleBookingSubmit} className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-8">
          
          {/* 1. Date & Time Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-400" />
              <span>1. Select Date & Arrival Time</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400">Date</span>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <span className="text-[11px] text-slate-400">Available Time Slots</span>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        timeSlot === slot
                          ? 'bg-amber-500 text-black font-bold shadow-gold-glow'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Guests & Seating Layout */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>2. Guest Count & Table Section</span>
            </label>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[1, 2, 4, 6, 8, 10, 12].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setGuests(num)}
                  className={`w-12 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all shrink-0 ${
                    guests === num
                      ? 'bg-amber-500 text-black shadow-gold-glow scale-105'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </button>
              ))}
            </div>

            {/* Table Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {availableTables.map((tbl) => (
                <button
                  key={tbl.id}
                  type="button"
                  onClick={() => setSelectedTable(tbl.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedTable === tbl.id
                      ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-gold-glow'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold text-white text-xs">{tbl.number}</div>
                  <div className="text-[11px] text-amber-400 mt-0.5">{tbl.section}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Capacity: up to {tbl.capacity} persons</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Occasion & Guest Contact Info */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>3. Reservation Details</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Special Occasion</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full bg-[#141722] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Dinner with Family">Dinner with Family</option>
                  <option value="Romantic Date">Romantic Candlelight Date</option>
                  <option value="Birthday Celebration">Birthday Celebration</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Corporate Banquet">Corporate Dinner</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Special Requests / Dietary Needs</label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Quiet corner, high chair for toddler, Jain food preparation..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-brand-primary text-black font-extrabold text-sm shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Confirm Imperial Reservation</span>
          </button>

        </form>
      )}

    </div>
  );
};
