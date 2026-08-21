import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Utensils, 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const TemplatePreview = () => {
  const { templateId } = useParams();

  // ----------------------------------------------------
  // INTERACTIVE DEVICE SIMULATOR STATE
  // ----------------------------------------------------
  const [viewport, setViewport] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
  const [successMsg, setSuccessMsg] = useState('');

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Get mock URL based on selected template
  const getMockUrl = () => {
    switch (templateId) {
      case 'restaurant-pro': return 'https://luigi-bistro.local2brand.com';
      case 'startup-landing': return 'https://saas-flow.local2brand.com';
      case 'medical-clinic': return 'https://carter-dental.local2brand.com';
      case 'ecommerce-store': return 'https://luxe-studio.local2brand.com';
      default: return 'https://preview.local2brand.com';
    }
  };

  // ----------------------------------------------------
  // 1. RESTAURANT PRO PREVIEW STATE & COMPONENT
  // ----------------------------------------------------
  const [restaurantMenuTab, setRestaurantMenuTab] = useState('appetizers');
  const [reservation, setReservation] = useState({ date: '', time: '', guests: '2 Guests' });

  const restaurantMenu = {
    appetizers: [
      { name: 'Bruschetta Classica', price: '₹350', desc: 'Toasted artisan sourdough topped with vine-ripened tomatoes, garlic, basil, and cold-pressed olive oil.' },
      { name: 'Calamari Fritti', price: '₹480', desc: 'Crispy golden calamari rings served with lemon caper aioli and fresh parsley.' }
    ],
    mains: [
      { name: 'Truffle Mushroom Gnocchi', price: '₹650', desc: 'Handcrafted potato gnocchi tossed in rich black truffle cream, wild mushrooms, and shaved parmesan.' },
      { name: 'Pan-Seared Sea Bass', price: '₹950', desc: 'Fresh sea bass fillet cooked crispy skin-on, served over asparagus spears and warm lemon butter broth.' }
    ],
    desserts: [
      { name: 'Classic Tiramisu', price: '₹400', desc: 'Espresso-soaked ladyfingers layered with fresh whipped mascarpone cream and cocoa dust.' },
      { name: 'Lava Chocolate Cake', price: '₹450', desc: 'Decadent dark chocolate cake with a molten liquid center, served with Madagascan vanilla bean gelato.' }
    ]
  };

  const handleBookTable = (e) => {
    e.preventDefault();
    if (!reservation.date || !reservation.time) {
      alert('Please select date and time');
      return;
    }
    triggerSuccess(`Table successfully booked for ${reservation.guests} on ${reservation.date} at ${reservation.time}!`);
  };

  const RestaurantDemo = () => (
    <div className="space-y-12 py-6 text-left bg-white text-slate-800">
      {/* Hero */}
      <div 
        className="h-72 md:h-96 bg-cover bg-center relative flex items-center justify-center text-center p-6"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80')` }}
      >
        <div className="space-y-4 max-w-lg text-white">
          <span className="text-yellow-400 font-bold uppercase tracking-widest text-[10px]">Luigi Bistro</span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Italian Cooking Reimagined</h2>
          <p className="text-[11px] text-slate-350">Traditional family recipes meet premium modern culinary aesthetics in a gorgeous local dining space.</p>
          <a href="#book" className="inline-block px-5 py-2.5 rounded-full bg-yellow-400 text-black hover:bg-yellow-550 font-bold text-[10px] transition-all shadow-lg">
            Reserve A Table
          </a>
        </div>
      </div>

      {/* Menu Tabbed grid */}
      <div className="max-w-3xl mx-auto px-6 space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-extrabold text-slate-900">Explore Culinary Creations</h3>
          <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Browse our handcrafted Italian dishes prepared by Chef Luigi.</p>
        </div>

        <div className="flex justify-center gap-1.5 border-b border-slate-100 pb-2">
          {['appetizers', 'mains', 'desserts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setRestaurantMenuTab(tab)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold capitalize transition-all cursor-pointer ${
                restaurantMenuTab === tab 
                  ? 'bg-yellow-400 text-black' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {restaurantMenu[restaurantMenuTab].map((item) => (
            <div key={item.name} className="p-4 border border-slate-150 rounded-2xl bg-slate-50/50 space-y-1 shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-slate-950 text-xs">{item.name}</h4>
                <span className="font-extrabold text-yellow-650 text-xs">{item.price}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Slot */}
      <div id="book" className="bg-stone-50 border-t border-stone-150 py-10 px-6">
        <div className="max-w-md mx-auto space-y-4 bg-white border border-stone-200 p-6 rounded-2xl shadow-md">
          <div className="text-center space-y-1">
            <Utensils size={24} className="text-yellow-600 mx-auto" />
            <h3 className="text-sm font-extrabold text-slate-900">Secure Table Reservation</h3>
            <p className="text-[10px] text-slate-500">Pick date, time and slots below to confirm booking.</p>
          </div>

          <form onSubmit={handleBookTable} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-stone-500 uppercase">Date</label>
                <input 
                  type="date" 
                  value={reservation.date}
                  onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-[10px] focus:outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-stone-500 uppercase">Time</label>
                <input 
                  type="time" 
                  value={reservation.time}
                  onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-[10px] focus:outline-none" 
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-stone-500 uppercase">Guests count</label>
              <select 
                value={reservation.guests}
                onChange={(e) => setReservation({ ...reservation, guests: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-[10px] focus:outline-none"
              >
                <option>2 Guests</option>
                <option>4 Guests</option>
                <option>6 Guests</option>
                <option>8 Guests</option>
              </select>
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg bg-yellow-450 hover:bg-yellow-550 text-black font-extrabold text-[10px]">
              Confirm Table Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // ----------------------------------------------------
  // 2. STARTUP LANDING STATE & COMPONENT
  // ----------------------------------------------------
  const [startupBilling, setStartupBilling] = useState('monthly');
  const [waitlistEmail, setWaitlistEmail] = useState('');

  const handleWaitlist = (e) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    triggerSuccess(`Added ${waitlistEmail} to waitlist successfully!`);
    setWaitlistEmail('');
  };

  const StartupDemo = () => (
    <div className="space-y-12 py-6 text-left bg-slate-50 text-slate-800">
      {/* Hero Header */}
      <div className="max-w-3xl mx-auto px-6 text-center py-8 space-y-4">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-605 font-bold uppercase text-[9px]">
          SaaS Pro 1.0 Release
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Automate Client Flows in One Workspace
        </h2>
        <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
          Scale conversions with magnetic landing modules, clean billing integrations, and customer trust panels mapped out to grow sales.
        </p>

        <form onSubmit={handleWaitlist} className="max-w-xs mx-auto flex gap-2 p-1 bg-white border border-slate-250 rounded-full shadow-md">
          <input
            type="email"
            required
            value={waitlistEmail}
            onChange={(e) => setWaitlistEmail(e.target.value)}
            className="flex-grow px-3 text-[10px] focus:outline-none placeholder-slate-400"
            placeholder="Enter business email..."
          />
          <button type="submit" className="px-4 py-2 rounded-full bg-yellow-455 text-black font-extrabold text-[9px]">
            Join Waitlist
          </button>
        </form>
      </div>

      {/* Feature grid */}
      <div className="max-w-3xl mx-auto px-6 py-4 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
            <h4 className="font-extrabold text-slate-900 text-xs">Lightning Fast</h4>
            <p className="text-[10px] text-slate-500">Page loading speeds under 500ms to increase conversion clicks.</p>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
            <h4 className="font-extrabold text-slate-900 text-xs">Stripe Billing</h4>
            <p className="text-[10px] text-slate-500">Integrated pricing tables allowing users to checkout instantly.</p>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
            <h4 className="font-extrabold text-slate-900 text-xs">Aesthetic UI</h4>
            <p className="text-[10px] text-slate-500">Designed with premium micro-interactions and capsule menus.</p>
          </div>
        </div>
      </div>

      {/* Pricing Matrix */}
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-extrabold text-slate-900">Simple Transparent Pricing</h3>
          <div className="inline-flex items-center gap-1 p-0.5 bg-slate-200/60 rounded-full">
            <button 
              onClick={() => setStartupBilling('monthly')}
              className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all ${startupBilling === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setStartupBilling('annual')}
              className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all ${startupBilling === 'annual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
          {/* Growth Plan */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs">Growth Plan</h4>
              <p className="text-[10px] text-slate-500">Perfect for growing agencies.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-900">
                  {startupBilling === 'monthly' ? '₹2,499' : '₹1,999'}
                </span>
                <span className="text-[9px] text-slate-500">/mo</span>
              </div>
            </div>
            <button onClick={() => triggerSuccess('Growth Plan checkout simulated!')} className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-800 font-extrabold text-[9px] rounded-lg">
              Choose Growth
            </button>
          </div>

          {/* Pro Plan */}
          <div className="p-6 bg-white border-2 border-yellow-500 rounded-2xl space-y-4 shadow-md flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-yellow-400 text-[8px] font-bold text-black uppercase">
              Popular
            </div>
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs">Enterprise Pro</h4>
              <p className="text-[10px] text-slate-500">For enterprise scale requirements.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-900">
                  {startupBilling === 'monthly' ? '₹5,999' : '₹4,799'}
                </span>
                <span className="text-[9px] text-slate-500">/mo</span>
              </div>
            </div>
            <button onClick={() => triggerSuccess('Enterprise Pro checkout simulated!')} className="w-full py-2 bg-yellow-450 hover:bg-yellow-550 text-black font-extrabold text-[9px] rounded-lg shadow-sm">
              Get Enterprise Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ----------------------------------------------------
  // 3. MEDICAL CLINIC STATE & COMPONENT
  // ----------------------------------------------------
  const [selectedDoc, setSelectedDoc] = useState('Dr. Carter');
  const [appointment, setAppointment] = useState({ date: '', time: '' });

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!appointment.date || !appointment.time) {
      alert('Please select date/time slot');
      return;
    }
    triggerSuccess(`Appointment requested with ${selectedDoc} on ${appointment.date} at ${appointment.time}.`);
  };

  const MedicalDemo = () => (
    <div className="space-y-12 py-6 text-left bg-white text-slate-800">
      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 items-center">
        <div className="space-y-4 text-left">
          <span className="text-[9px] font-bold text-yellow-605 uppercase">Dental Clinic Care</span>
          <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            We Help You Smile With Confidence
          </h2>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Dr. Evelyn Carter & Associates provide high-end, comfortable dental care tailored to your family's needs.
          </p>
          <div className="flex gap-2">
            <a href="#booking" className="px-4 py-2 rounded-full bg-yellow-450 text-black font-bold text-[9px]">
              Book Slot
            </a>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden h-48 border shadow-sm">
          <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80" alt="Clinic office" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Docs */}
      <div className="max-w-3xl mx-auto px-6 space-y-4">
        <h3 className="text-center font-bold text-xs text-slate-800">Practitioners</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="p-4 bg-slate-50 border rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
              <img src="https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=150&q=80" alt="Doc" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Dr. Evelyn Carter</h4>
              <p className="text-[9px] text-slate-500 uppercase font-bold text-yellow-605">Senior Orthodontist</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
              <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80" alt="Doc" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Dr. Marcus Vance</h4>
              <p className="text-[9px] text-slate-500 uppercase font-bold text-yellow-605">Pediatric Dentist</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div id="booking" className="max-w-md mx-auto px-6 py-6">
        <div className="p-6 border rounded-2xl bg-slate-50 space-y-4 shadow-md">
          <div className="text-center space-y-1">
            <h3 className="text-xs font-bold text-slate-900">Request Appointment</h3>
            <p className="text-[9px] text-slate-500">Pick preferred practitioner and timeline date.</p>
          </div>
          <form onSubmit={handleBookAppointment} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[8px] font-bold text-slate-500 uppercase">Doctor</label>
              <select 
                value={selectedDoc}
                onChange={(e) => setSelectedDoc(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[10px]"
              >
                <option value="Dr. Carter">Dr. Evelyn Carter (Orthodontics)</option>
                <option value="Dr. Vance">Dr. Marcus Vance (Pediatric Care)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="date"
                required
                value={appointment.date}
                onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[10px]"
              />
              <input 
                type="time"
                required
                value={appointment.time}
                onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[10px]"
              />
            </div>
            <button type="submit" className="w-full py-2 bg-yellow-450 text-black font-extrabold text-[10px] rounded-lg">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // ----------------------------------------------------
  // 4. E-COMMERCE PREVIEW STATE & COMPONENT
  // ----------------------------------------------------
  const [shopCart, setShopCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const shopProducts = [
    { id: 1, name: 'Minimalist leather backpack', price: 2999, image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Premium Ceramic Mug', price: 599, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Noise-canceling headphones', price: 4999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Desk organizer tray', price: 899, image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80' }
  ];

  const addToCart = (product) => {
    setShopCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    triggerSuccess(`Added ${product.name} to cart!`);
  };

  const updateQty = (id, change) => {
    setShopCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + change;
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      }).filter(item => item.qty > 0);
    });
  };

  const cartTotal = shopCart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleCheckout = () => {
    triggerSuccess(`Checkout total: ₹${cartTotal.toLocaleString()}. Payment success simulated.`);
    setShopCart([]);
    setCartOpen(false);
  };

  const EcommerceDemo = () => (
    <div className="space-y-12 py-6 text-left bg-slate-50 text-slate-800 relative">
      <div className="h-14 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <span className="font-black text-slate-900 text-xs tracking-tight">LUXE STUDIO</span>
        <button onClick={() => setCartOpen(true)} className="p-2 rounded-full bg-slate-100 border relative cursor-pointer">
          <ShoppingBag size={14} className="text-slate-800" />
          {shopCart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {shopCart.reduce((sum, item) => sum + item.qty, 0)}
            </span>
          )}
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 space-y-6">
        <div className="text-center space-y-1">
          <h3 className="font-extrabold text-slate-900 text-base">Shop Collection</h3>
          <p className="text-[10px] text-slate-400">Minimalist essentials built for aesthetic spaces.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {shopProducts.map((prod) => (
            <div key={prod.id} className="p-3 bg-white border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between shadow-sm">
              <div>
                <div className="h-28 bg-slate-100 rounded-xl overflow-hidden border">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-[10px] text-slate-900 truncate mt-2">{prod.name}</h4>
                <p className="text-[10px] font-bold text-yellow-605">₹{prod.price}</p>
              </div>
              <button onClick={() => addToCart(prod)} className="w-full py-1.5 bg-slate-50 border hover:bg-yellow-400 hover:text-black font-extrabold text-[9px] rounded-lg mt-2 cursor-pointer">
                Add To Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setCartOpen(false)} />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-72 bg-white h-full relative z-10 p-5 flex flex-col justify-between shadow-2xl border-l"
            >
              <div className="space-y-4 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-black text-slate-900 text-xs">Cart Items</h3>
                  <button onClick={() => setCartOpen(false)} className="text-[9px] text-slate-400 font-bold">✕ Close</button>
                </div>
                <div className="flex-grow overflow-y-auto space-y-3 pr-1">
                  {shopCart.length === 0 ? (
                    <p className="text-center py-10 text-[10px] text-slate-400">Cart is empty.</p>
                  ) : (
                    shopCart.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 p-2 border rounded-xl bg-slate-50/50">
                        <div className="w-8 h-8 rounded overflow-hidden shrink-0 border">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-[9px] text-slate-900 truncate">{item.name}</h4>
                          <p className="text-[9px] font-bold text-yellow-605">₹{item.price}</p>
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateQty(item.id, -1)} className="p-0.5 rounded bg-white border text-slate-655 text-[8px]"><Minus size={6} /></button>
                            <span className="text-[9px] font-bold text-slate-700 px-1">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="p-0.5 rounded bg-white border text-slate-655 text-[8px]"><Plus size={6} /></button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              {shopCart.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span>Total:</span>
                    <span className="text-yellow-605 font-black">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <button onClick={handleCheckout} className="w-full py-2 bg-yellow-450 hover:bg-yellow-550 text-black font-extrabold text-[10px] rounded-lg">
                    Simulate Payment
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  // ----------------------------------------------------
  // MAIN PREVIEW SHELL WITH LIVE DEVICE VIEWPORT SELECTOR
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#07080e] p-4 md:p-6 space-y-6 select-none flex flex-col justify-start">
      {/* Top Controller Bar */}
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row justify-between items-center bg-white dark:bg-[#0d0e15]/40 border border-slate-200 dark:border-white/5 rounded-3xl p-4 gap-4 shadow-md glass-panel">
        <div className="flex items-center gap-3">
          <Link to="/demos" className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-250 dark:bg-slate-900 dark:border-white/5 text-slate-600 dark:text-slate-350 cursor-pointer">
            <ArrowLeft size={15} />
          </Link>
          <div className="text-left">
            <span className="text-[8px] font-bold text-yellow-605 uppercase tracking-wide">Live Sandbox Environment</span>
            <h1 className="text-sm font-extrabold text-slate-900 dark:text-white capitalize">
              Live Mock: {templateId?.replace('-', ' ')}
            </h1>
          </div>
        </div>

        {/* Viewport Width Controller Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-white/5">
          <button 
            onClick={() => setViewport('desktop')}
            className={`p-2 rounded-full transition-all cursor-pointer ${viewport === 'desktop' ? 'bg-white dark:bg-slate-800 text-yellow-605 shadow-sm' : 'text-slate-400 hover:text-slate-655'}`}
            title="Desktop Mode"
          >
            <Monitor size={14} />
          </button>
          <button 
            onClick={() => setViewport('tablet')}
            className={`p-2 rounded-full transition-all cursor-pointer ${viewport === 'tablet' ? 'bg-white dark:bg-slate-800 text-yellow-605 shadow-sm' : 'text-slate-400 hover:text-slate-655'}`}
            title="Tablet View"
          >
            <Tablet size={14} />
          </button>
          <button 
            onClick={() => setViewport('mobile')}
            className={`p-2 rounded-full transition-all cursor-pointer ${viewport === 'mobile' ? 'bg-white dark:bg-slate-800 text-yellow-605 shadow-sm' : 'text-slate-400 hover:text-slate-655'}`}
            title="Mobile View"
          >
            <Smartphone size={14} />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            to={`/start-project?demo=${templateId}`}
            className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[10px] font-extrabold text-black transition-all shadow-md"
          >
            Deploy this blueprint
          </Link>
        </div>
      </div>

      {/* Success alert notifier */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-55 bg-emerald-600 text-white shadow-xl px-4 py-2 rounded-xl text-[10px] font-bold flex items-center gap-1.5"
          >
            <CheckCircle size={13} />
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Web Browser Viewport Container */}
      <div className="flex-1 flex justify-center items-start min-h-0 w-full max-w-6xl mx-auto">
        <div 
          className={`flex flex-col border border-slate-250 dark:border-white/5 rounded-3xl bg-white overflow-hidden shadow-2xl transition-all duration-300 ${
            viewport === 'desktop' ? 'w-full h-[75vh]' : 
            viewport === 'tablet' ? 'w-[768px] h-[75vh] ring-8 ring-slate-800 dark:ring-slate-900 rounded-[32px]' : 
            'w-[375px] h-[75vh] ring-12 ring-slate-800 dark:ring-slate-900 rounded-[36px]'
          }`}
        >
          {/* Mock Browser Header Bar */}
          <div className="h-10 px-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 flex items-center gap-4 shrink-0 select-none">
            {/* Window controller dots */}
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 block" />
            </div>

            {/* Mock browser address input box */}
            <div className="flex-grow bg-slate-200/60 dark:bg-slate-950 border border-slate-300/40 dark:border-white/5 px-4 py-1 rounded-lg text-[9px] text-slate-500 dark:text-slate-400 text-left font-mono truncate max-w-lg mx-auto flex items-center justify-between">
              <span>{getMockUrl()}</span>
              <RotateCcw size={8} className="text-slate-400 cursor-pointer" />
            </div>
            <div className="w-12" /> {/* alignment spacer */}
          </div>

          {/* Web Browser Content Body Viewport */}
          <div className="flex-1 overflow-y-auto">
            {templateId === 'restaurant-pro' && <RestaurantDemo />}
            {templateId === 'startup-landing' && <StartupDemo />}
            {templateId === 'medical-clinic' && <MedicalDemo />}
            {templateId === 'ecommerce-store' && <EcommerceDemo />}

            {/* Fallback sandbox notice */}
            {['restaurant-pro', 'startup-landing', 'medical-clinic', 'ecommerce-store'].indexOf(templateId) === -1 && (
              <div className="py-20 text-center space-y-4 px-6">
                <Sparkles size={32} className="text-yellow-500 mx-auto" />
                <h3 className="text-sm font-extrabold text-slate-800">Custom Blueprint Sandbox</h3>
                <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                  This custom local business template is being built. Request a customized layout blueprint to design your site.
                </p>
                <Link to="/start-project" className="inline-block px-4 py-2 rounded-xl bg-yellow-450 text-black font-extrabold text-[10px]">
                  Request Custom Blueprint
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
