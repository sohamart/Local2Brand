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
import LiveDemoViewer from './pages/LiveDemoViewer';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();
  const isLivePreview = location.pathname.startsWith('/preview');
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

  // Handle manual lock from bypass banner
  const handleManualLock = () => {
    localStorage.removeItem('l2b_admin_bypass_expiry');
    setIsBypassed(false);
    window.location.reload();
  };

  // Render maintenance screen if active and not bypassed
  if (isMaintenanceOrComingSoon && !isBypassed) {
    return (
      <ThemeProvider>
        <OrderModalProvider>
          <div className="min-h-screen bg-[#07090e] font-sans text-slate-100 selection:bg-purple-600 selection:text-white">
            <MaintenanceMode onBypassGranted={() => setIsBypassed(true)} />
            <WhatsAppOrderModal />
          </div>
        </OrderModalProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <OrderModalProvider>
        <div className="relative min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white transition-colors duration-300">
          {/* Animated Initial Liquid Glass Preloader */}
          {!isLivePreview && <Preloader />}

          {/* Admin Bypass Notification Floating Bar */}
          {isBypassed && isMaintenanceOrComingSoon && (
            <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[999999] bg-amber-500/90 hover:bg-amber-500 backdrop-blur-md text-slate-950 px-4 py-1.5 rounded-full text-xs font-bold shadow-xl border border-amber-300 flex items-center gap-2 transition-all">
              <Unlock className="w-3.5 h-3.5" />
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
          {!isLivePreview && <LiquidBackground />}

          {/* Global Floating Glass Navbar */}
          {!isLivePreview && <Navbar />}

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
                <Route path="/preview/:templateId" element={<LiveDemoViewer />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </div>

          {/* Global Footer */}
          {!isLivePreview && <Footer />}

          {/* Floating Direct WhatsApp Support & Question Selector */}
          {!isLivePreview && <Chatbot />}

          {/* Global WhatsApp Order Modal */}
          <WhatsAppOrderModal />
        </div>
      </OrderModalProvider>
    </ThemeProvider>
  );
}
