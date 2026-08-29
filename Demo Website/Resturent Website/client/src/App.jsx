import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { CartProvider, useCart } from './context/CartContext';
import { api } from './services/api';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import DishModal from './components/DishModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import ReservationSection from './components/ReservationSection';
import ReviewsSection from './components/ReviewsSection';
import LocationMapSection from './components/LocationMapSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CustomerProfileModal from './components/CustomerProfileModal';
import AdminDashboard from './admin/AdminDashboard';

import { MessageSquare, Phone, Bike, ShoppingBag } from 'lucide-react';

function RestaurantApp() {
  const { user, isAdmin } = useAuth();
  const { settings } = useSettings();
  const { totalItemCount, openCart, total } = useCart();

  // Modals & Active View States
  const [selectedDish, setSelectedDish] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authAdminDefault, setAuthAdminDefault] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Visitor Tracking Session
  useEffect(() => {
    let sessionId = localStorage.getItem('lamour_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('lamour_session_id', sessionId);
    }

    const sendPing = () => {
      api.recordVisit({
        path: window.location.pathname + window.location.hash,
        sessionId,
        referrer: document.referrer
      }).catch(() => {});
    };

    sendPing();
    const interval = setInterval(sendPing, 30000); // 30s heartbeat
    return () => clearInterval(interval);
  }, []);

  const handleOrderPlaced = (orderId) => {
    setIsCheckoutOpen(false);
    setTrackingOrderId(orderId);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* Navbar */}
      <Navbar
        onOpenAuth={() => { setAuthAdminDefault(false); setIsAuthOpen(true); }}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenTracker={(id) => setTrackingOrderId(id)}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero 
          onOpenReservation={() => setIsReservationOpen(true)}
        />

        {/* Interactive Menu Section */}
        <MenuSection 
          onSelectDish={(dish) => setSelectedDish(dish)}
        />

        {/* Table Reservation Section */}
        <ReservationSection />

        {/* Customer Reviews & Feedback */}
        <ReviewsSection />

        {/* Location & Directions Map */}
        <LocationMapSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => {
          if (isAdmin) {
            setIsAdminOpen(true);
          } else {
            setAuthAdminDefault(true);
            setIsAuthOpen(true);
          }
        }}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Floating Bottom Action Buttons (WhatsApp, Phone, Floating Mobile Cart) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Direct WhatsApp Quick Chat */}
        <a
          href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent("Hello L'Amour Gourmet, I'd like to place an order or ask a question!")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-transform hover:scale-110 active:scale-95"
          title="Chat on WhatsApp"
        >
          <MessageSquare className="w-7 h-7 fill-slate-950" />
        </a>

        {/* Floating Cart Button for Mobile */}
        {totalItemCount > 0 && (
          <button
            onClick={openCart}
            className="md:hidden flex items-center gap-2 px-4 py-3 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl shadow-amber-500/50 animate-bounce"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{totalItemCount} Items (₹{total})</span>
          </button>
        )}
      </div>

      {/* Modals */}
      <DishModal 
        dish={selectedDish} 
        onClose={() => setSelectedDish(null)} 
      />

      <CartDrawer 
        onProceedCheckout={() => setIsCheckoutOpen(true)} 
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderTrackerModal
        orderId={trackingOrderId}
        onClose={() => setTrackingOrderId(null)}
      />

      <ReservationSection
        isOpenModal={isReservationOpen}
        onCloseModal={() => setIsReservationOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        defaultAdminMode={authAdminDefault}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          if (loggedInUser?.role === 'admin' || authAdminDefault) {
            setIsAdminOpen(true);
          } else {
            setIsProfileOpen(true);
          }
        }}
      />

      <CustomerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onTrackOrder={(id) => setTrackingOrderId(id)}
      />

      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <RestaurantApp />
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
