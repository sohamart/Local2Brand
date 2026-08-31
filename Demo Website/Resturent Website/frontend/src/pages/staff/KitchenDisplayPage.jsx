import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Flame,
  AlertCircle,
  Volume2,
  VolumeX,
  Plus,
  Bike,
  UserPlus,
  X,
  Sparkles,
  Phone
} from 'lucide-react';

export const KitchenDisplayPage = () => {
  const { activeRestaurant } = useTenant();
  const { orders, updateOrderStatus, riders, registerRider } = useCart();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'delivery', 'dine_in', 'pickup'
  const [isRegisterRiderOpen, setIsRegisterRiderOpen] = useState(false);
  const [newRiderData, setNewRiderData] = useState({
    name: '',
    phone: '',
    vehicleNumber: '',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80'
  });

  const handleRegisterRiderSubmit = (e) => {
    e.preventDefault();
    registerRider({
      ...newRiderData,
      restaurantId: activeRestaurant.id
    });
    setIsRegisterRiderOpen(false);
    setNewRiderData({ name: '', phone: '', vehicleNumber: '', avatar: '' });
  };

  const handleStatusTransition = (orderId, currentStatus) => {
    let nextStatus = 'preparing';
    if (currentStatus === 'confirmed' || currentStatus === 'pending') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready';
    else if (currentStatus === 'ready') nextStatus = 'delivered';

    updateOrderStatus(orderId, nextStatus);
  };

  const filteredOrders = orders.filter(o => {
    if (filterType !== 'all' && o.orderType !== filterType) return false;
    return o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled';
  });

  const columns = [
    {
      id: 'incoming',
      title: 'Incoming Orders',
      color: 'border-amber-500/40 bg-amber-500/5 text-amber-300',
      orders: filteredOrders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'confirmed')
    },
    {
      id: 'preparing',
      title: 'Cooking in Wok / Handi',
      color: 'border-orange-500/40 bg-orange-500/5 text-orange-300',
      orders: filteredOrders.filter(o => o.orderStatus === 'preparing')
    },
    {
      id: 'ready',
      title: 'Ready for Dispatch / Rider Grab',
      color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300',
      orders: filteredOrders.filter(o => o.orderStatus === 'ready' || o.orderStatus === 'out_for_delivery')
    }
  ];

  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 p-4 sm:p-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d0f17] p-4 sm:p-5 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-lg sm:text-xl font-bold text-white">
                Live Kitchen Display System (KDS)
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                Active Station
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {activeRestaurant.name} • {filteredOrders.length} Active Orders in Kitchen
            </div>
          </div>
        </div>

        {/* Actions & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Register Rider Button */}
          <button
            onClick={() => setIsRegisterRiderOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Delivery Boy</span>
          </button>

          {/* Filter Pills */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            {['all', 'delivery', 'dine_in', 'pickup'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  filterType === t ? 'bg-amber-500 text-black font-bold shadow-gold-glow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2.5 rounded-xl border transition-all ${
              audioEnabled ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title="Toggle Chime Alerts"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Registered Delivery Fleet Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Bike className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-white">Active Delivery Fleet ({riders.length} Riders Registered):</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {riders.map((r) => (
            <div key={r.id} className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
              <img src={r.avatar} alt={r.name} className="w-5 h-5 rounded-full object-cover" />
              <span className="font-bold text-white text-[11px]">{r.name}</span>
              <span className="text-[10px] text-amber-400">({r.vehicleNumber.split(' ')[0]})</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Column Kitchen Ticket Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {columns.map((col) => (
          <div key={col.id} className="space-y-4">
            
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between font-bold text-xs ${col.color}`}>
              <div className="flex items-center gap-2">
                <span>{col.title}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-black/40 text-white font-mono text-xs">
                {col.orders.length}
              </span>
            </div>

            <div className="space-y-4">
              {col.orders.length === 0 ? (
                <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] text-center text-slate-500 text-xs">
                  No tickets in this stage
                </div>
              ) : (
                col.orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="glass-panel p-5 rounded-3xl border border-white/15 space-y-4 shadow-xl hover:border-amber-400/40 transition-all"
                  >
                    {/* Ticket Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-sm text-amber-400">#{ord.id}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold capitalize">
                          {ord.orderType?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{ord.estimatedTime || '20m'}</span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="text-xs text-slate-300">
                      <div className="font-bold text-white">{ord.customer?.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{ord.customer?.address || 'Dining Table'}</div>
                    </div>

                    {/* Dish Items */}
                    <div className="space-y-2 text-xs border-t border-b border-white/10 py-3">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-white">
                              <span className="text-amber-400">{it.quantity}x</span> {it.name}
                            </span>
                          </div>
                          {it.variant && (
                            <div className="text-[10px] text-amber-300/90 pl-4 font-semibold">
                              ↳ Portion: {it.variant}
                            </div>
                          )}
                          {it.addons && it.addons.length > 0 && (
                            <div className="text-[10px] text-slate-400 pl-4">
                              + {it.addons.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Kitchen Special Notes */}
                    {ord.kitchenNotes && (
                      <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-300 font-medium">
                        <strong>Chef Note:</strong> {ord.kitchenNotes}
                      </div>
                    )}

                    {/* Assigned Rider Info or Pool Notice */}
                    {ord.orderType === 'delivery' && (
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] space-y-1">
                        <div className="text-slate-400 flex items-center justify-between">
                          <span>Delivery Security OTP:</span>
                          <strong className="font-mono text-amber-400 text-xs">{ord.deliveryOtp}</strong>
                        </div>
                        <div className="text-slate-300">
                          Rider Assigned: {ord.assignedRider ? (
                            <strong className="text-emerald-400 font-bold">{ord.assignedRider.name} ({ord.assignedRider.phone})</strong>
                          ) : (
                            <span className="text-amber-300 font-semibold animate-pulse">Waiting in Rider Grab Pool...</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status Advance Action Button */}
                    <button
                      onClick={() => handleStatusTransition(ord.id, ord.orderStatus)}
                      className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                        ord.orderStatus === 'preparing'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-emerald-glow'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow'
                      }`}
                    >
                      {ord.orderStatus === 'pending' || ord.orderStatus === 'confirmed' ? (
                        <>
                          <Flame className="w-3.5 h-3.5" />
                          <span>Start Cooking</span>
                        </>
                      ) : ord.orderStatus === 'preparing' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Pack & Make Ready for Rider</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Completed</span>
                        </>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        ))}
      </div>

      {/* REGISTER DELIVERY RIDER MODAL */}
      {isRegisterRiderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0f111a] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-amber-400" />
                <h3 className="font-heading font-bold text-white text-base">Register Delivery Boy</h3>
              </div>
              <button onClick={() => setIsRegisterRiderOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterRiderSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Rider Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newRiderData.name}
                  onChange={(e) => setNewRiderData({ ...newRiderData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98300 12345"
                  value={newRiderData.phone}
                  onChange={(e) => setNewRiderData({ ...newRiderData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Vehicle Type & Reg Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WB-02-AK-9842 (Royal Enfield Bullet)"
                  value={newRiderData.vehicleNumber}
                  onChange={(e) => setNewRiderData({ ...newRiderData, vehicleNumber: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Profile Photo URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newRiderData.avatar}
                  onChange={(e) => setNewRiderData({ ...newRiderData, avatar: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-[10px] text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-95 transition-all mt-2"
              >
                Register Rider to Kitchen Fleet
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
