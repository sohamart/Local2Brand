import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Navigation, 
  CheckCircle, 
  Clock, 
  Flame, 
  DollarSign, 
  TrendingUp, 
  Radio, 
  RefreshCw, 
  X, 
  LogOut, 
  AlertCircle, 
  ChevronRight, 
  ShieldCheck, 
  Loader2,
  PackageCheck,
  Star,
  ExternalLink,
  Key,
  Smartphone
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DeliveryDashboard({ onClose }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'active' | 'history'
  
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ completedCount: 0, totalEarnings: 0, rating: 4.9 });
  
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [gpsActive, setGpsActive] = useState(true);
  const [lastGpsPing, setLastGpsPing] = useState(null);
  const [notification, setNotification] = useState('');

  // Delivery Handover OTP Modal State
  const [otpModalOrder, setOtpModalOrder] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const loadRiderData = async () => {
    try {
      const [available, myActive, historyData] = await Promise.all([
        api.getDriverAvailableOrders().catch(() => []),
        api.getDriverActiveOrders().catch(() => []),
        api.getDriverHistory().catch(() => ({ history: [], stats: {} }))
      ]);

      setAvailableOrders(available || []);
      setActiveDeliveries(myActive || []);
      setHistory(historyData.history || []);
      if (historyData.stats) setStats(historyData.stats);
    } catch (err) {
      console.error('Failed to load rider data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRiderData();
    const interval = setInterval(loadRiderData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Broadcast real physical GPS location periodically when active orders exist
  useEffect(() => {
    if (!gpsActive || !activeDeliveries.length) return;

    const broadcastGps = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            await api.updateDriverLocation(pos.coords.latitude, pos.coords.longitude).catch(() => {});
            setLastGpsPing(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          },
          () => {},
          { enableHighAccuracy: true, timeout: 5000 }
        );
      }
    };

    broadcastGps();
    const gpsInterval = setInterval(broadcastGps, 8000);
    return () => clearInterval(gpsInterval);
  }, [gpsActive, activeDeliveries.length]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRiderData();
  };

  const handleAcceptOrder = async (orderId) => {
    setActionLoadingId(orderId);
    try {
      const vehicle = 'Express Thermal Bike (DL 04 EV 8892)';
      const res = await api.acceptDriverOrder(orderId, vehicle);
      showToast(res.message || `Order #${orderId} accepted! Drive safe.`);
      setActiveTab('active');
      await loadRiderData();
    } catch (err) {
      alert('Failed to accept order: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateLocation = async (lat, lng, desc) => {
    try {
      await api.updateDriverLocation(lat, lng);
      setLastGpsPing(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      showToast(`🛰️ GPS: ${desc}`);
      await loadRiderData();
    } catch (err) {
      alert('Failed to update GPS: ' + err.message);
    }
  };

  const handleManualLocationPing = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await api.updateDriverLocation(pos.coords.latitude, pos.coords.longitude);
          setLastGpsPing(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          showToast(`🛰️ Real GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          await loadRiderData();
        },
        () => {
          showToast('GPS permission not granted. Use quick location buttons.');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      showToast('Geolocation not supported in browser');
    }
  };

  const handleVerifyAndDeliver = async (e) => {
    e.preventDefault();
    if (!otpModalOrder) return;
    if (!otpInput || otpInput.trim().length < 4) {
      setOtpError('Please enter the 4-digit customer handover PIN');
      return;
    }

    setActionLoadingId(otpModalOrder.id);
    setOtpError('');
    try {
      const res = await api.updateDriverOrderStatus(otpModalOrder.id, {
        order_status: 'delivered',
        payment_status: 'paid',
        otp: otpInput.trim()
      });
      showToast(res.message || `✅ Order #${otpModalOrder.id} verified with OTP and marked delivered!`);
      setOtpModalOrder(null);
      setOtpInput('');
      setActiveTab('history');
      await loadRiderData();
    } catch (err) {
      setOtpError(err.message || 'Incorrect Delivery OTP PIN. Please ask customer for the PIN on their screen.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md p-0 sm:p-4 md:p-6 flex items-start justify-center text-[#F3E9D8] font-sans">
      <div 
        className="relative w-full max-w-4xl min-h-screen sm:min-h-0 sm:my-6 bg-[#171310] border-0 sm:border sm:border-[#A9865A]/40 rounded-none sm:rounded-3xl overflow-hidden shadow-2xl space-y-0 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Toast Notification */}
        {notification && (
          <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-3.5 rounded-2xl bg-[#231d19] border-2 border-[#E8AC4E] text-[#E8AC4E] font-mono text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="truncate">{notification}</span>
          </div>
        )}

        {/* 1. Mobile-First Sticky Top Header Bar */}
        <div className="sticky top-0 z-30 bg-[#0f0c0a]/95 backdrop-blur-md border-b border-[#A9865A]/25 p-3.5 sm:p-5 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={user?.profile_image || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Rider'}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover border-2 border-[#E8AC4E] shadow shrink-0"
              />
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#171310] ${isOnline ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-sm sm:text-lg font-bold text-[#F3E9D8] truncate">
                  {user?.name || 'Vikram Express'}
                </h2>
                <span className="px-2 py-0.5 rounded bg-[#33402E] text-[#92b584] text-[9px] font-mono font-bold shrink-0 border border-[#92b584]/30">
                  Delivery Partner
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-[#A9865A] font-mono truncate block">
                {user?.vehicle || user?.address || 'Express Thermal Partner'}
              </span>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Duty Online/Offline Pill */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-mono text-[11px] sm:text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isOnline 
                  ? 'bg-[#33402E] text-[#92b584] border-[#92b584]/40 shadow-sm shadow-emerald-500/20' 
                  : 'bg-[#231d19] text-[#A9865A] border-[#A9865A]/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#92b584] animate-ping' : 'bg-gray-500'}`}></span>
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-1.5 sm:p-2 rounded-xl bg-[#231d19] hover:bg-[#2c241f] text-[#E8AC4E] border border-[#A9865A]/30 transition-all"
              title="Refresh dispatch feed"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Close Modal Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-[#231d19] border border-[#A9865A]/30 text-[#A9865A] hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Responsive 4-Stat Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5 p-3 sm:p-5 bg-[#14100e] border-b border-[#A9865A]/20 font-mono">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#1c1613] border border-[#A9865A]/20">
            <span className="text-[9px] sm:text-[10px] text-[#A9865A] uppercase block font-bold">In Your Bag</span>
            <span className="text-lg sm:text-xl font-bold text-[#E8AC4E]">{activeDeliveries.length}</span>
            <span className="text-[9px] text-[#D6C8B2] block truncate">active orders</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#1c1613] border border-[#A9865A]/20">
            <span className="text-[9px] sm:text-[10px] text-[#A9865A] uppercase block font-bold">Kitchen Hot</span>
            <span className="text-lg sm:text-xl font-bold text-[#D8632C]">{availableOrders.length}</span>
            <span className="text-[9px] text-[#D6C8B2] block truncate">ready for pickup</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#1c1613] border border-[#A9865A]/20">
            <span className="text-[9px] sm:text-[10px] text-[#A9865A] uppercase block font-bold">Completed</span>
            <span className="text-lg sm:text-xl font-bold text-[#92b584]">{stats.completedCount || history.length}</span>
            <span className="text-[9px] text-[#D6C8B2] block truncate">delivered today</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#1c1613] border border-[#A9865A]/20">
            <span className="text-[9px] sm:text-[10px] text-[#A9865A] uppercase block font-bold">Today's Payout</span>
            <span className="text-lg sm:text-xl font-bold text-[#F3E9D8]">₹{stats.totalEarnings || (history.length * 40)}</span>
            <span className="text-[9px] text-[#D6C8B2] block truncate">₹40/drop incentive</span>
          </div>
        </div>

        {/* 3. Mobile-First Navigation Tab Bar */}
        <div className="flex border-b border-[#A9865A]/20 bg-[#120e0c] p-1.5 font-mono text-[11px] sm:text-xs">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'available'
                ? 'bg-[#E8AC4E] text-[#171310] font-bold shadow'
                : 'text-[#D6C8B2] hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#D8632C]" />
            <span>Pickups ({availableOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'active'
                ? 'bg-[#E8AC4E] text-[#171310] font-bold shadow'
                : 'text-[#D6C8B2] hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>In Bag ({activeDeliveries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-[#E8AC4E] text-[#171310] font-bold shadow'
                : 'text-[#D6C8B2] hover:text-white'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>History ({history.length})</span>
          </button>
        </div>

        {/* 4. Tab Contents Body */}
        <div className="p-3.5 sm:p-6 flex-1 space-y-4">
          
          {loading ? (
            <div className="py-16 text-center font-mono">
              <Loader2 className="w-8 h-8 text-[#D8632C] animate-spin mx-auto mb-3" />
              <p className="text-xs text-[#A9865A]">Connecting to live kitchen dispatch feed...</p>
            </div>
          ) : null}

          {/* TAB 1: KITCHEN PICKUPS (Orders Fired and Ready for Driver) */}
          {activeTab === 'available' && !loading && (
            <div className="space-y-3 sm:space-y-4 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-[#F3E9D8]">Fresh from Kitchen Tandoor</h3>
                  <p className="text-[11px] sm:text-xs text-[#A9865A]">Accept tickets to pack into your thermal insulated bag</p>
                </div>
                <span className="text-[10px] text-[#92b584] self-start sm:self-auto font-bold bg-[#33402E]/30 px-2 py-0.5 rounded border border-[#33402E]">
                  ● Dispatch Live
                </span>
              </div>

              {availableOrders.length === 0 ? (
                <div className="py-12 px-4 rounded-2xl bg-[#0f0c0a] border border-[#A9865A]/25 text-center space-y-2.5">
                  <PackageCheck className="w-10 h-10 text-[#A9865A]/50 mx-auto" />
                  <p className="text-sm font-bold text-[#F3E9D8]">No pending kitchen orders waiting right now</p>
                  <p className="text-xs text-[#A9865A]">All cooked dishes are currently dispatched or plated. Stand by for new orders!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {availableOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="p-4 sm:p-5 rounded-2xl bg-[#231d19] border border-[#A9865A]/40 space-y-3 shadow-lg flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between border-b border-[#A9865A]/20 pb-2.5">
                          <div>
                            <span className="font-bold text-sm sm:text-base text-[#E8AC4E]">#{order.id}</span>
                            <span className="text-[10px] text-[#A9865A] block mt-0.5">
                              {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.items?.length || 0} Dishes
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-[#A9865A] block">AMOUNT</span>
                            <span className="text-sm sm:text-base font-bold text-[#F3E9D8]">₹{order.total}</span>
                          </div>
                        </div>

                        {/* Customer & Address */}
                        <div className="space-y-1 text-xs">
                          <span className="text-[10px] text-[#A9865A] uppercase block font-bold">Delivery Destination</span>
                          <p className="text-[#F3E9D8] font-bold text-xs line-clamp-2">{order.delivery_address}</p>
                          <span className="text-[10px] text-[#D6C8B2] block">Customer: {order.customer_name}</span>
                        </div>

                        {/* Dishes Checklist Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {order.items && order.items.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-[#171310] border border-[#A9865A]/20 text-[10px] text-[#D6C8B2]">
                              {item.name} ×{item.quantity}
                            </span>
                          ))}
                          {order.items && order.items.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-[#171310] text-[10px] text-[#E8AC4E]">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Accept CTA Button */}
                      <button
                        onClick={() => handleAcceptOrder(order.id)}
                        disabled={actionLoadingId === order.id}
                        className="btn-ember-primary w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mt-2 shadow-lg"
                      >
                        {actionLoadingId === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Bike className="w-4 h-4" />
                        )}
                        <span>Accept & Pick Up Order</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE ORDERS IN DELIVERY BAG */}
          {activeTab === 'active' && !loading && (
            <div className="space-y-3 sm:space-y-4 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-[#F3E9D8]">Orders In Your Thermal Bag</h3>
                  <p className="text-[11px] sm:text-xs text-[#A9865A]">Navigate, update telemetry & handover with 4-digit PIN</p>
                </div>
                {lastGpsPing && (
                  <span className="text-[10px] text-[#92b584] flex items-center gap-1 self-start sm:self-auto font-bold bg-[#33402E]/30 px-2 py-0.5 rounded border border-[#33402E]">
                    <Radio className="w-3 h-3 animate-ping" />
                    <span>GPS Ping: {lastGpsPing}</span>
                  </span>
                )}
              </div>

              {activeDeliveries.length === 0 ? (
                <div className="py-12 px-4 rounded-2xl bg-[#0f0c0a] border border-[#A9865A]/25 text-center space-y-3">
                  <Bike className="w-10 h-10 text-[#A9865A]/50 mx-auto" />
                  <p className="text-sm font-bold text-[#F3E9D8]">No active deliveries in your bag</p>
                  <p className="text-xs text-[#A9865A]">Check the "Pickups" tab to accept available hot orders from the kitchen.</p>
                  <button
                    onClick={() => setActiveTab('available')}
                    className="btn-ember-primary px-5 py-2 rounded-full text-xs font-bold mt-2"
                  >
                    View Kitchen Pickups
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeDeliveries.map((order) => {
                    const rawCustomerPhone = (order.customer_phone || '').replace(/[^0-9]/g, '');
                    const customerWhatsAppText = encodeURIComponent(`Hi ${order.customer_name}, I am Vikram from L'Amour Gourmet. I am on my way with your hot food order #${order.id} and will arrive shortly.`);
                    const mapsNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.delivery_address)}`;

                    return (
                      <div key={order.id} className="p-4 sm:p-5 rounded-2xl bg-[#231d19] border border-[#E8AC4E]/40 space-y-3.5 shadow-xl">
                        
                        {/* Header Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#A9865A]/20 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm sm:text-base text-[#E8AC4E]">#{order.id}</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#D8632C] text-[#171310] text-[9px] font-bold">
                                IN TRANSIT
                              </span>
                              {order.payment_method === 'cod' ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/40">
                                  💵 CASH: ₹{order.total}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/40">
                                  ✓ PAID ONLINE: ₹{order.total}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#A9865A] block mt-0.5">
                              {order.items?.length || 0} Dishes • Hot Packed
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-[#A9865A] block">COLLECT</span>
                            <span className="text-sm sm:text-base font-bold text-[#F3E9D8]">
                              {order.payment_method === 'cod' ? `₹${order.total}` : '₹0 (Prepaid)'}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Address Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Customer Card */}
                          <div className="p-3 rounded-xl bg-[#171310] border border-[#A9865A]/20 space-y-1.5">
                            <span className="text-[10px] text-[#A9865A] uppercase block font-bold">Customer Contact</span>
                            <strong className="text-[#F3E9D8] text-xs block truncate">{order.customer_name}</strong>
                            
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              <a
                                href={`tel:${order.customer_phone}`}
                                className="px-2.5 py-1.5 rounded-lg bg-[#231d19] hover:bg-[#332b25] text-[11px] font-bold text-[#E8AC4E] border border-[#A9865A]/30 flex items-center justify-center gap-1 truncate"
                              >
                                <Phone className="w-3.5 h-3.5 shrink-0" />
                                <span>Call</span>
                              </a>

                              <a
                                href={`https://wa.me/${rawCustomerPhone}?text=${customerWhatsAppText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[11px] font-bold text-[#25D366] border border-[#25D366]/40 flex items-center justify-center gap-1 truncate"
                              >
                                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>

                          {/* Address & Google Maps Navigation */}
                          <div className="p-3 rounded-xl bg-[#171310] border border-[#A9865A]/20 space-y-1.5 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] text-[#A9865A] uppercase block font-bold">Destination Address</span>
                              <p className="text-[#F3E9D8] font-bold text-xs line-clamp-2">{order.delivery_address}</p>
                              {order.delivery_notes && (
                                <p className="text-[10px] text-[#E8AC4E] italic truncate">"{order.delivery_notes}"</p>
                              )}
                            </div>

                            <a
                              href={mapsNavUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-1.5 rounded-lg bg-[#33402E]/60 hover:bg-[#33402E] text-[11px] text-[#92b584] border border-[#92b584]/40 font-bold flex items-center justify-center gap-1.5 transition-colors mt-1"
                            >
                              <Navigation className="w-3.5 h-3.5 shrink-0" />
                              <span>Google Maps Navigation →</span>
                            </a>
                          </div>
                        </div>

                        {/* GPS Location Telemetry Controller for Rider */}
                        <div className="p-3 rounded-xl bg-[#171310] border border-[#A9865A]/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-[#A9865A] uppercase font-bold flex items-center gap-1.5">
                              <Radio className="w-3 h-3 text-[#D8632C] animate-ping shrink-0" />
                              <span>Live GPS Broadcast</span>
                            </span>
                            <button
                              type="button"
                              onClick={handleManualLocationPing}
                              className="text-[10px] text-[#92b584] hover:underline font-bold flex items-center gap-1"
                            >
                              <Smartphone className="w-3 h-3" />
                              <span>Phone GPS</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[10px]">
                            <button
                              type="button"
                              onClick={() => handleUpdateLocation(22.5726, 88.3639, 'Kitchen Hub (0.0 km)')}
                              className="py-1.5 px-2 rounded-lg bg-[#231d19] hover:bg-[#2f2721] text-[#D6C8B2] border border-[#A9865A]/30 text-center transition-all hover:border-[#E8AC4E] truncate"
                            >
                              📍 Kitchen
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateLocation(22.5770, 88.3680, 'Main Road (1.2 km away)')}
                              className="py-1.5 px-2 rounded-lg bg-[#231d19] hover:bg-[#2f2721] text-[#E8AC4E] border border-[#A9865A]/30 text-center transition-all hover:border-[#E8AC4E] truncate"
                            >
                              🛵 Main Road
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateLocation(22.5820, 88.3730, 'Near Customer (0.4 km away)')}
                              className="py-1.5 px-2 rounded-lg bg-[#231d19] hover:bg-[#2f2721] text-[#E8AC4E] border border-[#A9865A]/30 text-center transition-all hover:border-[#E8AC4E] truncate"
                            >
                              🏘️ Near Street
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateLocation(22.5850, 88.3750, 'At Doorstep (0.0 km)')}
                              className="py-1.5 px-2 rounded-lg bg-[#33402E] hover:bg-[#3d4d37] text-[#92b584] border border-[#92b584]/40 font-bold text-center transition-all hover:border-[#92b584] truncate"
                            >
                              🏁 At Doorstep
                            </button>
                          </div>
                        </div>

                        {/* Handover & Verify OTP CTA Button */}
                        <div className="pt-1">
                          <button
                            onClick={() => {
                              setOtpModalOrder(order);
                              setOtpInput('');
                              setOtpError('');
                            }}
                            disabled={actionLoadingId === order.id}
                            className="btn-ember-primary w-full py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
                          >
                            <Key className="w-4 h-4 text-[#171310] shrink-0" />
                            <span>
                              {order.payment_method === 'cod' 
                                ? `🔐 Verify PIN & Collect ₹${order.total} Cash` 
                                : '🔐 Verify Customer PIN & Complete Handover'}
                            </span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DELIVERED HISTORY & EARNINGS */}
          {activeTab === 'history' && !loading && (
            <div className="space-y-3 sm:space-y-4 font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-[#F3E9D8]">Delivery History & Completed Drops</h3>
                  <p className="text-[11px] sm:text-xs text-[#A9865A]">Your completed food deliveries and earned payouts</p>
                </div>
              </div>

              {history.length === 0 ? (
                <div className="py-12 px-4 rounded-2xl bg-[#0f0c0a] border border-[#A9865A]/25 text-center space-y-2">
                  <CheckCircle className="w-10 h-10 text-[#A9865A]/50 mx-auto" />
                  <p className="text-sm font-bold text-[#F3E9D8]">No completed deliveries logged yet</p>
                  <p className="text-xs text-[#A9865A]">Accept orders in the Pickups tab to build your delivery streak and daily earnings!</p>
                </div>
              ) : (
                <div className="divide-y divide-[#A9865A]/15 bg-[#0f0c0a] rounded-2xl border border-[#A9865A]/25 overflow-hidden">
                  {history.map((order) => (
                    <div key={order.id} className="p-3.5 sm:p-4 hover:bg-[#171310] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-[#E8AC4E]">#{order.id}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[9px] font-bold">
                            ✓ DELIVERED
                          </span>
                          <span className="text-[10px] text-[#A9865A]">
                            {new Date(order.updated_at || order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-[#D6C8B2] truncate max-w-sm">{order.delivery_address}</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
                        <div className="text-left sm:text-right">
                          <span className="text-[9px] text-[#A9865A] block">ORDER TOTAL</span>
                          <span className="font-bold text-xs text-[#F3E9D8]">₹{order.total}</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-xl bg-[#33402E] text-[#92b584] border border-[#92b584]/30 text-xs font-bold">
                          +₹{order.delivery_fee > 0 ? order.delivery_fee : 40} Earned
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* 5. Mobile-Optimized Delivery Handover OTP Verification Modal */}
        {otpModalOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
            <div 
              className="relative w-full max-w-md bg-[#231d19] border-2 border-[#E8AC4E] rounded-3xl p-5 sm:p-6 text-[#F3E9D8] font-mono shadow-2xl space-y-4 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#A9865A]/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E8AC4E]/20 border border-[#E8AC4E]/40 flex items-center justify-center text-[#E8AC4E]">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#F3E9D8]">Delivery Handover Verification</h4>
                    <span className="text-[10px] text-[#A9865A]">Order #{otpModalOrder.id}</span>
                  </div>
                </div>

                <button
                  onClick={() => { setOtpModalOrder(null); setOtpInput(''); setOtpError(''); }}
                  className="p-1.5 rounded-lg bg-[#171310] text-[#A9865A] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleVerifyAndDeliver} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-[#171310] border border-[#A9865A]/25 space-y-1">
                  <span className="text-[10px] text-[#A9865A] uppercase block font-bold">Customer Handover Instructions</span>
                  <p className="text-xs text-[#D6C8B2]">
                    Ask <strong>{otpModalOrder.customer_name}</strong> for the 4-digit PIN code displayed on their live order screen.
                  </p>
                  {otpModalOrder.payment_method === 'cod' && (
                    <div className="mt-2 p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      <span>Collect ₹{otpModalOrder.total} Cash Payment</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] text-[#E8AC4E] block mb-1 font-bold text-center">
                    Enter 4-Digit Handover PIN:
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={4}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="••••"
                    value={otpInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setOtpInput(val);
                      setOtpError('');
                    }}
                    className="w-full py-3 px-4 bg-[#171310] border-2 border-[#E8AC4E] rounded-2xl text-[#E8AC4E] text-center font-bold text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#D8632C]"
                  />
                </div>

                {otpError && (
                  <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setOtpModalOrder(null); setOtpInput(''); setOtpError(''); }}
                    className="py-3 px-4 rounded-xl bg-[#171310] border border-[#A9865A]/30 text-xs font-bold text-[#A9865A] hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={actionLoadingId === otpModalOrder.id || otpInput.length < 4}
                    className="btn-ember-primary flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoadingId === otpModalOrder.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    <span>Verify PIN & Complete Delivery</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
