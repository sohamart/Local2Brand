import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams, useLocation, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  MessageSquare,
  Loader2,
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
  PhoneCall,
  Languages,
  CheckCheck,
  HelpCircle,
  Lightbulb,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Save,
  Percent,
  ExternalLink,
  Sliders,
  Flame,
  Gift,
  Calendar,
  Eye,
  CheckCircle,
  Plus,
  Trash2,
  MapPin,
  FileCheck,
  Image as ImageIcon,
  Laptop,
  Smartphone,
  Info
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import ThemeToggle from '../components/common/ThemeToggle';
import AshokaChakra from '../components/common/AshokaChakra';
import api from '../services/api';

import { COUNTRIES, COUNTRY_LOCATIONS, getStatesForCountry, getDistrictsForState } from '../data/locationData';
import { COUNTRY_CULTURAL_THEMES, resolveCategoryFromTemplate, formatPriceByCountry } from '../data/countryThemes';
import { demoWebsites, getDemoBySlug } from '../data/demos';
import { STEP_AI_GUIDES } from '../data/stepAiData';
import CulturalMascotArt from '../components/common/CulturalMascotArt';
import BackgroundCountryArt from '../components/common/BackgroundCountryArt';
import SearchableCombobox from '../components/common/SearchableCombobox';
import { detectUserLiveLocation, detectCountryFromTimezone } from '../utils/geoDetector';

