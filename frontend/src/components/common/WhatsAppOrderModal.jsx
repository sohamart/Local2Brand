import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import { generateWhatsAppOrderUrl, openWhatsAppChat } from '../../utils/whatsapp';
import { siteConfig } from '../../config/siteConfig';
import AshokaChakra from './AshokaChakra';

export default function WhatsAppOrderModal() {
  const { isOpen, modalData, closeOrderModal } = useOrderModal();

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    whatsapp: '',
    email: '',
    websiteType: '',
    selectedDemo: '',
    requirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        businessName: '',
        whatsapp: '',
        email: '',
        websiteType: modalData.websiteType || 'Business Website',
        selectedDemo: modalData.selectedDemo || '',
        requirements: modalData.initialRequirements || ''
      });
      setIsSubmitting(false);
      // Lock background scroll safely
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, modalData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const whatsappUrl = generateWhatsAppOrderUrl(formData);
    
    setTimeout(() => {
      openWhatsAppChat(whatsappUrl);
      setIsSubmitting(false);
      closeOrderModal();
    }, 350);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto modal-touch-scroll"
      data-lenis-prevent="true"
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-md transition-opacity duration-300 z-0"
        onClick={closeOrderModal}
      />

      {/* Scrollable Container */}
      <div 
        className="min-h-full flex items-center justify-center p-3.5 sm:p-6 py-8 sm:py-12 pointer-events-none relative z-10"
        data-lenis-prevent="true"
      >
        <div 
          role="dialog"
          aria-modal="true"
          data-lenis-prevent="true"
          className="relative w-full max-w-2xl bg-white/98 backdrop-blur-2xl border border-white/95 rounded-2xl sm:rounded-modal shadow-glass-lg p-5 xs:p-6 sm:p-8 pointer-events-auto transition-all duration-300 animate-in fade-in zoom-in-95 my-auto overflow-hidden"
        >
          {/* Top Tricolor Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-blue-600 to-emerald-600" />

          {/* Close Button */}
          <button
            onClick={closeOrderModal}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none z-20 cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-5 sm:mb-6 pr-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
              <AshokaChakra size={12} />
              <span>🇮🇳 Fast WhatsApp Direct Order Flow</span>
            </div>
            <h3 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {modalData.selectedDemo ? `Get "${modalData.selectedDemo}"` : 'Start Your Website'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Fill in your project details below to launch our instant WhatsApp consultation with our founders.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Your Full Name <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-white focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all"
                />
              </div>

              {/* Business / Brand Name */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Business / Brand Name <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  required
                  placeholder="e.g. Sharma Jewels / Acme Inc"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-white focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* WhatsApp / Phone */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  WhatsApp / Phone Number <span className="text-pink-600">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-white focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="rahul@business.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-white focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* Website Type */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Website Type
                </label>
                <select
                  name="websiteType"
                  value={formData.websiteType}
                  onChange={handleChange}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-white focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all"
                >
                  <option value="Business Website (from ₹9,999)">Business Website (from ₹9,999 / $399)</option>
                  <option value="Landing Page (from ₹5,999)">High-Converting Landing Page</option>
                  <option value="Portfolio Website">Portfolio / Personal Brand</option>
                  <option value="D2C / E-commerce Store">D2C / E-commerce Store</option>
                  <option value="Ready-Made Demo Customization">Ready-Made Demo Customization (48h)</option>
                  <option value="Custom Web Application">Custom Web Application</option>
                </select>
              </div>

              {/* Selected Demo */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Selected Demo Reference
                </label>
                <input
                  type="text"
                  name="selectedDemo"
                  placeholder="e.g. Gourmet Bistro, Nexus Studio..."
                  value={formData.selectedDemo}
                  onChange={handleChange}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-white focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all"
                />
              </div>
            </div>

            {/* Additional Requirements */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Project Needs & Customization Details
              </label>
              <textarea
                name="requirements"
                rows="3"
                placeholder="Tell us about your brand, preferred sections, target launch date, GST details, or any specific features..."
                value={formData.requirements}
                onChange={handleChange}
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-white focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all resize-none"
              ></textarea>
            </div>

            {/* Trust points */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Direct Founder Access
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                GST Invoice Available
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                100% WhatsApp Confirmation
              </span>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 sm:py-4 px-6 rounded-btn font-bold text-sm sm:text-base text-white l2b-gradient-bg shadow-glass-highlight active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer hover:opacity-95"
              >
                {isSubmitting ? (
                  <span>Launching WhatsApp...</span>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                    <span>Send Order on WhatsApp</span>
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-2">
                Opens WhatsApp with your pre-formatted order summary for instant confirmation with our Indian team.
              </p>
            </div>
          </form>

          {/* Bottom subtle tricolor rim */}
          <div className="absolute bottom-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-amber-500/60 via-blue-500/40 to-emerald-500/60" />
        </div>
      </div>
    </div>
  );
}
