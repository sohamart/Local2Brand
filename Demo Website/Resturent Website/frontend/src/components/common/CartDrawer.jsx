import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTenant } from '../../context/TenantContext';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Bike, Store, UtensilsCrossed, AlertCircle, CheckCircle } from 'lucide-react';
import { COUPONS } from '../../data/mockData';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    deliveryFee,
    discount,
    grandTotal,
    appliedCoupon,
    couponError,
    applyCouponCode,
    removeCoupon,
    orderType,
    setOrderType
  } = useCart();

  const { activeRestaurant } = useTenant();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput) {
      applyCouponCode(couponInput);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f111a] border-l border-white/10 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-primary/20 text-brand-primary">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-base sm:text-lg font-bold text-white leading-tight">
                  Your Epicurean Cart
                </h2>
                <span className="text-[11px] text-slate-400">
                  {cartItems.length} items from {activeRestaurant.name}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Order Type Toggle (Delivery / Pickup / Dine-in) */}
          <div className="px-4 py-3 bg-white/5 border-b border-white/10 grid grid-cols-3 gap-2">
            {[
              { type: 'delivery', label: 'Delivery', icon: Bike },
              { type: 'pickup', label: 'Takeaway', icon: Store },
              { type: 'dine_in', label: 'Dine-In', icon: UtensilsCrossed }
            ].map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  orderType === type
                    ? 'bg-amber-500 text-black font-bold shadow-gold-glow'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-white/5">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-400">
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">Your Cart is Empty</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Explore our imperial a la carte menu and add your favorite dishes to begin.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/menu');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-glass-glow hover:opacity-90 transition-opacity"
                >
                  Browse Full Menu
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.cartKey} className="pt-3 first:pt-0 flex gap-3 group">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartKey)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        title="Remove dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.variant && (
                      <div className="text-[10px] text-amber-400 font-medium">{item.variant}</div>
                    )}

                    {item.addons && item.addons.length > 0 && (
                      <div className="text-[10px] text-slate-400 truncate">
                        +{item.addons.join(', ')}
                      </div>
                    )}

                    {item.specialNotes && (
                      <div className="text-[10px] text-slate-500 italic truncate">
                        Note: {item.specialNotes}
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                          className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/10 text-slate-300 text-xs"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs font-bold text-white px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                          className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/10 text-slate-300 text-xs"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-white">
                        {activeRestaurant.currency}{item.total}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon Box & Summary (Only if cart not empty) */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-black/40 border-t border-white/10 space-y-3 shrink-0">
              
              {/* Coupon Engine */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <div>
                        <span className="font-bold">{appliedCoupon.code}</span> applied ({appliedCoupon.description})
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] font-bold underline hover:text-emerald-300 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter Promo Code"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-white/10 hover:bg-amber-500 hover:text-black text-white font-bold text-xs rounded-xl transition-all"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Quick Available Promo Badges */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                      {COUPONS.filter(c => c.isActive).map(c => (
                        <button
                          type="button"
                          key={c.code}
                          onClick={() => { setCouponInput(c.code); applyCouponCode(c.code); }}
                          className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/60 text-amber-300 text-[10px] font-semibold whitespace-nowrap transition-all"
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>

                    {couponError && (
                      <div className="text-[11px] text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{couponError}</span>
                      </div>
                    )}
                  </form>
                )}
              </div>

              {/* Bill Details */}
              <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span>{activeRestaurant.currency}{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Restaurant Taxes (5%)</span>
                  <span>{activeRestaurant.currency}{tax}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>{deliveryFee === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `${activeRestaurant.currency}${deliveryFee}`}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{activeRestaurant.currency}{discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Grand Total</span>
                  <span className="text-amber-400">{activeRestaurant.currency}{grandTotal}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-brand-primary text-black font-bold text-sm shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
