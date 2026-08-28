import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Phone,
  MessageSquare,
  CheckCircle2,
  Tag,
  Check,
  AlertCircle,
  Flame,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Layers,
  Palette,
  Clock,
  DollarSign,
  User,
  Copy,
  Sliders,
  CheckSquare,
  Square,
  Globe,
  Server,
  ShieldCheck
} from 'lucide-react';
import { useOrderModal } from '../../context/OrderModalContext';
import { generateWhatsAppOrderUrl, openWhatsAppChat } from '../../utils/whatsapp';
import { siteConfig } from '../../config/siteConfig';
import ThemeToggle from './ThemeToggle';

// Step 1: Industries & Niches
const INDUSTRIES = [
  { id: 'Restaurant / Cafe', label: '🍽️ Restaurant / Cafe / Bakery', icon: '🍽️' },
  { id: 'E-Commerce / Retail', label: '🛍️ E-Commerce / Online Store', icon: '🛍️' },
  { id: 'Corporate / Agency', label: '🏢 Corporate / Agency / Brand', icon: '🏢' },
  { id: 'Real Estate / Property', label: '🏡 Real Estate / Properties', icon: '🏡' },
  { id: 'Salon / Spa / Beauty', label: '💇 Salon / Spa / Beauty Studio', icon: '💇' },
  { id: 'Gym / Fitness Hub', label: '🏋️ Gym / Crossfit / Fitness Hub', icon: '🏋️' },
  { id: 'Hotel / Resort', label: '🏨 Hotel / Resort / Homestay', icon: '🏨' },
  { id: 'Coaching / Academy', label: '🎓 Coaching / EdTech / Training', icon: '🎓' },
  { id: 'Clinic / Dental', label: '🦷 Clinic / Doctor / Healthcare', icon: '🦷' },
  { id: 'Photography Studio', label: '📸 Photography / Wedding Studio', icon: '📸' },
  { id: 'Jewellery Atelier', label: '💍 Jewellery / Luxury Retail', icon: '💍' },
  { id: 'Automotive / Supercars', label: '🚗 Automotive / Car Showroom', icon: '🚗' },
  { id: 'Custom Web App / SaaS', label: '⚡ Custom Web App / Software', icon: '⚡' },
  { id: 'Other Custom Business', label: '✍️ Other / Custom Business', icon: '✍️' }
];

// Step 1: Goals
const GOALS = [
  'Direct WhatsApp Orders & Invoices',
  'Lead Generation & High-Ticket Inquiries',
  'Brand Authority & Client Trust',
  'Online Bookings & Reservations',
  'Product Sales & Catalog Showcase'
];

// Step 3: Features
const FEATURE_OPTIONS = [
  { id: 'WhatsApp Pipeline', label: '💬 WhatsApp Direct Checkout / Order Pipeline' },
  { id: 'Payment Gateway', label: '💳 Online Payment Gateway (UPI / Razorpay / Stripe)' },
  { id: 'Booking Engine', label: '📅 Interactive Booking & Appointment System' },
  { id: 'Product Catalog', label: '🛒 Multi-Item Product Catalog with Filters' },
  { id: 'Google SEO & Speed', label: '🔍 99+ Speed Score & Local SEO Optimization' },
  { id: 'Admin CMS', label: '🔐 Simple Admin Dashboard to Edit Text & Images' },
  { id: 'PWA Mobile App', label: '📱 PWA (Installable Mobile App Experience)' },
  { id: 'Multi-Language', label: '🌐 Multi-Language Support (EN / Hindi / Bengali)' },
  { id: 'AI Chatbot', label: '🤖 AI Live Chatbot for Automatic Lead Capture' },
  { id: '3D & Motion', label: '✨ 3D Interactive Liquid Effects & Micro-Animations' }
];

// Step 4: Themes
const THEMES = [
  { id: 'Clean Minimalist', name: '⚪ Clean Minimalist & Modern', desc: 'Apple-inspired clean airy whites, subtle shadows, crisp typography' },
  { id: 'Dark Luxury', name: '🌑 Dark Luxury & Neon Glow', desc: 'Obsidian blacks, sleek dark glass, vibrant glowing accents, high-end feel' },
  { id: 'Vibrant Dynamic', name: '🌈 Vibrant & High Energy', desc: 'Bold gradients, lively pop colors, dynamic interactions & modern flair' },
  { id: 'Glassmorphism 3D', name: '💎 Frosted Glassmorphic & Liquid', desc: 'Translucent glass panels, liquid blobs, smooth spatial motion' }
];

