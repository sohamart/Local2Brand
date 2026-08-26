import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { SEO } from '../components/common/CommonUI';
import { siteConfig } from '../config/siteConfig';
import AshokaChakra from '../components/common/AshokaChakra';

function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    instagramHandle: '',
    email: '',
    websiteType: 'Custom Business Website (from ₹9,999)',
    requirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getInstagramUsername = () => {
    const rawUrl = siteConfig.socialLinks.instagram || 'https://instagram.com/local2brand';
    const match = rawUrl.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
    return match ? match[1] : 'local2brand';
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const instaUser = getInstagramUsername();
    
    // Format structured message for Instagram DM
    const messageText = [
      `👋 Project Inquiry for ${siteConfig.brandName}:`,
      `• Name: ${formData.name}`,
      `• Brand: ${formData.businessName}`,
      `• Instagram: ${formData.instagramHandle || 'N/A'}`,
      `• Email: ${formData.email || 'N/A'}`,
      `• Project Type: ${formData.websiteType}`,
      `• Requirements: ${formData.requirements || 'Discussing website launch.'}`
    ].join('\n');

    // Copy to clipboard for easy pasting into Instagram DM
    if (navigator.clipboard) {
      navigator.clipboard.writeText(messageText).catch(() => {});
    }

    setShowSuccessModal(true);
    setIsSubmitting(false);

    // Open Instagram DM in a new window
    setTimeout(() => {
      window.open(`https://ig.me/m/${instaUser}`, '_blank', 'noopener,noreferrer');
    }, 450);
  };

  return (
    <>
      <SEO
        title="Contact Us — Direct Instagram DM & Inquiries"
        description="Get in touch with LOCAL2BRAND. Send your project details directly via Instagram DM or email for rapid quotes and custom website design consultations."
      />

      <div className="pt-28 xs:pt-32 sm:pt-40 pb-20">
        
        {/* Page Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200/80 text-pink-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
            <span>Official Instagram DM Inquiries</span>
          </div>
          <SectionHeading
            badge="Direct Inquiries"
            title="Let's Build Something Great."
            subtitle="Ready to transform your digital presence? Send us your project details below to connect directly with our founders on Instagram DM."
          />
        </div>

        {/* Contact Layout Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Direct Info & Instagram DM Card */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Instagram Official Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-card border-2 border-pink-500/30 shadow-glass-lg relative overflow-hidden bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white flex items-center justify-center shadow-md">
                    <InstagramIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-pink-700 bg-pink-100/80 px-2.5 py-0.5 rounded-full">
                      Direct Messaging
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                      Instagram DM Support
                    </h3>
                  </div>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Message our design studio directly on Instagram. Submit the project form to automatically copy your requirements and open our official Instagram Direct Message.
                </p>

                <a
                  href={`https://ig.me/m/${getInstagramUsername()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-btn font-bold text-sm text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Open Instagram DM (@{getInstagramUsername()})</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                {/* Subtle bottom tricolor accent */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/60 via-blue-500/40 to-emerald-500/60" />
              </div>

              {/* Studio Coordinates */}
              <div className="glass-card p-6 sm:p-8 rounded-card border border-white/95 space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  <AshokaChakra size={12} />
                  <span>Studio Details</span>
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
                    <InstagramIcon className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Instagram Handle</div>
                      <a 
                        href={siteConfig.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:underline font-semibold"
                      >
                        @{getInstagramUsername()}
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
                      <div>Pan-India Digital Studio & Global Edge Infrastructure</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Instagram Direct Inquiry Form Card */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-6 sm:p-10 rounded-hero border border-white shadow-floating relative overflow-hidden">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-pink-700 flex items-center gap-1.5 mb-1">
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>Instagram Project Form</span>
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Tell us about your website vision.
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Submitting copies your project summary and connects you directly to our Instagram DM.
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-pink-600 focus:ring-2 focus:ring-pink-500/20 text-slate-900 text-base sm:text-sm transition-all"
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-pink-600 focus:ring-2 focus:ring-pink-500/20 text-slate-900 text-base sm:text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Instagram Username / Handle
                      </label>
                      <input
                        type="text"
                        name="instagramHandle"
                        placeholder="e.g. @vikram.brand"
                        value={formData.instagramHandle}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-pink-600 focus:ring-2 focus:ring-pink-500/20 text-slate-900 text-base sm:text-sm transition-all"
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-pink-600 focus:ring-2 focus:ring-pink-500/20 text-slate-900 text-base sm:text-sm transition-all"
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-pink-600 focus:ring-2 focus:ring-pink-500/20 text-slate-900 text-base sm:text-sm transition-all"
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
                      Tell Us About Your Project & Requirements
                    </label>
                    <textarea
                      name="requirements"
                      rows="4"
                      placeholder="Describe your brand, target audience, preferred colors, or any demo you liked..."
                      value={formData.requirements}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-pink-600 focus:ring-2 focus:ring-pink-500/20 text-slate-900 text-base sm:text-sm transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-8 rounded-btn font-bold text-sm sm:text-base text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-glass-highlight hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <InstagramIcon className="w-5 h-5" />
                      <span>{isSubmitting ? 'Opening Instagram...' : 'Submit & Send on Instagram DM'}</span>
                      <Send className="w-4 h-4 ml-1" />
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-2">
                      Copies project summary to clipboard and opens Instagram Direct with @{getInstagramUsername()}.
                    </p>
                  </div>
                </form>

                {/* Subtle bottom tricolor accent */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500/60 via-blue-500/40 to-emerald-500/60" />
              </div>
            </div>

          </div>
        </div>

        {/* Instagram DM Success Confirmation Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-md" 
              onClick={() => setShowSuccessModal(false)}
            />

            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white z-10 animate-in fade-in zoom-in-95 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
                <InstagramIcon className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">
                Opening Instagram DM...
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Your project details have been <strong>copied to your clipboard</strong>! When Instagram opens, simply paste into the message box to chat directly with our team.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={`https://ig.me/m/${getInstagramUsername()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Open Instagram Chat</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
