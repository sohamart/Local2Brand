import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useTenant } from '../../context/TenantContext';
import { X, Sparkles, Plus, Minus, Check, Flame, Clock, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProductCustomizationModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const { addToCart } = useCart();
  const { activeRestaurant } = useTenant();

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

  const handleAddToCart = () => {
    addToCart(product, {
      variant: selectedVariant,
      selectedAddons,
      quantity,
      specialNotes
    });

    // Trigger subtle celebratory confetti
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#dfa645', '#e63946', '#2a9d8f']
      });
    } catch (e) {
      // ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-dropdown rounded-3xl overflow-hidden border border-white/20 shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header & Product Image */}
        <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-[#0f111a]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Dietary & Bestseller Badges */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-3 h-3 rounded-sm border flex items-center justify-center ${product.isVeg ? 'border-emerald-500' : 'border-red-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${product.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                </span>
                {product.isBestseller && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Bestseller
                  </span>
                )}
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white leading-tight drop-shadow-md">
                {product.name}
              </h3>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Unit Price</div>
              <div className="text-lg font-bold text-amber-400">{activeRestaurant.currency}{unitPrice}</div>
            </div>
          </div>
        </div>

        {/* Scrollable Customization Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <p className="text-xs text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Variants Selection (e.g. Portion / Size / Cut) */}
          {product.variants && product.variants.map((vGroup) => (
            <div key={vGroup.id} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span>{vGroup.name}</span>
                  <span className="text-[10px] text-amber-400 font-normal">(Required)</span>
                </span>
              </div>
              <div className="space-y-2">
                {vGroup.options.map((opt, idx) => {
                  const isSelected = selectedVariant?.label === opt.label;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(opt)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-gold-glow'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-500'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                        <span className="font-medium">{opt.label}</span>
                      </div>
                      <span className="text-amber-400 font-semibold">
                        {opt.priceDelta > 0 ? `+${activeRestaurant.currency}${opt.priceDelta}` : opt.priceDelta < 0 ? `-${activeRestaurant.currency}${Math.abs(opt.priceDelta)}` : 'Standard'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Add-ons & Extra Toppings */}
          {product.addons && product.addons.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Add-on Accompaniments
                </span>
                <span className="text-[10px] text-slate-400">Optional</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.addons.map((addon) => {
                  const isSelected = selectedAddons.some(a => a.name === addon.name);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs text-left transition-all ${
                        isSelected
                          ? 'bg-brand-primary/20 border-brand-primary/60 text-white shadow-glass-glow'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate mr-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-brand-primary border-brand-primary' : 'border-slate-500'}`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="font-medium truncate">{addon.name}</span>
                      </div>
                      <span className="text-amber-400 font-bold shrink-0">
                        +{activeRestaurant.currency}{addon.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kitchen Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white">
              Special Cooking Instructions
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Less spicy, extra crispy, no onions..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Footer with Quantity Stepper & Add to Cart CTA */}
        <div className="p-4 sm:p-5 bg-black/40 border-t border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-sm text-white px-2">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-brand-primary text-black font-bold text-xs sm:text-sm shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-between"
          >
            <span>Add Customized Item</span>
            <span className="font-extrabold">{activeRestaurant.currency}{grandTotal}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
