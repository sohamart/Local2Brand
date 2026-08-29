import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck,
  Sparkles,
  Bike
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

export default function CartDrawer({ onProceedCheckout }) {
  const { user } = useAuth();
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    coupon, 
    couponError, 
    applyCoupon, 
    removeCoupon,
    subtotal, 
    deliveryFee, 
    discount, 
    total 
  } = useCart();

  const { settings } = useSettings();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = parseFloat(settings.free_delivery_above || '499');
  const minOrder = parseFloat(settings.min_order_amount || '199');
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const success = applyCoupon(couponInput);
      if (success) setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={closeCart}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-8">
        <div className="w-screen sm:w-[420px] max-w-full bg-[#171310] border-l border-[#A9865A]/30 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#A9865A]/20 bg-[#0f0c0a] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#231d19] border border-[#A9865A]/30 flex items-center justify-center text-[#E8AC4E]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#F3E9D8]">Fired Dish Tray</h3>
            </div>
            
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg bg-[#231d19] text-[#A9865A] hover:text-[#F3E9D8]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {cart.length > 0 && (
            <div className="bg-[#231d19] px-5 py-3 border-b border-[#A9865A]/20 font-mono text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#D6C8B2] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#E8AC4E]" />
                  {amountNeededForFreeDelivery === 0 ? (
                    <strong className="text-[#92b584] font-bold">FREE DELIVERY UNLOCKED</strong>
                  ) : (
                    <span>Add <strong>₹{amountNeededForFreeDelivery}</strong> for Free Delivery</span>
                  )}
                </span>
                <span className="text-[#E8AC4E] font-bold">{freeDeliveryProgress}%</span>
              </div>
              <div className="w-full h-1 rounded-full bg-[#171310] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#D8632C] to-[#E8AC4E] rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-20 font-mono">
                <ShoppingBag className="w-12 h-12 text-[#A9865A]/40 mx-auto mb-3" />
                <h4 className="font-bold text-[#F3E9D8] text-sm mb-1">Your tray is empty</h4>
                <p className="text-[#A9865A] text-xs mb-6">Select from our charcoal grills & biryanis.</p>
                <button
                  onClick={closeCart}
                  className="btn-brass-pill px-5 py-2 rounded-full text-xs text-[#E8AC4E]"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 rounded-2xl bg-[#231d19] border border-[#A9865A]/20 flex items-center justify-between gap-3 font-mono"
                >
                  {/* Dish Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#A9865A]/20"
                  />

                  {/* Title & Price */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.is_veg ? 'bg-[#92b584]' : 'bg-[#D8632C]'}`}></span>
                      <h5 className="font-sans font-bold text-xs text-[#F3E9D8] truncate">{item.name}</h5>
                    </div>
                    <span className="text-xs text-[#E8AC4E] font-bold">
                      ₹{item.price} <span className="text-[10px] text-[#A9865A]">× {item.quantity}</span>
                    </span>
                  </div>

                  {/* Quantity Modifier */}
                  <div className="flex items-center gap-1 bg-[#171310] border border-[#A9865A]/30 rounded-lg p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-5 h-5 rounded bg-[#231d19] text-[#D6C8B2] flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-white w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-5 h-5 rounded bg-[#D8632C] text-[#171310] flex items-center justify-center font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#A9865A] hover:text-[#D8632C] p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#A9865A]/20 bg-[#0f0c0a] space-y-4">
              
              {/* Promo Coupon */}
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#33402E]/40 border border-[#33402E] font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#92b584]" />
                    <div>
                      <span className="font-bold text-[#92b584]">{coupon.code}</span>
                      <p className="text-[10px] text-[#92b584]/80">{coupon.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-[#D8632C] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-[#A9865A] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Coupon (e.g. WELCOME50)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-xs text-[#F3E9D8] font-mono uppercase placeholder-[#A9865A]/50 focus:outline-none focus:border-[#D8632C]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-xl bg-[#231d19] hover:bg-[#332b25] text-[#E8AC4E] font-mono font-bold text-xs border border-[#A9865A]/30"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[10px] text-[#D8632C] font-mono pl-1">{couponError}</p>
                  )}
                </form>
              )}

              {/* Monospace Price Summary */}
              <div className="space-y-1.5 font-mono text-xs text-[#D6C8B2] pt-2 border-t border-[#A9865A]/15">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#F3E9D8]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? "text-[#92b584] font-bold" : "text-[#F3E9D8]"}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#92b584]">
                    <span>Discount</span>
                    <span className="font-bold">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#F3E9D8] pt-2 border-t border-[#A9865A]/20">
                  <span>Total Payable</span>
                  <span className="text-[#E8AC4E] text-base">₹{total}</span>
                </div>
              </div>

              {/* Proceed */}
              {user?.role === 'delivery' ? (
                <div className="p-3 rounded-2xl bg-[#231d19] border border-[#D8632C]/40 text-[#E8AC4E] font-mono text-[11px] space-y-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-[#D8632C]">
                    <Bike className="w-3.5 h-3.5" />
                    <span>Rider Partner Account</span>
                  </div>
                  <p className="text-[10px] text-[#A9865A]">
                    Rider accounts cannot place food orders. Please sign in with a customer account.
                  </p>
                </div>
              ) : (
                <button
                  disabled={subtotal < minOrder}
                  onClick={() => {
                    closeCart();
                    onProceedCheckout();
                  }}
                  className="btn-ember-primary w-full py-3.5 rounded-full text-xs font-sans font-bold flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
