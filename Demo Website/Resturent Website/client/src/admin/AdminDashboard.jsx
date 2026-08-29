import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  UtensilsCrossed, 
  CreditCard, 
  Users, 
  Calendar, 
  Star, 
  Eye, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Bike, 
  Phone, 
  MapPin, 
  RefreshCw, 
  Save, 
  ShieldCheck, 
  X,
  Printer,
  Search,
  ExternalLink,
  Flame,
  Volume2,
  VolumeX,
  Receipt,
  Clock,
  ArrowUpRight,
  Sparkles,
  Lock,
  Unlock,
  QrCode,
  Upload,
  Loader2,
  Image as ImageIcon,
  Mail,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export default function AdminDashboard({ onClose }) {
  const { logout, user } = useAuth();
  const { refreshSettings } = useSettings();

  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, menu, payments, users, reservations, reviews
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [adminSettings, setAdminSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  // Modals & Editing State
  const [editingDish, setEditingDish] = useState(null);
  const [showDishModal, setShowDishModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const [subscribers, setSubscribers] = useState([]);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailTarget, setTestEmailTarget] = useState('admin@restaurant.com');
  const [showSmtpPass, setShowSmtpPass] = useState(false);

  // Delivery Fleet State
  const [ridersList, setRidersList] = useState([]);
  const [showAddRiderModal, setShowAddRiderModal] = useState(false);
  const [creatingRider, setCreatingRider] = useState(false);
  const [newRiderData, setNewRiderData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicle: 'Express Thermal Bike (DL 04 EV 8892)',
    address: 'Express Delivery Hub 4'
  });

  useEffect(() => {
    loadAllAdminData();
    const interval = setInterval(loadOrdersAndAnalytics, 8000);
    return () => clearInterval(interval);
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    await Promise.all([
      loadOrdersAndAnalytics(),
      loadMenu(),
      loadSettings(),
      loadUsers(),
      loadReservations(),
      loadReviews(),
      loadSubscribers(),
      loadRiders()
    ]);
    setLoading(false);
  };

  const loadRiders = async () => {
    try {
      const data = await api.getRidersDirectory();
      setRidersList(data || []);
    } catch (err) {
      console.error('Failed to load riders:', err);
    }
  };

  const handleCreateRider = async (e) => {
    e.preventDefault();
    setCreatingRider(true);
    try {
      const res = await api.createRider(newRiderData);
      showToast(res.message || 'Delivery rider registered successfully!');
      setShowAddRiderModal(false);
      setNewRiderData({
        name: '',
        email: '',
        password: '',
        phone: '',
        vehicle: 'Express Thermal Bike (DL 04 EV 8892)',
        address: 'Express Delivery Hub 4'
      });
      await loadRiders();
    } catch (err) {
      alert('Failed to register rider: ' + err.message);
    } finally {
      setCreatingRider(false);
    }
  };

  const handleDeleteRider = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove rider ${name}?`)) return;
    try {
      const res = await api.deleteRider(id);
      showToast(res.message || 'Rider removed successfully');
      await loadRiders();
    } catch (err) {
      alert('Failed to delete rider: ' + err.message);
    }
  };

  const loadSubscribers = async () => {
    try {
      const data = await api.getNewsletterSubscribers();
      setSubscribers(data || []);
    } catch (err) {
      console.error('Failed to load newsletter subscribers:', err);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailTarget) {
      alert('Please enter a target email address.');
      return;
    }
    setTestingEmail(true);
    try {
      const res = await api.sendTestEmail(testEmailTarget);
      showToast(res.message || 'Test email dispatched successfully!');
    } catch (err) {
      alert('Failed to send test email: ' + err.message);
    } finally {
      setTestingEmail(false);
    }
  };

  const loadOrdersAndAnalytics = async () => {
    try {
      const [overviewData, ordersData] = await Promise.all([
        api.getAnalyticsOverview(),
        api.getAdminOrders()
      ]);
      setAnalytics(overviewData);
      setOrders(ordersData || []);
    } catch (err) {
      console.error('Failed to load orders/analytics:', err);
    }
  };

  const loadMenu = async () => {
    try {
      const res = await api.getMenu();
      setMenuItems(res.items || []);
      setCategories(res.categories || []);
    } catch (err) {
      console.error('Failed to load menu:', err);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await api.getAdminSettings();
      setAdminSettings(data || {});
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await api.getUsersDirectory();
      setUsersList(data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const loadReservations = async () => {
    try {
      const data = await api.getAdminReservations();
      setReservations(data || []);
    } catch (err) {
      console.error('Failed to load reservations:', err);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await api.getAdminReviews();
      setReviews(data || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const showToast = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, { order_status: newStatus });
      showToast(`Ticket #${orderId} moved to ${newStatus.toUpperCase()}`);
      loadOrdersAndAnalytics();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleToggleAvailability = async (dishId) => {
    try {
      const res = await api.toggleItemAvailability(dishId);
      showToast(res.message);
      loadMenu();
    } catch (err) {
      alert('Failed to toggle stock');
    }
  };

  const handleDeleteDish = async (dishId) => {
    if (!window.confirm('Delete this dish permanently from menu?')) return;
    try {
      await api.deleteMenuItem(dishId);
      showToast('Dish removed from menu');
      loadMenu();
    } catch (err) {
      alert('Failed to delete dish');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      setEditingDish(prev => ({ ...prev, image: res.imageUrl }));
      showToast(res.provider === 'cloudinary' ? '☁️ Image uploaded to Cloudinary CDN!' : 'Image uploaded successfully!');
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveDish = async (e) => {
    e.preventDefault();
    try {
      if (editingDish.id) {
        await api.updateMenuItem(editingDish.id, editingDish);
        showToast('Dish updated successfully');
      } else {
        await api.addMenuItem(editingDish);
        showToast('New culinary dish added');
      }
      setShowDishModal(false);
      setEditingDish(null);
      loadMenu();
    } catch (err) {
      alert('Failed to save dish: ' + err.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.updateSettings(adminSettings);
      showToast('Settings & Razorpay keys saved successfully');
      refreshSettings();
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  const handleReservationStatus = async (id, status) => {
    try {
      await api.updateReservationStatus(id, status);
      showToast(`Reservation #${id} is now ${status}`);
      loadReservations();
    } catch (err) {
      alert('Failed to update reservation');
    }
  };

  const handleReviewStatus = async (id, status) => {
    try {
      await api.moderateReview(id, status);
      showToast(`Review #${id} status: ${status}`);
      loadReviews();
    } catch (err) {
      alert('Failed to moderate review');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Permanently delete this review?')) return;
    try {
      await api.deleteReview(id);
      showToast('Review deleted');
      loadReviews();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.order_status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return o.id.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.customer_phone.includes(q);
    }
    return true;
  });

  // Filtered Menu Items
  const filteredMenuItems = menuItems.filter(item => {
    if (menuCategoryFilter !== 'all' && item.category !== menuCategoryFilter) return false;
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      return item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q));
    }
    return true;
  });

  // Filtered Users
  const filteredUsers = usersList.filter(u => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone && u.phone.includes(q));
  });

  // Active orders count
  const activeOrdersCount = orders.filter(o => ['received', 'preparing', 'out_for_delivery'].includes(o.order_status)).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0d0a08] text-[#F3E9D8] flex flex-col font-sans">
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#E8AC4E] text-[#171310] px-4 py-2.5 rounded-xl font-mono font-bold text-xs shadow-2xl flex items-center gap-2 border border-[#171310] animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="h-16 bg-[#171310] border-b border-[#A9865A]/25 px-4 sm:px-6 flex items-center justify-between shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#231d19] border border-[#A9865A]/40 flex items-center justify-center text-[#D8632C]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-base text-[#F3E9D8] tracking-tight">L'Amour Master Hub</h1>
              <span className="text-[10px] bg-[#33402E] text-[#92b584] font-bold px-2 py-0.5 rounded border border-[#33402E]">
                ● LIVE
              </span>
            </div>
            <p className="text-[10px] text-[#A9865A] hidden sm:block">Kitchen Dispatch, Traffic Telemetry & Payment Configuration</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          
          {/* Live Visitor Heartbeat Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#231d19] border border-[#A9865A]/30 text-[#E8AC4E]">
            <span className="w-2 h-2 rounded-full bg-[#E8AC4E] shadow-[0_0_8px_#E8AC4E] animate-pulse"></span>
            <span><strong>{analytics?.activeVisitors || 1}</strong> Online</span>
          </div>

          {/* Quick Refresh */}
          <button
            onClick={loadAllAdminData}
            className="btn-brass-pill p-2 rounded-lg text-[#D6C8B2] hover:text-[#F3E9D8]"
            title="Refresh All Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Return to Site */}
          <button
            onClick={onClose}
            className="btn-brass-pill px-3 py-1.5 rounded-lg text-[#F3E9D8] font-bold text-xs flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Tabs (Scrollable) */}
      <div className="md:hidden bg-[#120f0d] border-b border-[#A9865A]/25 p-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0 font-mono text-xs z-10">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold flex items-center gap-1.5 transition-colors ${
            activeTab === 'overview' ? 'bg-[#E8AC4E] text-[#171310]' : 'text-[#D6C8B2] bg-[#1f1915]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold flex items-center gap-1.5 transition-colors ${
            activeTab === 'orders' ? 'bg-[#E8AC4E] text-[#171310]' : 'text-[#D6C8B2] bg-[#1f1915]'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Orders {activeOrdersCount > 0 && `(${activeOrdersCount})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold flex items-center gap-1.5 transition-colors ${
            activeTab === 'menu' ? 'bg-[#E8AC4E] text-[#171310]' : 'text-[#D6C8B2] bg-[#1f1915]'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Menu ({menuItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold flex items-center gap-1.5 transition-colors ${
            activeTab === 'payments' ? 'bg-[#E8AC4E] text-[#171310]' : 'text-[#D6C8B2] bg-[#1f1915]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold flex items-center gap-1.5 transition-colors ${
            activeTab === 'users' ? 'bg-[#E8AC4E] text-[#171310]' : 'text-[#D6C8B2] bg-[#1f1915]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Users</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold flex items-center gap-1.5 transition-colors ${
            activeTab === 'reservations' ? 'bg-[#E8AC4E] text-[#171310]' : 'text-[#D6C8B2] bg-[#1f1915]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Tables</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold flex items-center gap-1.5 transition-colors ${
            activeTab === 'reviews' ? 'bg-[#E8AC4E] text-[#171310]' : 'text-[#D6C8B2] bg-[#1f1915]'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Reviews</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-64 bg-[#120f0d] border-r border-[#A9865A]/20 p-4 space-y-1.5 shrink-0 hidden md:flex md:flex-col justify-between overflow-y-auto font-mono text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-[#A9865A] uppercase tracking-wider px-3 block mb-2 font-bold">
              Operations Navigation
            </span>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#E8AC4E] text-[#171310] shadow-lg'
                  : 'text-[#D6C8B2] hover:bg-[#1f1915] hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Metrics & Traffic</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#E8AC4E] text-[#171310] shadow-lg'
                  : 'text-[#D6C8B2] hover:bg-[#1f1915] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Live Orders</span>
              </div>
              {activeOrdersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#D8632C] text-[#171310] text-[10px] font-black animate-pulse">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'menu'
                  ? 'bg-[#E8AC4E] text-[#171310] shadow-lg'
                  : 'text-[#D6C8B2] hover:bg-[#1f1915] hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Menu Manager ({menuItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'payments'
                  ? 'bg-[#E8AC4E] text-[#171310] shadow-lg'
                  : 'text-[#D6C8B2] hover:bg-[#1f1915] hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payment & Razorpay</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'users'
                  ? 'bg-[#E8AC4E] text-[#171310] shadow-lg'
                  : 'text-[#D6C8B2] hover:bg-[#1f1915] hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer Accounts ({usersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'reservations'
                  ? 'bg-[#E8AC4E] text-[#171310] shadow-lg'
                  : 'text-[#D6C8B2] hover:bg-[#1f1915] hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Table Bookings ({reservations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-[#E8AC4E] text-[#171310] shadow-lg'
                  : 'text-[#D6C8B2] hover:bg-[#1f1915] hover:text-white'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Reviews Feed ({reviews.length})</span>
            </button>
          </div>

          <div className="pt-4 border-t border-[#A9865A]/20">
            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-red-400 hover:bg-red-950/40 font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Admin</span>
            </button>
          </div>
        </aside>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0d0a08]">
          
          {/* Mobile Tab Scroller */}
          <div className="md:hidden flex overflow-x-auto gap-2 pb-3 mb-4 scrollbar-none font-mono text-xs">
            {['overview', 'orders', 'menu', 'payments', 'users', 'reservations', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase whitespace-nowrap ${
                  activeTab === tab ? 'bg-[#E8AC4E] text-[#171310]' : 'bg-[#231d19] text-[#D6C8B2]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 1. OVERVIEW & ANALYTICS TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Top KPI Metric Cards with Sparklines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-mono">
                
                {/* Total Revenue */}
                <div className="p-5 rounded-2xl bg-[#171310] border border-[#A9865A]/30 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#A9865A] font-bold">TOTAL REVENUE</span>
                    <span className="text-[10px] bg-[#33402E] text-[#92b584] px-2 py-0.5 rounded font-bold">
                      +18.4%
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#F3E9D8]">₹{analytics?.totalRevenue || 0}</h3>
                  <div className="flex items-center justify-between text-[11px] text-[#A9865A] mt-2">
                    <span>Today: ₹{analytics?.todayRevenue || 0}</span>
                    <span className="text-[#E8AC4E]">INR Gross</span>
                  </div>
                  {/* Decorative sparkline gradient */}
                  <div className="w-full h-1 bg-gradient-to-r from-[#D8632C] via-[#E8AC4E] to-[#92b584] mt-3 rounded-full"></div>
                </div>

                {/* Total Orders */}
                <div className="p-5 rounded-2xl bg-[#171310] border border-[#A9865A]/30 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#A9865A] font-bold">TOTAL ORDERS</span>
                    <ShoppingBag className="w-4 h-4 text-[#D8632C]" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#F3E9D8]">{analytics?.totalOrders || 0}</h3>
                  <div className="flex items-center justify-between text-[11px] text-[#A9865A] mt-2">
                    <span className="text-[#D8632C] font-bold">{analytics?.activeOrders || 0} in Kitchen</span>
                    <span>100% Fulfilled</span>
                  </div>
                  <div className="w-full h-1 bg-[#D8632C] mt-3 rounded-full"></div>
                </div>

                {/* Page Views & Traffic */}
                <div className="p-5 rounded-2xl bg-[#171310] border border-[#A9865A]/30 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#A9865A] font-bold">PAGE VISITS</span>
                    <Eye className="w-4 h-4 text-[#E8AC4E]" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#F3E9D8]">{analytics?.totalPageViews || 0}</h3>
                  <div className="flex items-center justify-between text-[11px] text-[#A9865A] mt-2">
                    <span>Today: {analytics?.viewsToday || 0} views</span>
                    <span className="text-[#92b584]">Active</span>
                  </div>
                  <div className="w-full h-1 bg-[#E8AC4E] mt-3 rounded-full"></div>
                </div>

                {/* Customers & Members */}
                <div className="p-5 rounded-2xl bg-[#171310] border border-[#A9865A]/30 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#A9865A] font-bold">FOODIE ACCOUNTS</span>
                    <Users className="w-4 h-4 text-[#92b584]" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#F3E9D8]">{analytics?.totalCustomers || 0}</h3>
                  <div className="flex items-center justify-between text-[11px] text-[#A9865A] mt-2">
                    <span>{analytics?.totalReservations || 0} Table Seats</span>
                    <span>Verified</span>
                  </div>
                  <div className="w-full h-1 bg-[#92b584] mt-3 rounded-full"></div>
                </div>

              </div>

              {/* Graphical Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 7-Day Revenue Velocity Chart (Native SVG) */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-[#171310] border border-[#A9865A]/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-base text-[#F3E9D8]">Revenue & Dispatch Velocity</h4>
                      <p className="font-mono text-xs text-[#A9865A]">Visual trend of food orders & ticket throughput</p>
                    </div>
                    <span className="font-mono text-xs text-[#E8AC4E] bg-[#231d19] px-2.5 py-1 rounded border border-[#A9865A]/30">
                      Last 7 Days
                    </span>
                  </div>

                  {/* SVG Area Chart Graphic */}
                  <div className="h-52 w-full pt-4">
                    <svg className="w-full h-full" viewBox="0 0 500 150">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#D8632C" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#D8632C" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="#231d19" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="#231d19" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#231d19" strokeWidth="1" strokeDasharray="3 3" />

                      {/* Area Fill */}
                      <path
                        d="M 20 120 Q 80 80 150 95 T 280 45 T 400 65 T 480 30 L 480 140 L 20 140 Z"
                        fill="url(#chartGrad)"
                      />

                      {/* Stroke Path */}
                      <path
                        d="M 20 120 Q 80 80 150 95 T 280 45 T 400 65 T 480 30"
                        fill="none"
                        stroke="#E8AC4E"
                        strokeWidth="3"
                      />

                      {/* Data Points */}
                      <circle cx="20" cy="120" r="4" fill="#D8632C" />
                      <circle cx="150" cy="95" r="4" fill="#D8632C" />
                      <circle cx="280" cy="45" r="4" fill="#E8AC4E" />
                      <circle cx="400" cy="65" r="4" fill="#D8632C" />
                      <circle cx="480" cy="30" r="5" fill="#92b584" />
                    </svg>

                    <div className="flex justify-between font-mono text-[10px] text-[#A9865A] pt-2">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span className="text-[#E8AC4E] font-bold">Today</span>
                    </div>
                  </div>
                </div>

                {/* Top Visited Pages & Sections */}
                <div className="lg:col-span-5 p-6 rounded-3xl bg-[#171310] border border-[#A9865A]/30 space-y-4 font-mono">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-base text-[#F3E9D8]">Section Views</h4>
                    <span className="text-[10px] text-[#A9865A]">Total Visits</span>
                  </div>

                  <div className="space-y-3">
                    {analytics?.topPages && analytics.topPages.map((p, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#D6C8B2]">{p.path || '/'}</span>
                          <span className="font-bold text-[#E8AC4E]">{p.visits} visits</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#231d19] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#D8632C] to-[#E8AC4E] rounded-full"
                            style={{ width: `${Math.min(100, (p.visits / (analytics?.totalPageViews || 1)) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Real-time Visitor Stream Log */}
              <div className="p-6 rounded-3xl bg-[#171310] border border-[#A9865A]/30 space-y-4 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#92b584] animate-pulse"></span>
                    <h4 className="font-display font-bold text-base text-[#F3E9D8]">Live Visitor Activity Stream</h4>
                  </div>
                  <span className="text-xs text-[#A9865A]">Real-Time Heartbeat</span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {analytics?.recentLogs && analytics.recentLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-[#231d19] text-xs flex items-center justify-between border border-[#A9865A]/20">
                      <div>
                        <span className="font-bold text-[#E8AC4E]">{log.path}</span>
                        <span className="text-[10px] text-[#A9865A] block truncate max-w-xs">{log.user_agent}</span>
                      </div>
                      <div className="text-right text-[10px] text-[#D6C8B2]">
                        <span className="block">{log.ip}</span>
                        <span className="text-[#A9865A]">{new Date(log.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 2. LIVE ORDERS BOARD TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6 font-mono text-xs">
              
              {/* Header & Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#F3E9D8]">Live Order Dispatch Board</h2>
                  <p className="text-xs text-[#A9865A]">Update order tickets, payment verification and driver milestones</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-2 rounded-xl border ${soundEnabled ? 'bg-[#231d19] text-[#E8AC4E] border-[#A9865A]/40' : 'bg-[#171310] text-[#A9865A] border-[#231d19]'}`}
                    title={soundEnabled ? 'Mute Alert Chime' : 'Enable Alert Chime'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={loadOrdersAndAnalytics}
                    className="btn-brass-pill px-3 py-2 rounded-xl text-[#F3E9D8] font-bold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync</span>
                  </button>
                </div>
              </div>

              {/* Search & Status Filter Row */}
              <div className="bg-[#171310] p-3 rounded-2xl border border-[#A9865A]/25 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#A9865A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Ticket #, Customer Name, Phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white placeholder-[#A9865A]/50 focus:outline-none focus:border-[#D8632C]"
                  />
                </div>

                <div className="flex overflow-x-auto gap-1.5 scrollbar-none">
                  {['all', 'received', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg uppercase tracking-wider font-bold whitespace-nowrap transition-all ${
                        orderStatusFilter === st
                          ? 'bg-[#E8AC4E] text-[#171310]'
                          : 'bg-[#231d19] text-[#D6C8B2] hover:text-white'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="p-12 text-center bg-[#171310] rounded-2xl border border-[#A9865A]/20 text-[#A9865A]">
                    No order tickets matching your filter.
                  </div>
                ) : (
                  filteredOrders.map((ord) => (
                    <div 
                      key={ord.id}
                      className="p-5 sm:p-6 rounded-3xl bg-[#171310] border border-[#A9865A]/30 flex flex-col lg:flex-row justify-between gap-6 hover:border-[#A9865A]/60 transition-all"
                    >
                      {/* Ticket Info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-bold text-base text-[#E8AC4E]">#{ord.id}</span>
                          <span className="text-[#A9865A]">({new Date(ord.created_at).toLocaleString()})</span>

                          {/* Payment Method Badge */}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.payment_method === 'razorpay'
                              ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                              : ord.payment_method === 'whatsapp'
                              ? 'bg-emerald-950 text-[#92b584] border border-emerald-500/40'
                              : 'bg-[#231d19] text-[#E8AC4E] border border-[#A9865A]/40'
                          }`}>
                            {ord.payment_method} ({ord.payment_status})
                          </span>
                        </div>

                        {/* Customer & Destination */}
                        <div className="text-slate-300 space-y-1">
                          <p><strong>Customer:</strong> {ord.customer_name} • <a href={`tel:${ord.customer_phone}`} className="text-[#E8AC4E] hover:underline">{ord.customer_phone}</a></p>
                          <p className="text-[#A9865A]"><strong>Destination:</strong> {ord.delivery_address}</p>
                          {ord.delivery_notes && (
                            <p className="text-[#E8AC4E] bg-[#231d19] p-2 rounded-lg border border-[#A9865A]/20">
                              💬 Notes: {ord.delivery_notes}
                            </p>
                          )}
                        </div>

                        {/* Items */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {ord.items && ord.items.map((i, idx) => (
                            <span key={idx} className="bg-[#231d19] px-2.5 py-1 rounded-lg border border-[#A9865A]/20 text-[#F3E9D8]">
                              {i.name} <strong>×{i.quantity}</strong>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Status Selector & Price */}
                      <div className="flex flex-col justify-between items-start lg:items-end gap-4 shrink-0">
                        <div className="text-left lg:text-right">
                          <span className="text-[10px] text-[#A9865A] block">TOTAL CHARGED</span>
                          <span className="text-2xl font-bold text-[#E8AC4E]">₹{ord.total}</span>
                        </div>

                        <div className="space-y-2 w-full sm:w-auto">
                          <label className="text-[10px] text-[#A9865A] block">Change Stage:</label>
                          <select
                            value={ord.order_status}
                            onChange={(e) => handleOrderStatusUpdate(ord.id, e.target.value)}
                            className="bg-[#231d19] border border-[#A9865A]/40 rounded-xl px-3 py-2 text-xs font-bold text-[#F3E9D8] focus:outline-none focus:border-[#D8632C]"
                          >
                            <option value="received">01. Ticket Fired (Received)</option>
                            <option value="preparing">02. In Tandoor (Preparing)</option>
                            <option value="out_for_delivery">03. On The Road (Dispatched)</option>
                            <option value="delivered">04. Delivered</option>
                            <option value="cancelled">05. Cancelled</option>
                          </select>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 3. MENU MANAGER TAB */}
          {activeTab === 'menu' && (
            <div className="space-y-6 font-mono text-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#F3E9D8]">Menu & Culinary Plates Management</h2>
                  <p className="text-xs text-[#A9865A]">Add new dishes, modify prices, and toggle in-stock availability</p>
                </div>

                <button
                  onClick={() => {
                    setEditingDish({
                      name: '',
                      description: '',
                      price: '',
                      original_price: '',
                      category: categories[0]?.name || "Chef's Specials",
                      image: '',
                      is_veg: 1,
                      is_spicy: 0,
                      is_bestseller: 0,
                      prep_time: '20 mins'
                    });
                    setShowDishModal(true);
                  }}
                  className="btn-ember-primary px-4 py-2.5 rounded-xl font-sans font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>
              </div>

              {/* Search & Category Filter */}
              <div className="bg-[#171310] p-3 rounded-2xl border border-[#A9865A]/25 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#A9865A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white placeholder-[#A9865A]/50 focus:outline-none focus:border-[#D8632C]"
                  />
                </div>

                <select
                  value={menuCategoryFilter}
                  onChange={(e) => setMenuCategoryFilter(e.target.value)}
                  className="bg-[#231d19] border border-[#A9865A]/30 rounded-xl px-3 py-2 text-xs text-[#F3E9D8] focus:outline-none focus:border-[#D8632C]"
                >
                  <option value="all">All Categories ({menuItems.length})</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenuItems.map((dish) => (
                  <div key={dish.id} className="rounded-2xl overflow-hidden bg-[#171310] border border-[#A9865A]/30 flex flex-col justify-between">
                    <div>
                      <div className="relative h-40 w-full overflow-hidden bg-[#0f0c0a]">
                        <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2.5 left-2.5 flex gap-1">
                          {dish.is_veg ? (
                            <span className="stamp-seal-veg">VEG</span>
                          ) : (
                            <span className="stamp-seal-ember">NON-VEG</span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display font-bold text-sm text-[#F3E9D8]">{dish.name}</h4>
                          <span className="font-bold text-[#E8AC4E]">₹{dish.price}</span>
                        </div>
                        <p className="text-[#D6C8B2]/80 text-xs line-clamp-2 font-sans">{dish.description}</p>
                        <span className="text-[10px] text-[#A9865A] block">{dish.category}</span>
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#A9865A]/20 bg-[#120f0d] flex items-center justify-between">
                      <button
                        onClick={() => handleToggleAvailability(dish.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          dish.is_available 
                            ? 'bg-[#33402E] text-[#92b584]' 
                            : 'bg-red-950/60 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {dish.is_available ? '● In Stock' : '○ Out of Stock'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingDish(dish); setShowDishModal(true); }}
                          className="p-1.5 rounded-lg bg-[#231d19] text-[#D6C8B2] hover:text-white"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDish(dish.id)}
                          className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. PAYMENT & RAZORPAY SETTINGS TAB */}
          {activeTab === 'payments' && (
            <div className="space-y-6 max-w-4xl font-mono text-xs">
              <div>
                <h2 className="font-display text-xl font-bold text-[#F3E9D8]">Payment Gateways & Store Controls</h2>
                <p className="text-xs text-[#A9865A]">Configure Razorpay keys, toggle payment modes, and store contacts</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* 4 Payment Switch Cards */}
                <div className="p-6 rounded-3xl bg-[#171310] border border-[#A9865A]/30 space-y-4">
                  <h3 className="font-bold text-[#E8AC4E] uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Customer Payment Modes Toggle
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Razorpay Toggle */}
                    <div className="p-4 rounded-2xl bg-[#231d19] border border-[#A9865A]/25 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#F3E9D8] block">Razorpay Online Gateway</span>
                        <span className="text-[10px] text-[#A9865A]">UPI, Cards, NetBanking, Wallets</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={adminSettings.enable_razorpay === 'true'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, enable_razorpay: e.target.checked ? 'true' : 'false' })}
                        className="w-5 h-5 text-[#D8632C] rounded"
                      />
                    </div>

                    {/* WhatsApp Orders */}
                    <div className="p-4 rounded-2xl bg-[#231d19] border border-[#A9865A]/25 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#F3E9D8] block">1-Click WhatsApp Ordering</span>
                        <span className="text-[10px] text-[#A9865A]">Pre-format ticket & send to chef</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={adminSettings.enable_whatsapp_order === 'true'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, enable_whatsapp_order: e.target.checked ? 'true' : 'false' })}
                        className="w-5 h-5 text-[#25D366] rounded"
                      />
                    </div>

                    {/* Direct UPI QR */}
                    <div className="p-4 rounded-2xl bg-[#231d19] border border-[#A9865A]/25 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#F3E9D8] block">Instant Direct UPI QR</span>
                        <span className="text-[10px] text-[#A9865A]">Scan with GPay / PhonePe / Paytm</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={adminSettings.enable_upi_qr === 'true'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, enable_upi_qr: e.target.checked ? 'true' : 'false' })}
                        className="w-5 h-5 text-[#E8AC4E] rounded"
                      />
                    </div>

                    {/* COD */}
                    <div className="p-4 rounded-2xl bg-[#231d19] border border-[#A9865A]/25 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#F3E9D8] block">Cash on Delivery (COD)</span>
                        <span className="text-[10px] text-[#A9865A]">Pay upon food delivery</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={adminSettings.enable_cod === 'true'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, enable_cod: e.target.checked ? 'true' : 'false' })}
                        className="w-5 h-5 text-[#E8AC4E] rounded"
                      />
                    </div>

                  </div>
                </div>

                {/* Razorpay Key Settings */}
                <div className="p-6 rounded-3xl bg-[#171310] border border-[#A9865A]/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#E8AC4E] uppercase tracking-wider">
                      Razorpay API Credentials
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className="text-[#A9865A] hover:text-[#F3E9D8] text-[10px] flex items-center gap-1"
                    >
                      {showSecretKey ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      <span>{showSecretKey ? 'Hide Secret' : 'Reveal Secret'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Razorpay Key ID</label>
                      <input
                        type="text"
                        placeholder="rzp_live_xxxxxxxx"
                        value={adminSettings.razorpay_key_id || ''}
                        onChange={(e) => setAdminSettings({ ...adminSettings, razorpay_key_id: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Razorpay Key Secret</label>
                      <input
                        type={showSecretKey ? "text" : "password"}
                        placeholder="••••••••••••••••"
                        value={adminSettings.razorpay_key_secret || ''}
                        onChange={(e) => setAdminSettings({ ...adminSettings, razorpay_key_secret: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-[#A9865A]">
                    💡 Automatic sandbox simulation is active if keys are left blank or set to test mode.
                  </p>
                </div>

                {/* Store Information */}
                <div className="p-6 rounded-3xl bg-[#171310] border border-[#A9865A]/30 space-y-4">
                  <h3 className="font-bold text-[#E8AC4E] uppercase tracking-wider">
                    Store Contacts & Operational Parameters
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        value={adminSettings.restaurant_name || ''}
                        onChange={(e) => setAdminSettings({ ...adminSettings, restaurant_name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">WhatsApp Order Number</label>
                      <input
                        type="text"
                        value={adminSettings.whatsapp_number || ''}
                        onChange={(e) => setAdminSettings({ ...adminSettings, whatsapp_number: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Kitchen Phone Number</label>
                      <input
                        type="text"
                        value={adminSettings.phone || ''}
                        onChange={(e) => setAdminSettings({ ...adminSettings, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">UPI ID for Direct QR</label>
                      <input
                        type="text"
                        value={adminSettings.upi_id || ''}
                        onChange={(e) => setAdminSettings({ ...adminSettings, upi_id: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[#D6C8B2] block mb-1">Physical Address</label>
                      <input
                        type="text"
                        value={adminSettings.address || ''}
                        onChange={(e) => setAdminSettings({ ...adminSettings, address: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Base Delivery Fee (₹)</label>
                      <input
                        type="number"
                        value={adminSettings.delivery_fee || '49'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, delivery_fee: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Free Delivery Above (₹)</label>
                      <input
                        type="number"
                        value={adminSettings.free_delivery_above || '499'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, free_delivery_above: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Cloudinary Cloud Storage Settings */}
                <div className="p-6 rounded-3xl bg-[#171310] border border-[#A9865A]/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-[#E8AC4E] uppercase tracking-wider flex items-center gap-2">
                        <Upload className="w-4 h-4 text-[#D8632C]" />
                        <span>Cloudinary CDN Image Upload Storage</span>
                      </h3>
                      <p className="text-[#A9865A] text-xs mt-0.5">
                        Upload dish cards, chef specials & banners directly to Cloudinary CDN
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {adminSettings.cloudinary_cloud_name && adminSettings.cloudinary_api_key ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#33402E] text-[#92b584] font-bold text-[10px] flex items-center gap-1 border border-[#33402E]">
                          <CheckCircle className="w-3 h-3" />
                          <span>Cloudinary Active</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-[#231d19] text-[#E8AC4E] font-bold text-[10px] border border-[#A9865A]/30">
                          Local Storage Fallback Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Cloudinary Cloud Name</label>
                      <input
                        type="text"
                        placeholder="e.g. your_cloud_name"
                        value={adminSettings.cloudinary_cloud_name || ''}
                        onChange={(e) => setAdminSettings({ ...adminSettings, cloudinary_cloud_name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs placeholder-[#A9865A]/50"
                      />
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Cloudinary API Key</label>
                      <input
                        type="text"
                        placeholder="e.g. 123456789012345"
                        value={adminSettings.cloudinary_api_key || ''}
                        onChange={(e) => setAdminSettings({ ...adminSettings, cloudinary_api_key: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs placeholder-[#A9865A]/50"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[#D6C8B2]">Cloudinary API Secret</label>
                        <button
                          type="button"
                          onClick={() => setShowSecretKey(!showSecretKey)}
                          className="text-[10px] text-[#A9865A] hover:text-[#E8AC4E] flex items-center gap-1"
                        >
                          {showSecretKey ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          <span>{showSecretKey ? 'Hide' : 'Reveal'}</span>
                        </button>
                      </div>
                      <input
                        type={showSecretKey ? "text" : "password"}
                        placeholder="••••••••••••••••••••••••••••"
                        value={adminSettings.cloudinary_api_secret || ''}
                        onChange={(e) => setAdminSettings({ ...adminSettings, cloudinary_api_secret: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs placeholder-[#A9865A]/50"
                      />
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Upload Folder</label>
                      <input
                        type="text"
                        placeholder="lamour_restaurant"
                        value={adminSettings.cloudinary_folder || 'lamour_restaurant'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, cloudinary_folder: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs placeholder-[#A9865A]/50"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-[#A9865A]">
                    ⚡ If Cloudinary keys are configured, images are uploaded directly to Cloudinary CDN with automatic WebP/auto-compression. If not set, uploads gracefully fallback to local server disk storage.
                  </p>
                </div>

                {/* Delivery Geo-Fencing & Service Area (Burdwan, West Bengal, India) */}
                <div className="p-6 rounded-3xl bg-[#171310] border border-[#A9865A]/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-[#E8AC4E] uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#D8632C]" />
                        <span>Delivery Zones & Regional Geo-Fencing</span>
                      </h3>
                      <p className="text-[#A9865A] text-xs mt-0.5">
                        Restrict online order delivery strictly to Burdwan (Purba Bardhaman), West Bengal, India
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {adminSettings.delivery_restriction_enabled !== 'false' ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#33402E] text-[#92b584] font-bold text-[10px] flex items-center gap-1 border border-[#33402E]">
                          <CheckCircle className="w-3 h-3" />
                          <span>Burdwan Geo-Fence Active</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-[#231d19] text-amber-300 font-bold text-[10px] border border-amber-500/30">
                          Open Worldwide
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Enforce Regional Restriction</label>
                      <select
                        value={adminSettings.delivery_restriction_enabled !== 'false' ? 'true' : 'false'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, delivery_restriction_enabled: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs"
                      >
                        <option value="true">Strict (Deliver Only in Burdwan Zone)</option>
                        <option value="false">Disabled (Accept All Locations)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Deliverable Country</label>
                      <input
                        type="text"
                        value={adminSettings.delivery_allowed_country || 'India'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, delivery_allowed_country: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Deliverable State</label>
                      <input
                        type="text"
                        value={adminSettings.delivery_allowed_state || 'West Bengal'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, delivery_allowed_state: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Deliverable City / District</label>
                      <input
                        type="text"
                        value={adminSettings.delivery_allowed_city || 'Burdwan'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, delivery_allowed_city: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[#D6C8B2] block mb-1">Allowed Pincodes (comma-separated)</label>
                      <input
                        type="text"
                        placeholder="713101, 713102, 713103, 713104, 713105"
                        value={adminSettings.delivery_allowed_pincodes || '713101, 713102, 713103, 713104, 713105'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, delivery_allowed_pincodes: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[#D6C8B2] block mb-1">Deliverable Neighborhoods / Hotspot Areas</label>
                      <textarea
                        rows={2}
                        value={adminSettings.delivery_allowed_areas || 'Curzon Gate, Golapbag, Badamtala, Khagragarh, Alisha, Baburbag, Birhata, Nutanganj, Bajepratappur, Ullhas, Borehat, Radhanagar, Shaktigarh'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, delivery_allowed_areas: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs resize-none"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-[#A9865A]">
                    📍 Any delivery address entered at checkout that falls outside Burdwan (Purba Bardhaman), West Bengal, India will be politely prompted with an active zone alert.
                  </p>
                </div>

                {/* SMTP & Automated Email Notifications Settings */}
                <div className="p-6 rounded-3xl bg-[#171310] border border-[#A9865A]/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-[#E8AC4E] uppercase tracking-wider flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#D8632C]" />
                        <span>SMTP & Automated Email Notifications</span>
                      </h3>
                      <p className="text-[#A9865A] text-xs mt-0.5">
                        Automated emails for registrations, login alerts, forgot password OTPs, order invoices & live tracking, reservations, and Smoke Club newsletters
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {adminSettings.enable_email_notifications !== 'false' ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#33402E] text-[#92b584] font-bold text-[10px] flex items-center gap-1 border border-[#33402E]">
                          <CheckCircle className="w-3 h-3" />
                          <span>Email System Active</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-[#231d19] text-red-400 font-bold text-[10px] border border-red-500/30">
                          Disabled
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Enable Automated Emails</label>
                      <select
                        value={adminSettings.enable_email_notifications !== 'false' ? 'true' : 'false'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, enable_email_notifications: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs"
                      >
                        <option value="true">Active (Send Emails On All Events)</option>
                        <option value="false">Mute / Disabled</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">Admin Alert Notification Email</label>
                      <input
                        type="email"
                        placeholder="admin@restaurant.com"
                        value={adminSettings.admin_notification_email || ''}
                        onChange={(e) => setAdminSettings({ ...adminSettings, admin_notification_email: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs placeholder-[#A9865A]/50"
                      />
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">SMTP Host</label>
                      <input
                        type="text"
                        placeholder="smtp.gmail.com"
                        value={adminSettings.smtp_host || 'smtp.gmail.com'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, smtp_host: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs placeholder-[#A9865A]/50"
                      />
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">SMTP Port</label>
                      <input
                        type="number"
                        placeholder="587"
                        value={adminSettings.smtp_port || '587'}
                        onChange={(e) => setAdminSettings({ ...adminSettings, smtp_port: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs placeholder-[#A9865A]/50"
                      />
                    </div>

                    <div>
                      <label className="text-[#D6C8B2] block mb-1">SMTP Username / Email</label>
                      <input
                        type="text"
                        placeholder="your_email@gmail.com"
                        value={adminSettings.smtp_user || ''}
                        onChange={(e) => setAdminSettings({ ...adminSettings, smtp_user: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs placeholder-[#A9865A]/50"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[#D6C8B2]">SMTP Password / App Password</label>
                        <button
                          type="button"
                          onClick={() => setShowSmtpPass(!showSmtpPass)}
                          className="text-[10px] text-[#A9865A] hover:text-[#E8AC4E] flex items-center gap-1"
                        >
                          {showSmtpPass ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          <span>{showSmtpPass ? 'Hide' : 'Reveal'}</span>
                        </button>
                      </div>
                      <input
                        type={showSmtpPass ? "text" : "password"}
                        placeholder="••••••••••••••••"
                        value={adminSettings.smtp_pass || ''}
                        onChange={(e) => setAdminSettings({ ...adminSettings, smtp_pass: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs placeholder-[#A9865A]/50"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[#D6C8B2] block mb-1">Sender "From" Email Display Name & Address</label>
                      <input
                        type="text"
                        placeholder="L'Amour Gourmet <notifications@lamourgourmet.com>"
                        value={adminSettings.smtp_from || "L'Amour Gourmet & Grill <contact@lamourgourmet.com>"}
                        onChange={(e) => setAdminSettings({ ...adminSettings, smtp_from: e.target.value })}
                        className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-xl text-white font-mono text-xs placeholder-[#A9865A]/50"
                      />
                    </div>
                  </div>

                  {/* Send Live Test Email Card */}
                  <div className="p-4 rounded-2xl bg-[#0f0c0a] border border-[#A9865A]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="w-full sm:w-auto">
                      <span className="font-bold text-[#E8AC4E] text-xs block">Test Email Dispatch</span>
                      <p className="text-[10px] text-[#A9865A]">Verify your SMTP configuration by dispatching a test email</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <input
                        type="email"
                        placeholder="recipient@example.com"
                        value={testEmailTarget}
                        onChange={(e) => setTestEmailTarget(e.target.value)}
                        className="px-3 py-1.5 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white text-xs font-mono w-full sm:w-48"
                      />
                      <button
                        type="button"
                        disabled={testingEmail}
                        onClick={handleSendTestEmail}
                        className="px-4 py-1.5 rounded-xl bg-[#231d19] hover:bg-[#332b25] text-[#E8AC4E] border border-[#A9865A]/40 font-bold text-xs flex items-center gap-1.5 shrink-0"
                      >
                        {testingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        <span>Send Test</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#A9865A]">
                    💡 Works with any SMTP provider (Gmail App Passwords, Brevo, SendGrid, Amazon SES, Outlook). When SMTP credentials are left blank, all email notifications run in sandbox simulation mode without breaking.
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn-ember-primary px-8 py-3.5 rounded-full font-sans font-bold text-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings & Payment Modes</span>
                </button>

              </form>
            </div>
          )}

          {/* 5. CUSTOMER ACCOUNTS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#F3E9D8]">Customer Directory & Accounts</h2>
                  <p className="text-xs text-[#A9865A]">View customer profiles, total orders fired, and lifetime spend</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#A9865A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by customer..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                  />
                </div>
              </div>

              <div className="rounded-3xl bg-[#171310] border border-[#A9865A]/30 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#120f0d] text-[#A9865A] border-b border-[#A9865A]/20">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Orders</th>
                      <th className="p-4">Lifetime Spend</th>
                      <th className="p-4">Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#A9865A]/15 text-[#D6C8B2]">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#231d19]/40">
                        <td className="p-4 font-bold text-[#F3E9D8] flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#D8632C]/20 text-[#E8AC4E] flex items-center justify-center font-bold">
                            {u.name ? u.name[0] : 'U'}
                          </span>
                          <span>{u.name}</span>
                        </td>
                        <td className="p-4 text-[#A9865A]">{u.email}</td>
                        <td className="p-4">{u.phone || '—'}</td>
                        <td className="p-4 font-bold text-[#E8AC4E]">{u.total_orders}</td>
                        <td className="p-4 font-bold text-[#92b584]">₹{u.total_spent}</td>
                        <td className="p-4 text-[#A9865A] truncate max-w-xs">{u.address || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* VIP Smoke Club Newsletter Subscribers */}
              <div className="p-6 rounded-3xl bg-[#171310] border border-[#A9865A]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#E8AC4E]" />
                    <h3 className="font-bold text-[#F3E9D8] text-sm">VIP Smoke Club Subscribers ({subscribers.length})</h3>
                  </div>
                  <span className="text-[10px] bg-[#231d19] text-[#E8AC4E] px-2.5 py-1 rounded-full border border-[#A9865A]/30 font-bold">
                    Automated 20% Promo Sent
                  </span>
                </div>

                {subscribers.length === 0 ? (
                  <p className="text-[#A9865A] text-xs">No email subscribers yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto">
                    {subscribers.map((sub) => (
                      <div key={sub.id} className="p-2.5 rounded-xl bg-[#231d19] border border-[#A9865A]/20 flex items-center justify-between text-xs">
                        <span className="text-[#F3E9D8] truncate max-w-[180px]">{sub.email}</span>
                        <span className="text-[10px] text-[#A9865A] shrink-0">{new Date(sub.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delivery Fleet & Registered Riders */}
              <div className="p-6 rounded-3xl bg-[#171310] border border-[#A9865A]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Bike className="w-5 h-5 text-[#D8632C]" />
                    <div>
                      <h3 className="font-bold text-[#F3E9D8] text-sm">Delivery Fleet & Registered Riders ({ridersList.length})</h3>
                      <p className="text-xs text-[#A9865A]">Manage delivery partners, assign credentials & view delivery metrics</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddRiderModal(true)}
                    className="btn-ember-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Register New Rider</span>
                  </button>
                </div>

                {ridersList.length === 0 ? (
                  <p className="text-[#A9865A] text-xs">No registered delivery riders yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ridersList.map((rider) => (
                      <div key={rider.id} className="p-4 rounded-2xl bg-[#231d19] border border-[#A9865A]/25 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-[#F3E9D8] flex items-center gap-1.5">
                              <Bike className="w-4 h-4 text-[#D8632C]" />
                              <span>{rider.name}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#33402E] text-[#92b584] font-mono text-[9px] font-bold">
                              Active Partner
                            </span>
                          </div>
                          <p className="text-xs text-[#E8AC4E]">📞 {rider.phone}</p>
                          <p className="text-[11px] text-[#A9865A]">{rider.email}</p>
                          <p className="text-[11px] text-[#D6C8B2] truncate">🛵 {rider.address || 'Express Thermal Bike'}</p>
                        </div>

                        <div className="pt-2 border-t border-[#A9865A]/15 flex items-center justify-between text-[11px]">
                          <span className="text-[#92b584] font-bold">
                            ✓ {rider.completed_deliveries || 0} Delivered
                          </span>
                          <button
                            onClick={() => handleDeleteRider(rider.id, rider.name)}
                            className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[10px]"
                            title="Remove Rider"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. TABLE BOOKINGS TAB */}
          {activeTab === 'reservations' && (
            <div className="space-y-6 font-mono text-xs">
              <div>
                <h2 className="font-display text-xl font-bold text-[#F3E9D8]">Table Reservations</h2>
                <p className="text-xs text-[#A9865A]">Review party sizes, dates, and assign seating</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reservations.map((res) => (
                  <div key={res.id} className="p-5 rounded-2xl bg-[#171310] border border-[#A9865A]/30 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-[#F3E9D8] text-sm">{res.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          res.status === 'confirmed' ? 'bg-[#33402E] text-[#92b584]' : 'bg-[#231d19] text-[#E8AC4E]'
                        }`}>
                          {res.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-1 text-[#D6C8B2]">
                        <p>👥 <strong>{res.guests} Guests</strong> • {res.seating_type}</p>
                        <p>📅 {res.reservation_date} at <strong>{res.reservation_time}</strong></p>
                        <p>📞 <a href={`tel:${res.phone}`} className="text-[#E8AC4E] hover:underline">{res.phone}</a></p>
                        {res.special_request && (
                          <p className="text-[11px] text-[#A9865A] bg-[#231d19] p-2 rounded mt-2">
                            "{res.special_request}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#A9865A]/20 flex items-center gap-2">
                      <button
                        onClick={() => handleReservationStatus(res.id, 'confirmed')}
                        className="flex-1 py-1.5 bg-[#33402E] hover:bg-[#3f4f39] text-[#92b584] rounded-lg font-bold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleReservationStatus(res.id, 'seated')}
                        className="flex-1 py-1.5 bg-[#231d19] hover:bg-[#332b25] text-[#E8AC4E] rounded-lg font-bold"
                      >
                        Seated
                      </button>
                      <button
                        onClick={() => handleReservationStatus(res.id, 'cancelled')}
                        className="py-1.5 px-2 bg-red-950/40 hover:bg-red-900 text-red-400 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. REVIEWS MODERATION TAB */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 font-mono text-xs">
              <div>
                <h2 className="font-display text-xl font-bold text-[#F3E9D8]">Customer Reviews Moderation</h2>
                <p className="text-xs text-[#A9865A]">Approve or hide customer testimonials</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-[#171310] border border-[#A9865A]/30 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-bold text-[#F3E9D8] text-sm block">{rev.user_name}</span>
                          <span className="text-[10px] text-[#A9865A]">({rev.dish_name})</span>
                        </div>
                        <div className="flex text-[#E8AC4E] text-xs">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>
                      <p className="text-[#D6C8B2] leading-relaxed">"{rev.comment}"</p>
                    </div>

                    <div className="pt-3 border-t border-[#A9865A]/20 flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rev.status === 'approved' ? 'bg-[#33402E] text-[#92b584]' : 'bg-red-950 text-red-300'
                      }`}>
                        Status: {rev.status}
                      </span>

                      <div className="flex items-center gap-2">
                        {rev.status !== 'approved' ? (
                          <button
                            onClick={() => handleReviewStatus(rev.id, 'approved')}
                            className="px-3 py-1 bg-[#33402E] text-[#92b584] font-bold rounded-lg"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReviewStatus(rev.id, 'hidden')}
                            className="px-3 py-1 bg-[#231d19] text-[#A9865A] font-bold rounded-lg"
                          >
                            Hide
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1 text-red-400 hover:text-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Dish Modal */}
      {showDishModal && editingDish && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#231d19] border border-[#A9865A]/40 rounded-3xl overflow-hidden shadow-2xl p-6 text-white my-8 font-mono text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-[#F3E9D8]">{editingDish.id ? 'Edit Dish Plate' : 'Add New Culinary Dish'}</h3>
              <button onClick={() => setShowDishModal(false)} className="p-1 rounded bg-[#171310] text-[#A9865A]">✕</button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-3">
              <div>
                <label className="text-[#D6C8B2] block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#D6C8B2] block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingDish.price}
                    onChange={(e) => setEditingDish({ ...editingDish, price: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-[#D6C8B2] block mb-1">Original Price</label>
                  <input
                    type="number"
                    value={editingDish.original_price || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, original_price: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#D6C8B2] block mb-1">Category</label>
                <select
                  value={editingDish.category}
                  onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-lg text-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Dish Image: File Upload & URL */}
              <div className="space-y-2">
                <label className="text-[#D6C8B2] block mb-1">Dish Image (Upload File or Paste URL)</label>
                
                {/* Upload Action Row */}
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <label className="w-full sm:w-auto flex-1 cursor-pointer p-2.5 rounded-xl bg-[#171310] border border-dashed border-[#A9865A]/40 hover:border-[#E8AC4E] flex items-center justify-center gap-2 text-center text-slate-300 hover:text-white transition-colors">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 text-[#D8632C] animate-spin" />
                        <span>Uploading Image to Server...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-[#E8AC4E]" />
                        <span>Choose File from Device (JPG, PNG, WebP)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct URL input */}
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-[#A9865A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Or paste direct image URL (https://... or /uploads/...)"
                    value={editingDish.image || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, image: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white placeholder-[#A9865A]/50 focus:outline-none focus:border-[#D8632C]"
                  />
                </div>

                {/* Instant Preview */}
                {editingDish.image && (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-[#171310] border border-[#A9865A]/20">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-black shrink-0 border border-[#A9865A]/30">
                      <img src={editingDish.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate flex-1">
                      <span className="text-[10px] text-[#92b584] block font-bold">● Image Attached</span>
                      <span className="text-[10px] text-[#A9865A] truncate block">{editingDish.image}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingDish({ ...editingDish, image: '' })}
                      className="p-1 rounded bg-red-950/50 text-red-400 hover:text-red-200"
                      title="Clear image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[#D6C8B2] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingDish.description || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  className="w-full p-2 bg-[#171310] border border-[#A9865A]/30 rounded-lg text-white resize-none"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDish.is_veg === 1}
                    onChange={(e) => setEditingDish({ ...editingDish, is_veg: e.target.checked ? 1 : 0 })}
                  />
                  <span>Pure Veg</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDish.is_spicy === 1}
                    onChange={(e) => setEditingDish({ ...editingDish, is_spicy: e.target.checked ? 1 : 0 })}
                  />
                  <span>Spicy</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDish.is_bestseller === 1}
                    onChange={(e) => setEditingDish({ ...editingDish, is_bestseller: e.target.checked ? 1 : 0 })}
                  />
                  <span>Chef Bestseller</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn-ember-primary w-full py-2.5 mt-4 rounded-full font-sans font-bold"
              >
                Save Dish Plate
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Register New Rider Modal */}
      {showAddRiderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#231d19] border border-[#A9865A]/40 rounded-3xl p-6 text-[#F3E9D8] font-mono text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#A9865A]/20">
              <h3 className="font-bold text-sm text-[#E8AC4E] flex items-center gap-2">
                <Bike className="w-4 h-4 text-[#D8632C]" />
                <span>Register New Delivery Partner</span>
              </h3>
              <button onClick={() => setShowAddRiderModal(false)} className="p-1 rounded bg-[#171310] text-[#A9865A] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRider} className="space-y-3">
              <div>
                <label className="text-[#D6C8B2] block mb-1">Rider Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Express"
                  value={newRiderData.name}
                  onChange={(e) => setNewRiderData({ ...newRiderData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                />
              </div>

              <div>
                <label className="text-[#D6C8B2] block mb-1">Rider Login Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul.rider@restaurant.com"
                  value={newRiderData.email}
                  onChange={(e) => setNewRiderData({ ...newRiderData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                />
              </div>

              <div>
                <label className="text-[#D6C8B2] block mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newRiderData.password}
                  onChange={(e) => setNewRiderData({ ...newRiderData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                />
              </div>

              <div>
                <label className="text-[#D6C8B2] block mb-1">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={newRiderData.phone}
                  onChange={(e) => setNewRiderData({ ...newRiderData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                />
              </div>

              <div>
                <label className="text-[#D6C8B2] block mb-1">Vehicle Details & Registration</label>
                <input
                  type="text"
                  placeholder="e.g. Hero Splendor • WB 02 AX 1234"
                  value={newRiderData.vehicle}
                  onChange={(e) => setNewRiderData({ ...newRiderData, vehicle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                />
              </div>

              <div>
                <label className="text-[#D6C8B2] block mb-1">Station Hub / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Express Delivery Hub 4"
                  value={newRiderData.address}
                  onChange={(e) => setNewRiderData({ ...newRiderData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                />
              </div>

              <button
                type="submit"
                disabled={creatingRider}
                className="btn-ember-primary w-full py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 mt-2"
              >
                {creatingRider ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bike className="w-4 h-4" />}
                <span>Create Rider Account</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
