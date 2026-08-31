import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { PRODUCTS } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { FadeIn, FadeInStagger, FadeInStaggerItem } from '../../components/common/MotionWrapper';
import { ProductCustomizationModal } from '../../components/common/ProductCustomizationModal';
import { Flame, Clock, Star, Plus, Sparkles, Award, UtensilsCrossed } from 'lucide-react';

export const SpecialsPage = () => {
  const { activeRestaurant } = useTenant();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const chefSpecials = PRODUCTS.filter(p => p.restaurantId === activeRestaurant.id && (p.isBestseller || p.isFeatured));

  return (
    <div className="min-h-screen bg-[#07080c] pb-24 space-y-12">
      <PageHeader
        title="Chef's Signature Tasting Degustation"
        subtitle="Limited-edition culinary preparations crafted exclusively for today using rare heirloom spices and slow wood-fire cooking."
        badge="Imperial Daily Specials"
        breadcrumbs={[{ label: 'Chef Specials' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner with Chef's Note */}
        <FadeIn>
          <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-500/30 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-gold-glow">
              <Award className="w-8 h-8" />
            </div>
            <div className="space-y-1 flex-1 text-center md:text-left">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                Chef Farooq's Imperial Recommendation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                "Each signature dish is slow-cooked over smoldering Kashmiri babool charcoal in hand-sealed clay handis, infusing pure saffron aromatics and aged Awadhi spice distillations."
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-300 text-xs font-bold shrink-0">
              ⚡ Limited to 30 Portions Today
            </div>
          </div>
        </FadeIn>

        {/* Specials Grid */}
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chefSpecials.map((product) => (
            <FadeInStaggerItem key={product.id}>
              <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 glass-card-hover flex flex-col h-full group">
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1118] via-transparent to-transparent" />

                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-gold-glow">
                      <Flame className="w-3 h-3" /> Degustation
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-xl bg-black/70 border border-white/15 backdrop-blur-md text-amber-400 text-xs font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating}</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> {product.prepTime}
                    </span>
                    {product.calories && (
                      <span className="bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        {product.calories} kcal
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Special Price</div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-extrabold text-amber-400">
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
                      onClick={() => setSelectedProduct(product)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs shadow-gold-glow hover:opacity-90 transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Customize</span>
                    </button>
                  </div>
                </div>
              </div>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>

      </div>

      {selectedProduct && (
        <ProductCustomizationModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
