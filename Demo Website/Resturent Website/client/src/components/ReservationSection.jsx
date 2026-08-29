import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  Utensils, 
  CheckCircle2, 
  Flame, 
  User, 
  Phone, 
  Mail, 
  Loader2,
  Receipt
} from 'lucide-react';
import { api } from '../services/api';

export default function ReservationSection({ isOpenModal = false, onCloseModal }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 2,
    reservation_date: new Date().toISOString().split('T')[0],
    reservation_time: '19:30',
    seating_type: 'Main Dining Hall',
    special_request: ''
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  const seatingOptions = [
    'Main Dining Hall',
    'Candlelight Flame Booth',
    'Open-Air Charcoal Garden',
    'VIP Royal Table'
  ];

  const timeSlots = [
    '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
    '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.createReservation(formData);
      setSuccessData(res.reservation);
    } catch (err) {
      setError(err.message || 'Failed to submit table booking ticket.');
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="max-w-3xl mx-auto">
      {successData ? (
        <div className="kitchen-ticket rounded-3xl overflow-hidden shadow-2xl p-8 sm:p-12 text-center space-y-4 font-mono">
          <div className="w-14 h-14 rounded-2xl bg-[#171310] text-[#E8AC4E] flex items-center justify-center mx-auto">
            <Receipt className="w-7 h-7" />
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#171310]">
            Table Ticket Reserved
          </h3>
          <p className="text-[#524438] text-xs sm:text-sm max-w-md mx-auto">
            Welcome, <strong className="text-[#171310]">{successData.name}</strong>. Your dine-in pass has been stamped for <strong>{successData.guests} guests</strong> on <strong>{successData.reservation_date}</strong> at <strong>{successData.reservation_time}</strong> ({successData.seating_type}).
          </p>
          <div className="pt-4">
            <button
              onClick={() => {
                setSuccessData(null);
                if (onCloseModal) onCloseModal();
              }}
              className="btn-ember-primary px-6 py-2.5 rounded-full text-xs font-sans font-bold"
            >
              Done / Book Another Ticket
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-[#A9865A]/30 overflow-hidden shadow-2xl bg-[#231d19]">
          
          {/* Header */}
          <div className="p-6 sm:p-8 bg-[#171310] border-b border-[#A9865A]/20 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#231d19] border border-[#A9865A]/30 text-[#E8AC4E] text-[11px] font-mono uppercase tracking-widest mb-2">
              <Flame className="w-3 h-3 text-[#D8632C]" />
              <span>Dine-In Reservation Ticket</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#F3E9D8]">
              Reserve Your <span className="italic font-normal text-[#E8AC4E]">Table Seat</span>
            </h2>
            <p className="text-[#D6C8B2] text-xs sm:text-sm mt-1 font-sans">
              Guaranteed seating with open tandoor view and ambient candlelight dining.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 font-mono text-xs">
            
            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[#D6C8B2] block mb-1">Guest Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#A9865A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white placeholder-[#A9865A]/50 focus:outline-none focus:border-[#D8632C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#D6C8B2] block mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#A9865A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white placeholder-[#A9865A]/50 focus:outline-none focus:border-[#D8632C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#D6C8B2] block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A9865A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white placeholder-[#A9865A]/50 focus:outline-none focus:border-[#D8632C]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[#D6C8B2] block mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.reservation_date}
                  onChange={(e) => setFormData({ ...formData, reservation_date: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                />
              </div>

              <div>
                <label className="text-[#D6C8B2] block mb-1">Time Slot *</label>
                <select
                  value={formData.reservation_time}
                  onChange={(e) => setFormData({ ...formData, reservation_time: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                >
                  {timeSlots.map(t => (
                    <option key={t} value={t} className="bg-[#171310]">{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#D6C8B2] block mb-1">Guests *</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#D6C8B2] block mb-2">Seating Area Stamp</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                {seatingOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setFormData({ ...formData, seating_type: opt })}
                    className={`p-2 rounded-xl text-[11px] text-center border transition-all ${
                      formData.seating_type === opt
                        ? 'bg-[#E8AC4E] text-[#171310] border-[#E8AC4E] font-bold shadow'
                        : 'bg-[#171310] border-[#A9865A]/30 text-[#D6C8B2] hover:border-[#A9865A]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#D6C8B2] block mb-1">Special Occasion / Request</label>
              <input
                type="text"
                placeholder="e.g. Birthday candlelight setup, high chair"
                value={formData.special_request}
                onChange={(e) => setFormData({ ...formData, special_request: e.target.value })}
                className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white placeholder-[#A9865A]/50 focus:outline-none focus:border-[#D8632C]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-ember-primary w-full py-3.5 rounded-full font-sans font-bold text-xs flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
              <span>Confirm Table Booking Ticket</span>
            </button>

          </form>
        </div>
      )}
    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
        <div className="relative w-full max-w-3xl my-3 sm:my-8">
          <button
            onClick={onCloseModal}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-[#171310] text-[#D6C8B2] hover:text-white border border-[#A9865A]/30"
          >
            ✕
          </button>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="reservation" className="py-24 bg-[#171310] px-4 sm:px-6 lg:px-8 border-b border-[#A9865A]/20">
      {content}
    </section>
  );
}
