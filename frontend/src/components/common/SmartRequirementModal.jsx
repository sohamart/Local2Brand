import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Phone,
  Mail,
  Building2,
  Building,
  CheckCircle2,
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  User,
  Layout,
  Layers,
  ShieldCheck,
  Lock,
  Globe,
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
  CreditCard,
  MessageSquare,
  Palette,
  Server,
  Clock,
  Edit3,
  ExternalLink,
  UploadCloud,
  FileText,
  Bookmark
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useOrderModal } from '../../context/OrderModalContext';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import api from '../../services/api';
import AshokaChakra from './AshokaChakra';

// Icon Map for dynamic category render
const ICON_MAP = {
  Utensils,
  Coffee,
  Sparkles,
  Dumbbell,
  Hotel,
  Building2,
  Camera,
  ShoppingBag,
  GraduationCap,
  Stethoscope,
  Gem,
  Car,
  Layers,
  Globe
};

// Comprehensive Category-Specific Dynamic Question Schema
const CATEGORY_SPECS = {
  restaurant: {
    title: 'Restaurant & Dining Specifications',
    cuisines: ['North Indian', 'Bengali Specials', 'Mughlai & Biryani', 'Chinese', 'Continental', 'South Indian', 'Italian & Pizza', 'Fast Food & Chaat'],
    fields: [
      { id: 'seatingCapacity', label: 'Approximate Seating Capacity', type: 'select', options: ['Under 30 Seats', '30 - 60 Seats', '60 - 120 Seats', '120+ Seats / Banquet'] },
      { id: 'tableBookingSlots', label: 'Table Reservation Timings Needed', type: 'multiselect', options: ['Lunch Slots (12 PM - 4 PM)', 'Dinner Slots (7 PM - 11 PM)', 'Weekend Special Slots', 'Private Party Bookings'] },
      { id: 'foodDelivery', label: 'Food Delivery & Ordering Channels', type: 'multiselect', options: ['Direct Website Ordering', 'WhatsApp Takeaway Orders', 'Zomato Integration Link', 'Swiggy Integration Link'] },
      { id: 'specialties', label: 'Chef Signature Dishes & Specialties', type: 'textarea', placeholder: 'e.g. Special Kolkata Dum Biryani, Mutton Kosha, Firni' }
    ]
  },
  cafe: {
    title: 'Café & Bakery Specifications',
    cuisines: ['Specialty Espresso & Brews', 'Artisan Bakery & Pastries', 'Custom Cakes', 'All-Day Breakfast & Waffles', 'Mocktails & Shakes'],
    fields: [
      { id: 'orderType', label: 'Takeout / Dine-in Setup', type: 'multiselect', options: ['Dine-In Table Menu', 'Counter Takeout Pickup', 'Pre-Order Birthday Cakes', 'WhatsApp Delivery'] },
      { id: 'instagramFeed', label: 'Instagram Aesthetic Feed Embed?', type: 'select', options: ['Yes, Live Instagram Feed', 'No, Static Photo Gallery Only'] },
      { id: 'specialties', label: 'Signature Coffee Blends & Bakery Items', type: 'textarea', placeholder: 'e.g. Vanilla Cold Brew, Belgian Chocolate Truffle Cake' }
    ]
  },
  salon: {
    title: 'Salon, Spa & Beauty Studio Specifications',
    cuisines: ['Hair Styling & Keratin', 'Bridal & Party Makeup', 'Skin Care & Facial', 'Nail Art & Extensions', 'Massage & Spa', 'Tattoo Studio'],
    fields: [
      { id: 'numberOfStylists', label: 'Number of Stylists / Beauticians', type: 'select', options: ['1 - 3 Stylists', '4 - 8 Stylists', '8+ Stylists (Multi-Branch)'] },
      { id: 'bookingStyle', label: 'Appointment Booking Workflow', type: 'multiselect', options: ['Select Specific Stylist with Time Slot', 'Instant WhatsApp Appointment', 'Deposit Advance Required'] },
      { id: 'serviceDuration', label: 'Service Duration Rate-Card', type: 'select', options: ['Yes, Display Time & Price per Service', 'Display Price Only'] },
      { id: 'specialties', label: 'Top Beauty & Spa Packages', type: 'textarea', placeholder: 'e.g. Pre-Bridal Glow Package, Moroccan Hair Spa' }
    ]
  },
  gym: {
    title: 'Gym & Fitness Hub Specifications',
    cuisines: ['Strength Training & Weights', 'Cardio & Crossfit', 'Zumba & Aerobics', 'Personal Training', 'Yoga & Pilates', 'Steam & Sauna'],
    fields: [
      { id: 'membershipTiers', label: 'Membership Packages to Display', type: 'multiselect', options: ['Monthly Plan', 'Quarterly (3 Months)', 'Half-Yearly (6 Months)', 'Annual VIP Plan', 'Personal Training Add-On'] },
      { id: 'trialPass', label: '1-Day Free Trial Pass Lead Funnel?', type: 'select', options: ['Yes, Instant Free Trial Pass with SMS/Email', 'No Trial Pass'] },
      { id: 'classSchedule', label: 'Weekly Live Class Timetable Needed?', type: 'select', options: ['Yes, Interactive Class Timetable', 'No Timetable'] },
      { id: 'specialties', label: 'Gym Equipment & Highlights', type: 'textarea', placeholder: 'e.g. Imported Hammer Strength machines, Certified nutritionist' }
    ]
  },
  hotel: {
    title: 'Hotel, Resort & Homestay Specifications',
    cuisines: ['Standard Rooms', 'Deluxe AC Rooms', 'Executive Suites', 'Private Luxury Villas', 'Cottages'],
    fields: [
      { id: 'roomBookingEngine', label: 'Direct Room Booking Engine', type: 'select', options: ['Full Check-In / Check-Out Calendar Engine', 'Booking Inquiry Form with Instant Callback'] },
      { id: 'amenities', label: 'Property Amenities to Showcase', type: 'multiselect', options: ['Swimming Pool', 'Multi-Cuisine Restaurant', 'Free Wi-Fi', 'Spa & Wellness', 'Banquet / Lawn for Weddings', 'Car Parking'] },
      { id: 'checkinPolicy', label: 'Check-in & Check-out Policies', type: 'text', placeholder: 'e.g. Check-in 12:00 PM | Check-out 11:00 AM' },
      { id: 'specialties', label: 'Property Highlights & Sightseeing Tours', type: 'textarea', placeholder: 'e.g. Mountain view suites, local river cruise arrangements' }
    ]
  },
  real_estate: {
    title: 'Real Estate & Property Portal Specifications',
    cuisines: ['1 BHK / 2 BHK / 3 BHK Apartments', 'Luxury Villas & Duplexes', 'Commercial Shops & Offices', 'Residential Plots'],
    fields: [
      { id: 'propertyFilter', label: 'Property Search & Filter Capabilities', type: 'multiselect', options: ['Filter by BHK & Budget', 'Filter by Location / City Zone', 'Possession Status (Ready / Under Construction)'] },
      { id: 'virtualTours', label: 'Floor Plans & 3D Virtual Tours', type: 'select', options: ['High-Res Floor Plans & Brochure PDF Download', '3D Video Tours Embed'] },
      { id: 'siteVisit', label: 'Site Visit Scheduling Funnel', type: 'select', options: ['Yes, Automated Site Visit Booking with Cab Pickup option', 'Standard Callback Request'] },
      { id: 'specialties', label: 'Ongoing & Featured Projects', type: 'textarea', placeholder: 'e.g. Eden Greens Rajarhat, Primus Towers E.M Bypass' }
    ]
  },
  photography: {
    title: 'Photography & Studio Specifications',
    cuisines: ['Wedding & Reception', 'Pre-Wedding & Destination', 'Maternity & Newborn', 'Fashion & Portfolio', 'Corporate Events', 'Commercial Product Shoots'],
    fields: [
      { id: 'clientGallery', label: 'Client Photo Proofing & Delivery Portal', type: 'select', options: ['Private Client Gallery with PIN / Password', 'Public Lookbook Only'] },
      { id: 'pricingPackages', label: 'Package Quotations to Display', type: 'multiselect', options: ['Standard 1-Day Package', 'Silver 2-Day Wedding Story', 'Gold Cinematic Royal Package', 'Custom Quote Generator'] },
      { id: 'specialties', label: 'Camera Gear & Cinema Equipment', type: 'textarea', placeholder: 'e.g. Sony A7IV, Drone cinematography, Prime G-Master lenses' }
    ]
  },
  boutique: {
    title: 'Fashion Boutique & E-Commerce Specifications',
    cuisines: ['Ethnic & Saree', 'Designer Lehengas & Bridal', 'Western & Indo-Western', 'Men Kurta & Sherwani', 'Kids Apparel', 'Jewellery Accessories'],
    fields: [
      { id: 'catalogSize', label: 'Initial Product Inventory Size', type: 'select', options: ['10 - 50 Products (Starter)', '50 - 200 Products (Standard)', '200 - 1000+ Products (Full Store)'] },
      { id: 'ecommerceFeatures', label: 'E-Commerce Capabilities', type: 'multiselect', options: ['Size Charts & Color Variants', 'Pincode Delivery Check', 'Razorpay / UPI Instant Payment', 'Cash on Delivery (COD)'] },
      { id: 'specialties', label: 'Fabric & Signature Collections', type: 'textarea', placeholder: 'e.g. Pure Tussar Silk, Handloom Jamdani, Organza Embroidery' }
    ]
  },
  coaching: {
    title: 'Coaching Institute & EdTech Specifications',
    cuisines: ['JEE & NEET Medical/Engineering', 'Class 8-12 CBSE / ICSE', 'Competitive Exams (UPSC, WBPSC, Banking)', 'Coding & Web Development', 'Spoken English & IELTS'],
    fields: [
      { id: 'courseDelivery', label: 'Course Mode & Infrastructure', type: 'multiselect', options: ['Offline Classroom Batches', 'Live Online Classes', 'Recorded Video Lectures', 'Study Material & Test Series PDF'] },
      { id: 'admissionFunnel', label: 'Student Enrollment Funnel', type: 'select', options: ['Free Demo Class Registration Form', 'Direct Course Enrollment & Fee Payment'] },
      { id: 'specialties', label: 'Faculty Credentials & Past Toppers', type: 'textarea', placeholder: 'e.g. IITian Faculty, Top 100 AIR rankers in NEET 2025' }
    ]
  },
  clinic: {
    title: 'Clinic & Doctor Practice Specifications',
    cuisines: ['Dental & Orthodontics', 'Dermatology & Skin', 'General Medicine', 'Pediatrics & Child Care', 'Cardiology & Diagnostics', 'Physiotherapy & Eye Care'],
    fields: [
      { id: 'appointmentSystem', label: 'Patient Appointment System', type: 'multiselect', options: ['OPD Token Slot Booking', 'Direct WhatsApp Doctor Callback', 'Prescription / Medical Report Upload'] },
      { id: 'doctorSchedule', label: 'Doctor Visiting Hours & Consultation Fee', type: 'select', options: ['Display Visiting Timetable & Fee Clearly', 'Inquire Fee on Call'] },
      { id: 'specialties', label: 'Clinic Treatments & Diagnostic Equipment', type: 'textarea', placeholder: 'e.g. Painless Laser Dentistry, Digital X-Ray, Root Canal Therapy' }
    ]
  },
  jewellery: {
    title: 'Jewellery & Luxury Gift Specifications',
    cuisines: ['22K & 24K Gold Ornaments', 'Certified Diamond Jewellery', 'Bridal Polki & Kundan', '925 Sterling Silver', 'Gemstones & Astrological Stones'],
    fields: [
      { id: 'goldTicker', label: 'Live Daily Gold & Silver Price Ticker?', type: 'select', options: ['Yes, Live Daily Rate Ticker', 'No Ticker'] },
      { id: 'virtualShopping', label: 'Video Call Shopping Booking?', type: 'select', options: ['Yes, Book 1-on-1 Video Consultation', 'Store Visit Only'] },
      { id: 'specialties', label: 'Hallmark & Craftsmanship Specialties', type: 'textarea', placeholder: 'e.g. BIS Hallmarked Gold, IGI Certified Solitaires' }
    ]
  },
  showroom: {
    title: 'Automotive & EV Showroom Specifications',
    cuisines: ['Four-Wheelers / Cars', 'Two-Wheelers / Bikes', 'Electric Vehicles (EV)', 'Commercial Vehicles', 'Pre-Owned Certified Vehicles'],
    fields: [
      { id: 'testDrive', label: 'Test Drive Booking Funnel', type: 'select', options: ['Interactive Test Drive Slot Booking with Vehicle Selection', 'Standard Callback Form'] },
      { id: 'emiCalculator', label: 'On-Road Price & EMI Calculator Widget', type: 'select', options: ['Yes, Live Interactive EMI Calculator', 'No Calculator'] },
      { id: 'serviceBooking', label: 'Vehicle Service & Maintenance Appointment', type: 'select', options: ['Yes, Service Booking Calendar', 'Sales Only'] },
      { id: 'specialties', label: 'Featured Vehicle Models & Brands', type: 'textarea', placeholder: 'e.g. Electric scooters with 150km range, Fast charger setup' }
    ]
  },
  custom: {
    title: 'Custom Business Specifications',
    cuisines: ['Custom Software / SaaS', 'Multi-Vendor Marketplace', 'Export & Import Portal', 'B2B Wholesale Directory', 'Legal & Financial Consultancy'],
    fields: [
      { id: 'customBusinessType', label: 'Exact Business Category', type: 'text', placeholder: 'e.g. Chartered Accountant Firm / Logistics Agency' },
      { id: 'customFeatures', label: 'Unique Features or API Integrations Required', type: 'textarea', placeholder: 'e.g. CRM integration, SMS gateway, Custom database dashboard' }
    ]
  }
};

