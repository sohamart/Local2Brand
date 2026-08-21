import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Demos', path: '/demos' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 transition-all duration-300 rounded-full nav-capsule py-3.5`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Local2Brand
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-200/40 dark:bg-slate-900/40 p-1.5 rounded-full border border-slate-350/20 dark:border-white/5 relative">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 z-10 ${
                    isActive
                      ? 'text-black dark:text-black'
                      : 'text-slate-700 dark:text-slate-300 hover:text-yellow-600 dark:hover:text-yellow-400'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-yellow-400 dark:bg-yellow-400 rounded-full -z-10 shadow-lg shadow-yellow-500/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={user.role === 'USER' ? '/dashboard' : '/admin'}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-350 hover:border-yellow-500/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-full text-red-500 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-650 dark:text-slate-300 hover:text-yellow-600 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/start-project"
                  className="relative group overflow-hidden px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-xs font-bold text-black transition-all duration-300 shadow-md shadow-yellow-500/20 hover:shadow-yellow-500/35"
                >
                  <span className="flex items-center gap-1.5">
                    Start Your Project
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburguer Button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[75px] left-1/2 -translate-x-1/2 w-[92%] z-45 glass-panel border border-slate-250 dark:border-white/5 flex flex-col p-6 lg:hidden"
          >
            <div className="flex flex-col gap-6 my-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-xl font-bold text-slate-800 dark:text-slate-200 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-4 border-t border-slate-200 dark:border-white/5 pt-6">
              {user ? (
                <>
                  <Link
                    to={user.role === 'USER' ? '/dashboard' : '/admin'}
                    className="w-full text-center py-3.5 rounded-xl bg-slate-100 border border-slate-300 dark:bg-slate-900 dark:border-white/10 font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full py-3.5 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center py-3.5 rounded-xl bg-slate-100 border border-slate-300 dark:bg-slate-900 dark:border-white/10 font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/start-project"
                    className="w-full text-center py-3.5 rounded-xl bg-yellow-400 font-bold text-black shadow-lg shadow-yellow-500/10"
                  >
                    Start Your Project
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
