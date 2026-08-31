import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTenant } from '../../context/TenantContext';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import {
  User,
  ShoppingBag,
  Calendar,
  Award,
  Share2,
  MapPin,
  Receipt,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export const CustomerAccountPage = () => {
  const { currentUser } = useAuth();
  const { orders } = useCart();
  const { activeRestaurant } = useTenant();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'reservations', 'loyalty', 'addresses'
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(currentUser?.referralCode || 'SOHAM20');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Overview Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/40 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-black">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-white">
              {currentUser?.name}
            </h1>
            <div className="text-xs text-slate-400 mt-0.5">{currentUser?.email} • {currentUser?.phone}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                👑 Royal Connoisseur Tier
              </span>
            </div>
          </div>
        </div>

        {/* Loyalty Wallet Quick Badge */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4 text-xs">
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Loyalty Balance</div>
            <div className="text-xl font-heading font-bold text-amber-400 mt-0.5">
              {currentUser?.loyaltyPoints || 480} <span className="text-xs font-normal text-slate-300">Points</span>
            </div>
            <div className="text-[10px] text-emerald-400">Worth ₹{(currentUser?.loyaltyPoints || 480) * 0.5} on next feast</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {[
          { key: 'orders', label: 'Order History', icon: ShoppingBag, count: orders.length },
          { key: 'loyalty', label: 'Loyalty & Referrals', icon: Share2 },
          { key: 'addresses', label: 'Saved Addresses', icon: MapPin, count: currentUser?.savedAddresses?.length || 2 }
        ].map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === key
                ? 'bg-amber-500 text-black font-bold shadow-gold-glow'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
            {count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === key ? 'bg-black/20 text-black font-extrabold' : 'bg-white/10 text-slate-300'}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* 1. Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 hover:border-amber-400/30 transition-all shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-amber-400 text-xs">#{order.id}</span>
                  <span className="text-xs text-slate-400">{order.createdAt}</span>
                  <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300">
                    {order.orderType?.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    order.orderStatus === 'delivered'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                  }`}>
                    {order.orderStatus?.replace('_', ' ')}
                  </span>

                  <button
                    onClick={() => setSelectedInvoiceOrder(order)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                    title="View Tax Invoice"
                  >
                    <Receipt className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items summary */}
              <div className="text-xs space-y-1 text-slate-300">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.name} {it.variant && `(${it.variant})`}</span>
                    <span className="text-slate-400">{activeRestaurant.currency}{it.total}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total Paid: </span>
                  <strong className="text-amber-400 text-sm">{activeRestaurant.currency}{order.total}</strong>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="px-4 py-1.5 rounded-xl bg-brand-primary/20 hover:bg-brand-primary text-white text-xs font-bold border border-brand-primary/40 transition-all flex items-center gap-1"
                >
                  <span>Track Live Order</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Loyalty & Referral Tab */}
      {activeTab === 'loyalty' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Award className="w-5 h-5" />
              <h3 className="font-heading font-bold text-white text-base">Royal Privileges Club</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Earn 10 points for every ₹100 spent at {activeRestaurant.name}. Redeem instantly for exclusive discounts during checkout.
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Balance:</span>
                <strong className="text-amber-400 font-bold">{currentUser?.loyaltyPoints || 480} Points</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Redeemable Value:</span>
                <strong className="text-emerald-400 font-bold">₹{(currentUser?.loyaltyPoints || 480) * 0.5}</strong>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Share2 className="w-5 h-5" />
              <h3 className="font-heading font-bold text-white text-base">Refer a Fellow Foodie</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Share your personal invite code. Your friend gets <strong>20% OFF</strong> their first banquet, and you receive <strong>150 Loyalty Points</strong>!
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={currentUser?.referralCode || 'SOHAM20'}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-amber-400 text-center"
              />
              <button
                onClick={handleCopyReferral}
                className="px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentUser?.savedAddresses?.map((addr) => (
            <div key={addr.id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{addr.title}</span>
                {addr.isDefault && (
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md font-semibold">
                    Default
                  </span>
                )}
              </div>
              <div className="text-xs text-white font-medium">{addr.address}</div>
              <div className="text-[11px] text-slate-400">{addr.landmark}, {addr.city} - {addr.pincode}</div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

    </div>
  );
};
