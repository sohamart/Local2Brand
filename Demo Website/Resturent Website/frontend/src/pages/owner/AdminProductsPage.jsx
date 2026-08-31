import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { PRODUCTS, CATEGORIES } from '../../data/mockData';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Plus, Search, Star, Edit, Trash2, CheckCircle2, X, Sparkles, Flame, Clock } from 'lucide-react';

export const AdminProductsPage = () => {
  const { activeRestaurant } = useTenant();
  const [productList, setProductList] = useState(PRODUCTS.filter(p => p.restaurantId === activeRestaurant.id));
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    categoryId: CATEGORIES[0]?.id || '',
    isVeg: false,
    prepTime: '20 min',
    calories: '450',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    isBestseller: true
  });

  const handleCreateDish = (e) => {
    e.preventDefault();
    const created = {
      id: `prod-${Date.now()}`,
      restaurantId: activeRestaurant.id,
      slug: newDish.name.toLowerCase().replace(/\s+/g, '-'),
      name: newDish.name,
      description: newDish.description,
      price: Number(newDish.price),
      discountPrice: newDish.discountPrice ? Number(newDish.discountPrice) : undefined,
      categoryId: newDish.categoryId,
      isVeg: newDish.isVeg,
      isBestseller: newDish.isBestseller,
      prepTime: newDish.prepTime,
      calories: Number(newDish.calories),
      rating: 5.0,
      image: newDish.image
    };

    setProductList([created, ...productList]);
    setIsAddModalOpen(false);
    setNewDish({ name: '', description: '', price: '', discountPrice: '', categoryId: CATEGORIES[0]?.id || '', isVeg: false, prepTime: '20 min', calories: '450', image: '', isBestseller: false });
  };

  const handleDeleteDish = (id) => {
    setProductList(prev => prev.filter(p => p.id !== id));
  };

  const filtered = productList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07080c] flex">
      <AdminSidebar />

      <div className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Menu & Recipe Management
            </h1>
            <p className="text-xs text-slate-400">
              Configure dishes, portion sizes, add-ons, culinary descriptions, and stock statuses.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Dish</span>
          </button>
        </div>

        {/* Search and Table */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dish by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Dishes Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Dish</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Base Price</th>
                  <th className="py-3 px-3">Offer Price</th>
                  <th className="py-3 px-3">Prep Time</th>
                  <th className="py-3 px-3">Rating</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{product.name}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${product.isVeg ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                        {product.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {activeRestaurant.currency}{product.price}
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-400">
                      {product.discountPrice ? `${activeRestaurant.currency}${product.discountPrice}` : '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{product.prepTime}</td>
                    <td className="py-3 px-3 font-bold text-amber-400">★ {product.rating}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteDish(product.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-300 text-slate-400 transition-colors"
                        title="Delete dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Add Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-[#0f111a] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-white text-lg">Create New Culinary Item</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Dish Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmiri Raan Bukhara"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Culinary Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Slow braised lamb shank with saffron..."
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Regular Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={newDish.discountPrice}
                    onChange={(e) => setNewDish({ ...newDish, discountPrice: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Dietary Type</label>
                  <select
                    value={newDish.isVeg ? 'veg' : 'nonveg'}
                    onChange={(e) => setNewDish({ ...newDish, isVeg: e.target.value === 'veg' })}
                    className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="nonveg">🍗 Non-Vegetarian</option>
                    <option value="veg">🌱 Pure Vegetarian</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Prep Duration</label>
                  <input
                    type="text"
                    value={newDish.prepTime}
                    onChange={(e) => setNewDish({ ...newDish, prepTime: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">High-Res Dish Image URL</label>
                <input
                  type="text"
                  value={newDish.image}
                  onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono text-[10px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-95 transition-all"
              >
                Publish Dish to Menu
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
