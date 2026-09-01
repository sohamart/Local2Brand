import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Share2,
  CheckCircle2,
  Check,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  User,
  Utensils,
  Coffee,
  Dumbbell,
  Hotel,
  Camera,
  ShoppingBag,
  GraduationCap,
  Stethoscope,
  Gem,
  Car,
  Layers,
  Globe,
  Lock,
  Copy,
  MessageCircle,
  Clock,
  ShieldCheck,
  Tag,
  Palette,
  CreditCard,
  Server,
  UploadCloud,
  X,
  Compass,
  Zap,
  Bot,
  RefreshCw,
  FileText,
  Languages,
  CheckCheck,
  HelpCircle,
  Lightbulb,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import ThemeToggle from '../components/common/ThemeToggle';
import AshokaChakra from '../components/common/AshokaChakra';
import api from '../services/api';
import {
  STEP_AI_GUIDES,
  getCurrentStepSelectionText,
  formatStepSummaryPlainText
} from '../data/stepAiData';

// Multilingual Translations Dictionary
const TRANSLATIONS = {
  en: {
    backToHome: 'Home',
    shareForm: 'Share Form',
    copiedLink: 'Copied Link!',
    stepLabel: 'Step',
    previous: 'Previous',
    continue: 'Continue',
    submit: 'Submit Requirements 🚀',
    submitting: 'Submitting...',
    generateAiSummary: '✨ Generate AI Executive Summary',
    refreshAiSummary: 'Refresh AI Summary',
    aiSummaryTitle: 'AI Executive Project Scope & Roadmap',
    aiSummaryDesc: 'Intelligent synthesis of your tech stack, architecture, and milestone delivery plan.',
    copySummary: 'Copy Summary',
    close: 'Close',
    steps: [
      { title: 'Category & Vision', short: 'Category', subtitle: 'Select your industry to load tailored questions and features.' },
      { title: 'Business Profile', short: 'Profile', subtitle: 'We will use these details for header, footer, and lead routing.' },
      { title: 'Industry Specs', short: 'Specs', subtitle: 'Tailored parameters for your specific business niche.' },
      { title: 'Pages & Sitemaps', short: 'Pages', subtitle: 'Choose all pages to be created and structured for maximum conversion.' },
      { title: 'Features & Logic', short: 'Features', subtitle: 'Empower your website with lead magnets, alerts, and booking engines.' },
      { title: 'Payment Gateways', short: 'Payments', subtitle: 'Select how you want your customers to pay for your products and services.' },
      { title: 'Admin CMS', short: 'Admin', subtitle: 'How do you want to manage your menu, products, bookings, and inquiries?' },
      { title: 'WhatsApp Alerts', short: 'Alerts', subtitle: 'Get instantly notified whenever a client places an order or inquiry.' },
      { title: 'Design & Colors', short: 'Design', subtitle: 'Help our UI designers align with your brand personality.' },
      { title: 'Store Photos', short: 'Photos', subtitle: 'Upload store exterior, restaurant ambiance, dishes, or logo.' },
      { title: 'Domain & Speed', short: 'Launch', subtitle: 'Everything you need for sub-second page speed and high reliability.' },
      { title: 'Review & Submit', short: 'Review', subtitle: 'Confirm your details. No immediate payment is required to submit.' }
    ]
  },
  bn: {
    backToHome: 'হোম',
    shareForm: 'ফর্ম শেয়ার',
    copiedLink: 'লিংক কপি হয়েছে!',
    stepLabel: 'ধাপ',
    previous: 'পূর্ববর্তী',
    continue: 'পরবর্তী ধাপ',
    submit: 'প্রজেক্ট রিকোয়ারমেন্টস জমা দিন 🚀',
    submitting: 'জমা হচ্ছে...',
    generateAiSummary: '✨ AI এক্সিকিউটিভ সামারি তৈরি করুন',
    refreshAiSummary: 'AI সামারি রিফ্রেশ',
    aiSummaryTitle: 'AI প্রজেক্ট স্কোপ ও ডেলিভারি রোডম্যাপ',
    aiSummaryDesc: 'আপনার পছন্দের ফিচার ও টেক স্ট্যাকের স্বয়ংক্রিয় এআই বিশ্লেষণ।',
    copySummary: 'সামারি কপি করুন',
    close: 'বন্ধ করুন',
    steps: [
      { title: 'ক্যাটাগরি ও রূপরেখা', short: 'ক্যাটাগরি', subtitle: 'আপনার ইন্ডাস্ট্রি বেছে নিন যাতে উপযুক্ত ফিচার ও প্রশ্নাবলি লোড হয়।' },
      { title: 'বিজনেস প্রোফাইল', short: 'প্রোফাইল', subtitle: 'আমরা এই বিবরণগুলো হেডার, ফুটার এবং লিড রাউটিং-এ সেট করব।' },
      { title: 'ইন্ডাস্ট্রি স্পেক্স', short: 'স্পেক্স', subtitle: 'আপনার ব্যবসার জন্য কাস্টমাইজড স্পেসিফিকেশন ও অপশন।' },
      { title: 'পেজ ও সাইটম্যাপ', short: 'পেজ', subtitle: 'উচ্চ কনভার্সনের জন্য আপনার প্রয়োজনীয় পেজগুলো নির্বাচন করুন।' },
      { title: 'ফিচার ও লজিক', short: 'ফিচার', subtitle: 'অটোমেটেড লিড এলার্ট, অনলাইন বুকিং ও শক্তিশালী ফিচার যুক্ত করুন।' },
      { title: 'পেমেন্ট গেটওয়ে', short: 'পেমেন্ট', subtitle: 'গ্রাহকরা কীভাবে টাকা পেমেন্ট করবে তা নির্বাচন করুন।' },
      { title: 'এডমিন CMS প্যানেল', short: 'এডমিন', subtitle: 'আপনি কীভাবে আপনার মেনু, প্রোডাক্ট ও লিড পরিচালনা করতে চান?' },
      { title: 'হোয়াটসঅ্যাপ এলার্টস', short: 'এলার্টস', subtitle: 'প্রতিটি নতুন অর্ডার ও ইনকোয়ারির ইনস্ট্যান্ট নোটিফিকেশন পান।' },
      { title: 'ডিজাইন ও কালার', short: 'ডিজাইন', subtitle: 'আপনার ব্র্যান্ডের লুক ও ভিজ্যুয়াল স্টাইল নির্বাচন করুন।' },
      { title: 'ছবি ও মিডিয়া', short: 'মিডিয়া', subtitle: 'দোকান, শোরুম, প্রোডাক্ট বা লোগোর ছবি আপলোড করুন (ঐচ্ছিক)।' },
      { title: 'ডোমেন ও গতি', short: 'লঞ্চ', subtitle: 'সুপার ফাস্ট স্পিড ও ক্লাউড হোস্টিং সেটআপ নিশ্চিত করুন।' },
      { title: 'যাচাই ও জমা দিন', short: 'রিভিউ', subtitle: 'তথ্যগুলো যাচাই করে প্রজেক্ট রিকোয়ারমেন্টস জমা দিন।' }
    ]
  },
  hi: {
    backToHome: 'होम',
    shareForm: 'फॉर्म शेयर करें',
    copiedLink: 'लिंक कॉपी हुआ!',
    stepLabel: 'चरण',
    previous: 'पिछला',
    continue: 'आगे बढ़ें',
    submit: 'आवश्यकताएं सबमिट करें 🚀',
    submitting: 'सबमिट हो रहा है...',
    generateAiSummary: '✨ AI कार्यकारी सारांश तैयार करें',
    refreshAiSummary: 'AI सारांश रीफ्रेश',
    aiSummaryTitle: 'AI प्रोजेक्ट स्कोप और रोडमैप',
    aiSummaryDesc: 'आपके चुने गए फीचर्स और टेक स्टैक का स्मार्ट विश्लेषण।',
    copySummary: 'सारांश कॉपी करें',
    close: 'बंद करें',
    steps: [
      { title: 'श्रेणी और विजन', short: 'श्रेणी', subtitle: 'उद्योग चुनें ताकि सही प्रश्न और फीचर्स लोड हो सकें।' },
      { title: 'बिजनेस प्रोफाइल', short: 'प्रोफाइल', subtitle: 'हम इन विवरणों का उपयोग वेबसाइट हेडर, फुटर और लीड्स के लिए करेंगे।' },
      { title: 'उद्योग विवरण', short: 'विवरण', subtitle: 'आपके व्यवसाय के लिए अनुकूलित विनिर्देश।' },
      { title: 'पेज और साइटमैप', short: 'पेज', subtitle: 'उच्च रूपांतरण के लिए आवश्यक पेज चुनें।' },
      { title: 'फीचर्स और लॉजिक', short: 'फीचर्स', subtitle: 'लीड अलर्ट, ऑनलाइन बुकिंग और शक्तिशाली फीचर्स जोड़ें।' },
      { title: 'पेमेंट गेटवे', short: 'पेमेंट', subtitle: 'चुनें कि ग्राहक आपको ऑनलाइन भुगतान कैसे करेंगे।' },
      { title: 'एडमिन CMS', short: 'एडमिन', subtitle: 'आप अपने उत्पाद और लीड कैसे प्रबंधित करना चाहते हैं?' },
      { title: 'व्हाट्सएप अलर्ट', short: 'अलर्ट', subtitle: 'हर नए ऑर्डर पर तुरंत व्हाट्सएप सूचनाएं प्राप्त करें।' },
      { title: 'डिजाइन और रंग', short: 'डिजाइन', subtitle: 'अपने ब्रांड की दृश्य शैली और रंग चुनें।' },
      { title: 'तस्वीरें और मीडिया', short: 'मीडिया', subtitle: 'दुकान, उत्पाद या लोगो की तस्वीरें अपलोड करें।' },
      { title: 'डोमेन और स्पीड', short: 'लॉन्च', subtitle: 'सुपर फास्ट गति और सुरक्षित क्लाउड होस्टिंग।' },
      { title: 'समीक्षा और सबमिट', short: 'समीक्षा', subtitle: 'विवरण की पुष्टि करें और अपना प्रस्ताव सबमिट करें।' }
    ]
  }
};

// Multilingual Industry Categories
const INDUSTRY_CATEGORIES = [
  {
    slug: 'restaurant',
    icon: Utensils,
    en: { name: 'Restaurant & Dining', desc: 'Digital menus, table reservations, takeaway orders' },
    bn: { name: 'রেস্তোরাঁ ও ডাইনিং', desc: 'ডিজিটাল মেনু, টেবিল বুকিং, অনলাইন অর্ডার' },
    hi: { name: 'रेस्तरां और डाइनिंग', desc: 'डिजिटल मेनू, टेबल बुकिंग, ऑनलाइन ऑर्डर' }
  },
  {
    slug: 'cafe',
    icon: Coffee,
    en: { name: 'Café & Bakery', desc: 'Brews showcase, bakery pre-orders, aesthetic feeds' },
    bn: { name: 'ক্যাফে ও বেকারি', desc: 'কফি ব্লেন্ডস, কেক প্রি-অর্ডার, ইনস্টাগ্রাম ফিড' },
    hi: { name: 'कैफे और बेकरी', desc: 'कॉफी ब्लेंड्स, केक प्री-ऑर्डर, इंस्टाग्राम फीड' }
  },
  {
    slug: 'salon',
    icon: Sparkles,
    en: { name: 'Salon, Spa & Beauty', desc: 'Stylist portfolios, service rate-cards, bookings' },
    bn: { name: 'স্যালুন ও স্পা বিউটি', desc: 'স্টাইলিস্ট পোর্টফোলিও, সার্ভিস রেটকার্ড, বুকিং' },
    hi: { name: 'सैलून और स्पा ब्यूटी', desc: 'स्टाइलिस्ट पोर्टफोलियो, सर्विस रेट कार्ड, बुकिंग' }
  },
  {
    slug: 'gym',
    icon: Dumbbell,
    en: { name: 'Gym & Fitness Hub', desc: 'Class timetable, membership tiers, trial passes' },
    bn: { name: 'জিম ও ফিটনেস হাব', desc: 'ক্লাস রুটিন, মেম্বারশিপ প্ল্যান, ফ্রি ট্রায়াল পাস' },
    hi: { name: 'जिम और फिटनेस हब', desc: 'क्लास टाइमटेबल, मेंबरशिप प्लान, फ्री ट्रायल' }
  },
  {
    slug: 'hotel',
    icon: Hotel,
    en: { name: 'Hotel & Homestay', desc: 'Direct room reservations, photo suites, amenities' },
    bn: { name: 'হোটেল ও রিসোর্ট', desc: 'রুম বুকিং ইঞ্জিন, রুম প্রিভিউ, অ্যামিনিটিজ' },
    hi: { name: 'होटल और होमस्टे', desc: 'रूम बुकिंग इंजन, रूम प्रीव्यू, सुविधाएं' }
  },
  {
    slug: 'real_estate',
    icon: Building2,
    en: { name: 'Real Estate Developer', desc: 'Project showcases, floorplans, site visits' },
    bn: { name: 'রিয়েল এস্টেট প্রপার্টি', desc: 'ফ্ল্যাট শোকেস, ফ্লোর প্ল্যান, সাইট ভিজিট বুকিং' },
    hi: { name: 'रियल एस्टेट डेवलपर', desc: 'प्रोजेक्ट शोकेस, फ्लोर प्लान, साइट विजिट' }
  },
  {
    slug: 'ecommerce',
    icon: ShoppingBag,
    en: { name: 'E-Commerce Store', desc: 'Online catalog, shopping cart, WhatsApp orders' },
    bn: { name: 'ই-কমার্স অনলাইন শপ', desc: 'প্রোডাক্ট ক্যাটালগ, শপিং কার্ট, হোয়াটসঅ্যাপ অর্ডার' },
    hi: { name: 'ई-कॉमर्स ऑनलाइन स्टोर', desc: 'उत्पाद कैटलॉग, शॉपिंग कार्ट, व्हाट्सएप ऑर्डर' }
  },
  {
    slug: 'custom',
    icon: Layers,
    en: { name: 'Custom Enterprise', desc: '100% bespoke design, custom API & workflows' },
    bn: { name: 'কাস্টম এন্টারপ্রাইজ', desc: '১০০% কাস্টম ডিজাইন, বিশেষ API ও ফিচার' },
    hi: { name: 'कस्टम एंटरप्राइज', desc: '100% कस्टमाइज्ड डिजाइन, विशेष API और लॉजिक' }
  }
];

