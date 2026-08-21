import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, CheckCircle, ArrowRight, Laptop, MessageSquare, Rocket, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Choose & Configure',
      desc: 'Browse our visual showcase templates or submit a bespoke design request outlining your target industry.',
      icon: Laptop,
      color: 'from-yellow-500/20 to-amber-500/10',
    },
    {
      num: '02',
      title: 'Briefing & Requirements',
      desc: 'We host a quick requirement sync where you share logo assets, text details, and specific operational inputs (like menus or bookings).',
      icon: MessageSquare,
      color: 'from-amber-500/20 to-yellow-500/10',
    },
    {
      num: '03',
      title: 'Development & Checkpoint',
      desc: 'Our dev team sets up code structure, optimizes imagery, and builds responsiveness. Track every line and page stage status via your live dashboard.',
      icon: Sparkles,
      color: 'from-purple-500/20 to-pink-500/10',
    },
    {
      num: '04',
      title: 'Testing & Launch',
      desc: 'Review final layouts on simulated mobile devices, approve payment milestones, link your custom domain, and launch!',
      icon: Rocket,
      color: 'from-pink-500/20 to-blue-500/10',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 text-xs font-semibold uppercase tracking-wider">
          <Layers size={13} />
          Launch Guidelines
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
          Our Seamless Workflow Process
        </h1>
        <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed">
          From selecting a layout configuration to completing your deployment DNS mappings, we have eliminated the technical headache.
        </p>
      </div>

      {/* Grid Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.num}
              whileHover={{ y: -4 }}
              className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-6 text-left flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${step.color} border border-white/5 flex items-center justify-center`}>
                  <Icon size={20} className="text-yellow-500" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider">STEP {step.num}</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                </div>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-semibold mt-4">
                <CheckCircle size={13} />
                Client visible checks
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA section */}
      <div className="text-center pt-8">
        <Link
          to="/start-project"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-sm font-bold text-black transition-all shadow-md shadow-yellow-500/10"
        >
          Initialize Your Setup Today
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default HowItWorks;
