import React from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Store,
  ShieldCheck,
  UserCheck,
  ChefHat,
  Sliders,
  Eye,
  Bike
} from 'lucide-react';

export const DemoControlBar = () => {
  const { restaurants, activeRestaurant, switchTenant } = useTenant();
  const { currentUser, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (roleKey) => {
    switchRole(roleKey);
    if (roleKey === 'developer') navigate('/developer');
    else if (roleKey === 'owner') navigate('/admin');
    else if (roleKey === 'staff') navigate('/staff');
    else if (roleKey === 'rider') navigate('/rider');
    else navigate('/');
  };

  return (
    <div className="bg-[#0b0d13] border-b border-amber-500/20 text-slate-200 px-3 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 z-50 sticky top-0 backdrop-blur-md shadow-md">
      
      {/* Left: Tenant Switcher */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 font-bold text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">White-Label Client:</span>
        </span>
        <select
          value={activeRestaurant.id}
          onChange={(e) => switchTenant(e.target.value)}
          className="bg-[#141722] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors font-medium cursor-pointer"
        >
          {restaurants.map((rest) => (
            <option key={rest.id} value={rest.id}>
              {rest.name} ({rest.theme?.template || 'luxury'})
            </option>
          ))}
        </select>
      </div>

      {/* Center/Right: Role Simulation Selector & Quick Links */}
      <div className="flex items-center gap-2">
        <span className="text-slate-400 font-semibold hidden md:inline">Role View:</span>
        <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10 text-[11px]">
          <button
            onClick={() => handleRoleChange('customer')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              currentUser?.role === 'customer'
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => handleRoleChange('owner')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              currentUser?.role === 'owner'
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Owner
          </button>
          <button
            onClick={() => handleRoleChange('staff')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              currentUser?.role === 'staff'
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Chef/KDS
          </button>
          <button
            onClick={() => handleRoleChange('rider')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              currentUser?.role === 'delivery'
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🛵 Rider
          </button>
          <button
            onClick={() => handleRoleChange('developer')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              currentUser?.role === 'developer'
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SaaS Admin
          </button>
        </div>

        {/* Website Customizer Shortcut */}
        <button
          onClick={() => navigate('/customizer')}
          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-[11px] flex items-center gap-1 transition-all"
        >
          <Sliders className="w-3 h-3" />
          <span className="hidden sm:inline">Theme Customizer</span>
        </button>
      </div>

    </div>
  );
};
