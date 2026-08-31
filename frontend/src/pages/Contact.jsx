import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Building
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { SEO } from '../components/common/CommonUI';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useOrderModal } from '../context/OrderModalContext';
import api from '../services/api';
import AshokaChakra from '../components/common/AshokaChakra';

export default function Contact() {
  const { settings } = useSiteSettings();
  const { openCallbackModal } = useOrderModal();

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    websiteType: 'Custom Business Website (from ₹9,999)',
    requirements: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setError('Please provide your name, phone, and email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/queries', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName,
        websiteType: formData.websiteType,
        requirements: formData.requirements,
        industry: 'Direct Contact Form',
        budget: 'Custom Quotation',
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us — Direct Project Inquiry & Consultation"
        description="Get in touch with LOCAL2BRAND. Submit your project requirements or request an instant callback from our founders."
      />

      <div className="pt-36 sm:pt-44 lg:pt-48 pb-20">
        
        {/* Page Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <AshokaChakra size={13} />
            <span>🇮🇳 Direct Indian Founders Line • 24/7 IST Support</span>
          </div>
          <SectionHeading
            badge="Direct Communication"
            title="Let's Build Something Great."
            subtitle="Ready to transform your digital presence? Send us your project details or schedule a direct consultation call."
          />
        </div>

        {/* Contact Layout Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Direct Info & Callback Box */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Callback Box */}
              <div className="glass-panel p-6 sm:p-8 rounded-card border-2 border-purple-500/40 shadow-glass-lg relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-white to-white dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100/80 dark:bg-purple-950/80 px-2.5 py-0.5 rounded-full">
                      Fastest Response
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      Request a Phone Call
                    </h3>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
                  Discuss requirements, pricing estimates, and design specs directly with our founding team.
                </p>

                <button
                  onClick={() => openCallbackModal()}
                  className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Schedule Consultation Call</span>
                </button>
              </div>

              {/* Email Support Card */}
              <div className="glass-panel p-6 rounded-card border border-white dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-purple-600 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block">Support Email</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">{settings.supportEmail}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-amber-600 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block">Working Hours</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">Monday – Saturday: 9 AM to 9 PM IST</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Direct Proposal Form */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-6 sm:p-10 rounded-card border border-white dark:border-slate-800 shadow-glass-lg relative bg-white/80 dark:bg-slate-900/80">
                
                {submitted ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Inquiry Received! 🎉</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                      Thank you <strong>{formData.name}</strong>. Your project inquiry has been saved directly to our system. We will contact you at <strong>{formData.phone}</strong>.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          businessName: '',
                          phone: '',
                          email: '',
                          websiteType: 'Custom Business Website (from ₹9,999)',
                          requirements: '',
                        });
                      }}
                      className="px-6 py-2.5 rounded-full text-xs font-bold text-white l2b-gradient-bg shadow-sm"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">
                        Fast-Track Web Inquiry
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Tell Us About Your Project
                      </h3>
                    </div>

                    {error && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Ananya Sen"
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Business Name</label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          placeholder="e.g. Royal Bengal Sweets"
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="9876543210"
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ananya@brand.com"
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Website Type / Package</label>
                      <select
                        name="websiteType"
                        value={formData.websiteType}
                        onChange={handleChange}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white"
                      >
                        <option value="Showcase Demo Customization (from ₹9,999)">Showcase Demo Customization (from ₹9,999 / $399)</option>
                        <option value="Custom Business Website (from ₹19,999)">Custom Business Website (from ₹19,999)</option>
                        <option value="E-Commerce Store with Gateway (from ₹34,999)">E-Commerce Store with Gateway (from ₹34,999)</option>
                        <option value="Enterprise Web App / Custom Software">Enterprise Web App / Custom Software</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Project Requirements / Ideas</label>
                      <textarea
                        rows={3}
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        placeholder="Tell us about the pages you need, reference websites, or special features..."
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? 'Submitting...' : 'Submit Project Inquiry'}</span>
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
