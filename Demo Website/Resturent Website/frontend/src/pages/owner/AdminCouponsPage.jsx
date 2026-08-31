import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { COUPONS } from '../../data/mockData';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Tag, Plus, Trash2, X, Sparkles, CheckCircle2 } from 'lucide-react';

export const AdminCouponsPage = () => {
  const { activeRestaurant } = useTenant();
  const [couponList, setCouponList] = useState(COUPONS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    value: 20,
    minOrder: 499,
    maxDiscount: 200,
    description: '',
    expiresAt: '31 Dec 2026'
  });

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    const created = {
      id: `c-${Date.now()}`,
      restaurantId: activeRestaurant.id,
      code: newCoupon.code.toUpperCase(),
      discountType: newCoupon.discountType,
      value: Number(newCoupon.value),
      minOrder: Number(newCoupon.minOrder),
      maxDiscount: Number(newCoupon.maxDiscount),
      description: newCoupon.description || `${newCoupon.value}% OFF on feasts above ₹${newCoupon.minOrder}`,
      isActive: true,
      expiresAt: newCoupon.expiresAt
    };

    setCouponList([created, ...couponList]);
    setIsAddOpen(false);
    setNewCoupon({ code: '', discountType: 'percentage', value: 20, minOrder: 499, maxDiscount: 200, description: '', expiresAt: '31 Dec 2026' });
  };

  const handleDelete = (id) => {
    setCouponList(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#07080c] flex">
      <AdminSidebar />

      <div className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Promotional Coupons & Campaigns
            </h1>
            <p className="text-xs text-slate-400">
              Create discount promo codes, minimum spend thresholds, and maximum capping rules.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Promo Code</span>
          </button>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {couponList.map((coupon) => (
            <div
              key={coupon.id}
              className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between hover:border-amber-400/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Tag className="w-5 h-5" />
                    <span className="font-mono font-bold text-lg">{coupon.code}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                    Active
                  </span>
                </div>

                <div className="text-xs text-white font-medium">{coupon.description}</div>

                <div className="space-y-1 text-[11px] text-slate-400 border-t border-white/5 pt-2">
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <strong className="text-amber-300">
                      {coupon.discountType === 'percentage' ? `${coupon.value}%` : `Flat ₹${coupon.value}`}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Order:</span>
                    <strong className="text-white">₹{coupon.minOrder}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Cap:</span>
                    <strong className="text-white">₹{coupon.maxDiscount || 'None'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Expires:</span>
                    <span>{coupon.expiresAt}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => handleDelete(coupon.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add Coupon Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0f111a] border border-white/20 rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-white text-base">Generate New Promo Code</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE30"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-amber-400 uppercase focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                    className="w-full bg-[#141722] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Value</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Min Order (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.minOrder}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.maxDiscount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-95 transition-all mt-2"
              >
                Save & Activate Coupon
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
