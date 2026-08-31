import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { PRODUCTS, CATEGORIES, COUPONS, REVIEWS } from '../../data/mockData';
import { ProductCustomizationModal } from '../../components/common/ProductCustomizationModal';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Star,
  Clock,
  Plus,
  Calendar,
  Award,
  CheckCircle2,
  Tag,
  Copy,
  Check,
  ChevronRight,
  MapPin,
  Phone,
  ShieldCheck,
  Heart
} from 'lucide-react';

export const HomePage = () => {
  const { activeRestaurant } = useTenant();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]?.id || '');
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [copiedCoupon, setCopiedCoupon] = useState('');

  const restaurantProducts = PRODUCTS.filter(p => p.restaurantId === activeRestaurant.id);
  const featuredProducts = restaurantProducts.filter(p => p.isFeatured || p.isBestseller);
  const filteredProducts = activeCategory
    ? restaurantProducts.filter(p => p.categoryId === activeCategory)
    : restaurantProducts;

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(''), 2000);
  };

  return (
    <div className="min-h-screen space-y-20 pb-20">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* Background glow and subtle ambient elements */}
        <div className="absolute inset-0 bg-[#0c0e14]/70 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 filter blur-[2px] transition-transform duration-1000"
          style={{ backgroundImage: `url(${activeRestaurant.coverImage})` }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-radial-glow opacity-50 pointer-events-none z-10" />

        <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-amber-500/40 backdrop-blur-md shadow-gold-glow">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
                {activeRestaurant.cuisine.join(' • ')}
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              {activeRestaurant.sections?.hero?.title || 'An Imperial Feast For Connoisseurs'}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {activeRestaurant.sections?.hero?.subtitle || activeRestaurant.description}
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/menu"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-brand-primary text-black font-bold text-sm shadow-gold-glow hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span>Explore A La Carte Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/reserve"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-md transition-all flex items-center gap-2 hover:border-amber-400/50"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Reserve Banquet Table</span>
              </Link>
            </div>

            {/* Key Metrics / Highlights */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="font-heading text-xl sm:text-2xl font-bold text-amber-400">4.9 ★</div>
                <div className="text-[11px] text-slate-400">Michelin Rated</div>
              </div>
              <div>
                <div className="font-heading text-xl sm:text-2xl font-bold text-white">100%</div>
                <div className="text-[11px] text-slate-400">Artisan Wood-Fired</div>
              </div>
              <div>
                <div className="font-heading text-xl sm:text-2xl font-bold text-amber-400">30 Min</div>
                <div className="text-[11px] text-slate-400">Gourmet Delivery</div>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Luxury Food Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-72 sm:w-88 lg:w-96 aspect-square group">
              
              {/* Spinning background halo */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/30 to-brand-primary/30 rounded-full blur-2xl group-hover:opacity-100 transition-opacity animate-pulse-subtle" />
              
              {/* Circular Food Image Frame */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-amber-400/40 shadow-2xl p-2 bg-[#0c0e14]/50 backdrop-blur-md animate-float-slow">
                <img
                  src={activeRestaurant.heroImage}
                  alt={activeRestaurant.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Badge 1: Chef Special */}
              <div className="absolute -top-3 -right-2 glass-dropdown px-3.5 py-2 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-2 text-xs backdrop-blur-xl animate-bounce">
                <Flame className="w-4 h-4 text-brand-primary shrink-0" />
                <div>
                  <div className="font-bold text-white text-[11px]">Today's Special</div>
                  <div className="text-[9px] text-amber-400">Slow Charcoal Dum</div>
                </div>
              </div>

              {/* Floating Badge 2: Delivery Ready */}
              <div className="absolute -bottom-4 -left-2 glass-dropdown px-3.5 py-2.5 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-2.5 text-xs backdrop-blur-xl">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-xs">Royal Heritage</div>
                  <div className="text-[10px] text-slate-400">Pure Ghee & Saffron</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* 2. TODAY'S SIGNATURE SPECIALS */}
      <section id="specials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Degustation Selection
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white mt-1">
              Chef's Signature Dishes
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
          >
            <span>View Complete Menu</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.slice(0, 3).map((product) => (
            <div
              key={product.id}
              className="glass-panel rounded-3xl overflow-hidden border border-white/10 glass-card-hover flex flex-col group"
            >
              {/* Product Image & Badges */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141721] via-transparent to-transparent" />

                {/* Dietary badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center bg-black/60 backdrop-blur-md ${product.isVeg ? 'border-emerald-500' : 'border-red-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${product.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </span>
                  {product.isBestseller && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-black text-[10px] font-extrabold uppercase tracking-wider">
                      Bestseller
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 border border-white/15 backdrop-blur-md text-amber-400 text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    <Clock className="w-3 h-3 text-amber-400" /> {product.prepTime}
                  </span>
                  {product.calories && (
                    <span className="bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {product.calories} kcal
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500">Price</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-amber-400">
                        {activeRestaurant.currency}{product.discountPrice || product.price}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-slate-500 line-through">
                          {activeRestaurant.currency}{product.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedProductForModal(product)}
                    className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 hover:text-black border border-amber-500/40 text-amber-300 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Customize</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>


      {/* 3. INTERACTIVE CATEGORY MENU PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            A La Carte Discovery
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white">
            Explore Royal Categories
          </h2>
        </div>

        {/* Category Pill Switcher */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.filter(c => c.restaurantId === activeRestaurant.id).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-black font-bold shadow-gold-glow'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filtered Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-400/30 transition-all flex items-center gap-4 group"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
              />

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-sm border flex items-center justify-center shrink-0 ${product.isVeg ? 'border-emerald-500' : 'border-red-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${product.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </span>
                  <h4 className="font-heading text-sm sm:text-base font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                    {product.name}
                  </h4>
                </div>

                <p className="text-xs text-slate-400 line-clamp-1">
                  {product.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-amber-400">
                    {activeRestaurant.currency}{product.discountPrice || product.price}
                  </span>

                  <button
                    onClick={() => setSelectedProductForModal(product)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-amber-500 hover:text-black text-white text-xs font-semibold transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>


      {/* 4. RESTAURANT STORY / HERITAGE */}
      <section id="story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Heritage & Craftsmanship
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white leading-tight">
              {activeRestaurant.sections?.story?.title || 'A Legacy of Gastronomic Mastery'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              {activeRestaurant.sections?.story?.text || activeRestaurant.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <div className="text-amber-400 font-bold text-lg">72-Hour Dum</div>
                <div className="text-xs text-slate-400">Slow Handi Infusion</div>
              </div>
              <div className="space-y-1">
                <div className="text-amber-400 font-bold text-lg">Heritage Spices</div>
                <div className="text-xs text-slate-400">Hand-ground Kashmiri saffron</div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/reserve"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-gold-glow hover:opacity-90 transition-opacity"
              >
                <span>Reserve An Exclusive Tasting Table</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
                alt="Chef preparing royal dish"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

        </div>
      </section>


      {/* 5. FESTIVE OFFERS & PROMO COUPONS */}
      <section id="offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Exclusive Privileges
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Offers & Promo Campaigns
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COUPONS.filter(c => c.restaurantId === activeRestaurant.id || c.restaurantId === 'rest-001').map((coupon) => (
            <div
              key={coupon.id}
              className="glass-panel p-5 rounded-2xl border border-amber-500/20 shadow-gold-glow relative overflow-hidden space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  <Tag className="w-4 h-4" />
                  <span className="font-bold text-sm tracking-wider">{coupon.code}</span>
                </div>
                <button
                  onClick={() => handleCopyCoupon(coupon.code)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-amber-500 hover:text-black text-white text-[11px] font-semibold transition-all flex items-center gap-1"
                >
                  {copiedCoupon === coupon.code ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCoupon === coupon.code ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 font-medium">
                {coupon.description}
              </p>

              <div className="text-[10px] text-slate-500 pt-2 border-t border-white/10 flex justify-between">
                <span>Min Order: {activeRestaurant.currency}{coupon.minOrder}</span>
                <span>Valid till: {coupon.expiresAt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* 6. VERIFIED REVIEWS & RATINGS */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Connoisseur Acclaim
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white">
            What Our Patrons Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                />
                <div>
                  <h5 className="text-xs font-bold text-white">{rev.author}</h5>
                  <span className="text-[10px] text-amber-400">Dined for: {rev.dish}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* 7. TABLE RESERVATION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl bg-gradient-to-b from-[#181b28] to-[#0c0e14]">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Private Dining & Celebrations
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white">
              Reserve Your Table at {activeRestaurant.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              Experience personalized silver-service, custom degustation pairings, and celebratory royal ambiance.
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              to="/reserve"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-brand-primary text-black font-bold text-sm shadow-gold-glow hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book An Imperial Table</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Customization Modal */}
      {selectedProductForModal && (
        <ProductCustomizationModal
          product={selectedProductForModal}
          isOpen={!!selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}

    </div>
  );
};
