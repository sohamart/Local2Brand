import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Lock, Unlock } from 'lucide-react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LiquidBackground from './components/common/LiquidBackground';
import CustomCursor from './components/common/CustomCursor';
import WhatsAppOrderModal from './components/common/WhatsAppOrderModal';
import Chatbot from './components/common/Chatbot';
import Preloader from './components/common/Preloader';
import MaintenanceMode from './components/common/MaintenanceMode';
import { siteConfig } from './config/siteConfig';
import { OrderModalProvider } from './context/OrderModalContext';
import { ThemeProvider } from './context/ThemeContext';

import PageTransition from './components/common/PageTransition';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Portfolio from './pages/Portfolio';
import Demos from './pages/Demos';
import DemoDetails from './pages/DemoDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Helper to scroll to top on page change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  const isMaintenanceOrComingSoon = siteConfig.isMaintenanceMode || siteConfig.isComingSoonMode;

  // Check if admin bypass is currently active on this device
  const [isBypassed, setIsBypassed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const expiry = localStorage.getItem('l2b_admin_bypass_expiry');
    return expiry && Date.now() < Number(expiry);
  });

  const [bypassMinutesRemaining, setBypassMinutesRemaining] = useState(10);

  useEffect(() => {
    if (!isMaintenanceOrComingSoon) return;

    // Check expiry interval every 15 seconds
    const interval = setInterval(() => {
      const expiry = localStorage.getItem('l2b_admin_bypass_expiry');
      if (expiry) {
        const remainingMs = Number(expiry) - Date.now();
        if (remainingMs > 0) {
          setBypassMinutesRemaining(Math.ceil(remainingMs / (60 * 1000)));
          setIsBypassed(true);
        } else {
          localStorage.removeItem('l2b_admin_bypass_expiry');
          setIsBypassed(false);
        }
      } else {
        setIsBypassed(false);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isMaintenanceOrComingSoon]);

  const handleManualLock = () => {
    localStorage.removeItem('l2b_admin_bypass_expiry');
    setIsBypassed(false);
  };

  // If maintenance / coming soon is active and NOT bypassed, show full countdown screen
  if (isMaintenanceOrComingSoon && !isBypassed) {
    return (
      <ThemeProvider>
        <MaintenanceMode onBypassSuccess={() => setIsBypassed(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <OrderModalProvider>
        <div className="relative min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white transition-colors duration-300">
          <ScrollToTop />

          {/* Animated Initial Liquid Glass Preloader */}
          <Preloader />

          {/* Floating Admin Bypass Active Pill Indicator */}
          {isMaintenanceOrComingSoon && isBypassed && (
            <div className="fixed bottom-3 left-3 z-[9999] p-2 sm:px-3 sm:py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold shadow-2xl flex items-center gap-2 border border-slate-700">
              <Unlock className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Preview Active ({bypassMinutesRemaining}m left)</span>
              <button
                onClick={handleManualLock}
                className="text-[10px] uppercase font-bold text-red-400 hover:text-red-300 underline ml-1 cursor-pointer"
              >
                Lock Site
              </button>
            </div>
          )}

          {/* Precision Fluid Pointer Dot & Ring Cursor */}
          <CustomCursor />

          {/* Ambient Liquid Glass Mesh Background */}
          <LiquidBackground />

          {/* Global Floating Glass Navbar */}
          <Navbar />

          {/* Dynamic Route Viewports with Page Transition */}
          <div className="flex-1 z-10 flex flex-col">
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/demos" element={<Demos />} />
                <Route path="/demos/:slug" element={<DemoDetails />} />
                <Route path="/demo/:slug" element={<DemoDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </div>

          {/* Global Footer */}
          <Footer />

          {/* Floating Direct WhatsApp Support & Question Selector */}
          <Chatbot />

          {/* Global WhatsApp Order Modal */}
          <WhatsAppOrderModal />
        </div>
      </OrderModalProvider>
    </ThemeProvider>
  );
}
