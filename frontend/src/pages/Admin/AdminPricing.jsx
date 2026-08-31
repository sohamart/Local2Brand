import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle,
  Sparkles,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  Tag,
  Clock,
  Shield,
  Layers,
  HelpCircle,
  Eye,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { pricingPlans as defaultPricingPlans } from '../../data/pricing';
import AshokaChakra from '../../components/common/AshokaChakra';
import { toast } from 'react-toastify';

export default function AdminPricing() {
  const { settings, fetchSettings } = useSiteSettings();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Form state for editing/adding a pricing plan
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    badge: '',
    popular: false,
    price: '$399',
    priceInr: '₹12,999',
    billingNote: 'One-time investment',
    turnaround: '3 - 7 Days',
    description: '',
    features: [],
    notIncluded: [],
    ctaText: 'Get Started',
    websiteType: 'Starter Website',
    status: 'published',
    order: 1
  });

  useEffect(() => {
    if (settings && Array.isArray(settings.pricingPlans) && settings.pricingPlans.length > 0) {
      setPlans(settings.pricingPlans);
      setLoading(false);
    } else {
      // Fallback to static seed
      const seeded = defaultPricingPlans.map((p, idx) => ({
        ...p,
        status: p.status || 'published',
        order: p.order || idx + 1
      }));
      setPlans(seeded);
      setLoading(false);
    }
  }, [settings]);

  const handleOpenEdit = (plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        id: plan.id || `plan_${Date.now()}`,
        name: plan.name || '',
        badge: plan.badge || '',
        popular: Boolean(plan.popular),
        price: plan.price || '$399',
        priceInr: plan.priceInr || '₹12,999',
        billingNote: plan.billingNote || 'One-time investment',
        turnaround: plan.turnaround || '3 - 7 Days',
        description: plan.description || '',
        features: Array.isArray(plan.features) ? [...plan.features] : [],
        notIncluded: Array.isArray(plan.notIncluded) ? [...plan.notIncluded] : [],
        ctaText: plan.ctaText || 'Get Started',
        websiteType: plan.websiteType || 'Custom Website',
        status: plan.status || 'published',
        order: plan.order || 1
      });
    } else {
      setEditingPlan(null);
      setFormData({
        id: `plan_${Date.now()}`,
        name: '',
        badge: 'NEW PLAN',
        popular: false,
        price: '$499',
        priceInr: '₹14,999',
        billingNote: 'One-time investment',
        turnaround: '3 - 5 Days',
        description: 'Comprehensive business package with custom styling and lead funnel.',
        features: [
          'High-Converting Mobile Responsive Design',
          'WhatsApp Direct Ordering Integration',
          'Fast Cloud Hosting & Free SSL',
          '14 Days Dedicated Post-Launch Support'
        ],
        notIncluded: [],
        ctaText: 'Get Started',
        websiteType: 'Custom Business Website',
        status: 'published',
        order: plans.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleSavePlanToState = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Plan name is required');
      return;
    }

    let updatedPlans;
    if (editingPlan) {
      updatedPlans = plans.map((p) => (p.id === editingPlan.id ? { ...formData } : p));
    } else {
      updatedPlans = [...plans, { ...formData, id: formData.id || `plan_${Date.now()}` }];
    }

    setPlans(updatedPlans);
    setIsModalOpen(false);
    toast.info('Plan updated locally! Click "Save All Changes" to persist.');
  };

  const handleDeletePlan = (planId) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) return;
    const updated = plans.filter((p) => p.id !== planId);
    setPlans(updated);
    toast.info('Plan removed locally. Click "Save All Changes" to persist.');
  };

  const handleToggleStatus = (planId) => {
    const updated = plans.map((p) => {
      if (p.id === planId) {
        const nextStatus = p.status === 'published' ? 'coming_soon' : 'published';
        return { ...p, status: nextStatus };
      }
      return p;
    });
    setPlans(updated);
  };

  const handleMove = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= plans.length) return;

    const list = [...plans];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;

    // re-assign sequential order
    const ordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    setPlans(ordered);
  };

  const handleSaveAllToBackend = async () => {
    setSaving(true);
    try {
      const res = await api.put('/settings', { pricingPlans: plans });
      if (res.success) {
        toast.success('All Pricing Plans saved to Database successfully! 🚀');
        if (fetchSettings) fetchSettings();
      } else {
        throw new Error(res.message || 'Failed to save settings');
      }
    } catch (err) {
      toast.error(err.message || 'Error saving pricing plans');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeatureInput.trim()]
    }));
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (idx) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <AshokaChakra size={11} />
            <span>Pricing Architecture & Monetization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Pricing Plans & Packages Manager
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Configure website packages, toggle <strong>Published Live</strong> vs <strong>Coming Soon</strong>, set INR/USD prices, and customize deliverables.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleOpenEdit(null)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-purple-600" />
            <span>Add New Package</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSaveAllToBackend}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving to Database...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={plan.id || idx}
            className={`rounded-3xl p-6 bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between relative shadow-sm hover:shadow-xl ${
              plan.popular
                ? 'border-purple-500 ring-2 ring-purple-500/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            {/* Top Bar with Order & Status */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-xs text-slate-400">
                    #{idx + 1}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, -1)}
                      className="p-1 rounded-md text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                      title="Move Left / Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === plans.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      className="p-1 rounded-md text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                      title="Move Right / Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(plan.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                    plan.status === 'published'
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                      : 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300'
                  }`}
                  title="Click to toggle Published vs Coming Soon"
                >
                  {plan.status === 'published' ? '● Published Live' : '⏳ Coming Soon'}
                </button>
              </div>

              {/* Badges & Title */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  {plan.badge && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                      {plan.badge}
                    </span>
                  )}
                  {plan.popular && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300">
                      ⭐ Highlighted
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {plan.description}
                </p>
              </div>

              {/* Pricing Box */}
              <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {plan.priceInr || '₹12,999'}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    / {plan.price || '$399'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-500" />
                    <span>{plan.turnaround || '3 - 7 Days'}</span>
                  </span>
                  <span>•</span>
                  <span>{plan.billingNote || 'One-time investment'}</span>
                </div>
              </div>

              {/* Feature List Preview */}
              <div className="space-y-2 mb-6">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Key Deliverables ({plan.features?.length || 0})
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {(plan.features || []).slice(0, 5).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{f}</span>
                    </li>
                  ))}
                  {(plan.features || []).length > 5 && (
                    <li className="text-[11px] text-purple-600 dark:text-purple-400 font-bold pl-5">
                      + {(plan.features || []).length - 5} more deliverables...
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(plan)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-200 hover:text-purple-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Package</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeletePlan(plan.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
                title="Delete Plan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* EDIT / CREATE PRICING PLAN MODAL                                          */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[88vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto min-h-0"
          >
            
            {/* Modal Header (Fixed Top) */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white flex items-center justify-between shrink-0 shadow-sm">
              <div>
                <h3 className="font-black text-base sm:text-lg">
                  {editingPlan ? `Edit Package: ${editingPlan.name}` : 'Add New Pricing Package'}
                </h3>
                <p className="text-xs text-white/80">
                  Configure pricing, turnaround duration, deliverables, and publication status.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Scrollable Area */}
            <form onSubmit={handleSavePlanToState} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4 text-xs scrollbar-thin">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Starter / Growth Flagship"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Badge / Tag
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. FAST LAUNCH / MOST POPULAR"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Price (INR) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.priceInr}
                      onChange={(e) => setFormData({ ...formData, priceInr: e.target.value })}
                      placeholder="e.g. ₹12,999"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Price (USD)
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. $399"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Turnaround Time
                    </label>
                    <input
                      type="text"
                      value={formData.turnaround}
                      onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                      placeholder="e.g. 3 - 7 Days"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Publication Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    >
                      <option value="published">Published Live</option>
                      <option value="coming_soon">⏳ Coming Soon</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Billing Subtext
                    </label>
                    <input
                      type="text"
                      value={formData.billingNote}
                      onChange={(e) => setFormData({ ...formData, billingNote: e.target.value })}
                      placeholder="e.g. One-time investment"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Target audience and value proposition..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>

                {/* Features Builder */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <label className="font-extrabold text-slate-900 dark:text-white block">
                    Package Deliverables & Features ({formData.features.length})
                  </label>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      placeholder="Type a deliverable (e.g. 100% Mobile Responsive Layout)..."
                      className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer shrink-0 hover:bg-purple-500 transition-colors"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="space-y-1.5 mt-2 max-h-48 overflow-y-auto scrollbar-thin">
                    {formData.features.map((feat, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-xs text-slate-800 dark:text-slate-200">{feat}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(i)}
                          className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                          title="Remove feature"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlight / Popular Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                      Mark as "Most Popular / Highlighted Tier" ⭐
                    </span>
                  </label>
                </div>
              </div>

              {/* Fixed Modal Footer */}
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight cursor-pointer hover:opacity-95 transition-all"
                >
                  Apply to List
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
