import React, { useState } from 'react';
import {
  Dumbbell,
  Flame,
  Zap,
  CheckCircle2,
  Calendar,
  Phone,
  Send,
  Trophy,
  Users,
  Target,
  Clock,
  Sparkles,
  Tag,
  Star,
  ChevronDown,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { gymConfig } from './config';

export default function GymDemo({ customConfig }) {
  const config = customConfig || gymConfig;
  const [trialName, setTrialName] = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [goal, setGoal] = useState('Muscle Building & Hypertrophy');
  const [openFaq, setOpenFaq] = useState(null);

  const handleJoinPlan = (plan) => {
    const text =
      `🏋️ *MEMBERSHIP ENROLLMENT - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🏆 *Plan Selected:* ${plan.name}\n` +
      `⏱️ *Duration:* ${plan.duration}\n` +
      `💰 *Price:* ₹${plan.price}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi Coach, I want to lock in this membership plan and schedule my induction assessment!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTrialPass = (e) => {
    e.preventDefault();
    const text =
      `🔥 *FREE 1-DAY GYM TRIAL PASS - ${config.businessName}*\n\n` +
      `👤 Name: *${trialName}*\n` +
      `📞 Phone: *${trialPhone}*\n` +
      `🎯 Primary Goal: *${goal}*\n\n` +
      `Please issue my free 1-day pass and book a slot!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-[#f0f4f8] font-sans selection:bg-[#ff3b30] selection:text-white overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#1e0a0a] text-[#ff6b00] text-xs font-black uppercase tracking-wider py-2 px-4 text-center border-b border-[#3b1212] shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span>⚡ 10,000 SQ.FT FACILITY • FREE 1-DAY TRIAL PASS WITH INBODY 570 SCAN AVAILABLE THIS WEEK</span>
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0f1318]/95 backdrop-blur-2xl border-b border-[#222a36] px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff3b30] to-[#ff6b00] text-white flex items-center justify-center font-black shadow-lg shadow-red-500/20">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-base text-white tracking-wider block leading-none">{config.businessName}</span>
              <span className="text-[10px] text-[#ff3b30] tracking-widest uppercase mt-0.5 block font-bold">{config.businessSubtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-black uppercase tracking-wider text-[#94a3b8]">
            <a href="#plans" className="hover:text-[#ff3b30]">Plans</a>
            <a href="#offers" className="hover:text-[#ff3b30]">Offers</a>
            <a href="#trainers" className="hover:text-[#ff3b30]">Trainers</a>
            <a href="#trial" className="hover:text-[#ff3b30]">Free Pass</a>
            <a href="#reviews" className="hover:text-[#ff3b30]">Reviews</a>
            <a href="#location" className="hover:text-[#ff3b30]">Gym HQ</a>
          </div>

          <a
            href="#trial"
            className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#ff3b30] to-[#ff6b00] text-white shadow-lg shadow-red-500/20"
          >
            Claim Free Pass
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Gym Facility" className="w-full h-full object-cover brightness-[0.25] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090c] via-[#07090c]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c222c] border border-[#2d3748] text-[#ff6b00] text-xs font-black uppercase tracking-widest shadow-xl">
            <Flame className="w-3.5 h-3.5 text-[#ff3b30] animate-pulse" />
            <span>Unleash Your Ultimate Physical Potential</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none">
            Build Iron Discipline. <span className="bg-gradient-to-r from-[#ff3b30] via-[#ff6b00] to-[#ffaa00] bg-clip-text text-transparent">Zero Excuses.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#94a3b8] max-w-xl mx-auto leading-relaxed font-medium">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#plans"
              className="px-7 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#ff3b30] to-[#ff6b00] text-white shadow-xl shadow-red-500/25"
            >
              View Membership Rates
            </a>
            <a
              href="#trial"
              className="px-7 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#141a22] text-white border border-[#2d3748] hover:bg-[#1c222c]"
            >
              Get Free 1-Day Trial
            </a>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-xs text-[#94a3b8]">
            <div className="p-3 rounded-2xl bg-[#141a22] border border-[#2d3748]">
              <span className="block font-black text-white text-sm">10,000 Sq.Ft</span>
              <span className="text-[11px]">Dual-Floor Workout Zone</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141a22] border border-[#2d3748]">
              <span className="block font-black text-white text-sm">Rogue & Eleiko</span>
              <span className="text-[11px]">Imported Competition Barbells</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141a22] border border-[#2d3748]">
              <span className="block font-black text-white text-sm">Steam & Sauna</span>
              <span className="text-[11px]">Ice Bath Recovery Suites</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141a22] border border-[#2d3748]">
              <span className="block font-black text-white text-sm">IFBB Certified</span>
              <span className="text-[11px]">Personal Transformation Coaches</span>
            </div>
          </div>
        </div>
      </header>

      {/* Promo Offers Bar */}
      <section id="offers" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-5 sm:p-6 rounded-3xl bg-[#181113] border border-[#3b1c22] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#ff3b30]/20 border border-[#ff3b30]/50 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-[#ff3b30]" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#ff3b30]">Seasonal Transformation Deal</span>
              <h3 className="text-base sm:text-lg font-bold text-white">Save 20% on Annual Memberships!</h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {config.activeCoupons.map((c) => (
              <div key={c.code} className="px-4 py-2 rounded-2xl bg-[#07090c] border border-dashed border-[#ff3b30]/60 flex items-center gap-3">
                <div>
                  <span className="font-mono font-black text-[#ff3b30] text-xs block">{c.code}</span>
                  <span className="text-[10px] text-[#94a3b8]">{c.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section id="plans" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#ff3b30]">Transparent Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">Choose Your Battle Plan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-7 rounded-3xl border flex flex-col justify-between relative transition-all ${
                plan.popular
                  ? 'bg-gradient-to-b from-[#1c1316] to-[#12161f] border-[#ff3b30] shadow-2xl shadow-red-500/10 scale-105'
                  : 'bg-[#12161f] border-[#222a36]'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#ff3b30] text-white text-[10px] font-black uppercase tracking-widest shadow-md">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-white">{plan.name}</h3>
                  <span className="text-xs font-bold text-[#94a3b8]">{plan.duration}</span>
                </div>

                <div className="text-3xl font-black text-white">
                  ₹{plan.price.toLocaleString('en-IN')}
                </div>

                <div className="space-y-2 pt-2 text-xs text-[#cbd5e1]">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#ff3b30] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleJoinPlan(plan)}
                className={`mt-6 w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  plan.popular
                    ? 'bg-[#ff3b30] hover:bg-[#e03126] text-white shadow-lg'
                    : 'bg-[#1c2430] hover:bg-[#ff3b30] text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Join Plan on WhatsApp</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Free Trial Form */}
      <section id="trial" className="py-20 px-4 sm:px-8 bg-[#0c1017] border-y border-[#222a36]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#ff3b30]">Zero Commitment</span>
            <h2 className="text-3xl font-black text-white uppercase">Experience IronCore for 1 Day Free</h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              Workout on all equipment, test out our steam and recovery zones, and get an instant body fat composition scan from our head coaches.
            </p>
          </div>

          <form onSubmit={handleTrialPass} className="p-6 rounded-3xl bg-[#141a24] border border-[#2d3748] space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#94a3b8] mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Aryan Roy"
                value={trialName}
                onChange={(e) => setTrialName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0a0d12] border border-[#2d3748] text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#94a3b8] mb-1">WhatsApp Phone *</label>
              <input
                type="tel"
                required
                placeholder="+91 98765..."
                value={trialPhone}
                onChange={(e) => setTrialPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0a0d12] border border-[#2d3748] text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#94a3b8] mb-1">Your Fitness Goal *</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0a0d12] border border-[#2d3748] text-xs text-white"
              >
                <option value="Muscle Building & Hypertrophy">Muscle Building & Hypertrophy</option>
                <option value="Fat Loss & Body Recomposition">Fat Loss & Body Recomposition</option>
                <option value="Crossfit & Functional Endurance">Crossfit & Functional Endurance</option>
                <option value="Strength & Powerlifting">Strength & Powerlifting</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#ff3b30] text-white font-black text-xs uppercase cursor-pointer hover:bg-[#e03126] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-red-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Claim Pass on WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-[#ff3b30]">Member Transformations</span>
          <h2 className="text-3xl font-black text-white uppercase">Real People. Real Results.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#12161f] border border-[#222a36] space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, r) => <Star key={r} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-[#cbd5e1] italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#222a36]">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-[#ff3b30]/40" />
                <div>
                  <span className="font-bold text-xs text-white block">{t.name}</span>
                  <span className="text-[10px] text-[#ff3b30]">{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-[#ff3b30]">Questions</span>
          <h2 className="text-3xl font-black text-white uppercase">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {config.faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl bg-[#12161f] border border-[#222a36] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#ff3b30] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-[#94a3b8] leading-relaxed border-t border-[#222a36] pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 bg-[#05070a] border-t border-[#222a36] text-[#64748b] text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <span className="font-bold text-base text-white block">{config.businessName}</span>
            <p className="text-xs">{config.tagline}</p>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Gym Location</span>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#ff3b30] shrink-0 mt-0.5" />
              <span>{config.address}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Workout Hours</span>
            <div>Weekdays: {config.hours.weekdays}</div>
            <div>Sunday: {config.hours.sunday}</div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">WhatsApp Support</span>
            <a
              href={`https://wa.me/${config.whatsapp}`}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff3b30] to-[#ff6b00] text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp: {config.phone}</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#222a36] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {config.businessName}. All rights reserved.</span>
          <span className="text-[#ff3b30] font-bold">Production Ready Platform by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
