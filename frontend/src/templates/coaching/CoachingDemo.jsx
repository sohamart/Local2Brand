import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
  Phone,
  Send,
  CheckCircle2,
  Users,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { coachingConfig } from './config';

export default function CoachingDemo({ customConfig }) {
  const config = customConfig || coachingConfig;

  const [demoClass, setDemoClass] = useState({
    studentName: '',
    parentPhone: '',
    grade: 'Class 11',
    stream: 'JEE (Main & Advanced)'
  });

  const handleEnroll = (batch) => {
    const text =
      `🎓 *BATCH ENROLLMENT INQUIRY - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📚 *Program:* ${batch.name}\n` +
      `🎯 *Target:* ${batch.target}\n` +
      `💰 *Fee:* ${batch.fee}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi Academic Counsellor, I want to inquire about scholarship test discounts and enroll in this batch!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDemoClass = (e) => {
    e.preventDefault();
    const text =
      `📖 *FREE DEMO CLASS BOOKING - ${config.businessName}*\n\n` +
      `👤 Student Name: *${demoClass.studentName}*\n` +
      `📞 Parent/Student WhatsApp: *${demoClass.parentPhone}*\n` +
      `🎒 Class/Grade: *${demoClass.grade}*\n` +
      `🎯 Target Exam: *${demoClass.stream}*\n\n` +
      `Please schedule our free 3-day demo lectures and share study material booklet!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#070e18] text-[#f1f5f9] font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#0b1a2e] text-blue-300 text-xs font-bold py-2 px-4 text-center border-b border-[#143054]">
        <span>🏆 84% SELECTION RATE IN JEE ADVANCED & NEET 2025 • UP TO 90% SCHOLARSHIP ADMISSION TEST OPEN</span>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0b1626]/95 backdrop-blur-2xl border-b border-blue-900/40 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-600/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-white block leading-none">{config.businessName}</span>
              <span className="text-[10px] text-blue-400 tracking-wider uppercase mt-0.5 block font-bold">{config.businessSubtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#batches" className="hover:text-blue-400">Batches</a>
            <a href="#demo" className="hover:text-blue-400">Free Demo Class</a>
            <a href="#location" className="hover:text-blue-400">Campus</a>
          </div>

          <a
            href="#demo"
            className="px-4 py-2 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md"
          >
            Book Free Demo Class
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-[75vh] flex items-center justify-center py-16 px-4 text-center">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Coaching Academy" className="w-full h-full object-cover brightness-[0.25]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070e18] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-5">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#132a4a] text-blue-300 border border-[#21477d] inline-flex items-center gap-1.5 shadow-xl">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Kota Master Mentors • Proven AIR Top 100 Ranks</span>
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Crack JEE & NEET with <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">Strategic Concept Mastery</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#batches"
              className="px-7 py-3 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/25"
            >
              Explore Course Batches
            </a>
            <a
              href="#demo"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#11233d] text-white border border-blue-800 hover:bg-[#183257]"
            >
              Attend 3-Day Free Demo
            </a>
          </div>
        </div>
      </header>

      {/* Batches Grid */}
      <section id="batches" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Structured Academic Roadmap</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Target Batches for 2026-27</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.batches.map((b) => (
            <div
              key={b.id}
              className={`p-7 rounded-3xl border flex flex-col justify-between relative transition-all ${
                b.popular
                  ? 'bg-gradient-to-b from-[#13233a] to-[#0d1726] border-blue-500 shadow-2xl shadow-blue-600/10 scale-105'
                  : 'bg-[#0f1b2e] border-blue-950'
              }`}
            >
              {b.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-md">
                  Most Enrolled
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-white">{b.name}</h3>
                  <span className="text-xs text-blue-300 font-semibold">{b.target} • {b.duration}</span>
                </div>

                <div className="text-2xl font-black text-white">{b.fee}</div>

                <div className="space-y-2 pt-2 text-xs text-slate-300">
                  {b.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleEnroll(b)}
                className="mt-6 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enroll / Inquire on WhatsApp</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Free Demo Class Form */}
      <section id="demo" className="py-16 px-4 sm:px-8 bg-[#091322] border-t border-blue-950">
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#112138] border border-blue-900/60 space-y-4">
          <h3 className="font-bold text-xl text-white">Register for Free 3-Day Demo Lectures</h3>
          <form onSubmit={handleDemoClass} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Student Full Name *"
              value={demoClass.studentName}
              onChange={(e) => setDemoClass({ ...demoClass, studentName: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#091322] border border-blue-900 text-xs text-white"
            />
            <input
              type="tel"
              required
              placeholder="Parent WhatsApp Phone *"
              value={demoClass.parentPhone}
              onChange={(e) => setDemoClass({ ...demoClass, parentPhone: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#091322] border border-blue-900 text-xs text-white"
            />
            <select
              value={demoClass.stream}
              onChange={(e) => setDemoClass({ ...demoClass, stream: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-[#091322] border border-blue-900 text-xs text-white"
            >
              <option value="IIT-JEE Main & Advanced">IIT-JEE Main & Advanced</option>
              <option value="NEET-UG Medical">NEET-UG Medical</option>
              <option value="Class 9/10 Foundation">Class 9/10 Foundation</option>
            </select>
            <button
              type="submit"
              className="sm:col-span-2 md:col-span-3 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Claim Free Demo Seat on WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 border-t border-blue-950 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-sm text-white block">{config.businessName}</span>
            <span>{config.address} • {config.hours}</span>
          </div>
          <span className="text-blue-400 font-bold">Production Ready Template by LOCAL2BRAND</span>
        </div>
      </footer>

    </div>
  );
}
