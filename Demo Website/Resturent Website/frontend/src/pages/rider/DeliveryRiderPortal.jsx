import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  Bike,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Clock,
  KeyRound,
  ShieldCheck,
  DollarSign,
  Sparkles,
  Award,
  Package,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const DeliveryRiderPortal = () => {
  const { activeRestaurant } = useTenant();
  const { orders, riders, grabOrder, verifyDeliveryOtp } = useCart();
  const { currentUser } = useAuth();

  // Active logged-in rider or default demo rider
  const currentRider = riders.find(r => r.name.includes(currentUser?.name || 'Vikram')) || riders[0];

  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('pool'); // 'pool', 'active', 'history'
  const [selectedOtpOrder, setSelectedOtpOrder] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');

  // Ready orders available in the pool to grab
  const poolOrders = orders.filter(
    o => o.orderType === 'delivery' && o.orderStatus === 'ready' && !o.assignedRider
  );

  // Active trips assigned to this rider
  const activeTrips = orders.filter(
    o => o.orderType === 'delivery' && o.orderStatus === 'out_for_delivery' &&
    (o.assignedRider?.id === currentRider.id || o.assignedRider?.name === currentRider.name)
  );

  // Completed trips by this rider
  const completedTrips = orders.filter(
    o => o.orderStatus === 'delivered' &&
    (o.assignedRider?.id === currentRider.id || o.assignedRider?.name === currentRider.name)
  );

  const handleGrabOrder = (orderId) => {
    grabOrder(orderId, {
      id: currentRider.id,
      name: currentRider.name,
      phone: currentRider.phone,
      avatar: currentRider.avatar,
      vehicleNumber: currentRider.vehicleNumber
    });
    setActiveTab('active');
  };

  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpSuccess('');

    if (!selectedOtpOrder) return;
    const res = verifyDeliveryOtp(selectedOtpOrder.id, otpInput);
    if (!res.success) {
      setOtpError(res.message);
    } else {
      setOtpSuccess(res.message);
      setTimeout(() => {
        setSelectedOtpOrder(null);
        setOtpInput('');
        setOtpSuccess('');
        setActiveTab('history');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] pb-24 text-slate-100">
      
      {/* Mobile-optimized Header */}
      <div className="bg-[#0e111a] border-b border-white/10 p-4 sticky top-[45px] z-30 shadow-2xl backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentRider.avatar}
                alt={currentRider.name}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-400/40 shadow-lg"
              />
              <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0e111a] ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-heading font-extrabold text-white text-sm sm:text-base leading-tight">
                  {currentRider.name}
                </h2>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  ★ {currentRider.rating}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                {currentRider.vehicleNumber}
              </div>
            </div>
          </div>

          {/* Duty Online / Offline Switch */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden sm:inline">
              {isOnline ? 'On Duty' : 'Off Duty'}
            </span>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm ${
                isOnline
                  ? 'bg-emerald-500 text-black shadow-emerald-glow'
                  : 'bg-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>{isOnline ? 'ONLINE' : 'GO ONLINE'}</span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Quick Earnings & Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-panel p-3.5 rounded-2xl border border-white/10 text-center space-y-0.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Today Earnings</div>
            <div className="text-base sm:text-lg font-extrabold text-amber-400">
              ₹{(completedTrips.length * 60) + 180}
            </div>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl border border-white/10 text-center space-y-0.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Completed</div>
            <div className="text-base sm:text-lg font-extrabold text-emerald-400">
              {completedTrips.length} Trips
            </div>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl border border-white/10 text-center space-y-0.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Ready Pool</div>
            <div className="text-base sm:text-lg font-extrabold text-white animate-pulse">
              {poolOrders.length} Ready
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('pool')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pool' ? 'bg-amber-500 text-black shadow-gold-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Ready to Grab ({poolOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'active' ? 'bg-amber-500 text-black shadow-gold-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Active Trip ({activeTrips.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'history' ? 'bg-amber-500 text-black shadow-gold-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed ({completedTrips.length})</span>
          </button>
        </div>

        {/* TAB 1: READY ORDERS POOL (FIRST-COME FIRST-SERVE GRAB) */}
        {activeTab === 'pool' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Kitchen Ready Orders Pool (Claim Now)</span>
              </h3>
              <span className="text-[11px] text-slate-400">First-come, first-served</span>
            </div>

            {poolOrders.length === 0 ? (
              <div className="glass-panel p-10 rounded-3xl border border-white/10 text-center space-y-3">
                <Bike className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="font-heading text-base font-bold text-white">No Ready Orders in Pool</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  The kitchen is currently preparing incoming orders. New ready orders will pop up here instantly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {poolOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="glass-panel p-5 rounded-3xl border border-amber-500/40 bg-amber-500/5 space-y-4 shadow-xl flex flex-col justify-between hover:border-amber-400 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-black font-mono font-extrabold text-xs">
                            #{ord.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase">
                            Kitchen Packed
                          </span>
                        </div>
                        <span className="text-xs font-bold text-amber-400">
                          {activeRestaurant.currency}{ord.total}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="text-xs text-slate-200 space-y-0.5">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="font-semibold truncate">
                            {it.quantity}x {it.name} {it.variant ? `(${it.variant})` : ''}
                          </div>
                        ))}
                      </div>

                      {/* Destination */}
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs">
                        <div className="flex items-start gap-2 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 text-[11px]">{ord.customer?.address}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 pl-5.5">
                          Customer: <strong className="text-white">{ord.customer?.name}</strong> • Phone: {ord.customer?.phone}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleGrabOrder(ord.id)}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:scale-102 transition-all flex items-center justify-center gap-2"
                    >
                      <Bike className="w-4 h-4" />
                      <span>Accept & Grab Delivery</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE IN-TRANSIT TRIPS (OTP VERIFICATION) */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-sm sm:text-base flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Your Active Delivery In-Transit</span>
            </h3>

            {activeTrips.length === 0 ? (
              <div className="glass-panel p-10 rounded-3xl border border-white/10 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="font-heading text-base font-bold text-white">No Active Deliveries Right Now</h4>
                <p className="text-xs text-slate-400">
                  Switch to "Ready to Grab" tab to accept a newly prepared order.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTrips.map((ord) => (
                  <div
                    key={ord.id}
                    className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-emerald-500/5 space-y-5 shadow-2xl"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-400">ORDER #{ord.id}</span>
                        <div className="text-xs font-bold text-white mt-0.5">Status: Out For Delivery</div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs animate-pulse">
                        In Transit 🛵
                      </span>
                    </div>

                    {/* Customer Info & Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Customer Information</div>
                        <div className="font-bold text-white text-sm">{ord.customer?.name}</div>
                        <div className="text-slate-300">{ord.customer?.phone}</div>
                        <div className="text-slate-400 text-[11px] pt-1">{ord.customer?.address}</div>
                      </div>

                      <div className="flex flex-col justify-between gap-2">
                        <a
                          href={`tel:${ord.customer?.phone}`}
                          className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                        >
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <span>Call Customer</span>
                        </a>

                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(ord.customer?.address || 'Kolkata')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 px-3 rounded-xl bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 text-blue-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                        >
                          <Navigation className="w-4 h-4 text-blue-400" />
                          <span>Open GPS Navigation</span>
                        </a>
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-1.5 text-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Items Checklist ({ord.items.length})</div>
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-slate-300 text-xs">
                          <span>{it.quantity}x {it.name}</span>
                          <strong className="text-white">{activeRestaurant.currency}{it.total}</strong>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-xs">
                        <span>Payment to Collect:</span>
                        <span className="text-amber-400">
                          {ord.paymentStatus === 'paid' ? 'PAID ONLINE (No cash)' : `COLLECT CASH: ${activeRestaurant.currency}${ord.total}`}
                        </span>
                      </div>
                    </div>

                    {/* OTP Action Button */}
                    <button
                      onClick={() => {
                        setSelectedOtpOrder(ord);
                        setOtpInput('');
                        setOtpError('');
                        setOtpSuccess('');
                      }}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-extrabold text-xs sm:text-sm shadow-emerald-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Arrived at Doorstep — Verify Customer OTP</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMPLETED DELIVERIES */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-sm sm:text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Completed Trips History</span>
            </h3>

            {completedTrips.length === 0 ? (
              <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center text-slate-400 text-xs">
                No deliveries completed yet today.
              </div>
            ) : (
              <div className="space-y-3">
                {completedTrips.map((ord) => (
                  <div key={ord.id} className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-mono">#{ord.id}</strong>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          Delivered
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {ord.customer?.name} • {ord.customer?.address?.slice(0, 35)}...
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-amber-400">+₹60 Payout</div>
                      <div className="text-[10px] text-slate-500">{ord.deliveredAt || 'Delivered'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* OTP VERIFICATION MODAL */}
      {selectedOtpOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0f111a] border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-white text-lg sm:text-xl">
                Enter Customer Delivery OTP
              </h3>
              <p className="text-xs text-slate-400">
                Ask <strong>{selectedOtpOrder.customer?.name}</strong> for their 4-digit verification code.
              </p>
            </div>

            {otpError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {otpSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{otpSuccess}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase block text-center">
                  4-Digit Security PIN
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  autoFocus
                  placeholder="• • • •"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[12px] font-mono text-2xl font-extrabold bg-black/60 border-2 border-amber-500/40 rounded-2xl py-3 text-amber-300 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/5 text-[11px] text-slate-400 space-y-1 text-center">
                <div>(Demo Tip: The customer's OTP for #{selectedOtpOrder.id} is <strong className="text-amber-300 font-mono font-bold">{selectedOtpOrder.deliveryOtp}</strong>)</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOtpOrder(null)}
                  className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otpInput.length !== 4}
                  className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-extrabold text-xs shadow-emerald-glow"
                >
                  Confirm Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
