import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Bike, 
  Home, 
  Phone, 
  MapPin, 
  Receipt, 
  AlertCircle,
  RefreshCw,
  Printer,
  Sparkles,
  MessageSquare,
  Star,
  Download,
  Share2,
  ShieldCheck,
  Send,
  Loader2,
  User,
  CheckCircle,
  Key
} from 'lucide-react';
import { api } from '../services/api';
import { printBillReceipt } from '../utils/printBill';

const KITCHEN_STAMPS = [
  { key: 'received', stampNum: '01', title: 'TICKET FIRED', desc: 'Order received & routed to clay tandoor chef' },
  { key: 'preparing', stampNum: '02', title: 'IN TANDOOR', desc: 'Charcoal grilled over slow-dum flame' },
  { key: 'out_for_delivery', stampNum: '03', title: 'RIDER EN ROUTE', desc: 'Thermal hot box dispatched with assigned rider' },
  { key: 'delivered', stampNum: '04', title: 'DELIVERED', desc: 'Plated & delivered hot to your destination' }
];

function calculateHaversineKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function OrderTrackerModal({ orderId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('tracker'); // 'tracker' | 'invoice' | 'review'

  // Review Form inside tracker
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewDish, setReviewDish] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fetchTracking = async () => {
    if (!orderId) return;
    try {
      const res = await api.trackOrder(orderId);
      setData(res);
      setError('');
      if (res.order?.items?.[0] && !reviewDish) {
        setReviewDish(res.order.items[0].name);
      }
    } catch (err) {
      setError('Kitchen ticket not found. Please verify order ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (!orderId) return null;

  const order = data?.order;
  const restaurant = data?.restaurant;

  const getStageIndex = () => {
    if (!order) return 0;
    if (order.order_status === 'cancelled') return -1;
    const idx = KITCHEN_STAMPS.findIndex(s => s.key === order.order_status);
    return idx === -1 ? 0 : idx;
  };

  const currentStageIdx = getStageIndex();

  const handlePrint = () => {
    if (order) {
      printBillReceipt(order, restaurant || {});
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!order) return;
    setSubmittingReview(true);
    try {
      await api.submitReview({
        user_name: order.customer_name || 'Valued Guest',
        email: order.customer_email || '',
        rating,
        comment: reviewComment || 'Delicious artisanal food with prompt delivery!',
        dish_name: reviewDish || (order.items?.[0]?.name || 'Special Charcoal Platter')
      });
      setReviewSubmitted(true);
    } catch (err) {
      alert('Failed to submit review: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const driverPhone = order?.driver_phone || '+919830055443';
  const driverName = order?.driver_name || 'Vikram Express';
  const rawDriverWhatsApp = driverPhone.replace(/[^0-9]/g, '');
  const driverWhatsAppText = encodeURIComponent(`Hi ${driverName}, I am tracking my L'Amour Gourmet order #${orderId} for delivery at ${order?.delivery_address || 'my address'}. Could you please update me on your current location and ETA?`);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-0 sm:p-4 md:p-6 flex items-start justify-center">
      <div 
        className="relative w-full max-w-2xl min-h-screen sm:min-h-0 sm:my-6 bg-[#171310] border-0 sm:border sm:border-[#A9865A]/40 rounded-none sm:rounded-3xl overflow-hidden shadow-2xl text-[#F3E9D8] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-[#0f0c0a]/95 backdrop-blur-md border-b border-[#A9865A]/25 p-4 sm:p-5 flex items-center justify-between gap-2 no-print">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#231d19] border border-[#A9865A]/30 flex items-center justify-center text-[#D8632C] shrink-0">
              <Flame className="w-4 h-4 fill-[#D8632C]" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm sm:text-base font-bold text-[#E8AC4E] tracking-tight">
                  TICKET #{orderId}
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#D8632C] animate-pulse"></span>
              </div>
              <span className="text-[10px] text-[#A9865A] font-mono block truncate">
                {order ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'} • {order?.payment_method?.toUpperCase() || 'COD'}
              </span>
            </div>
          </div>

          {/* Action Tabs & Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#231d19] border border-[#A9865A]/30 text-xs font-mono text-[#F3E9D8] hover:text-[#E8AC4E] hover:border-[#E8AC4E] flex items-center gap-1.5 transition-colors"
              title="Print Tax Bill / Receipt"
            >
              <Printer className="w-3.5 h-3.5 text-[#E8AC4E]" />
              <span className="hidden sm:inline">Print Bill</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#231d19] border border-[#A9865A]/30 text-[#A9865A] hover:text-white transition-colors"
              title="Close Tracker"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex border-b border-[#A9865A]/20 bg-[#120e0c] p-1 font-mono text-xs no-print">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'tracker'
                ? 'bg-[#E8AC4E] text-[#171310] font-bold shadow'
                : 'text-[#D6C8B2] hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Live Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('invoice')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'invoice'
                ? 'bg-[#E8AC4E] text-[#171310] font-bold shadow'
                : 'text-[#D6C8B2] hover:text-white'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Tax Invoice & Bill</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'review'
                ? 'bg-[#E8AC4E] text-[#171310] font-bold shadow'
                : 'text-[#D6C8B2] hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-[#D8632C]" />
            <span>Rate Feast</span>
          </button>
        </div>

        {/* Body Content */}
        {loading ? (
          <div className="p-14 text-center font-mono">
            <Loader2 className="w-8 h-8 text-[#D8632C] animate-spin mx-auto mb-3" />
            <p className="text-xs text-[#A9865A]">Connecting to clay oven telemetry & dispatch sensors...</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center font-mono">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="font-bold text-sm text-red-400">{error}</p>
          </div>
        ) : (
          <div className="p-4 sm:p-6 space-y-6">

            {/* TAB 1: LIVE TRACKER VIEW */}
            {activeTab === 'tracker' && (
              <div className="space-y-6">
                
                {/* 1. ETA & Status Hero Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#231d19] to-[#1a1512] border border-[#A9865A]/35 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#A9865A]/20 pb-3">
                    <div>
                      <span className="text-[10px] text-[#A9865A] font-mono uppercase tracking-widest block">Estimated Arrival Time</span>
                      <span className="text-2xl sm:text-3xl font-display font-bold text-[#E8AC4E]">
                        {order.order_status === 'delivered' ? 'DELIVERED TO DESTINATION' : (order.estimated_delivery_time || '30-40 mins')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                        order.order_status === 'delivered'
                          ? 'bg-[#33402E] text-[#92b584] border-[#92b584]/40'
                          : 'bg-[#D8632C]/20 text-[#D8632C] border-[#D8632C]/40'
                      }`}>
                        {order.order_status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs font-mono text-[#D6C8B2]">
                    <MapPin className="w-4 h-4 text-[#D8632C] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-[#A9865A] block">DELIVERY DESTINATION:</span>
                      <span className="text-[#F3E9D8]">{order.delivery_address}</span>
                      {order.delivery_notes && (
                        <p className="text-[11px] text-[#E8AC4E] mt-0.5">Note: "{order.delivery_notes}"</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 1.5. Delivery Handover Secret OTP PIN for Customer */}
                {order.delivery_otp && order.order_status !== 'delivered' && order.order_status !== 'cancelled' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#231d19] to-[#1c1613] border-2 border-[#E8AC4E]/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E8AC4E]/20 border border-[#E8AC4E]/50 flex items-center justify-center text-[#E8AC4E] shrink-0">
                        <Key className="w-5 h-5 text-[#E8AC4E]" />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A9865A] uppercase tracking-wider block font-bold">
                          Delivery Handover OTP PIN
                        </span>
                        <span className="text-xs text-[#D6C8B2]">
                          Share this 4-digit code with your rider upon food handover:
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <div className="px-4 py-2 rounded-xl bg-[#120e0c] border border-[#E8AC4E] text-[#E8AC4E] font-display text-2xl font-bold tracking-widest shadow-inner">
                        {order.delivery_otp}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Assigned Delivery Rider Card with Live Chat & Calling */}
                <div className="p-4 rounded-2xl bg-[#0f0c0a] border border-[#A9865A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={order.driver_image || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=80'}
                        alt={driverName}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-[#E8AC4E] shadow-md shrink-0"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0f0c0a]"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#F3E9D8]">{driverName}</span>
                        <span className="px-2 py-0.5 rounded bg-[#33402E] text-[#92b584] font-mono text-[9px] font-bold">Assigned Rider</span>
                      </div>
                      <span className="text-[11px] text-[#A9865A] font-mono block">{order.driver_vehicle || 'Express Thermal Bike (DL 04 EV 8892)'}</span>
                      <span className="text-[10px] text-[#92b584] font-mono flex items-center gap-1 mt-0.5">
                        <span>● Verified Delivery Partner • Active GPS</span>
                      </span>
                    </div>
                  </div>

                  {/* Rider Communication Buttons */}
                  <div className="flex items-center gap-2 font-mono">
                    <a
                      href={`tel:${driverPhone}`}
                      className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#231d19] hover:bg-[#2e2621] border border-[#A9865A]/40 text-xs text-[#F3E9D8] font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#E8AC4E]" />
                      <span>Call Rider</span>
                    </a>

                    <a
                      href={`https://wa.me/${rawDriverWhatsApp}?text=${driverWhatsAppText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-xs text-[#25D366] font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>Live WhatsApp Chat</span>
                    </a>
                  </div>
                </div>

                {/* 3. Milestone Timeline */}
                <div className="space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#A9865A] uppercase tracking-wider font-bold">
                      Order Milestones
                    </span>
                    <span className="text-[10px] text-[#E8AC4E]">Live Status Updates</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {KITCHEN_STAMPS.map((stamp, idx) => {
                      const isDone = currentStageIdx >= idx;
                      const isCurrent = currentStageIdx === idx;

                      return (
                        <div
                          key={stamp.key}
                          className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                            isCurrent
                              ? 'bg-[#231d19] border-[#D8632C] shadow-lg shadow-[#D8632C]/10 text-white'
                              : isDone
                              ? 'bg-[#1a2118] border-[#33402E] text-[#D6C8B2]'
                              : 'bg-[#0f0c0a] border-[#231d19] text-[#716154] opacity-60'
                          }`}
                        >
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCurrent
                              ? 'bg-[#D8632C] text-[#171310]'
                              : isDone
                              ? 'bg-[#33402E] text-[#92b584]'
                              : 'bg-[#171310] text-[#716154]'
                          }`}>
                            {isDone && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : stamp.stampNum}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`font-bold text-xs block truncate ${isCurrent ? 'text-[#E8AC4E]' : ''}`}>{stamp.title}</span>
                              {isCurrent && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#D8632C] text-[#171310]">
                                  IN PROGRESS
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#A9865A] leading-tight block mt-0.5">{stamp.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Graphical Live Location Tracking & Distance HUD */}
                {(() => {
                  const restLat = 22.5726;
                  const restLng = 88.3639;
                  const destLat = 22.5850;
                  const destLng = 88.3750;

                  const totalTripKm = calculateHaversineKm(restLat, restLng, destLat, destLng) || 3.2;

                  const isDelivered = order.order_status === 'delivered';
                  const isEnRoute = order.order_status === 'out_for_delivery';
                  const isPreparing = order.order_status === 'preparing';

                  // Real coordinates of driver from DB
                  const driverLat = order.driver_lat ? parseFloat(order.driver_lat) : restLat;
                  const driverLng = order.driver_lng ? parseFloat(order.driver_lng) : restLng;

                  const rawDistRemaining = calculateHaversineKm(driverLat, driverLng, destLat, destLng);

                  let currentKmRemaining = totalTripKm.toFixed(1);
                  let computedProgress = 5;

                  if (isDelivered) {
                    currentKmRemaining = '0.0';
                    computedProgress = 100;
                  } else if (isEnRoute) {
                    if (rawDistRemaining !== null) {
                      currentKmRemaining = Math.max(0.1, rawDistRemaining).toFixed(1);
                      const coveredKm = Math.max(0, totalTripKm - rawDistRemaining);
                      computedProgress = Math.min(95, Math.max(25, Math.round((coveredKm / totalTripKm) * 100)));
                    } else {
                      currentKmRemaining = '1.8';
                      computedProgress = 45;
                    }
                  } else if (isPreparing) {
                    currentKmRemaining = totalTripKm.toFixed(1);
                    computedProgress = 15;
                  } else {
                    currentKmRemaining = totalTripKm.toFixed(1);
                    computedProgress = 5;
                  }

                  const currentEtaMins = isDelivered
                    ? 'Delivered'
                    : isEnRoute
                    ? `~${Math.max(2, Math.round(parseFloat(currentKmRemaining) * 3.5))} mins`
                    : isPreparing
                    ? '~20-25 mins'
                    : '~30-35 mins';

                  const currentSpeedKmh = isDelivered ? '0 km/h' : isEnRoute ? '32 km/h' : '0 km/h';

                  const currentRiderLocationDesc = isDelivered
                    ? '📍 Arrived & Plated at Your Doorstep'
                    : isEnRoute
                    ? (computedProgress < 40 
                        ? '🛵 Dispatched from Kitchen Hub' 
                        : computedProgress < 70 
                        ? '📍 In Transit on Main Arterial Route' 
                        : computedProgress < 90
                        ? '⚡ Entering Your Neighborhood / Street'
                        : '🏁 Arriving at Your Gate / Doorstep')
                    : isPreparing
                    ? '🔥 Clay Tandoor • Freshly Grilling & Packaging in Thermal Box'
                    : '📋 Central Kitchen Dispatch Center • Order Placed';

                  return (
                    <div className="rounded-3xl bg-[#0f0c0a] border border-[#A9865A]/40 overflow-hidden shadow-2xl font-mono text-xs space-y-0">
                      
                      {/* Header Status Bar with Live GPS Telemetry */}
                      <div className="p-4 bg-gradient-to-r from-[#1c1613] to-[#14100e] border-b border-[#A9865A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-[#A9865A] uppercase tracking-wider block font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#D8632C] animate-ping"></span>
                            <span>Rider Live Location Telemetry</span>
                          </span>
                          <p className="text-sm font-bold text-[#E8AC4E] mt-0.5">{currentRiderLocationDesc}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-[#33402E] text-[#92b584] text-[10px] font-bold border border-[#92b584]/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#92b584] animate-pulse"></span>
                            <span>Live GPS: {driverLat.toFixed(4)}, {driverLng.toFixed(4)}</span>
                          </span>
                        </div>
                      </div>

                      {/* 4-Stat Metrics Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-[#120e0c] border-b border-[#A9865A]/15">
                        <div className="p-3 rounded-2xl bg-[#1c1613] border border-[#A9865A]/20">
                          <span className="text-[10px] text-[#A9865A] uppercase block">Distance to You</span>
                          <span className="text-lg font-bold text-[#E8AC4E]">{currentKmRemaining} km</span>
                          <span className="text-[9px] text-[#D6C8B2] block">from your address</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[#1c1613] border border-[#A9865A]/20">
                          <span className="text-[10px] text-[#A9865A] uppercase block">Estimated Time</span>
                          <span className="text-lg font-bold text-[#D8632C]">{currentEtaMins}</span>
                          <span className="text-[9px] text-[#D6C8B2] block">live route ETA</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[#1c1613] border border-[#A9865A]/20">
                          <span className="text-[10px] text-[#A9865A] uppercase block">Rider Speed</span>
                          <span className="text-lg font-bold text-[#92b584]">{currentSpeedKmh}</span>
                          <span className="text-[9px] text-[#D6C8B2] block">thermal bike</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[#1c1613] border border-[#A9865A]/20">
                          <span className="text-[10px] text-[#A9865A] uppercase block">Food Box Temp</span>
                          <span className="text-lg font-bold text-[#F3E9D8]">68°C Hot</span>
                          <span className="text-[9px] text-[#D6C8B2] block">insulated pack</span>
                        </div>
                      </div>

                      {/* Graphical Animated Route Radar Canvas */}
                      <div className="relative p-5 sm:p-6 bg-[#0f0c0a] space-y-6 overflow-hidden">
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#E8AC4E_1px,transparent_1px)] [background-size:20px_20px]"></div>

                        {/* Dynamic Progress Track Line */}
                        <div className="relative z-10 space-y-2">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-[#A9865A] font-bold">Route Progress</span>
                            <span className="text-[#E8AC4E] font-bold">
                              {isDelivered ? '100% Completed' : `${computedProgress}% Traveled • ${currentKmRemaining} km to go`}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="relative w-full h-3 rounded-full bg-[#1c1613] border border-[#A9865A]/30 overflow-hidden shadow-inner">
                            <div 
                              className="h-full bg-gradient-to-r from-[#D8632C] via-[#E8AC4E] to-[#92b584] transition-all duration-700 rounded-full"
                              style={{ width: `${computedProgress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Landmark Roadmap Nodes (Graphical 4-Point Route) */}
                        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                          
                          {/* Node 1: Kitchen */}
                          <div className={`p-3 rounded-2xl border transition-all ${
                            computedProgress >= 0 ? 'bg-[#1c1613] border-[#D8632C]/60 text-white shadow-lg' : 'bg-[#120e0c] border-[#A9865A]/20 text-[#716154]'
                          }`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Flame className="w-3.5 h-3.5 text-[#D8632C]" />
                              <span className="text-[10px] font-bold text-[#E8AC4E]">0.0 km</span>
                            </div>
                            <strong className="text-xs text-[#F3E9D8] block">Kitchen Hub</strong>
                            <span className="text-[10px] text-[#A9865A] block leading-tight">Clay Tandoor Oven</span>
                          </div>

                          {/* Node 2: Expressway */}
                          <div className={`p-3 rounded-2xl border transition-all ${
                            computedProgress >= 40 ? 'bg-[#1c1613] border-[#E8AC4E]/60 text-white shadow-lg' : 'bg-[#120e0c] border-[#A9865A]/20 text-[#716154]'
                          }`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Bike className="w-3.5 h-3.5 text-[#E8AC4E]" />
                              <span className="text-[10px] font-bold text-[#E8AC4E]">1.2 km</span>
                            </div>
                            <strong className="text-xs text-[#F3E9D8] block">Main Boulevard</strong>
                            <span className="text-[10px] text-[#A9865A] block leading-tight">Flyover Junction</span>
                          </div>

                          {/* Node 3: Local Sector */}
                          <div className={`p-3 rounded-2xl border transition-all ${
                            computedProgress >= 75 ? 'bg-[#1c1613] border-[#E8AC4E]/60 text-white shadow-lg' : 'bg-[#120e0c] border-[#A9865A]/20 text-[#716154]'
                          }`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <MapPin className="w-3.5 h-3.5 text-[#E8AC4E]" />
                              <span className="text-[10px] font-bold text-[#E8AC4E]">2.4 km</span>
                            </div>
                            <strong className="text-xs text-[#F3E9D8] block">Sector Perimeter</strong>
                            <span className="text-[10px] text-[#A9865A] block leading-tight">Neighborhood Entry</span>
                          </div>

                          {/* Node 4: Destination */}
                          <div className={`p-3 rounded-2xl border transition-all ${
                            isDelivered || computedProgress >= 90 ? 'bg-[#1e261b] border-[#92b584] text-white shadow-lg shadow-[#92b584]/20' : 'bg-[#120e0c] border-[#A9865A]/20 text-[#716154]'
                          }`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <MapPin className="w-3.5 h-3.5 text-[#92b584]" />
                              <span className="text-[10px] font-bold text-[#92b584]">3.2 km (Goal)</span>
                            </div>
                            <strong className="text-xs text-[#92b584] block truncate">Your Doorstep</strong>
                            <span className="text-[10px] text-[#D6C8B2] block truncate">{order.delivery_address}</span>
                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })()}

                {/* 5. Plated Dishes Quick View */}
                <div className="p-4 rounded-2xl bg-[#0f0c0a] border border-[#A9865A]/25 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#A9865A] pb-2 border-b border-[#A9865A]/20">
                    <span className="uppercase text-[10px] font-bold">Ordered Dishes</span>
                    <span>{order.items?.length || 0} Items Fired</span>
                  </div>

                  <div className="divide-y divide-[#A9865A]/15">
                    {order.items && order.items.map((i, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <span className="text-[#F3E9D8]">{i.name} <strong className="text-[#E8AC4E]">×{i.quantity}</strong></span>
                        <span className="font-bold text-[#F3E9D8]">₹{i.price * i.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#A9865A]/30 flex justify-between font-bold text-sm">
                    <span className="text-[#D6C8B2]">Total Amount</span>
                    <span className="text-[#E8AC4E]">₹{order.total}</span>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: ITEMIZED GST BILL / TAX INVOICE */}
            {activeTab === 'invoice' && (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between no-print">
                  <div>
                    <h4 className="font-bold text-sm text-[#F3E9D8]">Official Restaurant Tax Invoice</h4>
                    <p className="text-[11px] text-[#A9865A] font-mono">GST & FSSAI Compliant Thermal Receipt</p>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="btn-ember-primary px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Bill / PDF</span>
                  </button>
                </div>

                {/* PRINTABLE BILL WRAPPER */}
                <div id="printable-bill-area" className="bg-[#FAF8F5] text-[#171310] p-6 sm:p-8 rounded-2xl shadow-xl font-mono text-xs border border-[#A9865A]/40 space-y-4">
                  
                  {/* Restaurant Header */}
                  <div className="text-center pb-4 border-b-2 border-dashed border-[#171310]/30 space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-base font-bold text-[#171310] tracking-tight font-display">
                      <span>🔥 L'AMOUR GOURMET & GRILL</span>
                    </div>
                    <p className="text-[11px] text-[#554433]">{restaurant?.name || "L'Amour Fine Dining"}</p>
                    <p className="text-[10px] text-[#665544]">Park Avenue, Gourmet Boulevard • Hotline: +91 98765 43210</p>
                    <p className="text-[9px] text-[#887766] pt-1">
                      FSSAI Lic: <strong>12823019000452</strong> • GSTIN: <strong>19AAACL2890P1Z4</strong>
                    </p>
                  </div>

                  {/* Bill Details Info */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pb-3 border-b border-[#171310]/20">
                    <div>
                      <span className="text-[#665544] block text-[9px] uppercase font-bold">INVOICE NUMBER</span>
                      <strong className="text-[#171310]">{order.id}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[#665544] block text-[9px] uppercase font-bold">DATE & TIME</span>
                      <span>{new Date(order.created_at).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#665544] block text-[9px] uppercase font-bold">CUSTOMER</span>
                      <strong className="text-[#171310]">{order.customer_name}</strong>
                      <span className="block text-[10px] text-[#554433]">{order.customer_phone}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#665544] block text-[9px] uppercase font-bold">PAYMENT MODE</span>
                      <strong className="uppercase text-[#171310]">{order.payment_method}</strong>
                      <span className="block text-[10px] text-emerald-700 font-bold uppercase">{order.payment_status || 'PAID'}</span>
                    </div>
                  </div>

                  {/* Delivery Destination */}
                  <div className="pb-3 border-b border-[#171310]/20 text-[11px]">
                    <span className="text-[#665544] block text-[9px] uppercase font-bold">DELIVERY ADDRESS</span>
                    <span className="text-[#171310]">{order.delivery_address}</span>
                  </div>

                  {/* Itemized Table */}
                  <div>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b-2 border-[#171310]/30 text-[10px] text-[#554433] uppercase">
                          <th className="py-1.5">Item Description</th>
                          <th className="py-1.5 text-center">Qty</th>
                          <th className="py-1.5 text-right">Price</th>
                          <th className="py-1.5 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#171310]/10 text-xs">
                        {order.items && order.items.map((item, idx) => (
                          <tr key={idx} className="py-1.5">
                            <td className="py-2 font-bold text-[#171310]">{item.name}</td>
                            <td className="py-2 text-center text-[#554433]">{item.quantity}</td>
                            <td className="py-2 text-right text-[#554433]">₹{item.price}</td>
                            <td className="py-2 text-right font-bold text-[#171310]">₹{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Calculations & Tax Breakdown */}
                  <div className="pt-3 border-t-2 border-dashed border-[#171310]/30 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#554433]">
                      <span>Subtotal</span>
                      <span>₹{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[#554433]">
                      <span>CGST (2.5%)</span>
                      <span>₹{(order.subtotal * 0.025).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#554433]">
                      <span>SGST (2.5%)</span>
                      <span>₹{(order.subtotal * 0.025).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#554433]">
                      <span>Delivery Fee</span>
                      <span>{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Discount Applied</span>
                        <span>-₹{order.discount}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t-2 border-[#171310] flex justify-between font-bold text-base text-[#171310]">
                      <span>GRAND TOTAL</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>

                  {/* Footer Notes */}
                  <div className="text-center pt-4 border-t border-[#171310]/20 text-[10px] text-[#665544] space-y-1">
                    <p className="font-bold text-[#171310]">Thank you for dining with L'Amour Gourmet!</p>
                    <p>For instant order queries, WhatsApp: +91 98765 43210</p>
                    <p className="text-[8px] text-[#887766]">This is a computer generated invoice and does not require physical signature.</p>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: RATE YOUR FEAST & LEAVE REVIEW */}
            {activeTab === 'review' && (
              <div className="space-y-5 font-mono">
                <div>
                  <h4 className="font-display text-lg font-bold text-[#F3E9D8]">Rate Your Artisanal Feast</h4>
                  <p className="text-xs text-[#A9865A]">Your feedback directly reaches our master tandoor chefs</p>
                </div>

                {reviewSubmitted ? (
                  <div className="p-8 rounded-2xl bg-[#0f0c0a] border border-[#33402E] text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#33402E] text-[#92b584] flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h5 className="font-bold text-[#F3E9D8] text-base">Review Received!</h5>
                    <p className="text-xs text-[#92b584]">
                      Thank you for reviewing your experience. A thank you voucher has been noted for your next feast!
                    </p>
                    <button
                      onClick={() => setActiveTab('tracker')}
                      className="btn-ember-primary px-6 py-2 rounded-full text-xs font-bold mt-2"
                    >
                      Back to Live Tracker
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-[#0f0c0a] border border-[#A9865A]/30 space-y-4">
                    
                    {/* Star Rating Selector */}
                    <div>
                      <label className="text-xs text-[#D6C8B2] block mb-2 font-bold">Overall Star Rating</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-2xl transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                (hoverRating || rating) >= star
                                  ? 'text-[#E8AC4E] fill-[#E8AC4E]'
                                  : 'text-[#A9865A]/40'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs text-[#E8AC4E] font-bold ml-2">
                          {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional' : rating === 4 ? '⭐⭐⭐⭐ Great' : `${rating} Stars`}
                        </span>
                      </div>
                    </div>

                    {/* Dish Selection */}
                    {order.items && order.items.length > 0 && (
                      <div>
                        <label className="text-xs text-[#D6C8B2] block mb-1">Highlight a Dish</label>
                        <select
                          value={reviewDish}
                          onChange={(e) => setReviewDish(e.target.value)}
                          className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white text-xs focus:outline-none focus:border-[#D8632C]"
                        >
                          {order.items.map((i, idx) => (
                            <option key={idx} value={i.name}>{i.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Comment */}
                    <div>
                      <label className="text-xs text-[#D6C8B2] block mb-1">Your Review & Comments</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Tell us about the spice balance, charcoal smokiness, and hot delivery..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white text-xs placeholder-[#A9865A]/50 focus:outline-none focus:border-[#D8632C]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="btn-ember-primary w-full py-3 rounded-full font-sans font-bold text-xs flex items-center justify-center gap-2"
                    >
                      {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>Submit Chef Review</span>
                    </button>

                  </form>
                )}

              </div>
            )}

          </div>
        )}

        {/* Footer info bar */}
        <div className="bg-[#0f0c0a] border-t border-[#A9865A]/20 p-3 sm:p-4 text-center font-mono text-[11px] text-[#A9865A] flex flex-col sm:flex-row items-center justify-between gap-2 no-print">
          <span>🔥 Clay Tandoor & Charcoal Grill Heritage</span>
          <span>Need Help? Hotline: <a href="tel:+919876543210" className="text-[#E8AC4E] hover:underline">+91 98765 43210</a></span>
        </div>

      </div>
    </div>
  );
}
