import React from 'react';
import { useTenant } from '../../context/TenantContext';
import { PageHeader } from '../../components/common/PageHeader';
import { FadeIn, FadeInStagger, FadeInStaggerItem } from '../../components/common/MotionWrapper';
import { Award, Flame, Sparkles, Heart, ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StoryPage = () => {
  const { activeRestaurant } = useTenant();

  const timeline = [
    { year: '1976', title: 'The Royal Khansama Hearth', desc: 'Founded in Old Delhi with three sacred copper handis, reviving 200-year-old royal Awadhi palace recipes.' },
    { year: '1995', title: 'Michelin Connoisseur Recognition', desc: 'Honored by international culinary guilds for maintaining unmatched authenticity in dum biryani infusions.' },
    { year: '2015', title: 'Modern Heritage Ambiance', desc: 'Expanded into grand luxury dining halls, introducing crystal glass lounges and personalized silver-service.' },
    { year: '2026', title: 'GourmetOS Multi-Tenant Evolution', desc: 'Pioneering seamless cloud-order telemetry, digital culinary customizers, and high-fidelity gourmet delivery.' }
  ];

  return (
    <div className="min-h-screen bg-[#07080c] pb-24 space-y-16">
      <PageHeader
        title="Our Culinary Heritage & Five Decades of Mastery"
        subtitle="A sacred dedication to ancestral recipes, hand-ground heirloom spices, and time-honored charcoal hearth cooking."
        badge="Imperial Heritage"
        breadcrumbs={[{ label: 'Our Story' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Core Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              The Genesis
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Where Imperial Gastronomy Meets Modern Elegance
            </h2>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              At {activeRestaurant.name}, we believe dining is not merely sustenance—it is an opulent multisensory ceremony. Every marinade is aged for 24 hours in stone pestles; every biryani is sealed with whole wheat dough over fragrant babool embers.
            </p>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              From Kashmir’s high-altitude saffron blossoms to Malabar’s sun-dried tellicherry peppercorns, our chefs traverse the country to source unmatched ingredients directly from generational farming estates.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-2xl font-bold font-heading text-amber-400">50+ Years</div>
                <div className="text-xs text-slate-400">Unbroken Heritage</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-2xl font-bold font-heading text-white">100% Pure</div>
                <div className="text-xs text-slate-400">Zero Additives</div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" className="relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1000&auto=format&fit=crop&q=80"
                alt="Executive Head Chef"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Executive Culinary Director</div>
                <div className="font-heading text-xl font-bold">Ustad Farooq & Master Khansamas</div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Philosophy</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white">The Four Sacred Pillars</h2>
          </div>

          <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Heirloom Spices', desc: 'Direct-trade saffron, mace, wild green cardamom, and stone-ground spices.', icon: Sparkles },
              { title: 'Charcoal Hearth Dum', desc: 'Slow handi cooking over charcoal for hours to lock in moisture and deep aromatics.', icon: Flame },
              { title: 'Pure A2 Cow Ghee', desc: 'Traditional bilona churned golden butter providing unmatched unctuousness.', icon: Award },
              { title: 'Silver Service', desc: 'Royal Mughal hospitality honoring every patron as an imperial guest.', icon: Heart }
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <FadeInStaggerItem key={idx}>
                  <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 h-full hover:border-amber-400/40 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-white">{p.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                </FadeInStaggerItem>
              );
            })}
          </FadeInStagger>
        </div>

        {/* Heritage Timeline */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Chronicle</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white">Five Decades of Excellence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 relative overflow-hidden">
                  <div className="font-heading text-3xl font-extrabold text-gradient-gold">{item.year}</div>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <FadeIn>
          <div className="glass-panel-gold p-8 sm:p-12 rounded-3xl border border-amber-500/40 text-center space-y-6 shadow-2xl">
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white max-w-xl mx-auto">
              Join Us for an Unforgettable Dining Journey
            </h2>
            <div className="flex justify-center gap-4">
              <Link
                to="/reserve"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-brand-primary text-black font-bold text-xs shadow-gold-glow hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span>Reserve Royal Banquet Table</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
};
