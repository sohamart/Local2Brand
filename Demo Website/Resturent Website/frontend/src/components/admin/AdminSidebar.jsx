import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Calendar,
  Tag,
  TrendingUp,
  Sliders,
  Settings,
  Store,
  ChefHat,
  ChevronRight
} from 'lucide-react';

export const AdminSidebar = () => {
  const { activeRestaurant } = useTenant();

  const links = [
    { to: '/admin', label: 'Executive Pulse', icon: LayoutDashboard, end: true },
    { to: '/admin/orders', label: 'Orders Pipeline', icon: ShoppingBag },
    { to: '/admin/products', label: 'Menu & Variants', icon: UtensilsCrossed },
    { to: '/admin/tables', label: 'Tables & Bookings', icon: Calendar },
    { to: '/admin/coupons', label: 'Coupons & Promos', icon: Tag },
    { to: '/admin/analytics', label: 'Deep Analytics', icon: TrendingUp },
    { to: '/admin/settings', label: 'Restaurant Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0c13] border-r border-white/10 p-5 flex flex-col justify-between h-[calc(100vh-45px)] sticky top-[45px] shrink-0 overflow-y-auto hidden lg:flex">
      <div className="space-y-6">
        
        {/* Restaurant Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
          <img
            src={activeRestaurant.logo}
            alt={activeRestaurant.name}
            className="w-10 h-10 rounded-xl object-cover border border-white/20"
          />
          <div className="min-w-0">
            <div className="font-heading font-bold text-white text-xs truncate">{activeRestaurant.name}</div>
            <div className="text-[10px] text-amber-400 font-medium">Owner Management</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-black font-bold shadow-gold-glow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Quick Launch Short-cuts */}
      <div className="pt-6 border-t border-white/10 space-y-2">
        <Link
          to="/customizer"
          className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Launch Customizer</span>
        </Link>
        <Link
          to="/staff"
          className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
        >
          <ChefHat className="w-3.5 h-3.5" />
          <span>Open Kitchen KDS</span>
        </Link>
      </div>
    </aside>
  );
};
