import React, { useState, useMemo } from 'react';
import {
  Utensils,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Send,
  Star,
  Sparkles,
  Flame,
  CheckCircle2,
  X,
  Search,
  Tag,
  ShieldCheck,
  ChevronDown,
  Info,
  Navigation,
  ArrowRight,
  Heart
} from 'lucide-react';
import { restaurantConfig } from './config';

export default function RestaurantDemo({ customConfig }) {
  const config = customConfig || restaurantConfig;

  // 1. Menu State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dietaryFilter, setDietaryFilter] = useState("All"); // 'All', 'Veg', 'NonVeg', 'Bestseller'
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Interactive Cart State
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderType, setOrderType] = useState('delivery'); // 'delivery', 'takeaway', 'dinein'
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Customer Details Form
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: '',
    tableNumber: '',
    notes: ''
  });

  // 3. Table Reservation State
  const [reservationData, setReservationData] = useState({
    name: '',
    phone: '',
    guests: '2',
    zone: 'royal-ac',
    date: '',
    time: '20:00',
    occasion: 'Dinner',
    notes: ''
  });
  const [reservationSuccess, setReservationSuccess] = useState(false);

  // 4. FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Filter Menu Items
  const filteredMenuItems = useMemo(() => {
    return config.menuItems.filter((item) => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchDiet =
        dietaryFilter === "All" ||
        (dietaryFilter === "Veg" && item.isVeg) ||
        (dietaryFilter === "NonVeg" && !item.isVeg) ||
        (dietaryFilter === "Bestseller" && item.isBestseller);
      const matchSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchDiet && matchSearch;
    });
  }, [config.menuItems, selectedCategory, dietaryFilter, searchQuery]);

  // Cart Calculations
  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const item = config.menuItems.find((m) => m.id === Number(id));
        return item ? { ...item, qty } : null;
      })
      .filter(Boolean);
  }, [cart, config.menuItems]);

  const cartTotalItems = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cartItems]);

  const deliveryFee = orderType === 'delivery' ? (subtotal >= 799 || subtotal === 0 ? 0 : 49) : 0;
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Cart Handlers
  const addToCart = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  const deleteFromCart = (itemId) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const found = config.activeCoupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid coupon code.');
      return;
    }
    if (subtotal < found.minOrder) {
      setCouponError(`Min order of ₹${found.minOrder} required for this coupon.`);
      return;
    }
    setAppliedCoupon(found);
  };

  // Instant Single Item Order
  const handleInstantItemOrder = (item) => {
    const text = `🍽️ *DIRECT ORDER INQUIRY - ${config.businessName}*\n\n` +
      `📌 Item: *${item.name}* (₹${item.price})\n` +
      `🥘 Portion: ${item.portion}\n` +
      `🏷️ Category: ${item.category}\n\n` +
      `Hi, I want to order this item! Please confirm delivery/takeaway availability.`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Complete Multi-Item WhatsApp Checkout
  const handleCompleteWhatsAppCheckout = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!customerData.name || !customerData.phone) {
      alert("Please provide your Name and WhatsApp Phone Number!");
      return;
    }

    if (orderType === 'delivery' && !customerData.address) {
      alert("Please provide your complete Delivery Address!");
      return;
    }

    // Format itemized receipt
    const itemsListText = cartItems
      .map((item, i) => `${i + 1}. *${item.name}* x ${item.qty} = ₹${item.price * item.qty}`)
      .join('\n');

    const orderTypeText =
      orderType === 'delivery'
        ? `🛵 *Home Delivery* (Address: ${customerData.address})`
        : orderType === 'takeaway'
        ? `🥡 *Self-Takeaway Pickup*`
        : `🍽️ *Dine-In Table Order* (Table No: ${customerData.tableNumber || 'Walk-In'})`;

    const couponText = appliedCoupon ? `🎁 Coupon: *${appliedCoupon.code}* (-₹${discountAmount})\n` : '';
    const deliveryText = orderType === 'delivery' ? `🚚 Delivery: ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}\n` : '';
    const notesText = customerData.notes ? `📝 Special Cooking Notes: ${customerData.notes}\n` : '';

    const whatsappMessage =
      `👑 *NEW ORDER - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Customer:* ${customerData.name}\n` +
      `📞 *Phone:* ${customerData.phone}\n` +
      `📦 *Order Type:* ${orderTypeText}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 *ORDER ITEMS:*\n${itemsListText}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 Subtotal: ₹${subtotal}\n` +
      deliveryText +
      couponText +
      `💰 *GRAND TOTAL: ₹${grandTotal}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      notesText +
      `\n⚡ *Please confirm my order and share live prep timing!*`;

    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  // Table Reservation WhatsApp Trigger
  const handleReservationSubmit = (e) => {
    e.preventDefault();
    setReservationSuccess(true);

    const selectedZoneObj = config.seatingZones.find((z) => z.id === reservationData.zone);

    const reservationMessage =
      `🍷 *VIP TABLE RESERVATION - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Guest Name:* ${reservationData.name}\n` +
      `📞 *Contact Phone:* ${reservationData.phone}\n` +
      `👥 *Party Size:* ${reservationData.guests} Guests\n` +
      `🏛️ *Seating Area:* ${selectedZoneObj ? selectedZoneObj.name : 'Royal AC Dining'}\n` +
      `📅 *Date:* ${reservationData.date || 'Today'}\n` +
      `⏰ *Time Slot:* ${reservationData.time}\n` +
      `🎉 *Occasion:* ${reservationData.occasion}\n` +
      (reservationData.notes ? `📝 *Special Requests:* ${reservationData.notes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `\n⚡ *Please confirm our royal table reservation!*`;

    setTimeout(() => {
      window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(reservationMessage)}`, '_blank');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070503] text-[#faedd9] font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 text-xs font-bold py-2 px-4 text-center shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Grand Mughlai Culinary Festival</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>Use code <strong>ROYAL10</strong> for 10% OFF</span>
          <span className="hidden sm:inline">•</span>
          <span className="underline cursor-pointer" onClick={() => setIsCartOpen(true)}>
            Free Delivery on orders above ₹799 🛵
          </span>
        </div>
      </div>

      {/* 2. STICKY LUXURY NAVIGATION */}
      <nav className="sticky top-0 z-40 bg-[#0e0a06]/95 backdrop-blur-2xl border-b border-amber-900/30 px-4 sm:px-8 py-3.5 transition-all shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full rounded-[14px] bg-[#0c0805] flex items-center justify-center">
                <Utensils className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="font-serif font-black text-lg sm:text-xl text-amber-100 tracking-wide block leading-none">
                {config.businessName}
              </span>
              <span className="text-[10px] text-amber-400/80 tracking-widest uppercase mt-0.5 block font-bold">
                {config.businessSubtitle}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-amber-200/80">
            <a href="#menu" className="hover:text-amber-400 transition-colors">Menu</a>
            <a href="#offers" className="hover:text-amber-400 transition-colors">Offers</a>
            <a href="#heritage" className="hover:text-amber-400 transition-colors">Heritage</a>
            <a href="#reserve" className="hover:text-amber-400 transition-colors">Reserve Table</a>
            <a href="#reviews" className="hover:text-amber-400 transition-colors">Reviews</a>
            <a href="#location" className="hover:text-amber-400 transition-colors">Contact</a>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            <a
              href="#reserve"
              className="hidden sm:inline-flex px-4 py-2 rounded-full text-xs font-bold bg-[#1d140b] text-amber-200 border border-amber-600/40 hover:bg-amber-500 hover:text-slate-950 transition-all"
            >
              Book Table
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all flex items-center gap-1.5 cursor-pointer relative"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden xs:inline font-black">Cart</span>
              {cartTotalItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-scale">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* 3. HERO SHOWCASE */}
      <header className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 text-center overflow-hidden">
        {/* Background Image with Deep Saffron Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={config.heroImage}
            alt="Royal Saffron Dining Experience"
            className="w-full h-full object-cover brightness-[0.25] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070503] via-[#070503]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Live Kitchen Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/90 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Kitchen Open Now • Lunch & Dinner</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-amber-50 tracking-tight leading-[1.12]">
            Feast Like Royalty with <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">Awadhi Coal Dum</span> & Tandoor
          </h1>

          <p className="text-sm sm:text-lg text-amber-200/80 max-w-2xl mx-auto leading-relaxed">
            {config.tagline}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <a
              href="#menu"
              className="px-7 py-3.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-2xl shadow-amber-500/30 transition-all flex items-center gap-2"
            >
              <Utensils className="w-4 h-4" />
              <span>Explore Digital Menu</span>
            </a>

            <a
              href="#reserve"
              className="px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider bg-[#140e08]/90 hover:bg-[#22160c] border border-amber-500/40 text-amber-200 shadow-md transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Reserve VIP Table</span>
            </a>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-xs text-amber-200/80">
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/30 backdrop-blur-md">
              <span className="block font-black text-amber-300 text-sm">4.9 ★★★★★</span>
              <span className="text-[11px]">1,450+ Verified Diners</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/30 backdrop-blur-md">
              <span className="block font-black text-amber-300 text-sm">100% Halal</span>
              <span className="text-[11px]">Fresh Procured Daily</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/30 backdrop-blur-md">
              <span className="block font-black text-amber-300 text-sm">Clay Handi</span>
              <span className="text-[11px]">24h Slow Charcoal Simmer</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/30 backdrop-blur-md">
              <span className="block font-black text-amber-300 text-sm">Free Delivery</span>
              <span className="text-[11px]">On Orders Above ₹799</span>
            </div>
          </div>
        </div>
      </header>

      {/* 4. ACTIVE PROMO COUPONS BAR */}
      <section id="offers" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1c1208] via-[#24170b] to-[#1c1208] border border-amber-600/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Exclusive Royal Offers</span>
              <h3 className="text-base sm:text-lg font-bold text-amber-100">Save on Your First WhatsApp Order!</h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {config.activeCoupons.map((coupon) => (
              <div
                key={coupon.code}
                className="px-4 py-2 rounded-2xl bg-[#0e0905] border border-dashed border-amber-500/60 flex items-center gap-3 shadow-md"
              >
                <div className="text-left">
                  <span className="font-mono font-black text-amber-300 text-xs block">{coupon.code}</span>
                  <span className="text-[10px] text-amber-200/60">{coupon.label}</span>
                </div>
                <button
                  onClick={() => {
                    setCouponCode(coupon.code);
                    setAppliedCoupon(coupon);
                    setIsCartOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] uppercase hover:brightness-110 cursor-pointer"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE DIGITAL FOOD MENU WITH CART */}
      <section id="menu" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Handcrafted Delicacies</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-amber-100">Our Digital Food Menu</h2>
          <p className="text-xs sm:text-sm text-amber-200/70 max-w-lg mx-auto">
            Order single items directly or tap <strong>+ Add to Cart</strong> to build your multi-dish feast.
          </p>
        </div>

        {/* Search & Dietary Filters Bar */}
        <div className="max-w-4xl mx-auto space-y-4 mb-10">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-5 h-5 text-amber-500/70 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Biryani, Kebab, Butter Chicken, Naan, Desserts...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#120d08] border border-amber-900/50 text-sm text-amber-100 placeholder:text-amber-200/40 focus:outline-none focus:border-amber-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400 bg-[#1e140b] px-2 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
            {config.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-[#150e09] text-amber-200/80 border border-amber-900/40 hover:bg-[#20150d]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dietary Filter Buttons */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => setDietaryFilter("All")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dietaryFilter === "All" ? 'bg-amber-400/20 text-amber-300 border border-amber-500' : 'text-amber-200/60'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setDietaryFilter("Veg")}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dietaryFilter === "Veg" ? 'bg-emerald-950 text-emerald-400 border border-emerald-500' : 'text-emerald-400/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Pure Veg</span>
            </button>
            <button
              onClick={() => setDietaryFilter("NonVeg")}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dietaryFilter === "NonVeg" ? 'bg-red-950 text-red-400 border border-red-500' : 'text-red-400/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Non-Veg</span>
            </button>
            <button
              onClick={() => setDietaryFilter("Bestseller")}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dietaryFilter === "Bestseller" ? 'bg-amber-950 text-amber-300 border border-amber-500' : 'text-amber-300/60'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Chef Specials</span>
            </button>
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map((item) => {
            const inCartQty = cart[item.id] || 0;

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-[#110c08] border border-amber-900/40 overflow-hidden shadow-xl hover:border-amber-500/60 transition-all flex flex-col justify-between group"
              >
                {/* Food Image */}
                <div className="relative h-52 overflow-hidden bg-black/50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#110c08] via-transparent to-transparent" />

                  {/* Veg / Non-Veg Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center p-0.5 ${
                        item.isVeg ? 'border-emerald-500 bg-emerald-950/80' : 'border-red-500 bg-red-950/80'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-red-500'}`} />
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-900/50">
                      {item.portion}
                    </span>
                  </div>

                  {item.isBestseller && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                      Chef Special
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-serif font-bold text-lg text-amber-100 group-hover:text-amber-400 transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-black text-lg text-amber-400 shrink-0">₹{item.price}</span>
                    </div>
                    <p className="text-xs text-amber-200/70 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Bar: Add to Cart vs Quantity Counter */}
                  <div className="pt-2 border-t border-amber-900/30 flex items-center justify-between gap-2">
                    {inCartQty > 0 ? (
                      <div className="flex-1 flex items-center justify-between p-1 bg-[#22160b] rounded-xl border border-amber-500/40">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center hover:bg-amber-400 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-black text-sm text-amber-300">{inCartQty} in cart</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center hover:bg-amber-400 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleInstantItemOrder(item)}
                      className="px-3 py-2.5 rounded-xl bg-[#1d1309] hover:bg-[#2e1d0f] border border-amber-700/50 text-amber-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      title="Instant WhatsApp Order"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Instant</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. VIP TABLE RESERVATION SUITE */}
      <section id="reserve" className="py-20 px-4 sm:px-8 bg-[#0c0805] border-y border-amber-900/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase">
              <Calendar className="w-3.5 h-3.5" />
              <span>Royal Dining Reservation</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-amber-100 leading-tight">
              Reserve Your Table for a Memorable Evening
            </h2>

            <p className="text-xs sm:text-sm text-amber-200/70 leading-relaxed">
              Skip the queue! Book your preferred seating zone in advance with instant WhatsApp confirmation. Complimentary welcome saffron sharbat on all table reservations.
            </p>

            {/* Seating Zones List */}
            <div className="space-y-2.5 pt-2">
              {config.seatingZones.map((zone) => (
                <div
                  key={zone.id}
                  onClick={() => setReservationData({ ...reservationData, zone: zone.id })}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    reservationData.zone === zone.id
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-md'
                      : 'bg-[#120d08] border-amber-900/30 text-amber-200/70 hover:border-amber-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-xs text-amber-100">{zone.name}</span>
                    {reservationData.zone === zone.id && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-amber-200/60">{zone.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Reservation Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#140e08] border border-amber-800/40 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-amber-200 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Guest & Table Details</span>
            </h3>

            <form onSubmit={handleReservationSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-amber-300/80 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Rathore"
                    value={reservationData.name}
                    onChange={(e) => setReservationData({ ...reservationData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0704] border border-amber-900/60 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-amber-300/80 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={reservationData.phone}
                    onChange={(e) => setReservationData({ ...reservationData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0704] border border-amber-900/60 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-amber-300/80 mb-1">
                    Number of Guests *
                  </label>
                  <select
                    value={reservationData.guests}
                    onChange={(e) => setReservationData({ ...reservationData, guests: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0704] border border-amber-900/60 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="2">2 Guests (Couple)</option>
                    <option value="4">4 Guests (Family)</option>
                    <option value="6">6 Guests (Party)</option>
                    <option value="8">8 Guests (Large Group)</option>
                    <option value="12">12+ Guests (VIP Cabin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-amber-300/80 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={reservationData.date}
                    onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0704] border border-amber-900/60 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-amber-300/80 mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={reservationData.time}
                    onChange={(e) => setReservationData({ ...reservationData, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0704] border border-amber-900/60 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="13:00">1:00 PM (Lunch)</option>
                    <option value="14:00">2:00 PM (Lunch)</option>
                    <option value="19:30">7:30 PM (Dinner)</option>
                    <option value="20:30">8:30 PM (Dinner)</option>
                    <option value="21:30">9:30 PM (Late Dinner)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-amber-300/80 mb-1">
                  Occasion & Special Decoration Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Birthday celebration, Candlelight table, Window seat..."
                  value={reservationData.notes}
                  onChange={(e) => setReservationData({ ...reservationData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0704] border border-amber-900/60 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Confirm Reservation on WhatsApp</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 7. HERITAGE & ROYAL KHANSAMA STORY */}
      <section id="heritage" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-900/40">
            <img
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop"
              alt="Handi Dum Slow Simmer"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <div className="space-y-1">
                <span className="text-amber-400 font-bold text-xs uppercase">Authentic Dum Tradition</span>
                <h3 className="font-serif text-xl font-bold text-white">Sealed Clay Handis on Coal Embers</h3>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Our Heritage Story</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-amber-100">
              Preserving Centuries of Awadhi Culinary Secrets
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
              At {config.businessName}, we believe royal food cannot be rushed. Our master Khansamas hand-pound whole spices in stone mortars, marinade tender meats overnight in saffron and yoghurt, and slow-cook our signature Biryanis in dough-sealed earthen handis.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-[#130d07] border border-amber-900/40">
                <span className="font-black text-amber-300 text-lg block">32+</span>
                <span className="text-amber-200/70">Secret Royal Spices</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#130d07] border border-amber-900/40">
                <span className="font-black text-amber-300 text-lg block">24 Hours</span>
                <span className="text-amber-200/70">Slow-Cooked Black Dal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. VERIFIED CUSTOMER REVIEWS */}
      <section id="reviews" className="py-16 px-4 sm:px-8 bg-[#0b0805] border-t border-amber-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Verified Testimonials</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-amber-100">Loved by 10,000+ Diners</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.testimonials.map((review, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-[#130d08] border border-amber-900/40 flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-amber-200/80 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-amber-900/30">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                  />
                  <div>
                    <span className="font-bold text-xs text-amber-100 block">{review.name}</span>
                    <span className="text-[10px] text-amber-400/60">{review.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Common Queries</span>
          <h2 className="font-serif text-3xl font-bold text-amber-100">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {config.faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#120d08] border border-amber-900/40 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-amber-100 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-amber-200/70 leading-relaxed border-t border-amber-900/20 pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. LOCATION & FOOTER */}
      <footer id="location" className="py-12 px-4 sm:px-8 bg-[#090604] border-t border-amber-900/40 text-amber-200/70 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-2">
            <span className="font-serif font-bold text-lg text-amber-200 block">{config.businessName}</span>
            <p className="text-xs leading-relaxed">{config.tagline}</p>
            <div className="text-[11px] text-amber-400/80 pt-1">
              <span>FSSAI Lic: {config.fssaiNumber}</span>
              <span className="block">GST: {config.gstNumber}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-amber-300 block mb-2 uppercase tracking-wider">Address & Landmark</span>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{config.address}</span>
              </div>
              <span className="text-[11px] text-amber-400/70 block pl-6">{config.landmark}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-amber-300 block mb-2 uppercase tracking-wider">Kitchen Hours</span>
            <div className="space-y-1">
              <div>Lunch: {config.hours.lunch}</div>
              <div>Dinner: {config.hours.dinner}</div>
              <span className="text-[11px] text-emerald-400 font-bold block mt-1">{config.hours.days}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-amber-300 block mb-2 uppercase tracking-wider">Direct WhatsApp Support</span>
            <div className="space-y-2">
              <a
                href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Hi ${config.businessName}, I need catering/order assistance.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp: {config.phone}</span>
              </a>
              <span className="text-[10px] text-amber-300/60 block text-center">Instant Reply within 2 Minutes</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-amber-900/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span>© {new Date().getFullYear()} {config.businessName}. All rights reserved.</span>
          <span className="text-[11px] text-amber-500 font-bold">Premium Restaurant Platform Powered by LOCAL2BRAND</span>
        </div>
      </footer>

      {/* 11. FLOATING BOTTOM CART BAR (MOBILE & DESKTOP) */}
      {cartTotalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 animate-slide-up">
          <div
            onClick={() => setIsCartOpen(true)}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-bold shadow-2xl flex items-center justify-between cursor-pointer hover:brightness-105 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-black text-xs">
                {cartTotalItems}
              </div>
              <div>
                <span className="text-xs font-black block leading-none">View WhatsApp Cart</span>
                <span className="text-[10px] text-slate-900 font-semibold">{cartItems.length} Dishes Selected</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-black text-sm">₹{subtotal}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* 12. SLIDE-OVER WHATSAPP CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
          
          <div
            className="w-full max-w-md bg-[#120d08] border-l border-amber-800/60 h-full flex flex-col justify-between shadow-2xl overflow-hidden animate-slide-left text-amber-100"
            data-lenis-prevent="true"
          >
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 bg-[#1a120b] border-b border-amber-900/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-lg text-white">Your Feast Cart</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                  {cartTotalItems} items
                </span>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-amber-900/40 text-amber-300 cursor-pointer"
                aria-label="Close Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body with Cart Items & Checkout Form */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 modal-touch-scroll">
              
              {/* Order Type Switcher */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#090604] rounded-2xl border border-amber-900/40 text-xs font-bold">
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    orderType === 'delivery' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-amber-200/60'
                  }`}
                >
                  🛵 Delivery
                </button>
                <button
                  onClick={() => setOrderType('takeaway')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    orderType === 'takeaway' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-amber-200/60'
                  }`}
                >
                  🥡 Takeaway
                </button>
                <button
                  onClick={() => setOrderType('dinein')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    orderType === 'dinein' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-amber-200/60'
                  }`}
                >
                  🍽️ Dine-In
                </button>
              </div>

              {/* Cart Items List */}
              {cartItems.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Utensils className="w-10 h-10 text-amber-500/40 mx-auto" />
                  <p className="text-sm text-amber-200/60">Your cart is currently empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                    Selected Dishes
                  </span>

                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-[#18110a] border border-amber-900/30 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-amber-100">{item.name}</h4>
                          <span className="text-xs font-bold text-amber-400">₹{item.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-[#0e0a06] p-1 rounded-xl border border-amber-900/40">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs text-white px-1">{item.qty}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => deleteFromCart(item.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon Code Input */}
              {cartItems.length > 0 && (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. ROYAL10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 rounded-xl bg-[#090604] border border-amber-900/60 text-xs text-amber-100 uppercase focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black uppercase cursor-pointer hover:brightness-110"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-400 font-semibold">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Coupon {appliedCoupon.code} applied! Saved ₹{discountAmount}</span>
                    </p>
                  )}
                </form>
              )}

              {/* Customer Details Form */}
              {cartItems.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-amber-900/30">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                    Your Information
                  </span>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-amber-300/80 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sameer Khan"
                      value={customerData.name}
                      onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#090604] border border-amber-900/60 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-amber-300/80 mb-1">
                      WhatsApp Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#090604] border border-amber-900/60 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {orderType === 'delivery' && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-amber-300/80 mb-1">
                        Complete Delivery Address *
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="House / Flat No, Street, Landmark, Area, Pin Code..."
                        value={customerData.address}
                        onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#090604] border border-amber-900/60 text-xs text-amber-100 focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>
                  )}

                  {orderType === 'dinein' && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-amber-300/80 mb-1">
                        Table Number (If Seated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Table 4 / AC Hall"
                        value={customerData.tableNumber}
                        onChange={(e) => setCustomerData({ ...customerData, tableNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#090604] border border-amber-900/60 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-amber-300/80 mb-1">
                      Cooking Notes / Instructions
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Make biryani spicy, extra green salad, no cutlery..."
                      value={customerData.notes}
                      onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#090604] border border-amber-900/60 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Footer Bill Summary & WhatsApp Action */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-5 bg-[#18110a] border-t border-amber-900/40 space-y-3 shrink-0">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-amber-200/80">
                    <span>Item Total (Subtotal)</span>
                    <span>₹{subtotal}</span>
                  </div>

                  {orderType === 'delivery' && (
                    <div className="flex items-center justify-between text-amber-200/80">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-base font-black text-amber-100 pt-2 border-t border-amber-900/30">
                    <span>Grand Total</span>
                    <span className="text-amber-400">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCompleteWhatsAppCheckout}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Place Order on WhatsApp (₹{grandTotal})</span>
                </button>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
