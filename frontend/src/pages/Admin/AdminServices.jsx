import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';
import api from '../../services/api';
import { SEO } from '../../components/common/CommonUI';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDesc: '',
    startingPrice: '₹9,999',
    features: '',
    isPopular: false,
    order: 1,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services');
      if (res.success) setServices(res.services || []);
    } catch (err) {
      console.warn('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (srv = null) => {
    if (srv) {
      setEditingService(srv);
      setFormData({
        title: srv.title,
        slug: srv.slug,
        shortDesc: srv.shortDesc,
        startingPrice: srv.startingPrice,
        features: Array.isArray(srv.features) ? srv.features.join(', ') : '',
        isPopular: srv.isPopular || false,
        order: srv.order || 1,
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        slug: '',
        shortDesc: '',
        startingPrice: '₹9,999',
        features: '',
        isPopular: false,
        order: services.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      features: formData.features.split(',').map((f) => f.trim()).filter(Boolean),
    };

    try {
      if (editingService) {
        await api.put(`/services/${editingService._id}`, payload);
      } else {
        await api.post('/services', payload);
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      alert('Error saving service: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <>
      <SEO title="Services CMS — Admin" description="Manage offerings, packages, and pricing cards." />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Services CMS ({services.length})</h1>
            <p className="text-xs sm:text-sm text-slate-500">Configure offerings and pricing packages displayed on the website.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s._id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{s.title}</h3>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{s.startingPrice}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleOpenModal(s)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-purple-600 cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500">{s.shortDesc}</p>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block mb-1">Title</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Starting Price</label>
                  <input type="text" required value={formData.startingPrice} onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })} className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Short Description</label>
                  <textarea rows={2} required value={formData.shortDesc} onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })} className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border resize-none" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Features (comma separated)</label>
                  <input type="text" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="48h Delivery, SEO Ready, Mobile Fluid" className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl font-bold text-white l2b-gradient-bg mt-2">Save Service</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
