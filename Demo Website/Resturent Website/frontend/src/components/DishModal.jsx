import React from 'react';
import { X, Star, Clock, Flame, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function DishModal({ dish, onClose }) {
  const { cart, addToCart, updateQuantity } = useCart();

  if (!dish) return null;

  const inCart = cart.find(i => i.id === dish.id);
  const qty = inCart ? inCart.quantity : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg bg-[#231d19] border border-[#A9865A]/40 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[#171310]/90 border border-[#A9865A]/40 text-[#D6C8B2] hover:text-[#F3E9D8] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Image */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-[#0f0c0a] shrink-0">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#231d19] via-transparent to-[#171310]/50"></div>
          
          <div className="absolute top-4 left-4 flex gap-2">
            {dish.is_veg ? (
              <span className="stamp-seal-veg">PURE VEG</span>
            ) : (
              <span className="stamp-seal-ember">NON-VEG</span>
            )}

            {dish.is_bestseller === 1 && (
              <span className="stamp-seal-spice">★ TANDOOR SPECIAL</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 space-y-4 sm:space-y-6 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs text-[#A9865A]">
              <span className="uppercase tracking-wider">{dish.category}</span>
              <div className="flex items-center gap-1 text-[#E8AC4E]">
                <Star className="w-3.5 h-3.5 fill-[#E8AC4E]" />
                <span className="font-bold">{dish.rating || 4.9} Verified</span>
              </div>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F3E9D8] mb-3">
              {dish.name}
            </h3>

            <p className="text-[#D6C8B2] text-sm leading-relaxed font-sans font-normal">
              {dish.description}
            </p>
          </div>

          {/* Kitchen Details Monospace Row */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#A9865A]/20 font-mono text-xs text-[#D6C8B2]">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#E8AC4E]" />
              <span>Prep: <strong className="text-[#F3E9D8]">{dish.prep_time || '20m'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-[#D8632C]" />
              <span>Flame: <strong className="text-[#F3E9D8]">{dish.is_spicy ? 'Charcoal High' : 'Slow Dum Simmer'}</strong></span>
            </div>
          </div>

          {/* Price & Action Row */}
          <div className="flex items-center justify-between pt-2 font-mono">
            <div>
              <span className="text-[10px] text-[#A9865A] block uppercase">Plated Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#E8AC4E]">
                  ₹{dish.price}
                </span>
                {dish.original_price && dish.original_price > dish.price && (
                  <span className="text-sm text-[#A9865A] line-through">
                    ₹{dish.original_price}
                  </span>
                )}
              </div>
            </div>

            {dish.is_available === 0 ? (
              <span className="px-4 py-2 rounded-xl bg-[#171310] text-[#A9865A] text-xs font-mono">
                Sold Out
              </span>
            ) : qty === 0 ? (
              <button
                onClick={() => addToCart(dish)}
                className="btn-ember-primary px-6 py-3 rounded-full text-xs font-sans font-bold flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Tray</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-[#171310] border border-[#A9865A]/40 rounded-xl px-3 py-1.5 font-mono">
                <button
                  onClick={() => updateQuantity(dish.id, qty - 1)}
                  className="w-7 h-7 rounded bg-[#231d19] hover:bg-[#332b25] text-[#D6C8B2] flex items-center justify-center transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-[#E8AC4E] w-5 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => updateQuantity(dish.id, qty + 1)}
                  className="w-7 h-7 rounded bg-[#D8632C] hover:bg-[#e37440] text-[#171310] flex items-center justify-center transition-colors font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
