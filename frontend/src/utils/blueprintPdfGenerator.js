/**
 * WEBLETS / LOCAL2BRAND Official Corporate Project Blueprint PDF Generator
 * Generates an executive, clean, ultra-modern corporate architecture blueprint document:
 * - Professional clean white executive design (no heavy dark-mode ink blocks)
 * - Seamless natural page flow with no empty gaps on Page 1 (tr-level pagination)
 * - Official Website Verified Badge & Cryptographic Security Stamp
 * - High-density structured cards for client credentials, tech stack, and scope
 * - Comprehensive client submitted questionnaire table
 * - Quoted investment, engineering dispatch notes, and Google Drive deliverables links
 * - Enterprise NDA confidentiality seal and corporate sign-off
 */

export function generateProjectBlueprintHtml({
  formData = {},
  submissionSuccess = {},
  settings = {},
}) {
  const brandName = settings?.brandName || 'WEBLETS';
  const tagline = settings?.tagline || 'Lets make website together';
  const domain = settings?.domain || 'weblets.bond';
  const supportEmail = settings?.supportEmail || settings?.aiSettings?.adminShowableDetails?.contactEmail || 'contact@weblets.bond';
  const phone = settings?.displayPhone || settings?.aiSettings?.adminShowableDetails?.contactPhone || '+91 87100 43923';
  const whatsapp = settings?.whatsappNumber || settings?.aiSettings?.adminShowableDetails?.whatsappSupport || '+91 87100 43923';
  const officeLocation = settings?.aiSettings?.adminShowableDetails?.officeLocation || 'Kolkata & Bangalore, India';

  // Resolve absolute logo URL
  const logoUrl = settings?.logoLightUrl || settings?.logoDarkUrl || '/logo.png';
  const fullLogoUrl = logoUrl.startsWith('http') ? logoUrl : `${window.location.origin}${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`;

  const trackingId = submissionSuccess?.id || formData?.requirementId || `REQ-${Date.now().toString().slice(-6)}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const issueTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const currencySymbol = formData?.country === 'India' || !formData?.country ? '₹' : '$';
  const rawPrice = submissionSuccess?.totalApproxPrice || formData?.totalPrice || formData?.totalApproxPrice || 9999;
  const formattedPrice = typeof rawPrice === 'number' ? `${currencySymbol}${rawPrice.toLocaleString('en-IN')}` : `${currencySymbol}${rawPrice}`;
  const quotedAmount = formData?.quotedAmount || submissionSuccess?.quotedAmount || '';
  const internalNotes = formData?.internalNotes || formData?.statusNotes || submissionSuccess?.internalNotes || '';
  const drivePdfLink = formData?.drivePdfLink || formData?.pdfUrl || formData?.documentUrl || submissionSuccess?.drivePdfLink || '';
  const driveLink = formData?.driveLink || formData?.assetVaultLink || submissionSuccess?.driveLink || '';
  const status = (formData?.status || submissionSuccess?.status || 'Submitted').toUpperCase();

  // Helper to safely format array or string values
  const fmtArr = (val) => {
    if (Array.isArray(val) && val.length > 0) return val.join(', ');
    if (typeof val === 'string' && val.trim()) return val;
    if (typeof val === 'boolean') return val ? 'Yes — Configured' : 'No / Standard';
    return 'Standard / As Prescribed';
  };

  // Comprehensive Question Labels Mapping
  const KNOWN_LABELS = {
    // Restaurant
    restCuisine: 'Cuisine Style & Food Category',
    restFeatures: 'Digital Ordering & Menu Features',
    restSocial: 'Social Media Handles',
    restSocialOther: 'Other Social Channels',
    restStyle: 'Atmosphere & Visual Style',
    restStyleOther: 'Custom Style Directives',
    restColors: 'Color Theme Preferences',
    restRefWebsite: 'Reference Website URL',
    restHasLogo: 'Brand Logo Availability',
    restProvidePhotos: 'Photos & Menu Provided by Client',
    restAdditionalReq: 'Special Restaurant Notes',

    // Cafe
    cafeName: 'Café & Beverage Concept',
    cafeSpecialty: 'Café Specialty & Signature Menu',
    cafeHours: 'Operational Timings & Days',
    cafeFeatures: 'Café Interactive Features',
    cafeStyle: 'Café Design Theme',
    cafeColors: 'Interior & Brand Palette',
    cafeHasLogo: 'Brand Logo Asset Status',
    cafePhotosAvailable: 'Menu & Space Photos Available',
    cafeAdditionalReq: 'Additional Café Instructions',

    // Salon & Spa
    salonFeatures: 'Salon Booking & Staff Features',
    salonServices: 'Offered Treatments & Packages',
    salonHours: 'Salon Operational Hours',
    salonStyle: 'Salon Visual & Brand Style',
    salonColors: 'Salon Color Palette',
    salonHasLogo: 'Brand Logo Asset Status',
    salonPhotosAvailable: 'Facility & Service Photos',
    salonAdditionalReq: 'Additional Salon Directives',

    // Gym & Fitness
    gymFeatures: 'Gym & Trainer Management Features',
    gymFacilities: 'Gym Equipment & Workout Zones',
    gymMembershipPlans: 'Membership Plans & Tiers',
    gymStyle: 'Fitness Brand Aesthetic',
    gymColors: 'Gym Energy Color Palette',
    gymHasLogo: 'Brand Logo Asset Status',
    gymPhotosAvailable: 'Gym Facility Photos Available',
    gymAdditionalReq: 'Additional Fitness Notes',

    // Hotel & Resort
    hotelFeatures: 'Room Booking & Amenities Engine',
    hotelRoomsCount: 'Room Inventory & Categories',
    hotelAmenities: 'Property Amenities & Facilities',
    hotelStyle: 'Hospitality Architecture Style',
    hotelColors: 'Resort Color Theme',
    hotelPhotosAvailable: 'Room & Property Photos Available',
    hotelAdditionalReq: 'Additional Hotel Notes',

    // Real Estate
    rePropertyTypes: 'Property Portfolios Handled',
    reFeatures: 'Real Estate & Invoicing Features',
    reLocationsOperated: 'Target Operational Zones',
    reStyle: 'Real Estate Design Aesthetic',
    reHasLogo: 'Broker / Agency Logo Status',
    rePhotosAvailable: 'Property Imagery Available',
    reAdditionalReq: 'Additional Real Estate Directives',

    // Clinic & Healthcare
    clinicSpecialty: 'Medical Specialty & Department',
    clinicTimings: 'Doctor OPD & Consultation Timings',
    clinicFeatures: 'Patient Portal & Telehealth Features',
    clinicStyle: 'Healthcare Clean Aesthetic',
    clinicHasLogo: 'Clinic / Hospital Logo Status',
    clinicPhotosAvailable: 'Facility & Doctor Photos Available',
    clinicAdditionalReq: 'Additional Healthcare Directives',

    // Boutique & E-Commerce
    boutiqueProducts: 'Product Categories & Catalog Size',
    boutiquePriceRange: 'Price Segment & Currency Options',
    boutiqueFeatures: 'Storefront & Checkout Features',
    boutiqueStyle: 'Fashion E-Commerce Lookbook Style',
    boutiqueHasLogo: 'Fashion Brand Logo Status',
    boutiquePhotosAvailable: 'Product Lookbook Photos Available',
    boutiqueAdditionalReq: 'Additional E-Commerce Directives',

    // Coaching & LMS
    coachingCourses: 'Offered Courses & Curriculum',
    coachingClassMode: 'Class Delivery Mode (Online / Offline / Hybrid)',
    coachingFeatures: 'LMS, Quizzes & Student Features',
    coachingStyle: 'Academy Brand Aesthetic',
    coachingHasLogo: 'Academy Logo Status',
    coachingAdditionalReq: 'Additional Coaching Directives',

    // Jewellery & Luxury Showroom
    jewelCollection: 'Jewellery Categories & Metals',
    jewelFeatures: 'Virtual Try-On & Catalog Features',
    jewelStyle: 'Luxury Gold & Diamond Theme',
    jewelHasLogo: 'Luxury Brand Logo Status',
    jewelAdditionalReq: 'Additional Jewellery Notes',

    // Showroom & Automobile
    showroomType: 'Vehicle / Appliance Showroom Type',
    showroomFeatures: 'Test Drive & Inquiry Booking',
    showroomStyle: 'Modern Showroom Aesthetic',
    showroomAdditionalReq: 'Additional Showroom Notes',

    // Other / Custom Enterprise
    otherIndustry: 'Custom Industry / Domain',
    otherKeyRequirements: 'Core Functional Deliverables',
    otherCustomNotes: 'Custom Architecture Notes'
  };

  const EXCLUDED_KEYS = new Set([
    'fullName', 'businessName', 'mobileNumber', 'whatsappNumber', 'emailAddress',
    'country', 'state', 'district', 'streetAddress', 'pincode', 'city', 'otherDistrict',
    'selectedCategory', 'appliedTemplateName', 'websiteType', 'websiteTypeName',
    'visualStyle', 'colorTheme', 'colorMode', 'primaryColor', 'secondaryColor', 'customColorCode', 'customColorDesc',
    'hasLogo', 'hasPhotos', 'hasContent', 'referenceWebsites', 'designInstructions',
    'logoFile', 'photosFiles', 'contentDocFile', 'images', 'uploadedImages',
    'domainStatus', 'domainName', 'domainExtension', 'domainExtensions', 'domainOtherExtension', 'domainNotes',
    'hostingStatus', 'hostingPlan', 'hostingCustomDesc',
    'backendRequirement', 'backendChoice', 'whatsappIntegration', 'whatsappNumber', 'whatsappNumberForIntegration',
    'budgetBracket', 'customBudget', 'expectedLaunchDate', 'additionalRequirements', 'anythingElse',
    'priceBreakdown', 'fullFormData', 'clientInfo', 'status', 'requirementId',
    'user', 'userId', 'ipAddress', 'orderMethods', 'paymentMethods', 'adminPanelType',
    'adminFeatures', 'selectedFeatures', 'selectedPages', 'totalPrice', 'timeline', 'budget', '_id', '__v', 'createdAt', 'updatedAt',
    'quotedAmount', 'internalNotes', 'statusNotes', 'drivePdfLink', 'pdfUrl', 'documentUrl', 'driveLink', 'assetVaultLink',
    'rejectionReason', 'deletionReason', 'isDeleted', 'couponCode', 'discountPercent', 'submittedAt'
  ]);

  // Aggregate and clean all client submitted answers
  const rawAnswers = {
    ...(formData?.fullFormData || {}),
    ...(formData?.answers || {}),
    ...(formData?.clientInfo || {})
  };

  const dynamicQuestionList = [];
  for (const [key, val] of Object.entries(rawAnswers)) {
    if (EXCLUDED_KEYS.has(key)) continue;
    if (val === null || val === undefined || val === '') continue;
    if (Array.isArray(val) && val.length === 0) continue;
    if (typeof val === 'string' && (val.trim() === '' || val.trim().toLowerCase() === 'n/a' || val.trim().toLowerCase() === 'none')) continue;
    if (typeof val === 'object' && !Array.isArray(val)) continue;

    const label = KNOWN_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    dynamicQuestionList.push({
      key,
      label,
      value: Array.isArray(val) ? val.join(', ') : (typeof val === 'boolean' ? (val ? 'Yes — Configured' : 'No') : String(val))
    });
  }

  // Location string
  const locationParts = [
    formData.streetAddress, 
    formData.district || formData.clientInfo?.city || formData.city, 
    formData.state, 
    formData.country || formData.clientInfo?.country || 'India'
  ].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'National / Global Digital Delivery';

  // Digital Footprint
  const socialStr = Array.isArray(formData.socialLinks) && formData.socialLinks.length > 0
    ? formData.socialLinks.join(' • ')
    : (formData.existingWebsite || formData.clientInfo?.existingWebsite || 'Direct Fresh Domain Deployment');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${brandName} Digital Architecture Blueprint — #${trackingId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&family=Outfit:wght@600;700;800;900&display=swap');

    @page {
      size: A4 portrait;
      margin: 10mm 12mm 12mm 12mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background: #f1f5f9;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.45;
    }

    .canvas-wrapper {
      max-width: 820px;
      margin: 0 auto;
      padding: 24px 28px;
      background: #ffffff;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      position: relative;
    }

    /* Top Floating Action Bar */
    .no-print-bar {
      background: #ffffff;
      color: #0f172a;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
      border-bottom: 1px solid #e2e8f0;
    }

    .print-btn {
      background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
      color: #ffffff;
      border: none;
      font-weight: 800;
      font-size: 12px;
      padding: 7px 16px;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 3px 10px rgba(124,58,237,0.3);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .print-btn:hover {
      opacity: 0.95;
    }

    /* Executive Clean Header (Corporate White + Purple Accent) */
    .header-box {
      border: 1.5px solid #e2e8f0;
      border-top: 4.5px solid #7c3aed;
      border-radius: 12px;
      padding: 16px 20px;
      background: #fbfbfe;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      page-break-inside: avoid;
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-logo {
      width: 52px;
      height: 52px;
      border-radius: 10px;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      padding: 4px;
      object-fit: contain;
    }

    .brand-title h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.4px;
      margin: 0;
      line-height: 1.1;
      color: #0f172a;
    }

    .brand-tagline {
      font-size: 9.5px;
      font-weight: 800;
      color: #7c3aed;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-top: 2px;
    }

    .brand-contact {
      font-size: 9px;
      color: #64748b;
      margin-top: 3px;
      line-height: 1.35;
    }

    .header-badge-zone {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    /* Official Website Verified Pill */
    .verified-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #ecfdf5;
      border: 1.5px solid #10b981;
      color: #047857;
      font-size: 9.5px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 3px 10px;
      border-radius: 999px;
    }

    .tracking-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.3px;
    }

    .meta-sub {
      font-size: 9px;
      color: #64748b;
    }

    /* Section Headings */
    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px;
      background: #f5f3ff;
      border-left: 3.5px solid #7c3aed;
      border-radius: 0 6px 6px 0;
      margin-top: 12px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }

    .section-head .title {
      font-family: 'Outfit', sans-serif;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #4c1d95;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .section-head .badge {
      font-size: 8.5px;
      font-weight: 800;
      color: #7c3aed;
      background: #ffffff;
      padding: 2px 7px;
      border-radius: 999px;
      border: 1px solid #ddd6fe;
    }

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
    }

    /* Modular Cards */
    .spec-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 7px;
      padding: 6px 9px;
      page-break-inside: avoid;
    }

    .spec-card .label {
      font-size: 8.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #64748b;
      margin-bottom: 2px;
    }

    .spec-card .val {
      font-size: 10.5px;
      font-weight: 700;
      color: #0f172a;
      word-break: break-word;
      line-height: 1.3;
    }

    .spec-card.highlight {
      background: #faf5ff;
      border-color: #d8b4fe;
    }

    .spec-card.highlight .val {
      color: #6b21a8;
      font-weight: 800;
    }

    .tag-pill {
      display: inline-block;
      background: #f3e8ff;
      color: #6b21a8;
      border: 1px solid #e9d5ff;
      font-size: 8.5px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      margin-right: 4px;
      margin-bottom: 2px;
    }

    /* Commercial Investment Banner (Crisp Clean Green) */
    .investment-box {
      background: #ecfdf5;
      border: 1.5px solid #a7f3d0;
      border-radius: 9px;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      page-break-inside: avoid;
    }

    .investment-box .title {
      font-size: 8.5px;
      color: #047857;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .investment-box .price {
      font-family: 'JetBrains Mono', monospace;
      font-size: 16px;
      font-weight: 900;
      color: #065f46;
      margin-top: 1px;
    }

    .investment-box .speed-tag {
      background: #ffffff;
      border: 1px solid #a7f3d0;
      color: #047857;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 9.5px;
      font-weight: 800;
      text-align: right;
    }

    /* Engineering Dispatch Box */
    .dispatch-box {
      background: #eef2ff;
      border: 1.5px solid #c7d2fe;
      border-radius: 8px;
      padding: 8px 12px;
      margin-top: 6px;
      page-break-inside: avoid;
    }

    .dispatch-box .dispatch-title {
      color: #3730a3;
      font-size: 9.5px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 2px;
    }

    .dispatch-box .dispatch-body {
      font-size: 10px;
      color: #1e1b4b;
      font-weight: 600;
      line-height: 1.4;
    }

    /* Deliverables & Drive Box */
    .deliverables-box {
      background: #faf5ff;
      border: 1.5px solid #d8b4fe;
      border-radius: 8px;
      padding: 8px 12px;
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      page-break-inside: avoid;
    }

    .deliverables-box .title {
      font-size: 10px;
      font-weight: 900;
      color: #581c87;
    }

    .deliverables-box .subtitle {
      font-size: 8.5px;
      color: #7e22ce;
    }

    .deliverables-box a {
      background: #7c3aed;
      color: #ffffff;
      text-decoration: none;
      font-weight: 800;
      font-size: 9.5px;
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
    }

    /* Question & Answer Table - Page break per row only to prevent blank space! */
    .qa-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #e2e8f0;
      border-radius: 7px;
      overflow: hidden;
      margin-top: 4px;
    }

    .qa-table tr {
      page-break-inside: avoid;
    }

    .qa-table tr:nth-child(even) {
      background: #f8fafc;
    }

    .qa-table tr:nth-child(odd) {
      background: #ffffff;
    }

    .qa-table td {
      padding: 5px 9px;
      font-size: 9.5px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: top;
    }

    .qa-table tr:last-child td {
      border-bottom: none;
    }

    .qa-table td.q-col {
      width: 38%;
      font-weight: 800;
      color: #475569;
      border-right: 1px solid #e2e8f0;
      background: rgba(248, 250, 252, 0.6);
    }

    .qa-table td.a-col {
      width: 62%;
      font-weight: 700;
      color: #0f172a;
    }

    /* Certificate & Legal Stamp Box */
    .certificate-zone {
      display: grid;
      grid-template-columns: 1.7fr 1fr;
      gap: 10px;
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1.5px dashed #cbd5e1;
      page-break-inside: avoid;
    }

    .legal-notice {
      font-size: 8px;
      color: #64748b;
      line-height: 1.35;
      background: #f8fafc;
      padding: 7px 9px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .legal-notice strong {
      color: #0f172a;
      display: block;
      margin-bottom: 2px;
    }

    .security-stamp-card {
      background: #faf5ff;
      border: 1.5px solid #d8b4fe;
      border-radius: 6px;
      padding: 7px 9px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .security-stamp-card .seal-title {
      font-size: 8px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b21a8;
    }

    .security-stamp-card .seal-badge {
      display: inline-block;
      margin-top: 3px;
      padding: 2px 7px;
      background: #6b21a8;
      color: #ffffff;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5px;
      font-weight: 800;
      border-radius: 4px;
    }

    /* Footer */
    .blueprint-footer {
      margin-top: 12px;
      border-top: 1.5px solid #7c3aed;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8px;
      color: #64748b;
      page-break-inside: avoid;
    }

    .blueprint-footer strong {
      color: #0f172a;
    }

    @media print {
      body {
        background: #ffffff;
      }
      .no-print-bar {
        display: none !important;
      }
      .canvas-wrapper {
        box-shadow: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <!-- Top Floating Controls for User Preview -->
  <div class="no-print-bar">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 14px;">📄</span>
      <div>
        <div style="font-size: 12px; font-weight: 800;">
          ${brandName} Project Blueprint • <span style="color: #7c3aed;">#${trackingId}</span>
        </div>
        <div style="font-size: 9px; color: #64748b;">
          Official Verified Digital Engineering Specification Document
        </div>
      </div>
    </div>
    <div style="display: flex; gap: 6px;">
      <button class="print-btn" onclick="window.print()">
        <span>🖨️</span>
        <span>Save / Print PDF</span>
      </button>
      <button class="print-btn" style="background: #e2e8f0; color: #334155; box-shadow: none;" onclick="window.close()">
        <span>✕</span>
        <span>Close</span>
      </button>
    </div>
  </div>

  <div class="canvas-wrapper">
    <!-- 1. Executive Corporate Header with Verified Pill -->
    <div class="header-box">
      <div class="header-brand">
        <img
          src="${fullLogoUrl}"
          alt="${brandName} Logo"
          class="brand-logo"
          onerror="this.style.display='none'"
        />
        <div class="brand-title">
          <h1>${brandName}</h1>
          <div class="brand-tagline">${tagline}</div>
          <div class="brand-contact">
            🌐 ${domain} • ✉️ ${supportEmail}<br />
            📞 ${phone} • 📱 WhatsApp: ${whatsapp} • 📍 HQ: ${officeLocation}
          </div>
        </div>
      </div>

      <div class="header-badge-zone">
        <div class="verified-pill">
          <span>✓</span>
          <span>WEBSITE VERIFIED SPEC</span>
        </div>
        <div class="tracking-code">#${trackingId}</div>
        <div class="meta-sub">Issued: ${issueDate}, ${issueTime} • Status: <strong style="color: #7c3aed;">${status}</strong></div>
      </div>
    </div>

    <!-- 2. Section 1: Client & Stakeholder Credentials -->
    <div class="section-head">
      <div class="title">
        <span>01.</span>
        <span>Client &amp; Stakeholder Credentials</span>
      </div>
      <div class="badge">Authorized Entity</div>
    </div>
    <div class="grid-3">
      <div class="spec-card">
        <div class="label">Client / Founder Name</div>
        <div class="val">${formData.fullName || formData.clientInfo?.ownerName || formData.clientInfo?.contactPerson || 'Valued Client'}</div>
      </div>
      <div class="spec-card highlight">
        <div class="label">Business / Brand Entity</div>
        <div class="val">${formData.businessName || formData.clientInfo?.businessName || formData.websiteTypeName || 'Private Enterprise Project'}</div>
      </div>
      <div class="spec-card">
        <div class="label">Direct Contact / WhatsApp</div>
        <div class="val">${formData.whatsappNumber || formData.mobileNumber || formData.clientInfo?.mobile || formData.clientInfo?.phone || 'Onboarding Record'}</div>
      </div>
      <div class="spec-card">
        <div class="label">Official Email Address</div>
        <div class="val">${formData.emailAddress || formData.clientInfo?.email || 'Onboarding Record'}</div>
      </div>
      <div class="spec-card">
        <div class="label">Territory &amp; Jurisdiction</div>
        <div class="val">${locationStr}</div>
      </div>
      <div class="spec-card">
        <div class="label">Digital Footprint / Existing URL</div>
        <div class="val" style="font-size: 9.5px;">${socialStr}</div>
      </div>
    </div>

    <!-- 3. Section 2: Architecture Scope & Tech Stack -->
    <div class="section-head">
      <div class="title">
        <span>02.</span>
        <span>Architectural Scope &amp; Tech Stack</span>
      </div>
      <div class="badge">Engineering Directives</div>
    </div>
    <div class="grid-4">
      <div class="spec-card">
        <div class="label">Industry Classification</div>
        <div class="val" style="text-transform: capitalize;">
          ${formData.selectedCategory || formData.websiteTypeName || formData.websiteType || 'Custom Solution'}
        </div>
      </div>
      <div class="spec-card">
        <div class="label">Base Layout Template</div>
        <div class="val">
          ${formData.appliedTemplateName || formData.templateName || 'Bespoke Glassmorphic Architecture'}
        </div>
      </div>
      <div class="spec-card highlight">
        <div class="label">Backend &amp; CMS Type</div>
        <div class="val">${formData.backendChoice || formData.backendRequirement || formData.adminPanelType || 'Full Dynamic Admin Panel'}</div>
      </div>
      <div class="spec-card">
        <div class="label">WhatsApp Lead Routing</div>
        <div class="val">${fmtArr(formData.whatsappIntegration || formData.whatsappOptions || 'Direct Instant Lead Routing')}</div>
      </div>
    </div>

    ${Array.isArray(formData.selectedPages) && formData.selectedPages.length > 0 ? `
    <div class="spec-card" style="margin-top: 6px;">
      <div class="label">Dedicated Website Pages Included (${formData.selectedPages.length} Modules)</div>
      <div style="margin-top: 3px;">
        ${formData.selectedPages.map((p) => `<span class="tag-pill">${p}</span>`).join('')}
      </div>
    </div>
    ` : ''}

    ${Array.isArray(formData.selectedFeatures) && formData.selectedFeatures.length > 0 ? `
    <div class="spec-card" style="margin-top: 6px;">
      <div class="label">Interactive Features &amp; Add-ons (${formData.selectedFeatures.length} Enabled)</div>
      <div style="margin-top: 3px;">
        ${formData.selectedFeatures.map((f) => `<span class="tag-pill" style="background: #e0f2fe; color: #0369a1; border-color: #bae6fd;">${f}</span>`).join('')}
      </div>
    </div>
    ` : ''}

    <!-- 4. Section 3: Comprehensive Questionnaire & Client Submitted Specifications -->
    ${dynamicQuestionList.length > 0 ? `
    <div class="section-head">
      <div class="title">
        <span>03.</span>
        <span>Submitted Questionnaire &amp; Design Choices</span>
      </div>
      <div class="badge">${dynamicQuestionList.length} Parameters Recorded</div>
    </div>
    <table class="qa-table">
      <tbody>
        ${dynamicQuestionList.map((item) => `
          <tr>
            <td class="q-col">${item.label}</td>
            <td class="a-col">${item.value}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ` : ''}

    <!-- 5. Section 4: UI/UX Design Tokens & Creative Direction -->
    <div class="section-head">
      <div class="title">
        <span>04.</span>
        <span>UI/UX Design Tokens &amp; Creative Assets</span>
      </div>
      <div class="badge">Visual Standards</div>
    </div>
    <div class="grid-3">
      <div class="spec-card">
        <div class="label">Visual Aesthetic Direction</div>
        <div class="val">${formData.visualStyle || formData.answers?.designStyle || 'Modern Glassmorphic'}</div>
      </div>
      <div class="spec-card">
        <div class="label">Color Scheme &amp; Theme Mode</div>
        <div class="val">${formData.colorMode || formData.answers?.colorMode || 'Adaptive Dual Light & Dark'}</div>
      </div>
      <div class="spec-card">
        <div class="label">Brand Color Accents</div>
        <div class="val" style="display: flex; align-items: center; gap: 5px;">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${formData.primaryColor || '#7c3aed'}; border: 1px solid #cbd5e1;"></span>
          <span>${formData.primaryColor || '#7c3aed'}</span>
          <span style="color: #cbd5e1;">|</span>
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${formData.secondaryColor || '#06b6d4'}; border: 1px solid #cbd5e1;"></span>
          <span>${formData.secondaryColor || '#06b6d4'}</span>
        </div>
      </div>
      <div class="spec-card">
        <div class="label">Brand Logo Asset Status</div>
        <div class="val">${formData.hasLogo || (formData.logoFile ? 'Uploaded Asset Attached' : 'Design Studio Standard')}</div>
      </div>
      <div class="spec-card">
        <div class="label">Product / Store Photos</div>
        <div class="val">${formData.hasPhotos || (formData.photosFiles?.length ? `${formData.photosFiles.length} Photos Provided` : 'AI Generated & Studio Curated')}</div>
      </div>
      <div class="spec-card">
        <div class="label">Copywriting &amp; Content Engine</div>
        <div class="val">${formData.hasContent || 'Professional Copywriting Included'}</div>
      </div>
    </div>

    <!-- 6. Section 5: Cloud Hosting, Domain & Edge Security -->
    <div class="section-head">
      <div class="title">
        <span>05.</span>
        <span>Cloud Hosting, Domain &amp; Infrastructure</span>
      </div>
      <div class="badge">Edge Architecture</div>
    </div>
    <div class="grid-3">
      <div class="spec-card">
        <div class="label">Domain Allocation</div>
        <div class="val">${formData.domainStatus || 'New Domain Managed Registration'}</div>
      </div>
      <div class="spec-card highlight">
        <div class="label">Preferred Domain URL</div>
        <div class="val">${formData.domainName ? `${formData.domainName}${formData.domainExtension || '.com'}` : 'To be confirmed during project kickoff'}</div>
      </div>
      <div class="spec-card">
        <div class="label">Cloud CDN &amp; SSL Security</div>
        <div class="val">${formData.hostingStatus || 'High-Speed NVMe Cloud + Enterprise SSL'}</div>
      </div>
    </div>

    <!-- 7. Section 6: Commercial Investment & Sprint Delivery -->
    <div class="section-head">
      <div class="title">
        <span>06.</span>
        <span>Commercial Investment &amp; Sprint Delivery</span>
      </div>
      <div class="badge">Certified Quota</div>
    </div>
    
    <div class="investment-box">
      <div>
        <div class="title">
          ${quotedAmount ? 'Official Quoted Project Investment' : 'Estimated Scope Baseline'}
        </div>
        <div class="price">
          ${quotedAmount || formattedPrice}
        </div>
      </div>
      <div class="speed-tag">
        <div>⚡ ${formData.expectedLaunchDate || formData.timeline || '48 - 72 Hours Rapid Sprint'}</div>
        <div style="font-size: 8px; color: #047857; margin-top: 1px;">Includes Free SSL + Deployment</div>
      </div>
    </div>

    <!-- Admin Engineering Status Dispatch Note (If Present) -->
    ${internalNotes ? `
    <div class="dispatch-box">
      <div class="dispatch-title">⚡ Engineering Team Status Dispatch &amp; Technical Directives:</div>
      <div class="dispatch-body">${internalNotes}</div>
    </div>
    ` : ''}

    <!-- Admin Attached Quotation PDF & Drive Assets Vault (If Present) -->
    ${(drivePdfLink || driveLink) ? `
    <div class="deliverables-box">
      <div>
        <div class="title">Official Project Deliverables &amp; Google Drive Workspace</div>
        <div class="subtitle">
          ${drivePdfLink ? '📄 Official Quotation PDF Attached' : ''} ${drivePdfLink && driveLink ? '•' : ''} ${driveLink ? '📁 Google Drive Workspace Linked' : ''}
        </div>
      </div>
      <div style="display: flex; gap: 6px;">
        ${drivePdfLink ? `<a href="${drivePdfLink}" target="_blank">View Quotation PDF &rarr;</a>` : ''}
        ${driveLink ? `<a href="${driveLink}" target="_blank" style="background: #4f46e5;">Open Drive Vault &rarr;</a>` : ''}
      </div>
    </div>
    ` : ''}

    ${(formData.additionalRequirements || formData.designInstructions || formData.referenceWebsites) ? `
    <!-- Special Directives & Client Notes -->
    <div class="section-head" style="margin-top: 10px;">
      <div class="title">
        <span>07.</span>
        <span>Special Directives &amp; Client Reference</span>
      </div>
    </div>
    <div class="spec-card" style="margin-top: 4px;">
      <div class="val" style="font-weight: 500; font-size: 9.5px; line-height: 1.4;">
        ${[formData.additionalRequirements, formData.designInstructions, formData.referenceWebsites ? `Reference URL: ${formData.referenceWebsites}` : ''].filter(Boolean).join(' • ')}
      </div>
    </div>
    ` : ''}

    <!-- 8. Sign-off, Legal NDA & Security Verification -->
    <div class="certificate-zone">
      <div class="legal-notice">
        <strong>🔒 Confidentiality &amp; Enterprise NDA Guarantee:</strong>
        This architectural blueprint is strictly confidential and protected under ${brandName}'s Non-Disclosure Agreement. All source code, UI design tokens, database schemas, and intellectual property transfer exclusively to the client upon milestone settlement.
      </div>
      <div class="security-stamp-card">
        <div class="seal-title">Engineering Desk Verification</div>
        <div class="seal-badge">VERIFIED &bull; WEBLETS CORE</div>
        <div style="font-size: 7.5px; color: #6b21a8; margin-top: 2px;">Lead Architect Desk &bull; Sprint 2026.4</div>
      </div>
    </div>

    <!-- 9. Corporate Footer -->
    <div class="blueprint-footer">
      <div>
        <strong>${brandName} Digital Engineering Systems</strong> • Web: https://${domain} • Email: ${supportEmail}
      </div>
      <div>
        Doc ID: <code style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #7c3aed;">${trackingId}</code> • Official Architecture Blueprint
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;
}

export function triggerDownloadBlueprintPdf(params) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    if (typeof window !== 'undefined' && window.alert) {
      alert('Please allow popups in your browser to view and download your Project Blueprint PDF.');
    }
    return false;
  }

  const html = generateProjectBlueprintHtml(params);
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  return true;
}
