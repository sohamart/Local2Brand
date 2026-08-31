import React, { useState, useMemo } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { PRODUCTS, CATEGORIES } from '../../data/mockData';
import { ProductCustomizationModal } from '../../components/common/ProductCustomizationModal';
import { Search, SlidersHorizontal, Star, Clock, Flame, Plus, Sparkles, Filter, X, Check } from 'lucide-react';

export const MenuPage = () => {
  const { activeRestaurant } = useTenant();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all', 'veg', 'nonveg'
  const [selectedSpicyLevel, setSelectedSpicyLevel] = useState('all'); // 'all', '0', '1', '2', '3'
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price_asc', 'price_desc', 'rating'
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  const restaurantProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.restaurantId === activeRestaurant.id);
  }, [activeRestaurant.id]);

  const restaurantCategories = useMemo(() => {
    return CATEGORIES.filter(c => c.restaurantId === activeRestaurant.id);
  }, [activeRestaurant.id]);

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    return restaurantProducts
      .filter(product => {
        // Search query match
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesTags = product.tags && product.tags.some(t => t.toLowerCase().includes(q));
          if (!matchesName && !matchesDesc && !matchesTags) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
          return false;
        }

        // Dietary filter
        if (dietaryFilter === 'veg' && !product.isVeg) return false;
        if (dietaryFilter === 'nonveg' && product.isVeg) return false;

        // Spice filter
        if (selectedSpicyLevel !== 'all' && product.spicyLevel !== Number(selectedSpicyLevel)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        if (sortBy === 'price_desc') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [restaurantProducts, searchQuery, selectedCategory, dietaryFilter, selectedSpicyLevel, sortBy]);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-2 py-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Epicurean A La Carte
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">
          Our Culinary Repertoire
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Explore recipes prepared with fresh ingredients, heritage charcoal tandoors, and master techniques.
        </p>
      </div>

      {/* Search and Advanced Filter Bar */}
      <div className="glass-panel p-4 rounded-3xl border border-white/10 space-y-4 shadow-xl">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search biryani, kebabs, curries, pizzas, mocktails..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dietary Filter (All / Veg / Non-Veg) */}
          <div className="md:col-span-3 flex bg-white/5 p-1 rounded-2xl border border-white/10 text-xs">
            {[
              { key: 'all', label: 'All Dishes' },
              { key: 'veg', label: '🌱 Pure Veg' },
              { key: 'nonveg', label: '🍗 Non-Veg' }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setDietaryFilter(item.key)}
                className={`flex-1 py-1.5 rounded-xl font-medium transition-all ${
                  dietaryFilter === item.key
                    ? 'bg-amber-500 text-black font-bold shadow-gold-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#141722] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="featured">Featured & Chef Specials</option>
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Category Horizontal Pill Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-white/5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-primary text-white shadow-glass-glow'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            All Categories ({restaurantProducts.length})
          </button>

          {restaurantCategories.map(cat => {
            const count = restaurantProducts.filter(p => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-brand-primary text-white shadow-glass-glow'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

      </div>

      {/* Results Count & Active Filters */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong className="text-white">{filteredProducts.length}</strong> delicacies</span>
        {(searchQuery || selectedCategory !== 'all' || dietaryFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setDietaryFilter('all');
            }}
            className="text-amber-400 hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Reset all filters
          </button>
        )}
      </div>

      {/* Dishes Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white">No Dishes Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or changing dietary filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="glass-panel rounded-3xl overflow-hidden border border-white/10 glass-card-hover flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative h-52 overflow-hidden">
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

              {/* Dish Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500">Price</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base sm:text-lg font-extrabold text-amber-400">
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
      )}

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
