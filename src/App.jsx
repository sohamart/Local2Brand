import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LiquidBackground from './components/common/LiquidBackground';
import CustomCursor from './components/common/CustomCursor';
import WhatsAppOrderModal from './components/common/WhatsAppOrderModal';
import { OrderModalProvider } from './context/OrderModalContext';

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
  return (
    <OrderModalProvider>
      <div className="relative min-h-screen flex flex-col font-sans text-slate-900 selection:bg-brand-600 selection:text-white">
        <ScrollToTop />
        
        {/* Precision Fluid Pointer Dot & Ring Cursor */}
        <CustomCursor />

        {/* Ambient Liquid Glass Mesh Background */}
        <LiquidBackground />

        {/* Global Floating Glass Navbar */}
        <Navbar />

        {/* Dynamic Route Viewports */}
        <div className="flex-1 z-10">
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
        </div>

        {/* Global Footer */}
        <Footer />

        {/* Global WhatsApp Order Modal */}
        <WhatsAppOrderModal />
      </div>
    </OrderModalProvider>
  );
}
