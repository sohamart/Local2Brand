import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  Send, 
  Globe2, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { SEO } from '../components/common/CommonUI';
import { siteConfig } from '../config/siteConfig';
import { generateWhatsAppOrderUrl, generateWhatsAppGeneralUrl, openWhatsAppChat } from '../utils/whatsapp';
import AshokaChakra from '../components/common/AshokaChakra';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    whatsapp: '',
    email: '',
    websiteType: 'Custom Business Website (from ₹9,999)',
    requirements: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const url = generateWhatsAppOrderUrl(formData);
    openWhatsAppChat(url);
  };

  const handleDirectWhatsApp = () => {
    openWhatsAppChat(generateWhatsAppGeneralUrl("Hello LOCAL2BRAND, I want to discuss a project."));
  };

  return (
    <>
      <SEO
        title="Contact Us — WhatsApp Direct Consultation"
        description="Get in touch with LOCAL2BRAND. Connect directly on WhatsApp, email, or phone for rapid quotes and custom website design consultations."
      />

      <div className="pt-28 xs:pt-32 sm:pt-40 pb-20">
        
        {/* Page Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <AshokaChakra size={13} />
            <span>🇮🇳 Direct Indian Founders Line • 24/7 IST Support</span>
          </div>
          <SectionHeading
            badge="Direct Communication"
            title="Let's Build Something Great."
            subtitle="Ready to transform your digital presence? Send us your project details or message us directly on WhatsApp."
          />
        </div>

        {/* Contact Layout Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Direct Info & WhatsApp VIP Box */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* WhatsApp VIP Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-card border-2 border-emerald-500/40 shadow-glass-lg relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-white to-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                      Fastest Response
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                      Direct WhatsApp Chat
                    </h3>
                  </div>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Skip the back-and-forth emails. Message our senior team directly on WhatsApp to get an immediate project estimate, discuss feature requirements, or request a custom demo showcase.
                </p>

                <button
                  onClick={handleDirectWhatsApp}
                  className="w-full py-3.5 px-6 rounded-btn font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Consultation</span>
                </button>
                <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-2">
                  Average response time: Under 15 minutes (IST).
                </p>

                {/* Subtle bottom tricolor accent */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/60 via-blue-500/40 to-emerald-500/60" />
              </div>

              {/* Direct Info List Card */}
              <div className="glass-card p-6 sm:p-8 rounded-card border border-white/95 space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  <AshokaChakra size={12} />
                  <span>Studio Coordinates</span>
                </h4>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Email Inquiries</div>
                      <a href={`mailto:${siteConfig.email}`} className="text-purple-600 hover:underline">
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Direct Phone</div>
                      <a href={`tel:${siteConfig.whatsappNumber}`} className="hover:text-purple-600">
                        {siteConfig.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Operating Hours</div>
                      <div>{siteConfig.hours}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Studio Location</div>
                      <div>Pan-India Hub & Global Edge Infrastructure</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Inquiry Form Card */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-6 sm:p-10 rounded-hero border border-white shadow-floating relative overflow-hidden">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center gap-1.5 mb-1">
                    <AshokaChakra size={12} />
                    <span>Project Inquiry Form</span>
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Tell us about your website vision.
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Submitting this form connects you directly to WhatsApp with your pre-formatted order summary.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Your Name <span className="text-pink-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Vikram Malhotra"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Business / Brand Name <span className="text-pink-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        required
                        placeholder="e.g. Royal Organics"
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        WhatsApp Number <span className="text-pink-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="vikram@royalorganics.in"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Project Type
                    </label>
                    <select
                      name="websiteType"
                      value={formData.websiteType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all"
                    >
                      <option value="Custom Business Website (from ₹9,999)">Custom Business Website (from ₹9,999 / $399)</option>
                      <option value="High-Converting Landing Page">High-Converting Landing Page</option>
                      <option value="Creative Portfolio Website">Creative Portfolio Website</option>
                      <option value="E-commerce Store">D2C & E-commerce Store</option>
                      <option value="Ready-Made Demo Customization">Ready-Made Demo Customization (48h)</option>
                      <option value="Custom Web Application">Custom Web Application</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Tell Us About Your Project & Features Needed
                    </label>
                    <textarea
                      name="requirements"
                      rows="4"
                      placeholder="Describe your target audience, preferred styles, timeline, GST requirements, or any specific demo you liked..."
                      value={formData.requirements}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-base sm:text-sm transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 px-8 rounded-btn font-bold text-sm sm:text-base text-white l2b-gradient-bg shadow-glass-highlight hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Submit & Open WhatsApp Inquiry</span>
                      <Send className="w-4 h-4 ml-1" />
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-2">
                      Instant WhatsApp response within 15 minutes during IST business hours.
                    </p>
                  </div>
                </form>

                {/* Subtle bottom tricolor accent */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/60 via-blue-500/40 to-emerald-500/60" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
