import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ShoppingBag, 
  User, 
  Phone, 
  MessageSquare, 
  Compass, 
  Calendar, 
  Star, 
  ShieldCheck, 
  Menu as MenuIcon, 
  X,
  Receipt,
  Search,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

export default function Navbar({ 
  onOpenAuth, 
  onOpenProfile, 
  onOpenTracker, 
  onOpenReservation,
  onOpenAdmin
}) {
  const { user, isAdmin, logout } = useAuth();
  const { totalItemCount, openCart } = useCart();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ticketInput, setTicketInput] = useState('');
  const [showTrackInput, setShowTrackInput] = useState(false);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (ticketInput.trim()) {
      onOpenTracker(ticketInput.trim());
      setTicketInput('');
      setShowTrackInput(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#171310]/95 backdrop-blur-md border-b border-[#A9865A]/20 transition-all">
      
      {/* Top Smoke Status Bar */}
      <div className="bg-[#0f0c0a] text-[#D6C8B2] text-[10px] sm:text-xs py-1.5 px-3 sm:px-6 border-b border-[#A9865A]/10 flex items-center justify-between font-mono overflow-hidden">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D8632C] shadow-[0_0_8px_#D8632C] animate-pulse shrink-0"></span>
          <span className="text-[#E8AC4E] font-medium tracking-wide truncate">TANDOOR FIRED • 30-MIN DISPATCH</span>
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <span className="text-[#A9865A]">PROMO:</span>
          <span className="bg-[#231d19] text-[#F3E9D8] px-2 py-0.5 rounded border border-[#A9865A]/30 font-bold text-[11px]">
            WELCOME50
          </span>
          <span className="text-[#92b584] font-medium">(15% OFF)</span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 text-[#A9865A] shrink-0 font-sans sm:font-mono">
          <a 
            href={`tel:${settings.phone}`} 
            className="hidden sm:flex items-center gap-1 hover:text-[#F3E9D8] transition-colors text-xs"
          >
            <Phone className="w-3 h-3 text-[#E8AC4E]" />
            <span className="truncate max-w-[120px]">{settings.phone}</span>
          </a>
          <a 
            href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent("Hello L'Amour Gourmet, I'd like to check today's tandoor specials.")}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#25D366] hover:text-[#38e67a] transition-colors font-medium text-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-[#25D366]/20" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Wordmark Logo */}
        <a href="#" className="flex items-center gap-2 sm:gap-3.5 group shrink-0 select-none">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#231d19] border border-[#A9865A]/40 flex items-center justify-center shadow-inner group-hover:border-[#D8632C] transition-colors shrink-0">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#D8632C] group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg sm:text-2xl font-bold text-[#F3E9D8] tracking-tight block leading-none group-hover:text-white transition-colors">
              L'Amour
            </span>
            <span className="font-mono text-[7px] sm:text-[9px] text-[#A9865A] tracking-[0.2em] sm:tracking-[0.25em] uppercase block mt-0.5">
              Gourmet & Grill
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-mono uppercase tracking-wider text-[#D6C8B2]">
          <a href="#menu" className="hover:text-[#E8AC4E] transition-colors py-1">
            Menu & Grills
          </a>
          <button 
            onClick={onOpenReservation} 
            className="hover:text-[#E8AC4E] transition-colors py-1 flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-[#A9865A]" />
            <span>Table Booking</span>
          </button>
          <a href="#reviews" className="hover:text-[#E8AC4E] transition-colors py-1 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[#A9865A]" />
            <span>Reviews</span>
          </a>
          <a href="#location" className="hover:text-[#E8AC4E] transition-colors py-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#A9865A]" />
            <span>Find Us</span>
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Quick Ticket Tracker Dropdown Button (Desktop & Tablet) */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowTrackInput(!showTrackInput)}
              className="btn-brass-pill p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-mono flex items-center gap-1.5"
              title="Track Order Ticket"
            >
              <Receipt className="w-3.5 h-3.5 text-[#E8AC4E]" />
              <span className="hidden md:inline">Track Ticket</span>
            </button>

            {showTrackInput && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-[#231d19] border border-[#A9865A]/40 rounded-xl p-3 shadow-2xl z-50 animate-fade-in">
                <p className="font-mono text-[11px] text-[#A9865A] mb-2">Enter Ticket / Order Code:</p>
                <form onSubmit={handleTrackSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={ticketInput}
                    onChange={(e) => setTicketInput(e.target.value)}
                    placeholder="LAM-XXXXXX"
                    className="flex-1 bg-[#171310] border border-[#A9865A]/40 rounded-lg px-2.5 py-1.5 text-xs text-[#E8AC4E] uppercase font-mono placeholder-slate-600 focus:outline-none focus:border-[#D8632C]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#D8632C] hover:bg-[#e37440] text-[#171310] font-bold text-xs rounded-lg transition-colors font-mono"
                  >
                    Track
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Cart / Tray Button */}
          <button
            onClick={openCart}
            className="btn-ember-primary px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs flex items-center gap-1 sm:gap-2 transition-transform active:scale-95 shrink-0"
            title="Open Dish Tray"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="font-sans font-bold hidden xs:inline text-xs">Tray</span>
            {totalItemCount > 0 && (
              <span className="font-mono font-bold bg-[#171310] text-[#E8AC4E] px-1.5 py-0.2 rounded-full text-[10px] sm:text-xs">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={onOpenProfile}
                className="btn-brass-pill px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs flex items-center gap-1.5 shrink-0"
                title="Your Profile"
              >
                <div className="w-5 h-5 rounded-full bg-[#D8632C]/20 border border-[#D8632C]/50 flex items-center justify-center text-[#E8AC4E] font-bold text-[10px] font-mono shrink-0">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline max-w-[70px] truncate text-[#F3E9D8]">{user.name}</span>
              </button>

              {isAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg bg-[#33402E] hover:bg-[#3d4d37] text-[#92b584] border border-[#33402E] text-xs font-mono font-bold flex items-center gap-1 transition-colors shrink-0"
                  title="Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Admin</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-brass-pill px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs flex items-center gap-1.5 shrink-0"
            >
              <User className="w-3.5 h-3.5 text-[#A9865A]" />
              <span className="hidden xs:inline">Login</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-[#231d19] text-[#F3E9D8] border border-[#A9865A]/30 hover:border-[#E8AC4E] transition-colors shrink-0"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#E8AC4E]" /> : <MenuIcon className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Animated Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[calc(100%)] max-h-[calc(100vh-100px)] overflow-y-auto bg-[#171310]/98 backdrop-blur-xl border-b border-[#A9865A]/30 px-4 pt-4 pb-8 space-y-4 font-mono text-xs animate-fade-in shadow-2xl z-50">
          
          {/* Quick Ticket Search Bar */}
          <div className="bg-[#231d19] border border-[#A9865A]/30 rounded-2xl p-3">
            <label className="text-[11px] text-[#A9865A] block mb-1.5 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-[#E8AC4E]" />
              <span>Track Live Order Ticket</span>
            </label>
            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <input
                type="text"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                placeholder="Enter Ticket # (e.g. LAM-XXXXXX)"
                className="flex-1 bg-[#171310] border border-[#A9865A]/40 rounded-xl px-3 py-2 text-xs text-[#E8AC4E] uppercase placeholder-[#A9865A]/50 focus:outline-none focus:border-[#D8632C]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#D8632C] hover:bg-[#e37440] text-[#171310] font-bold rounded-xl transition-colors shrink-0"
              >
                Track
              </button>
            </form>
          </div>

          {/* Navigation Links List */}
          <div className="divide-y divide-[#A9865A]/15 bg-[#231d19]/60 rounded-2xl border border-[#A9865A]/20 overflow-hidden">
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 text-[#F3E9D8] hover:text-[#E8AC4E] hover:bg-[#231d19] transition-colors text-xs uppercase tracking-wider"
            >
              <span className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-[#D8632C]" />
                <span>Menu & Charcoal Grills</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#A9865A]" />
            </a>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenReservation(); }}
              className="w-full flex items-center justify-between p-3.5 text-[#F3E9D8] hover:text-[#E8AC4E] hover:bg-[#231d19] transition-colors text-xs uppercase tracking-wider text-left"
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#E8AC4E]" />
                <span>Reserve a Table</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#A9865A]" />
            </button>

            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 text-[#F3E9D8] hover:text-[#E8AC4E] hover:bg-[#231d19] transition-colors text-xs uppercase tracking-wider"
            >
              <span className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-[#E8AC4E]" />
                <span>Customer Reviews</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#A9865A]" />
            </a>

            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 text-[#F3E9D8] hover:text-[#E8AC4E] hover:bg-[#231d19] transition-colors text-xs uppercase tracking-wider"
            >
              <span className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-[#A9865A]" />
                <span>Find Us & Kitchen Hours</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#A9865A]" />
            </a>
          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="space-y-2 pt-1">
            <a
              href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent("Hello L'Amour Gourmet, I'd like to place an order via WhatsApp.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-bold flex items-center justify-center gap-2 hover:bg-[#25D366]/30 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Order</span>
            </a>

            <a
              href={`tel:${settings.phone}`}
              className="w-full py-3 px-4 rounded-xl bg-[#231d19] border border-[#A9865A]/30 text-[#E8AC4E] font-semibold flex items-center justify-center gap-2 hover:border-[#A9865A] transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call Kitchen: {settings.phone}</span>
            </a>

            {/* Profile / Admin actions in drawer */}
            {user ? (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenProfile(); }}
                  className="flex-1 py-2.5 rounded-xl bg-[#231d19] border border-[#A9865A]/40 text-[#F3E9D8] font-bold flex items-center justify-center gap-2 text-xs"
                >
                  <User className="w-4 h-4 text-[#E8AC4E]" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-3 py-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 flex items-center justify-center gap-1 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="btn-ember-primary w-full py-3 rounded-xl font-sans font-bold text-xs flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Customer Login / Register</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                className="w-full py-3 rounded-xl bg-[#33402E] text-[#92b584] font-bold border border-[#33402E] flex items-center justify-center gap-2 text-xs shadow-lg mt-1"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Master Management Portal</span>
              </button>
            )}
          </div>

        </div>
      )}
    </header>
  );
}
