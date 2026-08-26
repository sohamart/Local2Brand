import React, { useState } from 'react';
import { Sparkles, MousePointerClick, MessageSquare, Code2, CheckCircle2, Rocket, ArrowRight } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

const steps = [
  {
    step: "01",
    icon: MousePointerClick,
    title: "Choose a Design",
    description: "Browse our live demo marketplace or discuss a completely bespoke custom layout for your brand."
  },
  {
    step: "02",
    icon: MessageSquare,
    title: "Share Requirements",
    description: "Connect via WhatsApp or consultation call to share your logo, text, photos, and desired features."
  },
  {
    step: "03",
    icon: Code2,
    title: "We Build & Optimize",
    description: "Our senior design and engineering team crafts your pixel-perfect, liquid-glass website with 98+ PageSpeed."
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Review & Refine",
    description: "Test the private staging preview across mobile and desktop, and request any fine-tune adjustments."
  },
  {
    step: "05",
    icon: Rocket,
    title: "Launch & Scale",
    description: "We deploy your website to global CDN servers with SSL and connect your domain so you can start converting."
  }
];

export default function ProcessTimeline() {
  const [hoveredStep, setHoveredStep] = useState(null);

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle Ambient Section Glow */}
      <div className="section-glow section-glow-blue top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeading
          badge="Seamless 5-Step Process"
          title="From Idea to Launch."
          subtitle="A clear, transparent, and frictionless workflow engineered to get your brand online in days, not months."
        />

        {/* Timeline Desktop & Mobile */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-5 gap-6 relative">

          {/* Subtle Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-brand-200 via-purple-400 to-pink-400 -translate-y-6 z-0 rounded-full opacity-60" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            const isHovered = hoveredStep === index;

            return (
              <div
                key={item.step}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
                className={`glass-card p-6 rounded-card border transition-all duration-300 relative z-10 flex flex-col justify-between cursor-pointer ${isHovered
                    ? 'border-purple-400 shadow-glass-highlight -translate-y-3 bg-white'
                    : 'border-white/95 shadow-glass bg-white/80'
                  }`}
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-2xl font-black font-mono transition-colors ${isHovered ? 'text-purple-600' : 'text-purple-600/30'
                      }`}>
                      {item.step}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${isHovered
                        ? 'l2b-gradient-bg text-white shadow-md shadow-purple-500/30 scale-110'
                        : 'bg-purple-50 text-purple-600 border border-purple-100'
                      }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-semibold text-purple-600">
                  <span>Phase 0{index + 1}</span>
                  <span className="text-[10px] text-slate-400">Step {index + 1} of 5</span>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
