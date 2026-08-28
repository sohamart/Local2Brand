import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Phone,
  Send,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  X,
  Tag,
  Star,
  Search,
  ChevronDown,
  MapPin,
  Heart,
  ArrowRight
} from 'lucide-react';
import { boutiqueConfig } from './config';

export default function BoutiqueDemo({ customConfig }) {
  const config = customConfig || boutiqueConfig;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', size: 'Custom Sized', notes: '' });

  const filteredProducts = useMemo(() => {
    return config.products.filter(p => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch = searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.fabric.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [config.products, selectedCategory, searchQuery]);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const item = config.products.find(p => p.id === Number(id));
        return item ? { ...item, qty } : null;
      })
      .filter(Boolean);
  }, [cart, config.products]);

  const totalItems = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const grandTotal = Math.max(0, subtotal - discount);

  const addToCart = (product) => {
    setCart(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const u = { ...prev };
      if (u[id] > 1) u[id] -= 1;
      else delete u[id];
      return u;
    });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const found = config.activeCoupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (found && subtotal >= found.minOrder) {
      setAppliedCoupon(found);
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!customer.name || !customer.phone) {
      alert("Please provide Name and Phone!");
      return;
    }

    const itemsText = cartItems
      .map((p, i) => `${i + 1}. *${p.name}* x ${p.qty} = ₹${p.price * p.qty}`)
      .join('\n');

    const couponText = appliedCoupon ? `🎁 Coupon Applied: *${appliedCoupon.code}* (-₹${discount})\n` : '';

    const text =
      `👗 *BOUTIQUE ORDER INQUIRY - ${config.businessName}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Customer:* ${customer.name}\n` +
      `📞 *WhatsApp Phone:* ${customer.phone}\n` +
      `📏 *Size Choice:* ${customer.size}\n` +
      `📍 *Shipping Address:* ${customer.address || 'Standard Delivery'}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 *SELECTED COUTURE PIECES:*\n${itemsText}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 Subtotal: ₹${subtotal}\n` +
      couponText +
      `💰 *GRAND TOTAL: ₹${grandTotal}*\n` +
      (customer.notes ? `📝 Customization Notes: ${customer.notes}\n` : '') +
      `\n✨ Please confirm stock availability and dispatch time!`;

    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0b080d] text-[#faedf5] font-sans selection:bg-purple-600 selection:text-white overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#1c0e22] text-purple-300 text-xs font-bold py-2 px-4 text-center border-b border-[#3b1c47] shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span>✨ 100% PURE SILK MARK CERTIFIED HANDLOOMS • COMPLIMENTARY CUSTOM FIT TAILORING ON ALL LEHENGAS</span>
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#120c15]/95 backdrop-blur-2xl border-b border-purple-950 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-lg shadow-purple-600/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-base text-white block leading-none">{config.businessName}</span>
              <span className="text-[10px] text-purple-400 tracking-wider uppercase mt-0.5 block font-bold">{config.businessSubtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-purple-200/80">
            <a href="#collection" className="hover:text-purple-400">Collections</a>
            <a href="#offers" className="hover:text-purple-400">Offers</a>
            <a href="#reviews" className="hover:text-purple-400">Lookbook</a>
            <a href="#location" className="hover:text-purple-400">Flagship Galleria</a>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2 rounded-full text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md flex items-center gap-1.5 cursor-pointer relative"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden xs:inline">Bag</span>
            {totalItems > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center justify-center shadow-md animate-scale">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Showcase */}
      <header className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt="Boutique Lookbook" className="w-full h-full object-cover brightness-[0.25] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b080d] via-[#0b080d]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#271530] text-purple-300 border border-[#522964] inline-flex items-center gap-1.5 shadow-xl">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Heritage Weaves • Hand-Embroidered Zardozi</span>
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Heirloom Handlooms & <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">Royal Bridal Couture</span>
          </h1>

          <p className="text-sm sm:text-base text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            {config.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#collection"
              className="px-7 py-3 rounded-full text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/25 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Latest Lookbook</span>
            </a>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#1a101f] text-white border border-purple-900 hover:bg-[#25152c] cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-purple-400" />
              <span>Order via WhatsApp</span>
            </button>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-xs text-purple-300">
            <div className="p-3 rounded-2xl bg-[#140e18] border border-purple-950">
              <span className="block font-black text-white text-sm">Silk Mark</span>
              <span className="text-[11px]">100% Pure Certified Katan</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#140e18] border border-purple-950">
              <span className="block font-black text-white text-sm">Zardozi Work</span>
              <span className="text-[11px]">Real Zari Hand Embroidery</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#140e18] border border-purple-950">
              <span className="block font-black text-white text-sm">Custom Sizing</span>
              <span className="text-[11px]">WhatsApp Video Measurements</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#140e18] border border-purple-950">
              <span className="block font-black text-white text-sm">Express Shipping</span>
              <span className="text-[11px]">Worldwide Doorstep Delivery</span>
            </div>
          </div>
        </div>
      </header>

      {/* Promo Offers Bar */}
      <section id="offers" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-5 sm:p-6 rounded-3xl bg-[#170e1c] border border-[#3b1c47] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-600/50 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Festive Couture Offer</span>
              <h3 className="text-base sm:text-lg font-bold text-white">Save 10% on Orders Above ₹5,000!</h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {config.activeCoupons.map((c) => (
              <div key={c.code} className="px-4 py-2 rounded-2xl bg-[#0b080d] border border-dashed border-purple-500/60 flex items-center gap-3">
                <div>
                  <span className="font-mono font-black text-purple-300 text-xs block">{c.code}</span>
                  <span className="text-[10px] text-purple-300/60">{c.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection Suite */}
      <section id="collection" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Exclusive Pieces</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Handcrafted Couture Collection</h2>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar justify-start sm:justify-center mb-8">
          {config.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-[#140e18] text-purple-300/80 border border-purple-950 hover:bg-[#201526]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => {
            const inCart = cart[prod.id] || 0;

            return (
              <div
                key={prod.id}
                className="rounded-3xl bg-[#140e18] border border-purple-950 overflow-hidden flex flex-col justify-between hover:border-purple-500/50 transition-all shadow-xl group"
              >
                <div className="h-72 overflow-hidden relative">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-900/80 backdrop-blur-md text-[10px] font-bold text-white">
                    {prod.category}
                  </span>
                  {prod.isBestseller && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase">
                      Bestseller
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-white">{prod.name}</h3>
                    <div className="text-xl font-black text-purple-300 mt-1">₹{prod.price.toLocaleString('en-IN')}</div>
                    <span className="text-[11px] text-purple-400/80 block mt-1 font-medium">{prod.fabric}</span>
                    <p className="text-xs text-purple-200/70 leading-relaxed mt-2">{prod.description}</p>
                  </div>

                  <div className="pt-2 border-t border-purple-950/60 flex items-center justify-between gap-2">
                    {inCart > 0 ? (
                      <div className="flex-1 flex items-center justify-between p-1 bg-[#231429] rounded-xl border border-purple-500/40">
                        <button onClick={() => removeFromCart(prod.id)} className="w-8 h-8 rounded bg-purple-600 text-white font-black"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="font-bold text-xs text-white">{inCart} in Bag</span>
                        <button onClick={() => addToCart(prod)} className="w-8 h-8 rounded bg-purple-600 text-white font-black"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(prod)}
                        className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Client Reviews</span>
          <h2 className="font-serif text-3xl font-bold text-white">Words from Our Real Brides</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#140e18] border border-purple-950 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, r) => <Star key={r} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-purple-200/80 italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-purple-950">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-purple-500/40" />
                <div>
                  <span className="font-bold text-xs text-white block">{t.name}</span>
                  <span className="text-[10px] text-purple-400">{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Help & Info</span>
          <h2 className="font-serif text-3xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {config.faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl bg-[#140e18] border border-purple-950 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-purple-300/70 leading-relaxed border-t border-purple-950 pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="location" className="py-12 px-4 sm:px-8 bg-[#070508] border-t border-purple-950 text-purple-300/60 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <span className="font-serif font-bold text-base text-white block">{config.businessName}</span>
            <p className="text-xs">{config.tagline}</p>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Galleria Address</span>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>{config.address}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">Boutique Hours</span>
            <div>Weekdays: {config.hours.weekdays}</div>
            <div>Weekends: {config.hours.weekends}</div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase">WhatsApp Support</span>
            <a
              href={`https://wa.me/${config.whatsapp}`}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-purple-500"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp: {config.phone}</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-purple-950 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {config.businessName}. All rights reserved.</span>
          <span className="text-purple-400 font-bold">Production Ready Platform by LOCAL2BRAND</span>
        </div>
      </footer>

      {/* Slide-Over Bag Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#140e18] border-l border-purple-950 h-full flex flex-col justify-between p-5 text-purple-100 modal-touch-scroll" data-lenis-prevent="true">
            <div className="flex items-center justify-between border-b border-purple-950 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-base text-white">Your Couture Bag ({totalItems})</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-full text-purple-300 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#1d1423] border border-purple-900/40">
                  <div>
                    <h4 className="font-bold text-xs text-white">{item.name}</h4>
                    <span className="text-xs text-purple-300">₹{item.price} x {item.qty}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded bg-purple-600 text-white font-black">-</button>
                    <span className="font-bold text-xs px-1">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="w-6 h-6 rounded bg-purple-600 text-white font-black">+</button>
                  </div>
                </div>
              ))}

              {cartItems.length > 0 && (
                <div className="space-y-2 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#09060b] border border-purple-950 text-xs text-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp Phone Number *"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#09060b] border border-purple-950 text-xs text-white"
                  />
                  <select
                    value={customer.size}
                    onChange={(e) => setCustomer({ ...customer, size: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#09060b] border border-purple-950 text-xs text-white"
                  >
                    <option value="Small (S) - 34 Bust">Small (S) - 34 Bust</option>
                    <option value="Medium (M) - 36 Bust">Medium (M) - 36 Bust</option>
                    <option value="Large (L) - 38 Bust">Large (L) - 38 Bust</option>
                    <option value="Custom Bespoke Sizing (Tailor will contact)">Custom Bespoke Tailoring</option>
                  </select>
                  <textarea
                    rows={2}
                    placeholder="Delivery Address *"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#09060b] border border-purple-950 text-xs text-white resize-none"
                  />
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-purple-950 pt-3 space-y-3">
                <div className="flex items-center justify-between text-base font-black text-white">
                  <span>Grand Total</span>
                  <span className="text-purple-300">₹{subtotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Order on WhatsApp (₹{subtotal})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
