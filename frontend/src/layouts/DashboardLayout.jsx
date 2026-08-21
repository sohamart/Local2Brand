import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Bell,
  FileCode,
  FileSpreadsheet,
  User,
  LogOut,
  Menu,
  X,
  Database,
  Briefcase,
  Users,
  Settings,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

  // Links for client
  const clientLinks = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
    { name: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { name: 'Files', path: '/dashboard/files', icon: FileCode },
    { name: 'Invoices', path: '/dashboard/invoices', icon: FileSpreadsheet },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  // Links for admin
  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Project Requests', path: '/admin/requests', icon: HelpCircle },
    { name: 'Clients', path: '/admin/clients', icon: Users },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Demos Marketplace', path: '/admin/demos', icon: Database },
    { name: 'Portfolio manager', path: '/admin/portfolio', icon: Briefcase },
    { name: 'Invoices dispatcher', path: '/admin/invoices', icon: FileSpreadsheet },
    { name: 'Leads manager', path: '/admin/leads', icon: Settings },
  ];

  const activeLinks = isAdmin ? adminLinks : clientLinks;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07080e] text-slate-800 dark:text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0d0e15] fixed top-0 bottom-0 left-0 z-30">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Local2Brand
          </Link>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-semibold uppercase tracking-wider">
            {user.role}
          </span>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {activeLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-yellow-500/10 text-yellow-650 dark:text-yellow-400 border-l-2 border-yellow-500 pl-3.5'
                    : 'text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer profile & logout */}
        <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0a0b10] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-black shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Topbar */}
        <header className="h-16 px-6 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0d0e15]/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg border border-slate-250 dark:border-white/10 text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white lg:hidden cursor-pointer"
            >
              <Menu size={18} />
            </button>
            <h2 className="text-base font-semibold tracking-tight text-slate-950 dark:text-white">
              {isAdmin ? 'Admin Console' : 'Client Hub'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to={isAdmin ? '/admin' : '/dashboard'}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-250 dark:bg-slate-900 dark:border-white/5 text-slate-700 dark:text-slate-350 hover:text-slate-950 dark:hover:text-white"
            >
              Dashboard Home
            </Link>
          </div>
        </header>

        {/* Dashboard Pages */}
        <main className="flex-grow p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 bottom-0 left-0 w-64 z-50 bg-white dark:bg-[#0d0e15] border-r border-slate-200 dark:border-white/5 flex flex-col lg:hidden"
            >
              <div className="h-16 px-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Local2Brand
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {activeLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-yellow-500/10 text-yellow-650 dark:text-yellow-400 border-l-2 border-yellow-500 pl-3.5'
                          : 'text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
                      }`}
                    >
                      <Icon size={18} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0a0b10] flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-black">
                    {user.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{user.name}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-red-400"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