export default function SmartRequirementModal() {
  const { isInquiryOpen, closeOrderModal, inquiryData } = useOrderModal();
  const { user, openAuthModal } = useAuth();
  const { settings } = useSiteSettings();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formSchema, setFormSchema] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [autoSavedTime, setAutoSavedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Comprehensive Form State
  const [formData, setFormData] = useState({
    requirementId: '',
    websiteType: 'restaurant',
    websiteTypeName: 'Restaurant / Fine Dining',
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
    // Dynamic category specs storage
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
      clientGallery: '',
      pricingPackages: [],
      catalogSize: '',
      ecommerceFeatures: [],
      courseDelivery: [],
      admissionFunnel: '',
      appointmentSystem: [],
      doctorSchedule: '',
      goldTicker: '',
      virtualShopping: '',
      testDrive: '',
      emiCalculator: '',
      serviceBooking: '',
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
    paymentMethods: ['Razorpay', 'UPI (GPay / PhonePe / Paytm)', 'Cash on Delivery (COD)'],
    adminPanelType: 'Full Dynamic Admin Panel',
    whatsappIntegration: true,
    whatsappOptions: ['WhatsApp Floating Quick Button', 'Direct Order / Booking to WhatsApp'],
    emailIntegration: true,
    emailOptions: ['Automated Order / Inquiry Confirmation', 'Admin Alert Emails'],
    designStyle: 'Modern Glassmorphic & Vibrant',
    preferredColors: 'Purple, Neon Blue & Luxury Gold',
    referenceUrls: '',
    domainStatus: 'Need New Domain (Free Included)',
    hostingStatus: 'High-Speed Cloud Hosting (Free 1-Yr Included)',
    budget: '₹10,000 – ₹25,000 (Standard Commercial)',
    timeline: '⚡ Express Delivery (48 - 72 Hours)',
    additionalNotes: ''
  });

  // 1. Fetch Form Config from Backend
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        setLoadingSchema(true);
        const res = await api.get('/forms/published');
        if (res.success && res.form) {
          setFormSchema(res.form);
        }
      } catch (err) {
        console.warn('Using default form schema fallback:', err);
      } finally {
        setLoadingSchema(false);
      }
    };
    fetchSchema();
  }, []);

  // 2. Autosave Restore & Initialize
  useEffect(() => {
    if (isInquiryOpen) {
      setSubmittedData(null);
      setErrorMessage('');

      // Check localStorage for autosaved draft
      const savedDraft = localStorage.getItem('l2b_smart_form_autosave');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setFormData((prev) => ({
            ...prev,
            ...parsed,
            clientInfo: {
              ...prev.clientInfo,
              ...parsed.clientInfo,
              ownerName: user?.name || parsed.clientInfo?.ownerName || '',
              email: user?.email || parsed.clientInfo?.email || '',
              mobile: user?.phone || parsed.clientInfo?.mobile || ''
            }
          }));
        } catch (e) {
          console.error(e);
        }
      } else if (user) {
        setFormData((prev) => ({
          ...prev,
          clientInfo: {
            ...prev.clientInfo,
            ownerName: user.name || '',
            email: user.email || '',
            mobile: user.phone || ''
          }
        }));
      }
    }
  }, [isInquiryOpen, user]);

  // 3. Periodic Autosave
  useEffect(() => {
    if (!isInquiryOpen || submittedData) return;
    const timer = setTimeout(() => {
      localStorage.setItem('l2b_smart_form_autosave', JSON.stringify(formData));
      setAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData, isInquiryOpen, submittedData]);

  if (!isInquiryOpen) return null;

  // Step Definitions
  const STEPS = [
    { id: 'step_type', title: '01 Website Type' },
    { id: 'step_client', title: '02 Client Details' },
    { id: 'step_business', title: '03 Business Details' },
    { id: 'step_pages', title: '04 Website Pages' },
    { id: 'step_functionality', title: '05 Functionality' },
    { id: 'step_payment', title: '06 Payment' },
    { id: 'step_admin', title: '07 Admin Panel' },
    { id: 'step_communication', title: '08 WhatsApp & Email' },
    { id: 'step_design', title: '09 Design & Branding' },
    { id: 'step_hosting', title: '10 Domain & Hosting' },
    { id: 'step_budget', title: '11 Budget & Timeline' },
    { id: 'step_review', title: '12 Review & Submit' }
  ];

  const currentStep = STEPS[currentStepIndex] || STEPS[0];
  const activeCategorySpec = CATEGORY_SPECS[formData.websiteType] || CATEGORY_SPECS.custom;

  const handleNext = () => {
    // Validate Step 2 Client info
    if (currentStepIndex === 1) {
      if (!formData.clientInfo.businessName || !formData.clientInfo.mobile || !formData.clientInfo.email) {
        setErrorMessage('Please provide Business Name, Mobile Number and Email Address.');
        return;
      }
    }
    setErrorMessage('');
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const jumpToStep = (index) => {
    setErrorMessage('');
    setCurrentStepIndex(index);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        ...formData,
        formVersion: formSchema?.version || '1.0'
      };

      const res = await api.post('/requirements', payload);
      if (res.success) {
        const submitRes = await api.post(`/requirements/${res.requirementId}/submit`, payload);
        if (submitRes.success) {
          setSubmittedData(submitRes.requirement);
          localStorage.removeItem('l2b_smart_form_autosave');
          toast.success('Project requirements submitted successfully! 🚀');
        } else {
          setErrorMessage(submitRes.message || 'Submission failed');
          toast.error(submitRes.message || 'Submission failed');
        }
      } else {
        setErrorMessage(res.message || 'Failed to initialize requirement session');
        toast.error(res.message || 'Failed to initialize requirement session');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error submitting requirements');
      toast.error(err.message || 'Network error submitting requirements');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-slate-950/85 backdrop-blur-2xl animate-in fade-in duration-200">
      
      {/* Animated Gradient Glow Border Frame */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.25)] border-2 border-purple-500/40 dark:border-purple-500/30 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* TOP BAR */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AshokaChakra size={9} />
                  <span>Smart Requirement Builder v{formSchema?.version || '1.0'}</span>
                </span>
                {autoSavedTime && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">
                    ● Autosaved at {autoSavedTime}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {currentStep.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!user && (
              <button
                onClick={() => openAuthModal()}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 cursor-pointer"
              >
                Sign In
              </button>
            )}
            <button
              onClick={closeOrderModal}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PROGRESS STEPPER INDICATOR */}
        {!submittedData && (
          <div className="bg-slate-100/80 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 px-3 py-2 overflow-x-auto scrollbar-none shrink-0">
            <div className="flex items-center gap-1.5 min-w-max">
              {STEPS.map((s, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;

                return (
                  <button
                    key={s.id}
                    onClick={() => jumpToStep(idx)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400/40'
                        : isPassed
                        ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80'
                        : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                    <span className="hidden md:inline">{s.title.replace(/^\d+\s*/, '')}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* BODY CONTENT */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
          
          {submittedData ? (
            /* FINAL SUCCESS STATE */
            <div className="text-center py-8 space-y-5">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full">
                  Requirement Session Confirmed
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Thank You, {submittedData.clientInfo?.ownerName || 'Valued Client'}!
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Your project specifications for <strong>{submittedData.clientInfo?.businessName}</strong> have been received and assigned unique tracking ID:
                </p>
                <div className="font-mono text-xl font-black text-purple-600 bg-purple-50 dark:bg-purple-950/60 p-3 rounded-2xl border border-purple-200 dark:border-purple-800 inline-block">
                  {submittedData.requirementId}
                </div>
              </div>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={closeOrderModal}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* STEP 1: WEBSITE TYPE */}
              {currentStepIndex === 0 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      What type of website does your business need?
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select your industry. Subsequent questions will dynamically adapt specifically to your business model.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                    {(formSchema?.categories || [
                      { id: 'restaurant', name: 'Restaurant / Fine Dining', icon: 'Utensils', badge: 'Popular', description: 'Table reservations, digital food menus & takeaway delivery funnels' },
                      { id: 'cafe', name: 'Café / Coffee Shop / Bakery', icon: 'Coffee', badge: 'Trending', description: 'Cozy visual lookbook, signature brews & pickup takeout orders' },
                      { id: 'salon', name: 'Salon / Spa / Beauty Studio', icon: 'Sparkles', badge: 'High Demand', description: 'Stylist rosters, service rate-cards & online slot booking' },
                      { id: 'gym', name: 'Gym / Fitness Hub / Crossfit', icon: 'Dumbbell', badge: 'High ROI', description: 'Membership plans, trainer profiles, workout schedule & admissions' },
                      { id: 'hotel', name: 'Hotel / Resort / Homestay', icon: 'Hotel', badge: 'Luxury', description: 'Room showcase, amenities, seasonal tariffs & direct room booking' },
                      { id: 'real_estate', name: 'Real Estate / Property Agency', icon: 'Building2', badge: 'Commercial', description: 'Property listings, virtual tours, map search & broker lead capture' },
                      { id: 'photography', name: 'Photography / Wedding Studio', icon: 'Camera', badge: 'Visual', description: 'High-res portfolio albums, package rates & consultation booking' },
                      { id: 'boutique', name: 'Boutique / Fashion & Apparel', icon: 'ShoppingBag', badge: 'E-Commerce', description: 'Apparel lookbook, size guides, cart checkout & collections' },
                      { id: 'coaching', name: 'Coaching / EdTech / Institute', icon: 'GraduationCap', badge: 'Education', description: 'Course catalogues, batch schedules & admission registration' },
                      { id: 'clinic', name: 'Clinic / Doctor / Healthcare', icon: 'Stethoscope', badge: 'Verified', description: 'Doctor bio, OPD token booking & prescription uploads' },
                      { id: 'jewellery', name: 'Jewellery / Luxury Gift Shop', icon: 'Gem', badge: 'Prestige', description: 'Gold/diamond showcases, live rates & custom enquiry funnels' },
                      { id: 'showroom', name: 'Car / Bike Showroom & Service', icon: 'Car', badge: 'Automotive', description: 'Vehicle inventory, EMI calculators & test drive booking' },
                      { id: 'custom', name: 'Other / Custom Business Website', icon: 'Layers', badge: 'Bespoke', description: 'Custom web software, B2B wholesale, or bespoke enterprise build' }
                    ]).map((cat) => {
                      const isSelected = formData.websiteType === cat.id;
                      const IconComponent = ICON_MAP[cat.icon] || Globe;

                      return (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              websiteType: cat.id,
                              websiteTypeName: cat.name
                            }));
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group relative ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/60 shadow-md ring-2 ring-purple-500/30'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-purple-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                              isSelected ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            {cat.badge && (
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                                {cat.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                            {cat.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                            {cat.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: CLIENT INFORMATION */}
              {currentStepIndex === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Common Client & Brand Details
                    </h3>
                    <p className="text-xs text-slate-500">
                      Essential contact, location and brand asset status.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Business / Brand Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.clientInfo.businessName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, clientInfo: { ...prev.clientInfo, businessName: e.target.value } }))}
                        placeholder="e.g. Royal Sweets / Zenith Realty"
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Owner / Manager Name</label>
                      <input
                        type="text"
                        value={formData.clientInfo.ownerName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, clientInfo: { ...prev.clientInfo, ownerName: e.target.value } }))}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.clientInfo.mobile}
                        onChange={(e) => setFormData((prev) => ({ ...prev, clientInfo: { ...prev.clientInfo, mobile: e.target.value } }))}
                        placeholder="9876543210"
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.clientInfo.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, clientInfo: { ...prev.clientInfo, email: e.target.value } }))}
                        placeholder="contact@yourbrand.com"
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">City, State & Pincode</label>
                      <input
                        type="text"
                        value={formData.clientInfo.city}
                        onChange={(e) => setFormData((prev) => ({ ...prev, clientInfo: { ...prev.clientInfo, city: e.target.value } }))}
                        placeholder="e.g. Kolkata, West Bengal - 700001"
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Existing Website URL (if any)</label>
                      <input
                        type="url"
                        value={formData.clientInfo.existingWebsite}
                        onChange={(e) => setFormData((prev) => ({ ...prev, clientInfo: { ...prev.clientInfo, existingWebsite: e.target.value } }))}
                        placeholder="https://myoldwebsite.com"
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Brand Asset Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                      <label className="text-xs font-bold block text-slate-900 dark:text-white">Do you already have a logo?</label>
                      <div className="space-y-1.5 text-xs">
                        {['yes', 'no', 'need_redesign'].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="hasLogo"
                              checked={formData.clientInfo.hasLogo === opt}
                              onChange={() => setFormData((prev) => ({ ...prev, clientInfo: { ...prev.clientInfo, hasLogo: opt } }))}
                            />
                            <span>{opt === 'yes' ? 'Yes, High-Res Ready' : opt === 'no' ? 'No, Need Logo Design' : 'Need Modern Redesign'}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                      <label className="text-xs font-bold block text-slate-900 dark:text-white">Photos & Written Content Ready?</label>
                      <div className="space-y-1.5 text-xs">
                        {['yes', 'partially', 'no'].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="contentReady"
                              checked={formData.clientInfo.contentReady === opt}
                              onChange={() => setFormData((prev) => ({ ...prev, clientInfo: { ...prev.clientInfo, contentReady: opt } }))}
                            />
                            <span>{opt === 'yes' ? 'Yes, Photos & Text Ready' : opt === 'partially' ? 'Partially Ready' : 'Need Full Content Creation'}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: DYNAMIC CATEGORY-SPECIFIC QUESTIONS */}
              {currentStepIndex === 2 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-0.5">
                      <Bookmark size={11} />
                      <span>{formData.websiteTypeName} Questionnaire</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {activeCategorySpec.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      These questions are dynamically calibrated specifically for your business model.
                    </p>
                  </div>

                  {/* Multi-select Cuisines / Offerings Chips */}
                  {activeCategorySpec.cuisines && (
                    <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/80 space-y-2.5">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Select Relevant Specialties / Categories To Feature:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {activeCategorySpec.cuisines.map((c) => {
                          const isChecked = formData.businessDetails.selectedCuisines?.includes(c);
                          return (
                            <button
                              type="button"
                              key={c}
                              onClick={() => {
                                const current = formData.businessDetails.selectedCuisines || [];
                                const updated = isChecked ? current.filter((item) => item !== c) : [...current, c];
                                setFormData((prev) => ({
                                  ...prev,
                                  businessDetails: { ...prev.businessDetails, selectedCuisines: updated }
                                }));
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isChecked
                                  ? 'bg-purple-600 text-white shadow-xs'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-400'
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                              <span>{c}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Fields List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {activeCategorySpec.fields?.map((field) => (
                      <div
                        key={field.id}
                        className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2 ${
                          field.type === 'textarea' ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                          {field.label}
                        </label>

                        {field.type === 'select' && (
                          <select
                            value={formData.businessDetails[field.id] || ''}
                            onChange={(e) => setFormData((prev) => ({
                              ...prev,
                              businessDetails: { ...prev.businessDetails, [field.id]: e.target.value }
                            }))}
                            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                          >
                            <option value="">Select option...</option>
                            {field.options?.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}

                        {field.type === 'multiselect' && (
                          <div className="space-y-1.5">
                            {field.options?.map((opt) => {
                              const checked = (formData.businessDetails[field.id] || []).includes(opt);
                              return (
                                <label key={opt} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                      const currentList = formData.businessDetails[field.id] || [];
                                      const updatedList = checked ? currentList.filter((x) => x !== opt) : [...currentList, opt];
                                      setFormData((prev) => ({
                                        ...prev,
                                        businessDetails: { ...prev.businessDetails, [field.id]: updatedList }
                                      }));
                                    }}
                                  />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {field.type === 'text' && (
                          <input
                            type="text"
                            value={formData.businessDetails[field.id] || ''}
                            onChange={(e) => setFormData((prev) => ({
                              ...prev,
                              businessDetails: { ...prev.businessDetails, [field.id]: e.target.value }
                            }))}
                            placeholder={field.placeholder || ''}
                            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                          />
                        )}

                        {field.type === 'textarea' && (
                          <textarea
                            rows={2}
                            value={formData.businessDetails[field.id] || ''}
                            onChange={(e) => setFormData((prev) => ({
                              ...prev,
                              businessDetails: { ...prev.businessDetails, [field.id]: e.target.value }
                            }))}
                            placeholder={field.placeholder || ''}
                            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white leading-relaxed resize-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* STEP 4: WEBSITE PAGES */}
              {currentStepIndex === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Select Website Pages & Layout Sections
                    </h3>
                    <p className="text-xs text-slate-500">
                      Check all core pages you want built into your website.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      'Home Page (High-Converting Hero)',
                      'About Us / Founders Story',
                      'Services / Food Menu / Product Catalog',
                      'Online Booking / Reservation System',
                      'Interactive Photo / Video Gallery',
                      'Customer Reviews & Testimonials',
                      'FAQ & Knowledgebase',
                      'Contact Page & Google Map Integration',
                      'Team / Stylists / Doctors Profiles',
                      'Offers & Discount Banners'
                    ].map((pg) => {
                      const isChecked = formData.selectedPages.includes(pg);
                      return (
                        <div
                          key={pg}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              selectedPages: isChecked
                                ? prev.selectedPages.filter((p) => p !== pg)
                                : [...prev.selectedPages, pg]
                            }));
                          }}
                          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-purple-50 dark:bg-purple-950/70 border-purple-500 text-purple-950 dark:text-purple-200 shadow-2xs'
                              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                          }`}
                        >
                          <span>{pg}</span>
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                            isChecked ? 'bg-purple-600 border-purple-600 text-white shadow-xs' : 'border-slate-400'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: FUNCTIONALITY */}
              {currentStepIndex === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Which Functionality Do You Need?
                    </h3>
                    <p className="text-xs text-slate-500">
                      Toggle modules to include in your digital infrastructure.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      'User Registration / Customer Login',
                      'Online Table / Appointment Booking',
                      'Online Food Ordering / Delivery Cart',
                      'E-Commerce Shopping Cart & Checkout',
                      'Direct Inquiry & Callback Funnel',
                      'Interactive Live Search & Filters',
                      'Automated WhatsApp Lead Notifications',
                      'Automated Email Receipts & Confirmations',
                      'PDF Invoice / Menu Download',
                      'Live Chatbot / Customer Support Widget'
                    ].map((fn) => {
                      const isChecked = formData.selectedFeatures.includes(fn);
                      return (
                        <div
                          key={fn}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              selectedFeatures: isChecked
                                ? prev.selectedFeatures.filter((f) => f !== fn)
                                : [...prev.selectedFeatures, fn]
                            }));
                          }}
                          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-purple-50 dark:bg-purple-950/70 border-purple-500 text-purple-950 dark:text-purple-200 shadow-2xs'
                              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                          }`}
                        >
                          <span>{fn}</span>
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                            isChecked ? 'bg-purple-600 border-purple-600 text-white shadow-xs' : 'border-slate-400'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 6: PAYMENT METHODS */}
              {currentStepIndex === 5 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Payment & Gateway Integration
                    </h3>
                    <p className="text-xs text-slate-500">
                      Choose all payment options you wish to accept from clients.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      'Razorpay (Cards, Net Banking, UPI)',
                      'UPI (GPay / PhonePe / Paytm Instant QR)',
                      'Cash on Delivery (COD)',
                      'International Payments (Stripe / PayPal)',
                      'Advance Partial Deposit Payment',
                      'No Online Payment (Inquiry / Booking Only)'
                    ].map((pm) => {
                      const isChecked = formData.paymentMethods.includes(pm);
                      return (
                        <div
                          key={pm}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              paymentMethods: isChecked
                                ? prev.paymentMethods.filter((p) => p !== pm)
                                : [...prev.paymentMethods, pm]
                            }));
                          }}
                          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-purple-50 dark:bg-purple-950/70 border-purple-500 text-purple-950 dark:text-purple-200 shadow-2xs'
                              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                          }`}
                        >
                          <span>{pm}</span>
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                            isChecked ? 'bg-purple-600 border-purple-600 text-white shadow-xs' : 'border-slate-400'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 7: ADMIN PANEL */}
              {currentStepIndex === 6 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Admin Panel & CMS Management
                    </h3>
                    <p className="text-xs text-slate-500">
                      Do you need a dedicated portal to manage orders, bookings, and content?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      { id: 'Full Dynamic Admin Panel', desc: 'Manage orders, inquiries, change photos, menu items, update prices & customer list.' },
                      { id: 'Basic CMS / Content Editor', desc: 'Simple dashboard to edit text content and blog posts.' },
                      { id: 'No Admin (Static Fast Website)', desc: 'Maintenance managed by LOCAL2BRAND team.' }
                    ].map((adm) => (
                      <div
                        key={adm.id}
                        onClick={() => setFormData((prev) => ({ ...prev, adminPanelType: adm.id }))}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          formData.adminPanelType === adm.id
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/70 text-purple-950 dark:text-purple-200 ring-2 ring-purple-500/20'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60'
                        }`}
                      >
                        <h4 className="font-bold text-xs sm:text-sm">{adm.id}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{adm.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: WHATSAPP & EMAIL */}
              {currentStepIndex === 7 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      WhatsApp & Email Communication Sync
                    </h3>
                    <p className="text-xs text-slate-500">
                      Connect customer enquiries directly to your WhatsApp and inbox.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">WhatsApp Integration</span>
                        <input
                          type="checkbox"
                          checked={formData.whatsappIntegration}
                          onChange={(e) => setFormData((prev) => ({ ...prev, whatsappIntegration: e.target.checked }))}
                        />
                      </div>
                      {formData.whatsappIntegration && (
                        <div className="space-y-1.5 text-xs">
                          {['WhatsApp Floating Quick Button', 'Direct Order / Booking to WhatsApp', 'Automated Lead Alert to Owner'].map((opt) => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.whatsappOptions.includes(opt)}
                                onChange={() => {
                                  const list = formData.whatsappOptions;
                                  setFormData((prev) => ({
                                    ...prev,
                                    whatsappOptions: list.includes(opt) ? list.filter((x) => x !== opt) : [...list, opt]
                                  }));
                                }}
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">Email Integration</span>
                        <input
                          type="checkbox"
                          checked={formData.emailIntegration}
                          onChange={(e) => setFormData((prev) => ({ ...prev, emailIntegration: e.target.checked }))}
                        />
                      </div>
                      {formData.emailIntegration && (
                        <div className="space-y-1.5 text-xs">
                          {['Automated Order / Inquiry Confirmation', 'Admin Alert Emails', 'Weekly Analytics Summary'].map((opt) => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.emailOptions.includes(opt)}
                                onChange={() => {
                                  const list = formData.emailOptions;
                                  setFormData((prev) => ({
                                    ...prev,
                                    emailOptions: list.includes(opt) ? list.filter((x) => x !== opt) : [...list, opt]
                                  }));
                                }}
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 9: DESIGN & BRANDING */}
              {currentStepIndex === 8 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Design Style & Brand Aesthetic
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pick your preferred visual atmosphere.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {[
                      { id: 'Modern Glassmorphic & Vibrant', badge: 'Ultra-Modern' },
                      { id: 'Clean & Minimal Corporate', badge: 'Professional' },
                      { id: 'Luxury Dark Mode & Gold', badge: 'Prestige' },
                      { id: 'Creative & Bold Neon', badge: 'High Energy' }
                    ].map((st) => (
                      <div
                        key={st.id}
                        onClick={() => setFormData((prev) => ({ ...prev, designStyle: st.id }))}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          formData.designStyle === st.id
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/70 text-purple-950 dark:text-purple-200'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60'
                        }`}
                      >
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-600 block mb-1">
                          {st.badge}
                        </span>
                        <div className="font-bold text-xs">{st.id}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Preferred Brand Colors</label>
                      <input
                        type="text"
                        value={formData.preferredColors}
                        onChange={(e) => setFormData((prev) => ({ ...prev, preferredColors: e.target.value }))}
                        placeholder="e.g. Royal Blue & Gold / Emerald Green & White"
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Reference Website URLs (if any)</label>
                      <input
                        type="text"
                        value={formData.referenceUrls}
                        onChange={(e) => setFormData((prev) => ({ ...prev, referenceUrls: e.target.value }))}
                        placeholder="e.g. https://apple.com, https://airbnb.com"
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 10: DOMAIN & HOSTING */}
              {currentStepIndex === 9 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Domain & Cloud Infrastructure
                    </h3>
                    <p className="text-xs text-slate-500">
                      All LOCAL2BRAND projects include free 1-year SSL & high-speed CDN routing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                      <label className="text-xs font-bold block text-slate-900 dark:text-white">Domain Name Status</label>
                      <div className="space-y-1.5 text-xs">
                        {[
                          'Need New Domain (Free Included)',
                          'Already Own Domain (Will Point DNS)',
                          'Need Subdomain Only'
                        ].map((d) => (
                          <label key={d} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="domainStatus"
                              checked={formData.domainStatus === d}
                              onChange={() => setFormData((prev) => ({ ...prev, domainStatus: d }))}
                            />
                            <span>{d}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                      <label className="text-xs font-bold block text-slate-900 dark:text-white">Cloud Hosting Status</label>
                      <div className="space-y-1.5 text-xs">
                        {[
                          'High-Speed Cloud Hosting (Free 1-Yr Included)',
                          'Deploy to My Own Server / AWS / VPS',
                          'Need Enterprise Dedicated Server'
                        ].map((h) => (
                          <label key={h} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="hostingStatus"
                              checked={formData.hostingStatus === h}
                              onChange={() => setFormData((prev) => ({ ...prev, hostingStatus: h }))}
                            />
                            <span>{h}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 11: BUDGET & TIMELINE */}
              {currentStepIndex === 10 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Budget Bracket & Delivery Speed
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select your investment bracket and preferred project turnaround.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {[
                      { b: '₹4,999 – ₹9,999 (Starter Demo)', desc: 'Ideal for small local shops & quick single-page presence.' },
                      { b: '₹10,000 – ₹25,000 (Standard Commercial)', desc: 'Full custom design, table/slot booking & WhatsApp funnels.' },
                      { b: '₹25,000 – ₹60,000+ (Grand Enterprise)', desc: 'Multi-vendor / Full E-commerce & custom database logic.' }
                    ].map((bg) => (
                      <div
                        key={bg.b}
                        onClick={() => setFormData((prev) => ({ ...prev, budget: bg.b }))}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          formData.budget === bg.b
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/70 text-purple-950 dark:text-purple-200 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60'
                        }`}
                      >
                        <h4 className="font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">{bg.b}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{bg.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { t: '⚡ Express Delivery (48 - 72 Hours)', badge: 'Fast Track' },
                      { t: '🗓️ Standard Delivery (5 - 7 Days)', badge: 'Standard' }
                    ].map((tl) => (
                      <div
                        key={tl.t}
                        onClick={() => setFormData((prev) => ({ ...prev, timeline: tl.t }))}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          formData.timeline === tl.t
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/70 text-purple-950 dark:text-purple-200'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60'
                        }`}
                      >
                        <span className="font-bold text-xs">{tl.t}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {tl.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 12: REVIEW & SUBMIT */}
              {currentStepIndex === 11 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Review Your Requirement Breakdown
                    </h3>
                    <p className="text-xs text-slate-500">
                      Confirm specifications. You can jump directly to any step to make edits.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-xs">
                    
                    {/* Category & Contact */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5 font-bold">
                        <span className="text-slate-900 dark:text-white">Business Details</span>
                        <button onClick={() => jumpToStep(1)} className="text-purple-600 hover:underline flex items-center gap-0.5 cursor-pointer">
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      </div>
                      <div><span className="text-slate-500">Category:</span> <strong>{formData.websiteTypeName}</strong></div>
                      <div><span className="text-slate-500">Business:</span> <strong>{formData.clientInfo.businessName}</strong></div>
                      <div><span className="text-slate-500">Contact:</span> <strong>{formData.clientInfo.mobile} ({formData.clientInfo.email})</strong></div>
                    </div>

                    {/* Scope & Budget */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5 font-bold">
                        <span className="text-slate-900 dark:text-white">Project Scope</span>
                        <button onClick={() => jumpToStep(10)} className="text-purple-600 hover:underline flex items-center gap-0.5 cursor-pointer">
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      </div>
                      <div><span className="text-slate-500">Budget:</span> <strong className="text-emerald-600 dark:text-emerald-400">{formData.budget}</strong></div>
                      <div><span className="text-slate-500">Timeline:</span> <strong>{formData.timeline}</strong></div>
                      <div><span className="text-slate-500">Admin Panel:</span> <strong>{formData.adminPanelType}</strong></div>
                    </div>

                  </div>

                  {/* Configured Pages & Features */}
                  <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white">Configured Website Pages ({formData.selectedPages.length})</div>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.selectedPages.map((pg) => (
                        <span key={pg} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 font-semibold text-[11px]">
                          ✓ {pg}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Additional Notes / Special Instructions</label>
                    <textarea
                      rows={2}
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                      placeholder="Any specific feature or instructions you want to convey to our engineering team..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION FOOTER */}
        {!submittedData && (
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentStepIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-slate-400'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="text-[11px] font-bold text-slate-400">
              Step {currentStepIndex + 1} of {STEPS.length}
            </div>

            {currentStepIndex === STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Specifications...</span>
                ) : (
                  <>
                    <span>Confirm & Submit Project</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
