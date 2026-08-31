import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTenant } from '../../context/TenantContext';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import {
  CheckCircle2,
  Clock,
  Bike,
  ChefHat,
  ShoppingBag,
  MapPin,
  Phone,
  Receipt,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

export const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const { orders } = useCart();
  const { activeRestaurant } = useTenant();

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const order = orders.find(o => o.id === orderId) || orders[0];

  const steps = [
    { key: 'pending', label: 'Order Received', desc: 'Sent to royal kitchen' },
    { key: 'confirmed', label: 'Order Confirmed', desc: 'Accepted by head chef' },
    { key: 'preparing', label: 'Cooking in Wok/Handi', desc: 'Slow-steamed fresh' },
    { key: 'ready', label: 'Ready for Dispatch', desc: 'Packed in thermal handi' },
    { key: 'out_for_delivery', label: 'Valet on the Way', desc: 'In-transit to destination' },
    { key: 'delivered', label: 'Feast Delivered', desc: 'Enjoy your meal!' }
  ];

  const getStepIndex = (st) => {
    switch (st) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      default: return 1;
    }
  };

  const currentStepIdx = getStepIndex(order.orderStatus);

  return (
    <div className="min-h-screen bg-[#07080c] py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 font-mono">ORDER #{order.id}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                  {order.paymentStatus === 'paid' ? 'PAID ONLINE' : 'CASH ON DELIVERY'}
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Live Royal Feast Tracker
              </h1>
              <p className="text-xs text-slate-400">
                Estimated Delivery: <strong className="text-amber-300 font-bold">{order.estimatedTime || '25-30 mins'}</strong>
              </p>
            </div>

            {/* Invoice Button */}
            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center gap-2"
            >
              <Receipt className="w-4 h-4 text-amber-400" />
              <span>View Tax Invoice / Receipt</span>
            </button>
          </div>

          {/* 4-DIGIT DELIVERY SECURITY OTP BADGE */}
          {order.orderType === 'delivery' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500 text-black font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs sm:text-sm">
                    Your 4-Digit Delivery Verification OTP:
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Share this code with your delivery valet only when they arrive with your food.
                  </div>
                </div>
              </div>

              <div className="px-4 py-2 rounded-xl bg-black/60 border border-amber-400/50 text-center shrink-0">
                <span className="font-mono text-xl sm:text-2xl font-extrabold tracking-[6px] text-amber-400">
                  {order.deliveryOtp || '8492'}
                </span>
              </div>
            </div>
          )}

          {/* Timeline Visualizer */}
          <div className="py-4 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={step.key} className="space-y-2 text-center">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isPassed ? 'bg-amber-400 shadow-gold-glow' : 'bg-white/10'
                      }`}
                    />
                    <div className="space-y-0.5">
                      <div className={`text-[11px] font-bold ${isCurrent ? 'text-amber-300 animate-pulse' : isPassed ? 'text-white' : 'text-slate-500'}`}>
                        {step.label}
                      </div>
                      <div className="text-[9px] text-slate-500 hidden sm:block">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Rider Card (Live Valet Info) */}
          {order.assignedRider ? (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={order.assignedRider.avatar}
                  alt={order.assignedRider.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{order.assignedRider.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                      Delivery Valet
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{order.assignedRider.vehicleNumber}</div>
                </div>
              </div>

              <a
                href={`tel:${order.assignedRider.phone}`}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-emerald-glow hover:opacity-90"
              >
                <Phone className="w-4 h-4" />
                <span>Call Valet</span>
              </a>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-400 flex items-center gap-2">
              <Bike className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>A nearby delivery valet will accept and pick up your handi as soon as it's ready.</span>
            </div>
          )}
        </div>

        {/* Order Details Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-white text-base">Items in this Banquet</h3>
            <div className="divide-y divide-white/10">
              {order.items.map((it, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-white">{it.quantity}x {it.name}</div>
                    {it.variant && <div className="text-[11px] text-amber-400">{it.variant}</div>}
                    {it.addons && it.addons.length > 0 && (
                      <div className="text-[10px] text-slate-400">+{it.addons.join(', ')}</div>
                    )}
                  </div>
                  <div className="font-bold text-white">
                    {activeRestaurant.currency}{it.total}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 text-xs">
            <h3 className="font-heading font-bold text-white text-base">Delivery Details</h3>
            <div className="space-y-2 text-slate-300">
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-bold">Recipient</div>
                <div className="font-bold text-white">{order.customer?.name}</div>
                <div>{order.customer?.phone}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-bold">Delivery Address</div>
                <div className="text-slate-300">{order.customer?.address}</div>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between font-bold text-sm text-white">
                  <span>Grand Total:</span>
                  <span className="text-amber-400">{activeRestaurant.currency}{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {isInvoiceOpen && (
        <InvoiceModal
          order={order}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
        />
      )}
    </div>
  );
};
