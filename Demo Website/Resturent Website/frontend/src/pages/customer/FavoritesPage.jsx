import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { PRODUCTS } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { FadeIn, FadeInStagger, FadeInStaggerItem } from '../../components/common/MotionWrapper';
import { ProductCustomizationModal } from '../../components/common/ProductCustomizationModal';
import { Heart, Plus, Star, Clock, ShoppingBag, ArrowRight } from 'lucide-react';

export const FavoritesPage = () => {
  const { activeRestaurant } = useTenant();
  const { addToCart } = useCart();
  const [favoriteItems, setFavoriteItems] = useState(
    PRODUCTS.filter(p => p.restaurantId === activeRestaurant.id).slice(0, 4)
  );
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleRemoveFavorite = (id) => {
    setFavoriteItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#07080c] pb-24 space-y-12">
      <PageHeader
        title="Your Saved Epicurean Favorites"
        subtitle="Quickly reorder your most cherished royal dishes and culinary selections."
        badge="Patron Wishlist"
        breadcrumbs={[{ label: 'Favorites' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {favoriteItems.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-4 max-w-md mx-auto">
            <Heart className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="font-heading text-xl font-bold text-white">No Saved Dishes Yet</h3>
            <p className="text-xs text-slate-400">Explore the a la carte menu and heart dishes to reorder anytime.</p>
            <Link to="/menu" className="inline-block px-6 py-2.5 bg-amber-500 text-black font-bold text-xs rounded-xl">
              Explore Menu
            </Link>
          </div>
        ) : (
          <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteItems.map((product) => (
              <FadeInStaggerItem key={product.id}>
                <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 glass-card-hover flex flex-col h-full group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <button
                      onClick={() => handleRemoveFavorite(product.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-red-500 backdrop-blur-md transition-colors"
                      title="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-heading text-sm font-bold text-white line-clamp-1">{product.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{product.description}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-sm font-bold text-amber-400">
                        {activeRestaurant.currency}{product.discountPrice || product.price}
                      </span>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-gold-glow hover:opacity-90 transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
        )}
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