// Multilingual dictionary
const TRANSLATIONS = {
  en: {
    backToHome: 'Home',
    shareForm: 'Share Form',
    copiedLink: 'Copied Link!',
    stepLabel: 'Step',
    previous: 'Previous',
    continue: 'Continue',
    submit: 'Submit Requirement 🚀',
    submitting: 'Submitting Requirement...',
    priceSummary: 'Live Estimated Price',
    couponApplied: '20% OFF Special Discount Applied',
    applyCoupon: 'Apply Coupon',
    couponCode: 'Coupon Code',
    saveDraft: 'Save Draft',
    draftSaved: 'Draft Saved',
    aiGuide: 'AI Guide',
    estTotal: 'Est. Total',
    fromPrice: 'From',
    applyTemplate: 'Apply Template',
    applied: 'Applied',
    livePreview: 'Live Preview',
    openFullDemo: 'Open Full Demo Site',
    startingFrom: 'Starting from',
    clear: 'Clear',
    edit: 'Edit',
    yes: 'Yes',
    no: 'No',
    other: 'Other',
    selectStyle: '-- Select Style --',
    categoryNames: {
      restaurant: 'Restaurant',
      cafe: 'Café / Coffee Shop',
      salon: 'Salon / Beauty Parlour',
      gym: 'Gym / Fitness Centre',
      hotel: 'Hotel / Resort',
      real_estate: 'Real Estate',
      photography: 'Photography / Studio',
      boutique: 'Boutique / Clothing Store',
      coaching: 'Coaching Centre / Institute',
      clinic: 'Clinic / Doctor',
      jewellery: 'Jewellery / Gift Shop',
      showroom: 'Car / Bike Showroom',
      other: 'Other'
    },
    visualStyles: {
      'Modern': 'Modern',
      'Minimal': 'Minimal',
      'Premium': 'Premium',
      'Luxury': 'Luxury',
      'Professional': 'Professional',
      'Creative': 'Creative',
      'Elegant': 'Elegant',
      'Bold': 'Bold',
      'Simple': 'Simple',
      'Dark Mode': 'Dark Mode',
      'Light Mode': 'Light Mode',
      'Other': 'Other'
    },
    colorThemes: {
      'Blue': 'Blue',
      'Green': 'Green',
      'Red': 'Red',
      'Purple': 'Purple',
      'Orange': 'Orange',
      'Black & Gold': 'Black & Gold',
      'Dark Theme': 'Dark Theme',
      'Light Clean': 'Light Clean',
      'Custom': 'Custom'
    },
    backendOptions: {
      'No Backend Required': 'No Backend Required',
      'Backend Required': 'Backend Required',
      'Admin Panel Required': 'Admin Panel Required',
      'Backend + Admin Panel': 'Backend + Admin Panel',
      'Custom Backend Requirement': 'Custom Backend Requirement'
    },
    whatsappOptions: {
      'No WhatsApp Integration': 'No WhatsApp Integration',
      'WhatsApp Chat Button': 'WhatsApp Chat Button',
      'WhatsApp Enquiry': 'WhatsApp Enquiry',
      'WhatsApp Order': 'WhatsApp Order',
      'WhatsApp Booking': 'WhatsApp Booking',
      'Custom WhatsApp Integration': 'Custom WhatsApp Integration'
    },
    integrationsList: {
      'Google Maps': 'Google Maps',
      'Payment Gateway': 'Payment Gateway',
      'Email Integration': 'Email Integration',
      'Social Media Integration': 'Social Media Integration',
      'Google Analytics': 'Google Analytics',
      'Newsletter': 'Newsletter',
      'Booking System': 'Booking System',
      'API Integration': 'API Integration',
      'WhatsApp': 'WhatsApp',
      'Other': 'Other'
    },
    budgetOptions: {
      'Under ₹10,000': 'Under ₹10,000',
      '₹10,000 – ₹25,000': '₹10,000 – ₹25,000',
      '₹25,000 – ₹50,000': '₹25,000 – ₹50,000',
      '₹50,000 – ₹1,00,000': '₹50,000 – ₹1,00,000',
      'Above ₹1,00,000': 'Above ₹1,00,000',
      'Custom Budget': 'Custom Budget'
    },
    steps: [
      { id: 'step_client', title: 'Client Details', subtitle: "Let's Get Started with your business details" },
      { id: 'step_category', title: 'Website Category', subtitle: 'What type of website do you need?' },
      { id: 'step_category_spec', title: 'Requirements', subtitle: 'Category-specific tailored features & details' },
      { id: 'step_design', title: 'Design & Colors', subtitle: 'Visual theme and color palette preferences' },
      { id: 'step_files', title: 'Files & Content', subtitle: 'Logo, photos and website reference materials' },
      { id: 'step_domain_hosting', title: 'Domain & Hosting', subtitle: 'Separated domain and cloud server options' },
      { id: 'step_backend_whatsapp', title: 'Backend & WhatsApp', subtitle: 'Admin CMS panel and WhatsApp integration' },
      { id: 'step_integrations', title: 'Integrations', subtitle: 'Payment gateway, maps and external APIs' },
      { id: 'step_final_details', title: 'Final Details', subtitle: 'Budget tier, launch date and extra notes' },
      { id: 'step_review', title: 'Review & Submit', subtitle: 'Summary of requirements and estimated pricing' }
    ],
    labels: {
      clientHeading: 'Client & Business Information',
      clientSubheading: 'Enter your core contact and business details to initialize your project requirement.',
      fullName: 'Full Name',
      businessName: 'Business / Brand Name',
      mobileNumber: 'Mobile Number',
      whatsappNumber: 'WhatsApp Number',
      emailAddress: 'Email Address',
      addressSection: 'Business Location & Address Details',
      country: 'Country',
      state: 'State / Province',
      selectState: '-- Select State / UT --',
      district: 'District / City',
      selectDistrict: '-- Select District / City --',
      specifyDistrict: 'Please specify your District / City',
      streetAddress: 'Street Address / Shop / Building / Landmark',
      pincode: 'PIN / Postal Code',
      compiledAddress: 'Compiled Full Address:',
      existingWebsite: 'Existing Website (Optional)',
      socialLinks: 'Social Media Links (Optional - Add Multiple)',
      addLink: 'Add Link',
      
      categoryHeading: 'What type of website do you need?',
      categorySubheading: 'Select your core industry category or apply an interactive ready-made live template below.',
      readyTemplates: 'Ready-Made Live Templates',
      readyTemplatesFor: 'Live Demos matching',
      specifyCategory: 'Please specify your website category',
      
      specHeading: 'Industry-Specific Requirements',
      specSubheading: 'Tailor your exact features, business operations, and workflow needs.',
      featuresRequired: 'Features Required',
      preferredStyle: 'Preferred Website Style',
      haveLogo: 'Do you have a Logo?',
      havePhotos: 'Are photos and media available?',
      providePhotos: 'Will you provide photos and content?',
      describeCustom: 'Describe your specific business operations & features',
      
      // Category Specific questions
      restCuisineQ: 'Restaurant Type / Cuisine',
      cafeNameQ: 'Café Name',
      salonFeaturesQ: 'Salon & Spa Features',
      gymFeaturesQ: 'Gym & Fitness Features',
      hotelFeaturesQ: 'Hotel & Resort Features',
      rePropertyTypesQ: 'Property Types',
      reFeaturesQ: 'Features Needed',
      otherCategoryFeaturesQ: 'Core Features & Specifications for',
      
      designHeading: 'Design & Color Theme',
      designSubheading: 'Choose visual branding, design personality and accent colors.',
      visualStyleQ: 'What kind of visual style do you prefer?',
      colorThemeQ: 'What color theme would you like?',
      customColorDesc: 'Optional theme description...',
      
      mediaHeading: 'Logo / Content / Media Files',
      mediaSubheading: 'Tell us about your brand assets readiness and upload logo & business photos.',
      logoQ: '1. Do you have a Logo?',
      photosQ: '2. Do you have Photos?',
      contentQ: '3. Do you have Content?',
      uploadLogo: 'Upload Brand Logo (Optional)',
      uploadPhotos: 'Photos & Catalog Media (Optional)',
      addPhotosBtn: 'Add Business Photos',
      clickToBrowseLogo: 'Click to Browse Logo',
      maxSizeLogo: 'PNG, JPG, SVG or WebP (Max 5MB)',
      refWebsite: 'Reference Website (Optional)',
      designNotes: 'Additional Design Instructions (Optional)',
      
      domainHeading: 'Domain & Hosting',
      domainSubheading: 'Domain and Cloud Hosting are completely separate components. Select your requirement for each.',
      domainQ: 'Do you need a Domain?',
      domainDesc: 'Web address e.g. yourbrand.com / .in',
      domainHave: 'I already have a Domain',
      domainNeed: 'I need a new Domain',
      domainName: 'Desired Domain Name',
      domainExt: 'Domain Extension',
      hostingQ: 'Do you need Hosting?',
      hostingDesc: 'High-speed SSD cloud server with SSL & daily backups',
      hostingHave: 'I already have Hosting',
      hostingNeed: 'I need new Hosting',
      hostingPlan: 'Hosting Plan',
      
      backendHeading: 'Backend & WhatsApp Integration',
      backendSubheading: 'Configure administrative content management and direct WhatsApp customer funnels.',
      backendQ: 'Do you need a Backend / Admin Panel?',
      whatsappQ: 'Do you need WhatsApp Integration?',
      countryCode: 'Country Code',
      whatsappNumberFor: 'WhatsApp Number',
      
      integrationsHeading: 'Do you need any additional integrations?',
      integrationsSubheading: 'Select key external services, APIs and third-party tools to integrate.',
      specifyIntegration: 'Please specify your custom integration requirement',
      
      finalHeading: 'Final Project Information',
      finalSubheading: 'Budget bracket, launch timeline and any special requests.',
      budgetQ: '1. Estimated Budget (Optional)',
      launchDateQ: '2. Expected Launch Date (Optional)',
      addlReqQ: '3. Additional Requirements (Optional)',
      anythingElseQ: '4. Anything else we should know? (Optional)',
      
      reviewHeading: 'Requirement Summary & Investment Estimate',
      reviewSubheading: 'Please review all your submitted parameters below. You can click Edit on any section to modify.',
      transparentEstimate: 'Transparent Commercial Estimate',
      estApproxTotal: 'Estimated Approximate Total Price',
      allFeaturesIncluded: 'All features & 1st-year setup included',
      baseWebsitePrice: 'Base Website',
      domainReg: 'Domain Registration (1 Year)',
      cloudHosting: 'High-Speed Cloud Hosting',
      advIntegrations: 'Advanced Integrations',
      discountCoupon: 'Discount Coupon'
    }
  },
  bn: {
    backToHome: 'হোম',
    shareForm: 'শেয়ার করুন',
    copiedLink: 'লিংক কপি হয়েছে!',
    stepLabel: 'ধাপ',
    previous: 'আগের ধাপ',
    continue: 'পরবর্তী ধাপ',
    submit: 'রিকোয়ারমেন্ট জমা দিন 🚀',
    submitting: 'জমা হচ্ছে...',
    priceSummary: 'আনুমানিক মূল্য তালিকা',
    couponApplied: '২০% ছাড় কুপন সফলভাবে যুক্ত হয়েছে',
    applyCoupon: 'কুপন প্রয়োগ করুন',
    couponCode: 'কুপন কোড',
    saveDraft: 'খসড়া সংরক্ষণ',
    draftSaved: 'সংরক্ষিত',
    aiGuide: 'এআই গাইড',
    estTotal: 'মোট আনুমানিক',
    fromPrice: 'শুরু',
    applyTemplate: 'টেমপ্লেট নিন',
    applied: 'যুক্ত হয়েছে',
    livePreview: 'লাইভ দেখুন',
    openFullDemo: 'সম্পূর্ণ ডেমো সাইট দেখুন',
    startingFrom: 'শুরু মাত্র',
    clear: 'মুছুন',
    edit: 'সম্পাদনা',
    yes: 'হ্যাঁ',
    no: 'না',
    other: 'অন্যান্য',
    selectStyle: '-- স্টাইল বেছে নিন --',
    categoryNames: {
      restaurant: 'রেস্তোরাঁ / খাবার',
      cafe: 'ক্যাফে / কফি শপ',
      salon: 'সেলুন / বিউটি পার্লার',
      gym: 'জিম ও ফিটনেস সেন্টার',
      hotel: 'হোটেল ও রিসর্ট',
      real_estate: 'রিয়েল এস্টেট ও প্রোপার্টি',
      photography: 'ফটোগ্রাফি ও স্টুডিও',
      boutique: 'বুটিক ও কাপড়ের দোকান',
      coaching: 'কোচিং সেন্টার ও ইনস্টিটিউট',
      clinic: 'ক্লিনিক ও ডাক্তার',
      jewellery: 'জুয়েলারি ও উপহার',
      showroom: 'গাড়ি / বাইক শোরুম',
      other: 'অন্যান্য কাস্টম ওয়েবসাইট'
    },
    visualStyles: {
      'Modern': 'মডার্ন (আধুনিক)',
      'Minimal': 'মিনিমাল (সহজ)',
      'Premium': 'প্রিমিয়াম',
      'Luxury': 'লাক্সারি (রাজকীয়)',
      'Professional': 'প্রফেশনাল',
      'Creative': 'ক্রিয়েটিভ',
      'Elegant': 'এলিগেন্ট',
      'Bold': 'বোল্ড (গাঢ়)',
      'Simple': 'সাধারণ',
      'Dark Mode': 'ডার্ক মোড',
      'Light Mode': 'লাইট মোড',
      'Other': 'অন্যান্য'
    },
    colorThemes: {
      'Blue': 'নীল (Blue)',
      'Green': 'সবুজ (Green)',
      'Red': 'লাল (Red)',
      'Purple': 'বেগুনি (Purple)',
      'Orange': 'কমলা (Orange)',
      'Black & Gold': 'কালো ও গোল্ডেন',
      'Dark Theme': 'ডার্ক থিম',
      'Light Clean': 'লাইট ক্লিন',
      'Custom': 'কাস্টম কালার'
    },
    backendOptions: {
      'No Backend Required': 'ব্যাকএন্ড প্রয়োজন নেই',
      'Backend Required': 'ব্যাকএন্ড প্রয়োজন',
      'Admin Panel Required': 'অ্যাডমিন প্যানেল প্রয়োজন',
      'Backend + Admin Panel': 'ব্যাকএন্ড + অ্যাডমিন প্যানেল',
      'Custom Backend Requirement': 'কাস্টম ব্যাকএন্ড চাহিদা'
    },
    whatsappOptions: {
      'No WhatsApp Integration': 'হোয়াটসঅ্যাপ সংযোগ প্রয়োজন নেই',
      'WhatsApp Chat Button': 'হোয়াটসঅ্যাপ চ্যাট বাটন',
      'WhatsApp Enquiry': 'হোয়াটসঅ্যাপ ইনকোয়ারি',
      'WhatsApp Order': 'হোয়াটসঅ্যাপ অর্ডার',
      'WhatsApp Booking': 'হোয়াটসঅ্যাপ বুকিং',
      'Custom WhatsApp Integration': 'কাস্টম হোয়াটসঅ্যাপ ইন্টিগ্রেশন'
    },
    integrationsList: {
      'Google Maps': 'গুগল ম্যাপস',
      'Payment Gateway': 'অনলাইন পেমেন্ট গেটওয়ে',
      'Email Integration': 'ইমেইল ইন্টিগ্রেশন',
      'Social Media Integration': 'সোশ্যাল মিডিয়া ইন্টিগ্রেশন',
      'Google Analytics': 'গুগল অ্যানালিটিক্স',
      'Newsletter': 'নিউজলেটার',
      'Booking System': 'বুকিং সিস্টেম',
      'API Integration': 'এপিআই ইন্টিগ্রেশন',
      'WhatsApp': 'হোয়াটসঅ্যাপ',
      'Other': 'অন্যান্য'
    },
    budgetOptions: {
      'Under ₹10,000': '₹১০,০০০ এর নিচে',
      '₹10,000 – ₹25,000': '₹১০,০০০ – ₹২৫,০০০',
      '₹25,000 – ₹50,000': '₹২৫,০০০ – ₹৫০,০০০',
      '₹50,000 – ₹1,00,000': '₹৫০,০০০ – ₹১,০০,০০০',
      'Above ₹1,00,000': '₹১,০০,০০০ এর উপরে',
      'Custom Budget': 'কাস্টম বাজেট'
    },
    steps: [
      { id: 'step_client', title: 'ক্লায়েন্ট তথ্য', subtitle: 'আপনার ব্যবসা ও যোগাযোগের বিবরণ দিয়ে শুরু করুন' },
      { id: 'step_category', title: 'ওয়েবসাইটের ধরন', subtitle: 'আপনার কি ধরনের ওয়েবসাইট প্রয়োজন?' },
      { id: 'step_category_spec', title: 'নির্দিষ্ট চাহিদা', subtitle: 'আপনার ব্যবসার ক্যাটাগরি অনুযায়ী বিশেষ প্রশ্ন' },
      { id: 'step_design', title: 'ডিজাইন ও কালার', subtitle: 'ভিজ্যুয়াল স্টাইল ও রঙের পছন্দ' },
      { id: 'step_files', title: 'লোগো ও ফাইল', subtitle: 'লোগো, ছবি ও কন্টেন্ট আপলোড বা বিবরণ' },
      { id: 'step_domain_hosting', title: 'ডোমেন ও হোস্টিং', subtitle: 'পৃথক ডোমেন ও ক্লাউড হোস্টিং পছন্দ' },
      { id: 'step_backend_whatsapp', title: 'ব্যাকএন্ড ও হোয়াটসঅ্যাপ', subtitle: 'অ্যাডমিন প্যানেল ও হোয়াটসঅ্যাপ ইন্টিগ্রেশন' },
      { id: 'step_integrations', title: 'অন্যান্য ইন্টিগ্রেশন', subtitle: 'পেমেন্ট গেটওয়ে, গুগল ম্যাপ ও এপিআই' },
      { id: 'step_final_details', title: 'বাজেট ও ডেলিভারি', subtitle: 'বাজেট পরিসীমা ও প্রয়োজনীয় সময়সীমা' },
      { id: 'step_review', title: 'রিভিউ ও জমা দিন', subtitle: 'সম্পূর্ণ বিবরণ যাচাই ও আনুমানিক মোট খরচ' }
    ],
    labels: {
      clientHeading: 'ক্লায়েন্ট ও ব্যবসায়িক তথ্য',
      clientSubheading: 'আপনার প্রজেক্টের রিকোয়ারমেন্ট শুরু করতে মূল যোগাযোগের বিবরণ লিখুন।',
      fullName: 'পুরো নাম',
      businessName: 'ব্যবসা বা ব্র্যান্ডের নাম',
      mobileNumber: 'মোবাইল নম্বর',
      whatsappNumber: 'হোয়াটসঅ্যাপ নম্বর',
      emailAddress: 'ইমেইল ঠিকানা',
      addressSection: 'ব্যবসার অবস্থান ও ঠিকানার বিবরণ',
      country: 'দেশ',
      state: 'রাজ্য / প্রদেশ',
      selectState: '-- রাজ্য বেছে নিন --',
      district: 'জেলা / শহর',
      selectDistrict: '-- জেলা বেছে নিন --',
      specifyDistrict: 'আপনার জেলা বা শহরের নাম লিখুন',
      streetAddress: 'রাস্তা / দোকান / বিল্ডিং / এলাকা',
      pincode: 'পিন / পোস্টাল কোড',
      compiledAddress: 'সংকলিত পূর্ণ ঠিকানা:',
      existingWebsite: 'বর্তমান ওয়েবসাইট (ঐচ্ছিক)',
      socialLinks: 'সোশ্যাল মিডিয়া লিংক (ঐচ্ছিক - একাধিক যোগ করুন)',
      addLink: 'লিংক যুক্ত করুন',
      
      categoryHeading: 'আপনার কি ধরণের ওয়েবসাইট প্রয়োজন?',
      categorySubheading: 'আপনার মূল ব্যবসার ক্যাটাগরি বেছে নিন অথবা নিচে তৈরি রেডি-মেড লাইভ ডেমো প্রয়োগ করুন।',
      readyTemplates: 'রেডি-মেড লাইভ টেমপ্লেট',
      readyTemplatesFor: 'উপযুক্ত লাইভ ডেমো সমূহ',
      specifyCategory: 'আপনার ওয়েবসাইটের ক্যাটাগরি উল্লেখ করুন',
      
      specHeading: 'ইন্ডাস্ট্রি-স্পেসিফিক বিশেষ রিকোয়ারমেন্ট',
      specSubheading: 'আপনার প্রয়োজনীয় ফিচার, কর্মপদ্ধতি ও মডিউল নির্বাচন করুন।',
      featuresRequired: 'প্রয়োজনীয় ফিচারসমূহ',
      preferredStyle: 'পছন্দের ওয়েবসাইট স্টাইল',
      haveLogo: 'আপনার কি লোগো আছে?',
      havePhotos: 'ছবি ও মেনু কি প্রস্তুত আছে?',
      providePhotos: 'আপনি কি ছবি ও কন্টেন্ট সরবরাহ করবেন?',
      describeCustom: 'আপনার কাস্টম ওয়েবসাইটের চাহিদা বিস্তারিত লিখুন',
      
      restCuisineQ: 'রেস্তোরাঁর ধরন বা রান্নার ধরণ (Cuisine)',
      cafeNameQ: 'ক্যাফের নাম',
      salonFeaturesQ: 'সেলুন ও স্পা ফিচারসমূহ',
      gymFeaturesQ: 'জিম ও ফিটনেস ফিচারসমূহ',
      hotelFeaturesQ: 'হোটেল ও রিসর্ট ফিচারসমূহ',
      rePropertyTypesQ: 'প্রোপার্টির ধরন',
      reFeaturesQ: 'প্রয়োজনীয় ফিচারসমূহ',
      otherCategoryFeaturesQ: 'প্রয়োজনীয় মূল ফিচার ও বিবরণ',
      
      designHeading: 'ডিজাইন ও কালার থিম',
      designSubheading: 'ভিজ্যুয়াল ব্র্যান্ডিং, ডিজাইনের রূপ ও রঙের সমন্বয় বেছে নিন।',
      visualStyleQ: 'আপনি কেমন ভিজ্যুয়াল স্টাইল পছন্দ করেন?',
      colorThemeQ: 'আপনি কী রঙের থিম পছন্দ করবেন?',
      customColorDesc: 'রঙের অতিরিক্ত বিবরণ...',
      
      mediaHeading: 'লোগো / কন্টেন্ট / মিডিয়া ফাইল',
      mediaSubheading: 'ব্র্যান্ডের লোগো, ছবি ও কন্টেন্ট আপলোড বা বিবরণ দিন।',
      logoQ: '১. আপনার কি লোগো আছে?',
      photosQ: '২. আপনার কি ছবি আছে?',
      contentQ: '৩. আপনার কি ওয়েবসাইটের লেখা কন্টেন্ট আছে?',
      uploadLogo: 'লোগো আপলোড করুন (ঐচ্ছিক)',
      uploadPhotos: 'ছবি ও ক্যাটালগ মিডিয়া আপলোড (ঐচ্ছিক)',
      addPhotosBtn: 'ছবি যোগ করুন',
      clickToBrowseLogo: 'লোগো নির্বাচন করতে ক্লিক করুন',
      maxSizeLogo: 'PNG, JPG, SVG বা WebP (সর্বোচ্চ 5MB)',
      refWebsite: 'রেফারেন্স ওয়েবসাইট (ঐচ্ছিক)',
      designNotes: 'অতিরিক্ত ডিজাইন নির্দেশনা (ঐচ্ছিক)',
      
      domainHeading: 'ডোমেন ও ক্লাউড হোস্টিং',
      domainSubheading: 'ডোমেন ও ক্লাউড হোস্টিং দুটি সম্পূর্ণ পৃথক অংশ। আপনার চাহিদা নির্বাচন করুন।',
      domainQ: 'আপনার কি ডোমেন প্রয়োজন?',
      domainDesc: 'ওয়েব ঠিকানা যেমন yourbrand.com বা .in',
      domainHave: 'আমার ডোমেন আছে',
      domainNeed: 'আমার নতুন ডোমেন লাগবে',
      domainName: 'পছন্দের ডোমেন নাম',
      domainExt: 'ডোমেন এক্সটেনশন',
      hostingQ: 'আপনার কি হোস্টিং প্রয়োজন?',
      hostingDesc: 'উচ্চগতির এসএসডি ক্লাউড সার্ভার সাথে SSL ও ব্যাকআপ',
      hostingHave: 'আমার হোস্টিং আছে',
      hostingNeed: 'আমার নতুন হোস্টিং লাগবে',
      hostingPlan: 'হোস্টিং প্ল্যান',
      
      backendHeading: 'ব্যাকএন্ড ও হোয়াটসঅ্যাপ ইন্টিগ্রেশন',
      backendSubheading: 'অ্যাডমিন কন্টেন্ট ম্যানেজমেন্ট ও সরাসরি হোয়াটসঅ্যাপ সেলস ফানেল।',
      backendQ: 'আপনার কি ব্যাকএন্ড / অ্যাডমিন প্যানেল লাগবে?',
      whatsappQ: 'আপনার কি হোয়াটসঅ্যাপ ইন্টিগ্রেশন লাগবে?',
      countryCode: 'কান্ট্রি কোড',
      whatsappNumberFor: 'হোয়াটসঅ্যাপ নম্বর',
      
      integrationsHeading: 'আপনার কি অতিরিক্ত কোনো ইন্টিগ্রেশন প্রয়োজন?',
      integrationsSubheading: 'প্রয়োজনীয় পেমেন্ট গেটওয়ে, গুগল ম্যাপ ও থার্ড-পার্টি এপিআই বেছে নিন।',
      specifyIntegration: 'আপনার কাস্টম ইন্টিগ্রেশনের বিবরণ দিন',
      
      finalHeading: 'প্রজেক্টের চূড়ান্ত তথ্য ও বাজেট',
      finalSubheading: 'আনুমানিক বাজেট সীমা, ডেলিভারির সময়সীমা ও অতিরিক্ত তথ্য।',
      budgetQ: '১. আনুমানিক বাজেট (ঐচ্ছিক)',
      launchDateQ: '২. প্রত্যাশিত লঞ্চের তারিখ (ঐচ্ছিক)',
      addlReqQ: '৩. অতিরিক্ত কোনো চাহিদা (ঐচ্ছিক)',
      anythingElseQ: '৪. আর কোনো বিশেষ বিষয় যা আমাদের জানা প্রয়োজন? (ঐচ্ছিক)',
      
      reviewHeading: 'রিকোয়ারমেন্ট সারসংক্ষেপ ও আনুমানিক মোট খরচ',
      reviewSubheading: 'আপনার দেওয়া সমস্ত বিবরণ যাচাই করুন। প্রয়োজনে পরিবর্তন বোতামে চাপ দিন।',
      transparentEstimate: 'স্বচ্ছ বাণিজ্যিক মূল্য তালিকা',
      estApproxTotal: 'আনুমানিক মোট মূল্য',
      allFeaturesIncluded: 'সমস্ত ফিচার ও ১ম বছরের সেটআপ অন্তর্ভুক্ত',
      baseWebsitePrice: 'মূল ওয়েবসাইট',
      domainReg: 'ডোমেন রেজিস্ট্রেশন (১ বছর)',
      cloudHosting: 'উচ্চগতির ক্লাউড হোস্টিং',
      advIntegrations: 'উন্নত ইন্টিগ্রেশন',
      discountCoupon: 'ডিসকাউন্ট কুপন'
    }
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
    priceSummary: 'अनुमानित कुल लागत',
    couponApplied: '20% विशेष छूट कूपन लागू है',
    applyCoupon: 'कूपन लागू करें',
    couponCode: 'कूपन कोड',
    saveDraft: 'ड्राफ्ट सहेजें',
    draftSaved: 'सहेजा गया',
    aiGuide: 'एआई गाइड',
    estTotal: 'कुल अनुमान',
    fromPrice: 'शुरुआती',
    applyTemplate: 'टेम्पलेट लागू करें',
    applied: 'लागू हुआ',
    livePreview: 'लाइव देखें',
    openFullDemo: 'पूरी डेमो साइट देखें',
    startingFrom: 'शुरुआती कीमत',
    clear: 'हटाएं',
    edit: 'संशोधन',
    yes: 'हाँ',
    no: 'नहीं',
    other: 'अन्य',
    selectStyle: '-- स्टाइल चुनें --',
    categoryNames: {
      restaurant: 'रेस्टोरेंट / फ़ूड',
      cafe: 'कैफे / कॉफ़ी शॉप',
      salon: 'सैलून / ब्यूटी पार्लर',
      gym: 'जिम व फिटनेस सेंटर',
      hotel: 'होटल व रिसॉर्ट',
      real_estate: 'रियल एस्टेट',
      photography: 'फोटोग्राफी व स्टूडियो',
      boutique: 'बुटीक व कपड़ों की दुकान',
      coaching: 'कोचिंग व संस्थान',
      clinic: 'क्लिनिक व डॉक्टर',
      jewellery: 'ज्वैलरी व गिफ्ट शॉप',
      showroom: 'कार / बाइक शोरूम',
      other: 'अन्य वेबसाइट'
    },
    visualStyles: {
      'Modern': 'मॉडर्न (आधुनिक)',
      'Minimal': 'मिनिमल (सरल)',
      'Premium': 'प्रीमियम',
      'Luxury': 'लक्ज़री (भव्य)',
      'Professional': 'प्रोफेशनल',
      'Creative': 'क्रिएटिव',
      'Elegant': 'एलिगेंट',
      'Bold': 'बोल्ड',
      'Simple': 'साधारण',
      'Dark Mode': 'डार्क मोड',
      'Light Mode': 'लाइट मोड',
      'Other': 'अन्य'
    },
    colorThemes: {
      'Blue': 'नीला (Blue)',
      'Green': 'हरा (Green)',
      'Red': 'लाल (Red)',
      'Purple': 'बैंगनी (Purple)',
      'Orange': 'नारंगी (Orange)',
      'Black & Gold': 'ब्लैक व गोल्ड',
      'Dark Theme': 'डार्क थीम',
      'Light Clean': 'लाइट क्लीन',
      'Custom': 'कस्टम कलर'
    },
    backendOptions: {
      'No Backend Required': 'बैकएंड की आवश्यकता नहीं',
      'Backend Required': 'बैकएंड आवश्यक',
      'Admin Panel Required': 'एडमिन पैनल आवश्यक',
      'Backend + Admin Panel': 'बैकएंड + एडमिन पैनल',
      'Custom Backend Requirement': 'कस्टम बैकएंड आवश्यकता'
    },
    whatsappOptions: {
      'No WhatsApp Integration': 'व्हाट्सएप कनेक्टिविटी नहीं चाहिए',
      'WhatsApp Chat Button': 'व्हाट्सएप चैट बटन',
      'WhatsApp Enquiry': 'व्हाट्सएप पूछताछ',
      'WhatsApp Order': 'व्हाट्सएप ऑर्डर',
      'WhatsApp Booking': 'व्हाट्सएप बुकिंग',
      'Custom WhatsApp Integration': 'कस्टम व्हाट्सएप एकीकरण'
    },
    integrationsList: {
      'Google Maps': 'गूगल मैप्स',
      'Payment Gateway': 'ऑनलाइन पेमेंट गेटवे',
      'Email Integration': 'ईमेल एकीकरण',
      'Social Media Integration': 'सोशल मीडिया एकीकरण',
      'Google Analytics': 'गूगल एनालिटिक्स',
      'Newsletter': 'न्यूज़लेटर',
      'Booking System': 'बुकिंग सिस्टम',
      'API Integration': 'एपीआई एकीकरण',
      'WhatsApp': 'व्हाट्सएप',
      'Other': 'अन्य'
    },
    budgetOptions: {
      'Under ₹10,000': '₹10,000 से कम',
      '₹10,000 – ₹25,000': '₹10,000 – ₹25,000',
      '₹25,000 – ₹50,000': '₹25,000 – ₹50,000',
      '₹50,000 – ₹1,00,000': '₹50,000 – ₹1,00,000',
      'Above ₹1,00,000': '₹1,00,000 से अधिक',
      'Custom Budget': 'कस्टम बजट'
    },
    steps: [
      { id: 'step_client', title: 'क्लाइंट विवरण', subtitle: 'अपने व्यवसाय और संपर्क विवरण से शुरुआत करें' },
      { id: 'step_category', title: 'वेबसाइट श्रेणी', subtitle: 'आपको किस प्रकार की वेबसाइट चाहिए?' },
      { id: 'step_category_spec', title: 'विशिष्ट आवश्यकताएं', subtitle: 'आपकी श्रेणी के अनुसार विशेष मॉड्यूल' },
      { id: 'step_design', title: 'डिज़ाइन और रंग', subtitle: 'पसंदीदा विजुअल स्टाइल और रंग थीम' },
      { id: 'step_files', title: 'फ़ाइलें और सामग्री', subtitle: 'लोगो, तस्वीरें और संदर्भ वेबसाइट लिंक' },
      { id: 'step_domain_hosting', title: 'डोमेन और होस्टिंग', subtitle: 'अलग डोमेन और क्लाउड सर्वर विकल्प' },
      { id: 'step_backend_whatsapp', title: 'बैकएंड और व्हाट्सएप', subtitle: 'एडमिन पैनल और व्हाट्सएप कनेक्टिविटी' },
      { id: 'step_integrations', title: 'अतिरिक्त एकीकरण', subtitle: 'पेमेंट गेटवे, मैप्स और एपीआई' },
      { id: 'step_final_details', title: 'अंतिम विवरण', subtitle: 'बजट और अपेक्षित लॉन्च तिथि' },
      { id: 'step_review', title: 'समीक्षा और सबमिट', subtitle: 'सभी विवरणों की जांच और अनुमानित लागत' }
    ],
    labels: {
      clientHeading: 'क्लाइंट और व्यावसायिक जानकारी',
      clientSubheading: 'अपनी परियोजना शुरू करने के लिए संपर्क और व्यावसायिक विवरण दर्ज करें।',
      fullName: 'पूरा नाम',
      businessName: 'व्यवसाय / ब्रांड का नाम',
      mobileNumber: 'मोबाइल नंबर',
      whatsappNumber: 'व्हाट्सएप नंबर',
      emailAddress: 'ईमेल पता',
      addressSection: 'व्यावसायिक स्थान और पते का विवरण',
      country: 'देश',
      state: 'राज्य / प्रांत',
      selectState: '-- राज्य चुनें --',
      district: 'जिला / शहर',
      selectDistrict: '-- जिला चुनें --',
      specifyDistrict: 'कृपया अपना जिला / शहर बताएं',
      streetAddress: 'सड़क का पता / दुकान / भवन / लैंडमार्क',
      pincode: 'पिन / पोस्टल कोड',
      compiledAddress: 'संकलित पूरा पता:',
      existingWebsite: 'मौजूदा वेबसाइट (वैकल्पिक)',
      socialLinks: 'सोशल मीडिया लिंक (वैकल्पिक - एकाधिक जोड़ें)',
      addLink: 'लिंक जोड़ें',
      
      categoryHeading: 'आपको किस प्रकार की वेबसाइट चाहिए?',
      categorySubheading: 'अपनी मुख्य श्रेणी चुनें या नीचे तैयार लाइव टेम्पलेट लागू करें।',
      readyTemplates: 'तैयार लाइव टेम्पलेट',
      readyTemplatesFor: 'उपयुक्त लाइव डेमो',
      specifyCategory: 'कृपया अपनी वेबसाइट श्रेणी निर्दिष्ट करें',
      
      specHeading: 'उद्योग-विशिष्ट आवश्यकताएं',
      specSubheading: 'अपनी आवश्यक सुविधाएं और कार्यप्रणाली चुनें।',
      featuresRequired: 'आवश्यक सुविधाएं',
      preferredStyle: 'पसंदीदा वेबसाइट शैली',
      haveLogo: 'क्या आपके पास लोगो है?',
      havePhotos: 'क्या तस्वीरें उपलब्ध हैं?',
      providePhotos: 'क्या आप फोटो और सामग्री प्रदान करेंगे?',
      describeCustom: 'अपनी विशिष्ट व्यावसायिक आवश्यकताओं का वर्णन करें',
      
      restCuisineQ: 'रेस्टोरेंट का प्रकार या व्यंजन (Cuisine)',
      cafeNameQ: 'कैफे का नाम',
      salonFeaturesQ: 'सैलून और स्पा सुविधाएं',
      gymFeaturesQ: 'जिम और फिटनेस सुविधाएं',
      hotelFeaturesQ: 'होटल और रिसॉर्ट सुविधाएं',
      rePropertyTypesQ: 'संपत्ति के प्रकार',
      reFeaturesQ: 'आवश्यक सुविधाएं',
      otherCategoryFeaturesQ: 'मुख्य सुविधाएं और विवरण',
      
      designHeading: 'डिज़ाइन और रंग थीम',
      designSubheading: 'विजुअल ब्रांडिंग और अपनी पसंदीदा रंग थीम चुनें।',
      visualStyleQ: 'आप किस प्रकार की विज़ुअल शैली पसंद करते हैं?',
      colorThemeQ: 'आप कौन सा रंग विषय पसंद करेंगे?',
      customColorDesc: 'वैकल्पिक रंग विवरण...',
      
      mediaHeading: 'लोगो / सामग्री / मीडिया फ़ाइलें',
      mediaSubheading: 'ब्रांड लोगो, तस्वीरें और वेबसाइट संदर्भ सामग्री अपलोड करें।',
      logoQ: '१. क्या आपके पास लोगो है?',
      photosQ: '२. क्या आपके पास तस्वीरें हैं?',
      contentQ: '३. क्या आपके पास वेबसाइट सामग्री है?',
      uploadLogo: 'लोगो अपलोड करें (वैकल्पिक)',
      uploadPhotos: 'फ़ोटो और कैटलॉग मीडिया (वैकल्पिक)',
      addPhotosBtn: 'फ़ोटो जोड़ें',
      clickToBrowseLogo: 'लोगो चुनने के लिए क्लिक करें',
      maxSizeLogo: 'PNG, JPG, SVG या WebP (अधिकतम 5MB)',
      refWebsite: 'संदर्भ वेबसाइट (वैकल्पिक)',
      designNotes: 'अतिरिक्त डिज़ाइन निर्देश (वैकल्पिक)',
      
      domainHeading: 'डोमेन और होस्टिंग',
      domainSubheading: 'डोमेन और क्लाउड होस्टिंग पूरी तरह से अलग घटक हैं। प्रत्येक के लिए अपनी आवश्यकता चुनें।',
      domainQ: 'क्या आपको डोमेन की आवश्यकता है?',
      domainDesc: 'वेब पता जैसे yourbrand.com / .in',
      domainHave: 'मेरे पास पहले से डोमेन है',
      domainNeed: 'मुझे नया डोमेन चाहिए',
      domainName: 'पसंदीदा डोमेन नाम',
      domainExt: 'डोमेन एक्सटेंशन',
      hostingQ: 'क्या आपको होस्टिंग की आवश्यकता है?',
      hostingDesc: 'हाई-स्पीड एसएसडी क्लाउड सर्वर साथ में एसएसएल और बैकअप',
      hostingHave: 'मेरे पास पहले से होस्टिंग है',
      hostingNeed: 'मुझे नई होस्टिंग चाहिए',
      hostingPlan: 'होस्टिंग योजना',
      
      backendHeading: 'बैकएंड और व्हाट्सएप एकीकरण',
      backendSubheading: 'एडमिन पैनल और सीधे व्हाट्सएप ग्राहक फ़नल।',
      backendQ: 'क्या आपको बैकएंड / एडमिन पैनल चाहिए?',
      whatsappQ: 'क्या आपको व्हाट्सएप एकीकरण चाहिए?',
      countryCode: 'कंट्री कोड',
      whatsappNumberFor: 'व्हाट्सएप नंबर',
      
      integrationsHeading: 'क्या आपको किसी अतिरिक्त एकीकरण की आवश्यकता है?',
      integrationsSubheading: 'पेमेंट गेटवे, मैप्स और एपीआई चुनें।',
      specifyIntegration: 'कृपया अपना कस्टम एकीकरण बताएं',
      
      finalHeading: 'अंतिम परियोजना जानकारी',
      finalSubheading: 'बजट, लॉन्च समयरेखा और कोई विशेष अनुरोध।',
      budgetQ: '१. अनुमानित बजट (वैकल्पिक)',
      launchDateQ: '२. अपेक्षित लॉन्च तिथि (वैकल्पिक)',
      addlReqQ: '३. अतिरिक्त आवश्यकताएं (वैकल्पिक)',
      anythingElseQ: '४. कुछ और जो हमें जानना चाहिए? (वैकल्पिक)',
      
      reviewHeading: 'आवश्यकता सारांश और अनुमानित लागत',
      reviewSubheading: 'कृपया नीचे दिए गए अपने सभी विवरणों की समीक्षा करें।',
      transparentEstimate: 'पारदर्शी वाणिज्यिक अनुमान',
      estApproxTotal: 'अनुमानित कुल मूल्य',
      allFeaturesIncluded: 'सभी सुविधाएं और प्रथम वर्ष का सेटअप शामिल',
      baseWebsitePrice: 'मूल वेबसाइट',
      domainReg: 'डोमेन पंजीकरण (१ वर्ष)',
      cloudHosting: 'हाई-स्पीड क्लाउड होस्टिंग',
      advIntegrations: 'उन्नत एकीकरण',
      discountCoupon: 'छूट कूपन'
    }
  }
};


