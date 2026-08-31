import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TenantProvider } from './context/TenantContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { DemoControlBar } from './components/common/DemoControlBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { MenuPage } from './pages/customer/MenuPage';
import { SpecialsPage } from './pages/customer/SpecialsPage';
import { StoryPage } from './pages/customer/StoryPage';
import { OffersPage } from './pages/customer/OffersPage';
import { ReviewsPage } from './pages/customer/ReviewsPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { FavoritesPage } from './pages/customer/FavoritesPage';
import { ContactPage } from './pages/customer/ContactPage';
import { TableReservationPage } from './pages/customer/TableReservationPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';
import { CustomerAccountPage } from './pages/customer/CustomerAccountPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Visual Customizer
import { WebsiteCustomizer } from './pages/customizer/WebsiteCustomizer';

// Owner Admin Pages
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { AdminOrdersPage } from './pages/owner/AdminOrdersPage';
import { AdminProductsPage } from './pages/owner/AdminProductsPage';
import { AdminTablesPage } from './pages/owner/AdminTablesPage';
import { AdminCouponsPage } from './pages/owner/AdminCouponsPage';
import { AdminAnalyticsPage } from './pages/owner/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/owner/AdminSettingsPage';

// Staff & Delivery Portals
import { KitchenDisplayPage } from './pages/staff/KitchenDisplayPage';
import { DeliveryRiderPortal } from './pages/rider/DeliveryRiderPortal';

// Developer Super-Admin Portal
import { DeveloperDashboard } from './pages/developer/DeveloperDashboard';

const AppLayout = () => {
  const location = useLocation();
  const isCustomizer = location.pathname.startsWith('/customizer');
  const isKDS = location.pathname.startsWith('/staff');
  const isRider = location.pathname.startsWith('/rider');
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Top Demo & Role Control Bar */}
      <DemoControlBar />

      {/* Customer Navbar (hidden in customizer, KDS, rider and admin dashboard) */}
      {!isCustomizer && !isKDS && !isRider && !isAdmin && <Navbar />}

      {/* Main Content Viewport */}
      <main className="flex-1">
        <Routes>
          {/* Customer Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/specials" element={<SpecialsPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/reserve" element={<TableReservationPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
          <Route path="/account" element={<CustomerAccountPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Website Customizer */}
          <Route path="/customizer" element={<WebsiteCustomizer />} />

          {/* Restaurant Owner Dashboard & Management */}
          <Route path="/admin" element={<OwnerDashboard />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/tables" element={<AdminTablesPage />} />
          <Route path="/admin/coupons" element={<AdminCouponsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />

          {/* Staff Kitchen KDS */}
          <Route path="/staff" element={<KitchenDisplayPage />} />

          {/* Delivery Rider / Valet App */}
          <Route path="/rider" element={<DeliveryRiderPortal />} />

          {/* SaaS Super-Admin Master Control */}
          <Route path="/developer" element={<DeveloperDashboard />} />
        </Routes>
      </main>

      {/* Slide-Over Cart Drawer */}
      <CartDrawer />

      {/* Customer Footer (hidden in customizer, KDS, rider & admin) */}
      {!isCustomizer && !isKDS && !isRider && !isAdmin && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <TenantProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppLayout />
          </Router>
        </CartProvider>
      </AuthProvider>
    </TenantProvider>
  );
}
