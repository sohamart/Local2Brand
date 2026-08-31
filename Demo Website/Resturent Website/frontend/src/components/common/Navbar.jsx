import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingBag,
  Calendar,
  Sparkles,
  Menu as MenuIcon,
  X,
  User,
  Search,
  Award,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  ChefHat,
  ShieldCheck,
  LogIn,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { activeRestaurant } = useTenant();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Specials', path: '/specials' },
    { name: 'Our Story', path: '/story' },
    { name: 'Offers', path: '/offers' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Reserve', path: '/reserve' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const getRoleDashboardLink = () => {
    if (currentUser?.role === 'developer') return { path: '/developer', label: 'SaaS Platform', icon: ShieldCheck };
    if (currentUser?.role === 'owner') return { path: '/admin', label: 'Owner Dashboard', icon: LayoutDashboard };
    if (currentUser?.role === 'staff') return { path: '/staff', label: 'Kitchen KDS', icon: ChefHat };
    return { path: '/account', label: 'My Account', icon: User };
  };

  const dashLink = getRoleDashboardLink();
  const DashIcon = dashLink.icon;

  return (
    <header
      className={`sticky top-[45px] z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#07080c]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3'
          : 'bg-gradient-to-b from-[#07080c]/80 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-white/20 p-0.5 shadow-lg group-hover:border-amber-400/50 transition-all duration-300">
              <img
                src={activeRestaurant.logo}
                alt={activeRestaurant.name}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-all"
              />
            </div>
            <div className="absolute -inset-1 bg-brand-primary/20 rounded-xl blur-sm -z-10 group-hover:bg-amber-400/30 transition-all" />
          </div>

          <div>
            <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
              {activeRestaurant.name}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">{activeRestaurant.tagline}</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-semibold uppercase tracking-wider transition-all duration-200 relative py-1 ${
                  isActive
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-brand-primary rounded-full shadow-glass-glow" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Table Booking, Cart & Auth Profile */}
        <div className="flex items-center gap-3">
          
          {/* Book Table Button */}
          <Link
            to="/reserve"
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-200 hover:border-amber-400/40"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Book Table</span>
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 text-white transition-all group shadow-glass-glow"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-primary text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0c0e14] shadow-md animate-bounce">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* User Auth Dropdown or Sign In CTA */}
          {isAuthenticated && currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold leading-none truncate max-w-[90px]">{currentUser.name?.split(' ')[0]}</div>
                  <div className="text-[10px] text-amber-400 capitalize mt-0.5">{currentUser.role}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 glass-dropdown rounded-2xl p-2 shadow-2xl z-50 border border-white/15 animate-in fade-in zoom-in-95 space-y-1">
                  <div className="px-3 py-2 border-b border-white/10">
                    <div className="font-bold text-white text-xs truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[9px] uppercase">
                      {currentUser.role}
                    </span>
                  </div>

                  <Link
                    to={dashLink.path}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <DashIcon className="w-4 h-4 text-amber-400" />
                    <span>{dashLink.label}</span>
                  </Link>

                  {currentUser.role === 'customer' && (
                    <Link
                      to="/favorites"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-all"
                    >
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>Saved Favorites</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all border-t border-white/5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-90 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden glass-dropdown border-b border-white/10 px-4 py-5 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <Link
              to="/reserve"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Table</span>
            </Link>
            <Link
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/30 text-brand-primary font-semibold text-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Menu</span>
            </Link>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white text-xs font-semibold uppercase tracking-wider"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            {isAuthenticated && currentUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-bold text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({currentUser.name})</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-bold text-amber-400"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