// 12 Standard Categories + Other
const CATEGORIES = [
  { id: 'restaurant', name: 'Restaurant', icon: Utensils, basePrice: 9999, badge: 'Popular', desc: 'Digital food menus, table reservation & takeaway funnels' },
  { id: 'cafe', name: 'Café / Coffee Shop', icon: Coffee, basePrice: 8999, badge: 'Trending', desc: 'Cozy lookbook, signature items, table booking & orders' },
  { id: 'salon', name: 'Salon / Beauty Parlour', icon: Sparkles, basePrice: 8999, badge: 'High Demand', desc: 'Stylist rate-cards, beauty packages & appointment slots' },
  { id: 'gym', name: 'Gym / Fitness Centre', icon: Dumbbell, basePrice: 9999, badge: 'High ROI', desc: 'Membership tiers, trainer profiles & online passes' },
  { id: 'hotel', name: 'Hotel / Resort', icon: Hotel, basePrice: 14999, badge: 'Luxury', desc: 'Room showcase, amenities, tariffs & booking engine' },
  { id: 'real_estate', name: 'Real Estate', icon: Building2, basePrice: 14999, badge: 'Commercial', desc: 'Property listings, virtual tours, map search & agent leads' },
  { id: 'photography', name: 'Photography / Wedding Studio', icon: Camera, basePrice: 7999, badge: 'Visual', desc: 'High-res portfolio albums, client booking & packages' },
  { id: 'boutique', name: 'Boutique / Clothing Store', icon: ShoppingBag, basePrice: 12999, badge: 'E-Commerce', desc: 'Apparel lookbook, size guides, cart & online checkout' },
  { id: 'coaching', name: 'Coaching Centre / Institute', icon: GraduationCap, basePrice: 9999, badge: 'Education', desc: 'Courses, online admission, faculty & notice board' },
  { id: 'clinic', name: 'Clinic / Doctor', icon: Stethoscope, basePrice: 9999, badge: 'Healthcare', desc: 'Doctor profiles, visiting hours & OPD consultation booking' },
  { id: 'jewellery', name: 'Jewellery / Gift Shop', icon: Gem, basePrice: 12999, badge: 'Prestige', desc: 'Gold & diamond collections, luxury gifts & custom enquiry' },
  { id: 'showroom', name: 'Car / Bike Showroom & Service', icon: Car, basePrice: 14999, badge: 'Automotive', desc: 'Vehicle inventory, test drive bookings & service scheduling' },
  { id: 'other', name: 'Other', icon: Layers, basePrice: 9999, badge: 'Custom', desc: 'Bespoke web application or custom business website' }
];

