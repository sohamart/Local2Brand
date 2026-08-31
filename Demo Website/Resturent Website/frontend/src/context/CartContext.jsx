import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ORDERS, DELIVERY_RIDERS } from '../data/mockData';
import confetti from 'canvas-confetti';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('gourmetos_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('gourmetos_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [riders, setRiders] = useState(() => {
    const saved = localStorage.getItem('gourmetos_riders');
    return saved ? JSON.parse(saved) : DELIVERY_RIDERS;
  });

  const [deliveryMode, setDeliveryMode] = useState('delivery'); // 'delivery', 'pickup', 'dine_in'

  useEffect(() => {
    localStorage.setItem('gourmetos_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('gourmetos_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('gourmetos_riders', JSON.stringify(riders));
  }, [riders]);

  // Add Item to Cart
  const addToCart = (product, customizations = {}) => {
    const { variant, addons = [], quantity = 1, specialNotes = '' } = customizations;
    const variantPriceDelta = variant?.priceDelta || 0;
    const addonsTotal = addons.reduce((sum, addon) => sum + (addon.price || 0), 0);
    const basePrice = product.discountPrice || product.price;
    const unitPrice = basePrice + variantPriceDelta + addonsTotal;

    const cartItemId = `${product.id}-${variant?.label || 'def'}-${addons.map(a => a.name).sort().join('_')}`;

    setCartItems(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * unitPrice }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          productId: product.id,
          name: product.name,
          image: product.image,
          restaurantId: product.restaurantId,
          variant: variant?.label || null,
          addons: addons.map(a => a.name),
          quantity,
          unitPrice,
          total: unitPrice * quantity,
          specialNotes
        }
      ];
    });

    setIsCartOpen(true);
  };

  const updateItemQuantity = (cartItemId, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty, total: newQty * item.unitPrice } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeItem = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Pricing calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const tax = Number((subtotal * 0.05).toFixed(2)); // 5% GST
  const deliveryFee = deliveryMode === 'delivery' && subtotal > 0 && subtotal < 999 ? 50 : 0;
  
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percentage') {
      const calcDiscount = (subtotal * appliedCoupon.value) / 100;
      discount = Math.min(calcDiscount, appliedCoupon.maxDiscount || 9999);
    } else {
      discount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  const grandTotal = Math.max(0, subtotal + tax + deliveryFee - discount);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Place a new Order
  const placeOrder = (orderDetails) => {
    // Generate random 4-digit security OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      restaurantId: cartItems[0]?.restaurantId || 'rest-001',
      customerId: orderDetails.customerId || 'user-cust-001',
      customer: orderDetails.customer,
      orderType: deliveryMode,
      items: [...cartItems],
      subtotal,
      tax,
      deliveryFee,
      discount,
      total: grandTotal,
      paymentMethod: orderDetails.paymentMethod || 'razorpay',
      paymentStatus: orderDetails.paymentMethod === 'razorpay' ? 'paid' : 'pending',
      orderStatus: 'confirmed',
      deliveryOtp: generatedOtp,
      assignedRider: null,
      estimatedTime: '30-40 mins',
      kitchenNotes: orderDetails.kitchenNotes || '',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order => (order.id === orderId ? { ...order, orderStatus: newStatus } : order))
    );
  };

  // Rider grabs an available ready order
  const grabOrder = (orderId, riderInfo) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            orderStatus: 'out_for_delivery',
            assignedRider: riderInfo,
            estimatedTime: '15-20 mins'
          };
        }
        return order;
      })
    );
  };

  // Verify 4-digit Delivery OTP
  const verifyDeliveryOtp = (orderId, enteredOtp) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return { success: false, message: 'Order not found.' };

    if (targetOrder.deliveryOtp !== enteredOtp.trim()) {
      return { success: false, message: 'Invalid OTP! Please ask customer for the correct 4-digit verification code.' };
    }

    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            orderStatus: 'delivered',
            paymentStatus: 'paid', // Mark COD as paid upon OTP verification
            deliveredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return order;
      })
    );

    try {
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
    } catch (e) {}

    return { success: true, message: 'OTP Verified! Delivery marked as completed successfully.' };
  };

  // Kitchen Staff registers a new Delivery Rider
  const registerRider = (riderData) => {
    const newRider = {
      id: `rider-${Date.now()}`,
      restaurantId: riderData.restaurantId || 'rest-001',
      name: riderData.name,
      phone: riderData.phone,
      avatar: riderData.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
      vehicleNumber: riderData.vehicleNumber,
      status: 'online',
      rating: 5.0,
      totalDeliveries: 0,
      activeOrderId: null
    };

    setRiders(prev => [newRider, ...prev]);
    return newRider;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateItemQuantity,
        removeItem,
        clearCart,
        subtotal,
        tax,
        deliveryFee,
        discount,
        grandTotal,
        totalItemCount,
        appliedCoupon,
        setAppliedCoupon,
        isCartOpen,
        setIsCartOpen,
        deliveryMode,
        setDeliveryMode,
        orders,
        placeOrder,
        updateOrderStatus,
        riders,
        registerRider,
        grabOrder,
        verifyDeliveryOtp
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
