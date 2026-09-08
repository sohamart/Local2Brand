import React, { useState, useEffect, useCallback } from 'react';
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
  Lock,
  Activity,
  BarChart3,
  Cloud,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import ThemeToggle from '../../components/common/ThemeToggle';
import AshokaChakra from '../../components/common/AshokaChakra';
import DashboardLoader from '../../components/common/DashboardLoader';
import MarqueeTicker from '../../components/common/MarqueeTicker';
import NotificationBell from '../../components/common/NotificationBell';
import notificationApi from '../../services/notificationApi';


const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Central Inbox', href: '/admin/inbox', icon: Inbox },
  { label: 'Traffic & Live Analytics', href: '/admin/analytics', icon: Activity },
  { label: 'Requirement Submissions', href: '/admin/requirements', icon: Layers },
  { label: 'Cloudinary Storage', href: '/admin/media', icon: Cloud },
  { label: 'Pricing Packages', href: '/admin/pricing', icon: DollarSign },
  { label: 'Dynamic Form Builder', href: '/admin/form-builder', icon: Sliders },
  { label: 'Project Inquiries', href: '/admin/leads', icon: FileText },
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
  const [unreadCount, setUnreadCount] = useState(() => {
    try {
      return Number(localStorage.getItem('l2b_cached_unread')) || 0;
    } catch (e) {
      return 0;
    }
  });

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      if (res?.success && typeof res.unreadCount === 'number') {
        setUnreadCount(res.unreadCount);
        try {
          localStorage.setItem('l2b_cached_unread', String(res.unreadCount));
        } catch (e) {}
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);

    const handleCountUpdate = (e) => {
      if (typeof e.detail === 'number') {
        setUnreadCount(e.detail);
      } else {
        fetchUnreadCount();
      }
    };

    window.addEventListener('l2b_inbox_count_updated', handleCountUpdate);
    const handleStorage = (e) => {
      if (e.key === 'l2b_cached_unread') {
        setUnreadCount(Number(e.newValue) || 0);
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('l2b_inbox_count_updated', handleCountUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [fetchUnreadCount]);


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
      
      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity cursor-pointer"
          aria-label="Close sidebar overlay"
        />
      )}

      {/* 1. Desktop & Mobile Sidebar */}
      <aside
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className={`fixed inset-y-0 left-0 z-50 w-64 h-dvh max-h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 overflow-hidden ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
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

        {/* Navigation Items (Scrollable Area) */}
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="p-3 space-y-1 flex-1 min-h-0 overflow-y-auto modal-touch-scroll overscroll-contain"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
            Management Pipeline
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isInbox = item.href === '/admin/inbox';
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.exact}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {isInbox && unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs animate-pulse tracking-tight shrink-0">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2 shrink-0">
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
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs shrink-0 border border-slate-200 dark:border-slate-700 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs relative">
                {user?.avatar ? (
                  <img
                    key={user.avatar}
                    src={user.avatar}
                    alt={user.name || 'Admin'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.opacity = '0';
                    }}
                  />
                ) : null}
                <span className="absolute inset-0 flex items-center justify-center -z-10 font-bold">
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </span>
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
      <div className="flex-1 min-w-0 max-w-full overflow-x-hidden lg:ml-64 flex flex-col min-h-screen">

        
        {/* Admin Topbar */}
        <header className="h-14 sm:h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40">

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-300 lg:hidden border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
              <span className="hidden md:inline">LOCAL2BRAND</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden md:inline shrink-0" />
              <span className="text-purple-600 dark:text-purple-400 font-extrabold truncate">Administration</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <NotificationBell />
            <ThemeToggle showLabel={false} />
            <Link
              to="/dashboard"
              title="Switch to User Portal"
              className="hidden sm:inline-flex text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
            >
              User Portal
            </Link>

            {/* Admin Top Avatar */}
            <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl overflow-hidden shadow-xs border border-purple-500/40 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs relative shrink-0">
                {user?.avatar ? (
                  <img
                    key={user.avatar}
                    src={user.avatar}
                    alt={user.name || 'Admin'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.opacity = '0';
                    }}
                  />
                ) : null}
                <span className="absolute inset-0 flex items-center justify-center -z-10 font-bold text-xs">
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-black text-slate-900 dark:text-white block leading-none">{user?.name}</span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold uppercase">Master Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Important Updates & Live Sliding Marquee Ticker */}
        <MarqueeTicker className="w-full max-w-full shrink-0 sticky top-14 sm:top-16 z-30 shadow-2xs" />


        {/* Viewport Render Outlet */}

        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