// Step 5: Timelines
const TIMELINES = [
  '⚡ Urgent: Express 48 - 72 Hours Launch',
  '🗓️ 1 - 2 Weeks (Standard Delivery)',
  '⏳ 3 - 4 Weeks (Deep Custom Build)',
  'Flexible / In Planning Phase'
];

// Step 5: Budgets (Affordable Base Packages)
const BUDGETS = [
  { id: 'Demo Template (₹4,999 - ₹14,999)', label: '₹4,999 - ₹14,999', desc: 'Ready-Made Demo Template Customization' },
  { id: 'Growth Business (₹19,999 - ₹29,999)', label: '₹19,999 - ₹29,999', desc: 'Custom Business Suite with Dynamic Features' },
  { id: 'Enterprise Bespoke (₹49,999+)', label: '₹49,999+', desc: 'Full Custom Scale Web App / Platform' },
  { id: 'Need Custom Quote', label: 'Custom Quote', desc: 'Discuss requirement & tailor price' }
];

export default function WhatsAppOrderModal() {
  const { isOpen, modalData, closeOrderModal } = useOrderModal();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    industry: 'Restaurant / Cafe',
    customIndustry: '',
    goal: 'Direct WhatsApp Orders & Invoices',
    businessName: '',
    existingWebsite: 'No, this is a brand new project',
    customSocialLink: '',
    selectedFeatures: ['WhatsApp Pipeline', 'Google SEO & Speed'],
    customFeatureText: '',
    themeStyle: 'Clean Minimalist',
    brandingStatus: 'Yes, logo & colors are ready',
    timeline: '⚡ Urgent: Express 48 - 72 Hours Launch',
    budget: 'Demo Template (₹4,999 - ₹14,999)',
    addDomain: false,
    addHosting: false,
    hasOwnDomainHosting: true,
    couponCode: 'INDIA2025',
    isCouponApplied: false,
    clientName: '',
    whatsappPhone: '',
    email: '',
    city: '',
    extraNotes: ''
  });

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      const isOffer =
        modalData.autoApplyOffer ||
        modalData.websiteType?.toLowerCase().includes('offer') ||
        modalData.websiteType?.toLowerCase().includes('20%') ||
        modalData.websiteType?.toLowerCase().includes('india2025');

      let initialIndustry = 'Restaurant / Cafe';
      if (modalData.selectedDemo) {
        const found = INDUSTRIES.find(i => modalData.selectedDemo.toLowerCase().includes(i.id.toLowerCase()));
        if (found) initialIndustry = found.id;
      }

      setFormData(prev => ({
        ...prev,
        industry: initialIndustry,
        businessName: modalData.selectedDemo ? `${modalData.selectedDemo} Customization` : '',
        budget: modalData.price ? modalData.price : 'Demo Template (₹4,999 - ₹14,999)',
        isCouponApplied: !!isOffer
      }));

      if (isOffer) {
        triggerToast('🎉 Launch Offer "INDIA2025" Applied: Flat 20% OFF Activated!');
      }
    }
  }, [isOpen, modalData]);

  if (!isOpen) return null;

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const toggleFeature = (featId) => {
    setFormData(prev => {
      const exists = prev.selectedFeatures.includes(featId);
      const updated = exists
        ? prev.selectedFeatures.filter(f => f !== featId)
        : [...prev.selectedFeatures, featId];
      return { ...prev, selectedFeatures: updated };
    });
  };

  // Strict Validation for each Step
  const handleNext = () => {
    // Step 1 Validation
    if (currentStep === 1) {
      if (!formData.industry) {
        triggerToast('⚠️ Please select your business industry type!');
        return;
      }
      if (formData.industry === 'Other Custom Business' && !formData.customIndustry.trim()) {
        triggerToast('⚠️ Please type your custom business type!');
        return;
      }
      if (!formData.goal) {
        triggerToast('⚠️ Please select the primary goal of your website!');
        return;
      }
    }

    // Step 2 Validation
    if (currentStep === 2) {
      if (!formData.businessName.trim()) {
        triggerToast('⚠️ Please enter your Brand / Business Name!');
        return;
      }
      if (!formData.existingWebsite) {
        triggerToast('⚠️ Please select your current website/social status!');
        return;
      }
    }

    // Step 3 Validation
    if (currentStep === 3) {
      if (formData.selectedFeatures.length === 0 && !formData.customFeatureText.trim()) {
        triggerToast('⚠️ Please select at least 1 feature needed for your website!');
        return;
      }
    }

    // Step 4 Validation
    if (currentStep === 4) {
      if (!formData.themeStyle) {
        triggerToast('⚠️ Please select a design theme preference!');
        return;
      }
      if (!formData.brandingStatus) {
        triggerToast('⚠️ Please select your logo & branding kit status!');
        return;
      }
    }

    // Step 5 Validation
    if (currentStep === 5) {
      if (!formData.timeline) {
        triggerToast('⚠️ Please select your target launch timeline!');
        return;
      }
      if (!formData.budget) {
        triggerToast('⚠️ Please select your estimated budget tier!');
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateOrderText = () => {
    const activeIndustry = formData.industry === 'Other Custom Business' && formData.customIndustry
      ? formData.customIndustry
      : formData.industry;

    const couponText = formData.isCouponApplied ? `🎁 Promo Voucher: *INDIA2025 (20% OFF Activated)*\n` : '';

    const addonsList = [];
    if (formData.addDomain) addonsList.push('🌐 Custom Domain (.com / .in) (+₹999/yr)');
    if (formData.addHosting) addonsList.push('⚡ Managed Cloud VPS Hosting + Free SSL (+₹1,999/yr)');
    if (!formData.addDomain && !formData.addHosting) addonsList.push('🔄 Client will use own Domain & Hosting (FREE Setup)');

    return (
      `🚀 *NEW PROJECT ONBOARDING BRIEF - LOCAL2BRAND*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Client Name:* ${formData.clientName}\n` +
      `📞 *WhatsApp Phone:* ${formData.whatsappPhone}\n` +
      `📧 *Email:* ${formData.email}\n` +
      `📍 *City / Region:* ${formData.city}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🏢 *Business / Brand:* *${formData.businessName}*\n` +
      `🎯 *Industry & Niche:* ${activeIndustry}\n` +
      `🎯 *Core Goal:* ${formData.goal}\n` +
      `🌐 *Existing Presence:* ${formData.existingWebsite} ${formData.customSocialLink ? `(${formData.customSocialLink})` : ''}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `⚡ *REQUIRED FEATURES & MODULES:*\n` +
      formData.selectedFeatures.map((f, i) => `   ${i + 1}. ${f}`).join('\n') + '\n' +
      (formData.customFeatureText ? `   📝 Custom Addon: ${formData.customFeatureText}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🎨 *Theme Preference:* ${formData.themeStyle}\n` +
      `💎 *Brand Assets:* ${formData.brandingStatus}\n` +
      `⏱️ *Target Timeline:* ${formData.timeline}\n` +
      `💰 *Base Website Budget:* ${formData.budget}\n` +
      `🌐 *Domain & Hosting Addons:*\n` +
      addonsList.map(a => `   • ${a}`).join('\n') + '\n' +
      couponText +
      (formData.extraNotes ? `📝 *Special Notes:* ${formData.extraNotes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `⚡ *Hi LOCAL2BRAND team, please review my complete project brief and send the initial blueprint & quote!*`
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Step 6 Strict Validation for All Contact Fields
    if (!formData.clientName.trim()) {
      triggerToast('⚠️ Please enter your Full Name!');
      return;
    }
    if (!formData.whatsappPhone.trim() || formData.whatsappPhone.trim().length < 8) {
      triggerToast('⚠️ Please enter a valid WhatsApp Phone Number!');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      triggerToast('⚠️ Please enter a valid Email Address!');
      return;
    }
    if (!formData.city.trim()) {
      triggerToast('⚠️ Please enter your City / State!');
      return;
    }

    const text = generateOrderText();
    const cleanNumber = (siteConfig.whatsappNumber || '919876543210').replace(/\D/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    closeOrderModal();
  };

  const handleCopy = () => {
    if (!formData.clientName.trim() || !formData.whatsappPhone.trim()) {
      triggerToast('⚠️ Please enter your Name and WhatsApp Number first!');
      return;
    }
    const text = generateOrderText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerToast('📋 Complete project brief copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[999999] px-4 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-purple-400 animate-bounce">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Modal Card Container with Full Light/Dark Support */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 my-auto max-h-[92vh] transition-colors">
        
        {/* Top Header Bar */}
        <div className="px-5 sm:px-8 py-4 bg-slate-50/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl l2b-gradient-bg flex items-center justify-center text-white font-black shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Interactive Project Builder</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold uppercase">
                  Step {currentStep} of {totalSteps}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">All fields required for accurate quotation & 48-hr deployment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle size="sm" />
            <button
              onClick={closeOrderModal}
              className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Animated Progress Line */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 relative overflow-hidden">
          <div
            className="h-full l2b-gradient-bg transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Dynamic Form Content Body (Scrollable) */}
        <div className="p-5 sm:p-8 flex-1 overflow-y-auto space-y-6 modal-touch-scroll" data-lenis-prevent="true">
          
          {/* STEP 1: Industry & Goal */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Step 1: Project Niche</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  What type of business is this website for? <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Select your industry preset or type your custom business below.</p>
              </div>

              {/* Industries Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, industry: ind.id })}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      formData.industry === ind.id
                        ? 'bg-purple-50 dark:bg-purple-600/20 border-purple-500 text-purple-700 dark:text-purple-200 shadow-sm ring-1 ring-purple-500'
                        : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-base">{ind.icon}</span>
                    <span className="truncate">{ind.id}</span>
                  </button>
                ))}
              </div>

              {/* Custom Industry Input if "Other" selected */}
              {formData.industry === 'Other Custom Business' && (
                <div className="pt-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Specify Your Custom Business Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solar Energy Consultant, Pet Grooming, Law Firm..."
                    value={formData.customIndustry}
                    onChange={(e) => setFormData({ ...formData, customIndustry: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-purple-500/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              )}

              {/* Primary Goal Selector */}
              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  What is the #1 Primary Goal of the Website? <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setFormData({ ...formData, goal })}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        formData.goal === goal
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Brand Identity */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Step 2: Brand Identity</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Tell us about your brand & business</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">This helps us tailor your typography, domain, and structure.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Brand / Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Saffron Mughlai or Apex Fitness"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Do you have an existing website or social media presence? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      'No, this is a brand new project 🚀',
                      'Yes, we need a complete modern redesign 🔄',
                      'We currently only sell on Instagram / WhatsApp 📱'
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData({ ...formData, existingWebsite: opt })}
                        className={`w-full p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          formData.existingWebsite === opt
                            ? 'bg-purple-50 dark:bg-purple-600/20 border-purple-500 text-purple-700 dark:text-purple-200'
                            : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.existingWebsite === opt && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Existing Website URL or Instagram Handle (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @yourbrand or www.currentsite.com"
                    value={formData.customSocialLink}
                    onChange={(e) => setFormData({ ...formData, customSocialLink: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Superpower Features */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Step 3: Features & Superpowers</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Select all the features your website needs <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Please select at least 1 core feature to power your platform.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FEATURE_OPTIONS.map((feat) => {
                  const isChecked = formData.selectedFeatures.includes(feat.id);
                  return (
                    <div
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-purple-50 dark:bg-purple-600/20 border-purple-500 text-purple-700 dark:text-purple-200 shadow-sm'
                          : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="text-xs font-bold pr-2">{feat.label}</span>
                      <div className="shrink-0">
                        {isChecked ? (
                          <div className="w-5 h-5 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Any other custom feature or third-party integration needed?
                </label>
                <input
                  type="text"
                  placeholder="e.g. CRM Sync, Zoho Books integration, Custom Calculator..."
                  value={formData.customFeatureText}
                  onChange={(e) => setFormData({ ...formData, customFeatureText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Visual Theme & Branding */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Step 4: Design Aesthetics</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Choose your visual vibe & design theme <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Our senior UI/UX designers will craft your custom palette based on this.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEMES.map((th) => (
                  <div
                    key={th.id}
                    onClick={() => setFormData({ ...formData, themeStyle: th.id })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      formData.themeStyle === th.id
                        ? 'bg-purple-50 dark:bg-purple-600/20 border-purple-500 text-slate-900 dark:text-white shadow-md ring-1 ring-purple-500'
                        : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{th.name}</span>
                        {formData.themeStyle === th.id && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{th.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Do you already have a Logo and Branding Kit? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    'Yes, logo & colors are ready! 🎨',
                    'Need LOCAL2BRAND to design our logo & brand identity kit 💎',
                    'Have rough ideas, need refinement during development ✨'
                  ].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, brandingStatus: status })}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        formData.brandingStatus === status
                          ? 'bg-purple-50 dark:bg-purple-600/20 border-purple-500 text-purple-700 dark:text-purple-200'
                          : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{status}</span>
                      {formData.brandingStatus === status && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Timeline, Budget & Infrastructure Addons */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Step 5: Budget & Infrastructure</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Package Tier & Turnkey Addons <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Affordable pricing with complete domain and cloud hosting clarity.</p>
              </div>

              {/* Base Budget Tiers */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Base Website Package <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BUDGETS.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setFormData({ ...formData, budget: b.id })}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        formData.budget === b.id
                          ? 'bg-purple-50 dark:bg-purple-600/20 border-purple-500 text-slate-900 dark:text-white shadow-sm'
                          : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-black text-sm text-purple-600 dark:text-purple-400">{b.label}</span>
                        {formData.budget === b.id && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{b.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Turnkey Domain & Hosting Addon Checkboxes */}
              <div className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Turnkey Domain & Hosting Addons
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">(Separate optional charge)</span>
                </div>

                {/* Domain Checkbox */}
                <div
                  onClick={() => setFormData({ ...formData, addDomain: !formData.addDomain })}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    formData.addDomain
                      ? 'bg-purple-50 dark:bg-purple-600/20 border-purple-500 text-purple-900 dark:text-purple-100'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">🌐 Add Custom Domain (.com / .in / .co.in)</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Registered on your name with full DNS ownership</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <div className="font-extrabold text-xs text-purple-600 dark:text-purple-400">+₹999 / yr</div>
                    <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{formData.addDomain ? 'Added ✓' : '+ Add'}</div>
                  </div>
                </div>

                {/* Cloud Hosting Checkbox */}
                <div
                  onClick={() => setFormData({ ...formData, addHosting: !formData.addHosting })}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    formData.addHosting
                      ? 'bg-emerald-50 dark:bg-emerald-600/20 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">⚡ Add Managed High-Speed Cloud VPS & SSL</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">99.9% uptime SLA, daily cloud backups & global CDN</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <div className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">+₹1,999 / yr</div>
                    <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{formData.addHosting ? 'Added ✓' : '+ Add'}</div>
                  </div>
                </div>

                {/* Self-Host Notice */}
                {!formData.addDomain && !formData.addHosting && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium px-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>You can connect your own domain & hosting account for <strong>FREE (₹0 extra)</strong>.</span>
                  </p>
                )}
              </div>

              {/* Target Launch Speed */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Target Launch Speed <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TIMELINES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeline: t })}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        formData.timeline === t
                          ? 'bg-purple-50 dark:bg-purple-600/20 border-purple-500 text-purple-700 dark:text-purple-200 shadow-sm'
                          : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Coupon Pill */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-slate-50 dark:from-purple-950/80 dark:to-slate-950 border border-purple-200 dark:border-purple-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <span className="font-mono font-black text-xs text-purple-700 dark:text-purple-300 block">INDIA2025</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Flat 20% OFF on all website development packages</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, isCouponApplied: !formData.isCouponApplied });
                    triggerToast(formData.isCouponApplied ? 'Coupon removed' : '🎉 Code INDIA2025 Applied: 20% OFF Activated!');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase transition-all cursor-pointer ${
                    formData.isCouponApplied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow'
                  }`}
                >
                  {formData.isCouponApplied ? 'Applied ✓' : 'Apply 20% OFF'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Client Contact & Blueprint Review */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Step 6: Contact & Launch</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Where should we send your Project Blueprint?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Our senior team will connect on WhatsApp within 15 minutes with initial mockups.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.whatsappPhone}
                      onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Your City / State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Delhi, Bengaluru, Dubai..."
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Any specific instructions or inspiration links?</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. We love the clean minimalist look of Apple and want custom booking..."
                    value={formData.extraNotes}
                    onChange={(e) => setFormData({ ...formData, extraNotes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white resize-none focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Brief Summary Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold pb-1 border-b border-slate-200 dark:border-slate-800">
                    <span>Brief Summary</span>
                    <span className="text-purple-600 dark:text-purple-400">{formData.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Brand:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formData.businessName || 'New Project'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Features:</span>
                    <span className="font-bold text-purple-600 dark:text-purple-300">{formData.selectedFeatures.length} Superpowers Selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Website Package:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formData.budget}</span>
                  </div>
                  
                  {/* Domain & Hosting Summary */}
                  {(formData.addDomain || formData.addHosting) ? (
                    <div className="flex justify-between text-blue-600 dark:text-blue-400 font-bold">
                      <span>Addons:</span>
                      <span>
                        {[
                          formData.addDomain ? 'Domain (+₹999)' : null,
                          formData.addHosting ? 'Cloud Hosting (+₹1,999)' : null
                        ].filter(Boolean).join(' + ')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Infrastructure:</span>
                      <span>Own Domain & Hosting (FREE)</span>
                    </div>
                  )}

                  {formData.isCouponApplied && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span>Promo Discount:</span>
                      <span>20% OFF Activated (INDIA2025)</span>
                    </div>
                  )}
                </div>

                {/* Action Submit Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-3.5 rounded-2xl l2b-gradient-bg text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:opacity-95 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit & Open on WhatsApp 🚀</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-slate-200 dark:border-transparent"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy Brief'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Bottom Navigation & Controls */}
        <div className="px-5 sm:px-8 py-3.5 bg-slate-50/90 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-500 font-medium">⚡ 48-Hour Turnaround Guarantee</span>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase l2b-gradient-bg text-white shadow-md hover:opacity-95 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ready for Launch!</span>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
