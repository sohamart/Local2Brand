import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Demos from './pages/Demos';
import Portfolio from './pages/Portfolio';
import Pricing from './pages/Pricing';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import StartProject from './pages/StartProject';
import TemplatePreview from './pages/TemplatePreview';

// Client Dashboard Pages
import Overview from './pages/dashboard/Overview';
import Projects from './pages/dashboard/Projects';
import ProjectDetails from './pages/dashboard/ProjectDetails';
import Messages from './pages/dashboard/Messages';
import Notifications from './pages/dashboard/Notifications';
import Files from './pages/dashboard/Files';
import Invoices from './pages/dashboard/Invoices';
import Profile from './pages/dashboard/Profile';

// Admin Dashboard Pages
import AdminOverview from './pages/admin/AdminOverview';
import AdminRequests from './pages/admin/AdminRequests';
import AdminClients from './pages/admin/AdminClients';
import AdminProjects from './pages/admin/AdminProjects';
import AdminDemos from './pages/admin/AdminDemos';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminLeads from './pages/admin/AdminLeads';

// Route Guards
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');
  return isAdmin ? children : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="demos" element={<Demos />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="start-project" element={<StartProject />} />
        <Route path="demos/preview/:templateId" element={<TemplatePreview />} />
      </Route>

      {/* Client Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="files" element={<Files />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="demos" element={<AdminDemos />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="invoices" element={<AdminInvoices />} />
        <Route path="leads" element={<AdminLeads />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
