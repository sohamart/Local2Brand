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
  ArrowRight
} from 'lucide-react';
import { gymConfig } from './config';

export default function GymDemo({ customConfig }) {
  const config = customConfig || gymConfig;
  const [trialName, setTrialName] = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [goal, setGoal] = useState('Muscle Building & Hypertrophy');

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
      <div className="bg-[#1e0a0a] text-[#ff6b00] text-xs font-black uppercase tracking-wider py-2 px-4 text-center border-b border-[#3b1212]">
        <span>⚡ 10,000 SQ.FT POWERLIFTING & CROSSFIT FACILITY • FREE 1-DAY TRIAL PASS AVAILABLE THIS WEEK</span>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0f1318]/95 backdrop-blur-2xl border-b border-[#222a36] px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
            <a href="#trainers" className="hover:text-[#ff3b30]">Trainers</a>
            <a href="#trial" className="hover:text-[#ff3b30]">Free Trial</a>
            <a href="#location" className="hover:text-[#ff3b30]">Location</a>
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
      <header className="relative min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-8 text-center max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
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
        </div>
      </header>

      {/* Plans Section */}
      <section id="plans" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#ff3b30]">Transparent Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">Choose Your Battle Plan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between relative transition-all ${
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
      <section id="trial" className="py-16 px-4 sm:px-8 bg-[#0c1017] border-t border-[#222a36]">
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
                className="w-full px-3 py-2 rounded-xl bg-[#0a0d12] border border-[#2d3748] text-xs text-white"
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
                className="w-full px-3 py-2 rounded-xl bg-[#0a0d12] border border-[#2d3748] text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#94a3b8] mb-1">Your Fitness Goal *</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0a0d12] border border-[#2d3748] text-xs text-white"
              >
                <option value="Muscle Building & Hypertrophy">Muscle Building & Hypertrophy</option>
                <option value="Fat Loss & Body Recomposition">Fat Loss & Body Recomposition</option>
                <option value="Crossfit & Functional Endurance">Crossfit & Functional Endurance</option>
                <option value="Strength & Powerlifting">Strength & Powerlifting</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#ff3b30] text-white font-black text-xs uppercase cursor-pointer hover:bg-[#e03126] transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Claim Pass on WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 border-t border-[#222a36] text-[#64748b] text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-sm text-white block">{config.businessName}</span>
            <span>{config.address} • {config.hours}</span>
          </div>
          <span className="text-[#ff3b30] font-bold">Production Ready Template by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
