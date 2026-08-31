import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Save,
  CheckCircle,
  Search,
  Tag,
  FolderPlus,
  Check,
  Layers
} from 'lucide-react';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';

const DEFAULT_CATEGORIES = [
  'LMS & Courses',
  'Restaurant',
  'Cafe',
  'Salon',
  'Gym',
  'Hotel',
  'Real Estate',
  'Photography',
  'Boutique',
  'Coaching',
  'Dental',
  'Jewellery',
  'Automotive',
  'Healthcare',
  'Custom'
];

const ICONS = [
  { label: 'Graduation Cap (LMS/Edu)', value: 'GraduationCap' },
  { label: 'Utensils (Restaurant/Food)', value: 'Utensils' },
  { label: 'Gem (Jewellery/Luxe)', value: 'Gem' },
  { label: 'Building (Real Estate/Hotel)', value: 'Building2' },
  { label: 'Shopping Bag (E-Com/Boutique)', value: 'ShoppingBag' },
  { label: 'Sparkles (Salon/Creative)', value: 'Sparkles' },
  { label: 'Zap (Gym/Speed/Fitness)', value: 'Zap' },
  { label: 'Star (General)', value: 'Star' }
];

export default function AdminDemos() {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDemo, setEditingDemo] = useState(null);
  const [savingHeroOrder, setSavingHeroOrder] = useState(false);
  const [savingCatalogOrder, setSavingCatalogOrder] = useState(false);
  const [heroOrderChanged, setHeroOrderChanged] = useState(false);
  const [catalogOrderChanged, setCatalogOrderChanged] = useState(false);
  const [notification, setNotification] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Category Manager State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [editingCatOldName, setEditingCatOldName] = useState('');
  const [editingCatNewName, setEditingCatNewName] = useState('');
  const [showInlineNewCat, setShowInlineNewCat] = useState(false);
  const [inlineNewCatValue, setInlineNewCatValue] = useState('');

  const [categoriesList, setCategoriesList] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('l2b_admin_demo_categories');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return DEFAULT_CATEGORIES;
  });

  const saveCategories = (cats) => {
    setCategoriesList(cats);
    localStorage.setItem('l2b_admin_demo_categories', JSON.stringify(cats));
  };

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortName: '',
    category: 'Restaurant',
    badge: 'PRO READY',
    price: '$149',
    priceInr: '₹4,999',
    turnaround: '2 - 4 Days',
    status: 'published',
    liveUrl: '',
    thumbnail: '',
    description: '',
    features: '',
    isFeatured: true,
    heroTag: '',
    heroStat: '',
    rating: '5.0 ★ (50+ Reviews)',
    iconName: 'Sparkles'
  });

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchDemos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/demos');
      if (res.success) {
        setDemos(res.demos || []);
        setHeroOrderChanged(false);
        setCatalogOrderChanged(false);

        // Merge any new categories found in database
        const dbCats = new Set(categoriesList);
        (res.demos || []).forEach((d) => {
          if (d.category) dbCats.add(d.category);
        });
        saveCategories(Array.from(dbCats));
      }
    } catch (err) {
      console.warn('Error fetching demos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  // Filtered Demos for the Hero Slider (featured demos sorted by heroOrder or order)
  const heroDemos = useMemo(() => {
    return demos
      .filter((d) => Boolean(d.isFeatured))
      .sort((a, b) => (a.heroOrder || a.order || 0) - (b.heroOrder || b.order || 0));
  }, [demos]);

  // Catalog filtered by search & category
  const filteredCatalog = useMemo(() => {
    return demos.filter((d) => {
      const matchCat = activeCategory === 'All' || d.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [demos, activeCategory, searchQuery]);

  // Move a demo UP or DOWN in the Hero Showcase Sequence
  const moveHeroDemo = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= heroDemos.length) return;

    const updatedHeroList = [...heroDemos];
    const temp = updatedHeroList[index];
    updatedHeroList[index] = updatedHeroList[newIndex];
    updatedHeroList[newIndex] = temp;

    // Assign new sequential heroOrder
    const updatedIds = updatedHeroList.map((d) => d._id?.toString());
    const newAllDemos = demos.map((d) => {
      const hIdx = updatedIds.indexOf(d._id?.toString());
      if (hIdx !== -1) {
        return { ...d, heroOrder: hIdx + 1, isFeatured: true };
      }
      return d;
    });

    setDemos(newAllDemos);
    setHeroOrderChanged(true);
  };

  // Save the new Hero Slider Order to API
  const handleSaveHeroOrder = async () => {
    setSavingHeroOrder(true);
    try {
      const heroOrderedIds = heroDemos.map((d) => d._id);
      const res = await api.put('/demos/reorder', { heroOrderedIds });
      if (res.success) {
        showNotification('🎉 Hero slider showcase sequence saved successfully! Home page updated.');
        setHeroOrderChanged(false);
        // Refresh local cache
        localStorage.removeItem('l2b_cached_hero_demos');
      }
    } catch (err) {
      alert(err.message || 'Failed to save Hero order');
    } finally {
      setSavingHeroOrder(false);
    }
  };

  // Move a demo UP or DOWN in the general catalog
  const moveCatalogDemo = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= demos.length) return;

    const updated = [...demos];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    updated.forEach((d, idx) => {
      d.order = idx + 1;
    });

    setDemos(updated);
    setCatalogOrderChanged(true);
  };

  // Save general catalog order
  const handleSaveCatalogOrder = async () => {
    setSavingCatalogOrder(true);
    try {
      const orderedIds = demos.map((d) => d._id);
      const res = await api.put('/demos/reorder', { orderedIds });
      if (res.success) {
        showNotification('✅ Marketplace catalog display order saved!');
        setCatalogOrderChanged(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to save catalog order');
    } finally {
      setSavingCatalogOrder(false);
    }
  };

  // 1-Click Toggle for Show on Hero
  const handleToggleFeatured = async (demo) => {
    const newFeaturedState = !demo.isFeatured;
    try {
      const res = await api.put(`/demos/${demo._id}`, {
        isFeatured: newFeaturedState,
        heroOrder: newFeaturedState ? heroDemos.length + 1 : 999
      });
      if (res.success) {
        setDemos((prev) =>
          prev.map((d) =>
            d._id === demo._id
              ? { ...d, isFeatured: newFeaturedState, heroOrder: newFeaturedState ? heroDemos.length + 1 : 999 }
              : d
          )
        );
        showNotification(
          newFeaturedState
            ? `🌟 "${demo.title}" added to Home Hero Slider!`
            : `Removed "${demo.title}" from Home Hero Slider.`
        );
        localStorage.removeItem('l2b_cached_hero_demos');
      }
    } catch (err) {
      alert('Failed to update Hero featured status: ' + err.message);
    }
  };

  // 1-Click Toggle Status (published vs coming_soon)
  const handleToggleStatus = async (demo) => {
    const newStatus = demo.status === 'published' ? 'coming_soon' : 'published';
    try {
      const res = await api.put(`/demos/${demo._id}`, { status: newStatus });
      if (res.success) {
        setDemos((prev) => prev.map((d) => (d._id === demo._id ? { ...d, status: newStatus } : d)));
        showNotification(`Status updated to "${newStatus.replace('_', ' ').toUpperCase()}"!`);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleOpenModal = (demo = null) => {
    if (demo) {
      setEditingDemo(demo);
      setFormData({
        title: demo.title || '',
        slug: demo.slug || '',
        shortName: demo.shortName || demo.title?.split(' ')[0] || '',
        category: demo.category || 'Restaurant',
        badge: demo.badge || 'PRO READY',
        price: demo.price || '$149',
        priceInr: demo.priceInr || '₹4,999',
        turnaround: demo.turnaround || '2 - 4 Days',
        status: demo.status || 'published',
        liveUrl: demo.liveUrl || '',
        thumbnail: demo.thumbnail || '',
        description: demo.description || '',
        features: Array.isArray(demo.features) ? demo.features.join(', ') : demo.features || '',
        isFeatured: Boolean(demo.isFeatured),
        heroTag: demo.heroTag || '',
        heroStat: demo.heroStat || demo.badge || '',
        rating: demo.rating || '5.0 ★ (50+ Reviews)',
        iconName: demo.iconName || 'Sparkles'
      });
    } else {
      setEditingDemo(null);
      setFormData({
        title: '',
        slug: '',
        shortName: '',
        category: 'Restaurant',
        badge: 'NEW',
        price: '$149',
        priceInr: '₹4,999',
        turnaround: '2 - 3 Days',
        status: 'published',
        liveUrl: '',
        thumbnail: '',
        description: '',
        features: '',
        isFeatured: true,
        heroTag: '',
        heroStat: '',
        rating: '5.0 ★ (50+ Reviews)',
        iconName: 'Sparkles'
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveDemo = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        features: typeof formData.features === 'string'
          ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
          : formData.features
      };

      if (editingDemo) {
        const res = await api.put(`/demos/${editingDemo._id}`, payload);
        if (res.success) {
          showNotification('Template details updated successfully! ✅');
          fetchDemos();
        }
      } else {
        const res = await api.post('/demos', payload);
        if (res.success) {
          showNotification('New template created successfully! ✅');
          fetchDemos();
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Error saving demo');
    }
  };

  const handleDeleteDemo = async (id) => {
    if (!confirm('Are you sure you want to delete this demo template?')) return;
    try {
      const res = await api.delete(`/demos/${id}`);
      if (res.success) {
        setDemos((prev) => prev.filter((d) => d._id !== id));
        showNotification('Template deleted.');
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  // Add new category
  const handleAddCategory = (name) => {
    const trimmed = name?.trim();
    if (!trimmed) return;
    if (categoriesList.includes(trimmed)) {
      showNotification('Category already exists!');
      return;
    }
    const updated = [...categoriesList, trimmed];
    saveCategories(updated);
    showNotification(`Category "${trimmed}" added! ✅`);
    setNewCategoryInput('');
  };

  // Rename an existing category and batch-update all matching demos in DB
  const handleRenameCategory = async (oldName, newName) => {
    const trimmedNew = newName?.trim();
    if (!trimmedNew || trimmedNew === oldName) {
      setEditingCatOldName('');
      return;
    }

    try {
      // 1. Update categories list
      const updatedCats = categoriesList.map((c) => (c === oldName ? trimmedNew : c));
      saveCategories(updatedCats);

      // 2. Batch update any demo in MongoDB that had oldName
      const matchingDemos = demos.filter((d) => d.category === oldName);
      for (const demo of matchingDemos) {
        await api.put(`/demos/${demo._id}`, { ...demo, category: trimmedNew });
      }

      showNotification(`Category renamed to "${trimmedNew}" & ${matchingDemos.length} demo(s) updated! ✅`);
      setEditingCatOldName('');
      fetchDemos();
    } catch (err) {
      alert('Error updating category: ' + err.message);
    }
  };

  // Delete category
  const handleDeleteCategory = (catName) => {
    const demosUsingCat = demos.filter((d) => d.category === catName).length;
    if (demosUsingCat > 0) {
      if (!confirm(`Warning: ${demosUsingCat} demo(s) currently use "${catName}". Deleting this category will remove it from the filter list. Proceed?`)) {
        return;
      }
    }
    const updated = categoriesList.filter((c) => c !== catName);
    saveCategories(updated);
    showNotification(`Category "${catName}" removed.`);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <AshokaChakra size={11} />
            <span>Interactive Hero Slider & Marketplace CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Hero Slider & Demo Websites Manager
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Control categories, demo showcases, and exact display orders (1st, 2nd, 3rd) on the Homepage and Demos Catalog.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Tag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Manage Categories ({categoriesList.length})</span>
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Template</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: HERO SLIDER SHOWCASE MANAGER (THE CORE USER REQUIREMENT)        */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-500/10 via-white to-white dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 border-2 border-purple-500/40 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-200/60 dark:border-purple-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Home Hero Slider Showcase Order
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border border-purple-300">
                  {heroDemos.length} Slides Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                These demo templates will appear in the 3D showcase slider on the Homepage. Use ⬆️ / ⬇️ arrows to reorder which demo plays first.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {heroOrderChanged && (
              <button
                onClick={handleSaveHeroOrder}
                disabled={savingHeroOrder}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer shadow-lg animate-pulse"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingHeroOrder ? 'Saving Sequence...' : 'Save Slider Order'}</span>
              </button>
            )}
          </div>
        </div>

        {heroDemos.length === 0 ? (
          <div className="p-8 text-center bg-white/70 dark:bg-slate-800/40 rounded-2xl border border-dashed border-purple-300 dark:border-purple-800">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No demos are currently selected for the Hero Slider.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Click the "🌟 Hero Active" toggle on any demo in the catalog below to add it to the slider!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {heroDemos.map((demo, idx) => (
              <div
                key={demo._id || demo.slug}
                className="relative rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-purple-300 dark:border-purple-700/60 p-3.5 shadow-md flex flex-col justify-between group hover:border-purple-500 transition-all"
              >
                {/* Hero Position Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-mono font-black text-[10px] shadow-xs">
                    Slide #{idx + 1} {idx === 0 ? '(1st on Homepage)' : ''}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveHeroDemo(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-200 disabled:opacity-20 cursor-pointer transition-colors"
                      title="Move slide earlier in sequence"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveHeroDemo(idx, 1)}
                      disabled={idx === heroDemos.length - 1}
                      className="p-1 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-200 disabled:opacity-20 cursor-pointer transition-colors"
                      title="Move slide later in sequence"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail Preview */}
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-700 relative mb-3">
                  <img
                    src={demo.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600'}
                    alt={demo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[9px] font-bold text-white border border-white/20">
                    {demo.category}
                  </div>
                  {demo.badge && (
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-extrabold">
                      {demo.badge}
                    </div>
                  )}
                </div>

                {/* Demo Details */}
                <div className="space-y-1 flex-1">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white leading-tight line-clamp-1">
                    {demo.title}
                  </h3>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Tab Label: <strong>{demo.shortName || demo.title?.split(' ')[0]}</strong></span>
                    <span className="text-emerald-600 font-bold">{demo.priceInr || demo.price}</span>
                  </div>
                  {demo.heroTag && (
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold truncate">
                      🏷️ {demo.heroTag}
                    </p>
                  )}
                </div>

                {/* Bottom Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 mt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <button
                    onClick={() => handleOpenModal(demo)}
                    className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Showcase</span>
                  </button>

                  <button
                    onClick={() => handleToggleFeatured(demo)}
                    className="px-2 py-1 rounded-lg text-[9px] font-bold bg-red-50 dark:bg-red-950/60 text-red-600 hover:bg-red-100 cursor-pointer"
                    title="Remove from Hero Slider"
                  >
                    Remove Slide ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: FULL TEMPLATE CATALOG CMS                                      */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              All Template Catalog ({demos.length})
            </h2>
            <p className="text-xs text-slate-500">
              Manage complete website listings, pricing, live demo URLs, and toggle Hero visibility.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {catalogOrderChanged && (
              <button
                onClick={handleSaveCatalogOrder}
                disabled={savingCatalogOrder}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer shadow-sm animate-pulse"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingCatalogOrder ? 'Saving...' : 'Save Catalog Order'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search template by title, category, or slug..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            {['All', ...(categoriesList || DEFAULT_CATEGORIES).slice(0, 8)].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog List Items */}
        <div className="space-y-2.5">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading template catalog...</div>
          ) : filteredCatalog.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No matching demo templates found.</div>
          ) : (
            filteredCatalog.map((demo, idx) => (
              <div
                key={demo._id || demo.slug}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                  demo.isFeatured
                    ? 'border-purple-300 dark:border-purple-800/80 bg-purple-50/20 dark:bg-purple-950/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Left Section: Reorder, Thumbnail & Info */}
                <div className="flex items-center gap-3">
                  {/* Up/Down buttons for general catalog */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => moveCatalogDemo(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-slate-600 dark:text-slate-400 disabled:opacity-20 cursor-pointer"
                      title="Move Up in Catalog"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveCatalogDemo(idx, 1)}
                      disabled={idx === demos.length - 1}
                      className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-slate-600 dark:text-slate-400 disabled:opacity-20 cursor-pointer"
                      title="Move Down in Catalog"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="w-6 text-center font-mono font-black text-xs text-slate-400">
                    #{idx + 1}
                  </div>

                  <div className="w-14 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    <img
                      src={demo.thumbnail || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=300'}
                      alt={demo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                        {demo.title}
                      </h3>
                      {demo.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {demo.badge}
                        </span>
                      )}
                      {demo.isFeatured && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border border-purple-300 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 fill-purple-600" />
                          <span>Hero Slide #{demo.heroOrder || 1}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{demo.category}</span>
                      <span>•</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {demo.priceInr || demo.price}
                      </span>
                      <span>•</span>
                      <span>{demo.turnaround || '2 - 4 Days'}</span>
                      {demo.liveUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={demo.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1"
                          >
                            <span>Live</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section: Action Controls */}
                <div className="flex items-center gap-2 sm:self-center self-end shrink-0">
                  {/* Hero Showcase Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(demo)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer border flex items-center gap-1.5 ${
                      demo.isFeatured
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-600'
                    }`}
                    title="Click to toggle Show on Home Page Hero Slider"
                  >
                    <Sparkles className={`w-3 h-3 ${demo.isFeatured ? 'fill-white' : ''}`} />
                    <span>{demo.isFeatured ? 'Hero Active 🌟' : 'Add to Hero'}</span>
                  </button>

                  {/* Status Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(demo)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer border ${
                      demo.status === 'published'
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                        : 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300'
                    }`}
                    title="Click to toggle Published vs Coming Soon"
                  >
                    {demo.status === 'published' ? '● Published' : '⏳ Coming Soon'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenModal(demo)}
                    className="p-2 rounded-xl text-slate-600 hover:text-purple-600 bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950 cursor-pointer transition-colors"
                    title="Edit Template Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteDemo(demo._id)}
                    className="p-2 rounded-xl text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-950/60 cursor-pointer transition-colors"
                    title="Delete Template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EDIT / CREATE TEMPLATE MODAL WITH HERO SPECIFIC FIELDS                    */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 shrink-0">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {editingDemo ? 'Edit Template Details' : 'Add New Demo Template'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Configure catalog details, pricing, and Home Page Hero showcase appearance.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDemo} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Royal Nawabi Fine Dining Hub"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Slug / ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. restaurant"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">Category *</label>
                    <button
                      type="button"
                      onClick={() => setShowInlineNewCat(!showInlineNewCat)}
                      className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>{showInlineNewCat ? 'Choose Existing' : '+ New Category'}</span>
                    </button>
                  </div>

                  {showInlineNewCat ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        autoFocus
                        value={inlineNewCatValue}
                        onChange={(e) => setInlineNewCatValue(e.target.value)}
                        placeholder="e.g. Healthcare, Fashion..."
                        className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700 text-xs font-bold text-purple-900 dark:text-purple-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (inlineNewCatValue.trim()) {
                            handleAddCategory(inlineNewCatValue.trim());
                            setFormData({ ...formData, category: inlineNewCatValue.trim() });
                            setShowInlineNewCat(false);
                            setInlineNewCatValue('');
                          }
                        }}
                        className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shrink-0"
                        title="Add and Select"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === '__add_new__') {
                          setShowInlineNewCat(true);
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__add_new__">+ Add New Category...</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    <option value="published">Published Live</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. BEST SELLER / PRO READY"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Price (INR)</label>
                  <input
                    type="text"
                    value={formData.priceInr}
                    onChange={(e) => setFormData({ ...formData, priceInr: e.target.value })}
                    placeholder="e.g. ₹5,999"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Turnaround</label>
                  <input
                    type="text"
                    value={formData.turnaround}
                    onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                    placeholder="e.g. 2 - 4 Days"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Live URL</label>
                  <input
                    type="text"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="e.g. https://demo.vercel.app"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Thumbnail / Hero Showcase Image URL
                </label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of deliverables and features..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Features (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Full Video Lecture Player, 1-Click Checkout, WhatsApp Sync"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              {/* HOME HERO SLIDER SETTINGS CARD */}
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border-2 border-purple-300 dark:border-purple-800 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      🌟 Home Page Hero Slider Visibility
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Include this template in the main interactive 3D hero slider on the home page.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {formData.isFeatured && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-purple-200/70 dark:border-purple-900/60 animate-in fade-in">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Hero Tab Short Name (Pill Label)
                      </label>
                      <input
                        type="text"
                        value={formData.shortName}
                        onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                        placeholder="e.g. LMS Platform / Fine Dining"
                        className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Hero Tag / Headline Feature
                      </label>
                      <input
                        type="text"
                        value={formData.heroTag}
                        onChange={(e) => setFormData({ ...formData, heroTag: e.target.value })}
                        placeholder="e.g. Video Curriculum & Instant Checkout"
                        className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Hero Stat Badge
                      </label>
                      <input
                        type="text"
                        value={formData.heroStat}
                        onChange={(e) => setFormData({ ...formData, heroStat: e.target.value })}
                        placeholder="e.g. Full-Stack EdTech / High Ticket"
                        className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Showcase Icon
                      </label>
                      <select
                        value={formData.iconName}
                        onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                        className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-xs font-bold"
                      >
                        {ICONS.map((ico) => (
                          <option key={ico.value} value={ico.value}>{ico.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight cursor-pointer hover:opacity-95"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY MANAGER MODAL                                                    */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                <h3 className="font-black text-base sm:text-lg">
                  Manage Demo Categories & Search Labels
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Add New Category Form */}
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 space-y-2">
                <label className="font-extrabold text-purple-950 dark:text-purple-200 block">
                  Add Brand New Category
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory(newCategoryInput);
                      }
                    }}
                    placeholder="e.g. Healthcare, Fashion, Law Firm, Event..."
                    className="flex-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCategory(newCategoryInput)}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 font-extrabold uppercase tracking-wider text-[10px] px-1">
                  <span>Category Name ({categoriesList.length})</span>
                  <span>Active Demos / Actions</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
                  {categoriesList.map((cat, idx) => {
                    const demoCount = demos.filter((d) => d.category === cat).length;
                    const isEditing = editingCatOldName === cat;

                    return (
                      <div
                        key={cat}
                        className="p-3 flex items-center justify-between gap-2 hover:bg-white dark:hover:bg-slate-900 transition-colors"
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              type="text"
                              autoFocus
                              value={editingCatNewName}
                              onChange={(e) => setEditingCatNewName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleRenameCategory(cat, editingCatNewName);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-purple-400 text-xs font-bold flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => handleRenameCategory(cat, editingCatNewName)}
                              className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                              title="Save Changes"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCatOldName('')}
                              className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-400 text-[10px]">#{idx + 1}</span>
                            <span className="font-bold text-slate-900 dark:text-white text-xs">{cat}</span>
                          </div>
                        )}

                        {!isEditing && (
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              demoCount > 0
                                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                            }`}>
                              {demoCount} demo{demoCount === 1 ? '' : 's'}
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingCatOldName(cat);
                                setEditingCatNewName(cat);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 cursor-pointer transition-colors"
                              title="Edit / Rename Category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Categories are synced with public demo filters automatically.
              </span>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
