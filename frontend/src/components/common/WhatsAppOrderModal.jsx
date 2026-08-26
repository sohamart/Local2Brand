import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, Phone, MessageSquare, CheckCircle2, Tag, Check, AlertCircle, Flame } from 'lucide-react';
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

  const [couponInput, setCouponInput] = useState('INDIA2025');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [showAppliedToast, setShowAppliedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        businessName: '',
        whatsapp: '',
        email: '',
        websiteType: modalData.websiteType || 'Starter Website (from ₹9,999)',
        selectedDemo: modalData.selectedDemo || '',
        requirements: modalData.initialRequirements || ''
      });

      // If user clicked an offer specifically (e.g. "Claim 20% OFF"), auto-apply!
      // If user clicked generic "Get Started", do NOT auto-apply (they can click Apply).
      const shouldAutoApply = modalData.autoApplyOffer || 
        modalData.websiteType?.toLowerCase().includes('offer') || 
        modalData.websiteType?.toLowerCase().includes('20%') || 
        modalData.websiteType?.toLowerCase().includes('india2025');

      if (shouldAutoApply) {
        setCouponInput('INDIA2025');
        setIsCouponApplied(true);
        setShowAppliedToast(true);
        setToastMessage('🎉 Launch Offer "INDIA2025" Applied: Flat 20% OFF Activated!');
        const timer = setTimeout(() => setShowAppliedToast(false), 4000);
        return () => clearTimeout(timer);
      } else {
        setCouponInput('INDIA2025');
        setIsCouponApplied(false);
        setShowAppliedToast(false);
      }

      setIsSubmitting(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setShowAppliedToast(false);
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

  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault();
    const cleanCode = (couponInput || '').trim().toUpperCase();

    if (cleanCode === 'INDIA2025' || cleanCode === 'LAUNCH20' || cleanCode === 'FESTIVE20') {
      setCouponInput(cleanCode);
      setIsCouponApplied(true);
      setShowAppliedToast(true);
      setToastMessage(`🎉 Coupon "${cleanCode}" Applied: Flat 20% OFF Activated!`);
      setTimeout(() => setShowAppliedToast(false), 3500);
    } else if (cleanCode === '') {
      setIsCouponApplied(false);
      setShowAppliedToast(true);
      setToastMessage('Please enter a coupon code (e.g. INDIA2025).');
      setTimeout(() => setShowAppliedToast(false), 2500);
    } else {
      setIsCouponApplied(false);
      setShowAppliedToast(true);
      setToastMessage('⚠️ Invalid code. Try using code "INDIA2025".');
      setTimeout(() => setShowAppliedToast(false), 3000);
    }
  };

  const handleQuickApplyIndia2025 = () => {
    setCouponInput('INDIA2025');
    setIsCouponApplied(true);
    setShowAppliedToast(true);
    setToastMessage('🎉 Coupon "INDIA2025" Applied: Flat 20% OFF Activated!');
    setTimeout(() => setShowAppliedToast(false), 3500);
  };

  const handleRemoveCoupon = () => {
    setIsCouponApplied(false);
    setCouponInput('');
    setShowAppliedToast(true);
    setToastMessage('Coupon removed.');
    setTimeout(() => setShowAppliedToast(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      couponCode: isCouponApplied ? (couponInput.trim().toUpperCase() || 'INDIA2025') : '',
      discountText: isCouponApplied ? '20% OFF Launch Special' : '',
      finalPrice: isCouponApplied ? '20% OFF Discount Applied' : 'Standard Pricing'
    };

    const whatsappUrl = generateWhatsAppOrderUrl(payload);
    
    setTimeout(() => {
      openWhatsAppChat(whatsappUrl);
      setIsSubmitting(false);
      closeOrderModal();
    }, 300);
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

      {/* Scrollable Centering Container */}
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

          {/* Animated Offer Applied Popup / Toast Alert */}
          {showAppliedToast && (
            <div className="mb-4 p-3 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between gap-2 shadow-lg animate-in slide-in-from-top-2 duration-200 border border-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
                <span className="font-bold text-slate-100">{toastMessage}</span>
              </div>
              <button 
                onClick={() => setShowAppliedToast(false)}
                className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Modal Header */}
          <div className="mb-4 sm:mb-5 pr-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
              <AshokaChakra size={12} />
              <span>Direct WhatsApp Order Form</span>
            </div>
            <h3 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {modalData.selectedDemo ? `Get "${modalData.selectedDemo}"` : 'Start Your Website'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Your project details and applied discount will open directly on WhatsApp with our founding team.
            </p>
          </div>

          {/* Interactive Coupon Box with Clear Apply & Applied States */}
          <div className={`mb-5 p-3.5 rounded-2xl border transition-all duration-200 ${
            isCouponApplied
              ? 'bg-emerald-50/90 border-emerald-300 shadow-xs'
              : 'bg-amber-50/70 border-amber-200 shadow-xs'
          }`}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                  isCouponApplied ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  <Tag className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 flex-wrap">
                    <span>Coupon: <strong className="font-mono">{couponInput || 'NONE'}</strong></span>
                    {isCouponApplied ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs animate-in zoom-in-95">
                        <Check className="w-3 h-3" />
                        <span>APPLIED (20% OFF)</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleQuickApplyIndia2025}
                        className="px-2 py-0.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Flame className="w-3 h-3 text-amber-700 fill-amber-600" />
                        <span>Click to Apply INDIA2025</span>
                      </button>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {isCouponApplied 
                      ? '🎉 Flat 20% discount + Free 1-Year Custom Domain & SSL activated!' 
                      : 'Apply coupon INDIA2025 to save 20% on your order.'}
                  </div>
                </div>
              </div>

              {/* Input & Apply / Remove Actions */}
              <div className="flex items-center gap-1.5 shrink-0 justify-end">
                {!isCouponApplied ? (
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="INDIA2025"
                      className="w-28 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-mono font-bold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>APPLIED</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] font-semibold text-slate-500 hover:text-red-600 underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
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
                  <option value="Starter Website (from ₹9,999)">Starter Website (from ₹9,999 / $399)</option>
                  <option value="Professional Website (from ₹19,999)">Professional Website (from ₹19,999 / $799)</option>
                  <option value="Landing Page (from ₹5,999)">High-Converting Landing Page</option>
                  <option value="Ready-Made Demo Customization">Ready-Made Demo Customization (48h)</option>
                  <option value="D2C / E-commerce Store">D2C / E-commerce Store</option>
                  <option value="Custom Enterprise Web App">Custom Enterprise Web App</option>
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
                Project Details / Preferred Colors
              </label>
              <textarea
                name="requirements"
                rows="2"
                placeholder="Tell us about your brand, preferred launch date, GST requirements..."
                value={formData.requirements}
                onChange={handleChange}
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-white focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all resize-none"
              ></textarea>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 sm:py-4 px-6 rounded-btn font-bold text-sm sm:text-base text-white l2b-gradient-bg shadow-glass-highlight active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer hover:opacity-95"
              >
                {isSubmitting ? (
                  <span>Opening WhatsApp...</span>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                    <span>
                      {isCouponApplied 
                        ? 'Send Order with 20% OFF to WhatsApp' 
                        : 'Send Order on WhatsApp'}
                    </span>
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-2">
                Opens WhatsApp with your pre-formatted order summary & applied discount for instant kickoff.
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