// Dynamic Multilingual Pages
const MULTI_PAGES = [
  {
    id: 'home',
    en: 'Home Page (High-Converting Hero)',
    bn: 'হোম পেজ (উচ্চ কনভার্সন হিরো সেকশন)',
    hi: 'होम पेज (उच्च रूपांतरण हीरो सेक्शन)'
  },
  {
    id: 'catalog',
    en: 'Services / Food Menu / Product Catalog',
    bn: 'সার্ভিস / ফুড মেনু / প্রোডাক্ট ক্যাটালগ',
    hi: 'सेवाएं / मेनू / उत्पाद कैटलॉग'
  },
  {
    id: 'booking',
    en: 'Online Booking / Reservation System',
    bn: 'অনলাইন টেবিল / অ্যাপয়েন্টমেন্ট বুকিং ইঞ্জিন',
    hi: 'ऑनलाइन बुकिंग / अपॉइंटमेंट इंजन'
  },
  {
    id: 'contact',
    en: 'Contact Page & Google Map Integration',
    bn: 'যোগাযোগ পেজ ও গুগল ম্যাপ ইন্টিগ্রেশন',
    hi: 'संपर्क पेज और गूगल मैप्स एकीकरण'
  },
  {
    id: 'reviews',
    en: 'Customer Reviews & Testimonials',
    bn: 'গ্রাহক রিভিউ ও টেস্টিমোনিয়াল সেকশন',
    hi: 'ग्राहक समीक्षा और प्रशंसापत्र'
  },
  {
    id: 'about',
    en: 'About the Founders & Story',
    bn: 'আমাদের গল্প ও প্রতিষ্ঠাতা পরিচিতি',
    hi: 'संस्थापक परिचय और ब्रांड कहानी'
  },
  {
    id: 'gallery',
    en: 'Photo Gallery / Portfolio Showcase',
    bn: 'ফটো গ্যালারি ও পোর্টফোলিও শোকেস',
    hi: 'फोटो गैलरी और पोर्टफोलियो'
  },
  {
    id: 'pricing',
    en: 'Pricing Tiers & Plan Comparison',
    bn: 'প্রাইসিং প্যাকেজ ও প্ল্যান তুলনা',
    hi: 'मूल्य पैकेज और प्लान तुलना'
  },
  {
    id: 'faq',
    en: 'FAQ Section & Support Channels',
    bn: 'সাধারণ প্রশ্নোত্তর (FAQ) ও সাপোর্ট',
    hi: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)'
  },
  {
    id: 'legal',
    en: 'Privacy Policy & Terms of Service',
    bn: 'প্রাইভেসি পলিসি ও টার্মস অব সার্ভিস',
    hi: 'गोपनीयता नीति और सेवा की शर्तें'
  }
];

// Dynamic Multilingual Features
const MULTI_FEATURES = [
  {
    id: 'auth',
    en: 'User Registration / Customer Login',
    bn: 'গ্রাহক একাউন্ট রেজিস্ট্রেশন ও লগইন',
    hi: 'ग्राहक खाता पंजीकरण और लॉगिन'
  },
  {
    id: 'online_booking',
    en: 'Online Table / Appointment Booking',
    bn: 'অনলাইন স্লট ও অ্যাপয়েন্টমেন্ট বুকিং',
    hi: 'ऑनलाइन स्लॉट और अपॉइंटमेंट बुकिंग'
  },
  {
    id: 'whatsapp_alerts',
    en: 'Automated WhatsApp Lead Notifications',
    bn: 'স্বয়ংক্রিয় হোয়াটসঅ্যাপ লিড নোটিফিকেশন',
    hi: 'स्वचालित व्हाट्सएप लीड सूचनाएं'
  },
  {
    id: 'whatsapp_checkout',
    en: 'Direct WhatsApp 1-Click Ordering',
    bn: '১-ক্লিক ডিরেক্ট হোয়াটসঅ্যাপ অর্ডার',
    hi: '1-क्लिक डायरेक्ट व्हाट्सएप ऑर्डर'
  },
  {
    id: 'payment_gateway',
    en: 'Online Payment Gateway (Razorpay/UPI)',
    bn: 'অনলাইন পেমেন্ট গেটওয়ে (Razorpay/UPI)',
    hi: 'ऑनलाइन पेमेंट गेटवे (Razorpay/UPI)'
  },
  {
    id: 'search_filter',
    en: 'Live Search & Instant Category Filters',
    bn: 'লাইভ সার্চ ও ক্যাটাগরি ফিল্টারিং',
    hi: 'लाइव सर्च और श्रेणी फिल्टर'
  },
  {
    id: 'multi_lang',
    en: 'Dynamic Multi-Language Toggle (Bengali/Hindi/English)',
    bn: 'মাল্টি-ল্যাঙ্গুয়েজ সুইচ (বাংলা/ইংরেজি/হিন্দি)',
    hi: 'बहुभाषी स्विच (बंगाली/अंग्रेजी/हिंदी)'
  },
  {
    id: 'callback_modal',
    en: 'Instant Customer Callback Request Modal',
    bn: 'ইনস্ট্যান্ট ফোন কলব্যাক রিকোয়েস্ট মডাল',
    hi: 'त्वरित फोन कॉलबैक अनुरोध मोडल'
  },
  {
    id: 'dark_mode',
    en: 'Dark Mode & Light Mode Theme Switcher',
    bn: 'ডার্ক মোড ও লাইট মোড থিম সুইচার',
    hi: 'डार्क मोड और लाइट मोड थीम स्विचर'
  },
  {
    id: 'seo_markup',
    en: 'Full Technical SEO & Schema Markup',
    bn: 'সম্পূর্ণ টেকনিক্যাল এসইও ও গুগল স্কিমা',
    hi: 'पूर्ण तकनीकी एसईओ और गूगल स्कीमा'
  }
];

// Multilingual Payment Methods
const MULTI_PAYMENTS = [
  { id: 'razorpay', en: 'Razorpay (Cards, Netbanking, UPI)', bn: 'Razorpay (কার্ড, নেটব্যাঙ্কিং, UPI)', hi: 'Razorpay (कार्ड, नेटबैंकिंग, UPI)' },
  { id: 'upi', en: 'UPI (GPay / PhonePe / Paytm Instant QR)', bn: 'UPI (GPay / PhonePe / Paytm ইনস্ট্যান্ট QR)', hi: 'UPI (GPay / PhonePe / Paytm इंस्टेंट QR)' },
  { id: 'cod', en: 'Cash on Delivery (COD) / Pay at Venue', bn: 'ক্যাশ অন ডেলিভারি (COD) / ভেন্যুতে পেমেন্ট', hi: 'कैश ऑन डिलीवरी (COD) / स्थल पर भुगतान' },
  { id: 'bank', en: 'Direct Bank Transfer (NEFT/IMPS Invoicing)', bn: 'ডিরেক্ট ব্যাংক ট্রান্সফার (NEFT/IMPS ইনভয়েসিং)', hi: 'सीधा बैंक ट्रांसफर (NEFT/IMPS इनवॉइस)' },
  { id: 'stripe', en: 'Stripe (International USD/EUR Cards)', bn: 'Stripe (আন্তর্জাতিক ডলার/ইউরো কার্ড)', hi: 'Stripe (अंतरराष्ट्रीय USD/EUR कार्ड)' },
  { id: 'inquiry_only', en: 'No Online Payments (Inquiry Only)', bn: 'অনলাইন পেমেন্ট ছাড়া (শুধুমাত্র ইনকোয়ারি)', hi: 'ऑनलाइन भुगतान नहीं (केवल पूछताछ)' }
];

// Reusable Step Header with AI Summary Trigger
function StepHeader({ stepIdx, title, subtitle, t, lang, onOpenAiSummary }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-2">
      <div className="space-y-1">
        <span className="text-[11px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 inline-block shadow-2xs">
          {t.stepLabel} {stepIdx + 1} • {t.steps[stepIdx]?.title}
        </span>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white pt-1 tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {subtitle || t.steps[stepIdx]?.subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onOpenAiSummary(stepIdx)}
        className="self-start sm:self-auto px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 dark:from-purple-950/70 dark:via-indigo-950/60 dark:to-pink-950/50 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/60 dark:hover:to-indigo-900/50 text-purple-700 dark:text-purple-300 border border-purple-200/90 dark:border-purple-800/80 text-xs font-black flex items-center gap-2 cursor-pointer shadow-2xs hover:shadow-md transition-all active:scale-95 group shrink-0"
        title={lang === 'bn' ? 'এই ধাপের প্রশ্ন ও অপশনের এআই সারসংক্ষেপ দেখুন' : 'View AI Summary & Guide for this step'}
      >
        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse group-hover:rotate-12 transition-transform" />
        <span>{lang === 'bn' ? '✨ এই ধাপের AI সারসংক্ষেপ' : lang === 'hi' ? '✨ इस चरण का AI सारांश' : '✨ Step AI Summary'}</span>
      </button>
    </div>
  );
}