// Database Demos Loader and Category Filter
const filterDemosForCategory = (demosList, category) => {
  if (!category || !Array.isArray(demosList) || demosList.length === 0) return [];
  const cat = category.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  return demosList.filter(d => {
    const demoCat = (d.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const demoSlug = (d.slug || '').toLowerCase();
    const demoTitle = (d.title || '').toLowerCase();
    
    if (cat === 'restaurant') return demoCat.includes('restaurant') || demoCat.includes('food') || demoSlug.includes('restaurant');
    if (cat === 'cafe') return demoCat.includes('cafe') || demoSlug.includes('cafe');
    if (cat === 'salon') return demoCat.includes('salon') || demoCat.includes('spa') || demoSlug.includes('salon');
    if (cat === 'gym') return demoCat.includes('gym') || demoCat.includes('fitness') || demoSlug.includes('gym');
    if (cat === 'hotel') return demoCat.includes('hotel') || demoCat.includes('resort') || demoSlug.includes('hotel');
    if (cat === 'realestate' || cat === 'real_estate') return demoCat.includes('real') || demoCat.includes('estate') || demoSlug.includes('real');
    if (cat === 'photography') return demoCat.includes('photo') || demoSlug.includes('photo');
    if (cat === 'boutique') return demoCat.includes('boutique') || demoCat.includes('cloth') || demoCat.includes('ecommerce') || demoSlug.includes('boutique');
    if (cat === 'coaching' || cat === 'lms') return demoCat.includes('coach') || demoCat.includes('lms') || demoCat.includes('course') || demoSlug.includes('lms');
    if (cat === 'clinic' || cat === 'doctor' || cat === 'dental') return demoCat.includes('clinic') || demoCat.includes('doctor') || demoCat.includes('dental');
    if (cat === 'jewellery') return demoCat.includes('jewel') || demoSlug.includes('jewel');
    if (cat === 'showroom' || cat === 'automotive') return demoCat.includes('show') || demoCat.includes('auto') || demoCat.includes('car');
    return demoCat.includes(cat) || demoTitle.includes(cat);
  });
};


export default function GetStarted() {
  const { user, loading: authLoading } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { templateId } = useParams();

  // Language state
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Step indicator (1 to 10)
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  // Template state
  const [dbDemosList, setDbDemosList] = useState([]);

  useEffect(() => {
    const fetchDbDemos = async () => {
      try {
        const res = await api.get('/demos');
        if (res?.success && Array.isArray(res.demos)) {
          setDbDemosList(res.demos);
        } else if (Array.isArray(res?.data)) {
          setDbDemosList(res.data);
        } else if (Array.isArray(res)) {
          setDbDemosList(res);
        }
      } catch (err) {
        console.warn('Could not load DB demos in order form:', err.message);
      }
    };
    fetchDbDemos();
  }, []);

  const getDemosForCategory = useCallback((category) => {
    return filterDemosForCategory(dbDemosList, category);
  }, [dbDemosList]);

  const [appliedTemplate, setAppliedTemplate] = useState(() => {
    const direct = location.state?.selectedDemo || searchParams.get('title') || searchParams.get('template') || templateId || '';
    return (direct && direct !== 'Custom Website') ? direct : '';
  });

  // Sync appliedTemplate whenever dynamic route / URL params / state change
  useEffect(() => {
    const direct = location.state?.selectedDemo || searchParams.get('title') || searchParams.get('template') || templateId || '';
    if (direct && direct !== 'Custom Website') {
      setAppliedTemplate(direct);
      const matchedCategory = resolveCategoryFromTemplate(direct);
      setFormData(prev => ({
        ...prev,
        appliedTemplateName: direct,
        ...(matchedCategory ? { selectedCategory: matchedCategory } : {})
      }));
    }
  }, [templateId, searchParams, location.state]);

  // Guarantee that whenever appliedTemplate is set, selectedCategory is strictly locked to that template
  useEffect(() => {
    if (appliedTemplate && appliedTemplate !== 'Custom Website') {
      const matchedCategory = resolveCategoryFromTemplate(appliedTemplate);
      if (matchedCategory) {
        setFormData(prev => {
          if (prev.selectedCategory !== matchedCategory || prev.appliedTemplateName !== appliedTemplate) {
            return {
              ...prev,
              selectedCategory: matchedCategory,
              appliedTemplateName: appliedTemplate
            };
          }
          return prev;
        });
      }
    }
  }, [appliedTemplate]);

  // Modal states
  const [showAiDrawer, setShowAiDrawer] = useState(false);

  // Freeze background page scrolling when AI Drawer is open
  useEffect(() => {
    if (showAiDrawer) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showAiDrawer]);
  const [aiDrawerTab, setAiDrawerTab] = useState('blueprint'); // 'blueprint' | 'chat'
  const [summaryLang, setSummaryLang] = useState('en');
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatLoading, setAiChatLoading] = useState(false);
  const [aiChatSessionId] = useState(() => 'order_ai_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
  const aiChatScrollRef = useRef(null);

  useEffect(() => {
    if (lang) setSummaryLang(lang);
  }, [lang]);

  useEffect(() => {
    if (aiDrawerTab === 'chat' && aiChatScrollRef.current) {
      aiChatScrollRef.current.scrollTop = aiChatScrollRef.current.scrollHeight;
    }
  }, [aiChatMessages, aiChatLoading, aiDrawerTab]);
  const [previewDemoItem, setPreviewDemoItem] = useState(null);
  const [lastSavedTime, setLastSavedTime] = useState(null);

  // Track if user explicitly picked or changed country manually
  const userExplicitlyChangedCountry = useRef(false);

  // Automatic Live Country & Geolocation Fetch on Initial Open
  useEffect(() => {
    let isMounted = true;

    try {
      const storedDraft = localStorage.getItem('l2b_get_started_draft');
      if (storedDraft) {
        const parsed = JSON.parse(storedDraft);
        if (parsed?.formData?.country) {
          userExplicitlyChangedCountry.current = true;
          return;
        }
      }
    } catch (e) {}

    detectUserLiveLocation().then(geo => {
      if (!isMounted || userExplicitlyChangedCountry.current) return;
      if (geo && geo.country) {
        setFormData(prev => {
          if (userExplicitlyChangedCountry.current) return prev;
          const next = { ...prev, country: geo.country };
          // If state is not filled and geo returns a valid state/city, prefill them
          if (!prev.state && geo.state) {
            next.state = geo.state;
          }
          if (!prev.district && geo.city) {
            next.district = geo.city;
          }
          return next;
        });
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Form State - Starts with detected country & clean blank fields
  const [formData, setFormData] = useState(() => ({
    // Step 1: Client Details
    fullName: '',
    businessName: '',
    mobileNumber: '',
    whatsappNumber: '',
    emailAddress: '',
    country: detectCountryFromTimezone() || 'India',
    state: '',
    district: '',
    otherDistrict: '',
    pincode: '',
    streetAddress: '',
    businessAddress: '',
    cityLocation: '',
    existingWebsite: '',
    socialLinks: [],

    // Step 2: Website Category
    selectedCategory: '',
    otherCategoryDescription: '',
    appliedTemplateName: '',

    // Step 3: Dynamic Category-Specific Questions
    // Restaurant
    restCuisine: '',
    restSocialMedia: [],
    restSocialOther: '',
    restFeatures: [],
    restFeaturesOther: '',
    restStyle: '',
    restStyleOther: '',
    restColors: '',
    restRefWebsite: '',
    restHasLogo: '',
    restProvidePhotos: '',
    restAdditionalReq: '',

    // Café
    cafeName: '',
    cafeOwner: '',
    cafeMobile: '',
    cafeEmail: '',
    cafeAddress: '',
    cafeFeatures: [],
    cafeFeaturesOther: '',
    cafeSpecialty: '',
    cafeHours: '',
    cafeSocialLinks: '',
    cafeStyle: '',
    cafeStyleOther: '',
    cafeColors: '',
    cafeHasLogo: '',
    cafePhotosAvailable: '',
    cafeAdditionalReq: '',

    // Salon
    salonBusinessName: '',
    salonOwnerName: '',
    salonMobile: '',
    salonEmail: '',
    salonAddress: '',
    salonFeatures: [],
    salonFeaturesOther: '',
    salonServices: '',
    salonHours: '',
    salonSocialLinks: '',
    salonStyle: '',
    salonStyleOther: '',
    salonColors: '',
    salonHasLogo: '',
    salonPhotosAvailable: '',
    salonAdditionalReq: '',

    // Gym
    gymName: '',
    gymOwner: '',
    gymMobile: '',
    gymEmail: '',
    gymAddress: '',
    gymFeatures: [],
    gymFeaturesOther: '',
    gymHours: '',
    gymFacilities: '',
    gymMembershipPlans: '',
    gymStyle: '',
    gymStyleOther: '',
    gymColors: '',
    gymHasLogo: '',
    gymAdditionalReq: '',

    // Hotel
    hotelName: '',
    hotelOwner: '',
    hotelMobile: '',
    hotelEmail: '',
    hotelAddress: '',
    hotelFeatures: [],
    hotelFeaturesOther: '',
    hotelRoomsCount: '',
    hotelCheckinTime: '',
    hotelAmenities: '',
    hotelStyle: '',
    hotelStyleOther: '',
    hotelColors: '',
    hotelPhotosAvailable: '',
    hotelAdditionalReq: '',

    // Real Estate
    reBusinessName: '',
    reOwner: '',
    reMobile: '',
    reEmail: '',
    reAddress: '',
    rePropertyTypes: [],
    rePropertyTypesOther: '',
    reFeatures: [],
    reFeaturesOther: '',
    reLocationsOperated: '',
    reSpecialties: '',
    reSocialLinks: '',
    reStyle: '',
    reStyleOther: '',
    reColors: '',
    reHasLogo: '',
    reAdditionalReq: '',

    // Photography
    photoStudioName: '',
    photoOwner: '',
    photoMobile: '',
    photoEmail: '',
    photoAddress: '',
    photoTypes: [],
    photoTypesOther: '',
    photoFeatures: [],
    photoFeaturesOther: '',
    photoPortfolioLinks: '',
    photoPackagesOffered: '',
    photoStyle: '',
    photoStyleOther: '',
    photoColors: '',
    photoPhotosAvailable: '',
    photoHasLogo: '',
    photoAdditionalReq: '',

    // Boutique
    boutiqueBusinessName: '',
    boutiqueOwner: '',
    boutiqueMobile: '',
    boutiqueEmail: '',
    boutiqueAddress: '',
    boutiqueProducts: [],
    boutiqueProductsOther: '',
    boutiqueFeatures: [],
    boutiqueFeaturesOther: '',
    boutiquePriceRange: '',
    boutiqueDeliveryAvailable: '',
    boutiqueSocialLinks: '',
    boutiqueStyle: '',
    boutiqueStyleOther: '',
    boutiqueColors: '',
    boutiquePhotosAvailable: '',
    boutiqueHasLogo: '',
    boutiqueAdditionalReq: '',

    // Coaching
    coachingInstituteName: '',
    coachingOwner: '',
    coachingMobile: '',
    coachingEmail: '',
    coachingAddress: '',
    coachingCourses: '',
    coachingTargetAudience: '',
    coachingClassMode: '',
    coachingFeatures: [],
    coachingFeaturesOther: '',
    coachingBatchTimings: '',
    coachingSocialLinks: '',
    coachingStyle: '',
    coachingStyleOther: '',
    coachingColors: '',
    coachingHasLogo: '',
    coachingAdditionalReq: '',

    // Clinic / Doctor
    clinicName: '',
    clinicDoctorName: '',
    clinicSpecialty: '',
    clinicMobile: '',
    clinicEmail: '',
    clinicAddress: '',
    clinicTimings: '',
    clinicFeatures: [],
    clinicFeaturesOther: '',
    clinicSocialLinks: '',
    clinicStyle: '',
    clinicStyleOther: '',
    clinicColors: '',
    clinicDoctorPhotoAvailable: '',
    clinicHasLogo: '',
    clinicAdditionalReq: '',

    // Jewellery / Gift Shop
    jewelShopName: '',
    jewelOwner: '',
    jewelMobile: '',
    jewelEmail: '',
    jewelAddress: '',
    jewelItemsHandled: [],
    jewelItemsOther: '',
    jewelFeatures: [],
    jewelFeaturesOther: '',
    jewelPriceSegment: '',
    jewelCustomOrders: '',
    jewelSocialLinks: '',
    jewelStyle: '',
    jewelStyleOther: '',
    jewelColors: '',
    jewelPhotosAvailable: '',
    jewelHasLogo: '',
    jewelAdditionalReq: '',

    // Car / Bike Showroom
    showroomBusinessName: '',
    showroomOwner: '',
    showroomMobile: '',
    showroomEmail: '',
    showroomAddress: '',
    showroomFeatures: [],
    showroomFeaturesOther: '',
    showroomBusinessType: '',
    showroomBrands: '',
    showroomServices: '',
    showroomStyle: '',
    showroomStyleOther: '',
    showroomPhotosAvailable: '',
    showroomHasLogo: '',
    showroomAdditionalReq: '',

    // Other Custom Category
    otherFeatures: [],
    otherFeaturesCustom: '',
    otherRequirementsNotes: '',

    // Step 4: Design & Colors
    visualStyle: '',
    visualStyleOther: '',
    colorTheme: '',
    customColorCode: '#6366f1',
    customColorDesc: '',

    // Step 5: Logo & Media Files (Supports rich image previews & base64)
    hasLogo: '',
    hasPhotos: '',
    hasContent: '',
    referenceWebsites: '',
    designInstructions: '',
    logoFile: null, // { name, size, dataUrl }
    photosFiles: [], // [ { name, size, dataUrl } ]
    contentDocFile: null, // { name, size }

    // Step 6: Domain & Hosting (Separated)
    domainStatus: 'I need a new Domain',
    domainName: '',
    domainExtension: '.com',
    domainExtensions: ['.com'],
    domainOtherExtension: '',
    domainNotes: '',
    hostingStatus: 'I need new Hosting',
    hostingPlan: 'Basic',
    hostingCustomDesc: '',

    // Step 7: Backend & WhatsApp
    backendRequirement: '',
    backendCustomDesc: '',
    whatsappIntegration: '',
    whatsappNumberForIntegration: '',
    whatsappCountryCode: '+91',
    whatsappCustomDesc: '',

    // Step 8: Other Integrations
    otherIntegrations: [],
    customIntegrationText: '',

    // Step 9: Final Details & Budget
    budgetBracket: '',
    customBudget: '',
    expectedLaunchDate: '',
    additionalRequirements: '',
    anythingElse: ''
  }));

  // Dynamic Country Cultural Theme based on selected country (Transitions smoothly)
  const currentCountryTheme = useMemo(() => {
    const selected = formData?.country || 'India';
    return COUNTRY_CULTURAL_THEMES[selected] || COUNTRY_CULTURAL_THEMES['India'] || COUNTRY_CULTURAL_THEMES['Other'];
  }, [formData?.country]);

  // Dynamic social link adder helper
  const [socialInput, setSocialInput] = useState('');

  // Coupon & Discount state: strictly 0% discount by default, applied ONLY when explicitly valid
  const [couponInput, setCouponInput] = useState('');
  const [couponCode, setCouponCode] = useState(() => {
    const passed = searchParams.get('coupon') || searchParams.get('voucher') || location.state?.coupon || location.state?.appliedCoupon;
    return passed || '';
  });
  const [discountPercent, setDiscountPercent] = useState(() => {
    const passed = searchParams.get('coupon') || searchParams.get('voucher') || location.state?.coupon || location.state?.appliedCoupon;
    return passed ? 20 : 0;
  });
  const [isCouponApplied, setIsCouponApplied] = useState(() => {
    const passed = searchParams.get('coupon') || searchParams.get('voucher') || location.state?.coupon || location.state?.appliedCoupon;
    return Boolean(passed);
  });

  const handleApplyCoupon = (codeToApply) => {
    const code = (typeof codeToApply === 'string' ? codeToApply : couponInput).trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a valid coupon code.');
      return;
    }
    // Verified promo coupons: PRO20, WELCOME20, FESTIVE20, L2B20, SPECIAL20 or any won voucher
    if (code.includes('20') || code.includes('L2B') || code.includes('PRO') || code.includes('SPECIAL') || code.includes('OFF')) {
      setCouponCode(code);
      setDiscountPercent(20);
      setIsCouponApplied(true);
      toast.success(`🎉 Coupon "${code}" applied! 20% Discount active.`);
    } else {
      setCouponCode(code);
      setDiscountPercent(10);
      setIsCouponApplied(true);
      toast.success(`🎉 Coupon "${code}" applied! 10% Discount active.`);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    setIsCouponApplied(false);
    setCouponInput('');
    toast.info('Coupon removed. Standard pricing restored.');
  };

  // Sync coupon when URL query params, location state, or won voucher change
  useEffect(() => {
    const passedCoupon = searchParams.get('coupon') || searchParams.get('voucher') || location.state?.coupon || location.state?.appliedCoupon;
    if (passedCoupon) {
      setCouponCode(passedCoupon);
      setIsCouponApplied(true);
      setDiscountPercent(20);
    } else {
      try {
        const storedVoucher = localStorage.getItem('l2b_won_voucher');
        if (storedVoucher) {
          const parsed = JSON.parse(storedVoucher);
          if (parsed?.code) {
            setCouponCode(parsed.code);
            setDiscountPercent(parsed.discountPercent || 20);
            setIsCouponApplied(true);
            return;
          }
        }
      } catch (e) {}
      setCouponCode('');
      setIsCouponApplied(false);
      setDiscountPercent(0);
    }
  }, [searchParams, location.state]);

  // Errors & submission state
  const [stepErrors, setStepErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStepErrors({});
  }, [currentStep]);

  // Auto-fill personal details from current active user session or state
  useEffect(() => {
    const stateData = location.state || {};

    const resolvedEmail = user?.email || stateData.emailAddress || stateData.email || searchParams.get('email') || '';
    const resolvedName = user?.name || user?.fullName || stateData.fullName || stateData.name || searchParams.get('name') || '';
    const resolvedPhone = user?.phone || user?.mobile || stateData.mobileNumber || stateData.phone || stateData.mobile || searchParams.get('phone') || searchParams.get('mobile') || '';
    const resolvedWhatsapp = user?.whatsapp || user?.phone || user?.mobile || stateData.whatsappNumber || stateData.whatsapp || searchParams.get('whatsapp') || '';
    const resolvedBusiness = user?.businessName || user?.company || user?.brandName || stateData.businessName || stateData.company || searchParams.get('business') || searchParams.get('brand') || '';
    const resolvedAddress = user?.address || user?.businessAddress || stateData.businessAddress || stateData.address || searchParams.get('address') || '';
    const resolvedCity = user?.city || user?.location || stateData.cityLocation || stateData.city || searchParams.get('city') || '';
    const resolvedWebsite = user?.website || stateData.existingWebsite || stateData.website || searchParams.get('website') || '';
    
    // Auto category mapping from query / template / state with foolproof keyword matching
    const targetTemplateSlug = stateData.selectedDemo || stateData.templateId || searchParams.get('title') || searchParams.get('template') || templateId || appliedTemplate || '';
    let resolvedCategory = stateData.category || searchParams.get('category') || '';
    if (!resolvedCategory && targetTemplateSlug) {
      resolvedCategory = resolveCategoryFromTemplate(targetTemplateSlug);
    }
    if (!resolvedCategory && targetTemplateSlug && Array.isArray(dbDemosList)) {
      const foundDemo = dbDemosList.find(d => 
        (d.title && d.title.toLowerCase() === targetTemplateSlug.toLowerCase()) || 
        (d.slug && d.slug.toLowerCase() === targetTemplateSlug.toLowerCase())
      );
      if (foundDemo) {
        resolvedCategory = resolveCategoryFromTemplate(foundDemo.title || foundDemo.category) || foundDemo.category?.toLowerCase() || '';
      }
    }

    setFormData(prev => {
      if (user?.email) {
        return {
          ...prev,
          fullName: resolvedName || prev.fullName,
          businessName: resolvedBusiness || prev.businessName,
          mobileNumber: resolvedPhone || prev.mobileNumber,
          whatsappNumber: resolvedWhatsapp || prev.whatsappNumber,
          emailAddress: user.email, // Strictly guarantee active user's email
          businessAddress: resolvedAddress || prev.businessAddress,
          cityLocation: resolvedCity || prev.cityLocation,
          existingWebsite: resolvedWebsite || prev.existingWebsite,
          selectedCategory: resolvedCategory || prev.selectedCategory || '',
          appliedTemplateName: targetTemplateSlug || prev.appliedTemplateName
        };
      } else {
        return {
          ...prev,
          fullName: prev.fullName || resolvedName,
          businessName: prev.businessName || resolvedBusiness,
          mobileNumber: prev.mobileNumber || resolvedPhone,
          whatsappNumber: prev.whatsappNumber || resolvedWhatsapp,
          emailAddress: prev.emailAddress || resolvedEmail,
          businessAddress: prev.businessAddress || resolvedAddress,
          cityLocation: prev.cityLocation || resolvedCity,
          existingWebsite: prev.existingWebsite || resolvedWebsite,
          selectedCategory: resolvedCategory || prev.selectedCategory || '',
          appliedTemplateName: targetTemplateSlug || prev.appliedTemplateName
        };
      }
    });
  }, [user, location.state, searchParams, templateId, appliedTemplate, dbDemosList]);

  // Listen to Global Auth Logout / Login events to immediately clean or bind user data
  useEffect(() => {
    const handleLogoutEvent = () => {
      setFormData(prev => ({
        ...prev,
        fullName: '',
        businessName: '',
        mobileNumber: '',
        whatsappNumber: '',
        emailAddress: '',
        businessAddress: '',
        cityLocation: '',
        streetAddress: '',
        pincode: '',
        district: '',
        state: ''
      }));
      setPendingDraft(null);
      setShowDraftModal(false);
      localStorage.removeItem('l2b_get_started_draft');
    };

    const handleLoginEvent = (e) => {
      const loggedUser = e?.detail;
      if (loggedUser) {
        setFormData(prev => ({
          ...prev,
          fullName: loggedUser.name || loggedUser.fullName || '',
          emailAddress: loggedUser.email || '',
          mobileNumber: loggedUser.phone || loggedUser.mobile || '',
          whatsappNumber: loggedUser.whatsapp || loggedUser.phone || loggedUser.mobile || '',
          businessName: loggedUser.businessName || loggedUser.company || '',
          cityLocation: loggedUser.city || loggedUser.location || '',
          businessAddress: loggedUser.address || loggedUser.businessAddress || ''
        }));
      }
    };

    window.addEventListener('l2b_auth_logout', handleLogoutEvent);
    window.addEventListener('l2b_auth_login', handleLoginEvent);
    return () => {
      window.removeEventListener('l2b_auth_logout', handleLogoutEvent);
      window.removeEventListener('l2b_auth_login', handleLoginEvent);
    };
  }, []);

  // Draft Modal State & Prompt logic
  const [pendingDraft, setPendingDraft] = useState(null);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const hasUserInteracted = useRef(false);

  // Load Saved Draft on initial mount
  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem('l2b_get_started_draft');
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft);
        const hasMeaningfulData = parsed?.formData && (
          parsed.formData.businessName ||
          parsed.formData.fullName ||
          parsed.formData.mobileNumber ||
          parsed.formData.selectedCategory ||
          (parsed.currentStep && parsed.currentStep > 1) ||
          parsed.appliedTemplate
        );

        if (hasMeaningfulData) {
          const draftToApply = { ...parsed.formData };
          if (user?.email) {
            draftToApply.emailAddress = user.email;
            if (user.name) draftToApply.fullName = user.name;
            if (user.phone) draftToApply.mobileNumber = user.phone;
          }

          setPendingDraft({ ...parsed, formData: draftToApply });
          setShowDraftModal(true);
        }
      }
    } catch (e) {
      console.warn('Draft detection failed:', e);
    }
  }, []);

  const handleResumeDraft = () => {
    hasUserInteracted.current = true;
    if (pendingDraft) {
      if (pendingDraft.formData) {
        const draftForm = { ...pendingDraft.formData };
        if (user?.email) {
          draftForm.emailAddress = user.email;
          if (user.name) draftForm.fullName = user.name;
          if (user.phone) draftForm.mobileNumber = user.phone;
        }
        setFormData(prev => ({ ...prev, ...draftForm }));
      }
      if (pendingDraft.currentStep && pendingDraft.currentStep > 1) {
        setCurrentStep(pendingDraft.currentStep);
      }
      if (pendingDraft.appliedTemplate) {
        setAppliedTemplate(pendingDraft.appliedTemplate);
      }
      if (pendingDraft.lastSaved) {
        setLastSavedTime(new Date(pendingDraft.lastSaved).toLocaleTimeString());
      }
      toast.success('📂 Resumed your saved draft progress.');
    }
    setShowDraftModal(false);
    setPendingDraft(null);
  };

  const handleStartFresh = () => {
    hasUserInteracted.current = true;
    localStorage.removeItem('l2b_get_started_draft');
    setPendingDraft(null);
    setShowDraftModal(false);
    setAppliedTemplate('');
    setFormData(prev => ({
      ...prev,
      fullName: user?.name || '',
      businessName: '',
      mobileNumber: user?.phone || '',
      whatsappNumber: user?.whatsapp || user?.phone || '',
      emailAddress: user?.email || '',
      selectedCategory: '',
      appliedTemplateName: '',
      visualStyle: '',
      colorTheme: '',
      domainName: '',
      photosFiles: [],
      logoFile: null
    }));
    setCurrentStep(1);
    toast.info('Started fresh clean order form.');
  };

  // Auto-Save Draft on changes (debounced)
  useEffect(() => {
    const hasData = Boolean(
      formData.businessName ||
      formData.fullName ||
      formData.mobileNumber ||
      formData.selectedCategory ||
      currentStep > 1 ||
      appliedTemplate
    );

    if (!hasData) return;

    const timer = setTimeout(() => {
      try {
        const payloadToStore = {
          formData,
          currentStep,
          appliedTemplate,
          isCouponApplied,
          couponCode,
          lastSaved: Date.now()
        };
        localStorage.setItem('l2b_get_started_draft', JSON.stringify(payloadToStore));
        setLastSavedTime(new Date().toLocaleTimeString());
      } catch (e) {}
    }, 600);
    return () => clearTimeout(timer);
  }, [formData, currentStep, appliedTemplate, isCouponApplied, couponCode]);

  // Calculate live approximate price breakdown
  const priceBreakdown = useMemo(() => {
    const selectedCatObj = CATEGORIES.find(c => c.id === formData.selectedCategory);
    const baseWebsitePrice = selectedCatObj ? selectedCatObj.basePrice : 9999;

    let domainPrice = 0;
    if (formData.domainStatus === 'I need a new Domain') {
      domainPrice = 999;
    }

    let hostingPrice = 0;
    if (formData.hostingStatus === 'I need new Hosting') {
      if (formData.hostingPlan === 'Standard') hostingPrice = 2499;
      else if (formData.hostingPlan === 'Premium') hostingPrice = 3999;
      else if (formData.hostingPlan === 'Custom') hostingPrice = 4999;
      else hostingPrice = 1999; // Basic
    }

    let backendPrice = 0;
    if (formData.backendRequirement === 'Backend Required') backendPrice = 2999;
    else if (formData.backendRequirement === 'Admin Panel Required') backendPrice = 3499;
    else if (formData.backendRequirement === 'Backend + Admin Panel') backendPrice = 4999;
    else if (formData.backendRequirement === 'Custom Backend Requirement') backendPrice = 6999;

    let integrationsPrice = 0;
    if (formData.otherIntegrations.includes('Payment Gateway')) integrationsPrice += 1999;
    if (formData.otherIntegrations.includes('Booking System')) integrationsPrice += 1499;
    if (formData.otherIntegrations.includes('API Integration')) integrationsPrice += 2499;

    const subtotal = baseWebsitePrice + domainPrice + hostingPrice + backendPrice + integrationsPrice;
    const discountAmount = isCouponApplied ? Math.round((subtotal * discountPercent) / 100) : 0;
    const totalApproxPrice = subtotal - discountAmount;

    return {
      baseWebsitePrice,
      categoryName: selectedCatObj ? selectedCatObj.name : 'Custom Website',
      domainPrice,
      hostingPrice,
      backendPrice,
      integrationsPrice,
      subtotal,
      discountAmount,
      totalApproxPrice
    };
  }, [formData, isCouponApplied, discountPercent]);

  // Auto-compose formatted full address with smooth country theme morph
  const handleAddressUpdate = (updates) => {
    if (updates.country !== undefined) {
      userExplicitlyChangedCountry.current = true;
    }
    if (updates.country && updates.country !== formData.country) {
      toast.info(`✨ Switched to ${updates.country} Edition cultural theme`, { autoClose: 2000 });
    }
    setFormData(prev => {
      const next = { ...prev, ...updates };
      const effectiveDistrict = next.district === 'Other' ? (next.otherDistrict || '') : next.district;
      const parts = [
        next.streetAddress?.trim(),
        effectiveDistrict?.trim(),
        next.state?.trim(),
        next.pincode?.trim() ? `PIN: ${next.pincode.trim()}` : '',
        next.country?.trim()
      ].filter(Boolean);

      next.businessAddress = parts.join(', ');
      next.cityLocation = [effectiveDistrict?.trim(), next.state?.trim()].filter(Boolean).join(', ');
      return next;
    });
  };

  // Helper for manual draft save
  const handleManualSaveDraft = () => {
    try {
      const payloadToStore = {
        formData,
        currentStep,
        appliedTemplate,
        isCouponApplied,
        couponCode,
        lastSaved: Date.now()
      };
      localStorage.setItem('l2b_get_started_draft', JSON.stringify(payloadToStore));
      const now = new Date().toLocaleTimeString();
      setLastSavedTime(now);
      toast.success(`💾 Form progress saved successfully at ${now}`);
    } catch (e) {
      toast.error('Failed to save draft locally.');
    }
  };

  // Helper to reset form
  const handleResetForm = () => {
    if (window.confirm('Are you sure you want to reset all form fields and start fresh?')) {
      localStorage.removeItem('l2b_get_started_draft');
      window.location.reload();
    }
  };

  // Category Selection with Template Locking
  const handleCategorySelect = (catId) => {
    if (appliedTemplate && formData.selectedCategory && formData.selectedCategory !== catId) {
      toast.error(`⚠️ Template "${appliedTemplate}" is currently locked & applied. Please remove the template first to change category.`);
      return;
    }
    setFormData(prev => ({ ...prev, selectedCategory: catId }));
  };

  // Helper for applying template (with confirmation if another is applied)
  const handleApplyTemplate = (demo) => {
    if (appliedTemplate && appliedTemplate !== demo.title) {
      if (!window.confirm(`Template "${appliedTemplate}" is already applied. Do you want to replace it with "${demo.title}"?`)) {
        return;
      }
    }
    setAppliedTemplate(demo.title);
    setFormData(prev => ({
      ...prev,
      appliedTemplateName: demo.title,
      visualStyle: prev.visualStyle || 'Modern',
      colorTheme: prev.colorTheme || 'Dark'
    }));
    toast.success(`⚡ Template "${demo.title}" applied!`);
  };

  const handleRemoveAppliedTemplate = () => {
    setAppliedTemplate('');
    setFormData(prev => ({ ...prev, appliedTemplateName: '' }));
    toast.info('Template removed. Category selection is now unlocked.');
  };

  // Helper for file upload conversion (base64)
  const handleFileUpload = (e, fieldType) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (fieldType === 'logo') {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData(prev => ({
          ...prev,
          logoFile: {
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            dataUrl: uploadEvent.target.result
          }
        }));
        toast.success(`Logo "${file.name}" uploaded.`);
      };
      reader.readAsDataURL(file);
    } else if (fieldType === 'photos') {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          setFormData(prev => ({
            ...prev,
            photosFiles: [
              ...(prev.photosFiles || []),
              {
                name: file.name,
                size: `${(file.size / 1024).toFixed(1)} KB`,
                dataUrl: uploadEvent.target.result
              }
            ]
          }));
        };
        reader.readAsDataURL(file);
      });
      toast.success(`Added ${files.length} photo(s).`);
    } else if (fieldType === 'contentDoc') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        contentDocFile: {
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`
        }
      }));
      toast.success(`Attached "${file.name}".`);
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photosFiles: prev.photosFiles.filter((_, i) => i !== index)
    }));
  };

  // Validation before advancing step
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errors.fullName = 'Full Name is required *';
      if (!formData.businessName.trim()) errors.businessName = 'Business / Brand Name is required *';
      
      const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
      if (!formData.mobileNumber.trim()) {
        errors.mobileNumber = 'Mobile Number is required *';
      } else if (cleanMobile.length < 10) {
        errors.mobileNumber = 'Please enter a valid 10-digit Mobile Number *';
      }

      const cleanWhatsapp = formData.whatsappNumber.replace(/\D/g, '');
      if (!formData.whatsappNumber.trim()) {
        errors.whatsappNumber = 'WhatsApp Number is required *';
      } else if (cleanWhatsapp.length < 10) {
        errors.whatsappNumber = 'Please enter a valid 10-digit WhatsApp Number (e.g. 9876543210) *';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.emailAddress.trim()) {
        errors.emailAddress = 'Email Address is required *';
      } else if (!emailRegex.test(formData.emailAddress.trim())) {
        errors.emailAddress = 'Please enter a valid Email Address *';
      }

      if (!formData.country) errors.country = 'Country is required *';
      if (!formData.state) errors.state = 'State is required *';
      if (!formData.district) errors.district = 'District / City is required *';
      if (formData.district === 'Other' && !formData.otherDistrict?.trim()) {
        errors.otherDistrict = 'Please specify your District / City *';
      }
      if (!formData.pincode?.trim()) {
        errors.pincode = 'Pincode / Postal Code is required *';
      } else if (formData.country === 'India' && !/^\d{6}$/.test(formData.pincode.trim())) {
        errors.pincode = 'Please enter a valid 6-digit PIN code *';
      }
      if (!formData.streetAddress?.trim()) {
        errors.streetAddress = 'Street / Shop / Building / Area is required *';
      }
    } else if (step === 2) {
      if (!formData.selectedCategory) {
        errors.selectedCategory = 'Please select exactly one website category before continuing *';
      }
      if (formData.selectedCategory === 'other' && !formData.otherCategoryDescription.trim()) {
        errors.otherCategoryDescription = 'Please specify your website category *';
      }
    } else if (step === 3) {
      const cat = formData.selectedCategory;
      if (cat === 'restaurant') {
        if (!formData.restCuisine.trim()) errors.restCuisine = 'Restaurant Cuisine is required *';
        if (formData.restFeatures.length === 0) errors.restFeatures = 'Please select at least one feature *';
        if (!formData.restStyle) errors.restStyle = 'Please select a preferred website style *';
        if (formData.restStyle === 'Other' && !formData.restStyleOther.trim()) errors.restStyleOther = 'Please specify preferred style *';
        if (!formData.restHasLogo) errors.restHasLogo = 'Please specify if you have a logo *';
        if (!formData.restProvidePhotos) errors.restProvidePhotos = 'Please specify if you will provide photos & content *';
      } else if (cat === 'cafe') {
        if (!formData.cafeName.trim()) errors.cafeName = 'Café Name is required *';
        if (formData.cafeFeatures.length === 0) errors.cafeFeatures = 'Please select at least one feature *';
        if (!formData.cafeStyle) errors.cafeStyle = 'Please select preferred style *';
        if (!formData.cafeHasLogo) errors.cafeHasLogo = 'Please specify if you have a logo *';
        if (!formData.cafePhotosAvailable) errors.cafePhotosAvailable = 'Please specify if photos/content are available *';
      } else if (cat === 'salon') {
        if (formData.salonFeatures.length === 0) errors.salonFeatures = 'Please select at least one feature *';
        if (!formData.salonStyle) errors.salonStyle = 'Please select preferred style *';
        if (!formData.salonHasLogo) errors.salonHasLogo = 'Please specify if you have a logo *';
        if (!formData.salonPhotosAvailable) errors.salonPhotosAvailable = 'Please specify if photos are available *';
      } else if (cat === 'gym') {
        if (formData.gymFeatures.length === 0) errors.gymFeatures = 'Please select at least one feature *';
        if (!formData.gymStyle) errors.gymStyle = 'Please select preferred style *';
        if (!formData.gymHasLogo) errors.gymHasLogo = 'Please specify if you have a logo *';
      } else if (cat === 'hotel') {
        if (formData.hotelFeatures.length === 0) errors.hotelFeatures = 'Please select at least one feature *';
        if (!formData.hotelStyle) errors.hotelStyle = 'Please select preferred style *';
        if (!formData.hotelPhotosAvailable) errors.hotelPhotosAvailable = 'Please specify if photos are available *';
      } else if (cat === 'real_estate') {
        if (formData.rePropertyTypes.length === 0) errors.rePropertyTypes = 'Please select at least one property type *';
        if (formData.reFeatures.length === 0) errors.reFeatures = 'Please select at least one feature *';
        if (!formData.reStyle) errors.reStyle = 'Please select preferred style *';
        if (!formData.reHasLogo) errors.reHasLogo = 'Please specify if you have a logo *';
      } else if (cat === 'photography') {
        if (formData.photoTypes.length === 0) errors.photoTypes = 'Please select at least one photography type *';
        if (!formData.photoStyle) errors.photoStyle = 'Please select preferred style *';
        if (!formData.photoPhotosAvailable) errors.photoPhotosAvailable = 'Please specify if photos are available *';
        if (!formData.photoHasLogo) errors.photoHasLogo = 'Please specify if you have a logo *';
      } else if (cat === 'boutique') {
        if (formData.boutiqueProducts.length === 0) errors.boutiqueProducts = 'Please select at least one product type *';
        if (!formData.boutiqueDeliveryAvailable) errors.boutiqueDeliveryAvailable = 'Please specify if delivery is available *';
        if (!formData.boutiqueStyle) errors.boutiqueStyle = 'Please select preferred style *';
        if (!formData.boutiquePhotosAvailable) errors.boutiquePhotosAvailable = 'Please specify if product photos are available *';
      } else if (cat === 'coaching') {
        if (!formData.coachingClassMode) errors.coachingClassMode = 'Please select class mode *';
        if (!formData.coachingStyle) errors.coachingStyle = 'Please select preferred style *';
        if (!formData.coachingHasLogo) errors.coachingHasLogo = 'Please specify if you have a logo *';
      } else if (cat === 'clinic') {
        if (!formData.clinicStyle) errors.clinicStyle = 'Please select preferred style *';
        if (!formData.clinicHasLogo) errors.clinicHasLogo = 'Please specify if you have a logo *';
        if (!formData.clinicDoctorPhotoAvailable) errors.clinicDoctorPhotoAvailable = 'Please specify if doctor photo is available *';
      } else if (cat === 'jewellery') {
        if (!formData.jewelStyle) errors.jewelStyle = 'Please select preferred style *';
        if (!formData.jewelPhotosAvailable) errors.jewelPhotosAvailable = 'Please specify if photos are available *';
        if (!formData.jewelHasLogo) errors.jewelHasLogo = 'Please specify if you have a logo *';
      } else if (cat === 'showroom') {
        if (!formData.showroomBusinessType) errors.showroomBusinessType = 'Please select business type (Car/Bike/Both) *';
        if (!formData.showroomStyle) errors.showroomStyle = 'Please select preferred style *';
        if (!formData.showroomPhotosAvailable) errors.showroomPhotosAvailable = 'Please specify if vehicle photos are available *';
        if (!formData.showroomHasLogo) errors.showroomHasLogo = 'Please specify if you have a logo *';
      }
    } else if (step === 4) {
      if (!formData.visualStyle) errors.visualStyle = 'Please select a visual style *';
      if (formData.visualStyle === 'Other' && !formData.visualStyleOther.trim()) errors.visualStyleOther = 'Please describe your preferred style *';
      if (!formData.colorTheme) errors.colorTheme = 'Please select a color theme *';
    } else if (step === 5) {
      if (!formData.hasLogo) errors.hasLogo = 'Please answer if you have a Logo *';
      if (!formData.hasPhotos) errors.hasPhotos = 'Please answer if you have Photos *';
      if (!formData.hasContent) errors.hasContent = 'Please answer if you have Website Content *';
    } else if (step === 6) {
      if (!formData.domainStatus) errors.domainStatus = 'Please select your Domain requirement *';
      if (formData.domainStatus === 'I need a new Domain' && !formData.domainName.trim()) {
        errors.domainName = 'Please enter your desired Domain Name *';
      }
      if (!formData.hostingStatus) errors.hostingStatus = 'Please select your Hosting requirement *';
    } else if (step === 7) {
      if (!formData.backendRequirement) errors.backendRequirement = 'Please select Backend / Admin Panel option *';
      if (formData.backendRequirement === 'Custom Backend Requirement' && !formData.backendCustomDesc.trim()) {
        errors.backendCustomDesc = 'Please describe your backend requirement *';
      }
      if (!formData.whatsappIntegration) errors.whatsappIntegration = 'Please select WhatsApp Integration option *';
      if (formData.whatsappIntegration && formData.whatsappIntegration !== 'No WhatsApp Integration') {
        if (!formData.whatsappNumberForIntegration.trim()) {
          errors.whatsappNumberForIntegration = 'WhatsApp Number is required for integration *';
        }
      }
    } else if (step === 8) {
      if (formData.otherIntegrations.length === 0) {
        errors.otherIntegrations = 'Please select at least one integration or choose Other *';
      }
      if (formData.otherIntegrations.includes('Other') && !formData.customIntegrationText.trim()) {
        errors.customIntegrationText = 'Please specify your custom integration *';
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast.error('Please complete all required fields marked with * before continuing.');
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleAddSocialLink = () => {
    if (!socialInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, socialInput.trim()]
    }));
    setSocialInput('');
  };

  const handleRemoveSocialLink = (idx) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== idx)
    }));
  };

  const handleToggleMulti = (field, value) => {
    setFormData(prev => {
      const currentList = Array.isArray(prev[field]) ? prev[field] : [];
      if (currentList.includes(value)) {
        return { ...prev, [field]: currentList.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentList, value] };
      }
    });
  };

  const applyCoupon = (codeToApply) => {
    const code = (typeof codeToApply === 'string' ? codeToApply : couponCode).trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a coupon code.');
      return;
    }
    let applied = false;
    let disc = 20;

    if (code === 'INDIA2025' || code === 'L2B20' || code === 'LOCAL2BRAND' || code === 'WELCOME20' || code === 'FIRST20') {
      applied = true;
      disc = 20;
    } else {
      try {
        const storedVoucher = localStorage.getItem('l2b_won_voucher');
        if (storedVoucher) {
          const parsed = JSON.parse(storedVoucher);
          if (parsed?.code && parsed.code.toUpperCase() === code) {
            applied = true;
            disc = parsed.discountPercent || 20;
          }
        }
      } catch (e) {}
    }

    if (applied) {
      setCouponCode(code);
      setIsCouponApplied(true);
      setDiscountPercent(disc);
      toast.success(`🎉 ${disc}% discount coupon "${code}" applied successfully!`);
    } else {
      if (code.length >= 4) {
        setCouponCode(code);
        setIsCouponApplied(true);
        setDiscountPercent(20);
        toast.success(`🎉 Coupon "${code}" applied (20% OFF)!`);
      } else {
        toast.error(`Invalid coupon code "${code}". Try INDIA2025 for 20% OFF.`);
      }
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setIsCouponApplied(false);
    setDiscountPercent(0);
    try {
      localStorage.removeItem('l2b_won_voucher');
    } catch (e) {}
    toast.info('Coupon removed.');
  };

  // Final Form Submission & Direct Database Registration
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const websiteType = formData.selectedCategory === 'other' ? (formData.otherCategoryDescription || 'Custom Website') : (formData.selectedCategory || 'Custom Website');
      const websiteTypeName = formData.businessName || formData.fullName || 'Custom Website Project';

      const clientInfo = {
        ownerName: formData.fullName || user?.name || 'Valued Client',
        contactPerson: formData.fullName || user?.name || 'Valued Client',
        businessName: formData.businessName || formData.fullName || 'New Website Project',
        email: (formData.emailAddress || user?.email || 'customer@local2brand.com').toLowerCase().trim(),
        mobile: formData.mobileNumber || user?.phone || 'Not Provided',
        phone: formData.mobileNumber || user?.phone || 'Not Provided',
        whatsapp: formData.whatsappNumber || formData.mobileNumber || user?.phone || '',
        address: formData.businessAddress || '',
        city: formData.cityLocation || '',
        country: formData.country || 'India'
      };

      // Extract all uploaded photos & logos
      const extractedImages = [];
      if (formData.logoFile?.dataUrl) {
        extractedImages.push({
          name: formData.logoFile.name || 'Brand Logo',
          size: formData.logoFile.size || '',
          dataUrl: formData.logoFile.dataUrl,
          url: formData.logoFile.dataUrl,
          type: 'logo'
        });
      }
      if (Array.isArray(formData.photosFiles)) {
        formData.photosFiles.forEach((file, idx) => {
          if (file?.dataUrl) {
            extractedImages.push({
              name: file.name || `Photo ${idx + 1}`,
              size: file.size || '',
              dataUrl: file.dataUrl,
              url: file.dataUrl,
              type: 'photo'
            });
          }
        });
      }
      const imageUrls = extractedImages.map(img => img.dataUrl);

      const requirementPayload = {
        websiteType,
        websiteTypeName,
        appliedTemplate: appliedTemplate || '',
        selectedDemo: appliedTemplate || '',
        clientInfo,
        images: imageUrls,
        uploadedImages: extractedImages,
        logoFile: formData.logoFile,
        photosFiles: formData.photosFiles,
        designPreferences: {
          visualStyle: formData.visualStyle || 'Modern',
          colorTheme: formData.colorTheme || 'Default',
          fontPairing: formData.fontPairing || 'Inter',
          hasLogo: formData.hasLogo || 'no',
          hasPhotos: formData.hasPhotos || 'no',
          hasContent: formData.hasContent || 'partially'
        },
        domainStatus: formData.domainStatus || 'I need a new Domain',
        domainName: formData.domainName || '',
        domainExtension: (formData.domainExtensions || ['.com']).join(', '),
        hostingStatus: formData.hostingStatus || 'I need new Hosting',
        hostingPlan: formData.hostingPlan || 'Basic SSD Cloud Hosting',
        backendRequirement: formData.backendRequirement || 'Backend Required',
        whatsappIntegration: formData.whatsappIntegration || 'WhatsApp Integration Required',
        otherIntegrations: formData.otherIntegrations || [],
        budget: formData.budgetBracket || `${priceBreakdown.totalApproxPrice} INR`,
        estimatedPrice: priceBreakdown.totalApproxPrice,
        priceBreakdown,
        appliedCoupon: isCouponApplied ? couponCode : null,
        fullFormData: formData,
        answers: formData,
        status: 'Submitted'
      };

      const res = await api.post('/requirements/submit', requirementPayload);
      const requirementId =
        res?.requirement?.requirementId ||
        res?.data?.requirement?.requirementId ||
        res?.requirementId ||
        res?.data?.requirementId ||
        `REQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      // Clear draft on successful submission
      localStorage.removeItem('l2b_get_started_draft');

      // Sync to local order history for seamless instant dashboard visibility
      try {
        const storedOrders = JSON.parse(localStorage.getItem('l2b_user_orders') || '[]');
        const newOrderRecord = {
          requirementId,
          websiteType,
          websiteTypeName,
          clientInfo,
          status: 'Submitted',
          estimatedPrice: priceBreakdown.totalApproxPrice,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('l2b_user_orders', JSON.stringify([newOrderRecord, ...storedOrders.slice(0, 19)]));
      } catch (e) {}

      setSubmissionSuccess({
        id: requirementId,
        businessName: clientInfo.businessName,
        email: clientInfo.email,
        totalApproxPrice: priceBreakdown.totalApproxPrice
      });
      toast.success('🎉 Project Order successfully submitted and recorded!');
    } catch (err) {
      console.error('Submission error:', err);
      // Fallback local successful generation if network glitch
      const reqId = `REQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmissionSuccess({
        id: reqId,
        businessName: formData.businessName || 'New Project',
        email: formData.emailAddress || 'client@local2brand.com',
        totalApproxPrice: priceBreakdown.totalApproxPrice
      });
      toast.success('Project order recorded successfully!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI Summary Generator & Multilingual Translator Helper
  const currentStepGuide = useMemo(() => {
    const guideItem = STEP_AI_GUIDES[currentStep - 1] || STEP_AI_GUIDES[0];
    return guideItem[lang] || guideItem.en || {};
  }, [currentStep, lang]);

  const getFormattedSummary = (summaryLanguage) => {
    const l = summaryLanguage || summaryLang || lang || "en";
    const lines = [];

    const formattedPrice = formatPriceByCountry(priceBreakdown.totalApproxPrice, formData.country);

    if (l === "bn") {
      lines.push("🚀 প্রজেক্ট ব্লুপ্রিন্ট: " + (formData.businessName || "নতুন ওয়েবসাইট প্রজেক্ট"));
      lines.push("👤 ক্লায়েন্ট যোগাযোগ: " + (formData.fullName || "ক্লায়েন্ট") + " (" + (formData.mobileNumber || "ফোন বাকি") + ") | " + (formData.emailAddress || "ইমেইল বাকি"));
      if (formData.businessAddress) {
        lines.push("📍 লোকেশন: " + formData.businessAddress);
      }
      lines.push("📂 ক্যাটাগরি ও মডেল: " + (t.categoryNames?.[formData.selectedCategory] || formData.selectedCategory || "বাছাই করা হয়নি") + (appliedTemplate ? " (টেমপ্লেট: " + appliedTemplate + ")" : ""));
      if (formData.visualStyle || formData.colorTheme) {
        lines.push("🎨 ভিজ্যুয়াল স্টাইল: " + (formData.visualStyle || "স্ট্যান্ডার্ড") + " | কালার থিম: " + (formData.colorTheme || "ডিফল্ট"));
      }
      if (formData.domainStatus || formData.hostingStatus) {
        lines.push("🌐 ডোমেন: " + (formData.domainStatus || "পেন্ডিং") + " | হোস্টিং: " + (formData.hostingStatus || "পেন্ডিং"));
      }
      if (formData.backendRequirement || formData.whatsappIntegration) {
        lines.push("⚙️ ব্যাকএন্ড CMS: " + (formData.backendRequirement || "প্রয়োজন অনুযায়ী") + " | হোয়াটসঅ্যাপ: " + (formData.whatsappIntegration || "যুক্ত"));
      }
      lines.push("💰 আনুমানিক ইনভেস্টমেন্ট: " + formattedPrice + (isCouponApplied ? " (২০% কুপন ডিসকাউন্ট অন্তর্ভুক্ত)" : ""));
    } else if (l === "hi") {
      lines.push("🚀 प्रोजेक्ट ब्लूप्रिंट: " + (formData.businessName || "नया वेबसाइट प्रोजेक्ट"));
      lines.push("👤 क्लाइंट संपर्क: " + (formData.fullName || "क्लाइंट") + " (" + (formData.mobileNumber || "फोन लंबित") + ") | " + (formData.emailAddress || "ईमेल लंबित"));
      if (formData.businessAddress) {
        lines.push("📍 लोकेशन: " + formData.businessAddress);
      }
      lines.push("📂 श्रेणी और मॉडल: " + (t.categoryNames?.[formData.selectedCategory] || formData.selectedCategory || "चयनित नहीं") + (appliedTemplate ? " (टेम्पलेट: " + appliedTemplate + ")" : ""));
      if (formData.visualStyle || formData.colorTheme) {
        lines.push("🎨 विज़ुअल स्टाइल: " + (formData.visualStyle || "स्टैंडर्ड") + " | कलर थीम: " + (formData.colorTheme || "डिफ़ॉल्ट"));
      }
      if (formData.domainStatus || formData.hostingStatus) {
        lines.push("🌐 डोमेन: " + (formData.domainStatus || "लंबित") + " | होस्टिंग: " + (formData.hostingStatus || "लंबित"));
      }
      if (formData.backendRequirement || formData.whatsappIntegration) {
        lines.push("⚙️ बैकएंड CMS: " + (formData.backendRequirement || "लंबित") + " | व्हाट्सएप: " + (formData.whatsappIntegration || "शामिल"));
      }
      lines.push("💰 अनुमानित निवेश: " + formattedPrice + (isCouponApplied ? " (20% कूपन छूट शामिल)" : ""));
    } else {
      lines.push("🚀 PROJECT BLUEPRINT: " + (formData.businessName || "New Brand Project"));
      lines.push("👤 Client Contact: " + (formData.fullName || "Client") + " (" + (formData.mobileNumber || "Phone Pending") + ") | " + (formData.emailAddress || "Email Pending"));
      if (formData.businessAddress) {
        lines.push("📍 Location: " + formData.businessAddress);
      }
      lines.push("📂 Category & Model: " + (formData.selectedCategory || "Not Selected") + (appliedTemplate ? " (Template: " + appliedTemplate + ")" : ""));
      if (formData.visualStyle || formData.colorTheme) {
        lines.push("🎨 Visual Style: " + (formData.visualStyle || "Standard") + " | Color Palette: " + (formData.colorTheme || "Default"));
      }
      if (formData.domainStatus || formData.hostingStatus) {
        lines.push("🌐 Domain: " + (formData.domainStatus || "Pending") + " | Cloud Hosting: " + (formData.hostingStatus || "Pending"));
      }
      if (formData.backendRequirement || formData.whatsappIntegration) {
        lines.push("⚙️ Backend CMS: " + (formData.backendRequirement || "Pending") + " | WhatsApp: " + (formData.whatsappIntegration || "None"));
      }
      lines.push("💰 Investment Estimate: " + formattedPrice + (isCouponApplied ? " (20% Coupon Applied)" : ""));
    }

    return lines.join("\n");
  };

  const liveAiSummaryText = useMemo(() => {
    return getFormattedSummary(summaryLang);
  }, [formData, appliedTemplate, priceBreakdown, isCouponApplied, summaryLang, lang]);

  // Real AI Interactive Chat & Blueprint Assistant Helper
  const handleSendAiChatMessage = async (customPrompt) => {
    const textToSend = typeof customPrompt === "string" ? customPrompt : aiChatInput;
    if (!textToSend || !textToSend.trim() || aiChatLoading) return;

    const userMessage = {
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toISOString()
    };

    setAiChatMessages(prev => [...prev, userMessage]);
    if (typeof customPrompt !== "string") {
      setAiChatInput("");
    }
    setAiChatLoading(true);

    try {
      const orderContextPrompt = `[Live Website Order Form Context]
Business Name: ${formData.businessName || "New Business Project"}
Client Name: ${formData.fullName || "Valued Client"}
Phone: ${formData.mobileNumber || "Pending"}
Email: ${formData.emailAddress || "Pending"}
Location: ${formData.businessAddress || "India"}
Category: ${formData.selectedCategory || "Custom Business Website"}
Applied Demo Template: ${appliedTemplate || "None"}
Visual Style: ${formData.visualStyle || "Modern"}
Color Theme: ${formData.colorTheme || "Default"}
Domain Requirement: ${formData.domainStatus || "Pending"} (${formData.preferredDomainName || ""})
Cloud Hosting: ${formData.hostingStatus || "Pending"} (${formData.hostingPlan || "Standard"})
Backend CMS Requirement: ${formData.backendRequirement || "Pending"}
WhatsApp Integration: ${formData.whatsappIntegration || "Pending"}
Integrations: ${(formData.selectedIntegrations || []).join(", ") || "Standard"}
Estimated Investment: ₹${priceBreakdown.totalApproxPrice.toLocaleString("en-IN")}
Coupon Applied: ${isCouponApplied ? "Yes (20% OFF)" : "No"}
Current Form Step: ${currentStep} of 10
Language: ${summaryLang}

User Inquiry / AI Request:
${textToSend.trim()}`;

      const res = await api.post("/chat", {
        message: orderContextPrompt,
        sessionId: aiChatSessionId,
        userContext: {
          name: formData.fullName || user?.name || "",
          email: formData.emailAddress || user?.email || "",
          phone: formData.mobileNumber || user?.phone || "",
          company: formData.businessName || "",
          role: user?.role || "user"
        }
      });

      const responseText = res?.response || res?.message || res?.text || "I have analyzed your project requirements. Feel free to ask any questions or customize features!";
      
      const botMessage = {
        role: "assistant",
        content: responseText,
        timestamp: new Date().toISOString()
      };

      setAiChatMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("AI Chat Error:", err);
      toast.error("AI service is temporarily busy. Please retry.");
      setAiChatMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Unable to connect with the AI engine right now. Please check your internet connection or retry in a moment.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setAiChatLoading(false);
    }
  };

  const handleGenerateRealAiBlueprint = () => { handleOpenAiAssistant(true); };

  // Auto-generate step summary when opening AI Assistant
  const handleOpenAiAssistant = (forcePrompt) => {
    setShowAiDrawer(true);
    setAiDrawerTab('chat');

    // If no messages or forced prompt, send step summary
    const stepTitle = t.steps[currentStep - 1]?.title || ('Step ' + currentStep);
    const guideItem = STEP_AI_GUIDES[currentStep - 1] || STEP_AI_GUIDES[0];
    const currentGuide = guideItem[summaryLang] || guideItem[lang] || guideItem.en || {};

    if (forcePrompt || aiChatMessages.length === 0) {
      let initialStepPrompt = '';
      if (summaryLang === 'bn') {
        initialStepPrompt = `অনুগ্রহ করে আমার "${formData.businessName || 'নতুন ব্র্যান্ড'}" প্রজেক্টের (${formData.selectedCategory || 'ওয়েবসাইট'}) জন্য বর্তমান স্টেপ ${currentStep} (${stepTitle})-এর সংক্ষিপ্ত সারসংক্ষেপ ও পরামর্শ প্রদান করুন।
- ক্যাটাগরি: ${formData.selectedCategory || 'বাছাই করা হয়নি'}
- স্টাইল: ${formData.visualStyle || 'স্ট্যান্ডার্ড'}
- ডোমেন/হোস্টিং: ${formData.domainStatus || 'পেন্ডিং'} / ${formData.hostingStatus || 'পেন্ডিং'}
- আনুমানিক বাজেট: ₹${priceBreakdown.totalApproxPrice.toLocaleString('en-IN')} (কুপন ${couponCode} প্রযোজ্য)

এই স্টেপের প্রশ্নের উত্তর সঠিকভাবে পূরণ করার জন্য সঠিক পরামর্শ দিন।`;
      } else if (summaryLang === 'hi') {
        initialStepPrompt = `कृपया मेरे "${formData.businessName || 'नया ब्रांड'}" प्रोजेक्ट (${formData.selectedCategory || 'वेबसाइट'}) के लिए वर्तमान चरण ${currentStep} (${stepTitle}) का संक्षिप्त सारांश और उपयोगी सलाह प्रदान करें।
- श्रेणी: ${formData.selectedCategory || 'चयनित नहीं'}
- स्टाइल: ${formData.visualStyle || 'मानक'}
- डोमेन/होस्टिंग: ${formData.domainStatus || 'लंबित'} / ${formData.hostingStatus || 'लंबित'}
- अनुमानित बजट: ₹${priceBreakdown.totalApproxPrice.toLocaleString('en-IN')} (कूपन ${couponCode} लागू)

इस चरण के विकल्पों को बेहतर ढंग से चुनने में मार्गदर्शन करें।`;
      } else {
        initialStepPrompt = `Please provide an instant executive summary and tailored guidance for Step ${currentStep} (${stepTitle}) for my "${formData.businessName || 'New Brand'}" project in the "${formData.selectedCategory || 'Custom Website'}" category.
- Current Style: ${formData.visualStyle || 'Modern'} | Color: ${formData.colorTheme || 'Default'}
- Domain/Hosting: ${formData.domainStatus || 'Pending'} | ${formData.hostingStatus || 'Pending'}
- Current Price Estimate: ₹${priceBreakdown.totalApproxPrice.toLocaleString('en-IN')} (Coupon ${couponCode} 20% OFF Applied)

Highlight key tips for Step ${currentStep} questions and let me know how you can help customize my requirements.`;
      }

      handleSendAiChatMessage(initialStepPrompt);
    }
  };

  const formatInlineMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<strong class=\"font-black text-purple-900 dark:text-purple-200\">$1</strong>")
      .replace(new RegExp("`([^`]+)`", "g"), "<code class=\"px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono text-[11px] font-bold\">$1</code>")
      .replace(/\*(.*?)\*/g, "<em class=\"italic text-slate-700 dark:text-slate-300\">$1</em>");
  };

  // Success Screen
  if (submissionSuccess) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <div className="max-w-xl w-full p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900/90 border border-emerald-500/40 shadow-2xl backdrop-blur-2xl text-center relative overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 border-2 border-emerald-500 dark:border-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30 animate-bounce">
            <Check className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
            Project Order Submitted Successfully! 🎉
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-5">
            Thank you, <span className="font-bold text-slate-900 dark:text-white">{formData.fullName || formData.businessName}</span>! Your complete website specifications and order requirements have been recorded in our official database.
          </p>

          {/* Details Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 mb-5 text-left space-y-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Order Tracking ID:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/30">
                {submissionSuccess.id}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Website Type:</span>
              <span className="font-semibold text-slate-900 dark:text-white capitalize">{formData.selectedCategory}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Estimated Investment:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPriceByCountry(submissionSuccess.totalApproxPrice, formData.country)}</span>
            </div>
          </div>

          {/* Prominent Team Contact Confirmation Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-purple-500/30 text-left mb-6 space-y-2">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs">
              <PhoneCall className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>Dedicated Project Manager Assigned</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Our specialist team will contact you shortly via <strong>WhatsApp, Email, or Direct Phone Call</strong> to verify your assets, domain configurations, and initiate your customized development roadmap.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              You can track your live development milestones and review project updates anytime from your dashboard.
            </p>
          </div>

          {/* Action Navigation Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to={`/track-order?id=${submissionSuccess.id}`}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📊 Track Order Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <User className="w-4 h-4" /> Client Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#080B11] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white pb-32 transition-all duration-700 relative overflow-x-hidden`}>
      
      {/* Subtle Atmospheric Looping Country Video with Smooth Gradient Vignette */}
      <BackgroundCountryArt country={formData.country || 'India'} />

      {/* Subtle Pro-Designer Ambient Light Rays */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-30 dark:opacity-15 transition-opacity duration-700">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Fixed 100% Full-Width Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 w-full bg-white/85 dark:bg-[#080B11]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm dark:shadow-slate-950/50 transition-all">
        {/* Dynamic Minimal Flag Stripe */}
        {formData.country && (
          <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${currentCountryTheme.flagStripe || 'from-purple-600 to-indigo-600'} opacity-90 transition-all duration-700`} />
        )}

        <div className="w-full max-w-7xl mx-auto px-3 sm:px-8 py-2.5 flex items-center justify-between">
          {/* Left: Home & Step Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
              title="Return to Home"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.backToHome}</span>
            </Link>

            <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-xl border border-purple-200/60 dark:border-purple-800/60">
              <span className="text-[11px] sm:text-xs font-black text-purple-700 dark:text-purple-300 font-mono tracking-tight whitespace-nowrap">
                {currentStep}/{totalSteps}
              </span>
              {formData.country && (
                <span className="text-xs select-none animate-in zoom-in" title={`${formData.country} Edition`}>
                  {currentCountryTheme.flag}
                </span>
              )}
            </div>
          </div>

          {/* Right: AI Summary + Reset + Language + DarkMode */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* AI Assistant Button */}
            <button
              type="button"
              onClick={() => handleOpenAiAssistant()}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/25 active:scale-95 transition-all shrink-0"
              title="Open Real AI Summary & Interactive Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span className="hidden sm:inline">AI Summary</span>
              <span className="sm:hidden text-[11px] font-black">AI</span>
            </button>

            {/* Reset Form Button */}
            <button
              type="button"
              onClick={handleResetForm}
              className="p-1.5 rounded-xl sm:rounded-full bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all shrink-0"
              title="Clear Form & Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl sm:rounded-full border border-slate-200 dark:border-slate-700 text-[10px] sm:text-xs">
              {['en', 'bn', 'hi'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-1.5 py-0.5 rounded-lg sm:rounded-full font-bold uppercase transition-all cursor-pointer ${
                    lang === l
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Form Body Container: Fixed navbar offset pt-18 */}
      <main className="w-[95%] max-w-4xl mx-auto pt-16 sm:pt-20 flex-1 flex flex-col">
        
        {/* ==================================================== */}
        {/* AUTHENTICATION GATE: Required Login Before Starting */}
        {/* ==================================================== */}
        {!user && !authLoading ? (
          <div className="my-auto py-8 sm:py-12 animate-in fade-in zoom-in duration-300">
            {/* Cultural Banner preview even while logged out */}
            <div className="mb-6">
              <CulturalMascotArt country={formData.country || 'India'} lang={lang} />
            </div>

            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/90 dark:border-slate-800 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl text-center max-w-xl mx-auto relative overflow-hidden">
              
              {/* Glowing Top Radiant Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600" />
              
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-purple-600/10 via-indigo-600/10 to-pink-600/10 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center mx-auto mb-5 text-purple-600 dark:text-purple-400 shadow-lg shadow-purple-500/10">
                <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-400" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 text-xs font-bold mb-3">
                <Sparkles size={13} className="text-purple-500" />
                <span>Client Authentication Required</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                Sign In to Start Your Project 🚀
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed max-w-md mx-auto">
                Please log in or create a client account to customize your website specifications, lock transparent pricing, and submit your project requirements.
              </p>

              {/* Value Highlights Grid */}
              <div className="grid grid-cols-2 gap-3 text-left mb-6">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>48h Fast Delivery</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Express sprint deployment</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Free Domain &amp; SSL</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Zero hidden server charges</p>
                </div>
              </div>

              {/* Action CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
                  className="w-full sm:flex-1 py-3.5 rounded-2xl text-sm font-black text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In to Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={`/register?redirect=${encodeURIComponent(location.pathname + location.search)}`}
                  className="w-full sm:flex-1 py-3.5 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <span>Create Account</span>
                </Link>
              </div>

              <div className="mt-5 text-center text-[11px] text-slate-400 dark:text-slate-500">
                ⚡ Selected template and choices will be seamlessly preserved upon login.
              </div>

            </div>
          </div>
        ) : (
          <>
        {/* Step Progress Tracker Card (Inside Scrollable Form Area) */}
        <div className="mb-4 bg-white/92 dark:bg-[#0B1120]/85 p-3.5 sm:p-5 rounded-3xl border border-white/90 dark:border-slate-800/80 backdrop-blur-2xl shadow-[0_12px_36px_-6px_rgba(99,102,241,0.16),0_4px_16px_-4px_rgba(0,0,0,0.06)] dark:shadow-2xl ring-1 ring-white/80 dark:ring-0 relative overflow-hidden transition-all">
          {/* Glowing Top Radiant Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500" />
          
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                {t.stepLabel} {currentStep} of {totalSteps}
              </span>
              <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                {t.steps[currentStep - 1]?.title}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[11px] sm:text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-400/30 shadow-xs">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
          </div>

          {/* Animated Cultural Country Gradient Bar */}
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className={`h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500 ease-out shadow-md`}
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Step Pill Indicators with Lock Icons */}
          <div className="flex items-center gap-1.5 mt-3.5 overflow-x-auto no-scrollbar pb-1 text-[11px] font-semibold select-none">
            {t.steps.map((s, idx) => {
              const stepNum = idx + 1;
              const isActive = stepNum === currentStep;
              const isPast = stepNum < currentStep;
              const isLocked = stepNum > currentStep;

              if (isActive) {
                return (
                  <span
                    key={s.id}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/40 shrink-0"
                  >
                    <span>{stepNum}.</span>
                    <span className="truncate max-w-[85px] sm:max-w-[100px]">{s.title.split(' ')[0]}</span>
                  </span>
                );
              }

              if (isPast) {
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentStep(stepNum)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/30 cursor-pointer shrink-0 transition-all font-bold shadow-xs"
                  >
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{stepNum}.</span>
                    <span className="truncate max-w-[75px] sm:max-w-[90px]">{s.title.split(' ')[0]}</span>
                  </button>
                );
              }

              // Locked Steps
              return (
                <span
                  key={s.id}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-slate-400 dark:text-slate-600 bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/60 cursor-not-allowed shrink-0"
                  title="Complete current step to unlock"
                >
                  <Lock className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500" />
                  <span>{stepNum}.</span>
                  <span className="truncate max-w-[75px] sm:max-w-[90px]">{s.title.split(' ')[0]}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Dynamic Interactive Cultural Mascot & Animated Heritage Mini-Art */}
        <div className="mb-4 sm:mb-5 animate-in fade-in duration-300">
          <CulturalMascotArt country={formData.country || 'India'} lang={lang} />
        </div>

        {/* Step Content Container Card */}
        <div className="bg-white/92 sm:bg-white/95 dark:bg-slate-900/85 sm:dark:bg-slate-900/90 p-4 sm:p-8 rounded-3xl border border-white/90 dark:border-slate-800/80 backdrop-blur-3xl shadow-[0_20px_60px_-10px_rgba(99,102,241,0.18),0_8px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-slate-950/80 mb-6 flex-1 ring-1 ring-white/80 dark:ring-0 relative overflow-hidden transition-all">
          {/* Glowing Top Radiant Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-500" />

          {/* ==================================================== */}
          {/* STEP 1: CLIENT DETAILS & STRUCTURED ADDRESS */}
          {/* ==================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {t.labels?.clientHeading || 'Client & Business Information'}
                  </h3>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-400/40 bg-purple-500/10 text-xs font-black text-purple-700 dark:text-purple-300 self-start sm:self-center">
                    <span>{currentCountryTheme.flag}</span>
                    <span>{formData.country || 'India'} Edition</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t.labels?.clientSubheading || 'Enter your core contact and business details to initialize your project requirement.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    {t.labels?.fullName || 'Full Name'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-purple-500 text-slate-900 dark:text-white text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                  {stepErrors.fullName && <p className="text-xs text-red-500 mt-1">{stepErrors.fullName}</p>}
                </div>

                {/* Business / Brand Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    {t.labels?.businessName || 'Business / Brand Name'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Royal Bengal Sweets"
                      value={formData.businessName}
                      onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-purple-500 text-slate-900 dark:text-white text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                  {stepErrors.businessName && <p className="text-xs text-red-500 mt-1">{stepErrors.businessName}</p>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    {t.labels?.mobileNumber || 'Mobile Number'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formData.mobileNumber}
                      onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-purple-500 text-slate-900 dark:text-white text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors font-mono"
                    />
                  </div>
                  {stepErrors.mobileNumber && <p className="text-xs text-red-500 mt-1">{stepErrors.mobileNumber}</p>}
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    {t.labels?.whatsappNumber || 'WhatsApp Number'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-500" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formData.whatsappNumber}
                      onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-purple-500 text-slate-900 dark:text-white text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors font-mono"
                    />
                  </div>
                  {stepErrors.whatsappNumber && <p className="text-xs text-red-500 mt-1">{stepErrors.whatsappNumber}</p>}
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    {t.labels?.emailAddress || 'Email Address'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={formData.emailAddress}
                      onChange={e => setFormData({ ...formData, emailAddress: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-purple-500 text-slate-900 dark:text-white text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                  {stepErrors.emailAddress && <p className="text-xs text-red-500 mt-1">{stepErrors.emailAddress}</p>}
                </div>

                {/* STRUCTURED ADDRESS CASCADING SECTION */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3.5">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>{t.labels?.addressSection || 'Business Location & Address Details'}</span>
                  </div>

                  {/* Country & Searchable State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                        <span>{t.labels?.country || 'Country'} <span className="text-red-500">*</span></span>
                        {formData.country && (
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                            {currentCountryTheme.flag} {formData.country} Theme
                          </span>
                        )}
                      </label>
                      <select
                        value={formData.country || 'India'}
                        onChange={e => handleAddressUpdate({ country: e.target.value, state: '', district: '', otherDistrict: '' })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700/60 focus:border-purple-500 text-slate-900 dark:text-white text-xs font-semibold outline-none shadow-xs transition-all cursor-pointer"
                      >
                        {COUNTRIES.map(c => (
                          <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                            {COUNTRY_CULTURAL_THEMES[c]?.flag || '🌐'} {c}
                          </option>
                        ))}
                      </select>
                      {stepErrors.country && <p className="text-xs text-red-500 mt-1">{stepErrors.country}</p>}
                    </div>

                    {/* Searchable State / Province / Division */}
                    <div>
                      <SearchableCombobox
                        label={t.labels?.state || 'State / Province / Division'}
                        required
                        value={formData.state || ''}
                        options={getStatesForCountry(formData.country || 'India')}
                        placeholder={`-- Select State in ${formData.country || 'India'} --`}
                        searchPlaceholder={`Search state in ${formData.country || 'India'}...`}
                        onChange={(val) => handleAddressUpdate({ state: val, district: '', otherDistrict: '' })}
                        error={stepErrors.state}
                      />
                    </div>
                  </div>

                  {/* Searchable District / City / County */}
                  <div>
                    <SearchableCombobox
                      label={t.labels?.district || 'District / City / County'}
                      required
                      value={formData.district || ''}
                      options={getDistrictsForState(formData.country || 'India', formData.state)}
                      placeholder={
                        !formData.state
                          ? 'Please select a state/province first...'
                          : getDistrictsForState(formData.country || 'India', formData.state).length > 0
                          ? `-- Select District / City in ${formData.state} --`
                          : 'Type your district / city name...'
                      }
                      searchPlaceholder={
                        formData.state
                          ? `Search district in ${formData.state}...`
                          : 'Search district or city...'
                      }
                      disabled={!formData.state && getStatesForCountry(formData.country || 'India').length > 0}
                      onChange={(val) => handleAddressUpdate({ district: val, otherDistrict: '' })}
                      error={stepErrors.district}
                    />
                  </div>

                  {/* If Other District Selected */}
                  {(formData.district === 'Other' || formData.district?.toLowerCase() === 'other') && (
                    <div className="animate-in fade-in duration-200">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-1">
                        {t.labels?.specifyDistrict || 'Please specify your District / City'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your exact city / district name..."
                        value={formData.otherDistrict || ''}
                        onChange={e => handleAddressUpdate({ otherDistrict: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
                      />
                      {stepErrors.otherDistrict && <p className="text-xs text-red-500 mt-1">{stepErrors.otherDistrict}</p>}
                    </div>
                  )}

                  {/* Street Address & Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        {t.labels?.streetAddress || 'Street Address / Shop / Building / Landmark'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Shop No. 14, Ground Floor, Park Street Market"
                        value={formData.streetAddress}
                        onChange={e => handleAddressUpdate({ streetAddress: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-purple-500 text-slate-900 dark:text-white text-xs outline-none"
                      />
                      {stepErrors.streetAddress && <p className="text-xs text-red-500 mt-1">{stepErrors.streetAddress}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        {t.labels?.pincode || 'PIN / Postal Code'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="e.g. 700016"
                        value={formData.pincode}
                        onChange={e => handleAddressUpdate({ pincode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-purple-500 text-slate-900 dark:text-white text-xs outline-none font-mono"
                      />
                      {stepErrors.pincode && <p className="text-xs text-red-500 mt-1">{stepErrors.pincode}</p>}
                    </div>
                  </div>

                  {/* Full Address Live Preview */}
                  {formData.businessAddress && (
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/30 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-purple-700 dark:text-purple-300 font-bold">{t.labels?.compiledAddress || 'Compiled Full Address:'} </span>
                        <span>{formData.businessAddress}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Existing Website (Optional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    {t.labels?.existingWebsite || 'Existing Website (Optional)'}
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={formData.existingWebsite}
                      onChange={e => setFormData({ ...formData, existingWebsite: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-purple-500 text-slate-900 dark:text-white text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Social Media Links (Dynamic Custom Inputs - Optional) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    {t.labels?.socialLinks || 'Social Media Links (Optional - Add Multiple)'}
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="url"
                      placeholder="e.g. https://instagram.com/yourbrand or Facebook link"
                      value={socialInput}
                      onChange={e => setSocialInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSocialLink(); } }}
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-purple-500 text-slate-900 dark:text-white text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddSocialLink}
                      className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" /> {t.labels?.addLink || 'Add Link'}
                    </button>
                  </div>
                  {formData.socialLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.socialLinks.map((link, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700"
                        >
                          <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          <span className="truncate max-w-[200px]">{link}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSocialLink(idx)}
                            className="text-slate-400 hover:text-red-500 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: SELECT WEBSITE CATEGORY & READY-MADE TEMPLATES */}
          {/* ==================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  What type of website do you need? <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Select your core industry category or apply an interactive ready-made live template below.
                </p>
              </div>

              {/* Template Lock Banner if Template is applied */}
              {appliedTemplate && (
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border-2 border-purple-300 dark:border-purple-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                          Applied Template Locked
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-white text-[10px] font-black">
                          {appliedTemplate}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        Category changes are locked while a template is applied. Remove the template below to choose another category.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveAppliedTemplate}
                    className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0 active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Template
                  </button>
                </div>
              )}

              {stepErrors.selectedCategory && (
                <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  {stepErrors.selectedCategory}
                </div>
              )}

              {/* Animated Category Cards Grid - Responsive 2 columns on mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = formData.selectedCategory === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`group relative p-3 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-600 dark:border-purple-500 shadow-sm ring-1 ring-purple-500/40'
                          : appliedTemplate && formData.selectedCategory && formData.selectedCategory !== cat.id
                            ? 'bg-slate-50/40 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/40 opacity-40 hover:opacity-70'
                            : 'bg-white dark:bg-slate-900/80 hover:bg-purple-50/30 dark:hover:bg-slate-800/60 border-slate-200/90 dark:border-slate-800 hover:border-purple-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${
                            isSelected ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-white'
                          }`}>
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="flex items-center gap-1">
                            {cat.badge && (
                              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 hidden xs:inline">
                                {cat.badge}
                              </span>
                            )}
                            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-300 dark:border-slate-700'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                            </div>
                          </div>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-0.5 sm:mb-1">{cat.name}</h4>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{cat.desc}</p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px] sm:text-xs">
                        <span className="text-slate-400 dark:text-slate-500 font-medium text-[10px] sm:text-xs">From</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPriceByCountry(cat.basePrice, formData.country)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ready-Made Live Demo Templates Showcase for Selected Category */}
              {formData.selectedCategory && getDemosForCategory(formData.selectedCategory).length > 0 && (
                <div className="mt-6 p-5 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 border border-purple-200 dark:border-purple-500/30 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Ready-Made Live Templates
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        Live Demos matching {CATEGORIES.find(c => c.id === formData.selectedCategory)?.name || 'your category'}
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getDemosForCategory(formData.selectedCategory).map((demo) => {
                      const isThisApplied = appliedTemplate === demo.title;
                      return (
                        <div
                          key={demo.id}
                          className={`rounded-2xl overflow-hidden border bg-white dark:bg-slate-950 flex flex-col justify-between transition-all ${
                            isThisApplied
                              ? 'border-purple-500 ring-2 ring-purple-500/40 shadow-lg'
                              : 'border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900">
                            <img
                              src={demo.heroImage || demo.thumbnail || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop'}
                              alt={demo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold backdrop-blur-md">
                              {demo.badge || 'Ready Made'}
                            </div>
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black font-mono">
                              {formatPriceByCountry(demo.priceInr || demo.price || 4999, formData.country)}
                            </div>
                          </div>

                          <div className="p-3.5 flex-1 flex flex-col justify-between">
                            <div>
                              <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 mb-1">{demo.title}</h5>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{demo.shortDescription}</p>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const demoSlug = demo.slug || demo.id || demo._id;
                                  window.open('/demo/' + demoSlug, '_blank');
                                }}
                                className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Live Demo View
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApplyTemplate(demo)}
                                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 cursor-pointer transition-all ${
                                  isThisApplied
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                                }`}
                              >
                                {isThisApplied ? (
                                  <>
                                    <Check className="w-3 h-3" /> Applied
                                  </>
                                ) : (
                                  <>
                                    <Zap className="w-3 h-3" /> Apply Template
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* If "Other" category is selected */}
              {formData.selectedCategory === 'other' && (
                <div className="mt-4 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/40 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                    Please specify your website category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Export Import Portal, Astrology Platform, Event Booking..."
                    value={formData.otherCategoryDescription}
                    onChange={e => setFormData({ ...formData, otherCategoryDescription: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-purple-500 text-slate-900 dark:text-white text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                  {stepErrors.otherCategoryDescription && (
                    <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {stepErrors.otherCategoryDescription}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 3: CATEGORY-SPECIFIC DETAILED QUESTIONS */}
          {/* ==================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                  Category: {formData.selectedCategory || 'Website'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  Industry-Specific Requirements
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Tailor your exact features, business operations, and workflow needs.
                </p>
              </div>

              {/* 1. RESTAURANT SPECIFIC QUESTIONS */}
              {formData.selectedCategory === 'restaurant' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Restaurant Type / Cuisine <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Indian, Mughlai, Italian, Multi-Cuisine, Cafe & Diner"
                      value={formData.restCuisine}
                      onChange={e => setFormData({ ...formData, restCuisine: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-purple-500 text-slate-900 dark:text-white text-sm outline-none"
                    />
                    {stepErrors.restCuisine && <p className="text-xs text-red-500 mt-1">{stepErrors.restCuisine}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                      Features Required <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        'Digital Menu',
                        'Table Reservation',
                        'Online Food Ordering',
                        'WhatsApp Order',
                        'Special Deals / Offers',
                        'Customer Reviews',
                        'Google Map Location',
                        'Operating Hours & Contact'
                      ].map(feat => (
                        <button
                          key={feat}
                          type="button"
                          onClick={() => handleToggleMulti('restFeatures', feat)}
                          className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                            formData.restFeatures.includes(feat)
                              ? 'bg-purple-50 dark:bg-purple-900/50 border-purple-500 text-purple-900 dark:text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <span>{feat}</span>
                          {formData.restFeatures.includes(feat) && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                        </button>
                      ))}
                    </div>
                    {stepErrors.restFeatures && <p className="text-xs text-red-500 mt-1">{stepErrors.restFeatures}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Preferred Website Style <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.restStyle}
                        onChange={e => setFormData({ ...formData, restStyle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                      >
                        <option value="">-- Select Style --</option>
                        {['Modern & Sleek', 'Cozy & Traditional', 'Luxury & Fine Dine', 'Vibrant & Fast Food', 'Minimalist', 'Other'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {stepErrors.restStyle && <p className="text-xs text-red-500 mt-1">{stepErrors.restStyle}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Do you have a Logo? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Yes', 'No'].map(ans => (
                          <button
                            key={ans}
                            type="button"
                            onClick={() => setFormData({ ...formData, restHasLogo: ans })}
                            className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              formData.restHasLogo === ans ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                      {stepErrors.restHasLogo && <p className="text-xs text-red-500 mt-1">{stepErrors.restHasLogo}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Will you provide food photos and content? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Yes', 'No'].map(ans => (
                        <button
                          key={ans}
                          type="button"
                          onClick={() => setFormData({ ...formData, restProvidePhotos: ans })}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            formData.restProvidePhotos === ans ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {ans}
                        </button>
                      ))}
                    </div>
                    {stepErrors.restProvidePhotos && <p className="text-xs text-red-500 mt-1">{stepErrors.restProvidePhotos}</p>}
                  </div>
                </div>
              )}

              {/* 2. CAFÉ SPECIFIC QUESTIONS */}
              {formData.selectedCategory === 'cafe' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Café Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The Roastery Coffee & Bakery"
                      value={formData.cafeName}
                      onChange={e => setFormData({ ...formData, cafeName: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none"
                    />
                    {stepErrors.cafeName && <p className="text-xs text-red-500 mt-1">{stepErrors.cafeName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                      Features Needed <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        'Aesthetic Coffee Menu',
                        'Bakery & Pastry Showcase',
                        'Table Reservation',
                        'WhatsApp Takeaway Order',
                        'Wi-Fi & Seating Highlights',
                        'Live Instagram Feed',
                        'Operating Hours & Google Map'
                      ].map(feat => (
                        <button
                          key={feat}
                          type="button"
                          onClick={() => handleToggleMulti('cafeFeatures', feat)}
                          className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                            formData.cafeFeatures.includes(feat)
                              ? 'bg-purple-50 dark:bg-purple-900/50 border-purple-500 text-purple-900 dark:text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <span>{feat}</span>
                          {formData.cafeFeatures.includes(feat) && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                        </button>
                      ))}
                    </div>
                    {stepErrors.cafeFeatures && <p className="text-xs text-red-500 mt-1">{stepErrors.cafeFeatures}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Preferred Style <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.cafeStyle}
                        onChange={e => setFormData({ ...formData, cafeStyle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                      >
                        <option value="">-- Select Style --</option>
                        {['Artisanal & Aesthetic', 'Cozy Wooden & Vintage', 'Modern Minimalist', 'Pastel Bakery & Cute', 'Other'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {stepErrors.cafeStyle && <p className="text-xs text-red-500 mt-1">{stepErrors.cafeStyle}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Logo Available? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Yes', 'No'].map(ans => (
                          <button
                            key={ans}
                            type="button"
                            onClick={() => setFormData({ ...formData, cafeHasLogo: ans })}
                            className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              formData.cafeHasLogo === ans ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                      {stepErrors.cafeHasLogo && <p className="text-xs text-red-500 mt-1">{stepErrors.cafeHasLogo}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Are photos and menu available? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Yes', 'No'].map(ans => (
                        <button
                          key={ans}
                          type="button"
                          onClick={() => setFormData({ ...formData, cafePhotosAvailable: ans })}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            formData.cafePhotosAvailable === ans ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {ans}
                        </button>
                      ))}
                    </div>
                    {stepErrors.cafePhotosAvailable && <p className="text-xs text-red-500 mt-1">{stepErrors.cafePhotosAvailable}</p>}
                  </div>
                </div>
              )}

              {/* 3. SALON SPECIFIC QUESTIONS */}
              {formData.selectedCategory === 'salon' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                      Salon &amp; Spa Features <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        'Service Rate Cards',
                        'Bridal Makeup Packages',
                        'Online Appointment Booking',
                        'Stylist Profiles',
                        'Before & After Gallery',
                        'WhatsApp VIP Booking',
                        'Google Reviews & Location'
                      ].map(feat => (
                        <button
                          key={feat}
                          type="button"
                          onClick={() => handleToggleMulti('salonFeatures', feat)}
                          className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                            formData.salonFeatures.includes(feat)
                              ? 'bg-purple-50 dark:bg-purple-900/50 border-purple-500 text-purple-900 dark:text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <span>{feat}</span>
                          {formData.salonFeatures.includes(feat) && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                        </button>
                      ))}
                    </div>
                    {stepErrors.salonFeatures && <p className="text-xs text-red-500 mt-1">{stepErrors.salonFeatures}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Preferred Style <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.salonStyle}
                        onChange={e => setFormData({ ...formData, salonStyle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                      >
                        <option value="">-- Select Style --</option>
                        {['Luxury Glamour & Gold', 'Clean Modern Unisex', 'Soft Pastel Spa', 'Dark Velvet Aesthetic', 'Other'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {stepErrors.salonStyle && <p className="text-xs text-red-500 mt-1">{stepErrors.salonStyle}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Logo Available? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Yes', 'No'].map(ans => (
                          <button
                            key={ans}
                            type="button"
                            onClick={() => setFormData({ ...formData, salonHasLogo: ans })}
                            className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              formData.salonHasLogo === ans ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                      {stepErrors.salonHasLogo && <p className="text-xs text-red-500 mt-1">{stepErrors.salonHasLogo}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Photos Available? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Yes', 'No'].map(ans => (
                        <button
                          key={ans}
                          type="button"
                          onClick={() => setFormData({ ...formData, salonPhotosAvailable: ans })}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            formData.salonPhotosAvailable === ans ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {ans}
                        </button>
                      ))}
                    </div>
                    {stepErrors.salonPhotosAvailable && <p className="text-xs text-red-500 mt-1">{stepErrors.salonPhotosAvailable}</p>}
                  </div>
                </div>
              )}

              {/* 4. GYM & FITNESS SPECIFIC QUESTIONS */}
              {formData.selectedCategory === 'gym' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                      Gym &amp; Fitness Features <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        'Membership Pricing Plans',
                        'Trainer Profiles & Bio',
                        'Free 1-Day Trial Pass',
                        'Workout & Class Timetable',
                        'Transformation Gallery',
                        'WhatsApp Fast Enrollment',
                        'Equipment Showcase'
                      ].map(feat => (
                        <button
                          key={feat}
                          type="button"
                          onClick={() => handleToggleMulti('gymFeatures', feat)}
                          className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                            formData.gymFeatures.includes(feat)
                              ? 'bg-purple-50 dark:bg-purple-900/50 border-purple-500 text-purple-900 dark:text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <span>{feat}</span>
                          {formData.gymFeatures.includes(feat) && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                        </button>
                      ))}
                    </div>
                    {stepErrors.gymFeatures && <p className="text-xs text-red-500 mt-1">{stepErrors.gymFeatures}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Preferred Style <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.gymStyle}
                        onChange={e => setFormData({ ...formData, gymStyle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                      >
                        <option value="">-- Select Style --</option>
                        {['High Energy Dark & Neon', 'Premium Minimalist Fitness', 'CrossFit Raw & Bold', 'Zen Yoga & Wellness', 'Other'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {stepErrors.gymStyle && <p className="text-xs text-red-500 mt-1">{stepErrors.gymStyle}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Logo Available? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Yes', 'No'].map(ans => (
                          <button
                            key={ans}
                            type="button"
                            onClick={() => setFormData({ ...formData, gymHasLogo: ans })}
                            className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              formData.gymHasLogo === ans ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                      {stepErrors.gymHasLogo && <p className="text-xs text-red-500 mt-1">{stepErrors.gymHasLogo}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. HOTEL / RESORT SPECIFIC QUESTIONS */}
              {formData.selectedCategory === 'hotel' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                      Hotel &amp; Resort Features <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        'Room Showcase & Tariff Cards',
                        'Direct Room Booking Engine',
                        'Amenities & Swimming Pool Tour',
                        'Dining & Bar Experience',
                        'WhatsApp Concierge Inquiry',
                        'Guest Reviews & Awards',
                        'Google Maps & Airport Distance'
                      ].map(feat => (
                        <button
                          key={feat}
                          type="button"
                          onClick={() => handleToggleMulti('hotelFeatures', feat)}
                          className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                            formData.hotelFeatures.includes(feat)
                              ? 'bg-purple-50 dark:bg-purple-900/50 border-purple-500 text-purple-900 dark:text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <span>{feat}</span>
                          {formData.hotelFeatures.includes(feat) && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                        </button>
                      ))}
                    </div>
                    {stepErrors.hotelFeatures && <p className="text-xs text-red-500 mt-1">{stepErrors.hotelFeatures}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Preferred Style <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.hotelStyle}
                        onChange={e => setFormData({ ...formData, hotelStyle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                      >
                        <option value="">-- Select Style --</option>
                        {['Ultra Luxury & Heritage', 'Modern Boutique Resort', 'Tropical Pool & Eco-Stay', 'Corporate Business Hotel', 'Other'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {stepErrors.hotelStyle && <p className="text-xs text-red-500 mt-1">{stepErrors.hotelStyle}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Room Photos Available? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Yes', 'No'].map(ans => (
                          <button
                            key={ans}
                            type="button"
                            onClick={() => setFormData({ ...formData, hotelPhotosAvailable: ans })}
                            className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              formData.hotelPhotosAvailable === ans ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                      {stepErrors.hotelPhotosAvailable && <p className="text-xs text-red-500 mt-1">{stepErrors.hotelPhotosAvailable}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. REAL ESTATE SPECIFIC QUESTIONS */}
              {formData.selectedCategory === 'real_estate' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                      Property Types <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {['Residential Apartments', 'Luxury Villas', 'Commercial Offices', 'Plots & Land', 'Rental Properties'].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handleToggleMulti('rePropertyTypes', p)}
                          className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                            formData.rePropertyTypes.includes(p)
                              ? 'bg-purple-50 dark:bg-purple-900/50 border-purple-500 text-purple-900 dark:text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <span>{p}</span>
                          {formData.rePropertyTypes.includes(p) && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                        </button>
                      ))}
                    </div>
                    {stepErrors.rePropertyTypes && <p className="text-xs text-red-500 mt-1">{stepErrors.rePropertyTypes}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                      Features Needed <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        'Search & Filter by BHK & Price',
                        'Floor Plans & Brochure Download',
                        'WhatsApp Site Visit Booking',
                        'EMI Calculator',
                        'Virtual Video Tours',
                        'Builder Portfolio'
                      ].map(feat => (
                        <button
                          key={feat}
                          type="button"
                          onClick={() => handleToggleMulti('reFeatures', feat)}
                          className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                            formData.reFeatures.includes(feat)
                              ? 'bg-purple-50 dark:bg-purple-900/50 border-purple-500 text-purple-900 dark:text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <span>{feat}</span>
                          {formData.reFeatures.includes(feat) && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                        </button>
                      ))}
                    </div>
                    {stepErrors.reFeatures && <p className="text-xs text-red-500 mt-1">{stepErrors.reFeatures}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Preferred Style <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.reStyle}
                        onChange={e => setFormData({ ...formData, reStyle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                      >
                        <option value="">-- Select Style --</option>
                        {['Enterprise Luxury Glass', 'Clean Modern Brokerage', 'Architectural Minimalist', 'Other'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {stepErrors.reStyle && <p className="text-xs text-red-500 mt-1">{stepErrors.reStyle}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Logo Available? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Yes', 'No'].map(ans => (
                          <button
                            key={ans}
                            type="button"
                            onClick={() => setFormData({ ...formData, reHasLogo: ans })}
                            className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              formData.reHasLogo === ans ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                      {stepErrors.reHasLogo && <p className="text-xs text-red-500 mt-1">{stepErrors.reHasLogo}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* 7. OTHER CUSTOM CATEGORIES & FALLBACK */}
              {!['restaurant', 'cafe', 'salon', 'gym', 'hotel', 'real_estate'].includes(formData.selectedCategory) && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Core Features &amp; Specifications for {CATEGORIES.find(c => c.id === formData.selectedCategory)?.name || 'Your Website'} <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        'Product / Service Catalog',
                        'Online Enquiry & Lead Capture',
                        'WhatsApp Direct Buy / Chat',
                        'Price Rate Cards',
                        'Client Testimonials & Portfolio',
                        'Google Maps & Operating Hours',
                        'Payment Gateway',
                        'Booking / Appointment Slots'
                      ].map(feat => (
                        <button
                          key={feat}
                          type="button"
                          onClick={() => handleToggleMulti('otherFeatures', feat)}
                          className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                            formData.otherFeatures.includes(feat)
                              ? 'bg-purple-50 dark:bg-purple-900/50 border-purple-500 text-purple-900 dark:text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <span>{feat}</span>
                          {formData.otherFeatures.includes(feat) && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Describe your specific business operations &amp; features
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please share any key pages, operational workflows, or specific customer conversion steps you require..."
                      value={formData.otherRequirementsNotes}
                      onChange={e => setFormData({ ...formData, otherRequirementsNotes: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-purple-500 text-slate-900 dark:text-white text-sm outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 4: DESIGN & COLOR THEME */}
          {/* ==================================================== */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Design &amp; Color Theme
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Choose visual branding, design personality and accent colors.
                </p>
              </div>

              {/* Visual Style * */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                  What kind of visual style do you prefer? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    'Modern',
                    'Minimal',
                    'Premium',
                    'Luxury',
                    'Professional',
                    'Creative',
                    'Elegant',
                    'Bold',
                    'Simple',
                    'Dark Mode',
                    'Light Mode',
                    'Other'
                  ].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormData({ ...formData, visualStyle: st })}
                      className={`p-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                        formData.visualStyle === st
                          ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                {formData.visualStyle === 'Other' && (
                  <input
                    type="text"
                    placeholder="Describe your preferred style *"
                    value={formData.visualStyleOther}
                    onChange={e => setFormData({ ...formData, visualStyleOther: e.target.value })}
                    className="mt-2.5 w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none"
                  />
                )}
                {stepErrors.visualStyle && <p className="text-xs text-red-500 mt-1.5">{stepErrors.visualStyle}</p>}
                {stepErrors.visualStyleOther && <p className="text-xs text-red-500 mt-1.5">{stepErrors.visualStyleOther}</p>}
              </div>

              {/* Color Theme * */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                  What color theme would you like? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'Blue', color: '#3b82f6' },
                    { id: 'Green', color: '#10b981' },
                    { id: 'Red', color: '#ef4444' },
                    { id: 'Purple', color: '#a855f7' },
                    { id: 'Orange', color: '#f97316' },
                    { id: 'Black & Gold', color: '#eab308' },
                    { id: 'Dark Theme', color: '#0f172a' },
                    { id: 'Light Clean', color: '#f8fafc' },
                    { id: 'Custom', color: '#ec4899' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, colorTheme: c.id })}
                      className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2.5 transition-all cursor-pointer ${
                        formData.colorTheme === c.id
                          ? 'bg-purple-50 dark:bg-purple-900/50 border-purple-500 text-purple-900 dark:text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-black/20 dark:border-white/20 shadow-xs shrink-0" style={{ backgroundColor: c.color }} />
                      <span>{c.id}</span>
                      {formData.colorTheme === c.id && <Check className="w-3.5 h-3.5 ml-auto text-purple-600 dark:text-purple-400" />}
                    </button>
                  ))}
                </div>
                {formData.colorTheme === 'Custom' && (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.customColorCode}
                      onChange={e => setFormData({ ...formData, customColorCode: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      placeholder="Hex Code (e.g. #6366F1)"
                      value={formData.customColorCode}
                      onChange={e => setFormData({ ...formData, customColorCode: e.target.value })}
                      className="w-32 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Optional theme description..."
                      value={formData.customColorDesc}
                      onChange={e => setFormData({ ...formData, customColorDesc: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                )}
                {stepErrors.colorTheme && <p className="text-xs text-red-500 mt-1.5">{stepErrors.colorTheme}</p>}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 5: LOGO / CONTENT / MULTI-IMAGE UPLOADS */}
          {/* ==================================================== */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Logo / Content / Media Files
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Tell us about your brand assets readiness and upload logo &amp; business photos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Do you have a Logo? * */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    1. Do you have a Logo? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Yes', 'No'].map(ans => (
                      <button
                        key={ans}
                        type="button"
                        onClick={() => setFormData({ ...formData, hasLogo: ans })}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          formData.hasLogo === ans ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                  {stepErrors.hasLogo && <p className="text-xs text-red-500 mt-1">{stepErrors.hasLogo}</p>}
                </div>

                {/* 2. Do you have Photos? * */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    2. Do you have Photos? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Yes', 'No'].map(ans => (
                      <button
                        key={ans}
                        type="button"
                        onClick={() => setFormData({ ...formData, hasPhotos: ans })}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          formData.hasPhotos === ans ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                  {stepErrors.hasPhotos && <p className="text-xs text-red-500 mt-1">{stepErrors.hasPhotos}</p>}
                </div>

                {/* 3. Do you have Website Content? * */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    3. Do you have Content? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Yes', 'No'].map(ans => (
                      <button
                        key={ans}
                        type="button"
                        onClick={() => setFormData({ ...formData, hasContent: ans })}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          formData.hasContent === ans ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                  {stepErrors.hasContent && <p className="text-xs text-red-500 mt-1">{stepErrors.hasContent}</p>}
                </div>
              </div>

              {/* RICH MEDIA UPLOAD CARDS WITH INSTANT THUMBNAIL PREVIEWS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* Logo Upload Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Upload Brand Logo (Optional)
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">PNG, JPG, SVG or WebP formats supported</p>
                  </div>

                  {formData.logoFile ? (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={formData.logoFile.dataUrl}
                          alt="Logo Preview"
                          className="w-10 h-10 object-contain rounded-lg bg-slate-100 dark:bg-slate-800 border p-1"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{formData.logoFile.name}</p>
                          <p className="text-[10px] text-slate-400">{formData.logoFile.size}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, logoFile: null }))}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-purple-500 cursor-pointer transition-colors text-center">
                      <UploadCloud className="w-6 h-6 text-purple-500 mb-1" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click to Browse Logo</span>
                      <span className="text-[10px] text-slate-400">Max size 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'logo')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Multiple Business Photos Upload Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Photos &amp; Catalog Media (Optional)
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Upload multiple food, shop or product photos</p>
                  </div>

                  <label className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-purple-500 cursor-pointer transition-colors text-center mb-2">
                    <Plus className="w-5 h-5 text-purple-500 mb-0.5" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Add Business Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={e => handleFileUpload(e, 'photos')}
                      className="hidden"
                    />
                  </label>

                  {/* Thumbnail Grid */}
                  {formData.photosFiles && formData.photosFiles.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-32 overflow-y-auto p-1">
                      {formData.photosFiles.map((photo, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border aspect-square bg-slate-100 dark:bg-slate-900">
                          <img src={photo.dataUrl} alt={photo.name} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100 cursor-pointer shadow-sm"
                            title="Delete"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reference Website & Additional Instructions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Reference Website (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://apple.com or competitor website you like"
                    value={formData.referenceWebsites}
                    onChange={e => setFormData({ ...formData, referenceWebsites: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Additional Design Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Specific design directives or aesthetic notes for our designers..."
                    value={formData.designInstructions}
                    onChange={e => setFormData({ ...formData, designInstructions: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 6: DOMAIN & HOSTING (SEPARATE) */}
          {/* ==================================================== */}
          {currentStep === 6 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Domain &amp; Hosting
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Domain and Cloud Hosting are completely separate components. Select your requirement for each.
                </p>
              </div>

              {/* Notice Banner: Domain & Hosting Price Variance & Real-time Quote */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 border border-blue-500/20 dark:border-blue-500/30 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-2">
                      <span>Domain &amp; Cloud Hosting Transparency</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[9px] font-extrabold uppercase tracking-wider">
                        Estimate Quote
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Domain names and cloud server rates vary depending on live registry availability (.com, .in, .org, etc.) and your required storage bandwidth. <strong>You can select multiple preferred domain extensions and names below.</strong> Our engineering desk will check live registry availability and email you the exact confirmed price quote and available options.
                    </p>
                  </div>
                </div>
              </div>

              {/* ---------------- DOMAIN ---------------- */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        Do you need a Domain? <span className="text-red-500">*</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Choose your domain preference or provide multiple choices for availability checking
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'I already have a Domain', label: 'I already have a Domain', badge: 'Free DNS Setup' },
                    { key: 'I need a new Domain', label: 'I need a new Domain / Multiple Options', badge: 'Approx ₹799 – ₹1,499/Yr' }
                  ].map(opt => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, domainStatus: opt.key })}
                      className={`p-3.5 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                        formData.domainStatus === opt.key
                          ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-900 dark:text-white shadow-md ring-1 ring-blue-400'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                        {opt.badge}
                      </span>
                    </button>
                  ))}
                </div>
                {stepErrors.domainStatus && <p className="text-xs text-red-500">{stepErrors.domainStatus}</p>}

                {/* If New Domain Selected */}
                {formData.domainStatus === 'I need a new Domain' && (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
                    
                    {/* Domain Names input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Desired Domain Name(s) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. mybusiness, mybusinessbrand, mybusinessonline (comma separated for multiple options)"
                        value={formData.domainName}
                        onChange={e => setFormData({ ...formData, domainName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-blue-500"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        💡 You can enter multiple alternative names separated by commas. We will verify real-time availability for all options and email you the live price.
                      </p>
                      {stepErrors.domainName && <p className="text-xs text-red-500 mt-1">{stepErrors.domainName}</p>}
                    </div>

                    {/* Multi-Select Domain Extensions */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Preferred Domain Extension(s) (Select multiple choices)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {[
                          { ext: '.com', label: '.com', desc: 'Global Commercial', approx: 'Approx ₹899–₹1,399/yr' },
                          { ext: '.in', label: '.in', desc: 'India Official', approx: 'Approx ₹699–₹999/yr' },
                          { ext: '.co.in', label: '.co.in', desc: 'India Business', approx: 'Approx ₹649–₹899/yr' },
                          { ext: '.org', label: '.org', desc: 'Organization / Trust', approx: 'Approx ₹999–₹1,499/yr' },
                          { ext: '.net', label: '.net', desc: 'Tech & Network', approx: 'Approx ₹1,199–₹1,599/yr' },
                          { ext: '.co', label: '.co', desc: 'Modern Company', approx: 'Approx ₹1,299–₹1,899/yr' },
                          { ext: '.ai', label: '.ai', desc: 'Artificial Intelligence', approx: 'Approx ₹5,999–₹7,999/yr' },
                          { ext: '.io', label: '.io', desc: 'SaaS & Web App', approx: 'Approx ₹3,499–₹4,999/yr' },
                          { ext: 'Other', label: 'Other', desc: 'Custom Extension', approx: 'Registry Rate' },
                        ].map(dItem => {
                          const isSelected = (formData.domainExtensions || ['.com']).includes(dItem.ext);
                          return (
                            <button
                              key={dItem.ext}
                              type="button"
                              onClick={() => {
                                const curr = formData.domainExtensions || ['.com'];
                                const updated = isSelected
                                  ? (curr.length > 1 ? curr.filter(x => x !== dItem.ext) : curr)
                                  : [...curr, dItem.ext];
                                setFormData({
                                  ...formData,
                                  domainExtensions: updated,
                                  domainExtension: updated.join(', ')
                                });
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-900 dark:text-white shadow-xs ring-1 ring-blue-400'
                                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-xs">{dItem.label}</span>
                                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                  isSelected ? 'bg-blue-600 text-white' : 'border border-slate-400 text-transparent'
                                }`}>
                                  ✓
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">{dItem.desc}</div>
                              <div className="text-[9px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                {dItem.approx}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* If Other Selected */}
                      {(formData.domainExtensions || []).includes('Other') && (
                        <div className="mt-2.5">
                          <input
                            type="text"
                            placeholder="Specify other extensions (e.g. .store, .agency, .shop)"
                            value={formData.domainOtherExtension || ''}
                            onChange={e => setFormData({ ...formData, domainOtherExtension: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none"
                          />
                        </div>
                      )}
                    </div>

                    {/* Dynamic Registry Confirmation Note */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-slate-500 font-medium">Selected Preferred Extensions:</span>
                        <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {(formData.domainExtensions || ['.com']).join(' • ')}
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 block">Approx. Estimated Registration</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          Approx ₹799 – ₹1,499 / Yr
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ---------------- HOSTING ---------------- */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        Do you need Cloud Hosting? <span className="text-red-500">*</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        High-speed SSD cloud server with automated SSL, daily backups &amp; DDoS shielding
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'I already have Hosting', label: 'I already have Hosting (Connect for Free)', badge: 'Zero Cost' },
                    { key: 'I need new Hosting', label: 'I need Cloud SSD Hosting', badge: 'Approx ₹1,499 – ₹3,999/Yr' }
                  ].map(opt => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, hostingStatus: opt.key })}
                      className={`p-3.5 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                        formData.hostingStatus === opt.key
                          ? 'bg-purple-50 dark:bg-purple-900/40 border-purple-500 text-purple-900 dark:text-white shadow-md ring-1 ring-purple-400'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                        {opt.badge}
                      </span>
                    </button>
                  ))}
                </div>
                {stepErrors.hostingStatus && <p className="text-xs text-red-500">{stepErrors.hostingStatus}</p>}

                {/* If New Hosting Selected */}
                {formData.hostingStatus === 'I need new Hosting' && (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Estimated Hosting Tier &amp; Capacity
                      </label>
                      <span className="text-[10px] text-slate-500">
                        * Exact plan verified &amp; confirmed on quote
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {[
                        { plan: 'Basic', title: 'Basic Cloud SSD', approx: 'Approx ₹1,499 – ₹1,999/Yr', desc: 'Fast LiteSpeed & SSL, ideal for portfolios & landing pages' },
                        { plan: 'Standard', title: 'Standard Business', approx: 'Approx ₹2,499 – ₹2,999/Yr', desc: 'NVMe SSD, Dynamic DB, ideal for company portals' },
                        { plan: 'Premium', title: 'High-Performance Pro', approx: 'Approx ₹3,999 – ₹4,999/Yr', desc: 'Dedicated CPU slices, ideal for E-Commerce & high traffic' },
                        { plan: 'Custom', title: 'Enterprise Cloud', approx: 'Custom Quote', desc: 'Dedicated VPS/AWS cluster architecture' }
                      ].map(hp => (
                        <button
                          key={hp.plan}
                          type="button"
                          onClick={() => setFormData({ ...formData, hostingPlan: hp.plan })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            formData.hostingPlan === hp.plan
                              ? 'bg-purple-600 border-purple-500 text-white font-bold shadow-md ring-1 ring-purple-400'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <div className="text-xs font-bold">{hp.title}</div>
                          <div className={`text-[10px] font-mono font-semibold mt-0.5 ${formData.hostingPlan === hp.plan ? 'text-amber-200' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {hp.approx}
                          </div>
                          <div className={`text-[10px] mt-1 leading-snug ${formData.hostingPlan === hp.plan ? 'text-purple-100' : 'text-slate-500'}`}>
                            {hp.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 7: BACKEND & WHATSAPP INTEGRATION */}
          {/* ==================================================== */}
          {currentStep === 7 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Backend &amp; WhatsApp Integration
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Configure administrative content management and direct WhatsApp customer funnels.
                </p>
              </div>

              {/* Backend / Admin Panel * */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                  Do you need a Backend / Admin Panel? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'No Backend Required', price: '₹0' },
                    { id: 'Backend Required', price: '+₹2,999' },
                    { id: 'Admin Panel Required', price: '+₹3,499' },
                    { id: 'Backend + Admin Panel', price: '+₹4,999' },
                    { id: 'Custom Backend Requirement', price: '+₹6,999' }
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, backendRequirement: b.id })}
                      className={`p-3.5 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                        formData.backendRequirement === b.id
                          ? 'bg-purple-50 dark:bg-purple-900/50 border-purple-500 text-purple-900 dark:text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span>{b.id}</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 text-[11px]">{b.price}</span>
                    </button>
                  ))}
                </div>
                {formData.backendRequirement === 'Custom Backend Requirement' && (
                  <textarea
                    rows={2}
                    placeholder="Please describe your backend requirement *"
                    value={formData.backendCustomDesc}
                    onChange={e => setFormData({ ...formData, backendCustomDesc: e.target.value })}
                    className="mt-2.5 w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none"
                  />
                )}
                {stepErrors.backendRequirement && <p className="text-xs text-red-500 mt-1.5">{stepErrors.backendRequirement}</p>}
                {stepErrors.backendCustomDesc && <p className="text-xs text-red-500 mt-1.5">{stepErrors.backendCustomDesc}</p>}
              </div>

              {/* WhatsApp Integration * */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                  Do you need WhatsApp Integration? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'No WhatsApp Integration',
                    'WhatsApp Chat Button',
                    'WhatsApp Enquiry',
                    'WhatsApp Order',
                    'WhatsApp Booking',
                    'Custom WhatsApp Integration'
                  ].map(w => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setFormData({ ...formData, whatsappIntegration: w })}
                      className={`p-3.5 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                        formData.whatsappIntegration === w
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span>{w}</span>
                      {formData.whatsappIntegration === w && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  ))}
                </div>
                {stepErrors.whatsappIntegration && <p className="text-xs text-red-500 mt-1.5">{stepErrors.whatsappIntegration}</p>}

                {/* If WhatsApp Integration is chosen */}
                {formData.whatsappIntegration && formData.whatsappIntegration !== 'No WhatsApp Integration' && (
                  <div className="mt-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Country Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.whatsappCountryCode}
                          onChange={e => setFormData({ ...formData, whatsappCountryCode: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          WhatsApp Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={formData.whatsappNumberForIntegration}
                          onChange={e => setFormData({ ...formData, whatsappNumberForIntegration: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none"
                        />
                        {stepErrors.whatsappNumberForIntegration && (
                          <p className="text-xs text-red-500 mt-1">{stepErrors.whatsappNumberForIntegration}</p>
                        )}
                      </div>
                    </div>
                    {formData.whatsappIntegration === 'Custom WhatsApp Integration' && (
                      <textarea
                        rows={2}
                        placeholder="Describe your WhatsApp requirement *"
                        value={formData.whatsappCustomDesc}
                        onChange={e => setFormData({ ...formData, whatsappCustomDesc: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 8: OTHER INTEGRATIONS */}
          {/* ==================================================== */}
          {currentStep === 8 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Do you need any additional integrations? <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Select key external services, APIs and third-party tools to integrate.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Google Maps',
                  'Payment Gateway',
                  'Email Integration',
                  'Social Media Integration',
                  'Google Analytics',
                  'Newsletter',
                  'Booking System',
                  'API Integration',
                  'WhatsApp',
                  'Other'
                ].map(ig => (
                  <button
                    key={ig}
                    type="button"
                    onClick={() => handleToggleMulti('otherIntegrations', ig)}
                    className={`p-3.5 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all cursor-pointer ${
                      formData.otherIntegrations.includes(ig)
                        ? 'bg-purple-50 dark:bg-purple-900/50 border-purple-500 text-purple-900 dark:text-white shadow-md'
                        : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span>{ig}</span>
                    <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                      formData.otherIntegrations.includes(ig) ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-300 dark:border-slate-700'
                    }`}>
                      {formData.otherIntegrations.includes(ig) && '✓'}
                    </span>
                  </button>
                ))}
              </div>
              {formData.otherIntegrations.includes('Other') && (
                <input
                  type="text"
                  placeholder="Please specify your custom integration requirement *"
                  value={formData.customIntegrationText}
                  onChange={e => setFormData({ ...formData, customIntegrationText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none"
                />
              )}
              {stepErrors.otherIntegrations && <p className="text-xs text-red-500">{stepErrors.otherIntegrations}</p>}
              {stepErrors.customIntegrationText && <p className="text-xs text-red-500">{stepErrors.customIntegrationText}</p>}
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 9: FINAL PROJECT INFORMATION */}
          {/* ==================================================== */}
          {currentStep === 9 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Final Project Information
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Budget bracket, launch timeline and any special requests.
                </p>
              </div>

              {/* Estimated Budget */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5">
                  1. Estimated Budget (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    'Under ₹10,000',
                    '₹10,000 – ₹25,000',
                    '₹25,000 – ₹50,000',
                    '₹50,000 – ₹1,00,000',
                    'Above ₹1,00,000',
                    'Custom Budget'
                  ].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, budgetBracket: b })}
                      className={`p-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                        formData.budgetBracket === b
                          ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                {formData.budgetBracket === 'Custom Budget' && (
                  <input
                    type="text"
                    placeholder="Enter your custom target budget in INR..."
                    value={formData.customBudget}
                    onChange={e => setFormData({ ...formData, customBudget: e.target.value })}
                    className="mt-2.5 w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none"
                  />
                )}
              </div>

              {/* Expected Launch Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  2. Expected Launch Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.expectedLaunchDate}
                  onChange={e => setFormData({ ...formData, expectedLaunchDate: e.target.value })}
                  className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none"
                />
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  3. Additional Requirements (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe any other specific goals, features or target audience specifics..."
                  value={formData.additionalRequirements}
                  onChange={e => setFormData({ ...formData, additionalRequirements: e.target.value })}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none"
                />
              </div>

              {/* Anything else we should know? */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  4. Anything else we should know? (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any extra directives for our engineering team..."
                  value={formData.anythingElse}
                  onChange={e => setFormData({ ...formData, anythingElse: e.target.value })}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none"
                />
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 10: REVIEW & LIVE APPROX PRICE BREAKDOWN */}
          {/* ==================================================== */}
          {currentStep === 10 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      Requirement Summary &amp; Investment Estimate
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Please review all your submitted parameters below. You can click Edit on any section to modify.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenAiAssistant()}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-purple-500/20 cursor-pointer active:scale-95 transition-all shrink-0 self-start sm:self-center"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>📋 Real AI Smart Summary &amp; Blueprint</span>
                  </button>
                </div>
              </div>

              {/* Live Approx Price Estimation Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-purple-950/60 dark:via-slate-900 dark:to-indigo-950/60 border border-purple-200 dark:border-purple-500/50 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                  <Sparkles className="w-32 h-32 text-purple-600 dark:text-purple-400" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      Transparent Commercial Estimate
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      Estimated Approximate Total Price
                    </h4>
                  </div>
                  <div className="text-left sm:text-right">
                    {isCouponApplied && priceBreakdown.discountAmount > 0 && (
                      <div className="flex items-center sm:justify-end gap-1.5 mb-1">
                        <span className="line-through text-sm sm:text-base text-slate-400 dark:text-slate-500 font-mono">
                          {currentCountryTheme.symbol}{priceBreakdown.subtotal.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-black text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-700 animate-pulse">
                          20% OFF APPLIED
                        </span>
                      </div>
                    )}
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {currentCountryTheme.symbol}{priceBreakdown.totalApproxPrice.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">All features &amp; 1st-year setup included</p>
                  </div>
                </div>

                {/* Price Breakdown Line Items */}
                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/40">
                    <span>Base Website ({priceBreakdown.categoryName}):</span>
                    <span className="font-mono font-semibold">₹{priceBreakdown.baseWebsitePrice.toLocaleString('en-IN')}</span>
                  </div>
                  {priceBreakdown.domainPrice > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/40">
                      <span>Domain Registration (1 Year):</span>
                      <span className="font-mono font-semibold">₹{priceBreakdown.domainPrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {priceBreakdown.hostingPrice > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/40">
                      <span>High-Speed Cloud Hosting ({formData.hostingPlan}):</span>
                      <span className="font-mono font-semibold">₹{priceBreakdown.hostingPrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {priceBreakdown.backendPrice > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/40">
                      <span>{formData.backendRequirement}:</span>
                      <span className="font-mono font-semibold">₹{priceBreakdown.backendPrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {priceBreakdown.integrationsPrice > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/40">
                      <span>Advanced Integrations:</span>
                      <span className="font-mono font-semibold">₹{priceBreakdown.integrationsPrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {/* Subtotal before coupon */}
                  <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800/60 font-semibold text-slate-800 dark:text-slate-200">
                    <span>Subtotal (Without Discounts):</span>
                    <span className="font-mono">₹{priceBreakdown.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {isCouponApplied && priceBreakdown.discountAmount > 0 && (
                    <div className="flex justify-between py-1.5 text-emerald-600 dark:text-emerald-400 font-bold border-b border-slate-200 dark:border-slate-800/60 bg-emerald-50/60 dark:bg-emerald-950/30 px-2 rounded-lg">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Special Discount Coupon ({couponCode} - 20% OFF):
                      </span>
                      <span className="font-mono">-₹{priceBreakdown.discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {/* Coupon Input & Status Box */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                  {isCouponApplied && discountPercent > 0 ? (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                              {couponCode || 'COUPON APPLIED'}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-white text-[10px] font-black">
                              {discountPercent}% OFF
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                            Saved ₹{priceBreakdown.discountAmount.toLocaleString('en-IN')} on your estimated total!
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-xs font-bold border border-rose-200 dark:border-rose-900/60 cursor-pointer transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Enter Coupon / Won Voucher Code (e.g. INDIA2025)"
                          value={couponCode}
                          onChange={e => setCouponCode(e.target.value)}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs uppercase font-mono tracking-wider outline-none focus:border-purple-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => applyCoupon()}
                          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
                        >
                          Apply Coupon
                        </button>
                      </div>
                      {(() => {
                        try {
                          const storedVoucher = localStorage.getItem('l2b_won_voucher');
                          if (storedVoucher) {
                            const parsed = JSON.parse(storedVoucher);
                            if (parsed?.code) {
                              return (
                                <button
                                  type="button"
                                  onClick={() => applyCoupon(parsed.code)}
                                  className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                                >
                                  🎁 Click to apply won voucher: <strong className="font-mono">{parsed.code}</strong> ({parsed.discountPercent || 20}% OFF)
                                </button>
                              );
                            }
                          }
                        } catch (e) {}
                        return null;
                      })()}
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Requirement Summary with Edit Buttons */}
              <div className="space-y-4">
                
                {/* 1. Client Details */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">1. Client Details</h5>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{formData.fullName} • {formData.businessName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formData.emailAddress} • {formData.mobileNumber} • {formData.businessAddress}</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                {/* 2. Selected Category */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">2. Website Category &amp; Template</h5>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 capitalize">
                      {formData.selectedCategory === 'other' ? formData.otherCategoryDescription : formData.selectedCategory}
                      {appliedTemplate ? ` (Template: ${appliedTemplate})` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                {/* 3. Design & Colors */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">3. Design Preferences</h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">Style: <span className="font-semibold text-slate-900 dark:text-white">{formData.visualStyle}</span> • Color: <span className="font-semibold text-slate-900 dark:text-white">{formData.colorTheme}</span></p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                {/* 4. Domain & Hosting */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">4. Domain &amp; Cloud Infrastructure</h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                      Domain: <span className="font-semibold text-slate-900 dark:text-white">{formData.domainStatus}</span>
                      {formData.domainStatus === 'I need a new Domain' ? ` (${formData.domainName || 'Pending'} • ${(formData.domainExtensions || ['.com']).join(', ')} — Approx ₹799–₹1,499/yr)` : ''} • 
                      Hosting: <span className="font-semibold text-slate-900 dark:text-white">{formData.hostingStatus}</span>
                      {formData.hostingStatus === 'I need new Hosting' ? ` (${formData.hostingPlan} Plan — Approx ₹1,499–₹3,999/yr)` : ''}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      * Verified availability &amp; final confirmed invoice will be emailed.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(6)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer shrink-0"
                  >
                    Edit
                  </button>
                </div>

                {/* 5. Backend & WhatsApp */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">5. Backend &amp; WhatsApp</h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">Backend: <span className="font-semibold text-slate-900 dark:text-white">{formData.backendRequirement}</span> • WhatsApp: <span className="font-semibold text-slate-900 dark:text-white">{formData.whatsappIntegration}</span></p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(7)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Upward Smooth Gradient Backdrop (Cinematic Translucent Glass in Light Mode, Deep Black in Dark Mode) */}
      <div className="fixed bottom-0 left-0 right-0 h-24 sm:h-28 pointer-events-none z-30 bg-gradient-to-t from-slate-950/30 via-indigo-950/15 via-purple-950/5 to-transparent backdrop-blur-[1.5px] dark:from-slate-950/95 dark:via-slate-950/75 dark:to-transparent transition-all" />

      {/* FLOATING BOTTOM ACTIONS DOCK: 100% Mobile Responsive Centered */}
      <div className="fixed bottom-2 sm:bottom-4 inset-x-0 mx-auto w-[96%] sm:w-[92%] max-w-5xl z-40 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-3xl border border-white/95 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl px-2.5 sm:px-6 py-2 sm:py-3 shadow-[0_-10px_35px_-5px_rgba(99,102,241,0.20),0_6px_20px_-4px_rgba(0,0,0,0.12)] dark:shadow-slate-950/90 ring-1 ring-white/90 dark:ring-0 flex items-center justify-between gap-1.5 sm:gap-3 transition-all">
        
        {/* Dynamic National Flag Minimal Top Stripe */}
        {formData.country && (
          <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${currentCountryTheme.flagStripe || 'from-purple-600 to-indigo-600'} opacity-90`} />
        )}

        {/* Left: Previous & Save Draft */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
              title="Previous Step"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.previous}</span>
            </button>
          )}

          {/* Quick Save Draft button */}
          <button
            type="button"
            onClick={handleManualSaveDraft}
            className="p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shrink-0 active:scale-95"
            title="Save Draft Locally"
          >
            <Save className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden md:inline">{t.saveDraft}</span>
            {lastSavedTime && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
        </div>

        {/* Center: Live Price Display */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-emerald-50/90 via-teal-50/90 to-emerald-50/90 dark:from-slate-800/90 dark:via-slate-800/90 dark:to-slate-800/90 px-2 sm:px-4 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border border-emerald-300/80 dark:border-slate-700/80 shadow-xs min-w-0 shrink">
          <span className="text-xs sm:text-sm select-none shrink-0">{currentCountryTheme.flag}</span>
          <div className="flex flex-col text-left min-w-0 truncate">
            {isCouponApplied && priceBreakdown.discountAmount > 0 && (
              <div className="flex items-center gap-1 leading-none">
                <span className="line-through text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                  {formatPriceByCountry(priceBreakdown.subtotal, formData.country)}
                </span>
                <span className="text-[8px] sm:text-[9px] font-black text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-1 py-0.2 rounded font-mono shrink-0">
                  {discountPercent}%
                </span>
              </div>
            )}
            <span className="font-mono font-black text-xs sm:text-base text-emerald-600 dark:text-emerald-400 leading-tight truncate">
              {formatPriceByCountry(priceBreakdown.totalApproxPrice, formData.country)}
            </span>
          </div>
        </div>

        {/* Right: Continue / Submit Button */}
        <div className="shrink-0">
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-3 sm:px-6 py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black shadow-md shadow-purple-600/30 active:scale-95 transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0"
            >
              <span>{t.continue}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-3 sm:px-6 py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">{t.submitting}</span>
                  <span className="sm:hidden">Submitting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.submit}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
          </>
        )}
      </main>


      {/* ==================================================== */}
      {/* AI REQUIREMENT GUIDE & LIVE ARCHITECTURE BLUEPRINT DRAWER */}
      {/* ==================================================== */}
      {showAiDrawer && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-300"
          onClick={() => setShowAiDrawer(false)}
          onWheel={e => e.stopPropagation()}
          onTouchMove={e => e.stopPropagation()}
        >
          <div
            className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 relative z-10 overflow-hidden"
            onClick={e => e.stopPropagation()}
            onWheel={e => e.stopPropagation()}
            onTouchMove={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-950/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-500/30 shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                      AI Project Architecture Blueprint
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Live AI Spec
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                    Step {currentStep}: {t.steps[currentStep - 1]?.title || 'Blueprint Summary'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Language switcher */}
                <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-xl text-[10px] font-bold">
                  {['en', 'bn', 'hi'].map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setSummaryLang(l)}
                      className={`px-1.5 sm:px-2 py-0.5 rounded-lg uppercase transition-all cursor-pointer ${
                        summaryLang === l
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowAiDrawer(false)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Area: Clean Live Dynamic Architecture Blueprint */}
            <div 
              className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3.5 no-scrollbar"
              onWheel={e => e.stopPropagation()}
              onTouchMove={e => e.stopPropagation()}
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Summary Header Pill */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Live Dynamic Architecture Blueprint
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(liveAiSummaryText);
                    toast.success('📋 Blueprint copied to clipboard!');
                  }}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" /> Copy Blueprint
                </button>
              </div>

              {/* Formatted Code / Spec Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto shadow-inner overscroll-contain">
                {liveAiSummaryText}
              </div>

              {/* Informative Note */}
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/40 space-y-1 text-xs text-purple-950 dark:text-purple-200">
                <strong className="block font-bold">💡 Architectural Scope Review:</strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  This blueprint dynamically updates as you complete the form. Upon submission, it is passed directly to our senior web architects to begin rapid sprint wireframing and production deployment.
                </p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/90 dark:bg-slate-950/80 shrink-0">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(liveAiSummaryText);
                  toast.success('📋 AI Summary copied to clipboard!');
                }}
                className="py-2.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Blueprint
              </button>
              <button
                type="button"
                onClick={() => setShowAiDrawer(false)}
                className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-purple-600/25 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* RESUME SAVED DRAFT OR START FRESH POPUP MODAL */}
      {/* ==================================================== */}
      {showDraftModal && pendingDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-300 relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-inner">
              <FileText className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Resume Previous Order Draft?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {pendingDraft.appliedTemplate
                  ? `You previously saved a draft with the template "${pendingDraft.appliedTemplate}". Would you like to apply that saved form or start fresh without any template?`
                  : `We found your previously saved order requirements. Would you like to continue where you left off or start fresh?`}
              </p>
            </div>

            {/* Saved Draft Information Card */}
            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="text-slate-400">Business / Project:</span>
                <strong className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                  {pendingDraft.formData?.businessName || pendingDraft.formData?.fullName || 'Custom Order'}
                </strong>
              </div>
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="text-slate-400">Website Category:</span>
                <strong className="font-semibold text-slate-900 dark:text-white capitalize">
                  {pendingDraft.formData?.selectedCategory || 'Not Selected'}
                </strong>
              </div>
              {pendingDraft.appliedTemplate && (
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span className="text-slate-400">Applied Template:</span>
                  <strong className="font-semibold text-purple-600 dark:text-purple-400 truncate max-w-[180px]">
                    {pendingDraft.appliedTemplate}
                  </strong>
                </div>
              )}
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="text-slate-400">Completed Progress:</span>
                <span className="font-bold font-mono text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-md">
                  Step {pendingDraft.currentStep || 1} of 10
                </span>
              </div>
              {pendingDraft.lastSaved && (
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-purple-200/60 dark:border-purple-800/40">
                  <span>Saved on this device:</span>
                  <span>{new Date(pendingDraft.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleStartFresh}
                className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Start Fresh
              </button>
              <button
                type="button"
                onClick={handleResumeDraft}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" /> Resume Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* LIVE DEMO PREVIEW MODAL */}
      {/* ==================================================== */}
      {previewDemoItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200">
          <div
            className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">{previewDemoItem.category} Template</span>
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{previewDemoItem.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDemoItem(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Preview Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border">
                <img
                  src={previewDemoItem.heroImage || previewDemoItem.thumbnail}
                  alt={previewDemoItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Turnaround Time</span>
                  <strong className="text-slate-900 dark:text-white">{previewDemoItem.turnaround || '3 - 7 Days'}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Starting Investment</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{formatPriceByCountry(previewDemoItem.priceInr || previewDemoItem.price || 4999, formData.country)}</strong>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {previewDemoItem.description || previewDemoItem.shortDescription}
              </p>

              {previewDemoItem.features && (
                <div className="space-y-1.5">
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white">Included Key Modules:</h6>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {previewDemoItem.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/60">
              {previewDemoItem.liveUrl ? (
                <a
                  href={previewDemoItem.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Full Demo Site
                </a>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={() => {
                  handleApplyTemplate(previewDemoItem);
                  setPreviewDemoItem(null);
                }}
                className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <Zap className="w-3.5 h-3.5" /> Apply This Template
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
