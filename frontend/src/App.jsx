import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Lock, Unlock } from 'lucide-react';
import Navbar from './components/common/Navbar';
import AnnouncementBar from './components/common/AnnouncementBar';
import Footer from './components/common/Footer';
import LiquidBackground from './components/common/LiquidBackground';
import CustomCursor from './components/common/CustomCursor';
import SmartRequirementModal from './components/common/SmartRequirementModal';
import CallbackModal from './components/common/CallbackModal';
import AuthModal from './components/common/AuthModal';
import AssistantChatbot from './components/common/AssistantChatbot';
import Preloader from './components/common/Preloader';
import MaintenanceMode from './components/common/MaintenanceMode';
import { OrderModalProvider } from './context/OrderModalContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SiteSettingsProvider, useSiteSettings } from './context/SiteSettingsContext';
import PageTransition, { usePageTransition } from './components/common/PageTransition';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public Pages
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

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// User Portal
import UserDashboard from './pages/User/UserDashboard';

// Admin Pages
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminRequirements from './pages/Admin/AdminRequirements';
import AdminFormBuilder from './pages/Admin/AdminFormBuilder';
import AdminLeads from './pages/Admin/AdminLeads';
import AdminCallbacks from './pages/Admin/AdminCallbacks';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminServices from './pages/Admin/AdminServices';
import AdminDemos from './pages/Admin/AdminDemos';
import AdminBroadcast from './pages/Admin/AdminBroadcast';
import AdminUsers from './pages/Admin/AdminUsers';

function TransitionRoutes({ isLivePreview, isAdminRoute }) {
  const { displayLocation } = usePageTransition();
  const location = useLocation();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Routes location={displayLocation || location}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/demos" element={<Demos />} />
        <Route path="/demos/:slug" element={<LiveDemoViewer />} />
        <Route path="/demo/:slug" element={<LiveDemoViewer />} />
        <Route path="/preview/:templateId" element={<LiveDemoViewer />} />
        <Route path="/live/:templateId" element={<LiveDemoViewer />} />
        <Route path="/details/:slug" element={<DemoDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Client Portal */}
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* Admin Panel Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="requirements" element={<AdminRequirements />} />
          <Route path="form-builder" element={<AdminFormBuilder />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="callbacks" element={<AdminCallbacks />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="demos" element={<AdminDemos />} />
          <Route path="broadcast" element={<AdminBroadcast />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer */}
      {!isLivePreview && !isAdminRoute && <Footer />}
    </div>
  );
}

function MainAppContent() {
  const location = useLocation();
  const { settings } = useSiteSettings();

  const isLivePreview =
    location.pathname.startsWith('/preview') ||
    location.pathname.startsWith('/demos/') ||
    location.pathname.startsWith('/demo/') ||
    location.pathname.startsWith('/live');

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  const isMaintenanceOrComingSoon =
    (settings.isMaintenanceMode || settings.isComingSoonMode) && !isAdminRoute && !isAuthRoute;

  // Admin bypass countdown state
  const [isBypassed, setIsBypassed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const expiry = localStorage.getItem('l2b_admin_bypass_expiry');
    return expiry && Date.now() < Number(expiry);
  });

  const [bypassTimeFormatted, setBypassTimeFormatted] = useState('10:00');

  useEffect(() => {
    if (!isMaintenanceOrComingSoon) return;

    const updateTimer = () => {
      const expiry = localStorage.getItem('l2b_admin_bypass_expiry');
      if (expiry) {
        const remainingMs = Number(expiry) - Date.now();
        if (remainingMs > 0) {
          const totalSec = Math.floor(remainingMs / 1000);
          const mins = Math.floor(totalSec / 60);
          const secs = totalSec % 60;
          setBypassTimeFormatted(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
          setIsBypassed(true);
        } else {
          localStorage.removeItem('l2b_admin_bypass_expiry');
          setIsBypassed(false);
        }
      } else {
        setIsBypassed(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isMaintenanceOrComingSoon]);

  const handleManualLock = () => {
    localStorage.removeItem('l2b_admin_bypass_expiry');
    setIsBypassed(false);
    window.location.reload();
  };

  // Render maintenance screen if active and not bypassed
  if (isMaintenanceOrComingSoon && !isBypassed) {
    return (
      <div className="min-h-screen bg-[#07090e] font-sans text-slate-100 selection:bg-purple-600 selection:text-white">
        <MaintenanceMode onBypassGranted={() => setIsBypassed(true)} />
        <SmartRequirementModal />
        <CallbackModal />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white transition-colors duration-300">
      
      {/* Animated Initial Liquid Glass Preloader */}
      {!isLivePreview && !isAdminRoute && <Preloader />}

      {/* Admin Bypass Pill */}
      {isBypassed && isMaintenanceOrComingSoon && (
        <div className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-[999999] flex items-center gap-1.5 p-1 pr-2 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white backdrop-blur-xl border border-amber-400/80 shadow-2xl transition-all">
          <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
            <Unlock className="w-3 h-3" />
          </div>
          <span className="text-[11px] font-mono font-black text-amber-300 tracking-wider">
            {bypassTimeFormatted}
          </span>
          <button
            onClick={handleManualLock}
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-600/90 hover:bg-red-600 text-white transition-all cursor-pointer flex items-center gap-1 ml-0.5"
            title="Lock website back to Maintenance mode"
          >
            <Lock className="w-2.5 h-2.5" />
            <span>Lock</span>
          </button>
        </div>
      )}

      {/* Custom Fluid Cursor */}
      <CustomCursor />

      {/* Ambient Liquid Background */}
      {!isLivePreview && !isAdminRoute && <LiquidBackground />}

      {/* Global Navbar */}
      {!isLivePreview && !isAdminRoute && <Navbar />}

      {/* Route Views with Synchronized Page Transition */}
      <div className="flex-1 z-10 flex flex-col">
        <PageTransition>
          <TransitionRoutes isLivePreview={isLivePreview} isAdminRoute={isAdminRoute} />
        </PageTransition>
      </div>

      {/* Floating Interactive Assistant */}
      {!isLivePreview && !isAdminRoute && <AssistantChatbot />}

      {/* Global Modals */}
      <SmartRequirementModal />
      <CallbackModal />
      <AuthModal />

      {/* Global Minimal Waterdrop Toastify Suite */}
      <ToastContainer
        position="top-right"
        autoClose={2800}
        limit={3}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 2147483647 }}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SiteSettingsProvider>
          <OrderModalProvider>
            <MainAppContent />
          </OrderModalProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
