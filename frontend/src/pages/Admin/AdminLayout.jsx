import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  PhoneCall,
  Settings,
  Sliders,
  Users,
  Grid,
  Sparkles,
  LogOut,
  ChevronRight,
  Shield,
  Menu,
  X,
  ExternalLink,
  Layers,
  Send,
  Star,
  DollarSign,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import ThemeToggle from '../../components/common/ThemeToggle';
import AshokaChakra from '../../components/common/AshokaChakra';
import DashboardLoader from '../../components/common/DashboardLoader';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Requirement Submissions', href: '/admin/requirements', icon: Layers },
  { label: 'Pricing Packages', href: '/admin/pricing', icon: DollarSign },
  { label: 'Dynamic Form Builder', href: '/admin/form-builder', icon: Sliders },
  { label: 'Project Inquiries', href: '/admin/leads', icon: Inbox },
  { label: 'Callback Requests', href: '/admin/callbacks', icon: PhoneCall },
  { label: 'Client Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Site Customizer', href: '/admin/settings', icon: Settings },
  { label: 'Services CMS', href: '/admin/services', icon: Grid },
  { label: 'Demos / Templates', href: '/admin/demos', icon: Sparkles },
  { label: 'Mass Email Broadcast', href: '/admin/broadcast', icon: Send },
  { label: 'User Directory', href: '/admin/users', icon: Users },
];

export default function AdminLayout() {
  const { user, logout, isAdmin, loading, openAuthModal } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center">
        <DashboardLoader
          title="Verifying Admin Privileges..."
          role="admin"
        />
      </div>
    );
  }

  // If not admin, protect route
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen pt-36 px-4 text-center space-y-5 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 border border-purple-200 dark:border-purple-800 flex items-center justify-center mx-auto shadow-md">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Access Restricted</h1>
          <p className="text-xs text-slate-500">
            You must be logged in with an authorized Administrator account to access the Master Management Portal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In with Admin Credentials</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100/70 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. Desktop & Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white leading-none">
                LOCAL<span className="l2b-gradient-text">2</span>BRAND
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                Master Admin
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
            Management Pipeline
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.exact}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>View Live Website</span>
            </span>
            <AshokaChakra size={12} />
          </Link>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs shrink-0 border border-slate-200 dark:border-slate-700 bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                {user?.avatar ? (
                  <img
                    key={user.avatar}
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span>{user?.name ? user.name[0].toUpperCase() : 'A'}</span>
                )}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold block truncate">{user.name}</span>
                <span className="text-[10px] text-slate-400 block truncate">{user.email}</span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log Out"
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Admin Topbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 lg:hidden border border-slate-200 dark:border-slate-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="hidden sm:inline">LOCAL2BRAND</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <span className="text-purple-600 dark:text-purple-400 font-extrabold">Administration</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle showLabel={false} />
            <Link
              to="/dashboard"
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors"
            >
              User Portal
            </Link>

            {/* Admin Top Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-purple-500/40 bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                {user?.avatar ? (
                  <img
                    key={user.avatar}
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span>{user?.name ? user.name[0].toUpperCase() : 'A'}</span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-black text-slate-900 dark:text-white block leading-none">{user.name}</span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold uppercase">Master Admin</span>
              </div>
            </div>
          </div>
        </header>


        {/* Viewport Render Outlet */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
