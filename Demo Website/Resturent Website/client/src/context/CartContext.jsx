import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';
import { useAuth } from './AuthContext';
import { Bike, X, LogOut, UserCheck } from 'lucide-react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { settings } = useSettings();
  const { user, logout } = useAuth();
  
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('lamour_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [riderWarningModal, setRiderWarningModal] = useState(false);

  // If user is a rider, automatically clear any cart tray
  useEffect(() => {
    if (user?.role === 'delivery') {
      setCart([]);
      setIsCartOpen(false);
    }
  }, [user?.role]);

  useEffect(() => {
    localStorage.setItem('lamour_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity = 1) => {
    if (user?.role === 'delivery') {
      setRiderWarningModal(true);
      return false;
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (itemId, quantity) => {
    if (user?.role === 'delivery') {
      setRiderWarningModal(true);
      return;
    }

    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const openCart = () => {
    if (user?.role === 'delivery') {
      setRiderWarningModal(true);
      return;
    }
    setIsCartOpen(true);
  };

  const applyCoupon = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'WELCOME50') {
      setCoupon({ code: 'WELCOME50', percent: 15, maxDiscount: 150, description: '15% Off (Welcome Offer)' });
      setCouponError('');
      return true;
    } else if (cleanCode === 'GOURMET20') {
      setCoupon({ code: 'GOURMET20', percent: 20, maxDiscount: 250, description: '20% Off Gourmet Special' });
      setCouponError('');
      return true;
    } else if (cleanCode === 'FEAST100') {
      setCoupon({ code: 'FEAST100', flat: 100, minOrder: 500, description: 'Flat ₹100 Off on orders above ₹500' });
      setCouponError('');
      return true;
    } else {
      setCouponError('Invalid coupon code. Try WELCOME50 or GOURMET20');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const freeAbove = parseFloat(settings.free_delivery_above || '499');
  const baseDeliveryFee = parseFloat(settings.delivery_fee || '49');
  const deliveryFee = (subtotal === 0 || subtotal >= freeAbove) ? 0 : baseDeliveryFee;

  let discount = 0;
  if (coupon) {
    if (coupon.percent) {
      discount = Math.min((subtotal * coupon.percent) / 100, coupon.maxDiscount || 9999);
    } else if (coupon.flat && subtotal >= (coupon.minOrder || 0)) {
      discount = coupon.flat;
    }
  }

  const total = Math.max(0, subtotal + deliveryFee - discount);
  const totalItemCount = user?.role === 'delivery' ? 0 : cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart: user?.role === 'delivery' ? [] : cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isCartOpen,
      openCart,
      closeCart: () => setIsCartOpen(false),
      coupon,
      couponError,
      applyCoupon,
      removeCoupon,
      subtotal,
      deliveryFee,
      discount,
      total,
      totalItemCount,
      riderWarningModal,
      closeRiderWarning: () => setRiderWarningModal(false)
    }}>
      {children}

      {/* Global Rider Account Restriction Warning Popup */}
      {riderWarningModal && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans">
          <div 
            className="relative w-full max-w-md bg-[#231d19] border-2 border-[#D8632C] rounded-3xl p-6 text-[#F3E9D8] shadow-2xl space-y-4 my-auto text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setRiderWarningModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#171310] text-[#A9865A] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#D8632C]/20 border-2 border-[#D8632C] flex items-center justify-center mx-auto text-[#D8632C] shadow-lg shadow-[#D8632C]/20">
              <Bike className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D8632C]/20 text-[#D8632C] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#D8632C]/40">
                Rider Partner Account
              </span>
              <h3 className="font-display text-xl font-bold text-[#F3E9D8] pt-1">
                You Cannot Order or Add to Cart
              </h3>
              <p className="text-xs text-[#D6C8B2] font-mono leading-relaxed pt-1">
                You are currently logged in as Delivery Partner <strong>({user?.name || 'Rider'})</strong>. Delivery accounts are exclusively reserved for courier logistics and cannot place food orders.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#171310] border border-[#A9865A]/25 text-left font-mono text-[11px] text-[#A9865A] space-y-1">
              <p>💡 <strong>What should you do?</strong></p>
              <p>• To order food: Log out and sign in with a regular <strong>Customer Account</strong>.</p>
              <p>• To deliver food: Open your <strong>Rider Delivery Hub</strong>.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 font-mono text-xs">
              <button
                onClick={() => setRiderWarningModal(false)}
                className="py-2.5 px-4 rounded-xl bg-[#171310] border border-[#A9865A]/30 text-[#A9865A] hover:text-white font-bold transition-colors"
              >
                Dismiss
              </button>

              <button
                onClick={() => {
                  setRiderWarningModal(false);
                  logout();
                }}
                className="btn-ember-primary flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch to Customer Account</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
