import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { PageHeader } from '../../components/common/PageHeader';
import { FadeIn, FadeInStagger, FadeInStaggerItem } from '../../components/common/MotionWrapper';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Sparkles, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactPage = () => {
  const { activeRestaurant } = useTenant();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', topic: 'Table Reservation' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-[#07080c] pb-24 space-y-12">
      <PageHeader
        title="Concierge & Dining Enquiries"
        subtitle="Connect with our hospitality team for private banquet bookings, event catering, and guest assistance."
        badge="Imperial Concierge"
        breadcrumbs={[{ label: 'Contact Us' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Contact Info Cards */}
        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Helpline & Reservations', val: activeRestaurant.phone, desc: 'Available 10:00 AM – 11:30 PM', icon: Phone },
            { title: 'Concierge Email', val: activeRestaurant.email, desc: 'Guaranteed reply within 2 hours', icon: Mail },
            { title: 'Dining Address', val: activeRestaurant.address, desc: 'Valet Parking Available', icon: MapPin },
            { title: 'Operating Hours', val: activeRestaurant.openingHours, desc: 'Lunch & Dinner Slots', icon: Clock }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <FadeInStaggerItem key={idx}>
                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 h-full hover:border-amber-400/40 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">{item.title}</h4>
                  <div className="text-sm font-bold text-white leading-tight">{item.val}</div>
                  <div className="text-[10px] text-slate-500">{item.desc}</div>
                </div>
              </FadeInStaggerItem>
            );
          })}
        </FadeInStagger>

        {/* Message Form & Map Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inquiry Form */}
          <FadeIn className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">Send Us a Direct Message</h3>
              <p className="text-xs text-slate-400">Our concierge manager will reach out to you promptly.</p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-heading text-lg font-bold text-white">Message Dispatched</h4>
                <p className="text-xs text-slate-300">Thank you! Our guest relationship officer will call you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-xl">
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Enquiry Topic</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Table Reservation">VIP Table Reservation</option>
                    <option value="Private Banquet">Private Banquet & Parties</option>
                    <option value="Corporate Catering">Corporate Lunch & Catering</option>
                    <option value="Chef Degustation">Chef Degustation Tasting Inquiries</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Message & Special Needs</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Concierge Request</span>
                </button>
              </form>
            )}
          </FadeIn>

          {/* Map Simulation & Valet Info */}
          <FadeIn direction="left" className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 h-64 bg-slate-900 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80"
                  alt="Location Map Simulation"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute p-3 rounded-2xl bg-black/80 border border-amber-500/40 text-center shadow-2xl backdrop-blur-md">
                  <MapPin className="w-6 h-6 text-amber-400 mx-auto animate-bounce" />
                  <div className="text-xs font-bold text-white mt-1">{activeRestaurant.name}</div>
                  <div className="text-[10px] text-slate-400">Valet Concierge Station</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="font-bold text-white uppercase text-[10px] text-amber-400">Patron Valet Information</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Complimentary 5-star valet parking is available for all reserved guests at our grand entrance porch.
                </p>
              </div>
            </div>
          </FadeIn>

        </div>

      </div>
    </div>
  );
};
