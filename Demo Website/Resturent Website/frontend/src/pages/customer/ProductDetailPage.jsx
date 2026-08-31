import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { PRODUCTS } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { FadeIn, FadeInStagger, FadeInStaggerItem } from '../../components/common/MotionWrapper';
import { Star, Clock, Flame, Plus, Minus, Check, Heart, Sparkles, ChevronLeft, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const { activeRestaurant } = useTenant();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = PRODUCTS.find(p => p.slug === slug) || PRODUCTS[0];

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0].options[0] : null
  );
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');

  const toggleAddon = (addon) => {
    if (selectedAddons.some(a => a.name === addon.name)) {
      setSelectedAddons(prev => prev.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddons(prev => [...prev, addon]);
    }
  };

  const basePrice = product.discountPrice || product.price;
  const variantDelta = selectedVariant ? selectedVariant.priceDelta : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + variantDelta + addonsTotal;
  const grandTotal = unitPrice * quantity;

  const handleAdd = () => {
    addToCart(product, {
      variant: selectedVariant,
      selectedAddons,
      quantity,
      specialNotes
    });

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}
  };

  const relatedProducts = PRODUCTS.filter(p => p.restaurantId === activeRestaurant.id && p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#07080c] pb-24 space-y-12">
      <PageHeader
        title={product.name}
        subtitle={product.tags?.join(' • ')}
        badge={product.isBestseller ? 'Imperial Signature' : 'A La Carte Delicacy'}
        breadcrumbs={[
          { label: 'Menu', path: '/menu' },
          { label: product.name }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Main Product Showcase Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Food Imagery & Badges */}
          <FadeIn className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className={`w-4 h-4 rounded-md border flex items-center justify-center bg-black/60 backdrop-blur-md ${product.isVeg ? 'border-emerald-500' : 'border-red-500'}`}>
                  <span className={`w-2 h-2 rounded-full ${product.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                </span>
                {product.isBestseller && (
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-extrabold uppercase shadow-gold-glow">
                    Bestseller
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                <span className="bg-black/60 px-3 py-1 rounded-xl backdrop-blur-md flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Prep: {product.prepTime}
                </span>
                {product.calories && (
                  <span className="bg-black/60 px-3 py-1 rounded-xl backdrop-blur-md">
                    {product.calories} Calories
                  </span>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Right: Customization Controls & Add-to-Cart */}
          <FadeIn direction="left" className="lg:col-span-6 space-y-6 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
            
            <div className="space-y-2 border-b border-white/10 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-sm">{product.rating}</span>
                  <span className="text-slate-400 text-xs">({product.ratingCount || 120} reviews)</span>
                </div>
                <div className="text-xl font-extrabold text-amber-400">
                  {activeRestaurant.currency}{unitPrice}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.map((vg) => (
              <div key={vg.id} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white">
                  {vg.name}
                </label>
                <div className="space-y-2">
                  {vg.options.map((opt, idx) => {
                    const isSelected = selectedVariant?.label === opt.label;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariant(opt)}
                        className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/60 text-white shadow-gold-glow'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-medium">{opt.label}</span>
                        <span className="text-amber-400 font-bold">
                          {opt.priceDelta > 0 ? `+${activeRestaurant.currency}${opt.priceDelta}` : 'Included'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Addons */}
            {product.addons && product.addons.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white">
                  Imperial Accompaniments & Add-ons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.addons.map((add) => {
                    const isSelected = selectedAddons.some(a => a.name === add.name);
                    return (
                      <button
                        key={add.id}
                        onClick={() => toggleAddon(add)}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs text-left transition-all ${
                          isSelected
                            ? 'bg-brand-primary/20 border-brand-primary/60 text-white shadow-glass-glow'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate mr-1">{add.name}</span>
                        <span className="text-amber-400 font-bold">+{activeRestaurant.currency}{add.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Kitchen Instructions */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-white">
                Chef Preparation Notes
              </label>
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Medium spicy, crisp onions on top..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Quantity Stepper & Final Add Button */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-white px-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-brand-primary text-black font-extrabold text-xs sm:text-sm shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-between px-5"
              >
                <span>Add Customized Dish</span>
                <span>{activeRestaurant.currency}{grandTotal}</span>
              </button>
            </div>

          </FadeIn>

        </div>

        {/* Related Dishes */}
        <div className="space-y-6">
          <h3 className="font-heading text-2xl font-bold text-white">You May Also Relish</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(rp => (
              <Link
                key={rp.id}
                to={`/product/${rp.slug}`}
                className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all flex items-center gap-4 group"
              >
                <img
                  src={rp.image}
                  alt={rp.name}
                  className="w-16 h-16 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors line-clamp-1">{rp.name}</h4>
                  <span className="text-amber-400 font-bold text-xs">{activeRestaurant.currency}{rp.discountPrice || rp.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
