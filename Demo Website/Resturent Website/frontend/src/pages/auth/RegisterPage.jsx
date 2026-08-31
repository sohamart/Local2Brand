import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { User, Mail, Phone, Lock, Sparkles, ArrowRight, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { activeRestaurant } = useTenant();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      register(formData);
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      navigate('/account');
    }, 600);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 py-12 relative bg-[#07080c]">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-radial-glow opacity-30 pointer-events-none -z-10" />

      <div className="w-full max-w-lg glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <Gift className="w-3.5 h-3.5" />
            <span>100 Welcome Points Included</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Join Royal Epicurean Club
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Enjoy priority table bookings, instant cashback discounts, and exclusive chef tastings at {activeRestaurant.name}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Natasha Poonawalla"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="e.g. natasha@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase">Mobile Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                placeholder="e.g. +91 98300 12345"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Create strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-brand-primary text-black font-extrabold text-xs sm:text-sm shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>Create Account & Claim 100 Pts</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/5">
          <span>Already a member? </span>
          <Link to="/login" className="text-amber-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};
