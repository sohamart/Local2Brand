import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Sparkles, 
  Utensils, 
  ChefHat, 
  Soup, 
  Cake, 
  Wine, 
  Search, 
  Plus, 
  Minus, 
  Star, 
  Clock, 
  Eye
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

const categoryIcons = {
  "specials": Sparkles,
  "grills": Flame,
  "starters": Utensils,
  "mains": ChefHat,
  "biryani": Soup,
  "desserts": Cake,
  "beverages": Wine
};

export default function MenuSection({ onSelectDish }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all', 'veg', 'non-veg'
  const [onlySpicy, setOnlySpicy] = useState(false);

  const { cart, addToCart, updateQuantity } = useCart();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await api.getMenu();
      setItems(res.items || []);
      setCategories(res.categories || []);
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (dietaryFilter === 'veg' && !item.is_veg) return false;
    if (dietaryFilter === 'non-veg' && item.is_veg) return false;
    if (onlySpicy && !item.is_spicy) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q));
    }
    return true;
  });

  const getItemQuantityInCart = (itemId) => {
    const found = cart.find(i => i.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <section id="menu" className="py-24 bg-[#171310] relative border-b border-[#A9865A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#231d19] border border-[#A9865A]/30 text-[#E8AC4E] text-[11px] font-mono uppercase tracking-widest mb-3">
            <Flame className="w-3 h-3 text-[#D8632C]" />
            <span>Open-Flame Fire & Tandoor Plates</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F3E9D8] tracking-tight mb-4">
            Curated <span className="italic font-normal text-[#E8AC4E]">Artisanal Menu</span>
          </h2>
          <p className="text-[#D6C8B2] text-sm sm:text-base font-sans font-normal">
            Smoked over seasoned wood coals, slow-dum simmered in clay handis, and plated with hand-ground spices.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#231d19]/90 border border-[#A9865A]/30 rounded-2xl p-4 mb-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Monospaced Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#A9865A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes (Tikka, Biryani, Naan)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-xs text-[#F3E9D8] placeholder-[#A9865A]/60 font-mono focus:outline-none focus:border-[#D8632C] transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A9865A] hover:text-[#F3E9D8] text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Stamped Seals Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            
            <button
              onClick={() => setDietaryFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                dietaryFilter === 'all'
                  ? 'bg-[#E8AC4E] text-[#171310] font-bold shadow-md'
                  : 'bg-[#171310] text-[#D6C8B2] border border-[#A9865A]/30 hover:border-[#A9865A]'
              }`}
            >
              All Plates
            </button>

            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
              className={`stamp-seal-veg cursor-pointer transition-all ${
                dietaryFilter === 'veg' ? 'bg-[#33402E] text-white ring-1 ring-[#92b584]' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <span>● PURE VEG</span>
            </button>

            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'non-veg' ? 'all' : 'non-veg')}
              className={`stamp-seal-ember cursor-pointer transition-all ${
                dietaryFilter === 'non-veg' ? 'bg-[#D8632C] text-[#171310] ring-1 ring-[#D8632C]' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <span>▲ NON-VEG</span>
            </button>

            <button
              onClick={() => setOnlySpicy(!onlySpicy)}
              className={`stamp-seal-spice cursor-pointer transition-all ${
                onlySpicy ? 'bg-[#E8AC4E] text-[#171310] ring-1 ring-[#E8AC4E]' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>SPICY FIRES</span>
            </button>

          </div>
        </div>

        {/* Branded Forged Skewer Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none border-b border-[#A9865A]/20">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`skewer-tab px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'active text-[#E8AC4E] font-bold'
                : 'text-[#D6C8B2] hover:text-[#F3E9D8]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D8632C]" />
            <span>Full Kitchen ({items.length})</span>
          </button>

          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug] || Utensils;
            const count = items.filter(i => i.category === cat.name).length;
            const isActive = selectedCategory === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`skewer-tab px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'active text-[#E8AC4E] font-bold'
                    : 'text-[#D6C8B2] hover:text-[#F3E9D8]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#A9865A]" />
                <span>{cat.name}</span>
                <span className="text-[10px] text-[#A9865A]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Menu Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-80 rounded-2xl bg-[#231d19]/50 border border-[#A9865A]/20 animate-pulse"></div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-[#231d19]/40 rounded-3xl border border-[#A9865A]/20 font-mono">
            <Utensils className="w-10 h-10 text-[#A9865A] mx-auto mb-3 opacity-60" />
            <h3 className="text-[#F3E9D8] font-bold text-base mb-1">No matching dishes fired</h3>
            <p className="text-[#A9865A] text-xs">Try selecting a different filter or clearing search.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredItems.map((item) => {
              const qty = getItemQuantityInCart(item.id);
              const discountPercent = item.original_price && item.original_price > item.price
                ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
                : 0;

              return (
                <div
                  key={item.id}
                  className="dish-card rounded-2xl overflow-hidden bg-[#231d19]/80 border border-[#A9865A]/20 flex flex-col justify-between group relative"
                >
                  {/* Dish Image Container with Steam Wisp */}
                  <div 
                    className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#0f0c0a] cursor-pointer"
                    onClick={() => onSelectDish(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Dark Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#231d19] via-transparent to-[#171310]/40"></div>

                    {/* Steam Wisp Animated Effect */}
                    <div className="steam-wisp absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 flex gap-2">
                      <svg className="w-8 h-12 text-[#F3E9D8]" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 32 C 6 24, 18 20, 12 10 C 9 5, 15 2, 18 0" strokeDasharray="3 3" />
                      </svg>
                      <svg className="w-6 h-10 text-[#E8AC4E]" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 32 C 12 24, 4 18, 8 10 C 11 5, 6 2, 8 0" strokeDasharray="2 2" />
                      </svg>
                    </div>

                    {/* Stamped Seals on Image */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
                      {item.is_veg ? (
                        <span className="stamp-seal-veg">VEG</span>
                      ) : (
                        <span className="stamp-seal-ember">NON-VEG</span>
                      )}

                      {item.is_bestseller === 1 && (
                        <span className="stamp-seal-spice">★ CHEF SIGNATURE</span>
                      )}

                      {discountPercent > 0 && (
                        <span className="stamp-seal-ember">{discountPercent}% OFF</span>
                      )}
                    </div>

                    {/* Quick View Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectDish(item); }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#171310]/80 border border-[#A9865A]/40 text-[#D6C8B2] hover:text-[#F3E9D8] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Inspect Dish"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Rating & Prep Time Monospace Footer */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-[#D6C8B2]">
                      <div className="flex items-center gap-1 bg-[#171310]/85 px-2 py-0.5 rounded border border-[#A9865A]/30">
                        <Star className="w-3 h-3 text-[#E8AC4E] fill-[#E8AC4E]" />
                        <span className="font-bold text-[#E8AC4E]">{item.rating || 4.9}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-[#171310]/85 px-2 py-0.5 rounded border border-[#A9865A]/30 text-[#A9865A]">
                        <Clock className="w-3 h-3" />
                        <span>{item.prep_time || '20m'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 
                          onClick={() => onSelectDish(item)}
                          className="font-display font-bold text-base text-[#F3E9D8] hover:text-[#E8AC4E] transition-colors cursor-pointer line-clamp-1"
                        >
                          {item.name}
                        </h3>
                        {item.is_spicy === 1 && (
                          <span title="Charcoal Spiced" className="text-[#D8632C] shrink-0">
                            <Flame className="w-4 h-4 fill-[#D8632C]/20" />
                          </span>
                        )}
                      </div>

                      <p className="text-[#D6C8B2]/80 text-xs line-clamp-2 leading-relaxed mb-4 font-sans font-normal">
                        {item.description}
                      </p>
                    </div>

                    {/* Price and Cart Action */}
                    <div className="pt-3 border-t border-[#A9865A]/20 flex items-center justify-between">
                      <div className="font-mono">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-[#E8AC4E]">
                            ₹{item.price}
                          </span>
                          {item.original_price && item.original_price > item.price && (
                            <span className="text-xs text-[#A9865A] line-through">
                              ₹{item.original_price}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add or Quantity Controls */}
                      {item.is_available === 0 ? (
                        <span className="font-mono text-[10px] text-[#A9865A] px-2.5 py-1 bg-[#171310] rounded border border-[#A9865A]/30">
                          Sold Out
                        </span>
                      ) : qty === 0 ? (
                        <button
                          onClick={() => addToCart(item)}
                          className="btn-brass-pill px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold text-[#E8AC4E] hover:text-[#171310] hover:bg-[#E8AC4E] flex items-center gap-1.5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-[#171310] border border-[#A9865A]/40 rounded-lg px-2 py-1 font-mono">
                          <button
                            onClick={() => updateQuantity(item.id, qty - 1)}
                            className="w-5 h-5 rounded bg-[#231d19] hover:bg-[#332b25] text-[#D6C8B2] flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs text-[#E8AC4E] w-4 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, qty + 1)}
                            className="w-5 h-5 rounded bg-[#D8632C] hover:bg-[#e37440] text-[#171310] flex items-center justify-center font-bold transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

      </div>
    </section>
  );
}
