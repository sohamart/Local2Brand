import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Send,
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  Building,
  DollarSign,
  Calendar,
  X,
  Sparkles,
  Download,
  RefreshCw,
  MessageSquare,
  Globe,
  CreditCard,
  Palette,
  Server,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  Check,
  Tag,
  ShieldCheck,
  CheckCheck,
  Utensils,
  MapPin,
  MessageCircle,
  Zap,
  Sliders,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';
import { toast } from 'react-toastify';
import DashboardLoader from '../../components/common/DashboardLoader';

const STATUS_COLORS = {
  'Draft': 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300',
  'Submitted': 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300',
  'Under Review': 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300',
  'Quotation Sent': 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300',
  'Approved': 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300',
  'In Development': 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300',
  'Completed': 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-300',
  'Cancelled': 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300'
};

const CATEGORY_PREFIXES = {
  restaurant: 'rest',
  cafe: 'cafe',
  salon: 'salon',
  gym: 'gym',
  hotel: 'hotel',
  real_estate: 're',
  photography: 'photo',
  boutique: 'boutique',
  coaching: 'coaching',
  clinic: 'clinic',
  jewellery: 'jewel',
  showroom: 'showroom',
  other: 'other'
};

const ALL_CATEGORY_PREFIXES = ['rest', 'cafe', 'salon', 'gym', 'hotel', 're', 'photo', 'boutique', 'coaching', 'clinic', 'jewel', 'showroom', 'other'];

const EXCLUDED_ANSWER_KEYS = new Set([
  'fullName', 'businessName', 'mobileNumber', 'whatsappNumber', 'emailAddress',
  'country', 'state', 'district', 'otherDistrict', 'streetAddress', 'pincode',
  'businessAddress', 'cityLocation', 'existingWebsite', 'socialLinks',
  'selectedCategory', 'appliedTemplateName',
  'visualStyle', 'visualStyleOther', 'colorTheme', 'customColorCode', 'customColorDesc',
  'hasLogo', 'hasPhotos', 'hasContent', 'referenceWebsites', 'designInstructions',
  'logoFile', 'photosFiles', 'contentDocFile', 'images', 'uploadedImages',
  'domainStatus', 'domainName', 'domainExtension', 'domainExtensions', 'domainOtherExtension', 'domainNotes',
  'hostingStatus', 'hostingPlan', 'hostingCustomDesc',
  'backendRequirement', 'backendCustomDesc', 'whatsappIntegration', 'whatsappNumberForIntegration', 'whatsappCountryCode', 'whatsappCustomDesc',
  'otherIntegrations', 'customIntegrationText',
  'budgetBracket', 'customBudget', 'expectedLaunchDate', 'additionalRequirements', 'anythingElse',
  'priceBreakdown', 'fullFormData', 'clientInfo', 'status', 'requirementId', '_id', '__v', 'createdAt', 'updatedAt', 'submittedAt',
  'user', 'userId', 'ipAddress', 'orderMethods', 'paymentMethods', 'adminPanelType', 'adminFeatures', 'selectedFeatures', 'selectedPages'
]);

