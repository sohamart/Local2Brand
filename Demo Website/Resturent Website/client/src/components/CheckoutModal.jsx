import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Banknote, 
  MessageSquare, 
  QrCode, 
  Navigation, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';

export default function CheckoutModal({ isOpen, onClose, onOrderPlaced }) {
  const { user } = useAuth();
  const { cart, subtotal, deliveryFee, discount, total, clearCart } = useCart();
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const codEnabled = settings.enable_cod === 'true';
  const whatsappEnabled = settings.enable_whatsapp_order === 'true';
  const upiQrEnabled = settings.enable_upi_qr === 'true';
  const razorpayEnabled = settings.enable_razorpay === 'true';

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const detectedAddr = data.display_name || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          setFormData(prev => ({ ...prev, address: detectedAddr }));
        } catch {
          setFormData(prev => ({ ...prev, address: `Current GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        alert('Could not access your GPS location. Please type manually.');
      },
      { timeout: 10000 }
    );
  };

  const fireConfetti = () => {
    try {
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('Please provide your name, phone number, and delivery address.');
      return;
    }

    // Client-side Geo-Fence check
    const isRestricted = settings.delivery_restriction_enabled !== 'false';
    if (isRestricted) {
      const addr = formData.address.toLowerCase();
      const pinMatch = formData.address.match(/\b\d{6}\b/);
      const userPin = pinMatch ? pinMatch[0] : null;

      const allowedPincodes = (settings.delivery_allowed_pincodes || '713101, 713102, 713103, 713104, 713105')
        .split(',')
        .map(p => p.trim())
        .filter(Boolean);

      const isBurdwanAddress = 
        addr.includes('burdwan') || 
        addr.includes('bardhaman') || 
        addr.includes('barddhaman') || 
        addr.includes('purba bardhaman') ||
        addr.includes('curzon gate') ||
        addr.includes('golapbag') ||
        addr.includes('badamtala') ||
        addr.includes('birhata') ||
        addr.includes('khagragarh') ||
        addr.includes('nutanganj') ||
        addr.includes('alisha') ||
        addr.includes('baburbag') ||
        addr.includes('bajepratappur') ||
        addr.includes('ullhas') ||
        addr.includes('borehat') ||
        addr.includes('shaktigarh') ||
        (userPin && allowedPincodes.includes(userPin));

      if (userPin && allowedPincodes.length > 0 && !allowedPincodes.includes('*') && !allowedPincodes.includes(userPin)) {
        setError(`Delivery is currently limited to Burdwan (PIN: ${allowedPincodes.join(', ')}), West Bengal. Pincode ${userPin} is outside our delivery zone.`);
        return;
      }

      if (!isBurdwanAddress) {
        setError('We currently deliver exclusively within Burdwan (Bardhaman), West Bengal, India. Please select or enter a valid address in Burdwan.');
        return;
      }
    }

    setLoading(true);

    try {
      // 1. Razorpay
      if (paymentMethod === 'razorpay') {
        const orderRes = await api.createRazorpayOrder({
          amount: total,
          currency: 'INR'
        });

        if (window.Razorpay && !orderRes.isSimulated) {
          const options = {
            key: orderRes.keyId,
            amount: orderRes.amount,
            currency: orderRes.currency,
            name: settings.restaurant_name || "L'Amour Gourmet",
            description: `Order Ticket Payment of ₹${total}`,
            order_id: orderRes.id,
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone
            },
            theme: {
              color: '#D8632C'
            },
            handler: async function (response) {
              const verifyRes = await api.verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.verified) {
                await finalizeOrder({
                  payment_method: 'razorpay',
                  payment_status: 'paid',
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id
                });
              } else {
                setError('Payment verification failed.');
                setLoading(false);
              }
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          return;
        } else {
          // Sandbox Simulator
          await finalizeOrder({
            payment_method: 'razorpay',
            payment_status: 'paid',
            razorpay_order_id: orderRes.id,
            razorpay_payment_id: `pay_sim_${Date.now()}`
          });
          return;
        }
      }

      // 2. WhatsApp Direct
      if (paymentMethod === 'whatsapp') {
        const createdOrder = await finalizeOrder({
          payment_method: 'whatsapp',
          payment_status: 'pending'
        }, false);

        let waText = `*🔥 NEW ORDER TICKET - ${settings.restaurant_name}*\n`;
        waText += `*Ticket ID:* ${createdOrder.id}\n`;
        waText += `*Customer:* ${formData.name} (${formData.phone})\n`;
        waText += `*Address:* ${formData.address}\n`;
        if (formData.notes) waText += `*Cooking Notes:* ${formData.notes}\n`;
        waText += `---------------------------\n`;
        waText += `*ITEMS ORDERED:*\n`;
        cart.forEach((i, idx) => {
          waText += `${idx + 1}. ${i.name} × ${i.quantity} = ₹${i.price * i.quantity}\n`;
        });
        waText += `---------------------------\n`;
        waText += `*Subtotal:* ₹${subtotal}\n`;
        waText += `*Delivery:* ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}\n`;
        if (discount > 0) waText += `*Discount:* -₹${discount}\n`;
        waText += `*Total To Pay:* ₹${total}\n`;
        waText += `*Payment:* WhatsApp Order\n`;

        const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(waText)}`;
        window.open(waUrl, '_blank');

        onOrderPlaced(createdOrder.id);
        return;
      }

      // 3. UPI QR or COD
      await finalizeOrder({
        payment_method: paymentMethod,
        payment_status: 'pending'
      });

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to place order.');
      setLoading(false);
    }
  };

  const finalizeOrder = async (paymentDetails, redirect = true) => {
    const orderPayload = {
      user_id: user?.id || null,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      delivery_address: formData.address,
      delivery_notes: formData.notes,
      items: cart.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        is_veg: i.is_veg
      })),
      subtotal,
      delivery_fee: deliveryFee,
      discount,
      total,
      ...paymentDetails
    };

    const res = await api.createOrder(orderPayload);
    fireConfetti();
    clearCart();
    setLoading(false);

    if (redirect) {
      onOrderPlaced(res.order.id);
    }

    return res.order;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      {/* Contrast Switch Light Paper Panel (#F3E9D8) */}
      <div 
        className="relative w-full max-w-2xl bg-[#F3E9D8] text-[#171310] rounded-3xl overflow-hidden shadow-2xl my-3 sm:my-8 border-2 sm:border-4 border-[#231d19]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#ede1ce] border-b border-[#D6C8B2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#171310] text-[#F3E9D8] flex items-center justify-center">
              <Receipt className="w-5 h-5 text-[#E8AC4E]" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[#171310]">Generate Kitchen Ticket</h3>
              <p className="font-mono text-xs text-[#524438]">Provide delivery destination & payment mode</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#F3E9D8] text-[#524438] hover:text-[#171310] border border-[#D6C8B2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-6">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Destination Details */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#171310] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D8632C]" />
                  1. Delivery Destination
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-mono font-bold text-[#92b584] bg-[#33402E]/20 px-2 py-0.5 rounded border border-[#92b584]/30 flex items-center gap-1">
                    <span>🇮🇳 India</span>
                    <span>•</span>
                    <span>West Bengal</span>
                    <span>•</span>
                    <span>📍 Burdwan (Bardhaman) Zone</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locating}
                className="font-mono text-xs font-bold text-[#D8632C] hover:underline flex items-center gap-1 shrink-0"
              >
                <Navigation className={`w-3 h-3 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Locating...' : 'Use Current GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs font-semibold text-[#524438] block mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#524438] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D6C8B2] rounded-xl text-xs text-[#171310] placeholder-[#A9865A] focus:outline-none focus:border-[#D8632C]"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs font-semibold text-[#524438] block mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#524438] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D6C8B2] rounded-xl text-xs text-[#171310] font-mono placeholder-[#A9865A] focus:outline-none focus:border-[#D8632C]"
                  />
                </div>
              </div>
            </div>

            {/* Burdwan Popular Neighborhood Quick Selector */}
            <div className="p-3 rounded-2xl bg-[#ede1ce]/60 border border-[#D6C8B2] space-y-1.5">
              <span className="font-mono text-[10px] font-bold text-[#524438] uppercase block">
                ⚡ Quick Select Burdwan Delivery Area:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                {[
                  { name: 'Curzon Gate', pin: '713101' },
                  { name: 'Golapbag', pin: '713104' },
                  { name: 'Badamtala', pin: '713101' },
                  { name: 'Birhata', pin: '713102' },
                  { name: 'Khagragarh', pin: '713104' },
                  { name: 'Nutanganj', pin: '713102' },
                  { name: 'Alisha', pin: '713103' },
                  { name: 'Baburbag', pin: '713104' },
                  { name: 'Bajepratappur', pin: '713101' },
                  { name: 'Ullhas', pin: '713103' },
                  { name: 'Borehat', pin: '713102' },
                  { name: 'Shaktigarh', pin: '713149' }
                ].map((spot) => (
                  <button
                    key={spot.name}
                    type="button"
                    onClick={() => {
                      const prefix = formData.address.split(',')[0].trim();
                      const housePart = prefix && !prefix.includes('Burdwan') ? `${prefix}, ` : 'Flat/House No., ';
                      setFormData({
                        ...formData,
                        address: `${housePart}${spot.name}, Burdwan - ${spot.pin}, West Bengal`
                      });
                    }}
                    className="px-2 py-1 rounded-lg bg-white border border-[#D6C8B2] hover:border-[#D8632C] hover:text-[#D8632C] transition-colors text-[#171310]"
                  >
                    📍 {spot.name} ({spot.pin})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-mono text-xs font-semibold text-[#524438] block">Delivery Address in Burdwan *</label>
                <span className="font-mono text-[10px] text-[#A9865A]">Must be within Burdwan (Bardhaman), WB</span>
              </div>
              <textarea
                required
                rows={2}
                placeholder="e.g. Flat 3B, Sunshine Apartments, Badamtala, Burdwan - 713101, West Bengal"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 bg-white border border-[#D6C8B2] rounded-xl text-xs text-[#171310] placeholder-[#A9865A] focus:outline-none focus:border-[#D8632C] resize-none"
              ></textarea>
            </div>

            <div>
              <label className="font-mono text-xs font-semibold text-[#524438] block mb-1">Cooking / Delivery Instructions (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Mild spice for children, extra mint chutney"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#D6C8B2] rounded-xl text-xs text-[#171310] placeholder-[#A9865A] focus:outline-none focus:border-[#D8632C]"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-4 border-t border-[#D6C8B2]">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#171310] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#D8632C]" />
              2. Select Payment Method
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
              
              {/* Razorpay Online */}
              {razorpayEnabled && (
                <label 
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'bg-white border-[#D8632C] shadow-md ring-1 ring-[#D8632C]'
                      : 'bg-[#ede1ce] border-[#D6C8B2] hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-1 text-[#D8632C] focus:ring-[#D8632C]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#171310]">
                      <CreditCard className="w-4 h-4 text-[#D8632C]" />
                      <span>Razorpay Online</span>
                    </div>
                    <p className="text-[11px] text-[#524438] mt-0.5">Cards, UPI, NetBanking & Wallets</p>
                  </div>
                </label>
              )}

              {/* WhatsApp 1-Click */}
              {whatsappEnabled && (
                <label 
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                    paymentMethod === 'whatsapp'
                      ? 'bg-white border-[#25D366] shadow-md ring-1 ring-[#25D366]'
                      : 'bg-[#ede1ce] border-[#D6C8B2] hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="whatsapp"
                    checked={paymentMethod === 'whatsapp'}
                    onChange={() => setPaymentMethod('whatsapp')}
                    className="mt-1 text-[#25D366] focus:ring-[#25D366]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#171310]">
                      <MessageSquare className="w-4 h-4 text-[#25D366]" />
                      <span>1-Click WhatsApp</span>
                    </div>
                    <p className="text-[11px] text-[#524438] mt-0.5">Send ticket to chef via WhatsApp</p>
                  </div>
                </label>
              )}

              {/* UPI QR */}
              {upiQrEnabled && (
                <label 
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-white border-[#D8632C] shadow-md ring-1 ring-[#D8632C]'
                      : 'bg-[#ede1ce] border-[#D6C8B2] hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mt-1 text-[#D8632C] focus:ring-[#D8632C]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#171310]">
                      <QrCode className="w-4 h-4 text-[#D8632C]" />
                      <span>Direct UPI QR</span>
                    </div>
                    <p className="text-[11px] text-[#524438] mt-0.5">Scan & pay with GPay / PhonePe</p>
                  </div>
                </label>
              )}

              {/* Cash On Delivery */}
              {codEnabled && (
                <label 
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-white border-[#D8632C] shadow-md ring-1 ring-[#D8632C]'
                      : 'bg-[#ede1ce] border-[#D6C8B2] hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-[#D8632C] focus:ring-[#D8632C]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#171310]">
                      <Banknote className="w-4 h-4 text-[#D8632C]" />
                      <span>Cash on Delivery</span>
                    </div>
                    <p className="text-[11px] text-[#524438] mt-0.5">Pay upon food arrival</p>
                  </div>
                </label>
              )}

            </div>

            {/* UPI QR Display */}
            {paymentMethod === 'upi' && (
              <div className="p-3.5 rounded-2xl bg-white border border-[#D6C8B2] flex items-center gap-4 text-xs font-mono">
                <div className="w-24 h-24 bg-white p-1 rounded-lg border border-[#D6C8B2] shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${settings.upi_id}&pn=${encodeURIComponent(settings.upi_name || "L'Amour Gourmet")}&am=${total}&cu=INR`)}`}
                    alt="UPI QR"
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <span className="text-[#524438] block">Scan & Pay:</span>
                  <span className="text-base font-bold text-[#171310] block mb-1">₹{total}</span>
                  <span className="text-[10px] text-[#524438] bg-[#ede1ce] px-2 py-0.5 rounded border border-[#D6C8B2]">
                    UPI ID: {settings.upi_id}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Ticket Total Summary */}
          <div className="p-4 rounded-2xl bg-[#ede1ce] border border-[#D6C8B2] font-mono text-xs space-y-1.5">
            <div className="flex justify-between text-[#524438]">
              <span>Plates Subtotal</span>
              <span className="font-bold text-[#171310]">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-[#524438]">
              <span>Delivery Fee</span>
              <span className={deliveryFee === 0 ? "text-[#33402E] font-bold" : "text-[#171310]"}>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#33402E]">
                <span>Discount</span>
                <span className="font-bold">-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-[#171310] pt-2 border-t border-[#D6C8B2]">
              <span>Grand Total</span>
              <span className="text-base text-[#D8632C]">₹{total}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#D8632C] hover:bg-[#e37440] disabled:opacity-50 text-[#171310] font-sans font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Firing Ticket in Kitchen...</span>
              </>
            ) : paymentMethod === 'whatsapp' ? (
              <>
                <MessageSquare className="w-4 h-4" />
                <span>Send WhatsApp Ticket (₹{total})</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Place Order & Generate Ticket (₹{total})</span>
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
