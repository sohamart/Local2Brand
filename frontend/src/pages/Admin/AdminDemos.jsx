import React, { useState, useEffect } from 'react';
import {
  Grid,
  Plus,
  Edit2,
  Trash2,
  Upload,
  ExternalLink,
  X,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Save,
  CheckCircle,
  Eye,
  Clock,
  Layers
} from 'lucide-react';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';

export default function AdminDemos() {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDemo, setEditingDemo] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [notification, setNotification] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
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
  });

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const fetchDemos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/demos');
      if (res.success) {
        setDemos(res.demos || []);
        setOrderChanged(false);
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

  // Move template up/down in order
  const moveDemo = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= demos.length) return;

    const updated = [...demos];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    // Update order indexes
    updated.forEach((d, idx) => {
      d.order = idx + 1;
    });

    setDemos(updated);
    setOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      const orderedIds = demos.map((d) => d._id);
      const res = await api.put('/demos/reorder', { orderedIds });
      if (res.success) {
        showNotification('Display order saved successfully! ✅');
        setOrderChanged(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to save order');
    } finally {
      setSavingOrder(false);
    }
  };

  const handleToggleStatus = async (demo) => {
    const newStatus = demo.status === 'published' ? 'coming_soon' : 'published';
    try {
      const res = await api.put(`/demos/${demo._id}`, { status: newStatus });
      if (res.success) {
        setDemos(demos.map((d) => (d._id === demo._id ? { ...d, status: newStatus } : d)));
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
        title: demo.title,
        slug: demo.slug,
        category: demo.category,
        badge: demo.badge || 'PRO READY',
        price: demo.price || '$149',
        priceInr: demo.priceInr || '₹4,999',
        turnaround: demo.turnaround || '2 - 4 Days',
        status: demo.status || 'published',
        liveUrl: demo.liveUrl || '',
        thumbnail: demo.thumbnail || '',
        description: demo.description || '',
        features: Array.isArray(demo.features) ? demo.features.join(', ') : '',
        isFeatured: demo.isFeatured || false,
      });
    } else {
      setEditingDemo(null);
      setFormData({
        title: '',
        slug: '',
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
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveDemo = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        features: formData.features
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean),
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
        setDemos(demos.filter((d) => d._id !== id));
        showNotification('Template deleted.');
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <AshokaChakra size={11} />
            <span>Marketplace Catalog & Hero Showcase</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Website Demo Templates
          </h1>
          <p className="text-xs text-slate-500">
            Set display order, toggle Hero Showcase slides, and customize pricing & live preview URLs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {orderChanged && (
            <button
              onClick={handleSaveOrder}
              disabled={savingOrder}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer shadow-sm animate-pulse"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingOrder ? 'Saving...' : 'Save New Order'}</span>
            </button>
          )}

          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Template</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Demos List & Order Controls */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading template catalog...</div>
        ) : demos.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No demo templates found. Click "Add New Template" above.</div>
        ) : (
          demos.map((demo, idx) => (
            <div
              key={demo._id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs transition-all hover:border-purple-400/50"
            >
              {/* Left: Reorder controls & Index & Thumbnail */}
              <div className="flex items-center gap-3">
                
                {/* Up/Down buttons */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveDemo(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-slate-600 dark:text-slate-400 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDemo(idx, 1)}
                    disabled={idx === demos.length - 1}
                    className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-slate-600 dark:text-slate-400 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-6 text-center font-mono font-black text-xs text-purple-600">
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
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                      {demo.title}
                    </h3>
                    {demo.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {demo.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{demo.category}</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{demo.priceInr || demo.price}</span>
                    <span>•</span>
                    <span>{demo.turnaround || '2 - 4 Days'}</span>
                  </div>
                </div>
              </div>

              {/* Right: Hero Showcase Toggle, Status Toggle & Action buttons */}
              <div className="flex items-center gap-2 sm:self-center self-end">
                {/* 1-Click Show on Hero Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleFeatured(demo)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold transition-all cursor-pointer border flex items-center gap-1.5 ${
                    demo.isFeatured
                      ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60'
                  }`}
                  title="Click to toggle Show on Home Page Hero"
                >
                  <Sparkles className={`w-3 h-3 ${demo.isFeatured ? 'text-purple-600 fill-purple-600' : ''}`} />
                  <span>{demo.isFeatured ? 'Hero Active 🌟' : 'Hero Off'}</span>
                </button>

                {/* Status Switcher */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(demo)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer border ${
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
                  className="p-2 rounded-xl text-slate-600 hover:text-purple-600 bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950 cursor-pointer"
                  title="Edit Template Details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteDemo(demo._id)}
                  className="p-2 rounded-xl text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-950/60 cursor-pointer"
                  title="Delete Template"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* EDIT / CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 shrink-0">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingDemo ? 'Edit Template Details' : 'Add New Demo Template'}
              </h3>
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
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Royal Nawabi Fine Dining"
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
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    {['LMS & Courses', 'Restaurant', 'Cafe', 'Salon', 'Gym', 'Hotel', 'Real Estate', 'Photography', 'Boutique', 'Coaching', 'Dental', 'Jewellery', 'Automotive', 'Custom'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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
                    placeholder="e.g. BEST SELLER"
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
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Thumbnail / Hero Image URL</label>
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
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Features (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Full Video Lecture Player, 1-Click Checkout, WhatsApp Sync"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              {/* Show on Hero Showcase Switch */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-black text-slate-900 dark:text-white block">
                    Showcase on Home Page Hero Slider 🌟
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Display this template in the main interactive 3D hero slider on the home page.
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

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight"
                >
                  Save Template
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