const FIELD_LABELS = {
  // Restaurant
  restCuisine: 'Restaurant Cuisine / Type',
  restFeatures: 'Required Restaurant Features',
  restSocial: 'Social Platforms',
  restSocialOther: 'Other Social Media',
  restStyle: 'Preferred Visual Style',
  restStyleOther: 'Custom Style Notes',
  restColors: 'Color Theme / Palette',
  restRefWebsite: 'Reference Website URL',
  restHasLogo: 'Has Brand Logo?',
  restProvidePhotos: 'Will Provide Photos & Content?',
  restAdditionalReq: 'Additional Restaurant Notes',

  // Cafe
  cafeName: 'Café / Coffee Shop Name',
  cafeFeatures: 'Café Specific Features',
  cafeStyle: 'Café Visual Style',
  cafeColors: 'Café Color Theme',
  cafeHasLogo: 'Has Brand Logo?',
  cafePhotosAvailable: 'Photos & Menu Available?',
  cafeAdditionalReq: 'Additional Café Notes',

  // Salon
  salonFeatures: 'Salon / Spa Features',
  salonStyle: 'Salon Design Style',
  salonColors: 'Salon Color Palette',
  salonHasLogo: 'Has Brand Logo?',
  salonPhotosAvailable: 'Service / Salon Photos Available?',
  salonAdditionalReq: 'Additional Salon Notes',

  // Gym
  gymFeatures: 'Gym / Fitness Features',
  gymStyle: 'Gym Design Style',
  gymColors: 'Gym Color Palette',
  gymHasLogo: 'Has Brand Logo?',
  gymPhotosAvailable: 'Gym / Equipment Photos Available?',
  gymAdditionalReq: 'Additional Gym Notes',

  // Hotel
  hotelFeatures: 'Hotel / Resort Features',
  hotelStyle: 'Hotel Design Style',
  hotelColors: 'Hotel Color Palette',
  hotelPhotosAvailable: 'Room / Property Photos Available?',
  hotelAdditionalReq: 'Additional Hotel Notes',

  // Real Estate
  rePropertyTypes: 'Property Types Handled',
  reFeatures: 'Real Estate Features',
  reStyle: 'Real Estate Design Style',
  reHasLogo: 'Has Brand Logo?',
  rePhotosAvailable: 'Property Photos Available?',
  reAdditionalReq: 'Additional Real Estate Notes',

  // Photography
  photoStudioName: 'Studio / Brand Name',
  photoTypes: 'Photography Types / Genres',
  photoFeatures: 'Photography Features',
  photoPortfolioLinks: 'Portfolio / Social Links',
  photoPackagesOffered: 'Packages & Pricing Offered',
  photoStyle: 'Studio Design Style',
  photoColors: 'Brand Colors',
  photoPhotosAvailable: 'High-Res Samples Available?',
  photoHasLogo: 'Has Brand Logo?',
  photoAdditionalReq: 'Additional Photography Notes',

  // Boutique
  boutiqueBusinessName: 'Boutique / Shop Name',
  boutiqueProducts: 'Products & Apparel Offered',
  boutiqueFeatures: 'Boutique Features',
  boutiquePriceRange: 'Price Range / Segment',
  boutiqueDeliveryAvailable: 'Delivery / Shipping Available?',
  boutiqueSocialLinks: 'Social Media Profiles',
  boutiqueStyle: 'Boutique Design Style',
  boutiqueColors: 'Color Theme',
  boutiquePhotosAvailable: 'Product Catalog Photos Ready?',
  boutiqueHasLogo: 'Has Brand Logo?',
  boutiqueAdditionalReq: 'Additional Boutique Notes',

  // Coaching
  coachingInstituteName: 'Institute / Academy Name',
  coachingCourses: 'Courses & Programs Offered',
  coachingTargetAudience: 'Target Students / Audience',
  coachingClassMode: 'Mode of Instruction (Online/Offline/Hybrid)',
  coachingFeatures: 'Coaching Features',
  coachingBatchTimings: 'Batch Timings & Schedule',
  coachingSocialLinks: 'Social / YouTube Links',
  coachingStyle: 'Website Design Style',
  coachingColors: 'Brand Colors',
  coachingHasLogo: 'Has Brand Logo?',
  coachingAdditionalReq: 'Additional Coaching Notes',

  // Clinic
  clinicName: 'Clinic / Hospital Name',
  clinicDoctorName: 'Lead Doctor / Specialist Name',
  clinicSpecialty: 'Medical Specialty / Department',
  clinicTimings: 'Consultation & OPD Timings',
  clinicFeatures: 'Clinic Features & Booking',
  clinicSocialLinks: 'Social / Profile Links',
  clinicStyle: 'Clinic Design Style',
  clinicColors: 'Color Theme',
  clinicDoctorPhotoAvailable: 'Doctor / Clinic Photos Ready?',
  clinicHasLogo: 'Has Brand Logo?',
  clinicAdditionalReq: 'Additional Medical Notes',

  // Jewellery
  jewelShopName: 'Jewellery / Gift Shop Name',
  jewelItemsHandled: 'Jewellery / Product Types',
  jewelFeatures: 'Jewellery Features',
  jewelPriceSegment: 'Price Segment',
  jewelCustomOrders: 'Custom / Bespoke Orders Accepted?',
  jewelSocialLinks: 'Social / Instagram Links',
  jewelStyle: 'Jewellery Website Style',
  jewelColors: 'Color Palette',
  jewelPhotosAvailable: 'High-Res Jewelry Photos Ready?',
  jewelHasLogo: 'Has Brand Logo?',
  jewelAdditionalReq: 'Additional Jewellery Notes',

  // Showroom
  showroomBusinessName: 'Showroom / Dealership Name',
  showroomBusinessType: 'Vehicle Type (Cars / Bikes / Both)',
  showroomBrands: 'Brands Handled / Represented',
  showroomServices: 'Services Offered (Sales / Service / Test Drives)',
  showroomFeatures: 'Showroom Features',
  showroomStyle: 'Showroom Design Style',
  showroomPhotosAvailable: 'Inventory / Vehicle Photos Ready?',
  showroomHasLogo: 'Has Brand Logo?',
  showroomAdditionalReq: 'Additional Showroom Notes',

  // Other
  otherCategoryDescription: 'Custom Category Specification',
  otherFeatures: 'Key Features Required',
  otherFeaturesCustom: 'Custom Features Description',
  otherRequirementsNotes: 'Special Project Notes'
};

const detectActiveCategory = (req) => {
  if (!req) return '';
  const rawCat = (
    req.selectedCategory ||
    req.answers?.selectedCategory ||
    req.fullFormData?.selectedCategory ||
    req.websiteType ||
    req.websiteTypeName ||
    ''
  ).toLowerCase();

  for (const [catKey, prefix] of Object.entries(CATEGORY_PREFIXES)) {
    if (rawCat.includes(catKey) || rawCat.includes(prefix)) {
      return catKey;
    }
  }

  const allKeys = Object.keys({ ...(req.answers || {}), ...(req.fullFormData || {}) });
  for (const [catKey, prefix] of Object.entries(CATEGORY_PREFIXES)) {
    if (allKeys.some(k => k.startsWith(prefix) && (req.answers?.[k] || req.fullFormData?.[k]))) {
      return catKey;
    }
  }

  return 'other';
};

