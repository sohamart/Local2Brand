import React, { useState } from 'react';
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Zap,
  Share2
} from 'lucide-react';
import AshokaChakra from '../components/common/AshokaChakra';
import { useOrderModal } from '../context/OrderModalContext';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../utils/whatsapp';
import ShareDemoModal from '../components/demos/ShareDemoModal';

// Import All 12 Standalone Demo Templates
import RestaurantDemo from '../templates/restaurant/RestaurantDemo';
import CafeDemo from '../templates/cafe/CafeDemo';
import SalonDemo from '../templates/salon/SalonDemo';
import GymDemo from '../templates/gym/GymDemo';
import HotelDemo from '../templates/hotel/HotelDemo';
import RealEstateDemo from '../templates/realestate/RealEstateDemo';
import PhotographyDemo from '../templates/photography/PhotographyDemo';
import BoutiqueDemo from '../templates/boutique/BoutiqueDemo';
import CoachingDemo from '../templates/coaching/CoachingDemo';
import DentalDemo from '../templates/dental/DentalDemo';
import JewelleryDemo from '../templates/jewellery/JewelleryDemo';
import AutomotiveDemo from '../templates/automotive/AutomotiveDemo';

const templateRegistry = {
  'restaurant': { title: 'Restaurant & Fine Dining', category: 'Food & Beverage', component: RestaurantDemo, price: '₹4,999 / $149' },
  'cafe': { title: 'Café & Roastery', category: 'Food & Beverage', component: CafeDemo, price: '₹4,999 / $149' },
  'salon': { title: 'Salon & Spa Studio', category: 'Beauty & Wellness', component: SalonDemo, price: '₹4,999 / $149' },
  'gym': { title: 'Gym & Crossfit Hub', category: 'Fitness & Health', component: GymDemo, price: '₹4,999 / $149' },
  'hotel': { title: 'Hotel & Luxury Resort', category: 'Hospitality', component: HotelDemo, price: '₹14,999 / $449' },
  'realestate': { title: 'Real Estate & Properties', category: 'Real Estate', component: RealEstateDemo, price: '₹14,999 / $449' },
  'photography': { title: 'Photography & Wedding Studio', category: 'Creative & Media', component: PhotographyDemo, price: '₹4,999 / $149' },
  'boutique': { title: 'Boutique & Fashion House', category: 'E-commerce & Retail', component: BoutiqueDemo, price: '₹4,999 / $149' },
  'coaching': { title: 'Coaching & Academy', category: 'Education', component: CoachingDemo, price: '₹4,999 / $149' },
  'dental': { title: 'Dental & Clinic Chamber', category: 'Healthcare', component: DentalDemo, price: '₹4,999 / $149' },
  'jewellery': { title: 'Jewellery & Gold Atelier', category: 'Luxury Retail', component: JewelleryDemo, price: '₹14,999 / $449' },
  'automotive': { title: 'Automotive & Superbikes', category: 'Automobile', component: AutomotiveDemo, price: '₹14,999 / $449' }
};

export default function LiveDemoViewer() {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const { openOrderModal } = useOrderModal();
  const [deviceMode, setDeviceMode] = useState('full'); // 'full', 'desktop', 'tablet', 'mobile'
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isEmbedded = searchParams.get('embed') === 'true' || (typeof window !== 'undefined' && window.self !== window.top);

  const template = templateRegistry[templateId];

  if (!template) {
    return <Navigate to="/demos" replace />;
  }

  const DemoComponent = template.component;

  // When embedded inside the Device Simulator frame, render pure clean website with full native scrolling
  if (isEmbedded) {
    return (
      <div className="w-full min-h-screen bg-slate-950 overflow-y-auto text-slate-100 selection:bg-purple-600 selection:text-white">
        <DemoComponent />
      </div>
    );
  }

  const handleOrder = () => {
    openOrderModal({
      selectedDemo: template.title,
      websiteType: `Live Template: ${template.title}`,
      initialRequirements: `I want to order and customize the "${template.title}" demo template for my business.`,
      price: template.price
    });
  };

  const handleDirectWhatsApp = () => {
    const text = `⚡ *LIVE TEMPLATE ORDER INQUIRY - LOCAL2BRAND*\n\n` +
      `Template: *${template.title}*\n` +
      `Category: ${template.category}\n` +
      `Special Price: *${template.price}*\n\n` +
      `Hi LOCAL2BRAND team, I loved this live demo and want to deploy it for my business in 48 hours!`;
    openWhatsAppChat(generateWhatsAppGeneralUrl(text));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      
      {/* Top Floating Control Bar (Only for standalone full-screen view) */}
      <div className="sticky top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-2xl border-b border-slate-800 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl">
        
        {/* Left: Back to Marketplace */}
        <div className="flex items-center gap-3">
          <Link
            to="/demos"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Marketplace</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 border-l border-slate-700 pl-3">
            <span className="text-xs font-black text-white">{template.title}</span>
            <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
              Live Interactive Demo
            </span>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-slate-400">
          <button
            onClick={() => setDeviceMode('full')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === 'full' ? 'bg-purple-600 text-white shadow' : 'hover:text-white'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Full Width</span>
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === 'desktop' ? 'bg-purple-600 text-white shadow' : 'hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === 'tablet' ? 'bg-purple-600 text-white shadow' : 'hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === 'mobile' ? 'bg-purple-600 text-white shadow' : 'hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Right: Direct Order CTAs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-1.5 px-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Share Demo"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={handleDirectWhatsApp}
            className="px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Order Template on WhatsApp</span>
            <span className="xs:hidden">Order</span>
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareDemoModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        demo={{ title: template.title, slug: templateId, category: template.category }}
      />

      {/* Demo Viewport Area */}
      <div className="flex-1 flex justify-center items-start bg-[#030712] py-2 sm:py-4 px-0 sm:px-4 overflow-x-hidden">
        <div
          className={`transition-all duration-300 w-full ${
            deviceMode === 'full'
              ? 'max-w-full'
              : deviceMode === 'desktop'
              ? 'max-w-6xl rounded-2xl overflow-hidden border border-slate-800 shadow-2xl my-4'
              : deviceMode === 'tablet'
              ? 'max-w-3xl rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl my-4'
              : 'max-w-sm rounded-[36px] overflow-hidden border-8 border-slate-800 shadow-2xl my-4'
          }`}
        >
          <DemoComponent />
        </div>
      </div>

    </div>
  );
}