// Step AI Typewriter View with Dynamic Streaming & Filtered Unlocked Steps
function StepAiTypewriterView({ guideData, lang, selection, stepIdx, maxReachedStep, currentStepIndex, onSelectStep, onSwitchLang, t }) {
  const [typedQuestion, setTypedQuestion] = useState(guideData?.question || '');
  const [typedTip, setTypedTip] = useState(guideData?.tip || '');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter streaming when step or language changes
  useEffect(() => {
    setIsTyping(true);
    setTypedQuestion('');
    setTypedTip('');

    const qText = guideData?.question || '';
    const tipText = guideData?.tip || '';

    let qIdx = 0;
    const qStep = Math.max(3, Math.floor(qText.length / 25));
    const interval = setInterval(() => {
      qIdx += qStep;
      if (qIdx >= qText.length) {
        setTypedQuestion(qText);
        setTypedTip(tipText);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setTypedQuestion(qText.slice(0, qIdx));
      }
    }, 15);

    return () => clearInterval(interval);
  }, [guideData?.question, guideData?.tip, stepIdx, lang]);

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Step Navigation Ribbon: ONLY show unlocked steps! */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
        {t.steps.map((s, idx) => {
          const isUnlocked = idx <= maxReachedStep;
          const isSelected = idx === stepIdx;
          const isFormCurrent = idx === currentStepIndex;

          if (!isUnlocked) return null; // Hide locked steps

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectStep(idx)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer shrink-0 snap-center ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-xs font-black ring-2 ring-purple-400/30 scale-102'
                  : isFormCurrent
                  ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700 hover:text-purple-600'
              }`}
            >
              <span>#{idx + 1}</span>
              <span>{s.short}</span>
            </button>
          );
        })}
      </div>

      {/* Step Header Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50/90 to-indigo-50/90 dark:from-purple-950/40 dark:to-indigo-950/30 border border-purple-200/90 dark:border-purple-800/80 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
            #{stepIdx + 1}
          </div>
          <div>
            <h4 className="font-black text-sm text-slate-900 dark:text-white">
              {guideData.title}
            </h4>
            <p className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
              {guideData.purpose}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSwitchLang(lang === 'bn' ? 'en' : 'bn')}
          className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs hover:scale-102 transition-all shrink-0"
        >
          <Languages className="w-3.5 h-3.5 text-purple-600" />
          <span>{lang === 'bn' ? '🌐 View English' : '🇧🇩 বাংলায় দেখুন'}</span>
        </button>
      </div>

      {/* 1. Core Question Card (with Typewriter) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-black text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>{lang === 'bn' ? '🎯 এই ধাপে যা জানতে চাওয়া হয়েছে (Question & Objective)' : lang === 'hi' ? '🎯 इस चरण का मुख्य प्रश्न' : '🎯 Step Question & Objective'}</span>
        </div>
        <p className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-relaxed">
          {typedQuestion}
          {isTyping && <span className="inline-block w-2 h-3.5 bg-purple-600 ml-1 rounded-xs animate-pulse" />}
        </p>
      </div>

      {/* 2. Options Breakdown Card */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between gap-2 text-indigo-700 dark:text-indigo-300 font-black text-xs uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{lang === 'bn' ? '📋 এই ধাপের অপশনসমূহ ও সহজ ব্যাখ্যা' : lang === 'hi' ? '📋 विकल्पों का विवरण' : '📋 Available Options & Meanings'}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold">
            {guideData.options?.length || 0} {lang === 'bn' ? 'টি অপশন' : 'Options'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {guideData.options?.map((opt, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-start gap-2 shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <div className="space-y-0.5 min-w-0">
                <strong className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                  {opt.name}
                </strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  {opt.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI Pro Recommendation Tip */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/70 space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-black text-xs uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{lang === 'bn' ? '💡 এআই স্মার্ট পরামর্শ (AI Recommendation)' : lang === 'hi' ? '💡 एआई स्मार्ट सलाह' : '💡 AI Pro Recommendation'}</span>
        </div>
        <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
          {typedTip || guideData.tip}
        </p>
      </div>

      {/* 4. Real-time User Selection Preview */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-between gap-3 shadow-2xs">
        <div className="space-y-0.5 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
            {lang === 'bn' ? '✅ ফর্মে আপনার বর্তমান নির্বাচন:' : lang === 'hi' ? '✅ आपका वर्तमान चयन:' : '✅ Your Current Selection in Form:'}
          </span>
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {selection}
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 shrink-0">
          Live
        </span>
      </div>
    </div>
  );
}

export default function GetStarted() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { settings } = useSiteSettings();

  // Language State: 'en' | 'bn' | 'hi'
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('l2b_form_lang') || 'en';
    }
    return 'en';
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Step index persisted across page reloads
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedStep = localStorage.getItem('l2b_get_started_step');
      if (savedStep !== null) {
        const parsed = parseInt(savedStep, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 11) {
          return parsed;
        }
      }
    }
    return 0;
  });

  const [maxReachedStep, setMaxReachedStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMax = localStorage.getItem('l2b_get_started_max_step');
      if (savedMax !== null) {
        const parsed = parseInt(savedMax, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 11) {
          return parsed;
        }
      }
    }
    return 0;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState('');

  // AI Summary State with progressive typewriter stream & multi-stage analysis
  const [aiSummary, setAiSummary] = useState('');
  const [displayedAiSummary, setDisplayedAiSummary] = useState('');
  const [aiAnalysisStage, setAiAnalysisStage] = useState(0); // 0: Idle, 1: Niche, 2: Tech, 3: Sprint, 4: Ready
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [copiedAi, setCopiedAi] = useState(false);

  // AI Modal Tab & Language Selection ('step' | 'full', 'bn' | 'en' | 'hi')
  const [aiModalTab, setAiModalTab] = useState('step');
  const [aiModalStepIndex, setAiModalStepIndex] = useState(0);
  const [aiModalLang, setAiModalLang] = useState(lang || 'bn');

  const stepScrollContainerRef = useRef(null);

  const [formData, setFormData] = useState(() => {
    const defaultData = {
      requirementId: '',
      websiteType: 'restaurant',
      websiteTypeName: 'Restaurant & Dining',
      clientInfo: {
        businessName: '',
        ownerName: '',
        mobile: '',
        email: '',
        city: '',
        existingWebsite: '',
        hasLogo: 'yes',
        contentReady: 'yes'
      },
      businessDetails: {
        selectedCuisines: [],
        specialties: '',
        operatingHours: '',
        serviceArea: '',
        seatingCapacity: '',
        tableBookingSlots: [],
        foodDelivery: [],
        orderType: [],
        instagramFeed: '',
        numberOfStylists: '',
        bookingStyle: [],
        serviceDuration: '',
        membershipTiers: [],
        trialPass: '',
        classSchedule: '',
        roomBookingEngine: '',
        amenities: [],
        checkinPolicy: '',
        propertyFilter: [],
        virtualTours: '',
        siteVisit: '',
        catalogSize: '',
        ecommerceFeatures: [],
        customBusinessType: '',
        customFeatures: ''
      },
      selectedPages: [
        'Home Page (High-Converting Hero)',
        'Services / Food Menu / Product Catalog',
        'Online Booking / Reservation System',
        'Contact Page & Google Map Integration',
        'Customer Reviews & Testimonials'
      ],
      selectedFeatures: [
        'User Registration / Customer Login',
        'Online Table / Appointment Booking',
        'Automated WhatsApp Lead Notifications'
      ],
      paymentMethods: ['Razorpay (Cards, Netbanking, UPI)', 'UPI (GPay / PhonePe / Paytm Instant QR)', 'Cash on Delivery (COD) / Pay at Venue'],
      adminPanelType: 'Full Dynamic Admin Panel',
      whatsappIntegration: true,
      whatsappOptions: ['WhatsApp Floating Quick Chat Button', 'Direct Order / Booking to WhatsApp with Pre-filled Payload'],
      emailIntegration: true,
      emailOptions: ['Automated Customer Confirmation Email & Receipt', 'Instant Admin Email Alert for every submission'],
      designStyle: 'Modern Glassmorphic & Vibrant',
      preferredColors: 'Purple, Neon Blue & Luxury Gold',
      referenceUrls: '',
      uploadedImages: [],
      domainStatus: 'Need New Domain (Free Included)',
      hostingStatus: 'High-Speed Cloud Hosting (Free 1-Yr Included)',
      budget: '₹12,999 – ₹24,999 (Standard Commercial)',
      timeline: '⚡ Express Delivery (48 - 72 Hours)',
      couponCode: searchParams.get('coupon') || '',
      discountPercent: searchParams.get('coupon') ? 20 : 0,
      additionalNotes: ''
    };

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('l2b_get_started_autosave_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...defaultData,
            ...parsed,
            clientInfo: {
              ...defaultData.clientInfo,
              ...(parsed.clientInfo || {})
            },
            businessDetails: {
              ...defaultData.businessDetails,
              ...(parsed.businessDetails || {})
            }
          };
        } catch (e) {
          console.warn('Autosave parse error:', e);
        }
      }
    }
    return defaultData;
  });

  const [selectedFileObjects, setSelectedFileObjects] = useState([]);

  // Continuous real-time persistent autosave to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !submittedData) {
      try {
        localStorage.setItem('l2b_get_started_step', String(currentStepIndex));
        localStorage.setItem('l2b_get_started_max_step', String(maxReachedStep));
        localStorage.setItem('l2b_get_started_autosave_v2', JSON.stringify(formData));
        const now = new Date();
        setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
    }
  }, [currentStepIndex, maxReachedStep, formData, submittedData]);

  // Auto scroll active step pill into view on mobile
  useEffect(() => {
    if (stepScrollContainerRef.current) {
      const activeBtn = stepScrollContainerRef.current.children[currentStepIndex];
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentStepIndex]);

  // Pre-fill if URL parameters exist
  useEffect(() => {
    const planParam = searchParams.get('plan');
    const demoParam = searchParams.get('demo') || searchParams.get('template');
    const couponParam = searchParams.get('coupon');

    if (planParam || demoParam || couponParam) {
      setFormData((prev) => ({
        ...prev,
        websiteTypeName: demoParam || planParam || prev.websiteTypeName,
        couponCode: couponParam || prev.couponCode,
        discountPercent: couponParam ? 20 : prev.discountPercent,
        additionalNotes: planParam ? `Interested in ${planParam} package.` : prev.additionalNotes
      }));
    }
  }, [searchParams]);

  // If user logs in after mount, populate empty credentials
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        clientInfo: {
          ...prev.clientInfo,
          ownerName: prev.clientInfo.ownerName || user.name || '',
          mobile: prev.clientInfo.mobile || user.phone || '',
          email: prev.clientInfo.email || user.email || ''
        }
      }));
    }
  }, [user]);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('l2b_form_lang', newLang);
    }
    toast.info(newLang === 'bn' ? 'বাংলা ভাষা সক্রিয় করা হয়েছে 🇮🇳' : newLang === 'hi' ? 'हिंदी भाषा सक्रिय की गई 🇮🇳' : 'English Language Active 🇬🇧');
  };

  const handleResetForm = () => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি ফর্মের সমস্ত তথ্য মুছে নতুন করে শুরু করতে চান?' : 'Are you sure you want to reset and clear all form progress?')) {
      localStorage.removeItem('l2b_get_started_step');
      localStorage.removeItem('l2b_get_started_max_step');
      localStorage.removeItem('l2b_get_started_autosave_v2');
      toast.info('Form progress reset.');
      window.location.reload();
    }
  };

  const validateStep = (stepIdx) => {
    if (stepIdx === 0) {
      if (!formData.websiteType) {
        return lang === 'bn' ? 'অনুগ্রহ করে একটি ইন্ডাস্ট্রি ক্যাটাগরি বেছে নিন।' : lang === 'hi' ? 'कृपया एक उद्योग श्रेणी चुनें।' : 'Please select a business industry category.';
      }
    }
    if (stepIdx === 1) {
      if (!formData.clientInfo.businessName?.trim()) {
        return lang === 'bn' ? 'অনুগ্রহ করে আপনার ব্যবসার নাম লিখুন।' : lang === 'hi' ? 'कृपया अपने बिजनेस का नाम दर्ज करें।' : 'Please enter your Business / Brand Name.';
      }
      if (!formData.clientInfo.ownerName?.trim()) {
        return lang === 'bn' ? 'অনুগ্রহ করে প্রতিষ্ঠাতা বা মালিকের নাম লিখুন।' : lang === 'hi' ? 'कृपया मालिक / संस्थापक का नाम दर्ज करें।' : 'Please enter Owner / Founder Name.';
      }
      if (!formData.clientInfo.mobile?.trim() || formData.clientInfo.mobile.replace(/[^0-9]/g, '').length < 8) {
        return lang === 'bn' ? 'অনুগ্রহ করে একটি সঠিক মোবাইল বা হোয়াটসঅ্যাপ নম্বর দিন।' : lang === 'hi' ? 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।' : 'Please provide a valid Mobile / WhatsApp number.';
      }
      if (!formData.clientInfo.email?.trim() || !formData.clientInfo.email.includes('@')) {
        return lang === 'bn' ? 'অনুগ্রহ করে একটি সঠিক ইমেইল অ্যাড্রেস দিন।' : lang === 'hi' ? 'कृपया एक वैध ईमेल पता दर्ज करें।' : 'Please provide a valid Email address.';
      }
      if (!formData.clientInfo.city?.trim()) {
        return lang === 'bn' ? 'অনুগ্রহ করে আপনার শহর বা লোকেশন দিন।' : lang === 'hi' ? 'कृपया अपना शहर दर्ज करें।' : 'Please enter your City / Location.';
      }
    }
    if (stepIdx === 2) {
      if (!formData.businessDetails.specialties?.trim()) {
        return lang === 'bn' ? 'অনুগ্রহ করে আপনার মূল বিশেষত্ব বা অফারিংস লিখুন।' : lang === 'hi' ? 'कृपया अपनी मुख्य विशेषताएं या आइटम दर्ज करें।' : 'Please enter your brand signature offerings & specialties.';
      }
    }
    if (stepIdx === 3) {
      if (!formData.selectedPages || formData.selectedPages.length === 0) {
        return lang === 'bn' ? 'অনুগ্রহ করে কমপক্ষে ১ টি প্রয়োজনীয় পেজ বেছে নিন।' : lang === 'hi' ? 'कृपया कम से कम 1 पेज चुनें।' : 'Please select at least 1 required website page.';
      }
    }
    if (stepIdx === 4) {
      if (!formData.selectedFeatures || formData.selectedFeatures.length === 0) {
        return lang === 'bn' ? 'অনুগ্রহ করে কমপক্ষে ১ টি মূল ফিচার বেছে নিন।' : lang === 'hi' ? 'कृपया कम से कम 1 मुख्य फीचर चुनें।' : 'Please select at least 1 core feature.';
      }
    }
    if (stepIdx === 5) {
      if (!formData.paymentMethods || formData.paymentMethods.length === 0) {
        return lang === 'bn' ? 'অনুগ্রহ করে পেমেন্ট মেথড বেছে নিন।' : lang === 'hi' ? 'कृपया पेमेंट विकल्प चुनें।' : 'Please select at least 1 payment method.';
      }
    }
    if (stepIdx === 6) {
      if (!formData.adminPanelType) {
        return lang === 'bn' ? 'অনুগ্রহ করে এডমিন প্যানেল টাইপ বেছে নিন।' : lang === 'hi' ? 'कृपया एडमिन पैनल चुनें।' : 'Please choose an admin panel option.';
      }
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep(currentStepIndex);
    if (err) {
      setErrorMessage(err);
      toast.error(err);
      return;
    }

    setErrorMessage('');
    const nextStep = currentStepIndex + 1;
    if (nextStep < t.steps.length) {
      setCurrentStepIndex(nextStep);
      setMaxReachedStep((prev) => Math.max(prev, nextStep));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const jumpToStep = (targetIndex) => {
    if (targetIndex > maxReachedStep) {
      toast.warning(lang === 'bn' ? `অনুগ্রহ করে ধাপ ${currentStepIndex + 1} পূরণ করে সামনে এগিয়ে যান।` : lang === 'hi' ? `कृपया आगे बढ़ने से पहले चरण ${currentStepIndex + 1} पूरा करें।` : `Please complete Step ${currentStepIndex + 1} before proceeding forward.`);
      return;
    }
    setErrorMessage('');
    setCurrentStepIndex(targetIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success(lang === 'bn' ? 'ফর্মের লিংক কপি হয়েছে! ক্লায়েন্টকে পাঠান 🔗' : lang === 'hi' ? 'फॉर्म लिंक कॉपी हुआ! क्लाइंट को भेजें 🔗' : 'Form link copied to clipboard! Share it with your client. 🔗');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleMultiImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (selectedFileObjects.length + files.length > 20) {
      toast.error('You can attach up to 20 photos in total.');
      return;
    }

    setSelectedFileObjects((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const previewUrl = URL.createObjectURL(f);
      setFormData((prev) => ({
        ...prev,
        uploadedImages: [...(prev.uploadedImages || []), previewUrl]
      }));
    });
    toast.success(`${files.length} photo(s) selected! 📸`);
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedFileObjects((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setFormData((prev) => ({
      ...prev,
      uploadedImages: (prev.uploadedImages || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Open AI Step Summary & Guide Modal
  const handleOpenStepAiSummary = (stepIdx = currentStepIndex) => {
    setAiModalStepIndex(stepIdx);
    setAiModalTab('step');
    setAiModalLang(lang || 'bn');
    setIsAiModalOpen(true);
  };

  // Switch Active Language inside the AI Modal
  const handleSwitchAiModalLang = (targetLang) => {
    setAiModalLang(targetLang);
    toast.info(
      targetLang === 'bn'
        ? '🇧🇩 বাংলা অনুবাদ সক্রিয় করা হয়েছে'
        : targetLang === 'hi'
        ? '🇮🇳 हिंदी अनुवाद सक्रिय किया गया'
        : '🌐 English Translation Active'
    );
  };

  // Copy AI Summary from Modal (supports both Step Guide & Full Scope)
  const handleCopyModalSummary = () => {
    if (aiModalTab === 'step') {
      const currentGuide = STEP_AI_GUIDES[aiModalStepIndex] || STEP_AI_GUIDES[0];
      const selection = getCurrentStepSelectionText(aiModalStepIndex, formData, aiModalLang);
      const plainText = formatStepSummaryPlainText(currentGuide, selection, aiModalLang, aiModalStepIndex + 1);
      navigator.clipboard.writeText(plainText);
      setCopiedAi(true);
      toast.success(
        aiModalLang === 'bn'
          ? `ধাপ ${aiModalStepIndex + 1} এর AI সারসংক্ষেপ কপি হয়েছে!`
          : aiModalLang === 'hi'
          ? `चरण ${aiModalStepIndex + 1} का AI सारांश कॉपी हुआ!`
          : `Step ${aiModalStepIndex + 1} AI summary copied to clipboard!`
      );
      setTimeout(() => setCopiedAi(false), 3000);
    } else {
      navigator.clipboard.writeText(aiSummary || displayedAiSummary);
      setCopiedAi(true);
      toast.success(
        aiModalLang === 'bn'
          ? 'সম্পূর্ণ প্রজেক্ট AI সামারি ক্লিপবোর্ডে কপি হয়েছে!'
          : aiModalLang === 'hi'
          ? 'AI सारांश कॉपी हुआ!'
          : 'AI Summary copied to clipboard!'
      );
      setTimeout(() => setCopiedAi(false), 3000);
    }
  };

  // AI Executive Summary Generator with Progressive Delay & Typewriter Stream
  const handleGenerateAiSummary = async () => {
    setIsGeneratingAi(true);
    setIsAiModalOpen(true);
    setAiModalTab('full');
    setDisplayedAiSummary('');
    setAiAnalysisStage(1);

    // Realistic progressive analysis stage delay
    await new Promise((r) => setTimeout(r, 600));
    setAiAnalysisStage(2);
    await new Promise((r) => setTimeout(r, 600));
    setAiAnalysisStage(3);
    await new Promise((r) => setTimeout(r, 500));

    let finalAiText = '';
    const activeLang = aiModalLang || lang;

    if (activeLang === 'bn') {
      finalAiText = `### 🎯 AI এক্সিকিউটিভ প্রজেক্ট স্কোপ ও রূপরেখা
**ব্র্যান্ডের নাম:** ${formData.clientInfo.businessName || 'নূতন কমার্শিয়াল এন্টারপ্রাইজ'}
**ইন্ডাস্ট্রি টাইপ:** ${formData.websiteTypeName}
**টার্গেট ডেলিভারি:** ${formData.timeline}

#### 🛠️ রিকমেন্ডেড ফুল-স্ট্যাক আর্কিটেকচার
- **ফ্রন্টএন্ড:** React 19 + Vite (অথবা Next.js 15 App Router) সাথে TailwindCSS এবং Framer Motion লিকুইড এনিমেশন।
- **ব্যাকএন্ড ও ডেটাবেজ:** Node.js Express হাই-পারফরম্যান্স REST API সাথে MongoDB ক্লাউড ক্লাস্টার এবং JWT সিকিউরিটি।
- **পেমেন্ট গেটওয়ে:** ${formData.paymentMethods.join(', ')} সাথে অটোমেটেড GST ট্যাক্স ইনভয়েস জেনারেটর।
- **নোটিফিকেশন ইঞ্জিন:** ইনস্ট্যান্ট হোয়াটসঅ্যাপ ক্লাউড API ওয়েবহুক ও SMTP অটোমেটেড রিসিপ্ট সেন্ডার।

#### ⚡ উচ্চ কনভার্সন অপ্টিমাইজেশন ও ফিচারসমূহ
- **মূল ফিচারসমূহ:** ${formData.selectedFeatures.slice(0, 4).join(', ')}
- **পেজ স্ট্রাকচার:** ${formData.selectedPages.slice(0, 5).join(' ➔ ')}
- **গতি ও এসইও:** সাব-সেকেন্ড পেজ রেন্ডারিং, JSON-LD স্কিমা এবং ১০০/১০০ কোর ওয়েব ভাইটালস স্পিড স্কোর।

#### ⏱️ মাইলস্টোন ডেলিভারি ও স্প্রিন্ট পরিকল্পনা
- **ফেজ ১ (দিন ১-২):** ভিজ্যুয়াল UI/UX ওয়্যারফ্রেম ও ইন্টারেক্টিভ প্রোটোটাইপ ডিজাইন।
- **ফেজ ২ (দিন ৩-৪):** ফুল-স্ট্যাক কোড ইমপ্লিমেন্টেশন, পেমেন্ট গেটওয়ে স্যান্ডবক্স ও CMS কনফিগারেশন।
- **ফেজ ৩ (ফাইনাল ডেলিভারি):** টেকনিক্যাল এসইও অডিট, স্পিড অপ্টিমাইজেশন এবং লাইভ DNS লঞ্চ।`;
    } else if (activeLang === 'hi') {
      finalAiText = `### 🎯 AI कार्यकारी प्रोजेक्ट स्कोप और रोडमैप
**ब्रांड का नाम:** ${formData.clientInfo.businessName || 'व्यावसायिक उद्यम'}
**उद्योग प्रकार:** ${formData.websiteTypeName}
**लक्षित डिलीवरी:** ${formData.timeline}

#### 🛠️ अनुशंसित आधुनिक फुल-स्टैक आर्किटेक्चर
- **फ्रंटएंड:** React 19 + Vite (या Next.js 15) साथ में TailwindCSS और Framer Motion लिक्विड एनिमेशन।
- **बैकएंड और डेटाबेस:** Node.js Express API साथ में सुरक्षित MongoDB क्लाउड क्लस्टर और JWT प्रमाणीकरण।
- **पेमेंट गेटवे:** ${formData.paymentMethods.join(', ')} साथ में स्वचालित GST इनवॉइस।
- **सूचनाएं:** त्वरित व्हाट्सएप क्लाउड API और स्वचालित रसीद ईमेल।

#### ⚡ मुख्य फीचर्स और विकास रणनीति
- **प्रमुख मॉडयूल:** ${formData.selectedFeatures.slice(0, 4).join(', ')}
- **पेज संरचना:** ${formData.selectedPages.slice(0, 5).join(' ➔ ')}
- **स्पीड और एसईओ:** 1 सेकंड से कम लोडिंग, गूगल स्कीमा मार्कअप और 100/100 कोर वेब वाइटल्स।

#### ⏱️ चरणबद्ध डिलीवरी और टर्नअराउंड
- **चरण 1 (दिन 1-2):** UI/UX डिजाइन और प्रोटोटाइप समीक्षा।
- **चरण 2 (दिन 3-4):** फुल-स्टैक कोडिंग, पेमेंट गेटवे और CMS सेटअप।
- **चरण 3 (अंतिम लॉन्च):** एसईओ ऑडिट, स्पीड टेस्टिंग और लाइव डोमेन लॉन्च।`;
    } else {
      finalAiText = `### 🎯 Executive Project Scope & Strategic Architecture
**Brand:** ${formData.clientInfo.businessName || 'Commercial Enterprise'}
**Industry Focus:** ${formData.websiteTypeName}
**Target Delivery:** ${formData.timeline}

#### 🛠️ Recommended Modern Full-Stack Architecture
- **Frontend Layer:** React 19 + Vite (or Next.js 15 App Router) with TailwindCSS & Framer Motion liquid physics.
- **Backend & Database:** Node.js Express high-speed API with MongoDB cloud clusters and JWT auth protection.
- **Commerce & Billing:** ${formData.paymentMethods.join(', ')} integration with automated GST tax invoicing.
- **Alert Dispatcher:** Instant WhatsApp Cloud API webhooks & SMTP automated receipt dispatch.

#### ⚡ Conversion Optimization & High-Impact Features
- **Key Modules:** ${formData.selectedFeatures.slice(0, 4).join(', ')}
- **Sitemap Architecture:** ${formData.selectedPages.slice(0, 5).join(' ➔ ')}
- **Speed & SEO:** Sub-second server rendering, JSON-LD Schema rich snippets, and 100/100 Core Web Vitals.

#### ⏱️ Turnaround & Milestone Delivery Sprint
- **Phase 1 (Days 1-2):** Visual UI/UX Figma wireframes & interactive client prototype.
- **Phase 2 (Days 3-4):** Full-stack code implementation, payment sandbox, and CMS staging.
- **Phase 3 (Final Delivery):** Technical SEO audit, speed benchmarking, and DNS launch.`;
    }

    setAiSummary(finalAiText);
    setAiAnalysisStage(4);
    setIsGeneratingAi(false);

    // Progressive Word-by-Word Typewriter Streaming Effect
    let currentIdx = 0;
    const words = finalAiText.split(' ');
    const interval = setInterval(() => {
      if (currentIdx < words.length) {
        currentIdx += 3;
        setDisplayedAiSummary(words.slice(0, currentIdx).join(' '));
      } else {
        setDisplayedAiSummary(finalAiText);
        clearInterval(interval);
      }
    }, 25);
  };

  const handleFinalSubmit = async () => {
    // Validate all steps from 0 to 11 before submitting
    for (let i = 0; i < t.steps.length - 1; i++) {
      const err = validateStep(i);
      if (err) {
        setCurrentStepIndex(i);
        setErrorMessage(err);
        toast.error(err);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      let finalUploadedUrls = (formData.uploadedImages || []).filter((u) => typeof u === 'string' && u.startsWith('http'));

      if (selectedFileObjects.length > 0) {
        const uploadToastId = toast.loading(`Uploading ${selectedFileObjects.length} photo(s) to cloud storage... ⏳`);
        const data = new FormData();
        selectedFileObjects.forEach((f) => {
          data.append('images', f);
          data.append('image', f);
        });

        try {
          const uploadRes = await api.post('/upload', data);
          if (uploadRes && uploadRes.success && (uploadRes.urls || uploadRes.url)) {
            const newUrls = uploadRes.urls || [uploadRes.url];
            finalUploadedUrls = [...finalUploadedUrls, ...newUrls];
            toast.update(uploadToastId, {
              render: `${selectedFileObjects.length} photo(s) uploaded successfully! ☁️`,
              type: 'success',
              isLoading: false,
              autoClose: 2000
            });
          }
        } catch (uploadErr) {
          console.warn('Upload warning:', uploadErr.message);
        }
      }

      // Structure rich answers dictionary for MongoDB & Admin inspect modal
      const answersMap = {
        ...formData.businessDetails,
        specialties: formData.businessDetails?.specialties || '',
        operatingHours: formData.businessDetails?.operatingHours || '',
        designStyle: formData.designStyle,
        preferredColors: formData.preferredColors,
        referenceUrls: formData.referenceUrls,
        domainStatus: formData.domainStatus,
        timeline: formData.timeline,
        budget: formData.budget,
        adminPanelType: formData.adminPanelType,
        selectedPages: formData.selectedPages,
        selectedFeatures: formData.selectedFeatures,
        paymentMethods: formData.paymentMethods,
        whatsappOptions: formData.whatsappOptions
      };

      const payload = {
        ...formData,
        answers: answersMap,
        images: finalUploadedUrls,
        uploadedImages: finalUploadedUrls,
        aiExecutiveSummary: aiSummary || undefined
      };

      // Single atomic submission with direct email and admin alerts
      const targetEndpoint = formData.requirementId ? `/requirements/${formData.requirementId}/submit` : '/requirements/submit';
      const submitRes = await api.post(targetEndpoint, payload);

      if (submitRes && submitRes.success) {
        const orderData = submitRes.requirement || { requirementId: submitRes.requirementId || formData.requirementId };
        setSubmittedData(orderData);
        try {
          localStorage.removeItem('l2b_get_started_step');
          localStorage.removeItem('l2b_get_started_max_step');
          localStorage.removeItem('l2b_get_started_autosave_v2');
        } catch (e) {}
        toast.success(lang === 'bn' ? 'প্রজেক্ট রিকোয়ারমেন্টস সফলভাবে জমা হয়েছে! 🚀' : lang === 'hi' ? 'आवश्यकताएं सफलतापूर्वक सबमिट की गईं! 🚀' : 'Project requirements submitted successfully! 🚀');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(submitRes?.message || 'Failed to submit requirements');
        toast.error(submitRes?.message || 'Failed to submit requirements');
      }
    } catch (err) {
      console.error('Final submit error:', err);
      const msg = err.data?.message || err.message || 'Network error submitting requirements';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fe] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white relative overflow-x-hidden transition-colors duration-300">
      
      {/* Dynamic Ambient Background Art Craft with Soft Light Glass Accents */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-gradient-to-tr from-purple-400/20 to-pink-400/20 dark:from-purple-600/15 dark:to-pink-600/10 blur-[130px] rounded-full animate-pulse-glow" />
        <div className="absolute top-1/3 -right-32 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-br from-blue-400/20 to-indigo-400/15 dark:from-blue-600/10 dark:to-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute -bottom-20 left-10 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-gradient-to-tr from-emerald-400/15 to-teal-400/15 dark:from-emerald-600/10 dark:to-teal-600/10 blur-[130px] rounded-full" />
      </div>

      {/* 1. DISTRACTION-FREE MINIMALIST PRO HEADER */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border-b border-slate-200/70 dark:border-slate-800/80 px-3 sm:px-8 py-3 flex items-center justify-between gap-3 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] dark:shadow-none">
        
        {/* Left: Back to Home & Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-600 dark:hover:text-purple-400 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.backToHome}</span>
          </Link>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-black tracking-tight text-sm hidden md:inline bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
              LOCAL<span className="text-purple-600">2</span>BRAND
            </span>
          </Link>
        </div>

        {/* Center: Live Step Progress Badge & Live Autosave Status */}
        {!submittedData && (
          <div className="flex items-center gap-2 text-center">
            <span className="text-[11px] sm:text-xs font-mono font-black text-purple-700 dark:text-purple-300 bg-purple-50/90 dark:bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-200/90 dark:border-purple-800 shadow-2xs">
              {currentStepIndex + 1}/{t.steps.length}
            </span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 hidden xs:inline truncate max-w-[130px] sm:max-w-none">
              {t.steps[currentStepIndex].title}
            </span>
            {lastSavedTime && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hidden md:inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Autosaved {lastSavedTime}</span>
              </span>
            )}
          </div>
        )}

        {/* Right: Language Translator, AI Trigger, Share Link & Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Multi-Language Translator Dropdown Pill */}
          <div className="p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center gap-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => changeLanguage('en')}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => changeLanguage('bn')}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                lang === 'bn'
                  ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="বাংলা"
            >
              বাং
            </button>
            <button
              type="button"
              onClick={() => changeLanguage('hi')}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                lang === 'hi'
                  ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="हिंदी"
            >
              हिं
            </button>
          </div>

          {/* Reset / Clear Form Button */}
          {!submittedData && (
            <button
              type="button"
              onClick={handleResetForm}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title={lang === 'bn' ? 'ফর্ম রিসেট করুন (নতুন করে শুরু করুন)' : 'Reset and clear form'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Share Link Button */}
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-50/90 dark:bg-purple-950/80 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200/90 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Copy requirement form link to send directly to clients"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{copiedLink ? t.copiedLink : t.shareForm}</span>
          </button>

          <ThemeToggle />
        </div>
      </header>

      {/* 2. SLIM SMOOTH PROGRESS BAR */}
      {!submittedData && (
        <div className="w-full bg-slate-200/60 dark:bg-slate-800/60 h-1 relative overflow-hidden">
          <div
            className="h-full l2b-gradient-bg transition-all duration-500 ease-out shadow-xs"
            style={{ width: `${((currentStepIndex + 1) / t.steps.length) * 100}%` }}
          />
        </div>
      )}

      {/* 3. MAIN FORM BODY */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 flex flex-col justify-between">
        
        {/* POST-SUBMISSION SUCCESS SCREEN */}
        {submittedData ? (
          <div className="max-w-2xl mx-auto my-auto p-6 sm:p-12 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(168,85,247,0.15)] text-center space-y-6 animate-in zoom-in-95 backdrop-blur-xl">
            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{lang === 'bn' ? 'প্রজেক্ট প্রপোজাল রেজিস্টার্ড হয়েছে' : lang === 'hi' ? 'प्रोजेक्ट प्रस्ताव पंजीकृत हुआ' : 'Project Proposal Registered'}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {lang === 'bn' ? 'রিকোয়ারমেন্টস সফলভাবে জমা হয়েছে! 🎉' : lang === 'hi' ? 'आवश्यकताएं सफलतापूर्वक सबमिट की गईं! 🎉' : 'Requirements Submitted Successfully! 🎉'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
                Thank you, <strong>{formData.clientInfo.businessName || 'Valued Client'}</strong>. Our lead developers will review your custom specifications and contact you shortly.
              </p>
            </div>

            {/* Tracking ID Box */}
            <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/50 border-2 border-purple-200 dark:border-purple-800/80 flex items-center justify-between gap-3 shadow-sm">
              <div className="text-left">
                <span className="text-[10px] font-extrabold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">
                  Requirement Tracking ID
                </span>
                <span className="font-mono font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  {submittedData.requirementId || formData.requirementId || 'L2B-REQ-PENDING'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(submittedData.requirementId || formData.requirementId);
                  setCopiedId(true);
                  toast.success('Tracking ID copied!');
                  setTimeout(() => setCopiedId(false), 3000);
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
              </button>
            </div>

            {/* Follow-up Note Card */}
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-left text-xs text-amber-950 dark:text-amber-200 space-y-1.5 shadow-2xs">
              <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <Clock className="w-4 h-4" />
                <span>{lang === 'bn' ? 'পরবর্তী পদক্ষেপ ও পেমেন্ট বিবরণ' : lang === 'hi' ? 'अगला कदम और भुगतान विवरण' : 'Next Milestones & Contact'}</span>
              </div>
              <p className="leading-relaxed text-[11px] sm:text-xs">
                {lang === 'bn' 
                  ? `আমাদের লিড ইঞ্জিনিয়ার আপনার সাথে ফোন বা হোয়াটসঅ্যাপে (${formData.clientInfo.mobile}) অথবা ইমেইলে (${formData.clientInfo.email}) যোগাযোগ করে ডিজাইন ও পেমেন্ট কনফার্ম করবেন।`
                  : lang === 'hi'
                  ? `हमारे इंजीनियर आपसे फोन/व्हाट्सएप (${formData.clientInfo.mobile}) या ईमेल (${formData.clientInfo.email}) पर संपर्क करके डिजाइन और भुगतान की पुष्टि करेंगे।`
                  : `Our engineer will contact you via Phone/WhatsApp (${formData.clientInfo.mobile}) or Email (${formData.clientInfo.email}) to confirm design deliverables and payment milestones.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 text-center active:scale-95 transition-all"
              >
                📊 Go to Client Dashboard
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-center"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 flex-1 flex flex-col justify-between">
            
            {/* Step Pills Bar with Smooth Horizontal Touch Scroll & Strict Lock */}
            <div
              ref={stepScrollContainerRef}
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none snap-x touch-pan-x"
            >
              {t.steps.map((s, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;
                const isLocked = idx > maxReachedStep;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => jumpToStep(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all duration-200 cursor-pointer shrink-0 snap-center active:scale-95 ${
                      isActive
                        ? 'l2b-gradient-bg text-white shadow-md ring-2 ring-purple-400/30 scale-102 font-black'
                        : isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : isLocked
                        ? 'bg-slate-100/80 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 border border-slate-200/60 dark:border-slate-800 cursor-not-allowed opacity-60'
                        : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 shadow-2xs'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : isLocked ? (
                      <Lock className="w-3 h-3 text-slate-400" />
                    ) : (
                      <span className="font-mono text-[10px] opacity-70">#{idx + 1}</span>
                    )}
                    <span>{s.short}</span>
                  </button>
                );
              })}
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50/90 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2 animate-shake shadow-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* MAIN STEP CARD CONTAINER */}
            <div className="p-5 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none backdrop-blur-2xl">
              
              {/* STEP 1: CATEGORY SELECTION */}
              {currentStepIndex === 0 && (
                <div className="space-y-6 animate-fade-in">
                  <StepHeader
                    stepIdx={0}
                    title={lang === 'bn' ? 'আপনি কোন ধরণের ওয়েবসাইট তৈরি করতে চান?' : lang === 'hi' ? 'आप किस प्रकार की वेबसाइट बनाना चाहते हैं?' : 'What Type of Website or Business are We Building?'}
                    t={t}
                    lang={lang}
                    onOpenAiSummary={handleOpenStepAiSummary}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {INDUSTRY_CATEGORIES.map((cat) => {
                      const isSelected = formData.websiteType === cat.slug;
                      const IconComp = cat.icon;
                      const itemText = cat[lang] || cat.en;

                      return (
                        <div
                          key={cat.slug}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              websiteType: cat.slug,
                              websiteTypeName: itemText.name
                            })
                          }
                          className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between relative group ${
                            isSelected
                              ? 'bg-gradient-to-b from-purple-50/80 to-white dark:from-purple-950/40 dark:to-slate-900 border-2 border-purple-600 shadow-[0_8px_25px_rgba(168,85,247,0.2)] scale-102 ring-2 ring-purple-400/20'
                              : 'bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md hover:bg-white dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                            isSelected
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border border-slate-200/80 dark:border-slate-700'
                          }`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between">
                              <span>{itemText.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {itemText.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: BUSINESS & CONTACT CREDENTIALS */}
              {currentStepIndex === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <StepHeader
                    stepIdx={1}
                    title={lang === 'bn' ? 'আপনার ব্র্যান্ড ও যোগাযোগের বিবরণ দিন' : lang === 'hi' ? 'अपने ब्रांड और संपर्क विवरण भरें' : 'Tell Us About Your Brand & Contact Details'}
                    t={t}
                    lang={lang}
                    onOpenAiSummary={handleOpenStepAiSummary}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Input Field: Business Name */}
                    <div className="space-y-1">
                      <label className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-purple-600" />
                        <span>{lang === 'bn' ? 'ব্যবসার নাম *' : lang === 'hi' ? 'बिजनेस का नाम *' : 'Business / Brand Name *'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientInfo.businessName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientInfo: { ...formData.clientInfo, businessName: e.target.value }
                          })
                        }
                        placeholder="e.g. Royal Nawabi Dining / Aura Luxe Salon"
                        className="w-full p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/20 transition-all shadow-2xs"
                      />
                    </div>

                    {/* Input Field: Founder Name */}
                    <div className="space-y-1">
                      <label className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-600" />
                        <span>{lang === 'bn' ? 'প্রতিষ্ঠাতা / মালিকের নাম *' : lang === 'hi' ? 'मालिक / संस्थापक का नाम *' : 'Owner / Founder Name *'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientInfo.ownerName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientInfo: { ...formData.clientInfo, ownerName: e.target.value }
                          })
                        }
                        placeholder="e.g. Rahul Sharma"
                        className="w-full p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/20 transition-all shadow-2xs"
                      />
                    </div>

                    {/* Input Field: WhatsApp Phone */}
                    <div className="space-y-1">
                      <label className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপ / মোবাইল নম্বর *' : lang === 'hi' ? 'व्हाट्सएप / मोबाइल नंबर *' : 'WhatsApp / Mobile Number *'}</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.clientInfo.mobile}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientInfo: { ...formData.clientInfo, mobile: e.target.value }
                          })
                        }
                        placeholder="e.g. +91 98765 43210"
                        className="w-full p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/20 transition-all shadow-2xs font-mono"
                      />
                    </div>

                    {/* Input Field: Email Address */}
                    <div className="space-y-1">
                      <label className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                        <span>{lang === 'bn' ? 'ইমেইল অ্যাড্রেস *' : lang === 'hi' ? 'ईमेल पता *' : 'Email Address *'}</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.clientInfo.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientInfo: { ...formData.clientInfo, email: e.target.value }
                          })
                        }
                        placeholder="e.g. contact@royalnawabi.com"
                        className="w-full p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/20 transition-all shadow-2xs font-mono"
                      />
                    </div>

                    {/* Input Field: City */}
                    <div className="space-y-1">
                      <label className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-amber-500" />
                        <span>{lang === 'bn' ? 'শহর / লোকেশন *' : lang === 'hi' ? 'शहर / स्थान *' : 'City / Region *'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientInfo.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientInfo: { ...formData.clientInfo, city: e.target.value }
                          })
                        }
                        placeholder="e.g. Kolkata, Bangalore, Mumbai"
                        className="w-full p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/20 transition-all shadow-2xs"
                      />
                    </div>

                    {/* Input Field: Existing Website */}
                    <div className="space-y-1">
                      <label className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-purple-500" />
                        <span>{lang === 'bn' ? 'বর্তমান ওয়েবসাইট (যদি থাকে)' : lang === 'hi' ? 'वर्तमान वेबसाइट (यदि हो)' : 'Existing Website (if redesigning)'}</span>
                      </label>
                      <input
                        type="url"
                        value={formData.clientInfo.existingWebsite}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientInfo: { ...formData.clientInfo, existingWebsite: e.target.value }
                          })
                        }
                        placeholder="https://..."
                        className="w-full p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/20 transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: INDUSTRY SPECIFIC DYNAMIC QUESTIONS */}
              {currentStepIndex === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <StepHeader
                    stepIdx={2}
                    title={lang === 'bn' ? 'ইন্ডাস্ট্রি স্পেসিফিকেশন ও অপশন *' : lang === 'hi' ? 'उद्योग विशिष्ट विकल्प *' : 'Industry Specifications & Custom Parameters *'}
                    t={t}
                    lang={lang}
                    onOpenAiSummary={handleOpenStepAiSummary}
                  />

                  <div className="space-y-4">
                    {/* Common Industry Field: Specialties */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                      <label className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 block">
                        {lang === 'bn' ? 'আপনার ব্র্যান্ডের মূল বিশেষত্ব বা সিগনেচার আইটেম *' : lang === 'hi' ? 'आपके ब्रांड की मुख्य विशेषताएं या सिग्नेचर आइटम *' : 'Brand Signature Offerings & Specialties *'}
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formData.businessDetails.specialties || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessDetails: {
                              ...formData.businessDetails,
                              specialties: e.target.value
                            }
                          })
                        }
                        placeholder={lang === 'bn' ? 'যেমন: দম বিরিয়ানি, ব্রাইডাল মেকআপ, লাক্সারি স্যুইট' : lang === 'hi' ? 'उदा: दम बिरयानी, ब्राइडल मेकअप, लग्जरी रूम' : 'e.g. Special Dum Biryani / Bridal Glow Package / Luxury Suite Room'}
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                      />
                    </div>

                    {/* Common Industry Field: Service Timing */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                      <label className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 block">
                        {lang === 'bn' ? 'কাজের সময় / অপারেটিং আওয়ার্স' : lang === 'hi' ? 'खुलने का समय / टाइमिंग' : 'Operating Hours & Service Timing'}
                      </label>
                      <input
                        type="text"
                        value={formData.businessDetails.operatingHours || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessDetails: {
                              ...formData.businessDetails,
                              operatingHours: e.target.value
                            }
                          })
                        }
                        placeholder={lang === 'bn' ? 'যেমন: সকাল ১০ টা - রাত ১০ টা (প্রতিদিন)' : lang === 'hi' ? 'उदा: सुबह 10:00 से रात 10:00 तक' : 'e.g. 10:00 AM - 10:00 PM (All 7 Days)'}
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: PAGES & SITEMAP */}
              {currentStepIndex === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <StepHeader
                    stepIdx={3}
                    title={lang === 'bn' ? 'প্রয়োজনীয় পেজ ও নেভিগেশন স্ট্রাকচার বেছে নিন' : lang === 'hi' ? 'आवश्यक पेज और वेबसाइट संरचना चुनें' : 'Select Required Pages & Navigation Structure'}
                    t={t}
                    lang={lang}
                    onOpenAiSummary={handleOpenStepAiSummary}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {MULTI_PAGES.map((pageObj) => {
                      const pageTitle = pageObj[lang] || pageObj.en;
                      const isChecked = formData.selectedPages.includes(pageObj.en);

                      return (
                        <label
                          key={pageObj.id}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer text-xs font-bold transition-all ${
                            isChecked
                              ? 'bg-purple-50/90 dark:bg-purple-950/70 border-purple-500 text-purple-950 dark:text-purple-200 shadow-2xs scale-101'
                              : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const nextPages = e.target.checked
                                  ? [...formData.selectedPages, pageObj.en]
                                  : formData.selectedPages.filter((p) => p !== pageObj.en);
                                setFormData({ ...formData, selectedPages: nextPages });
                              }}
                              className="w-4 h-4 rounded text-purple-600"
                            />
                            <span>{pageTitle}</span>
                          </div>
                          {isChecked && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: CORE FEATURES */}
              {currentStepIndex === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <StepHeader
                    stepIdx={4}
                    title={lang === 'bn' ? 'এডভান্সড ফিচার ও কনভার্সন মডিউল' : lang === 'hi' ? 'उन्नत फीचर्स और रूपांतरण मॉड्यूल' : 'Advanced Business & Conversion Features'}
                    t={t}
                    lang={lang}
                    onOpenAiSummary={handleOpenStepAiSummary}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {MULTI_FEATURES.map((featObj) => {
                      const featTitle = featObj[lang] || featObj.en;
                      const isChecked = formData.selectedFeatures.includes(featObj.en);

                      return (
                        <label
                          key={featObj.id}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer text-xs font-bold transition-all ${
                            isChecked
                              ? 'bg-purple-50/90 dark:bg-purple-950/70 border-purple-500 text-purple-950 dark:text-purple-200 shadow-2xs scale-101'
                              : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const nextFeats = e.target.checked
                                  ? [...formData.selectedFeatures, featObj.en]
                                  : formData.selectedFeatures.filter((f) => f !== featObj.en);
                                setFormData({ ...formData, selectedFeatures: nextFeats });
                              }}
                              className="w-4 h-4 rounded text-purple-600"
                            />
                            <span>{featTitle}</span>
                          </div>
                          {isChecked && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 6: PAYMENT GATEWAYS */}
              {currentStepIndex === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <StepHeader
                    stepIdx={5}
                    title={lang === 'bn' ? 'পেমেন্ট গেটওয়ে ও বিলিং পদ্ধতি' : lang === 'hi' ? 'पेमेंट गेटवे और बिलिंग विकल्प' : 'Payment Gateway & Billing Options'}
                    t={t}
                    lang={lang}
                    onOpenAiSummary={handleOpenStepAiSummary}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {MULTI_PAYMENTS.map((methodObj) => {
                      const methodTitle = methodObj[lang] || methodObj.en;
                      const isChecked = formData.paymentMethods.includes(methodObj.en);

                      return (
                        <label
                          key={methodObj.id}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer text-xs font-bold transition-all ${
                            isChecked
                              ? 'bg-purple-50/90 dark:bg-purple-950/70 border-purple-500 text-purple-950 dark:text-purple-200 shadow-2xs'
                              : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const nextMethods = e.target.checked
                                  ? [...formData.paymentMethods, methodObj.en]
                                  : formData.paymentMethods.filter((m) => m !== methodObj.en);
                                setFormData({ ...formData, paymentMethods: nextMethods });
                              }}
                              className="w-4 h-4 rounded text-purple-600"
                            />
                            <span>{methodTitle}</span>
                          </div>
                          <CreditCard className="w-4 h-4 text-purple-500 shrink-0" />
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 7: ADMIN PANEL */}
              {currentStepIndex === 6 && (
                <div className="space-y-6 animate-fade-in">
                  <StepHeader
                    stepIdx={6}
                    title={lang === 'bn' ? 'এডমিন প্যানেল ও কন্টেন্ট ম্যানেজমেন্ট (CMS)' : lang === 'hi' ? 'एडमिन पैनल और सामग्री प्रबंधन (CMS)' : 'Admin Panel & Content Management System (CMS)'}
                    t={t}
                    lang={lang}
                    onOpenAiSummary={handleOpenStepAiSummary}
                  />

                  <div className="space-y-3">
                    {[
                      {
                        title: 'Full Dynamic Admin Panel',
                        en: { title: 'Full Dynamic Admin Panel', desc: 'Manage products, prices, leads, callbacks, and reviews yourself with 1-click password protected dashboard.' },
                        bn: { title: 'সম্পূর্ণ ডায়নামিক এডমিন প্যানেল', desc: 'প্রোডাক্ট, প্রাইস, বুকিং, লিড ও রিভিউ নিজে এডিট ও কন্ট্রোল করার পাসওয়ার্ড প্রটেক্টেড ড্যাশবোর্ড।' },
                        hi: { title: 'पूर्ण गतिशील व्यवस्थापक पैनल', desc: 'पासवर्ड संरक्षित डैशबोर्ड के साथ उत्पाद, मूल्य और लीड स्वयं प्रबंधित करें।' }
                      },
                      {
                        title: 'Turnkey Managed Care',
                        en: { title: 'Turnkey Managed Care', desc: 'LOCAL2BRAND handles all monthly updates, menu changes, and security backups for you.' },
                        bn: { title: 'টার্নকি ম্যানেজড কেয়ার', desc: 'LOCAL2BRAND আপনার সকল মাসিক মেনু আপডেট, সিকিউরিটি ও ক্লাউড ব্যাকআপ পরিচালনা করবে।' },
                        hi: { title: 'टर्नकी प्रबंधित सेवा', desc: 'LOCAL2BRAND आपके सभी मासिक अपडेट, मेनू और सुरक्षा बैकअप संभालेगा।' }
                      },
                      {
                        title: 'Static High-Speed Engine',
                        en: { title: 'Static High-Speed Engine', desc: 'Zero maintenance site, fastest speed, updates via WhatsApp request to developer.' },
                        bn: { title: 'স্ট্যাটিক হাই-স্পিড ইঞ্জিন', desc: 'জিরো মেইনটেন্যান্স সাইট, সর্বোচ্চ গতি, প্রয়োজনমত হোয়াটসঅ্যাপের মাধ্যমে আপডেট।' },
                        hi: { title: 'सुपर-फास्ट स्टेटिक इंजन', desc: 'शून्य रखरखाव, उच्चतम गति, डेवलपर के माध्यम से अपडेट।' }
                      }
                    ].map((panel) => {
                      const isSelected = formData.adminPanelType === panel.title;
                      const panelText = panel[lang] || panel.en;

                      return (
                        <div
                          key={panel.title}
                          onClick={() => setFormData({ ...formData, adminPanelType: panel.title })}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-purple-50/80 dark:bg-purple-950/40 border-2 border-purple-600 shadow-md ring-2 ring-purple-400/20'
                              : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-purple-300'
                          }`}
                        >
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                            <span>{panelText.title}</span>
                            {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {panelText.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 8: WHATSAPP & LEAD ALERTS */}
              {currentStepIndex === 7 && (
                <div className="space-y-6 animate-fade-in">
                  <StepHeader
                    stepIdx={7}
                    title={lang === 'bn' ? 'হোয়াটসঅ্যাপ ও ইমেইল লিড নোটিফিকেশন' : lang === 'hi' ? 'व्हाट्सएप और ईमेल लीड सूचनाएं' : 'WhatsApp & Email Lead Notifications'}
                    t={t}
                    lang={lang}
                    onOpenAiSummary={handleOpenStepAiSummary}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        id: 'float_wa',
                        en: 'WhatsApp Floating Quick Chat Button',
                        bn: 'হোয়াটসঅ্যাপ ফ্লোটিং কুইক চ্যাট বাটন',
                        hi: 'व्हाट्सएप फ्लोटिंग क्विक चैट बटन'
                      },
                      {
                        id: 'direct_order_wa',
                        en: 'Direct Order / Booking to WhatsApp with Pre-filled Payload',
                        bn: '১-ক্লিক ডিরেক্ট হোয়াটসঅ্যাপ বুকিং ও অর্ডার পেলোড',
                        hi: 'व्हाट्सएप पर डायरेक्ट प्री-फिल्ड ऑर्डर बुकिंग'
                      },
                      {
                        id: 'admin_email',
                        en: 'Instant Admin Email Alert for every submission',
                        bn: 'প্রতিটি নতুন সাবমিশনের জন্য ইনস্ট্যান্ট এডমিন ইমেইল এলার্ট',
                        hi: 'प्रत्येक सबमिशन पर त्वरित व्यवस्थापक ईमेल अलर्ट'
                      },
                      {
                        id: 'customer_receipt',
                        en: 'Automated Customer Confirmation Email & Receipt',
                        bn: 'গ্রাহকদের জন্য অটোমেটেড কনফার্মেশন ইমেইল ও রসিদ',
                        hi: 'स्वचालित ग्राहक पुष्टिकरण ईमेल और रसीद'
                      }
                    ].map((opt) => {
                      const optTitle = opt[lang] || opt.en;
                      const isChecked = formData.whatsappOptions.includes(opt.en);

                      return (
                        <label
                          key={opt.id}
                          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer text-xs font-bold transition-all ${
                            isChecked
                              ? 'bg-purple-50/90 dark:bg-purple-950/70 border-purple-500 text-purple-950 dark:text-purple-200 shadow-2xs'
                              : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const nextOpts = e.target.checked
                                  ? [...formData.whatsappOptions, opt.en]
                                  : formData.whatsappOptions.filter((x) => x !== opt.en);
                                setFormData({ ...formData, whatsappOptions: nextOpts });
                              }}
                              className="w-4 h-4 rounded text-purple-600"
                            />
                            <span>{optTitle}</span>
                          </div>
                          <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 9: DESIGN & COLOR PREFERENCES */}
              {currentStepIndex === 8 && (
                <div className="space-y-6 animate-fade-in">
                  <StepHeader
                    stepIdx={8}
                    title={lang === 'bn' ? 'ডিজাইন ও ভিজ্যুয়াল স্টাইল প্রেফারেন্স' : lang === 'hi' ? 'डिजाइन और दृश्य शैली की प्राथमिकताएं' : 'Design Aesthetics & Visual Style'}
                    t={t}
                    lang={lang}
                    onOpenAiSummary={handleOpenStepAiSummary}
                  />

                  <div className="space-y-4">
                    <div>
                      <label className="font-bold text-xs text-slate-800 dark:text-slate-200 block mb-1">
                        {lang === 'bn' ? 'ডিজাইন ল্যাঙ্গুয়েজ' : lang === 'hi' ? 'पसंदीदा डिजाइन शैली' : 'Preferred Design Language'}
                      </label>
                      <select
                        value={formData.designStyle}
                        onChange={(e) => setFormData({ ...formData, designStyle: e.target.value })}
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 shadow-2xs"
                      >
                        <option value="Modern Glassmorphic & Vibrant">Modern Liquid Glass & Vibrant Neon Accents</option>
                        <option value="Minimal Clean & Corporate">Minimalist, Clean White & High-Contrast</option>
                        <option value="Luxury Royal & Gold">Luxury Royal Dark Mode & Gold Foil Accents</option>
                        <option value="Playful & High-Energy">Playful, Bold Typography & Pastel Highlights</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-xs text-slate-800 dark:text-slate-200 block mb-1">
                        {lang === 'bn' ? 'পছন্দের ব্র্যান্ড কালারস' : lang === 'hi' ? 'पसंदीदा ब्रांड रंग' : 'Brand Colors / Palette'}
                      </label>
                      <input
                        type="text"
                        value={formData.preferredColors}
                        onChange={(e) => setFormData({ ...formData, preferredColors: e.target.value })}
                        placeholder="e.g. Royal Blue & Gold / Emerald Green & White"
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-xs text-slate-800 dark:text-slate-200 block mb-1">
                        {lang === 'bn' ? 'রেফারেন্স ওয়েবসাইট লিংক (অনুপ্রেরণা)' : lang === 'hi' ? 'संदर्भ वेबसाइट लिंक' : 'Reference Website Links (Inspirations)'}
                      </label>
                      <input
                        type="text"
                        value={formData.referenceUrls}
                        onChange={(e) => setFormData({ ...formData, referenceUrls: e.target.value })}
                        placeholder="e.g. apple.com, stripe.com, your competitor's link"
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 10: MEDIA & STORE PHOTOS */}
              {currentStepIndex === 9 && (
                <div className="space-y-6 animate-fade-in">
                  <StepHeader
                    stepIdx={9}
                    title={lang === 'bn' ? 'দোকান, শোরুম, প্রোডাক্ট বা লোগো ফটো (ঐচ্ছিক)' : lang === 'hi' ? 'दुकान, उत्पाद या लोगो की तस्वीरें (वैकल्पिक)' : 'Store Photos, Logo & Product Imagery (Optional)'}
                    t={t}
                    lang={lang}
                    onOpenAiSummary={handleOpenStepAiSummary}
                  />

                  <div className="p-6 sm:p-8 rounded-3xl border-2 border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 text-center space-y-3">
                    <UploadCloud className="w-10 h-10 text-purple-600 dark:text-purple-400 mx-auto animate-pulse" />
                    <div>
                      <label className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer hover:bg-purple-500 shadow-md inline-block transition-all active:scale-95">
                        {lang === 'bn' ? 'ছবি ব্রাউজ করুন (সর্বোচ্চ ২০ টি)' : lang === 'hi' ? 'तस्वीरें चुनें (अधिकतम 20)' : 'Browse Photos (Up to 20)'}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleMultiImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-slate-500 mt-1.5 font-medium">PNG, JPG, WEBP up to 10MB per file</p>
                    </div>
                  </div>

                  {formData.uploadedImages?.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {formData.uploadedImages.map((img, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden aspect-square border border-slate-200/90 dark:border-slate-800 shadow-2xs group">
                          <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100 cursor-pointer shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 11: DOMAIN & TIMELINE */}
              {currentStepIndex === 10 && (
                <div className="space-y-6 animate-fade-in">
                  <StepHeader
                    stepIdx={10}
                    title={lang === 'bn' ? 'ডোমেন, ক্লাউড হোস্টিং ও টার্গেট লঞ্চ টাইমলাইন' : lang === 'hi' ? 'डोमेन, क्लाउड होस्टिंग और टारगेट लॉन्च टाइमलाइन' : 'Domain, Cloud Hosting & Target Launch Timeline'}
                    t={t}
                    lang={lang}
                    onOpenAiSummary={handleOpenStepAiSummary}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-xs text-slate-800 dark:text-slate-200 block mb-1">
                        {lang === 'bn' ? 'ডোমেন নেম স্ট্যাটাস' : lang === 'hi' ? 'डोमेन नाम सेटअप' : 'Domain Name Setup'}
                      </label>
                      <select
                        value={formData.domainStatus}
                        onChange={(e) => setFormData({ ...formData, domainStatus: e.target.value })}
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 shadow-2xs"
                      >
                        <option value="Need New Domain (Free Included)">{lang === 'bn' ? 'নতুন ডোমেন প্রয়োজন (.com / .in ফ্রি অন্তর্ভুক্ত)' : lang === 'hi' ? 'नया डोमेन चाहिए (.com / .in शामिल)' : 'I need a new domain (.com / .in included free)'}</option>
                        <option value="Already Own Domain">{lang === 'bn' ? 'আমার নিজস্ব ডোমেন আছে' : lang === 'hi' ? 'मेरे पास पहले से डोमेन है' : 'I already have my domain registered'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-xs text-slate-800 dark:text-slate-200 block mb-1">
                        {lang === 'bn' ? 'টার্গেট ডেলিভারি সময়সীমা' : lang === 'hi' ? 'डिलीवरी समय सीमा' : 'Target Launch Timeline'}
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 shadow-2xs"
                      >
                        <option value="⚡ Express Delivery (48 - 72 Hours)">⚡ Express Fast-Track (48 - 72 Hours)</option>
                        <option value="Standard Launch (3 - 7 Days)">Standard Launch (3 - 7 Days)</option>
                        <option value="Flexible Timeline">Flexible Schedule</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 12: REVIEW & SUBMIT */}
              {currentStepIndex === 11 && (
                <div className="space-y-6 animate-fade-in">
                  <StepHeader
                    stepIdx={11}
                    title={lang === 'bn' ? 'রিকোয়ারমেন্টস রিভিউ ও প্রস্তাব জমা' : lang === 'hi' ? 'विवरण की समीक्षा और सबमिट करें' : 'Review Specifications & Submit Proposal'}
                    t={t}
                    lang={lang}
                    onOpenAiSummary={handleOpenStepAiSummary}
                  />

                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs sm:text-sm">
                          {t.generateAiSummary}
                        </h4>
                        <p className="text-[11px] text-white/80">
                          {t.aiSummaryDesc}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateAiSummary}
                      disabled={isGeneratingAi}
                      className="px-4 py-2 rounded-xl bg-white text-purple-950 font-black text-xs shadow-sm hover:bg-white/95 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>{isGeneratingAi ? 'Analyzing Architecture...' : t.generateAiSummary.replace('✨ ', '')}</span>
                    </button>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-4 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-200/70 dark:border-slate-800 pb-4">
                      <div>
                        <span className="text-slate-400 block font-bold text-[11px]">{lang === 'bn' ? 'ব্যবসার নাম' : lang === 'hi' ? 'बिजनेस का नाम' : 'Business Name'}</span>
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                          {formData.clientInfo.businessName || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold text-[11px]">{lang === 'bn' ? 'ক্যাটাগরি' : lang === 'hi' ? 'श्रेणी' : 'Industry Type'}</span>
                        <span className="font-black text-purple-600 dark:text-purple-400 text-sm">
                          {formData.websiteTypeName}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold text-[11px]">{lang === 'bn' ? 'হোয়াটসঅ্যাপ' : lang === 'hi' ? 'व्हाट्सएप' : 'WhatsApp'}</span>
                        <span className="font-black text-slate-900 dark:text-white text-sm font-mono">
                          {formData.clientInfo.mobile || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold text-[11px]">{lang === 'bn' ? 'টাইমলাইন' : lang === 'hi' ? 'टाइमलाइन' : 'Timeline'}</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                          {formData.timeline}
                        </span>
                      </div>
                    </div>

                    {formData.couponCode && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-amber-600" />
                          <span className="font-bold text-amber-950 dark:text-amber-200">
                            Coupon Applied: <strong className="font-mono">{formData.couponCode}</strong> ({formData.discountPercent}% OFF)
                          </span>
                        </div>
                        <span className="text-[11px] font-black text-amber-800 dark:text-amber-300">
                          Discount Active
                        </span>
                      </div>
                    )}

                    <div className="p-3.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 text-[11px] text-purple-900 dark:text-purple-200 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>
                        {lang === 'bn' 
                          ? 'সাবমিট করার পর আপনার রিয়েল-টাইম ডেলিভারি স্ট্যাটাস ও ইনভয়েস User Dashboard (/dashboard)-এ ট্র্যাক করতে পারবেন।'
                          : lang === 'hi'
                          ? 'सबमिट करने के बाद आप User Dashboard (/dashboard) में अपनी विकास स्थिति और इनवॉइस ट्रैक कर सकते हैं।'
                          : 'Track your milestone delivery, invoices, and source code anytime in your User Dashboard (/dashboard).'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="pt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentStepIndex === 0 || isSubmitting}
                onClick={handleBack}
                className="px-4 sm:px-5 py-3 rounded-2xl text-xs font-bold bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden xs:inline">{t.previous}</span>
              </button>

              <div className="text-[11px] font-bold text-slate-400 hidden sm:block">
                {t.stepLabel} {currentStepIndex + 1} of {t.steps.length}
              </div>

              {currentStepIndex < t.steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 sm:px-7 py-3 rounded-2xl text-xs sm:text-sm font-black text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <span>{t.continue}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="px-6 sm:px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? t.submitting : t.submit}</span>
                </button>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 5. AI ASSISTANT MODAL (STEP SUMMARY & EXECUTIVE SCOPE ROADMAP)            */}
      {/* ========================================================================= */}
      {isAiModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in overflow-y-auto"
          onClick={() => setIsAiModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden my-auto min-h-0 animate-in zoom-in-95"
          >
            {/* Modal Header */}
            <div className="p-3 sm:p-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shrink-0 shadow-md">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xs shrink-0">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h3 className="font-black text-xs sm:text-base truncate">
                      {aiModalLang === 'bn'
                        ? '✨ AI অ্যাসিস্ট্যান্ট ও গাইড'
                        : aiModalLang === 'hi'
                        ? '✨ AI सहायक व सारांश'
                        : '✨ AI Assistant & Guide'}
                    </h3>
                    <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-white/25 text-white shrink-0">
                      {aiModalTab === 'step' 
                        ? (aiModalLang === 'bn' ? `ধাপ ${aiModalStepIndex + 1}` : `Step ${aiModalStepIndex + 1}`)
                        : 'Executive'}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-white/85 truncate">
                    {aiModalTab === 'step'
                      ? (aiModalLang === 'bn' 
                          ? 'এই ধাপের প্রশ্ন ও সকল অপশনের সারসংক্ষেপ'
                          : 'Clear summary of questions, options & recommendations')
                      : (aiModalLang === 'bn'
                          ? 'নির্বাচিত টেক স্ট্যাক ও প্রজেক্ট রোডম্যাপ'
                          : 'Intelligent synthesis of your tech stack & roadmap')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
                {/* In-Modal Direct Language Switcher Pills */}
                <div className="p-0.5 rounded-xl bg-black/25 backdrop-blur-md flex items-center gap-0.5 border border-white/20 shadow-xs">
                  <button
                    type="button"
                    onClick={() => handleSwitchAiModalLang('bn')}
                    className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                      aiModalLang === 'bn'
                        ? 'bg-white text-purple-900 shadow-sm scale-102'
                        : 'text-white/80 hover:text-white'
                    }`}
                    title="বাংলায় অনুবাদ করুন"
                  >
                    🇧🇩 বাংলা
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchAiModalLang('en')}
                    className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                      aiModalLang === 'en'
                        ? 'bg-white text-purple-900 shadow-sm scale-102'
                        : 'text-white/80 hover:text-white'
                    }`}
                    title="View in English"
                  >
                    🌐 EN
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchAiModalLang('hi')}
                    className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                      aiModalLang === 'hi'
                        ? 'bg-white text-purple-900 shadow-sm scale-102'
                        : 'text-white/80 hover:text-white'
                    }`}
                    title="हिंदी में देखें"
                  >
                    🇮🇳 हिंदी
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="px-4 sm:px-6 pt-3 pb-2 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setAiModalTab('step')}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    aiModalTab === 'step'
                      ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs scale-101'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  <span>
                    {aiModalLang === 'bn' ? '📌 এই ধাপের সারসংক্ষেপ ও অপশন' : aiModalLang === 'hi' ? '📌 इस चरण का सारांश' : '📌 Step Guide & Options'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAiModalTab('full');
                    if (!aiSummary && !isGeneratingAi) {
                      handleGenerateAiSummary();
                    }
                  }}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    aiModalTab === 'full'
                      ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs scale-101'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>
                    {aiModalLang === 'bn' ? '🚀 সম্পূর্ণ প্রজেক্ট রোডম্যাপ' : aiModalLang === 'hi' ? '🚀 पूर्ण प्रोजेक्ट रोडमैप' : '🚀 Full Project Scope'}
                  </span>
                </button>
              </div>

              {/* Step Jump Pills (Quick Navigator - bounded by maxReachedStep) */}
              {aiModalTab === 'step' && (
                <div className="hidden md:flex items-center gap-1">
                  <button
                    type="button"
                    disabled={aiModalStepIndex === 0}
                    onClick={() => setAiModalStepIndex((prev) => Math.max(0, prev - 1))}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer hover:bg-slate-50"
                    title="Previous Step"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 font-mono">
                    {aiModalStepIndex + 1} / {maxReachedStep + 1}
                  </span>
                  <button
                    type="button"
                    disabled={aiModalStepIndex >= maxReachedStep}
                    onClick={() => setAiModalStepIndex((prev) => Math.min(maxReachedStep, prev + 1))}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer hover:bg-slate-50"
                    title="Next Unlocked Step"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Modal Body - 100% Scrollable with Mousewheel, Touch, and custom scrollbar */}
            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 min-h-0 space-y-4 text-xs scrollbar-thin text-slate-800 dark:text-slate-200 select-text"
              style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
            >
              
              {/* ========================================================= */}
              {/* TAB 1: CURRENT STEP AI GUIDE & SUMMARY WITH TYPEWRITER     */}
              {/* ========================================================= */}
              {aiModalTab === 'step' && (
                <StepAiTypewriterView
                  guideData={
                    STEP_AI_GUIDES[aiModalStepIndex]
                      ? (STEP_AI_GUIDES[aiModalStepIndex][aiModalLang] || STEP_AI_GUIDES[aiModalStepIndex].en)
                      : (STEP_AI_GUIDES[0][aiModalLang] || STEP_AI_GUIDES[0].en)
                  }
                  lang={aiModalLang}
                  selection={getCurrentStepSelectionText(aiModalStepIndex, formData, aiModalLang)}
                  stepIdx={aiModalStepIndex}
                  maxReachedStep={maxReachedStep}
                  currentStepIndex={currentStepIndex}
                  onSelectStep={(idx) => setAiModalStepIndex(idx)}
                  onSwitchLang={(newLang) => handleSwitchAiModalLang(newLang)}
                  t={t}
                />
              )}

              {/* ========================================================= */}
              {/* TAB 2: EXECUTIVE FULL PROJECT SCOPE & ROADMAP              */}
              {/* ========================================================= */}
              {aiModalTab === 'full' && (
                <div className="space-y-4 animate-in fade-in">
                  {/* Progressive Thinking Steps */}
                  {isGeneratingAi && (
                    <div className="py-8 px-4 text-center space-y-5">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-md">
                        <RefreshCw className="w-6 h-6 animate-spin" />
                      </div>
                      
                      <div className="space-y-2 max-w-md mx-auto">
                        <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                          aiAnalysisStage >= 1
                            ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-300 text-purple-900 dark:text-purple-200'
                            : 'bg-slate-100 text-slate-400 opacity-40'
                        }`}>
                          {aiAnalysisStage > 1 ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />}
                          <span>{aiModalLang === 'bn' ? '১. বিজনেস মডেল ও স্পেসিফিকেশন বিশ্লেষণ হচ্ছে...' : aiModalLang === 'hi' ? '1. बिजनेस मॉडल और आवश्यकताओं का विश्लेषण...' : '1. Analyzing business model & requirements...'}</span>
                        </div>

                        <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                          aiAnalysisStage >= 2
                            ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-300 text-purple-900 dark:text-purple-200'
                            : 'bg-slate-100 text-slate-400 opacity-40'
                        }`}>
                          {aiAnalysisStage > 2 ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />}
                          <span>{aiModalLang === 'bn' ? '২. ফুল-স্ট্যাক সফটওয়্যার আর্কিটেকচার তৈরি হচ্ছে...' : aiModalLang === 'hi' ? '2. सॉफ्टवेयर आर्किटेक्चर और डेटाबेस संरचना...' : '2. Synthesizing full-stack architecture & modules...'}</span>
                        </div>

                        <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                          aiAnalysisStage >= 3
                            ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-300 text-purple-900 dark:text-purple-200'
                            : 'bg-slate-100 text-slate-400 opacity-40'
                        }`}>
                          {aiAnalysisStage > 3 ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />}
                          <span>{aiModalLang === 'bn' ? '৩. মাইলস্টোন ডেলিভারি ও স্প্রিন্ট প্ল্যান তৈরি হচ্ছে...' : aiModalLang === 'hi' ? '3. टर्नअराउंड और स्प्रिंट डिलीवरी रोडमैप...' : '3. Finalizing sprint roadmap & milestone estimates...'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Displayed Streamed Content */}
                  {!isGeneratingAi && displayedAiSummary && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 whitespace-pre-wrap leading-relaxed font-sans text-xs">
                      {displayedAiSummary}
                      {displayedAiSummary !== aiSummary && (
                        <span className="inline-block w-2 h-4 bg-purple-600 ml-1 animate-pulse" />
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
              
              {/* Left Action / Lang Toggle */}
              <div className="flex items-center gap-2">
                {aiModalTab === 'full' ? (
                  <button
                    type="button"
                    onClick={handleGenerateAiSummary}
                    disabled={isGeneratingAi}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                    <span>{t.refreshAiSummary}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSwitchAiModalLang(aiModalLang === 'bn' ? 'en' : 'bn')}
                    className="px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-purple-200 dark:border-purple-800 transition-all"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>
                      {aiModalLang === 'bn' ? '🌐 Switch to English' : '🇧🇩 বাংলায় অনুবাদ করুন'}
                    </span>
                  </button>
                )}
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyModalSummary}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedAi ? (aiModalLang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (aiModalLang === 'bn' ? 'সারসংক্ষেপ কপি করুন' : t.copySummary)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {t.close}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