export const getCleanCategoryAnswers = (req) => {
  if (!req) return [];
  const rawAnswers = { ...(req.answers || {}), ...(req.fullFormData || {}) };
  const activeCategory = detectActiveCategory(req);
  const activePrefix = CATEGORY_PREFIXES[activeCategory] || '';
  const otherPrefixes = ALL_CATEGORY_PREFIXES.filter(p => p !== activePrefix);

  const cleanList = [];

  for (const [rawKey, val] of Object.entries(rawAnswers)) {
    if (EXCLUDED_ANSWER_KEYS.has(rawKey)) continue;

    // Check if key belongs to an unrelated category
    const belongsToOtherCategory = otherPrefixes.some(p => {
      if (p === 're') {
        return rawKey.startsWith('reProperty') || rawKey.startsWith('reFeatures') || rawKey.startsWith('reStyle') || rawKey.startsWith('reHasLogo') || rawKey.startsWith('rePhotos') || rawKey.startsWith('reAdditional');
      }
      return rawKey.toLowerCase().startsWith(p.toLowerCase());
    });

    if (belongsToOtherCategory) continue;

    // Check if empty or N/A
    if (val === null || val === undefined || val === '') continue;
    if (Array.isArray(val) && val.length === 0) continue;
    if (typeof val === 'string' && (val.trim() === '' || val.trim().toLowerCase() === 'n/a' || val.trim().toLowerCase() === 'none')) continue;

    const label = FIELD_LABELS[rawKey] || rawKey.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    let formattedVal = val;
    if (Array.isArray(val)) {
      formattedVal = val.join(', ');
    } else if (typeof val === 'boolean') {
      formattedVal = val ? 'Yes' : 'No';
    } else if (typeof val === 'object') {
      continue;
    }

    cleanList.push({
      key: rawKey,
      label,
      value: String(formattedVal)
    });
  }

  return cleanList;
};

export const getAllRequirementPhotos = (req) => {
  if (!req) return [];
  const photos = [];
  const seenUrls = new Set();

  const addPhoto = (item, type = 'photo', label = '') => {
    if (!item) return;
    let url = '';
    let name = '';
    let size = '';

    if (typeof item === 'string' && item.trim()) {
      url = item.trim();
      name = label || url.split('/').pop()?.split('?')[0] || 'Image';
    } else if (typeof item === 'object' && item !== null) {
      url = item.dataUrl || item.url || item.secure_url || item.src || item.path || '';
      name = item.name || label || item.original_filename || 'Uploaded Image';
      size = item.size || '';
    }

    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      photos.push({ url, name, size, type });
    }
  };

  // 1. Check direct images
  if (Array.isArray(req.images)) {
    req.images.forEach((img, i) => addPhoto(img, 'photo', `Photo ${i + 1}`));
  }
  if (Array.isArray(req.uploadedImages)) {
    req.uploadedImages.forEach((img, i) => addPhoto(img, img?.type || 'photo', img?.name || `Photo ${i + 1}`));
  }

  // 2. Check logoFile and logoUrl
  if (req.logoUrl) addPhoto(req.logoUrl, 'logo', 'Brand Logo');
  if (req.logoFile) addPhoto(req.logoFile, 'logo', req.logoFile.name || 'Brand Logo');
  if (req.clientInfo?.logoUrl) addPhoto(req.clientInfo.logoUrl, 'logo', 'Brand Logo');

  // 3. Check photosFiles array
  if (Array.isArray(req.photosFiles)) {
    req.photosFiles.forEach((img, i) => addPhoto(img, 'photo', img?.name || `Photo ${i + 1}`));
  }

  // 4. Check nested answers
  if (req.answers) {
    if (req.answers.logoFile) addPhoto(req.answers.logoFile, 'logo', req.answers.logoFile.name || 'Brand Logo');
    if (Array.isArray(req.answers.photosFiles)) {
      req.answers.photosFiles.forEach((img, i) => addPhoto(img, 'photo', img?.name || `Photo ${i + 1}`));
    }
    if (Array.isArray(req.answers.images)) {
      req.answers.images.forEach((img, i) => addPhoto(img, 'photo', `Photo ${i + 1}`));
    }
  }

  // 5. Check nested fullFormData
  if (req.fullFormData) {
    if (req.fullFormData.logoFile) addPhoto(req.fullFormData.logoFile, 'logo', req.fullFormData.logoFile.name || 'Brand Logo');
    if (Array.isArray(req.fullFormData.photosFiles)) {
      req.fullFormData.photosFiles.forEach((img, i) => addPhoto(img, 'photo', img?.name || `Photo ${i + 1}`));
    }
  }

  return photos;
};

