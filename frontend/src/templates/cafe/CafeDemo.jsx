import React, { useState, useMemo } from 'react';
import {
  Coffee,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Wifi,
  Sun,
  Heart,
  Star,
  CheckCircle2,
  X,
  Search,
  Tag,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { cafeConfig } from './config';

export default function CafeDemo({ customConfig }) {
  const config = customConfig || cafeConfig;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderType, setOrderType] = useState('takeaway'); // 'delivery', 'takeaway', 'dinein'
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    notes: '',
    address: ''
  });

  const [tableBooking, setTableBooking] = useState({
    name: '',
    phone: '',
    guests: '2',
    zone: 'rooftop',
    date: '',
    time: '11:00 AM',
    notes: ''
  });

  const filteredItems = useMemo(() => {
    return config.menuItems.filter((item) => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [config.menuItems, selectedCategory, searchQuery]);

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

  const discount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const grandTotal = Math.max(0, subtotal - discount);

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

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const found = config.activeCoupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid promo coupon');
      return;
    }
    if (subtotal < found.minOrder) {
      setCouponError(`Min order of ₹${found.minOrder} required.`);
      return;
    }
    setAppliedCoupon(found);
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!customerData.name || !customerData.phone) {
      alert("Please enter Name and Phone!");
      return;
    }

    const itemsText = cartItems
      .map((item, i) => `${i + 1}. *${item.name}* x ${item.qty} = ₹${item.price * item.qty}`)
      .join('\n');

    const typeText =
      orderType === 'delivery'
        ? `🛵 *Home Delivery* (Address: ${customerData.address})`
        : orderType === 'takeaway'
        ? `🥡 *Self-Takeaway Quick Pickup*`
        : `☕ *Dine-In Co-Working Table Order*`;

    const couponText = appliedCoupon ? `🎁 Promo: *${appliedCoupon.code}* (-₹${discount})\n` : '';
    const notesText = customerData.notes ? `📝 Special Note: ${customerData.notes}\n` : '';

    const text =
      `☕ *NEW CAFE ORDER - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Customer:* ${customerData.name}\n` +
      `📞 *Phone:* ${customerData.phone}\n` +
      `📦 *Order Type:* ${typeText}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 *BREW & BAKERY ITEMS:*\n${itemsText}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 Subtotal: ₹${subtotal}\n` +
      couponText +
      `💰 *GRAND TOTAL: ₹${grandTotal}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      notesText +
      `\n⚡ *Please brew and confirm order!*`;

    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTableSubmit = (e) => {
    e.preventDefault();
    const zoneObj = config.seatingZones.find(z => z.id === tableBooking.zone);
    const text =
      `🌿 *ROOFTOP TABLE / CO-WORKING PASS - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Guest Name: *${tableBooking.name}*\n` +
      `📞 WhatsApp Phone: *${tableBooking.phone}*\n` +
      `👥 Party Size: *${tableBooking.guests} People*\n` +
      `🏛️ Preferred Zone: *${zoneObj ? zoneObj.name : 'Rooftop Garden'}*\n` +
      `📅 Date: *${tableBooking.date || 'Today'}*\n` +
      `⏰ Time Slot: *${tableBooking.time}*\n` +
      (tableBooking.notes ? `📝 Note: ${tableBooking.notes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `\nPlease reserve our table with power sockets!`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0f0c09] text-[#f7f2ea] font-sans selection:bg-[#c89666] selection:text-black overflow-x-hidden">
      
      {/* Top Announcement Ticker */}
      <div className="bg-[#2a1d13] text-[#deb887] text-xs font-bold py-2 px-4 text-center border-b border-[#4d3625] shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            <Coffee className="w-3.5 h-3.5" />
            <span>Single-Origin Coorg & Ethiopian Roasts</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>Use code <strong>BREW10</strong> for 10% OFF</span>
          <span className="hidden sm:inline">•</span>
          <span>High-Speed 300 Mbps Co-Working Wi-Fi Available 💻</span>
        </div>
      </div>

      {/* Sticky Luxury Navigation */}
      <nav className="sticky top-0 z-40 bg-[#16120e]/95 backdrop-blur-2xl border-b border-[#3d2f23] px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c89666] text-black flex items-center justify-center font-black shadow-lg shadow-amber-900/20">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-[#f7f2ea] tracking-tight block leading-none">{config.businessName}</span>
              <span className="text-[10px] text-[#c89666] block tracking-wider uppercase mt-0.5 font-bold">{config.businessSubtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#cfc5b8]">
            <a href="#menu" className="hover:text-[#c89666]">Menu</a>
            <a href="#offers" className="hover:text-[#c89666]">Offers</a>
            <a href="#cowork" className="hover:text-[#c89666]">Co-Working</a>
            <a href="#reserve" className="hover:text-[#c89666]">Reserve Seat</a>
            <a href="#reviews" className="hover:text-[#c89666]">Reviews</a>
            <a href="#location" className="hover:text-[#c89666]">Location</a>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="#reserve"
              className="hidden sm:inline-flex px-4 py-2 rounded-full text-xs font-bold bg-[#261c14] text-[#c89666] border border-[#523c2a] hover:bg-[#c89666] hover:text-black transition-all"
            >
              Book Table
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#c89666] text-black hover:bg-[#deb887] transition-all flex items-center gap-1.5 cursor-pointer shadow-md relative"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden xs:inline font-black">Bag</span>
              {cartTotalItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-scale">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Showcase */}
      <header className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Cafe Roastery" className="w-full h-full object-cover brightness-[0.25] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c09] via-[#0f0c09]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2b2017] border border-[#523d2b] text-[#c89666] text-xs font-bold uppercase tracking-widest shadow-xl">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Specialty Pour-Over Bar & Sourdough Bakery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#f7f2ea] tracking-tight leading-tight">
            Artisanal Roasts Crafted for <span className="text-[#c89666]">Deep Work & Conversations</span>
          </h1>

          <p className="text-sm sm:text-base text-[#cfc5b8] max-w-xl mx-auto leading-relaxed">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#menu"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#c89666] text-black hover:bg-[#deb887] shadow-xl shadow-amber-900/30 transition-all flex items-center gap-2"
            >
              <Coffee className="w-4 h-4" />
              <span>Explore Brew Menu</span>
            </a>
            <a
              href="#reserve"
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#1e1813] text-[#f7f2ea] border border-[#3d2f23] hover:bg-[#2b2017] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#c89666]" />
              <span>Book Co-Working Desk</span>
            </a>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-xs text-[#cfc5b8]">
            <div className="p-3 rounded-2xl bg-[#1d1611] border border-[#3d2f23]">
              <span className="block font-black text-[#c89666] text-sm">300 Mbps</span>
              <span className="text-[11px]">Dedicated Fibre Wi-Fi</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#1d1611] border border-[#3d2f23]">
              <span className="block font-black text-[#c89666] text-sm">100% Arabica</span>
              <span className="text-[11px]">Direct Trade Estates</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#1d1611] border border-[#3d2f23]">
              <span className="block font-black text-[#c89666] text-sm">Fresh Bakery</span>
              <span className="text-[11px]">Stone-Baked Daily 7 AM</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#1d1611] border border-[#3d2f23]">
              <span className="block font-black text-[#c89666] text-sm">Pet Friendly</span>
              <span className="text-[11px]">Rooftop Garden Seating</span>
            </div>
          </div>
        </div>
      </header>

      {/* Promo Coupons Bar */}
      <section id="offers" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-5 sm:p-6 rounded-3xl bg-[#1b140e] border border-[#423122] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#c89666]/20 border border-[#c89666]/50 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-[#c89666]" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#c89666]">Exclusive Roastery Offers</span>
              <h3 className="text-base sm:text-lg font-bold text-[#f7f2ea]">Save on Your Artisan Coffee & Sourdough!</h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {config.activeCoupons.map((c) => (
              <div key={c.code} className="px-4 py-2 rounded-2xl bg-[#0f0c09] border border-dashed border-[#c89666]/60 flex items-center gap-3">
                <div>
                  <span className="font-mono font-black text-[#c89666] text-xs block">{c.code}</span>
                  <span className="text-[10px] text-[#a69b8d]">{c.label}</span>
                </div>
                <button
                  onClick={() => {
                    setCouponCode(c.code);
                    setAppliedCoupon(c);
                    setIsCartOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#c89666] text-black font-black text-[10px] uppercase hover:bg-[#deb887] cursor-pointer"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Menu Suite */}
      <section id="menu" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c89666]">Freshly Brewed & Baked</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f7f2ea]">Our Digital Roastery Menu</h2>
          <p className="text-xs sm:text-sm text-[#a69b8d] max-w-lg mx-auto">
            Order your morning pour-overs or tap <strong>+ Add to Cart</strong> for takeaway and co-working desks.
          </p>
        </div>

        {/* Search & Category Tabs */}
        <div className="max-w-4xl mx-auto space-y-4 mb-10">
          <div className="relative">
            <Search className="w-5 h-5 text-[#c89666]/70 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brews, cold drips, croissants, sourdough..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#18130f] border border-[#3d2f23] text-sm text-[#f7f2ea] focus:outline-none focus:border-[#c89666]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
            {config.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#c89666] text-black shadow-md'
                    : 'bg-[#18130f] text-[#cfc5b8] border border-[#3d2f23] hover:bg-[#241c16]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const inCartQty = cart[item.id] || 0;

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-[#18130f] border border-[#33261c] overflow-hidden shadow-xl hover:border-[#c89666]/60 transition-all flex flex-col justify-between group"
              >
                <div className="relative h-52 overflow-hidden bg-black/50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-[#c89666]">
                    {item.portion}
                  </span>
                  {item.isBestseller && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#c89666] text-black text-[10px] font-black uppercase">
                      Bestseller
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-base text-[#f7f2ea] group-hover:text-[#c89666] transition-colors">{item.name}</h3>
                      <span className="font-black text-lg text-[#c89666]">₹{item.price}</span>
                    </div>
                    <span className="text-[10px] text-[#c89666]/80 font-bold block mb-1">{item.roastLevel}</span>
                    <p className="text-xs text-[#a69b8d] leading-relaxed line-clamp-2">{item.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#33261c] flex items-center justify-between gap-2">
                    {inCartQty > 0 ? (
                      <div className="flex-1 flex items-center justify-between p-1 bg-[#261d15] rounded-xl border border-[#c89666]/40">
                        <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-lg bg-[#c89666] text-black font-black flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="font-black text-sm text-[#c89666]">{inCartQty} in cart</span>
                        <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-lg bg-[#c89666] text-black font-black flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-[#c89666] hover:bg-[#deb887] text-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Co-Working & Table Reservation Suite */}
      <section id="reserve" className="py-20 px-4 sm:px-8 bg-[#140f0c] border-y border-[#33261c]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#261b13] border border-[#523b29] text-[#c89666] text-xs font-bold uppercase">
              <Wifi className="w-3.5 h-3.5" />
              <span>Rooftop Co-Working & Table Pass</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#f7f2ea] leading-tight">
              Reserve a Sunlit Work Desk or Garden Table
            </h2>

            <p className="text-xs sm:text-sm text-[#cfc5b8] leading-relaxed">
              Equipped with high-speed 300 Mbps Wi-Fi, ergonomic seating, dedicated power strips, and specialty pour-over subscriptions.
            </p>

            <div className="space-y-2.5 pt-2">
              {config.seatingZones.map((zone) => (
                <div
                  key={zone.id}
                  onClick={() => setTableBooking({ ...tableBooking, zone: zone.id })}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    tableBooking.zone === zone.id
                      ? 'bg-[#291c13] border-[#c89666] text-[#f7f2ea]'
                      : 'bg-[#18120d] border-[#33261c] text-[#cfc5b8]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-xs text-[#f7f2ea]">{zone.name}</span>
                    {tableBooking.zone === zone.id && <CheckCircle2 className="w-4 h-4 text-[#c89666]" />}
                  </div>
                  <p className="text-[11px] text-[#a69b8d]">{zone.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#1a130e] border border-[#423122] shadow-2xl space-y-4">
            <h3 className="font-bold text-xl text-[#f7f2ea] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#c89666]" />
              <span>Reserve Your Desk / Seat</span>
            </h3>

            <form onSubmit={handleTableSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name *"
                  value={tableBooking.name}
                  onChange={(e) => setTableBooking({ ...tableBooking, name: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-[#0f0c09] border border-[#3d2f23] text-xs text-white"
                />
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp Phone *"
                  value={tableBooking.phone}
                  onChange={(e) => setTableBooking({ ...tableBooking, phone: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-[#0f0c09] border border-[#3d2f23] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="date"
                  required
                  value={tableBooking.date}
                  onChange={(e) => setTableBooking({ ...tableBooking, date: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-[#0f0c09] border border-[#3d2f23] text-xs text-white"
                />
                <select
                  value={tableBooking.time}
                  onChange={(e) => setTableBooking({ ...tableBooking, time: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-[#0f0c09] border border-[#3d2f23] text-xs text-white"
                >
                  <option value="09:00 AM">09:00 AM (Morning Brew)</option>
                  <option value="11:30 AM">11:30 AM (Brunch Slot)</option>
                  <option value="03:00 PM">03:00 PM (Afternoon Focus)</option>
                  <option value="06:30 PM">06:30 PM (Sunset Acoustic)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-[#c89666] text-black hover:bg-[#deb887] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Confirm Co-Work Seat on WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c89666]">Verified Diners</span>
          <h2 className="text-3xl font-bold text-[#f7f2ea]">Loved by Coffee Connoisseurs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#18130f] border border-[#33261c] space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, r) => <Star key={r} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-[#cfc5b8] italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#33261c]">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <span className="font-bold text-xs text-[#f7f2ea] block">{t.name}</span>
                  <span className="text-[10px] text-[#c89666]">{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c89666]">Help & Info</span>
          <h2 className="text-3xl font-bold text-[#f7f2ea]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {config.faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl bg-[#18130f] border border-[#33261c] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#f7f2ea] flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#c89666] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-[#a69b8d] leading-relaxed border-t border-[#33261c] pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 bg-[#0a0806] border-t border-[#33261c] text-[#a69b8d] text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <span className="font-bold text-base text-[#f7f2ea] block">{config.businessName}</span>
            <p className="text-xs">{config.tagline}</p>
            <span className="text-[10px] text-[#c89666] block">FSSAI: {config.fssaiNumber}</span>
          </div>

          <div>
            <span className="font-bold text-[#f7f2ea] block mb-2 uppercase">Address</span>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#c89666] shrink-0 mt-0.5" />
              <span>{config.address}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-[#f7f2ea] block mb-2 uppercase">Roastery Hours</span>
            <div>Weekdays: {config.hours.weekdays}</div>
            <div>Weekends: {config.hours.weekends}</div>
          </div>

          <div>
            <span className="font-bold text-[#f7f2ea] block mb-2 uppercase">WhatsApp Support</span>
            <a
              href={`https://wa.me/${config.whatsapp}`}
              className="px-4 py-2 rounded-xl bg-[#25d366] text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Direct WhatsApp: {config.phone}</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#33261c] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {config.businessName}. All rights reserved.</span>
          <span className="text-[#c89666] font-bold">Production Ready Platform by LOCAL2BRAND</span>
        </div>
      </footer>

      {/* Floating Bottom Cart Bar */}
      {cartTotalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40">
          <div
            onClick={() => setIsCartOpen(true)}
            className="p-3.5 rounded-2xl bg-[#c89666] text-black font-bold shadow-2xl flex items-center justify-between cursor-pointer hover:bg-[#deb887]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-black text-[#c89666] flex items-center justify-center font-black text-xs">
                {cartTotalItems}
              </div>
              <span className="text-xs font-black">View Coffee Bag</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm">₹{subtotal}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Cart Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#16120e] border-l border-[#3d2f23] h-full flex flex-col justify-between p-5 text-amber-100 modal-touch-scroll" data-lenis-prevent="true">
            <div className="flex items-center justify-between border-b border-[#3d2f23] pb-3">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#c89666]" />
                <h3 className="font-bold text-base text-white">Your Roastery Order ({cartTotalItems})</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-full text-amber-300 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#1e1813] border border-[#3d2f23]">
                  <div>
                    <h4 className="font-bold text-xs text-white">{item.name}</h4>
                    <span className="text-xs text-[#c89666]">₹{item.price} x {item.qty}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded bg-[#c89666] text-black font-black">-</button>
                    <span className="font-bold text-xs px-1">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="w-6 h-6 rounded bg-[#c89666] text-black font-black">+</button>
                  </div>
                </div>
              ))}

              {cartItems.length > 0 && (
                <div className="space-y-2 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0c09] border border-[#3d2f23] text-xs text-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp Phone Number *"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0c09] border border-[#3d2f23] text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Custom Brew Notes (e.g. Oat Milk, Sugar Free, Extra Hot)"
                    value={customerData.notes}
                    onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0c09] border border-[#3d2f23] text-xs text-white"
                  />
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-[#3d2f23] pt-3 space-y-3">
                <div className="flex items-center justify-between text-base font-black text-white">
                  <span>Grand Total</span>
                  <span className="text-[#c89666]">₹{grandTotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-[#c89666] text-black font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#deb887] cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Order to WhatsApp (₹{grandTotal})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
