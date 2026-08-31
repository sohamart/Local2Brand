import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Bike,
  Store,
  UtensilsCrossed,
  MapPin,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutPage = () => {
  const { cartItems, subtotal, tax, deliveryFee, discount, grandTotal, orderType, setOrderType, placeOrder } = useCart();
  const { activeRestaurant } = useTenant();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Soham Mukherjee',
    phone: currentUser?.phone || '+91 98301 23456',
    email: currentUser?.email || 'soham@example.com',
    address: currentUser?.savedAddresses?.[0]?.address || 'Flat 402, Royal Palms Residency',
    landmark: currentUser?.savedAddresses?.[0]?.landmark || 'Near City Centre 1',
    city: 'Kolkata',
    pincode: '700064',
    kitchenNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'cod'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessModal, setPaymentSuccessModal] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h2 className="font-heading text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-400 max-w-sm">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/menu')}
          className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-xs"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Payment Processing Gateway
    setTimeout(() => {
      const placed = placeOrder({
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: `${formData.address}, ${formData.landmark}, ${formData.city} - ${formData.pincode}`
        },
        paymentMethod,
        kitchenNotes: formData.kitchenNotes
      });

      setIsProcessing(false);

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }

      navigate(`/orders/${placed.id}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Secure Luxury Checkout
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
          Review & Complete Order
        </h1>
      </div>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Fulfillment, Customer Details & Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Fulfillment Type */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>1. Fulfillment Mode</span>
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'delivery', label: 'Doorstep Delivery', icon: Bike, desc: '30-40 min' },
                { type: 'pickup', label: 'Curbside Takeaway', icon: Store, desc: '15-20 min' },
                { type: 'dine_in', label: 'Dine-In Table', icon: UtensilsCrossed, desc: 'Immediate' }
              ].map(({ type, label, icon: Icon, desc }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    orderType === type
                      ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-gold-glow'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${orderType === type ? 'text-amber-400' : 'text-slate-400'}`} />
                  <div className="text-xs font-bold leading-tight">{label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Customer & Address Details */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>2. Delivery & Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Mobile Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {orderType === 'delivery' && (
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Delivery Address / Flat / Floor</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Kitchen & Chef Instructions</label>
              <input
                type="text"
                name="kitchenNotes"
                value={formData.kitchenNotes}
                onChange={handleInputChange}
                placeholder="e.g. Ring bell once, extra napkins..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>3. Payment Gateway</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-gold-glow'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <CreditCard className={`w-5 h-5 shrink-0 ${paymentMethod === 'razorpay' ? 'text-amber-400' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-white">Razorpay Secure Online</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">UPI, Cards, NetBanking, Cred</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-gold-glow'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Banknote className={`w-5 h-5 shrink-0 ${paymentMethod === 'cod' ? 'text-amber-400' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-white">Cash on Delivery / UPI on Arrival</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Pay via cash or QR to driver</div>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Order Items Summary & Pay Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5 sticky top-28 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-white border-b border-white/10 pb-3">
              Order Summary ({cartItems.length} items)
            </h3>

            {/* Dishes list */}
            <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-white/5 pr-1">
              {cartItems.map((item) => (
                <div key={item.cartKey} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-white truncate">
                      {item.quantity}x {item.name}
                    </div>
                    {item.variant && <div className="text-[10px] text-amber-400">{item.variant}</div>}
                    {item.addons && item.addons.length > 0 && (
                      <div className="text-[10px] text-slate-400 truncate">+{item.addons.join(', ')}</div>
                    )}
                  </div>
                  <div className="font-bold text-white shrink-0">
                    {activeRestaurant.currency}{item.total}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 pt-3 border-t border-white/10 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{activeRestaurant.currency}{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span>{activeRestaurant.currency}{tax}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `${activeRestaurant.currency}${deliveryFee}`}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount Applied</span>
                  <span>-{activeRestaurant.currency}{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-white/10">
                <span>Grand Total</span>
                <span className="text-amber-400">{activeRestaurant.currency}{grandTotal}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-brand-primary text-black font-extrabold text-sm shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Securing Order with {activeRestaurant.name}...</span>
              ) : (
                <>
                  <span>Place Order • {activeRestaurant.currency}{grandTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>256-bit Encrypted Multi-Tenant Payment Engine</span>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};
