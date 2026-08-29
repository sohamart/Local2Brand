import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { settings } = useSettings();
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

  useEffect(() => {
    localStorage.setItem('lamour_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId, quantity) => {
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
  const totalItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      coupon,
      couponError,
      applyCoupon,
      removeCoupon,
      subtotal,
      deliveryFee,
      discount,
      total,
      totalItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
