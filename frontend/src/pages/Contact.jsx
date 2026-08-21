import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import API from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/contact', formData);
      if (res.data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', businessName: '', message: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting message. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-left space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Let's Discuss Your Project</h1>
        <p className="text-slate-650 dark:text-slate-400 max-w-xl text-sm leading-relaxed">
          Have an idea or looking for custom platform consultations? Drop us a message. Our sales team responds within 12 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Contact info list */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Contact Details</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-center text-xs text-slate-600 dark:text-slate-400">
                <Mail size={16} className="text-yellow-500 dark:text-yellow-455 shrink-0" />
                <span>hello@local2brand.com</span>
              </div>
              <div className="flex gap-3 items-center text-xs text-slate-600 dark:text-slate-400">
                <Phone size={16} className="text-yellow-500 dark:text-yellow-455 shrink-0" />
                <span>+880 1700-000000</span>
              </div>
              <div className="flex gap-3 items-center text-xs text-slate-600 dark:text-slate-400">
                <MapPin size={16} className="text-yellow-500 dark:text-yellow-455 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-6 md:p-8 shadow-md">
          {success ? (
            <div className="text-center py-10 space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Message Dispatched</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Thank you! Your details have been uploaded to our leads catalog. We will contact you soon via email or phone.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-xs text-yellow-500 font-semibold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                    placeholder="e.g. john@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                    placeholder="e.g. +8801700000000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Business Name (Optional)</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                    placeholder="e.g. Luigi Bistro"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Detailed Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 resize-none"
                  placeholder="Outline your target goals..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-600 text-xs font-bold text-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-yellow-500/10 transition-colors"
              >
                {loading ? 'Submitting...' : 'Send Message'}
                <Send size={13} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