export default function AdminRequirements() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReq, setSelectedReq] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeInspectTab, setActiveInspectTab] = useState('all_steps'); // 'all_steps' | 'workflow' | 'client' | 'media'
  const [copiedId, setCopiedId] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Edit State
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editQuotedAmount, setEditQuotedAmount] = useState('');
  const [editDrivePdfLink, setEditDrivePdfLink] = useState('');

  const fetchRequirements = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setIsRefreshing(true);
      const res = await api.get(`/requirements/admin/all?status=${statusFilter}&search=${encodeURIComponent(search)}`);
      const list = res?.requirements || res?.data?.requirements || (Array.isArray(res) ? res : []);
      if (Array.isArray(list)) {
        setRequirements(list);
      }
    } catch (err) {
      console.error('Error fetching admin requirements:', err);
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  };

  const contentScrollRef = React.useRef(null);

  useEffect(() => {
    if (selectedReq) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedReq]);

  useEffect(() => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }
  }, [activeInspectTab, selectedReq]);

  useEffect(() => {
    fetchRequirements(false);
    // Real-time live auto-poll every 3s
    const pollInterval = setInterval(() => {
      fetchRequirements(true);
    }, 3000);
    return () => clearInterval(pollInterval);
  }, [statusFilter, search]);

  const handleOpenDetail = (req) => {
    setSelectedReq(req);
    setEditStatus(req.status || 'Submitted');
    setEditNotes(req.internalNotes || '');
    setEditQuotedAmount(req.quotedAmount || '');
    setEditDrivePdfLink(req.drivePdfLink || req.pdfUrl || '');
    setActiveInspectTab('all_steps');
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    toast.success(`Copied ${id} to clipboard!`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveStatus = async () => {
    if (!selectedReq) return;
    setUpdating(true);
    try {
      const res = await api.patch(`/requirements/admin/${selectedReq.requirementId || selectedReq._id}/status`, {
        status: editStatus,
        internalNotes: editNotes,
        quotedAmount: editQuotedAmount,
        drivePdfLink: editDrivePdfLink,
        pdfUrl: editDrivePdfLink
      });
      if (res.success) {
        setSelectedReq(res.requirement);
        toast.success(`Status updated to "${editStatus}"! Notification email sent.`);
        fetchRequirements(true);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  // Reject / Delete Modal State
  const [deleteModalReq, setDeleteModalReq] = useState(null);
  const [deleteActionType, setDeleteActionType] = useState('reject'); // 'reject' | 'delete'
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const QUICK_REJECTION_REASONS = [
    'Budget mismatch for requested custom modules & complex logic',
    'Incomplete project specifications or unverified client contact',
    'Duplicate / test requirement submission',
    'Outside agency technical scope / unsupported custom engine',
    'Client requested cancellation / project put on hold'
  ];

  const handleOpenDeleteModal = (reqItem, e, defaultAction = 'reject') => {
    if (e) e.stopPropagation();
    setDeleteModalReq(reqItem);
    setDeleteActionType(defaultAction);
    setDeleteReason(reqItem.rejectionReason || '');
  };

  const handleConfirmAction = async () => {
    if (!deleteModalReq) return;
    const reqId = deleteModalReq.requirementId || deleteModalReq._id;
    setIsDeleting(true);

    try {
      if (deleteActionType === 'reject') {
        // Soft Reject: Update status to 'Rejected' and save reason
        const res = await api.patch(`/requirements/admin/${reqId}/status`, {
          status: 'Rejected',
          rejectionReason: deleteReason,
          reason: deleteReason
        });
        if (res?.success) {
          toast.success(`Project #${reqId} marked as Rejected. Client notified via email with reason.`);
          setRequirements((prev) =>
            prev.map((r) =>
              (r.requirementId === reqId || r._id === reqId)
                ? { ...r, status: 'Rejected', rejectionReason: deleteReason }
                : r
            )
          );
          if (selectedReq && (selectedReq.requirementId === reqId || selectedReq._id === reqId)) {
            setSelectedReq((prev) => ({ ...prev, status: 'Rejected', rejectionReason: deleteReason }));
          }
          setDeleteModalReq(null);
          setDeleteReason('');
        }
      } else {
        // Permanent Delete: Remove from DB & delete Cloudinary images
        const res = await api.delete(`/requirements/admin/${reqId}`, { reason: deleteReason });
        if (res?.success) {
          toast.success(`Requirement #${reqId} deleted from database and Cloudinary. Notification email dispatched.`);
          setRequirements((prev) => prev.filter((r) => r.requirementId !== reqId && r._id !== reqId));
          if (selectedReq && (selectedReq.requirementId === reqId || selectedReq._id === reqId)) {
            setSelectedReq(null);
          }
          setDeleteModalReq(null);
          setDeleteReason('');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Action failed. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteRequirement = (reqItem, e) => {
    handleOpenDeleteModal(reqItem, e, 'delete');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <AshokaChakra size={11} />
            <span>Client Specifications &amp; Orders Desk</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Requirement Submissions ({requirements.length})
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Desk
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage comprehensive multi-step client website specifications, quotas, dynamic form answers, and sprint roadmap.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchRequirements(false)}
          disabled={isRefreshing}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
          title="Refresh requirements queue"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchRequirements(false)}
            placeholder="Search by ID, business, name, email, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['all', 'Submitted', 'Under Review', 'Quotation Sent', 'Approved', 'In Development', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Requirements Desktop Table & Mobile Cards */}
      <div className="glass-panel rounded-2xl border border-white dark:border-slate-800 overflow-hidden shadow-sm">
        
        {/* Loading state */}
        {loading && requirements.length === 0 && (
          <div className="py-16 flex items-center justify-center">
            <DashboardLoader
              title="Loading Requirement Submissions..."
              subtitle="Fetching client website blueprints and active project orders..."
              role="admin"
            />
          </div>
        )}

        {/* Empty state */}
        {!loading && requirements.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-2">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold block">No client website requirements found in this filter.</span>
          </div>
        )}

        {/* 1. Mobile Cards View (Visible on screens < lg) */}
        {!loading && requirements.length > 0 && (
          <div className="block lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {requirements.map((req) => (
              <div key={req._id || req.requirementId} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400 block">
                      {req.requirementId}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                      {req.clientInfo?.businessName || req.websiteTypeName}
                    </h3>
                    <div className="text-[11px] text-slate-500">
                      {req.clientInfo?.ownerName || 'Client'} • {req.websiteTypeName || req.websiteType}
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shrink-0 ${STATUS_COLORS[req.status] || STATUS_COLORS.Submitted}`}>
                    {req.status || 'Submitted'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tier</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{req.budget}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Timeline</span>
                    <strong className="text-slate-800 dark:text-slate-200">{req.timeline}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone</span>
                    <a href={`tel:${req.clientInfo?.mobile}`} className="text-purple-600 font-mono font-semibold">
                      {req.clientInfo?.mobile}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Admin Engine</span>
                    <strong className="text-slate-700 dark:text-slate-300 truncate block">{req.adminPanelType}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    {new Date(req.createdAt || req.submittedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleOpenDeleteModal(req, e, 'reject')}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Reject project submission"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reject</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenDeleteModal(req, e, 'delete')}
                      className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 cursor-pointer transition-colors"
                      title="Delete requirement from database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(req)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-purple-500 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Desktop Table View (Visible on lg+) */}
        {!loading && requirements.length > 0 && (
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="p-4">Requirement ID</th>
                  <th className="p-4">Client &amp; Business</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Budget &amp; Timeline</th>
                  <th className="p-4">Admin &amp; Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {requirements.map((req) => (
                  <tr key={req._id || req.requirementId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {req.requirementId}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{req.clientInfo?.businessName || req.websiteTypeName}</div>
                      <div className="text-slate-500 text-[11px]">{req.clientInfo?.ownerName} • {req.clientInfo?.mobile}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {req.websiteTypeName || req.websiteType}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">{req.budget}</div>
                      <div className="text-slate-500 text-[11px]">{req.timeline}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-700 dark:text-slate-300 font-semibold">{req.adminPanelType}</div>
                      <div className="text-slate-500 text-[11px]">{req.paymentMethods?.slice(0, 2).join(', ') || 'No Gateway'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${STATUS_COLORS[req.status] || STATUS_COLORS.Submitted}`}>
                        {req.status || 'Submitted'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(req.createdAt || req.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(req)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300 hover:bg-purple-100 font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenDeleteModal(req, e, 'reject')}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          title="Reject submission and notify user with reason"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Reject</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenDeleteModal(req, e, 'delete')}
                          className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer shadow-xs"
                          title="Delete requirement permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* COMPREHENSIVE STEP-BY-STEP INSPECT MODAL                 */}
      {/* ======================================================== */}
      {selectedReq && (
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in select-text modal-touch-scroll"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedReq(null);
          }}
        >
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[88vh] sm:max-h-[92vh] h-[88vh] sm:h-[92vh] flex flex-col min-h-0"
          >

            
            {/* Modal Fixed Top Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/80 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl l2b-gradient-bg text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                      {selectedReq.requirementId}
                    </span>
                    <button
                      onClick={() => handleCopyId(selectedReq.requirementId)}
                      className="text-slate-400 hover:text-purple-600 cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${STATUS_COLORS[selectedReq.status] || STATUS_COLORS.Submitted}`}>
                      {selectedReq.status || 'Submitted'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate mt-0.5">
                    {selectedReq.clientInfo?.businessName || selectedReq.websiteTypeName || 'Project Submission'}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedReq(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Segmented Navigation Bar */}
            <div className="px-4 sm:px-6 pt-3 pb-2 bg-slate-100/60 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveInspectTab('all_steps')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeInspectTab === 'all_steps'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>12-Step Form Breakdown &amp; All Answers</span>
              </button>

              <button
                onClick={() => setActiveInspectTab('workflow')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeInspectTab === 'workflow'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Workflow &amp; Quota Manager</span>
              </button>

              <button
                onClick={() => setActiveInspectTab('client')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeInspectTab === 'client'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Client &amp; Social Profile</span>
              </button>

              <button
                onClick={() => setActiveInspectTab('media')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeInspectTab === 'media'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Media &amp; Photos ({getAllRequirementPhotos(selectedReq).length})</span>
              </button>
            </div>

            {/* Modal Smooth Scrollable Body */}
            <div
              ref={contentScrollRef}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              tabIndex={0}
              className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 min-h-0 text-xs custom-scrollbar modal-touch-scroll overscroll-contain focus:outline-none"
              style={{
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
              }}
            >

              
              {/* TAB 1: ALL 12 STEPS COMPLETE BREAKDOWN */}
              {activeInspectTab === 'all_steps' && (
                <div className="space-y-6">
                  
                  {/* Quick Workflow Snapshot Bar */}
                  <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-purple-600 shrink-0" />
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          Category: {selectedReq.websiteTypeName || selectedReq.websiteType}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Budget: <strong className="text-emerald-600 dark:text-emerald-400">{selectedReq.budget}</strong> • Delivery: <strong className="text-slate-700 dark:text-slate-300">{selectedReq.timeline}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveInspectTab('workflow')}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 shadow-xs cursor-pointer"
                      >
                        Edit Status / Quote &rarr;
                      </button>
                    </div>
                  </div>

                  {/* STEP 1: Category & Vision */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">1</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Category &amp; Project Vision</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Selected Industry</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.websiteTypeName || selectedReq.websiteType}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Project Priority</span><strong className="text-purple-600 dark:text-purple-400 text-xs">{selectedReq.projectPriority || 'Normal'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Form Engine</span><strong className="text-slate-700 dark:text-slate-300 text-xs">{selectedReq.formVersion ? `Version ${selectedReq.formVersion}` : 'Default Standard'}</strong></div>
                    </div>
                  </div>

                  {/* STEP 2: Business Profile */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">2</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Business Profile &amp; Contact Details</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Business / Brand Name</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.businessName || 'N/A'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Owner / Founder Name</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.ownerName || 'N/A'}</strong></div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone / WhatsApp</span>
                        <a href={`tel:${selectedReq.clientInfo?.mobile}`} className="text-emerald-600 hover:underline font-mono font-bold text-xs">
                          {selectedReq.clientInfo?.mobile}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Client Email</span>
                        <a href={`mailto:${selectedReq.clientInfo?.email}`} className="text-purple-600 hover:underline text-xs font-semibold">
                          {selectedReq.clientInfo?.email}
                        </a>
                      </div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">City &amp; State</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.city ? `${selectedReq.clientInfo.city}, ${selectedReq.clientInfo.state || ''}` : 'N/A'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">PIN Code</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.pincode || 'N/A'}</strong></div>
                      {selectedReq.clientInfo?.address && (
                        <div className="col-span-full"><span className="text-slate-500 block text-[10px] uppercase font-bold">Full Physical Address</span><span className="text-slate-800 dark:text-slate-200 text-xs font-medium">{selectedReq.clientInfo.address}</span></div>
                      )}
                    </div>
                  </div>

                  {/* STEP 3: Industry Specific Questions & Answers */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/70 space-y-3">
                    <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-800/70 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">3</span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Industry Tailored Specifications &amp; Dynamic Answers</h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                        {selectedReq.websiteTypeName || selectedReq.websiteType || detectActiveCategory(selectedReq) || 'Industry Specs'}
                      </span>
                    </div>

                    {getCleanCategoryAnswers(selectedReq).length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {getCleanCategoryAnswers(selectedReq).map((item) => (
                          <div key={item.key} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                            <span className="text-[10px] font-extrabold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
                              {item.label}
                            </span>
                            <div className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs italic flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                        <span>Standard {selectedReq.websiteTypeName || selectedReq.websiteType || 'industry'} configurations applied with default template specifications.</span>
                      </div>
                    )}
                  </div>

                  {/* STEP 4: Configured Pages & Sitemaps */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">4</span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Pages &amp; Sitemaps Configured</h4>
                      </div>
                      <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                        {selectedReq.selectedPages?.length || 0} Custom Pages
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedReq.selectedPages && selectedReq.selectedPages.length > 0 ? (
                        selectedReq.selectedPages.map((page) => (
                          <span key={page} className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-xs">
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{page}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">No specific pages listed.</span>
                      )}
                    </div>
                  </div>

                  {/* STEP 5: Features & Logic Modules */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">5</span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Features &amp; Logic Engines</h4>
                      </div>
                      <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                        {selectedReq.selectedFeatures?.length || 0} Modules
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedReq.selectedFeatures && selectedReq.selectedFeatures.length > 0 ? (
                        selectedReq.selectedFeatures.map((feat) => (
                          <span key={feat} className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 shadow-xs">
                            <Zap className="w-3.5 h-3.5 text-purple-600" />
                            <span>{feat}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">No extra logic engines configured.</span>
                      )}
                    </div>
                    {selectedReq.orderMethods?.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Order Placement Flows:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedReq.orderMethods.map((m) => (
                            <span key={m} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                              ✓ {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* STEP 6: Payment Gateways */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">6</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Payment Gateways &amp; Checkout Setup</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedReq.paymentMethods && selectedReq.paymentMethods.length > 0 ? (
                        selectedReq.paymentMethods.map((pm) => (
                          <span key={pm} className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold text-xs flex items-center gap-1.5 shadow-xs">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{pm}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">No online payment gateway selected (Direct Lead / Inquiry based).</span>
                      )}
                    </div>
                  </div>

                  {/* STEP 7: Admin CMS Panel */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">7</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Admin CMS &amp; Back-Office Management</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Admin Panel Engine</span>
                        <strong className="text-purple-600 dark:text-purple-400 text-xs">{selectedReq.adminPanelType || 'Standard Portal'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Admin Capabilities</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedReq.adminFeatures?.length ? (
                            selectedReq.adminFeatures.map((af) => (
                              <span key={af} className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-semibold">
                                {af}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400">Default capabilities</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 8: WhatsApp & Email Alerts */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">8</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">WhatsApp &amp; Email Automation Alerts</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">WhatsApp Push Alerts</span>
                        <strong className="text-emerald-600 dark:text-emerald-400 text-xs">
                          {selectedReq.whatsappNumber ? `Enabled (${selectedReq.whatsappNumber})` : 'Standard Lead Dispatch'}
                        </strong>
                        {selectedReq.whatsappOptions?.length > 0 && (
                          <div className="text-[11px] text-slate-500 mt-1">Options: {selectedReq.whatsappOptions.join(', ')}</div>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Email Notifications</span>
                        <strong className="text-slate-800 dark:text-slate-200 text-xs">
                          {selectedReq.emailIntegration ? 'Active Automated Receipts' : 'Enabled'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* STEP 9: Design & Branding Style */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">9</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Design Style, Colors &amp; Brand Persona</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">UI Theme / Visual Persona</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.designStyle || 'Modern Glassmorphic'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Has Brand Logo</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.hasLogo === 'yes' ? 'Yes, Available' : 'Needs Custom Logo Creation'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Content Readiness</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.contentReady || 'Needs Copywriting'}</strong></div>
                    </div>
                    {selectedReq.preferredColors?.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Brand Color Palette:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedReq.preferredColors.map((col) => (
                            <span key={col} className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: col }} />
                              <span>{col}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* STEP 10: Store Photos & Logo Preview */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">10</span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Uploaded Photos, Assets &amp; Logo</h4>
                      </div>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                        {getAllRequirementPhotos(selectedReq).length} Files
                      </span>
                    </div>
                    {getAllRequirementPhotos(selectedReq).length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {getAllRequirementPhotos(selectedReq).map((item, i) => (
                          <div
                            key={i}
                            className="group relative aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 block shadow-xs cursor-pointer"
                            onClick={() => setPreviewImage(item.url)}
                          >
                            <img src={item.url} alt={item.name || `Upload ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-950/75 backdrop-blur-xs text-white text-[9px] font-bold">
                              {item.type === 'logo' ? 'Brand Logo' : 'Photo'}
                            </div>
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <Eye className="w-4 h-4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-500 italic p-3 text-center bg-white/40 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        No media assets uploaded by client (Stock assets / Demo photos will be used).
                      </div>
                    )}
                  </div>

                  {/* STEP 11: Domain & Cloud Hosting */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">11</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Domain, Cloud Hosting &amp; Infrastructure</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Domain Status</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.domainStatus || 'Need New Domain'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Custom Domain Name</span><strong className="text-purple-600 dark:text-purple-400 font-mono text-xs">{selectedReq.domainName || 'N/A'}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Hosting Setup</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.hostingStatus || 'Cloud NVMe Included'}</strong></div>
                    </div>
                  </div>

                  {/* STEP 5: Delivery & Budget */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">5</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Delivery Timeline &amp; Budget Tier</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Target Handover Timeline</span><strong className="text-purple-600 dark:text-purple-400 text-xs">{selectedReq.timeline}</strong></div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Selected Investment Tier</span><strong className="text-emerald-600 dark:text-emerald-400 text-xs">{selectedReq.budget}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: WORKFLOW & STATUS UPDATER */}
              {activeInspectTab === 'workflow' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-4">
                    <div className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-purple-600" />
                      <span>Workflow Status &amp; Client Quota Sign-off</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Project Sprint Status
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-purple-700 dark:text-purple-300 focus:outline-purple-500"
                        >
                          {['Submitted', 'Under Review', 'Quotation Sent', 'Approved', 'In Development', 'Completed', 'Rejected', 'Cancelled'].map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Changing status will automatically send a branded roadmap update email to the client.
                        </span>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Official Quoted Investment
                        </label>
                        <input
                          type="text"
                          value={editQuotedAmount}
                          onChange={(e) => setEditQuotedAmount(e.target.value)}
                          placeholder="e.g. ₹24,999 (Inclusive of GST)"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-purple-500"
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Displays prominently on the client's live Track Order page.
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span>📄 Google Drive PDF / Document Link (Optional)</span>
                        </label>
                        {editDrivePdfLink && (
                          <a
                            href={editDrivePdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            <span>Open Drive Preview</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <input
                        type="url"
                        value={editDrivePdfLink}
                        onChange={(e) => setEditDrivePdfLink(e.target.value)}
                        placeholder="https://drive.google.com/file/d/... or document PDF link"
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-indigo-600 dark:text-indigo-400 font-mono focus:outline-purple-500"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Will be prominently rendered as a high-priority Google Drive PDF attachment button in the client's status email.
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Private Engineering &amp; Client Status Notes
                      </label>
                      <textarea
                        rows={4}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Add technical sprint notes, Figma design links, staging URLs, or handover instructions..."
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    <button
                      onClick={handleSaveStatus}
                      disabled={updating}
                      className="px-6 py-3 rounded-xl l2b-gradient-bg text-white font-bold text-xs hover:opacity-95 shadow-md cursor-pointer transition-all disabled:opacity-50"
                    >
                      {updating ? 'Saving & Dispatching Email...' : 'Save & Dispatch Status Update 🚀'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: CLIENT CONTACT & SOCIALS */}
              {activeInspectTab === 'client' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <User className="w-4 h-4 text-purple-600" />
                      <span>Client Authorized Coordinates</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Owner / Contact</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.ownerName || 'N/A'}</strong></div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                        <a href={`tel:${selectedReq.clientInfo?.mobile}`} className="text-emerald-600 font-mono font-bold text-xs">
                          {selectedReq.clientInfo?.mobile}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Email Address</span>
                        <a href={`mailto:${selectedReq.clientInfo?.email}`} className="text-purple-600 text-xs font-semibold">
                          {selectedReq.clientInfo?.email}
                        </a>
                      </div>
                      <div><span className="text-slate-500 block text-[10px] uppercase font-bold">Location</span><strong className="text-slate-900 dark:text-white text-xs">{selectedReq.clientInfo?.city}, {selectedReq.clientInfo?.state} ({selectedReq.clientInfo?.pincode})</strong></div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Digital &amp; Social Presence:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {selectedReq.clientInfo?.existingWebsite && (
                          <a href={selectedReq.clientInfo.existingWebsite} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-purple-600 hover:underline">
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate">Current Website</span>
                          </a>
                        )}
                        {selectedReq.clientInfo?.facebookUrl && (
                          <a href={selectedReq.clientInfo.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-blue-600 hover:underline">
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate">Facebook Page</span>
                          </a>
                        )}
                        {selectedReq.clientInfo?.instagramUrl && (
                          <a href={selectedReq.clientInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-pink-600 hover:underline">
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate">Instagram Profile</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MEDIA & PHOTOS */}
              {activeInspectTab === 'media' && (
                <div className="space-y-4">
                  {getAllRequirementPhotos(selectedReq).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {getAllRequirementPhotos(selectedReq).map((item, i) => (
                        <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5 shadow-sm">
                          <div
                            className="relative aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer group"
                            onClick={() => setPreviewImage(item.url)}
                          >
                            <img src={item.url} alt={item.name || `Media ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider">
                              {item.type === 'logo' ? '🏷️ Brand Logo' : '📷 Gallery Photo'}
                            </div>
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <Eye className="w-5 h-5" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]" title={item.name}>
                              {item.name || `File ${i + 1}`}
                            </span>
                            {item.size && (
                              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                {item.size}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                            <button
                              type="button"
                              onClick={() => setPreviewImage(item.url)}
                              className="flex-1 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/60 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Zoom Preview</span>
                            </button>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1 hover:bg-slate-300 dark:hover:bg-slate-600"
                              title="Open original in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                      <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="font-semibold text-xs">No media photos or logo files uploaded with this specification.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Default curated industry stock assets or template media will be deployed.</p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Fixed Bottom Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-500 font-mono">
                Order ID: <strong>{selectedReq.requirementId}</strong> • Submitted: {new Date(selectedReq.createdAt || selectedReq.submittedAt).toLocaleString()}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleOpenDeleteModal(selectedReq, e, 'reject')}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Reject this submission with reason"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Reject Order</span>
                </button>

                <button
                  onClick={(e) => handleOpenDeleteModal(selectedReq, e, 'delete')}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Delete this order permanently from database"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <a
                  href={`https://wa.me/${selectedReq.clientInfo?.mobile?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${selectedReq.clientInfo?.ownerName || 'Client'}, this is the LOCAL2BRAND Engineering Desk regarding your website order ${selectedReq.requirementId}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 flex items-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => setSelectedReq(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REJECT / DELETE ACTION MODAL WITH REASON PROMPT          */}
      {/* ======================================================== */}
      {deleteModalReq && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) setDeleteModalReq(null);
          }}
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-4 p-5 sm:p-6 animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-sm shrink-0 ${
                  deleteActionType === 'reject'
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700'
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-700'
                }`}>
                  {deleteActionType === 'reject' ? <AlertCircle className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {deleteActionType === 'reject' ? 'Reject / Decline Submission' : 'Permanently Delete Requirement'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Order #{deleteModalReq.requirementId || deleteModalReq._id} • {deleteModalReq.clientInfo?.businessName || 'Client Project'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => !isDeleting && setDeleteModalReq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setDeleteActionType('reject')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  deleteActionType === 'reject'
                    ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-sm border border-amber-200 dark:border-amber-900'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Reject & Archive</span>
              </button>

              <button
                type="button"
                onClick={() => setDeleteActionType('delete')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  deleteActionType === 'delete'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm border border-rose-200 dark:border-rose-900'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Hard Delete</span>
              </button>
            </div>

            {/* Info Callout */}
            <div className={`p-3 rounded-2xl text-xs border ${
              deleteActionType === 'reject'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-300'
            }`}>
              {deleteActionType === 'reject' ? (
                <p>
                  <strong>Notice:</strong> This marks the order status as <strong>"Rejected"</strong>. The client will receive an email stating why it was not accepted, and will see <em>"One project not accepted. Reason: [reason]"</em> in their client portal with an option to start a new project.
                </p>
              ) : (
                <p>
                  <strong>Warning:</strong> This permanently wipes the submission from MongoDB and <strong>automatically deletes all attached images from Cloudinary storage</strong>. A final deletion notice with your reason will be emailed to the client.
                </p>
              )}
            </div>

            {/* Reason Textarea & Quick Tags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {deleteActionType === 'reject' ? 'Rejection Reason for Client:' : 'Deletion Reason (Included in Email):'}
                </label>
                <span className="text-[10px] text-slate-400">Required for client clarity</span>
              </div>

              <textarea
                rows={3}
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="e.g. Budget mismatch for requested complex custom features, or unverified contact details..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-purple-500 text-slate-900 dark:text-white"
              />

              {/* Quick Reason Suggestion Buttons */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Reason Suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_REJECTION_REASONS.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setDeleteReason(r)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer text-left"
                    >
                      + {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Bottom Bar */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteModalReq(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isDeleting}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 ${
                  deleteActionType === 'reject'
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing & Notifying...</span>
                  </>
                ) : (
                  <>
                    {deleteActionType === 'reject' ? <AlertCircle className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                    <span>{deleteActionType === 'reject' ? 'Confirm Rejection & Send Email' : 'Delete Permanently & Purge Cloudinary'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PHOTO / LOGO FULL SCREEN LIGHTBOX MODAL                  */}
      {/* ======================================================== */}
      {previewImage && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              title="Close Preview"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Full Preview"
              className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl border border-white/20 bg-slate-900"
            />
            <div className="mt-3 flex items-center gap-3">
              <a
                href={previewImage}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-purple-500 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Original in New Tab</span>
              </a>
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
