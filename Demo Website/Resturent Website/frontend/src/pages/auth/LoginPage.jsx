import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { DEMO_USERS } from '../../data/mockData';
import {
  ShieldCheck,
  Building2,
  ChefHat,
  User,
  Bike,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LoginPage = () => {
  const { login } = useAuth();
  const { activeRestaurant } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer', 'owner', 'staff', 'rider', 'developer'
  const [email, setEmail] = useState(DEMO_USERS.customer.email);
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleConfigs = {
    customer: {
      title: 'Customer Connoisseur Portal',
      subtitle: 'Track live orders, view delivery OTP, and redeem loyalty rewards.',
      icon: User,
      badge: 'Gourmet Patron',
      badgeColor: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
      redirect: '/account',
      defaultEmail: DEMO_USERS.customer.email
    },
    owner: {
      title: 'Restaurant Owner & Admin',
      subtitle: 'Access executive telemetry, live orders, menu builder, and revenue analytics.',
      icon: Building2,
      badge: 'Restaurant Manager',
      badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/15',
      redirect: '/admin',
      defaultEmail: DEMO_USERS.owner.email
    },
    staff: {
      title: 'Kitchen Staff & Chef Station',
      subtitle: 'Real-time kitchen order tickets (KDS), dish notes, and delivery boy registration.',
      icon: ChefHat,
      badge: 'Executive Kitchen',
      badgeColor: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/15',
      redirect: '/staff',
      defaultEmail: DEMO_USERS.staff.email
    },
    rider: {
      title: 'Delivery Valet & Rider App',
      subtitle: 'Grab newly prepared kitchen orders, turn-by-turn navigation, and OTP verification.',
      icon: Bike,
      badge: 'Delivery Valet',
      badgeColor: 'text-blue-300 border-blue-500/40 bg-blue-500/15',
      redirect: '/rider',
      defaultEmail: DEMO_USERS.rider.email
    },
    developer: {
      title: 'SaaS Platform Developer',
      subtitle: 'Multi-tenant instance provisioning, domain resolution, and platform health.',
      icon: ShieldCheck,
      badge: 'Super Admin',
      badgeColor: 'text-purple-300 border-purple-500/40 bg-purple-500/20',
      redirect: '/developer',
      defaultEmail: DEMO_USERS.developer.email
    }
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setEmail(roleConfigs[roleKey].defaultEmail);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      login(selectedRole);
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      const destination = location.state?.from || roleConfigs[selectedRole].redirect;
      navigate(destination);
    }, 600);
  };

  const currentConfig = roleConfigs[selectedRole];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 py-12 relative bg-[#07080c]">
      
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-radial-glow opacity-30 pointer-events-none -z-10" />

      <div className="w-full max-w-2xl glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${currentConfig.badgeColor}`}>
            <CurrentIcon className="w-3.5 h-3.5" />
            <span>{currentConfig.badge}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            {currentConfig.title}
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {currentConfig.subtitle}
          </p>
        </div>

        {/* 5 Role Selector Buttons (1-Click Demo Switcher) */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            Select Role to Login
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { key: 'customer', label: 'Customer', icon: User },
              { key: 'owner', label: 'Owner Admin', icon: Building2 },
              { key: 'staff', label: 'Kitchen Chef', icon: ChefHat },
              { key: 'rider', label: 'Delivery Boy', icon: Bike },
              { key: 'developer', label: 'Super Admin', icon: ShieldCheck }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleRoleSelect(key)}
                className={`py-2.5 px-2 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  selectedRole === key
                    ? 'bg-amber-500 text-black border-amber-300 shadow-gold-glow scale-102'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs pt-2">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-slate-300 uppercase">Password</label>
              <span className="text-[10px] text-amber-400 hover:underline cursor-pointer">Forgot password?</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-brand-primary text-black font-extrabold text-xs sm:text-sm shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <span>Sign In as {currentConfig.badge}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/5">
          <span>Don't have a connoisseur account? </span>
          <Link to="/register" className="text-amber-400 font-bold hover:underline">
            Register for 100 Bonus Points
          </Link>
        </div>

      </div>

    </div>
  );
};
