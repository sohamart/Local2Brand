import React, { useState, useEffect } from 'react';
import { Database, PlusCircle, Check, Trash2, Globe } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDemos = () => {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Business',
    description: '',
    previewImage: '',
    liveUrl: '',
    startingPrice: 12000,
    technologies: '',
    features: '',
  });

  const fetchDemos = async () => {
    try {
      const res = await API.get('/demos');
      if (res.data?.demos) {
        setDemos(res.data.demos);
      }
    } catch (err) {
      console.error('Error loading demos list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()),
      features: formData.features.split(',').map(f => f.trim()),
    };

    try {
      const res = await API.post('/admin/demos', payload);
      if (res.data?.success) {
        setDemos(prev => [...prev, res.data.demo]);
        setShowAddForm(false);
        setFormData({ name: '', category: 'Business', description: '', previewImage: '', liveUrl: '', startingPrice: 12000, technologies: '', features: '' });
      }
    } catch (err) {
      console.error('Error adding template', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Marketplace Catalog</h1>
          <p className="text-xs text-slate-500">Publish, modify, and archive ready-made website templates.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10"
        >
          <PlusCircle size={14} />
          Add Template Demo
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demos grid */}
          <div className="lg:col-span-2 bg-[#090d1a] border border-white/5 p-5 rounded-2xl h-fit">
            <h3 className="font-bold text-sm text-slate-200 border-b border-white/5 pb-3">Available Templates</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-white/5 text-slate-400 select-none">
                    <th className="p-4 font-bold uppercase tracking-wider">Template Name</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Sector</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {demos.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-slate-200">{d.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-400">
                          {d.category}
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-indigo-400">₹{d.startingPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Demo Form Panel */}
          {showAddForm && (
            <div className="lg:col-span-1 bg-[#090d1a] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl h-fit">
              <h3 className="font-bold text-sm text-white">Create Template</h3>
              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Template Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                    placeholder="e.g. Barber Pro"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none cursor-pointer"
                  >
                    {['Business', 'Restaurant', 'Portfolio', 'E-commerce', 'Education', 'Healthcare', 'Real Estate', 'Agency', 'Personal Brand'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Starting Price *</label>
                  <input
                    type="number"
                    required
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Preview Image URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.previewImage}
                    onChange={(e) => setFormData({ ...formData, previewImage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Live Preview URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                    placeholder="https://demo.local2brand.com/..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Technologies (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                    placeholder="React, Tailwind, Calendly"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Features (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                    placeholder="Online Booking, Interactive Menu"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  <Check size={13} />
                  Save Template
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDemos;
